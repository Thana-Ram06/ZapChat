import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare, Mail, Clock } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <section className="py-20 md:py-28 border-b border-border">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
            <p className="text-sm font-medium text-primary mb-4">Contact</p>
            <h1 className="font-serif text-5xl md:text-6xl tracking-tight mb-6">Get in touch</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Have a question or want to see a demo? We'd love to hear from you. Our team typically responds within a few hours.
            </p>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="font-serif text-3xl tracking-tight mb-8">Send us a message</h2>

                {submitted ? (
                  <div className="p-8 rounded-2xl border border-border bg-card text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Message received</h3>
                    <p className="text-sm text-muted-foreground">We'll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Your name" required className="rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="you@company.com" required className="rounded-xl" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" placeholder="How can we help?" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us more about your business and what you're looking for..."
                        rows={5}
                        required
                        className="rounded-xl resize-none"
                      />
                    </div>
                    <Button type="submit" className="w-full rounded-xl">Send message</Button>
                  </form>
                )}
              </div>

              <div className="space-y-6">
                <h2 className="font-serif text-3xl tracking-tight mb-8">Other ways to reach us</h2>
                {[
                  {
                    icon: Mail,
                    title: "Email support",
                    description: "For billing, technical issues, or general inquiries.",
                    detail: "support@zapchat.app",
                  },
                  {
                    icon: MessageSquare,
                    title: "Sales",
                    description: "Interested in a demo or custom enterprise plan?",
                    detail: "sales@zapchat.app",
                  },
                  {
                    icon: Clock,
                    title: "Response time",
                    description: "We typically reply within a few hours on business days.",
                    detail: "Mon–Fri, 9am–6pm IST",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 p-6 rounded-2xl border border-border bg-card">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-1">{item.description}</p>
                      <p className="text-sm font-medium">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
