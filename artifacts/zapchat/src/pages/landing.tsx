import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { CheckCircle2, MessageSquare, Zap, BarChart3, Users, Clock } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-primary/20">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <img src="/zapchat-logo.jpeg" alt="ZapChat" className="w-8 h-8 rounded-lg object-cover" />
              <span className="font-serif text-2xl tracking-tight">ZapChat</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button asChild className="rounded-xl hidden sm:inline-flex">
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-4xl flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Zap className="w-4 h-4" />
              <span>The #1 WhatsApp API for Growth</span>
            </div>
            
            <h1 className="font-serif text-6xl md:text-8xl lg:text-[6rem] leading-[0.95] tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
              Automate your WhatsApp.<br className="hidden md:block" />
              <span className="text-primary italic">Grow faster.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
              Turn conversations into conversions. A premium CRM and automation engine built specifically for modern commerce.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-500">
              <Button size="lg" className="rounded-xl h-14 px-8 text-base w-full sm:w-auto" asChild>
                <Link href="/dashboard">Start Your Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-xl h-14 px-8 text-base w-full sm:w-auto">
                Book a Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 md:py-32 bg-secondary/30">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <div className="text-center mb-20">
              <h2 className="font-serif text-4xl md:text-5xl mb-4">Everything you need to scale</h2>
              <p className="text-lg text-muted-foreground">Purpose-built tools for high-volume WhatsApp operations.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  icon: MessageSquare,
                  title: "Smart Auto Replies",
                  desc: "Instantly respond to common queries, route complex issues to human agents, and never leave a customer hanging."
                },
                {
                  icon: Zap,
                  title: "Order Management",
                  desc: "Send automated order confirmations, shipping updates, and payment reminders directly to their inbox."
                },
                {
                  icon: Users,
                  title: "Customer CRM",
                  desc: "Rich customer profiles right alongside your chats. Track lifetime value, past orders, and segment your audience."
                },
                {
                  icon: BarChart3,
                  title: "Actionable Analytics",
                  desc: "Measure what matters. Track response times, resolution rates, and attribute revenue directly to conversations."
                }
              ].map((feature, i) => (
                <div key={i} className="group p-8 md:p-10 rounded-3xl bg-card border border-card-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 md:py-32">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <div className="text-center mb-20">
              <h2 className="font-serif text-4xl md:text-5xl mb-4">Simple, transparent pricing</h2>
              <p className="text-lg text-muted-foreground">No hidden fees. Scale your plan as you grow.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-center">
              {/* Starter */}
              <div className="p-8 rounded-3xl bg-card border border-card-border">
                <div className="mb-8">
                  <h3 className="text-xl font-medium mb-2">Starter</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">$29</span>
                    <span className="text-muted-foreground">/mo</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">Perfect for new businesses.</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {['1,000 messages/mo', '1 team member', 'Basic auto-replies', 'Standard support'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full rounded-xl" variant="outline">Get Starter</Button>
              </div>

              {/* Pro */}
              <div className="p-8 rounded-3xl bg-primary text-primary-foreground border border-primary-border transform md:-translate-y-4 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 px-4 py-1 bg-white/20 rounded-bl-xl text-xs font-medium backdrop-blur-sm">
                  Most Popular
                </div>
                <div className="mb-8">
                  <h3 className="text-xl font-medium mb-2">Pro</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold">$79</span>
                    <span className="text-primary-foreground/80">/mo</span>
                  </div>
                  <p className="text-sm text-primary-foreground/80 mt-4">For growing ecommerce stores.</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {['10,000 messages/mo', '5 team members', 'Advanced automation', 'CRM integration', 'Priority support'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full rounded-xl bg-background text-foreground hover:bg-background/90" size="lg">Get Pro</Button>
              </div>

              {/* Business */}
              <div className="p-8 rounded-3xl bg-card border border-card-border">
                <div className="mb-8">
                  <h3 className="text-xl font-medium mb-2">Business</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">$199</span>
                    <span className="text-muted-foreground">/mo</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">For high-volume brands.</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {['Unlimited messages', 'Unlimited team members', 'Custom workflows', 'Dedicated account manager', 'API access'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full rounded-xl" variant="outline">Contact Sales</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-24 md:py-32 bg-secondary/30">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl">Trusted by fast-growing brands</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { quote: "ZapChat cut our response time from hours to seconds. Our conversion rate is up 40% since we started.", author: "Sarah Jenkins", role: "Founder, Bloom Cosmetics" },
                { quote: "The easiest CRM we've ever used. Managing WhatsApp orders used to be a nightmare, now it's completely automated.", author: "David Chen", role: "Operations, TechWear" },
                { quote: "The analytics alone are worth the price. Finally, we can measure the ROI of our chat team.", author: "Elena Rodriguez", role: "Marketing Director, Aura" }
              ].map((testimonial, i) => (
                <div key={i} className="p-8 rounded-3xl bg-background border border-border">
                  <div className="flex text-primary mb-6">
                    {[1,2,3,4,5].map(star => (
                      <svg key={star} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-lg leading-relaxed mb-6 font-medium">"{testimonial.quote}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <img src="/zapchat-logo.jpeg" alt="ZapChat" className="w-6 h-6 rounded-md" />
                <span className="font-serif text-xl">ZapChat</span>
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs">
                Premium WhatsApp automation for modern businesses. Build better relationships, automatically.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Features</a></li>
                <li><a href="#" className="hover:text-foreground">Integrations</a></li>
                <li><a href="#" className="hover:text-foreground">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground">Changelog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground">API Reference</a></li>
                <li><a href="#" className="hover:text-foreground">Blog</a></li>
                <li><a href="#" className="hover:text-foreground">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About</a></li>
                <li><a href="#" className="hover:text-foreground">Careers</a></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
                <li><a href="#" className="hover:text-foreground">Legal</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ZapChat Inc. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground">Privacy Policy</a>
              <a href="#" className="hover:text-foreground">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}