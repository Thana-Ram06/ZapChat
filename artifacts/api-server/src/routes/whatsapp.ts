import { Router } from "express";
import { logger } from "../lib/logger";

const router = Router();

const VERIFY_TOKEN =
  process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || "zapchat_verify_2024";

function getCredentials() {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN || "";
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || "";

  if (!accessToken) {
    logger.warn("WHATSAPP_ACCESS_TOKEN is not set");
  }
  if (!phoneNumberId) {
    logger.warn("WHATSAPP_PHONE_NUMBER_ID is not set");
  }

  return { accessToken, phoneNumberId };
}

export interface StoredMessage {
  id: string;
  from?: string;
  fromName?: string;
  to?: string;
  text: string;
  direction: "incoming" | "outgoing";
  timestamp: string;
  receivedAt: number;
}

const messageStore: StoredMessage[] = [];
const MAX_MESSAGES = 500;

// ─── GET /api/whatsapp/status ─────────────────────────────────────────────
router.get("/status", (_req, res) => {
  const { accessToken, phoneNumberId } = getCredentials();
  const configured = !!(accessToken && phoneNumberId);

  logger.info(
    { configured, phoneNumberId: phoneNumberId ? `***${phoneNumberId.slice(-4)}` : null },
    "WhatsApp status check"
  );

  res.json({
    configured,
    phoneNumberId: phoneNumberId ? `***${phoneNumberId.slice(-4)}` : null,
    messageCount: messageStore.length,
  });
});

// ─── GET /api/whatsapp/webhook  (Meta verification) ───────────────────────
router.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    logger.info("WhatsApp webhook verified successfully");
    res.status(200).send(challenge);
  } else {
    logger.warn({ mode, token }, "Webhook verification failed — token mismatch");
    res.status(403).send("Forbidden");
  }
});

// ─── POST /api/whatsapp/webhook  (Receive incoming messages) ─────────────
router.post("/webhook", (req, res) => {
  const body = req.body;

  if (body.object === "whatsapp_business_account") {
    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        if (change.field === "messages") {
          const value = change.value;
          const contacts: any[] = value?.contacts || [];
          const msgs: any[] = value?.messages || [];

          for (const msg of msgs) {
            const contact = contacts.find((c: any) => c.wa_id === msg.from);
            const stored: StoredMessage = {
              id: msg.id,
              from: msg.from,
              fromName: contact?.profile?.name || msg.from,
              text: msg.text?.body || `[${msg.type}]`,
              direction: "incoming",
              timestamp: msg.timestamp,
              receivedAt: Date.now(),
            };
            messageStore.unshift(stored);
            if (messageStore.length > MAX_MESSAGES) messageStore.pop();
            logger.info({ from: msg.from, text: stored.text }, "Incoming WhatsApp message");
          }
        }
      }
    }
  }

  res.status(200).send("OK");
});

// ─── GET /api/whatsapp/messages  (Frontend polling) ──────────────────────
router.get("/messages", (_req, res) => {
  res.json({ messages: messageStore });
});

// ─── POST /api/whatsapp/send  (Send a message) ────────────────────────────
router.post("/send", async (req, res) => {
  const { to, message } = req.body as { to: string; message: string };

  if (!to || !message) {
    return res.status(400).json({ error: "Missing 'to' or 'message'" });
  }

  const { accessToken, phoneNumberId } = getCredentials();

  if (!accessToken || !phoneNumberId) {
    logger.error("Cannot send message — WhatsApp credentials missing");
    return res.status(500).json({
      error: "WhatsApp credentials not configured. Check WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID in Replit Secrets.",
    });
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to,
          type: "text",
          text: { preview_url: false, body: message },
        }),
      }
    );

    const data = (await response.json()) as any;

    if (!response.ok) {
      logger.error({ status: response.status, data }, "WhatsApp send failed");
      return res.status(response.status).json(data);
    }

    const sent: StoredMessage = {
      id: data.messages?.[0]?.id || crypto.randomUUID(),
      to,
      text: message,
      direction: "outgoing",
      timestamp: Math.floor(Date.now() / 1000).toString(),
      receivedAt: Date.now(),
    };
    messageStore.unshift(sent);

    logger.info({ to, message }, "WhatsApp message sent successfully");
    res.json({ success: true, messageId: sent.id });
  } catch (err) {
    logger.error(err, "Failed to send WhatsApp message");
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
