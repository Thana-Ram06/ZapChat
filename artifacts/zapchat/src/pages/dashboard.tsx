import { Link } from "wouter";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MessageSquare,
  Users,
  Zap,
  BarChart3,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const stats = [
  {
    label: "Total Messages Sent",
    value: "—",
    note: "Connect WhatsApp to see data",
    icon: MessageSquare,
  },
  {
    label: "Active Customers",
    value: "—",
    note: "Import contacts to get started",
    icon: Users,
  },
  {
    label: "Response Rate",
    value: "—",
    note: "Available after first conversation",
    icon: BarChart3,
  },
  {
    label: "Active Automations",
    value: "0",
    note: "Create your first flow",
    icon: Zap,
  },
];

const quickActions = [
  {
    icon: MessageSquare,
    label: "Send Broadcast",
    description: "Reach your customers at once",
    href: "/dashboard/messages",
  },
  {
    icon: Zap,
    label: "Create Automation Flow",
    description: "Set up auto replies and triggers",
    href: "/dashboard/automations",
  },
  {
    icon: Users,
    label: "Manage Templates",
    description: "Configure message templates",
    href: "/dashboard/settings",
  },
];

function EmptyConversations() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
        <MessageSquare className="w-6 h-6" />
      </div>
      <h3 className="font-semibold mb-1">No conversations yet</h3>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
        Connect your WhatsApp number to start receiving and managing messages here.
      </p>
      <Button variant="outline" size="sm" className="rounded-xl mt-4" asChild>
        <Link href="/dashboard/settings">Connect WhatsApp</Link>
      </Button>
    </div>
  );
}

export default function Dashboard() {
  return (
    <DashboardLayout
      title="Overview"
      description="Here's what's happening with your WhatsApp."
      actions={
        <>
          <Button variant="outline" className="rounded-xl">Export Report</Button>
          <Button className="rounded-xl gap-2" asChild>
            <Link href="/dashboard/messages">
              <MessageSquare className="w-4 h-4" />
              New Campaign
            </Link>
          </Button>
        </>
      }
    >
      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="rounded-2xl border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <stat.icon className="w-4 h-4" />
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1.5">{stat.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Conversations */}
        <Card className="lg:col-span-2 rounded-2xl border-border shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-muted/20 py-4">
            <CardTitle className="text-base font-semibold">Recent Conversations</CardTitle>
            <Button variant="ghost" size="sm" className="h-8 text-xs font-medium gap-1" asChild>
              <Link href="/dashboard/messages">
                View All
                <ArrowRight className="w-3 h-3" />
              </Link>
            </Button>
          </CardHeader>
          <EmptyConversations />
        </Card>

        {/* Quick Actions */}
        <Card className="rounded-2xl border-border shadow-sm flex flex-col">
          <CardHeader className="border-b border-border bg-muted/20 py-4">
            <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2 flex-1">
            {quickActions.map((action) => (
              <Link key={action.label} href={action.href}>
                <div className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-150 cursor-pointer group">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <action.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{action.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{action.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              </Link>
            ))}
          </CardContent>

          <div className="px-4 py-3 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-medium">System Status</div>
                <div className="text-xs text-muted-foreground">All systems operational</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
