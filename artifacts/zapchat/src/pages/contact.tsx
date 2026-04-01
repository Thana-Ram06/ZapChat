import { useState, useRef } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare, Mail, Clock, CheckCircle2, Loader2 } from "lucide-react";

const CONTACT_EMAIL = "prajapatthanaram31@gmail.com";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const name = nameRef.current?.value || "";
    const email = emailRef.current?.value || "";
    const subject = subjectRef.current?.value || "ZapChat Contact Form";
    const message = messageRef.current?.value || "";
    const phone = phoneRef.current?.value || "";

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      ``,
      message,
    ]
      .filter(Boolean)
      .join("\n");

    const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      `ZapChat: ${subject}`
    )}&body=${encodeURIComponent(body)}`;

    try {
      window.open(mailtoUrl, "_blank");
      setSubmitted(true);
    } catch {
      setError("Could not open your mail client. Please email us directly.");
    } finally {
      setSubmitting(false);
    }
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
              Have a question or want to see a demo? We'd love to hear from you. Our team
              typically responds within a few hours.
            </p>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Form */}
              <div>
                <h2 className="font-serif text-3xl tracking-tight mb-8">Send us a message</h2>

                {submitted ? (
                  <div className="p-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 mx-auto mb-4">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Message opened!</h3>
                    <p className="text-sm text-muted-foreground">
                      Your email client has opened with your message pre-filled. Just hit send —
                      we'll reply within 24 hours.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl mt-4"
                      onClick={() => setSubmitted(false)}
                    >
                      Send another
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          ref={nameRef}
                          placeholder="Your name"
                          required
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          ref={emailRef}
                          type="email"
                          placeholder="you@company.com"
                          required
                          className="rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Phone{" "}
                        <span className="text-muted-foreground font-normal">(optional)</span>
                      </Label>
                      <Input
                        id="phone"
                        ref={phoneRef}
                        type="tel"
                        placeholder="+91 98765 43210"
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        ref={subjectRef}
                        placeholder="How can we help?"
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        ref={messageRef}
                        placeholder="Tell us more about your business and what you're looking for..."
                        rows={5}
                        required
                        className="rounded-xl resize-none"
                      />
                    </div>

                    {error && (
                      <p className="text-sm text-destructive">{error}</p>
                    )}

                    <Button
                      type="submit"
                      className="w-full rounded-xl gap-2"
                      disabled={submitting}
                    >
                      {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                      Send message
                    </Button>
                  </form>
                )}
              </div>

              {/* Contact cards */}
              <div className="space-y-6">
                <h2 className="font-serif text-3xl tracking-tight mb-8">Other ways to reach us</h2>

                {/* Support */}
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=ZapChat%20Support`}
                  className="flex gap-4 p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-colors block"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email Support</h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      For billing, technical issues, or general inquiries.
                    </p>
                    <p className="text-sm font-medium text-primary">Contact Support →</p>
                  </div>
                </a>

                {/* Sales */}
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=ZapChat%20Sales%20Inquiry`}
                  className="flex gap-4 p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-colors block"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Sales</h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      Interested in a demo or custom enterprise plan?
                    </p>
                    <p className="text-sm font-medium text-primary">Talk to Sales →</p>
                  </div>
                </a>

                {/* Response time */}
                <div className="flex gap-4 p-6 rounded-2xl border border-border bg-card">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Response Time</h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      We typically reply within a few hours on business days.
                    </p>
                    <p className="text-sm font-medium">Mon–Fri, 9am–6pm IST</p>
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
