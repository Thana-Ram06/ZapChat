import { Link, useLocation } from "wouter";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  MessageSquare, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Bell,
  Search,
  ArrowUpRight,
  Zap,
  MoreVertical,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const [location] = useLocation();

  const navItems = [
    { icon: BarChart3, label: "Overview", href: "/dashboard", active: true },
    { icon: MessageSquare, label: "Messages", href: "/dashboard/messages" },
    { icon: Users, label: "Customers", href: "/dashboard/customers" },
    { icon: Zap, label: "Automations", href: "/dashboard/automations" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ];

  const recentMessages = [
    { id: "1", customer: "Sarah Jenkins", phone: "+1 (555) 0123", message: "Is my order #4892 shipped?", time: "2m ago", status: "unread" },
    { id: "2", customer: "David Chen", phone: "+1 (555) 0198", message: "Thanks for the quick response!", time: "15m ago", status: "resolved" },
    { id: "3", customer: "Elena Rodriguez", phone: "+1 (555) 0245", message: "Do you ship to Spain?", time: "1h ago", status: "unread" },
    { id: "4", customer: "Marcus Johnson", phone: "+1 (555) 0392", message: "I need to change my address", time: "2h ago", status: "pending" },
    { id: "5", customer: "Emma Wilson", phone: "+1 (555) 0487", message: "Perfect, I will buy it now.", time: "3h ago", status: "resolved" },
  ];

  return (
    <div className="min-h-[100dvh] flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-sidebar-border bg-sidebar hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded-md overflow-hidden shrink-0">
              <img src="/zapchat-logo.jpeg" alt="ZapChat" className="w-full h-full object-cover scale-[1.32]" />
            </div>
            <span className="font-serif text-xl tracking-tight">ZapChat</span>
          </Link>
        </div>
        
        <div className="flex-1 py-6 px-4">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href}>
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                  item.active 
                    ? "bg-sidebar-primary/10 text-sidebar-primary" 
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                }`}>
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar className="w-8 h-8 rounded-md">
              <AvatarFallback className="rounded-md bg-primary/20 text-primary">JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <div className="text-sm font-medium truncate">John Doe</div>
              <div className="text-xs text-sidebar-foreground/60 truncate">Bloom Cosmetics</div>
            </div>
            <button className="text-sidebar-foreground/50 hover:text-sidebar-foreground">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 border-b border-border bg-background/95 backdrop-blur flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="relative w-64 hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search customers or messages..." 
                className="pl-9 bg-muted/50 border-transparent focus-visible:bg-background h-9 rounded-lg"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative rounded-full">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
            </Button>
            <ThemeToggle />
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-4 md:p-8 overflow-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
              <p className="text-muted-foreground mt-1">Here's what's happening with your WhatsApp today.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-xl">Export Report</Button>
              <Button className="rounded-xl gap-2">
                <MessageSquare className="w-4 h-4" />
                New Campaign
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <Card className="rounded-2xl border-card-border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Messages Sent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">24,593</div>
                <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" />
                  +12.5% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl border-card-border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1,832</div>
                <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" />
                  +4.1% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-card-border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Response Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">98.2%</div>
                <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" />
                  +1.2% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-card-border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Revenue Attributed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$12,450</div>
                <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" />
                  +24.8% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Table Area */}
            <Card className="lg:col-span-2 rounded-2xl border-card-border shadow-sm overflow-hidden flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-muted/20 py-4">
                <CardTitle className="text-base font-semibold">Recent Conversations</CardTitle>
                <Button variant="ghost" size="sm" className="h-8 text-xs font-medium">View All</Button>
              </CardHeader>
              <div className="p-0 overflow-x-auto flex-1">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentMessages.map((msg) => (
                      <TableRow key={msg.id} className="hover:bg-muted/50 cursor-pointer">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8 rounded-full border border-border">
                              <AvatarFallback className="text-xs">{msg.customer.substring(0,2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">{msg.customer}</div>
                              <div className="text-xs text-muted-foreground">{msg.phone}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate text-sm">
                          {msg.message}
                        </TableCell>
                        <TableCell>
                          {msg.status === 'unread' && <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Unread</Badge>}
                          {msg.status === 'pending' && <Badge variant="outline" className="text-muted-foreground">Pending</Badge>}
                          {msg.status === 'resolved' && <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Resolved</Badge>}
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">
                          {msg.time}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>

            {/* Quick Actions / Activity */}
            <Card className="rounded-2xl border-card-border shadow-sm flex flex-col">
              <CardHeader className="border-b border-border bg-muted/20 py-4">
                <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <Button variant="outline" className="w-full justify-start h-12 rounded-xl" asChild>
                  <Link href="/dashboard/broadcast">
                    <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                    Send Broadcast
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start h-12 rounded-xl" asChild>
                  <Link href="/dashboard/flows">
                    <Zap className="w-4 h-4 mr-2 text-primary" />
                    Create Automation Flow
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start h-12 rounded-xl" asChild>
                  <Link href="/dashboard/templates">
                    <MessageSquare className="w-4 h-4 mr-2 text-muted-foreground" />
                    Manage Templates
                  </Link>
                </Button>
              </CardContent>
              
              <div className="px-4 py-3 border-t border-border mt-auto">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">System Status</div>
                    <div className="text-xs text-muted-foreground">All systems operational</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}