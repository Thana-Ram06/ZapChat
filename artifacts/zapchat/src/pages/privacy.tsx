import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const sections = [
  {
    title: "Information We Collect",
    content: `We collect information you provide directly to us, including when you create an account, use our services, or contact us for support.\n\n**Account information:** Name, email address, business name, phone number, and payment information.\n\n**Usage data:** Information about how you use ZapChat, including messages sent, contacts managed, and features used.\n\n**WhatsApp data:** With your authorization, we access your WhatsApp Business account to provide our automation services. We do not read the content of your personal WhatsApp conversations.\n\n**Device information:** IP address, browser type, operating system, and device identifiers when you access our platform.`,
  },
  {
    title: "How We Use Your Information",
    content: `We use the information we collect to:\n\n- Provide, maintain, and improve our services\n- Process transactions and send related information\n- Send technical notices, updates, and support messages\n- Respond to comments and questions\n- Monitor and analyze usage patterns to improve user experience\n- Detect and prevent fraudulent transactions and other illegal activities\n- Comply with legal obligations`,
  },
  {
    title: "Data Sharing",
    content: `We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:\n\n**Service providers:** We share information with third-party vendors who perform services on our behalf, such as payment processing, data analytics, and customer support. These providers are bound by confidentiality agreements.\n\n**Business transfers:** If ZapChat is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.\n\n**Legal requirements:** We may disclose information if required by law or in response to valid requests by public authorities.`,
  },
  {
    title: "Data Security",
    content: `We take the security of your data seriously. We implement industry-standard security measures including:\n\n- TLS encryption for all data in transit\n- AES-256 encryption for data at rest\n- Regular security audits and penetration testing\n- SOC 2 Type II compliance\n- Role-based access controls for our team\n\nHowever, no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.`,
  },
  {
    title: "Your Rights (GDPR)",
    content: `If you are located in the European Economic Area, you have the following rights regarding your personal data:\n\n- **Right to access:** You can request a copy of the personal data we hold about you.\n- **Right to rectification:** You can ask us to correct inaccurate or incomplete data.\n- **Right to erasure:** You can request deletion of your personal data.\n- **Right to restriction:** You can ask us to limit how we use your data.\n- **Right to portability:** You can request your data in a machine-readable format.\n- **Right to object:** You can object to our processing of your data.\n\nTo exercise any of these rights, contact us at privacy@zapchat.app.`,
  },
  {
    title: "Cookies",
    content: `We use cookies and similar tracking technologies to track activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.\n\n**Essential cookies:** Required for the platform to function. Cannot be disabled.\n\n**Analytics cookies:** Help us understand how users interact with ZapChat. Can be disabled.\n\n**Marketing cookies:** Used to deliver relevant advertisements. Can be disabled.`,
  },
  {
    title: "Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. For material changes, we will send an email notification to the address associated with your account.\n\nWe encourage you to review this Privacy Policy periodically for any changes.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <section className="py-20 md:py-28 border-b border-border">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
            <p className="text-sm font-medium text-primary mb-4">Legal</p>
            <h1 className="font-serif text-5xl md:text-6xl tracking-tight mb-6">Privacy Policy</h1>
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
