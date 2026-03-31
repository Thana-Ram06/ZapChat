import { useState, useEffect } from "react";
import { Link } from "wouter";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useAuth } from "@/contexts/auth-context";
import { subscribeToCustomers, subscribeToAutomations } from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MessageSquare,
  Users,
  Zap,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";

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
    label: "Add Customers",
    description: "Build your contact list",
    href: "/dashboard/customers",
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [customerCount, setCustomerCount] = useState<number | null>(null);
  const [automationCount, setAutomationCount] = useState<number | null>(null);
  const [activeAutomations, setActiveAutomations] = useState(0);

  useEffect(() => {
    if (!user) return;
    const unsubC = subscribeToCustomers(user.uid, (data) => {
      setCustomerCount(data.length);
    });
    const unsubA = subscribeToAutomations(user.uid, (data) => {
      setAutomationCount(data.length);
      setActiveAutomations(data.filter((a) => a.active).length);
    });
    return () => {
      unsubC();
      unsubA();
    };
  }, [user]);

  const displayName = user?.displayName?.split(" ")[0] || "there";

  const stats = [
    {
      label: "Total Customers",
      value: customerCount === null ? null : customerCount,
      note: customerCount === 0 ? "Add your first customer" : `${customerCount} contact${customerCount !== 1 ? "s" : ""}`,
      icon: Users,
      href: "/dashboard/customers",
    },
    {
      label: "Active Automations",
      value: activeAutomations === null ? null : activeAutomations,
      note: automationCount === 0 ? "Create your first flow" : `${automationCount} flow${automationCount !== 1 ? "s" : ""} total`,
      icon: Zap,
      href: "/dashboard/automations",
    },
    {
      label: "Messages Sent",
      value: "—",
      note: "Connect WhatsApp to track",
      icon: MessageSquare,
      href: "/dashboard/messages",
    },
    {
      label: "Response Rate",
      value: "—",
      note: "Available after first chat",
      icon: BarChart3,
      href: "/dashboard/messages",
    },
  ];

  return (
    <DashboardLayout
      title={`Good day, ${displayName} 👋`}
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
          <Link key={stat.label} href={stat.href}>
            <Card className="rounded-2xl border-border shadow-sm hover:border-primary/30 transition-colors cursor-pointer group">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <stat.icon className="w-4 h-4" />
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight">
                  {stat.value === null
                    ? <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    : stat.value
                  }
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">{stat.note}</p>
              </CardContent>
            </Card>
          </Link>
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
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center flex-1">
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
