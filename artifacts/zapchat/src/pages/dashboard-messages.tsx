import { Link } from "wouter";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

function EmptyState() {
  return (
    <Card className="rounded-2xl border-border shadow-sm">
      <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-5">
          <MessageSquare className="w-7 h-7" />
        </div>
        <h3 className="font-semibold text-lg mb-2">No messages yet</h3>
        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
          Once customers message you on WhatsApp, their conversations will appear here.
        </p>
        <Button className="rounded-xl mt-6" asChild>
          <Link href="/dashboard">Go to Overview</Link>
        </Button>
      </div>
    </Card>
  );
}

export default function MessagesPage() {
  return (
    <DashboardLayout
      title="Messages"
      description="Manage all your WhatsApp conversations."
      actions={
        <Button className="rounded-xl gap-2">
          <MessageSquare className="w-4 h-4" />
          Send Broadcast
        </Button>
      }
    >
      <EmptyState />
    </DashboardLayout>
  );
}
