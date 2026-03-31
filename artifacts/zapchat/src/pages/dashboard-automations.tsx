import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap, Plus } from "lucide-react";

function EmptyState() {
  return (
    <Card className="rounded-2xl border-border shadow-sm">
      <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-5">
          <Zap className="w-7 h-7" />
        </div>
        <h3 className="font-semibold text-lg mb-2">No automation flows yet</h3>
        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
          Create your first automation flow to start sending auto replies and triggered messages to your customers.
        </p>
        <Button className="rounded-xl mt-6 gap-2">
          <Plus className="w-4 h-4" />
          Create Automation Flow
        </Button>
      </div>
    </Card>
  );
}

export default function AutomationsPage() {
  return (
    <DashboardLayout
      title="Automations"
      description="Build and manage your message automation flows."
      actions={
        <Button className="rounded-xl gap-2">
          <Plus className="w-4 h-4" />
          New Flow
        </Button>
      }
    >
      <EmptyState />
    </DashboardLayout>
  );
}
