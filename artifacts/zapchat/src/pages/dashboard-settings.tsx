import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useAuth } from "@/contexts/auth-context";
import { getUserProfile, updateUserProfile, deleteAllUserData } from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Link2,
  Bell,
  Shield,
  MessageSquare,
  LogOut,
  CheckCircle2,
  Loader2,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { apiUrl } from "@/lib/api";
import { toast } from "sonner";

interface WhatsAppStatus {
  configured: boolean;
  phoneNumberId: string | null;
  messageCount: number;
}

export default function SettingsPage() {
  const { user, signOut, deleteAccount } = useAuth();
  const [, navigate] = useLocation();
  const [savedProfile, setSavedProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [businessName, setBusinessName] = useState("");
  const [displayNameInput, setDisplayNameInput] = useState("");
  const [whatsappStatus, setWhatsappStatus] = useState<WhatsAppStatus | null>(null);
  const [checkingWA, setCheckingWA] = useState(true);

  // Delete account dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);

  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  useEffect(() => {
    if (!user) return;
    getUserProfile(user.uid).then((profile) => {
      if (profile) {
        setBusinessName(profile.businessName || "");
        setDisplayNameInput(profile.displayName || user.displayName || "");
      }
    });
  }, [user]);

  useEffect(() => {
    async function checkWhatsApp() {
      try {
        const res = await fetch(apiUrl("/whatsapp/status"));
        if (res.ok) {
          const data = await res.json();
          setWhatsappStatus(data);
        }
      } catch {
        setWhatsappStatus({ configured: false, phoneNumberId: null, messageCount: 0 });
      } finally {
        setCheckingWA(false);
      }
    }
    checkWhatsApp();
  }, []);

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  async function handleDeleteAccount() {
    if (!user || deleteConfirm !== "DELETE") return;
    setDeleting(true);
    try {
      await deleteAllUserData(user.uid);
      await deleteAccount();
      navigate("/");
      toast.success("Account deleted successfully.");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to delete account", {
        description:
          err?.code === "auth/requires-recent-login"
            ? "Please sign out and sign back in, then try again."
            : err?.message || "An error occurred.",
      });
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  }

  return (
    <DashboardLayout
      title="Settings"
      description="Manage your account, integrations, and preferences."
    >
      <div className="space-y-6 max-w-3xl">

        {/* Profile Card */}
        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-base font-semibold">Profile</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 rounded-2xl">
                {user?.photoURL && (
                  <AvatarImage src={user.photoURL} alt={displayName} className="rounded-2xl" />
                )}
                <AvatarFallback className="rounded-2xl bg-primary/20 text-primary text-xl font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{displayName}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                {user?.emailVerified && (
                  <Badge
                    variant="secondary"
                    className="mt-1 text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/20 gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  value={displayNameInput}
                  onChange={(e) => setDisplayNameInput(e.target.value)}
                  placeholder="Your name"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business">Business Name</Label>
                <Input
                  id="business"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Acme Inc."
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue={user?.email || ""}
                disabled
                className="rounded-xl opacity-60"
              />
              <p className="text-xs text-muted-foreground">
                Email is managed by your Google account.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                className="rounded-xl gap-2"
                disabled={savingProfile}
                onClick={async () => {
                  if (!user) return;
                  setSavingProfile(true);
                  try {
                    await updateUserProfile(user.uid, {
                      displayName: displayNameInput,
                      businessName,
                    });
                    setSavedProfile(true);
                    toast.success("Profile saved");
                    setTimeout(() => setSavedProfile(false), 2500);
                  } catch {
                    toast.error("Failed to save profile");
                  } finally {
                    setSavingProfile(false);
                  }
                }}
              >
                {savingProfile && <Loader2 className="w-4 h-4 animate-spin" />}
                {savedProfile ? "Saved!" : "Save Changes"}
              </Button>
              {savedProfile && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="rounded-2xl border-border shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Appearance</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Toggle between light and dark mode.
              </p>
            </div>
            <ThemeToggle />
          </CardContent>
        </Card>

        {/* WhatsApp Connection */}
        <Card
          className={`rounded-2xl shadow-sm border ${
            whatsappStatus?.configured ? "border-emerald-500/30" : "border-border"
          }`}
        >
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  whatsappStatus?.configured
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-primary/10 text-primary"
                }`}
              >
                <Link2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm">WhatsApp Connection</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {checkingWA
                    ? "Checking connection..."
                    : whatsappStatus?.configured
                    ? `Connected · Phone ID: ${whatsappStatus.phoneNumberId} · ${whatsappStatus.messageCount} messages`
                    : "WhatsApp credentials not configured."}
                </p>
              </div>
              {checkingWA ? (
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground shrink-0" />
              ) : whatsappStatus?.configured ? (
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs shrink-0 gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Connected
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-xs shrink-0 text-destructive border-destructive/30"
                >
                  Not connected
                </Badge>
              )}
            </div>
            {!checkingWA && !whatsappStatus?.configured && (
              <p className="text-xs text-muted-foreground mt-3 pl-14">
                Add your{" "}
                <span className="font-medium text-foreground">WHATSAPP_ACCESS_TOKEN</span> and{" "}
                <span className="font-medium text-foreground">WHATSAPP_PHONE_NUMBER_ID</span> in
                Replit Secrets to connect.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Message Templates */}
        <Card className="rounded-2xl border-border shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm">Message Templates</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Create and manage pre-approved WhatsApp message templates in Meta Business
                Manager.
              </p>
            </div>
            <a
              href="https://business.facebook.com/wa/manage/message-templates/"
              target="_blank"
              rel="noopener noreferrer"
              title="Create templates in Meta dashboard"
            >
              <Button variant="outline" size="sm" className="rounded-lg shrink-0 gap-1.5">
                Open Meta
                <ExternalLink className="w-3 h-3" />
              </Button>
            </a>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="rounded-2xl border-border shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm">Notifications</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {notificationsEnabled
                  ? "Email notifications are enabled."
                  : "Email notifications are disabled."}
              </p>
            </div>
            <Button
              variant={notificationsEnabled ? "default" : "outline"}
              size="sm"
              className="rounded-lg shrink-0"
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            >
              {notificationsEnabled ? "Enabled" : "Disabled"}
            </Button>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="rounded-2xl border-border shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm">Security</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Signed in via Google. Your account is protected.
              </p>
            </div>
            <Badge
              variant="secondary"
              className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs shrink-0 gap-1"
            >
              <CheckCircle2 className="w-3 h-3" />
              Secure
            </Badge>
          </CardContent>
        </Card>

        <div className="border-t border-border" />

        {/* Sign Out + Danger Zone */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Card className="rounded-2xl border-border shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                <LogOut className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">Sign Out</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Sign out of your account.</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg shrink-0"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-destructive/30 shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm text-destructive">Delete Account</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Permanently delete all your data.
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="rounded-lg shrink-0"
                onClick={() => {
                  setDeleteConfirm("");
                  setDeleteOpen(true);
                }}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Delete Account Confirmation Dialog ─── */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              This will permanently delete your account, all messages, customers, and automations.
              <strong className="text-foreground"> This cannot be undone.</strong>
            </p>
            <div className="space-y-2">
              <Label>
                Type <span className="font-mono font-bold">DELETE</span> to confirm
              </Label>
              <Input
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="DELETE"
                className="rounded-xl font-mono"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setDeleteOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="rounded-xl gap-2"
              disabled={deleteConfirm !== "DELETE" || deleting}
              onClick={handleDeleteAccount}
            >
              {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
              Delete Everything
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
