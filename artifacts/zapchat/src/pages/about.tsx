import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const team = [
  { name: "Arjun Sharma", role: "CEO & Co-founder", bio: "Former WhatsApp Business lead at Meta. 10+ years in conversational commerce." },
  { name: "Priya Nair", role: "CTO & Co-founder", bio: "Built messaging infrastructure at Twilio. Expert in scalable API systems." },
  { name: "David Osei", role: "Head of Product", bio: "Previously at Intercom. Passionate about making business communication effortless." },
];

const values = [
  { title: "Customer first", description: "Every decision starts with the question: does this make our customers more successful?" },
  { title: "Radical simplicity", description: "Powerful tools should feel simple. We obsess over reducing friction in everything we build." },
  { title: "Transparent by default", description: "We believe in honest pricing, honest communication, and no hidden surprises." },
  { title: "Global mindset", description: "WhatsApp is the messaging platform for the world. We build for everyone, everywhere." },
];

export default function AboutPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <section className="py-20 md:py-28 border-b border-border">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
            <p className="text-sm font-medium text-primary mb-4">About</p>
            <h1 className="font-serif text-5xl md:text-6xl tracking-tight mb-6">
              We believe WhatsApp is the future of business communication
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              ZapChat was founded in 2023 with a simple mission: make it easy for any business to automate their WhatsApp conversations and grow faster.
            </p>
          </div>
        </section>

        <section className="py-20 md:py-24 border-b border-border">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-6 text-center">Our story</h2>
            <div className="space-y-5 text-muted-foreground leading-relaxed max-w-2xl mx-auto text-center">
              <p>
                ZapChat started when our founders noticed that small businesses in emerging markets were losing sales because they couldn't keep up with WhatsApp messages. A clothing store owner was getting 300 messages a day and answering each one manually.
              </p>
              <p>
                We built the first version of ZapChat in a weekend. Within a month, that clothing store tripled their response rate and increased revenue by 40%. We knew we were onto something.
              </p>
              <p>
                Today, ZapChat powers over 5,000 businesses across 60 countries. We're backed by top investors who believe, like us, that WhatsApp is the next great business channel.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-24 border-b border-border">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-12 text-center">Our values</h2>
            <div className="grid sm:grid-cols-2 gap-8">
              {values.map((value) => (
                <div key={value.title} className="p-8 rounded-2xl border border-border bg-card">
                  <h3 className="font-semibold text-lg mb-3">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-24">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-12 text-center">Meet the team</h2>
            <div className="grid sm:grid-cols-3 gap-8">
              {team.map((member) => (
                <div key={member.name} className="text-center p-8 rounded-2xl border border-border bg-card">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-serif text-2xl mx-auto mb-4">
                    {member.name[0]}
                  </div>
                  <h3 className="font-semibold mb-1">{member.name}</h3>
                  <p className="text-xs text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
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
