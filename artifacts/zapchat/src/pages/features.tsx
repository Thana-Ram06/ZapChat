import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MessageSquare, Users, BarChart3, Zap, Clock, Shield } from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Smart Auto Replies",
    description:
      "Set up intelligent automated responses that understand customer intent. Create rule-based flows, keyword triggers, and AI-powered replies that work 24/7 — even while you sleep.",
    details: ["Keyword-based triggers", "Time-based scheduling", "Multi-language support", "Fallback handling"],
  },
  {
    icon: Users,
    title: "Customer CRM",
    description:
      "Build a complete customer profile with every interaction. Track conversation history, purchase behavior, tags, and notes — all in one place for your whole team.",
    details: ["Contact segmentation", "Custom tags & labels", "Conversation history", "Team collaboration"],
  },
  {
    icon: BarChart3,
    title: "Analytics & Reporting",
    description:
      "Understand what's working with detailed analytics. Track message delivery rates, response times, customer satisfaction, and revenue attributed to WhatsApp conversations.",
    details: ["Real-time dashboards", "Revenue attribution", "Response rate tracking", "Export to CSV"],
  },
  {
    icon: Zap,
    title: "Order Management",
    description:
      "Manage the entire order lifecycle through WhatsApp. Customers can check order status, request changes, and receive updates — all without leaving the chat.",
    details: ["Order status updates", "Payment confirmations", "Delivery tracking", "Return management"],
  },
  {
    icon: Clock,
    title: "Broadcast Campaigns",
    description:
      "Reach thousands of customers at once with targeted broadcast messages. Segment your audience by behavior, location, or purchase history and send personalized campaigns.",
    details: ["Audience segmentation", "Scheduled broadcasts", "Template messages", "Campaign analytics"],
  },
  {
    icon: Shield,
    title: "Compliance & Security",
    description:
      "Built with WhatsApp's official Business API. All messages are end-to-end encrypted, GDPR compliant, and your data is never shared with third parties.",
    details: ["Official WhatsApp API", "End-to-end encryption", "GDPR compliant", "99.9% uptime SLA"],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <section className="py-20 md:py-28 border-b border-border">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
            <p className="text-sm font-medium text-primary mb-4">Features</p>
            <h1 className="font-serif text-5xl md:text-6xl tracking-tight mb-6">
              Everything you need to grow on WhatsApp
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              ZapChat gives you a complete toolkit to automate conversations, manage customers, and drive revenue — all through WhatsApp.
            </p>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="p-8 rounded-2xl border border-border bg-card hover:border-primary/30 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">{feature.description}</p>
                  <ul className="space-y-1.5">
                    {feature.details.map((d) => (
                      <li key={d} className="text-xs text-muted-foreground flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-primary/60 shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
