import Image from "next/image";
import { Metadata } from "next";
import { BOOKING_URL, IMAGES, PHONE, PHONE_HREF, SOCIAL, SITE_URL, ADDRESS, ADDRESS_URL } from "@/lib/constants";
import { ScrollReveal } from "@/components/ScrollReveal";
import { TerminalKicker } from "@/components/primitives/TerminalKicker";
import { StatusPill } from "@/components/primitives/StatusPill";
import { GradientMesh } from "@/components/primitives/GradientMesh";

export const metadata: Metadata = {
  title: "Deals & Promotions | Jet Ski & Boat Rental Discounts Ocean City MD",
  description:
    "Save on jet ski and pontoon boat rentals in Ocean City, MD. Current deals: buy 3 jet ski rides get the 4th free, group discounts, sunset specials, gift cards, and more.",
  keywords: [
    "ocean city jet ski deals",
    "pontoon boat discount ocean city md",
    "Angler Watersports promotions",
    "ocean city gift card water sports",
    "jet ski group discount ocean city",
    "boat rental deals ocean city maryland",
    "cheap jet ski rental ocean city",
    "pontoon boat coupon ocean city",
  ],
  alternates: { canonical: `${SITE_URL}/promotions` },
  openGraph: {
    images: ["/og-logo.png"],
    title: "Deals & Promotions | Jet Ski & Boat Rental Discounts Ocean City MD",
    description:
      "Save on jet ski and pontoon boat rentals in Ocean City, MD. Gift cards, group discounts, and more.",
    url: `${SITE_URL}/promotions`,
  },
};

const PROMOTIONS = [
  {
    featured: true,
    tag: "Featured",
    code: "BUY3GET1",
    title: "Buy 3 Jet Ski Runs, Get the 4th FREE",
    description:
      "Bring the whole crew and save big. Book 3 jet ski rentals for your group and the 4th is on us — completely free. Available on sunrise and sunset slots.",
    details: [
      "Book 3 jet ski rentals for your group",
      "The 4th ride is on us — completely free",
      "Sunrise & sunset slots only",
    ],
    cta: "Book & Save",
    link: BOOKING_URL,
    image: IMAGES.promo,
  },
  {
    featured: false,
    tag: "Groups",
    code: "GROUP6+",
    title: "Group Discounts",
    description:
      "Planning a big outing? Contact us directly for special rates on jet ski and pontoon rentals for parties of 6 or more.",
    details: [
      "Parties of 6+ qualify",
      "Applies to jet skis and pontoons",
      "Custom quote by phone",
    ],
    cta: "Call for Quote",
    link: PHONE_HREF,
    image: IMAGES.group1,
  },
  {
    featured: false,
    tag: "Best Value",
    code: "GOLDEN",
    title: "Sunrise & Sunset Slots",
    description:
      "The most magical times on the water — and where the best pricing lives. Book early or late for the best experience and rate.",
    details: [
      "Lower rates on early & late slots",
      "Best lighting for photos",
      "Fewer crowds, more open water",
    ],
    cta: "Check Availability",
    link: BOOKING_URL,
    image: IMAGES.scenery2,
  },
  {
    featured: false,
    tag: "Tip",
    code: "EARLY",
    title: "Book Early, Save Your Spot",
    description:
      "The earlier you book, the better your chances at the slot you want. Peak summer weekends sell out fast.",
    details: [
      "Guaranteed slot when booked ahead",
      "Peak weekends sell out fast",
      "Free cancellation on weather",
    ],
    cta: "Book Now",
    link: BOOKING_URL,
    image: IMAGES.jetski2,
  },
];

