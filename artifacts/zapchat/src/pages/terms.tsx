import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const sections = [
  {
    title: "Acceptance of Terms",
    content: `By accessing or using ZapChat ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.\n\nThese Terms apply to all visitors, users, and others who access or use the Service. By using ZapChat, you represent that you are at least 18 years old and have the legal authority to enter into this agreement.`,
  },
  {
    title: "Use of the Service",
    content: `**Permitted use:** You may use ZapChat solely for lawful purposes and in accordance with these Terms. You agree to use the Service to automate legitimate business communications via WhatsApp.\n\n**Prohibited use:** You may not use ZapChat to:\n- Send spam, unsolicited messages, or bulk messages to people who have not opted in\n- Violate WhatsApp's Terms of Service or Business Policy\n- Engage in any illegal activity or facilitate illegal activity\n- Transmit any harmful, offensive, or inappropriate content\n- Attempt to gain unauthorized access to any part of the Service\n- Use automated means to scrape, crawl, or index the Service`,
  },
  {
    title: "WhatsApp Compliance",
    content: `ZapChat operates through the official WhatsApp Business API. By using ZapChat, you agree to comply with:\n\n- WhatsApp's Terms of Service\n- WhatsApp Business Policy\n- WhatsApp Commerce Policy\n\nYou are solely responsible for ensuring that your use of WhatsApp through ZapChat complies with applicable WhatsApp policies. ZapChat reserves the right to suspend your account if we determine that your usage violates WhatsApp's policies.`,
  },
  {
    title: "Subscription and Billing",
    content: `**Subscription plans:** ZapChat offers subscription plans as described on our Pricing page. Plans are billed monthly or annually in advance.\n\n**Free trial:** New accounts may receive a 14-day free trial. No credit card is required for the trial period. At the end of the trial, you must subscribe to continue using the Service.\n\n**Cancellation:** You may cancel your subscription at any time. Cancellation takes effect at the end of the current billing period. We do not provide refunds for partial billing periods.\n\n**Price changes:** We reserve the right to change subscription prices with 30 days' notice via email.`,
  },
  {
    title: "Intellectual Property",
    content: `The Service and its original content, features, and functionality are owned by ZapChat Inc. and are protected by international copyright, trademark, and other intellectual property laws.\n\n**Your content:** You retain ownership of any content you create using ZapChat. By using our Service, you grant ZapChat a limited license to use your content solely to provide the Service.\n\n**Feedback:** Any feedback, suggestions, or ideas you provide about ZapChat may be used by us without any obligation to compensate you.`,
  },
  {
    title: "Limitation of Liability",
    content: `To the maximum extent permitted by applicable law, ZapChat Inc. shall not be liable for:\n\n- Any indirect, incidental, special, consequential, or punitive damages\n- Loss of profits, revenue, data, or business opportunities\n- Damages arising from your reliance on information obtained through the Service\n- Damages arising from unauthorized access to or use of our servers\n\nIn no event shall our total liability exceed the amount paid by you to ZapChat in the twelve months preceding the event giving rise to liability.`,
  },
  {
    title: "Termination",
    content: `We reserve the right to terminate or suspend your account at our discretion, with or without notice, for conduct that we believe:\n\n- Violates these Terms or any other ZapChat policy\n- Is harmful to other users, the Service, or third parties\n- Violates applicable law\n\nUpon termination, your right to use the Service will immediately cease. You may export your data within 30 days of termination by contacting support@zapchat.app.`,
  },
  {
    title: "Governing Law",
    content: `These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.\n\nAny disputes arising under these Terms shall be resolved through binding arbitration in accordance with the American Arbitration Association's rules. You waive any right to a jury trial or class action lawsuit.\n\nIf any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <section className="py-20 md:py-28 border-b border-border">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
            <p className="text-sm font-medium text-primary mb-4">Legal</p>
            <h1 className="font-serif text-5xl md:text-6xl tracking-tight mb-6">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: January 1, 2025</p>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl">
            <div className="space-y-12">
              {sections.map((section, i) => (
                <div key={section.title}>
                  <h2 className="font-serif text-2xl md:text-3xl tracking-tight mb-4">
                    {i + 1}. {section.title}
                  </h2>
                  <div className="space-y-3">
                    {section.content.split("\n\n").map((para, j) => (
                      <p key={j} className="text-sm text-muted-foreground leading-relaxed">
                        {para.replace(/\*\*(.*?)\*\*/g, "$1")}
                      </p>
                    ))}
                  </div>
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
