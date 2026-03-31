import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Upload } from "lucide-react";

function EmptyState() {
  return (
    <Card className="rounded-2xl border-border shadow-sm">
      <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-5">
          <Users className="w-7 h-7" />
        </div>
        <h3 className="font-semibold text-lg mb-2">No customers yet</h3>
        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
          Import your contacts from a CSV file or connect your WhatsApp to start building your customer list.
        </p>
        <Button className="rounded-xl mt-6 gap-2">
          <Upload className="w-4 h-4" />
          Import Contacts
        </Button>
      </div>
    </Card>
  );
}

export default function CustomersPage() {
  return (
    <DashboardLayout
      title="Customers"
      description="View and manage your WhatsApp contacts."
      actions={
        <Button variant="outline" className="rounded-xl gap-2">
          <Upload className="w-4 h-4" />
          Import CSV
        </Button>
      }
    >
      <EmptyState />
    </DashboardLayout>
  );
}