export default function PromotionsPage() {
  const featured = PROMOTIONS.find((p) => p.featured);
  const others = PROMOTIONS.filter((p) => !p.featured);

  return (
    <>
      {/* HERO */}
      <section className="relative h-[60vh] min-h-[440px] max-h-[640px] flex items-center justify-center overflow-hidden">
        <Image src={IMAGES.group4} alt="Group enjoying jet ski and pontoon boat deals in Ocean City MD" fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-deep/70 via-bg/60 to-bg" />
        <GradientMesh variant="hero" grid />
        <div className="relative z-10 text-center text-ink px-4 max-w-4xl mx-auto">
          <div className="flex justify-center mb-5">
            <StatusPill tone="accent" label="Active Deals" />
          </div>
          <TerminalKicker prefix="PROMOS" label="2026_SEASON" className="mb-5 justify-center" />
          <h1 className="text-4xl md:text-6xl font-bold leading-[0.95] mb-5 tracking-tight">
            Deals &amp;<br />
            <span className="text-accent-hi">Promotions.</span>
          </h1>
          <p className="text-base md:text-lg text-ink-dim max-w-2xl mx-auto">
            The best deals on jet ski and pontoon rentals in Ocean City.
          </p>
        </div>
      </section>

      {/* FEATURED DEAL */}
      {featured && (
        <section className="relative py-20 md:py-24 overflow-hidden">
          <GradientMesh variant="subtle" grid={false} />
          <div className="relative max-w-6xl mx-auto px-4">
            <ScrollReveal>
              <div className="bg-surface/40 border border-accent/40 rounded-xl overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative min-h-[320px] md:min-h-[440px]">
                    <Image src={featured.image} alt={featured.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-bg-deep/40" />
                    <div className="absolute top-5 left-5 px-3 py-1 bg-bg/80 backdrop-blur-md border border-accent/40 rounded font-mono text-[10px] uppercase tracking-[0.18em] text-accent-hi">
                      {featured.code}
                    </div>
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <TerminalKicker prefix={featured.tag.toUpperCase()} label="DEAL" className="mb-5" />
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-ink mb-5 tracking-tight leading-[1.05]">
                      {featured.title}
                    </h2>
                    <p className="text-ink-dim text-base md:text-lg leading-relaxed mb-6">
                      {featured.description}
                    </p>
                    <div className="bg-bg-deep/60 border border-border rounded-lg p-4 mb-6">
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
                        &gt; HOW IT WORKS
                      </p>
                      <ul className="space-y-2.5">
                        {featured.details.map((d, i) => (
                          <li key={i} className="flex items-start gap-3 text-ink text-sm">
                            <span className="mono-num text-accent-hi mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <a
                      href={featured.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-bg font-bold text-base rounded-md hover:bg-accent-hi transition-all shadow-[0_0_40px_rgba(212,160,23,0.2)]"
                    >
                      {featured.cta}
                      <span className="mono-num">→</span>
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* GIFT CARDS */}
      <section className="relative py-20 md:py-24 bg-bg-deep border-y border-border overflow-hidden">
        <GradientMesh variant="panel" />
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <TerminalKicker prefix="GIFT" label="ADVENTURE" className="mb-5" />
              <h2 className="text-3xl md:text-5xl font-bold text-ink mb-5 tracking-tight leading-[1.05]">
                The Gift of<br />
                <span className="text-accent-hi">Open Water.</span>
              </h2>
              <p className="text-ink-dim text-base md:text-lg leading-relaxed mb-6 max-w-lg">
                Know someone who loves the water? Angler Watersports gift cards let
                them pick their own adventure. Any amount, delivered instantly.
              </p>
              <ul className="space-y-2.5 mb-8">
                {[
                  "Any dollar amount",
                  "Delivered instantly via email",
                  "Valid for all rentals",
                  "Never expires",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-ink">
                    <span className="mono-num text-accent-hi">◦</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-bg font-bold rounded-md hover:bg-accent-hi transition-colors"
              >
                Purchase a Gift Card
                <span className="mono-num">→</span>
              </a>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="flex justify-center">
                {/* Gift card visual */}
                <div className="relative w-full max-w-md">
                  <div className="absolute inset-4 bg-accent/20 rounded-2xl blur-2xl" />
                  <div className="relative rounded-2xl p-7 border border-accent/40 shadow-2xl aspect-[8/5] flex flex-col justify-between overflow-hidden"
                       style={{ background: "linear-gradient(135deg, #0F1729 0%, #172338 100%)" }}>
                    <div className="absolute inset-0 grid-bg opacity-40" />
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

                    <div className="relative flex justify-between items-start">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-1">
                          Gift Card
                        </p>
                        <p className="text-2xl font-bold text-ink leading-tight">
                          Angler
                        </p>
                        <p className="text-xs font-mono uppercase tracking-[0.2em] text-accent-hi">
                          Watersports
                        </p>
                      </div>
                      <div className="w-11 h-11 rounded-md bg-accent/10 border border-accent/40 flex items-center justify-center">
                        <span className="mono-num text-accent-hi text-xs font-bold">AWS</span>
                      </div>
                    </div>

                    <div className="relative flex justify-between items-end">
                      <div>
                        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-mute mb-1">
                          Amount
                        </p>
                        <p className="mono-num text-3xl font-bold text-ink">
                          You Choose
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-mute">
                          Ocean City · MD
                        </p>
                        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-mute">
                          Jet Ski · Pontoon
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* MORE DEALS */}
      <section className="relative py-24 md:py-28 overflow-hidden">
        <GradientMesh variant="subtle" grid={false} />
        <div className="relative max-w-6xl mx-auto px-4">
          <ScrollReveal className="text-center mb-14 max-w-2xl mx-auto">
            <TerminalKicker prefix="MORE" label="WAYS_TO_SAVE" className="mb-5 justify-center" />
            <h2 className="text-3xl md:text-5xl font-bold text-ink tracking-tight">
              Other Ways to Save
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-4">
            {others.map((promo, i) => (
              <ScrollReveal key={promo.title} delay={i * 100}>
                <div className="bg-surface/40 border border-border rounded-xl overflow-hidden h-full flex flex-col hover:border-accent/40 transition-colors">
                  <div className="relative h-48 border-b border-border">
                    <Image src={promo.image} alt={promo.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/70 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-bg/80 backdrop-blur-md border border-accent/40 rounded font-mono text-[9px] uppercase tracking-[0.18em] text-accent-hi">
                      {promo.code}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-2">
                      &gt; {promo.tag}
                    </p>
                    <h3 className="text-xl font-bold text-ink mb-3 tracking-tight">{promo.title}</h3>
                    <p className="text-ink-dim text-sm leading-relaxed mb-5 flex-1">{promo.description}</p>
                    <ul className="space-y-1.5 text-sm text-ink-dim mb-5">
                      {promo.details.map((d) => (
                        <li key={d} className="flex items-start gap-2">
                          <span className="mono-num text-accent mt-0.5 text-xs">◦</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href={promo.link}
                      target={promo.link.startsWith("tel") ? undefined : "_blank"}
                      rel={promo.link.startsWith("tel") ? undefined : "noopener noreferrer"}
                      className="block w-full py-3 bg-accent text-bg font-bold rounded-md hover:bg-accent-hi transition-colors text-center text-sm"
                    >
                      {promo.cta}
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FLASH DEALS (SOCIAL) */}
      <section className="py-20 md:py-24 bg-bg-deep border-y border-border">
        <div className="max-w-3xl mx-auto px-4">
          <ScrollReveal>
            <div className="bg-surface/40 border border-border rounded-xl p-8 md:p-12 text-center">
              <TerminalKicker prefix="FLASH" label="FOLLOW_FOR_MORE" className="mb-5 justify-center" />
              <h2 className="text-2xl md:text-3xl font-bold text-ink mb-3 tracking-tight">
                Flash Deals &amp; Pop-Ups
              </h2>
              <p className="text-ink-dim text-base mb-8 max-w-xl mx-auto">
                Last-minute deals, flash sales, and exclusive promos drop on our
                Instagram and TikTok.
              </p>
              <div className="flex justify-center gap-3">
                <a
                  href={SOCIAL.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-border text-ink font-mono text-sm uppercase tracking-[0.14em] rounded-md hover:border-accent/50 hover:bg-surface transition-colors"
                >
                  Instagram ↗
                </a>
                <a
                  href={SOCIAL.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-border text-ink font-mono text-sm uppercase tracking-[0.14em] rounded-md hover:border-accent/50 hover:bg-surface transition-colors"
                >
                  TikTok ↗
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-24 md:py-28 overflow-hidden">
        <Image src={IMAGES.scenery2} alt="Sunset boat ride on Assateague Bay Ocean City Maryland" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-deep/90 via-bg-deep/85 to-bg-deep" />
        <GradientMesh variant="hero" grid />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <ScrollReveal>
            <TerminalKicker prefix="BOOK" label="DONT_MISS" className="mb-5 justify-center" />
            <h2 className="text-4xl md:text-6xl font-bold text-ink mb-6 tracking-tight leading-[1.02]">
              Lock in<br />
              <span className="text-accent-hi">your slot.</span>
            </h2>
            <p className="text-base md:text-lg text-ink-dim mb-10 max-w-xl mx-auto">
              The best deals fill up first. Book your adventure today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-12 py-4 bg-accent text-bg font-bold text-lg rounded-md hover:bg-accent-hi transition-all shadow-[0_0_60px_rgba(212,160,23,0.3)]"
              >
                Book Now
              </a>
              <a
                href={PHONE_HREF}
                className="px-8 py-4 border border-border text-ink font-mono text-sm uppercase tracking-[0.14em] rounded-md hover:border-accent/50 transition-colors"
              >
                <span className="mono-num normal-case text-base">{PHONE}</span>
              </a>
            </div>
            <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute">
              <a href={ADDRESS_URL} target="_blank" rel="noopener noreferrer" className="hover:text-accent-hi transition-colors">
                ◆ {ADDRESS}
              </a>
            </p>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
