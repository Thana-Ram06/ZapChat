import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ChevronRight } from "lucide-react";

const sections = [
  {
    id: "getting-started",
    title: "Getting Started",
    articles: [
      {
        title: "Quick Start Guide",
        content: `Welcome to ZapChat. This guide will help you get up and running in under 15 minutes.\n\n**Step 1 — Create your account**\nSign up at zapchat.app with your business email. You'll receive a verification email immediately.\n\n**Step 2 — Connect your WhatsApp number**\nNavigate to Settings → WhatsApp Integration and scan the QR code with your WhatsApp Business app. Your number will be verified within seconds.\n\n**Step 3 — Set up your first auto reply**\nGo to Automations → New Flow. Choose a trigger (e.g. any incoming message), add a reply action, and activate it. You're live.\n\n**Step 4 — Import your contacts**\nUpload a CSV with your customer list or import directly from your existing CRM. ZapChat supports HubSpot, Salesforce, and Shopify out of the box.`,
      },
      {
        title: "Account Setup",
        content: `**Profile settings**\nConfigure your business name, logo, and timezone from the Settings panel. These appear in your customer-facing messages.\n\n**Team members**\nInvite team members under Settings → Team. Assign roles: Admin, Agent, or Viewer. Agents can reply to messages; Viewers can only read.\n\n**Notifications**\nConfigure email and in-app notifications for new messages, failed deliveries, and campaign reports under Settings → Notifications.`,
      },
    ],
  },
  {
    id: "whatsapp-integration",
    title: "WhatsApp Integration",
    articles: [
      {
        title: "Connecting Your Number",
        content: `ZapChat uses the official WhatsApp Business API. You can connect either a WhatsApp Business App number (for small teams) or a WhatsApp Business API number (for scale).\n\n**Option A — WhatsApp Business App**\nScan the QR code shown in ZapChat's integration panel with your WhatsApp Business app. This is the fastest option and works for most small businesses.\n\n**Option B — WhatsApp Business API**\nFor high-volume sending, apply for a WhatsApp Business API account through Meta's Business Manager. This supports unlimited messages and is required for broadcast campaigns over 256 contacts.\n\n**Number verification**\nYour number must have a verified Meta Business account to use broadcast features. ZapChat guides you through the verification process step by step.`,
      },
      {
        title: "Message Templates",
        content: `**What are templates?**\nWhatsApp requires pre-approved message templates for outbound messages (messages sent outside a 24-hour customer conversation window). Templates are submitted to Meta for approval, which typically takes 24 hours.\n\n**Creating templates**\nGo to Templates → New Template. Choose a category (Marketing, Utility, Authentication), write your message with variables like {{1}} for dynamic content, and submit for approval.\n\n**Using templates**\nApproved templates appear in your Broadcasts panel and can be triggered automatically in automation flows.`,
      },
    ],
  },
  {
    id: "automation",
    title: "Automation Setup",
    articles: [
      {
        title: "Building Your First Flow",
        content: `**What is an automation flow?**\nA flow is a sequence of actions triggered by a specific event. For example: when a customer sends "ORDER STATUS", reply with their latest order details.\n\n**Triggers**\n- Incoming message (contains keyword)\n- New contact added\n- Order status change\n- Scheduled time\n- Webhook event\n\n**Actions**\n- Send message (text, image, document)\n- Add contact tag\n- Assign to agent\n- Update CRM field\n- Send webhook\n- Wait (delay)\n\n**Flow logic**\nAdd conditions to branch your flow. For example: if contact tag is "VIP", send a different message than standard customers.`,
      },
      {
        title: "Keyword Triggers",
        content: `**Setting up keywords**\nKeywords let you respond to specific words or phrases your customers send. Go to Automations → Keywords → Add Keyword.\n\n**Exact vs. contains**\nChoose "exact match" to only trigger on a specific word (e.g. "STOP"), or "contains" to trigger on any message containing the keyword (e.g. any message with "order").\n\n**Priority**\nIf multiple keywords match, the highest priority one fires. Drag to reorder your keyword list.\n\n**Fallback**\nSet a fallback response for messages that don't match any keyword. This ensures every customer gets a reply.`,
      },
    ],
  },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [activeArticle, setActiveArticle] = useState(sections[0].articles[0].title);

  const currentSection = sections.find((s) => s.id === activeSection)!;
  const currentArticle = currentSection.articles.find((a) => a.title === activeArticle) || currentSection.articles[0];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <section className="py-16 border-b border-border">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
            <p className="text-sm font-medium text-primary mb-4">Documentation</p>
            <h1 className="font-serif text-5xl md:text-6xl tracking-tight mb-6">ZapChat Docs</h1>
            <p className="text-lg text-muted-foreground">Everything you need to integrate, automate, and grow.</p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <div className="flex gap-8">
              <aside className="hidden md:block w-56 shrink-0">
                <nav className="sticky top-24 space-y-6">
                  {sections.map((section) => (
                    <div key={section.id}>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        {section.title}
                      </p>
                      <ul className="space-y-1">
                        {section.articles.map((article) => (
                          <li key={article.title}>
                            <button
                              onClick={() => {
                                setActiveSection(section.id);
                                setActiveArticle(article.title);
                              }}
                              className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                                activeSection === section.id && activeArticle === article.title
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
                              }`}
                            >
                              <ChevronRight className="w-3 h-3 shrink-0" />
                              {article.title}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </nav>
              </aside>

              <div className="flex-1 min-w-0">
                <div className="prose prose-sm max-w-none">
                  <h2 className="font-serif text-3xl tracking-tight mb-2">{currentArticle.title}</h2>
                  <p className="text-xs text-muted-foreground mb-8">{currentSection.title}</p>
                  <div className="space-y-4">
                    {currentArticle.content.split("\n\n").map((para, i) => (
                      <p key={i} className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {para.replace(/\*\*(.*?)\*\*/g, "$1")}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
