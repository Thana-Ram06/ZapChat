import { useState, useEffect, useRef, useCallback } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useAuth } from "@/contexts/auth-context";
import {
  subscribeToCustomers,
  subscribeToMessages,
  saveMessage,
  Customer,
  ChatMessage,
} from "@/lib/firestore";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  MessageSquare,
  Send,
  Search,
  Loader2,
  ArrowLeft,
  Plus,
  Check,
  CheckCheck,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatTime(ts: string | number) {
  const ms =
    typeof ts === "string"
      ? ts.length <= 10
        ? parseInt(ts) * 1000
        : parseInt(ts)
      : ts;
  if (!ms || isNaN(ms)) return "";
  const d = new Date(ms);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays === 0) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return d.toLocaleDateString([], { weekday: "short" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function MessagesPage() {
  const { user } = useAuth();

  // State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
  const [sendText, setSendText] = useState("");
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [newPhoneError, setNewPhoneError] = useState("");

  // Refs
  const bottomRef = useRef<HTMLDivElement>(null);
  const seenApiIds = useRef(new Set<string>());
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Check WhatsApp status ──────────────────────────────────────────────
  useEffect(() => {
    fetch(apiUrl("/whatsapp/status"))
      .then((r) => r.json())
      .then((d) => setConfigured(d.configured))
      .catch(() => setConfigured(false));
  }, []);

  // ── Subscribe to Firestore messages (real-time) ────────────────────────
  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToMessages(user.uid, (msgs) => {
      setMessages(msgs);
      setLoading(false);
      // Mark all Firestore message IDs as seen so we don't re-save them
      msgs.forEach((m) => seenApiIds.current.add(m.id));
    });
    return () => unsub();
  }, [user]);

  // ── Subscribe to customers ─────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToCustomers(user.uid, setCustomers);
    return () => unsub();
  }, [user]);

  // ── Poll API for incoming webhook messages → save to Firestore ─────────
  const syncApiMessages = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(apiUrl("/whatsapp/messages"));
      if (!res.ok) return;
      const data = await res.json();
      const apiMsgs: any[] = data.messages || [];
      for (const msg of apiMsgs) {
        if (seenApiIds.current.has(msg.id)) continue;
        seenApiIds.current.add(msg.id);
        const phone = msg.direction === "incoming" ? msg.from : msg.to;
        if (!phone) continue;
        await saveMessage(user.uid, {
          id: msg.id,
          phone: normalizePhone(phone),
          text: msg.text,
          direction: msg.direction,
          fromName: msg.fromName,
          status: "sent",
          timestamp: msg.timestamp || String(Math.floor(Date.now() / 1000)),
        });
      }
    } catch {}
  }, [user]);

  useEffect(() => {
    syncApiMessages();
    const interval = setInterval(syncApiMessages, 5000);
    return () => clearInterval(interval);
  }, [syncApiMessages]);

  // ── Auto-scroll on new messages in thread ─────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedPhone]);

  // ── Focus input when thread opens ─────────────────────────────────────
  useEffect(() => {
    if (selectedPhone) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [selectedPhone]);

  // ── Helpers ──────────────────────────────────────────────────────────
  function getDisplayName(phone: string) {
    const normalized = normalizePhone(phone);
    const customer = customers.find((c) =>
      normalizePhone(c.phone).endsWith(normalized.slice(-8))
    );
    if (customer) return customer.name;
    const msg = messages.find((m) => normalizePhone(m.phone) === normalized && m.fromName);
    return msg?.fromName || `+${phone}`;
  }

  // ── Send message ──────────────────────────────────────────────────────
  async function handleSend() {
    if (!selectedPhone || !sendText.trim() || sending) return;
    const text = sendText.trim();
    setSendText("");
    setSending(true);

    try {
      const res = await fetch(apiUrl("/whatsapp/send"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: selectedPhone, message: text }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errMsg = data?.error?.message || data?.error || "Failed to send message";
        toast.error("Message failed", { description: errMsg });
        setSending(false);
        return;
      }

      // Save to Firestore immediately
      if (user) {
        const msgId = data.messageId || crypto.randomUUID();
        seenApiIds.current.add(msgId);
        await saveMessage(user.uid, {
          id: msgId,
          phone: normalizePhone(selectedPhone),
          text,
          direction: "outgoing",
          status: "sent",
          timestamp: String(Math.floor(Date.now() / 1000)),
        });
      }

      toast.success("Message sent");
    } catch (err: any) {
      toast.error("Message failed", { description: err?.message || "Network error" });
    } finally {
      setSending(false);
    }
  }

  // ── New conversation ──────────────────────────────────────────────────
  async function handleNewChat() {
    const phone = normalizePhone(newPhone);
    if (!phone || phone.length < 7) {
      setNewPhoneError("Enter a valid phone number with country code (e.g. 919876543210)");
      return;
    }
    setNewPhoneError("");
    setNewChatOpen(false);
    setNewPhone("");
    setSelectedPhone(phone);
  }

  // ── Build contact list ─────────────────────────────────────────────────
  const contactMap = new Map<string, ChatMessage[]>();
  for (const msg of messages) {
    const phone = normalizePhone(msg.phone);
    if (!phone) continue;
    if (!contactMap.has(phone)) contactMap.set(phone, []);
    contactMap.get(phone)!.push(msg);
  }

  const contacts = Array.from(contactMap.entries())
    .map(([phone, msgs]) => ({
      phone,
      name: getDisplayName(phone),
      lastMsg: msgs[msgs.length - 1],
      unread: msgs.filter((m) => m.direction === "incoming").length,
    }))
    .filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search)
    )
    .sort(
      (a, b) =>
        (Number(b.lastMsg?.timestamp) || 0) - (Number(a.lastMsg?.timestamp) || 0)
    );

  const threadMessages = selectedPhone
    ? (contactMap.get(normalizePhone(selectedPhone)) || [])
    : [];

  // ── Status icon ───────────────────────────────────────────────────────
  function StatusIcon({ status }: { status: ChatMessage["status"] }) {
    if (status === "read")
      return <CheckCheck className="w-3.5 h-3.5 text-blue-400" />;
    if (status === "delivered")
      return <CheckCheck className="w-3.5 h-3.5 text-primary-foreground/60" />;
    return <Check className="w-3.5 h-3.5 text-primary-foreground/60" />;
  }

  // ── Loading ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <DashboardLayout title="Messages" description="Manage your WhatsApp conversations.">
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Messages"
      description="All your WhatsApp conversations in one place."
      actions={
        <Button
          size="sm"
          className="rounded-xl gap-2"
          onClick={() => setNewChatOpen(true)}
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      }
    >
      {/* Warning banner */}
      {configured === false && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-700 dark:text-amber-400 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>
            <strong>WhatsApp not connected.</strong> Go to Settings and verify your access
            token and phone number ID.
          </span>
        </div>
      )}

      {/* Chat container */}
      <div className="grid lg:grid-cols-[300px_1fr] gap-0 rounded-2xl border border-border overflow-hidden h-[calc(100vh-260px)] min-h-[500px]">

        {/* ── Contact list ───────────────────────────────────────────── */}
        <div
          className={`flex flex-col border-r border-border bg-card ${
            selectedPhone ? "hidden lg:flex" : "flex"
          }`}
        >
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 rounded-xl h-9 text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {contacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <p className="font-medium text-sm mb-1">No conversations yet</p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  When customers message you on WhatsApp, they'll appear here.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl gap-2 text-xs"
                  onClick={() => setNewChatOpen(true)}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Start a conversation
                </Button>
              </div>
            ) : (
              contacts.map((contact) => {
                const isActive = selectedPhone
                  ? normalizePhone(selectedPhone) === contact.phone
                  : false;
                return (
                  <button
                    key={contact.phone}
                    onClick={() => setSelectedPhone(contact.phone)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/50 border-b border-border/50 ${
                      isActive
                        ? "bg-primary/5 border-l-2 border-l-primary"
                        : ""
                    }`}
                  >
                    <Avatar className="w-10 h-10 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {contact.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="font-medium text-sm truncate">{contact.name}</p>
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {formatTime(contact.lastMsg?.timestamp || "")}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {contact.lastMsg?.direction === "outgoing" ? "You: " : ""}
                        {contact.lastMsg?.text}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ── Message thread ────────────────────────────────────────── */}
        <div
          className={`flex flex-col bg-[hsl(var(--card))] ${
            selectedPhone ? "flex" : "hidden lg:flex"
          }`}
        >
          {!selectedPhone ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-1">Select a conversation</h3>
              <p className="text-sm text-muted-foreground max-w-xs mb-4">
                Choose a contact from the left to view messages and reply.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl gap-2"
                onClick={() => setNewChatOpen(true)}
              >
                <Plus className="w-4 h-4" />
                New Conversation
              </Button>
            </div>
          ) : (
            <>
              {/* Thread header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card shrink-0">
                <button
                  className="lg:hidden p-1.5 rounded-lg hover:bg-muted transition-colors"
                  onClick={() => setSelectedPhone(null)}
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <Avatar className="w-9 h-9">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                    {getDisplayName(selectedPhone).substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {getDisplayName(selectedPhone)}
                  </p>
                  <p className="text-xs text-muted-foreground">+{selectedPhone}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs text-muted-foreground">WhatsApp</span>
                </div>
              </div>

              {/* Messages area */}
              <div
                className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5"
                style={{
                  background:
                    "repeating-linear-gradient(135deg, transparent, transparent 20px, hsl(var(--muted)/0.05) 20px, hsl(var(--muted)/0.05) 40px)",
                }}
              >
                {threadMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                    <p className="text-sm text-muted-foreground">
                      No messages yet. Say hello!
                    </p>
                  </div>
                ) : (
                  threadMessages.map((msg, i) => {
                    const showDate =
                      i === 0 ||
                      formatTime(threadMessages[i - 1].timestamp) !==
                        formatTime(msg.timestamp);
                    return (
                      <div key={msg.id}>
                        {showDate && i === 0 && (
                          <div className="flex justify-center mb-3">
                            <span className="px-3 py-1 rounded-full bg-muted text-[10px] text-muted-foreground">
                              {new Date(
                                Number(msg.timestamp) * 1000
                              ).toLocaleDateString([], {
                                weekday: "long",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        )}
                        <div
                          className={`flex ${
                            msg.direction === "outgoing"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[72%] sm:max-w-[60%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed shadow-sm ${
                              msg.direction === "outgoing"
                                ? "bg-primary text-primary-foreground rounded-br-sm"
                                : "bg-card text-foreground rounded-bl-sm border border-border/50"
                            }`}
                          >
                            <p className="break-words">{msg.text}</p>
                            <div
                              className={`flex items-center justify-end gap-1 mt-1 ${
                                msg.direction === "outgoing"
                                  ? "text-primary-foreground/60"
                                  : "text-muted-foreground"
                              }`}
                            >
                              <span className="text-[10px]">
                                {formatTime(msg.timestamp)}
                              </span>
                              {msg.direction === "outgoing" && (
                                <StatusIcon status={msg.status} />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input bar */}
              <div className="px-4 py-3 border-t border-border bg-card shrink-0">
                <form
                  className="flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                >
                  <Input
                    ref={inputRef}
                    value={sendText}
                    onChange={(e) => setSendText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 rounded-xl"
                    disabled={sending}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="rounded-xl shrink-0 w-10 h-10"
                    disabled={!sendText.trim() || sending}
                  >
                    {sending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── New Conversation Dialog ────────────────────────────────── */}
      <Dialog open={newChatOpen} onOpenChange={setNewChatOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>New Conversation</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">
              Enter the WhatsApp number with country code (no + or spaces).
            </p>
            <div className="space-y-1">
              <Input
                placeholder="e.g. 919876543210"
                value={newPhone}
                onChange={(e) => {
                  setNewPhone(e.target.value);
                  setNewPhoneError("");
                }}
                className="rounded-xl"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleNewChat();
                }}
                autoFocus
              />
              {newPhoneError && (
                <p className="text-xs text-destructive">{newPhoneError}</p>
              )}
            </div>

            {/* Quick-pick from customers */}
            {customers.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2 font-medium">
                  Or pick a customer:
                </p>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {customers.map((c) => (
                    <button
                      key={c.id}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted text-left transition-colors"
                      onClick={() => {
                        const phone = normalizePhone(c.phone);
                        setNewChatOpen(false);
                        setNewPhone("");
                        setNewPhoneError("");
                        setSelectedPhone(phone);
                      }}
                    >
                      <Avatar className="w-7 h-7">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {c.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.phone}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => {
                setNewChatOpen(false);
                setNewPhone("");
                setNewPhoneError("");
              }}
            >
              Cancel
            </Button>
            <Button className="rounded-xl" onClick={handleNewChat}>
              Open Chat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
