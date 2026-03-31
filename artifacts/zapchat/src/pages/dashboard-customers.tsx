import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useAuth } from "@/contexts/auth-context";
import { addCustomer, deleteCustomer, subscribeToCustomers, Customer } from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Plus, Trash2, X, Loader2 } from "lucide-react";

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-5">
        <Users className="w-7 h-7" />
      </div>
      <h3 className="font-semibold text-lg mb-2">No customers yet</h3>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
        Add your first customer manually or connect WhatsApp to import contacts automatically.
      </p>
      <Button className="rounded-xl mt-6 gap-2" onClick={onAdd}>
        <Plus className="w-4 h-4" />
        Add Customer
      </Button>
    </div>
  );
}

function AddCustomerForm({ onClose, onSave }: { onClose: () => void; onSave: (name: string, phone: string) => Promise<void> }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setSaving(true);
    await onSave(name.trim(), phone.trim());
    setSaving(false);
    onClose();
  }

  return (
    <Card className="rounded-2xl border-border shadow-sm mb-6">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
        <CardTitle className="text-base font-semibold">Add Customer</CardTitle>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </CardHeader>
      <CardContent className="pt-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cname">Full Name</Label>
              <Input
                id="cname"
                placeholder="e.g. Sarah Jenkins"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cphone">WhatsApp Number</Label>
              <Input
                id="cphone"
                placeholder="e.g. +1 555 0123"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-xl"
                required
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button type="submit" className="rounded-xl gap-2" disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Customer
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

export default function CustomersPage() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToCustomers(user.uid, (data) => {
      setCustomers(data);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  async function handleAdd(name: string, phone: string) {
    if (!user) return;
    await addCustomer(user.uid, { name, phone });
  }

  async function handleDelete(customerId: string) {
    if (!user) return;
    setDeletingId(customerId);
    await deleteCustomer(user.uid, customerId);
    setDeletingId(null);
  }

  return (
    <DashboardLayout
      title="Customers"
      description={`${customers.length} contact${customers.length !== 1 ? "s" : ""} in your list.`}
      actions={
        !showForm && (
          <Button className="rounded-xl gap-2" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" />
            Add Customer
          </Button>
        )
      }
    >
      {showForm && (
        <AddCustomerForm
          onClose={() => setShowForm(false)}
          onSave={handleAdd}
        />
      )}

      <Card className="rounded-2xl border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : customers.length === 0 ? (
          <EmptyState onAdd={() => setShowForm(true)} />
        ) : (
          <div>
            <div className="px-6 py-4 border-b border-border bg-muted/20 flex items-center justify-between">
              <p className="text-sm font-semibold">All Customers</p>
              <p className="text-xs text-muted-foreground">{customers.length} total</p>
            </div>
            <div className="divide-y divide-border">
              {customers.map((customer) => (
                <div key={customer.id} className="flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors">
                  <Avatar className="w-9 h-9 rounded-full shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {customer.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{customer.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{customer.phone}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(customer.id)}
                    disabled={deletingId === customer.id}
                    className="text-muted-foreground/50 hover:text-destructive transition-colors p-1.5 rounded-lg hover:bg-destructive/10"
                  >
                    {deletingId === customer.id
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Trash2 className="w-4 h-4" />
                    }
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}
