import { Link } from "wouter";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$29",
    description: "Perfect for small businesses just getting started with WhatsApp automation.",
    features: [
      "1 WhatsApp number",
      "1,000 messages/month",
      "Basic auto replies",
      "Contact management",
      "Email support",
      "2 team members",
    ],
    cta: "Start free trial",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$79",
    description: "For growing businesses that need more power and integrations.",
    features: [
      "3 WhatsApp numbers",
      "10,000 messages/month",
      "Advanced automation flows",
      "CRM integration",
      "Analytics dashboard",
      "Priority support",
      "10 team members",
      "Broadcast campaigns",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Business",
    price: "$199",
    description: "Enterprise-grade features for high-volume operations.",
    features: [
      "Unlimited WhatsApp numbers",
      "Unlimited messages",
      "Custom automation flows",
      "Full CRM suite",
      "Advanced analytics",
      "Dedicated account manager",
      "Unlimited team members",
      "API access",
      "Custom integrations",
      "SLA guarantee",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <section className="py-20 md:py-28 border-b border-border">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
            <p className="text-sm font-medium text-primary mb-4">Pricing</p>
            <h1 className="font-serif text-5xl md:text-6xl tracking-tight mb-6">
              Simple, transparent pricing
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Start free for 14 days. No credit card required. Cancel anytime.
            </p>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative p-8 rounded-2xl border flex flex-col ${
                    plan.highlighted
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card"
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-1">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="font-serif text-5xl tracking-tight">{plan.price}</span>
                      <span className="text-muted-foreground text-sm">/month</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    variant={plan.highlighted ? "default" : "outline"}
                    className="w-full rounded-xl"
                  >
                    <Link href="/dashboard">{plan.cta}</Link>
                  </Button>
                </div>
              ))}
            </div>

            <p className="text-center text-sm text-muted-foreground mt-10">
              All plans include a 14-day free trial. No credit card required.{" "}
              <Link href="/contact" className="text-foreground underline underline-offset-4 hover:text-primary transition-colors">
                Talk to sales
              </Link>{" "}
              for custom enterprise pricing.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
