import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquare, Bell, Shield, Link2 } from "lucide-react";

const settingSections = [
  {
    icon: Link2,
    title: "WhatsApp Connection",
    description: "Connect your WhatsApp Business number to start sending messages.",
    action: "Connect Number",
  },
  {
    icon: MessageSquare,
    title: "Message Templates",
    description: "Create and manage pre-approved WhatsApp message templates.",
    action: "Manage Templates",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Configure how and when you receive alerts for new messages.",
    action: "Update",
  },
  {
    icon: Shield,
    title: "Security",
    description: "Manage your password, two-factor authentication, and active sessions.",
    action: "Configure",
  },
];

export default function SettingsPage() {
  return (
    <DashboardLayout
      title="Settings"
      description="Manage your account, integrations, and preferences."
    >
      <div className="space-y-6 max-w-3xl">
        {/* Profile */}
        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-base font-semibold">Profile</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business">Business Name</Label>
                <Input id="business" placeholder="Acme Inc." className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@company.com" className="rounded-xl" />
            </div>
            <Button className="rounded-xl">Save Changes</Button>
          </CardContent>
        </Card>

        {/* Other Settings */}
        <div className="space-y-3">
          {settingSections.map((section) => (
            <Card key={section.title} className="rounded-2xl border-border shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <section.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm">{section.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{section.description}</p>
                </div>
                <Button variant="outline" size="sm" className="rounded-lg shrink-0">
                  {section.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="border-t border-border" />

        {/* Danger Zone */}
        <Card className="rounded-2xl border-destructive/30 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-destructive">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Delete Account</p>
              <p className="text-xs text-muted-foreground mt-0.5">Permanently delete your account and all your data.</p>
            </div>
            <Button variant="destructive" size="sm" className="rounded-lg shrink-0">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
