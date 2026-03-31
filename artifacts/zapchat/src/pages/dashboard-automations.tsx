import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useAuth } from "@/contexts/auth-context";
import {
  addAutomation,
  deleteAutomation,
  toggleAutomation,
  subscribeToAutomations,
  Automation,
} from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Zap, Plus, Trash2, X, Loader2 } from "lucide-react";

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-5">
        <Zap className="w-7 h-7" />
      </div>
      <h3 className="font-semibold text-lg mb-2">No automation flows yet</h3>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
        Create your first automation to auto-reply when customers send a specific keyword.
      </p>
      <Button className="rounded-xl mt-6 gap-2" onClick={onAdd}>
        <Plus className="w-4 h-4" />
        Create Automation
      </Button>
    </div>
  );
}

function AddAutomationForm({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (name: string, trigger: string, reply: string) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState("");
  const [reply, setReply] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !trigger.trim() || !reply.trim()) return;
    setSaving(true);
    await onSave(name.trim(), trigger.trim(), reply.trim());
    setSaving(false);
    onClose();
  }

  return (
    <Card className="rounded-2xl border-border shadow-sm mb-6">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
        <CardTitle className="text-base font-semibold">New Automation Flow</CardTitle>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </CardHeader>
      <CardContent className="pt-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="aname">Flow Name</Label>
            <Input
              id="aname"
              placeholder='e.g. "Order Status Reply"'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="atrigger">
              Trigger Keyword
              <span className="text-xs text-muted-foreground ml-2">When a customer sends this word</span>
            </Label>
            <Input
              id="atrigger"
              placeholder='e.g. "ORDER STATUS" or "HELLO"'
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              className="rounded-xl"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="areply">
              Auto Reply Message
              <span className="text-xs text-muted-foreground ml-2">What ZapChat will reply automatically</span>
            </Label>
            <Textarea
              id="areply"
              placeholder="e.g. Hi! Thanks for reaching out. Your order is being processed and will be delivered within 3-5 business days."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              className="rounded-xl resize-none"
              rows={3}
              required
            />
          </div>
          <div className="flex gap-3">
            <Button type="submit" className="rounded-xl gap-2" disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Flow
            </Button>
            <Button type="button" variant="outline" className="rounded-xl" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default function AutomationsPage() {
  const { user } = useAuth();
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToAutomations(user.uid, (data) => {
      setAutomations(data);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  async function handleAdd(name: string, trigger: string, reply: string) {
    if (!user) return;
    await addAutomation(user.uid, { name, trigger, reply });
  }

  async function handleToggle(automation: Automation) {
    if (!user) return;
    setTogglingId(automation.id);
    await toggleAutomation(user.uid, automation.id, !automation.active);
    setTogglingId(null);
  }

  async function handleDelete(automationId: string) {
    if (!user) return;
    setDeletingId(automationId);
    await deleteAutomation(user.uid, automationId);
    setDeletingId(null);
  }

  const activeCount = automations.filter((a) => a.active).length;

  return (
    <DashboardLayout
      title="Automations"
      description={`${activeCount} active flow${activeCount !== 1 ? "s" : ""} running.`}
      actions={
        !showForm && (
          <Button className="rounded-xl gap-2" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" />
            New Flow
          </Button>
        )
      }
    >
      {showForm && (
        <AddAutomationForm
          onClose={() => setShowForm(false)}
          onSave={handleAdd}
        />
      )}

      <Card className="rounded-2xl border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : automations.length === 0 ? (
          <EmptyState onAdd={() => setShowForm(true)} />
        ) : (
          <div>
            <div className="px-6 py-4 border-b border-border bg-muted/20 flex items-center justify-between">
              <p className="text-sm font-semibold">All Flows</p>
              <p className="text-xs text-muted-foreground">{automations.length} total · {activeCount} active</p>
            </div>
            <div className="divide-y divide-border">
              {automations.map((automation) => (
                <div key={automation.id} className="flex items-start gap-4 px-6 py-5 hover:bg-muted/20 transition-colors">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    automation.active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  }`}>
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{automation.name}</p>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          automation.active
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {automation.active ? "Active" : "Paused"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      <span className="font-medium text-foreground/70">Trigger:</span> "{automation.trigger}"
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      <span className="font-medium text-foreground/70">Reply:</span> {automation.reply}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg h-8 text-xs"
                      disabled={togglingId === automation.id}
                      onClick={() => handleToggle(automation)}
                    >
                      {togglingId === automation.id
                        ? <Loader2 className="w-3 h-3 animate-spin" />
                        : automation.active ? "Pause" : "Activate"
                      }
                    </Button>
                    <button
                      onClick={() => handleDelete(automation.id)}
                      disabled={deletingId === automation.id}
                      className="text-muted-foreground/50 hover:text-destructive transition-colors p-1.5 rounded-lg hover:bg-destructive/10"
                    >
                      {deletingId === automation.id
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Trash2 className="w-4 h-4" />
                      }
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}
