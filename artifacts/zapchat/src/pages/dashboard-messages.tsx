import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useAuth } from "@/contexts/auth-context";
import { subscribeToCustomers, Customer } from "@/lib/firestore";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MessageSquare,
  Send,
  Search,
  Loader2,
  ArrowLeft,
} from "lucide-react";

interface Message {
  id: string;
  from?: string;
  fromName?: string;
  to?: string;
  text: string;
  direction: "incoming" | "outgoing";
  timestamp: string;
  receivedAt: number;
}

function formatTime(ts: string | number) {
  const ms = typeof ts === "string" ? parseInt(ts) * 1000 : ts;
  return new Date(ms).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getContactPhone(msg: Message) {
  return msg.direction === "incoming" ? msg.from || "" : msg.to || "";
}

function groupByContact(messages: Message[]): Map<string, Message[]> {
  const map = new Map<string, Message[]>();
  for (const msg of messages) {
    const phone = getContactPhone(msg);
    if (!phone) continue;
    if (!map.has(phone)) map.set(phone, []);
    map.get(phone)!.push(msg);
  }
  return map;
}

export default function MessagesPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
  const [sendText, setSendText] = useState("");
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Poll for messages
  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch(apiUrl("/whatsapp/messages"));
        if (!res.ok) return;
        const data = await res.json();
        setMessages(data.messages || []);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    }

    async function checkStatus() {
      try {
        const res = await fetch(apiUrl("/whatsapp/status"));
        if (res.ok) {
          const data = await res.json();
          setConfigured(data.configured);
        }
      } catch {}
    }

    checkStatus();
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  // Load customers for contact names
  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToCustomers(user.uid, setCustomers);
    return () => unsub();
  }, [user]);

  // Scroll to bottom when thread changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedPhone, messages]);

  function getDisplayName(phone: string) {
    const customer = customers.find((c) => c.phone.replace(/\D/g, "").includes(phone.slice(-8)));
    if (customer) return customer.name;
    const lastMsg = messages.find((m) => getContactPhone(m) === phone);
    return lastMsg?.fromName || `+${phone}`;
  }

  async function handleSend() {
    if (!selectedPhone || !sendText.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch(apiUrl("/whatsapp/send"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: selectedPhone, message: sendText.trim() }),
      });
      if (res.ok) {
        setSendText("");
        const data = await fetch(apiUrl("/whatsapp/messages"));
        const json = await data.json();
        setMessages(json.messages || []);
      }
    } finally {
      setSending(false);
    }
  }

  const contactMap = groupByContact(messages);
  const contacts = Array.from(contactMap.entries())
    .map(([phone, msgs]) => ({
      phone,
      name: getDisplayName(phone),
      lastMsg: msgs[0],
    }))
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search));

  const threadMessages = selectedPhone
    ? (contactMap.get(selectedPhone) || []).slice().reverse()
    : [];

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
    >
      {configured === false && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-700 dark:text-amber-400">
          <strong>WhatsApp not fully configured.</strong> Make sure your access token and phone number ID are set correctly, and your webhook is registered in Meta Developer Portal.
        </div>
      )}

      <div className="grid lg:grid-cols-[300px_1fr] gap-0 rounded-2xl border border-border overflow-hidden h-[calc(100vh-240px)] min-h-[500px]">
        {/* Contact list */}
        <div className={`flex flex-col border-r border-border bg-card ${selectedPhone ? "hidden lg:flex" : "flex"}`}>
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
                <p className="text-xs text-muted-foreground leading-relaxed">
                  When customers message you on WhatsApp, they'll appear here.
                </p>
              </div>
            ) : (
              contacts.map((contact) => (
                <button
                  key={contact.phone}
                  onClick={() => setSelectedPhone(contact.phone)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/50 border-b border-border/50 ${
                    selectedPhone === contact.phone ? "bg-primary/5 border-l-2 border-l-primary" : ""
                  }`}
                >
                  <Avatar className="w-9 h-9 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {contact.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{contact.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {contact.lastMsg?.direction === "outgoing" ? "You: " : ""}
                      {contact.lastMsg?.text}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatTime(contact.lastMsg?.timestamp || contact.lastMsg?.receivedAt || 0)}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Message thread */}
        <div className={`flex flex-col bg-card ${selectedPhone ? "flex" : "hidden lg:flex"}`}>
          {!selectedPhone ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-1">Select a conversation</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Choose a contact from the left to view your message history and reply.
              </p>
            </div>
          ) : (
            <>
              {/* Thread header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card shrink-0">
                <button
                  className="lg:hidden p-1 rounded-lg hover:bg-muted transition-colors"
                  onClick={() => setSelectedPhone(null)}
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {getDisplayName(selectedPhone).substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">{getDisplayName(selectedPhone)}</p>
                  <p className="text-xs text-muted-foreground">+{selectedPhone}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
                {threadMessages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-muted-foreground">No messages yet in this thread.</p>
                  </div>
                ) : (
                  threadMessages.map((msg) => (
                    <div
                      key={msg.id + msg.receivedAt}
                      className={`flex ${msg.direction === "outgoing" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                          msg.direction === "outgoing"
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-muted text-foreground rounded-bl-sm"
                        }`}
                      >
                        <p>{msg.text}</p>
                        <p className={`text-xs mt-1 ${
                          msg.direction === "outgoing" ? "text-primary-foreground/60" : "text-muted-foreground"
                        }`}>
                          {formatTime(msg.timestamp || msg.receivedAt)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-border bg-card shrink-0">
                <form
                  className="flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                >
                  <Input
                    value={sendText}
                    onChange={(e) => setSendText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 rounded-xl"
                    disabled={sending}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="rounded-xl shrink-0"
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
    </DashboardLayout>
  );
}
