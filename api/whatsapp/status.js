export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const configured = !!(accessToken && phoneNumberId);

  res.json({
    configured,
    phoneNumberId: phoneNumberId ? `***${phoneNumberId.slice(-4)}` : null,
    messageCount: 0,
  });
}
