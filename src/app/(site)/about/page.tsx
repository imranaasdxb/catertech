import Container from "@/components/Container";
import {
  ArrowRight,
  Globe,
  MapPin,
  Plus,
  Quote,
  Users,
  Utensils,
  Truck,
  Building2,
  CalendarDays,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/* ─────────────────────────────── data ─────────────────────────────────── */

const whyItems = [
  {
    title: "Quality that holds up",
    body: "Well-maintained equipment and food prepared to a standard you'd put your own name on — every booking, every time.",
  },
  {
    title: "Built around you",
    body: "Custom event setups for any size, with flexible packages priced to fit the brief instead of inflating it.",
  },
  {
    title: "A team that delivers",
    body: "Skilled, friendly crew who run the floor with the discipline of seasoned professionals and the warmth of good hosts.",
  },
  {
    title: "Right the first time",
    body: "We sweat the last-minute details so you don't have to — and we stand behind every event until it's done well.",
  },
];

const serviceGroups = [
  {
    icon: Utensils,
    label: "Food & Service",
    tone: "bg-[#fef9c3]",
    items: ["Food catering", "On-site cooking setups", "Service crew supply"],
  },
  {
    icon: CalendarDays,
    label: "Events & Occasions",
    tone: "bg-[#dbeafe]",
    items: [
      "Event & party management",
      "Corporate events",
      "Seminars & conferences",
      "Hotel & venue supply",
    ],
  },
  {
    icon: Building2,
    label: "Equipment Rental",
    tone: "bg-accent-soft",
    items: [
      "Kitchen equipment",
      "Catering & serving equipment",
      "Furniture & seating",
      "Linen",
      "Mobile kitchens",
      "BBQ, ovens & saj",
    ],
  },
  {
    icon: Truck,
    label: "Logistics",
    tone: "bg-[#dcfce7]",
    items: ["Open trucks with tail-lift", "Mini buses & vans", "Delivery & collection"],
  },
];

const stats = [
  { value: "2016", label: "Serving the UAE since" },
  { value: "7", label: "Emirates covered" },
  { value: "10+", label: "Services under one roof" },
  { value: "GCC", label: "Reach across the region" },
];

const emirates = [
  { en: "Dubai", ar: "دبي" },
  { en: "Abu Dhabi", ar: "أبو ظبي" },
  { en: "Sharjah", ar: "الشارقة" },
  { en: "Ras Al Khaimah", ar: "رأس الخيمة" },
  { en: "Ajman", ar: "عجمان" },
  { en: "Fujairah", ar: "الفجيرة" },
  { en: "Umm Al Quwain", ar: "أم القيوين" },
  { en: "Al Ain", ar: "العين" },
];

const partners = [
  "Hotels & hospitality venues",
  "Professional caterers & F&B operators",
  "Corporate & business clients",
  "Conference & seminar organisers",
  "Wedding, party & event planners",
  "Private hosts & families",
];

const faqs = [
  {
    q: "Which areas in the UAE does CaterTech serve?",
    a: "We serve all seven emirates — Dubai, Abu Dhabi, Sharjah, Ras Al Khaimah, Ajman, Fujairah and Umm Al Quwain — plus Al Ain and clients across the wider GCC and Middle East, all from our base in Ras Al Khor, Dubai.",
  },
  {
    q: "Does CaterTech provide both catering and equipment rental?",
    a: "Yes. We're a true one-stop partner: food catering, full event and party management, professional service crew, and rental of kitchen equipment, catering and serving equipment, event furniture, linen and mobile kitchens.",
  },
  {
    q: "Who does CaterTech work with?",
    a: "Hotels and hospitality venues, professional caterers and F&B operators, corporate clients, conference and seminar organisers, wedding and party planners, and private hosts across the Emirates.",
  },
  {
    q: "Does CaterTech deliver across the Emirates?",
    a: "Yes — we run our own delivery and collection fleet, including open trucks with tail-lifts, mini buses and vans, providing competitively priced logistics to events anywhere in the UAE.",
  },
];

function WhyCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="relative min-h-[230px] overflow-visible rounded-[32px] border border-[#e5e7eb] bg-white px-7 pb-8 pt-10">
      {/* smaller top-right inward notch */}
      <div
        className="pointer-events-none absolute -right-px -top-px z-[1] h-10 w-10 rounded-bl-full bg-white"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-0 top-0 z-[2] h-10 w-10 rounded-bl-full border-b border-l border-[#e5e7eb]"
        aria-hidden
      />
      {/* green dot sits outside the inward corner */}
      <span
        className="absolute -right-2 -top-2 z-[3] h-9 w-9 rounded-full bg-[#2db87a] shadow-[0_2px_8px_rgba(45,184,122,0.35)]"
        aria-hidden
      />
      <h3 className="relative z-[4] max-w-[88%] text-lg font-bold uppercase leading-snug tracking-wide text-primary">
        {title}
      </h3>
      <p className="relative z-[4] mt-5 text-sm leading-[1.75] text-[#555555]">{body}</p>
    </article>
  );
}

/* ─────────────────────────────── page ─────────────────────────────────── */

export default function AboutPage() {
  return (
    <main className="bg-white">

      {/* ══════════════════════════════════════════════════════
          HERO
          ══════════════════════════════════════════════════ */}
      <section className="overflow-hidden bg-white pt-32 pb-16 md:pt-40 md:pb-20">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-block rounded-full border border-[#e8e4df] bg-[#faf9f7] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-body-muted">
              About CaterTech · Catering &amp; Events · UAE
            </span>

            <h1 className="mt-6 text-[2.6rem] font-bold leading-[1.07] tracking-[-0.03em] text-ink sm:text-[3.2rem] lg:text-[3.8rem]">
              <span className="block font-sans">The UAE&apos;s one-stop partner</span>
              <span
                className="mt-1 block font-normal italic text-ink"
                style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
              >
                for catering, events &amp; equipment rental.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-body-muted md:text-lg">
              CaterTech Food Catering Services L.L.C. brings food, professional crew, event
              management and a deep inventory of catering, kitchen and furniture equipment
              together under one roof — delivering flawless events across Dubai, Abu Dhabi,
              Sharjah, Ras Al Khaimah and the wider UAE from our base in Ras Al Khor.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/services"
                className="btn-brand min-h-11 rounded-xl px-6 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em]"
              >
                <span className="btn-brand__content gap-2">
                  Explore our services
                  <span className="btn-brand__arrow h-8 w-8" aria-hidden>
                    <ArrowRight className="size-4" strokeWidth={2} />
                  </span>
                </span>
              </Link>
              <Link
                href="/contact"
                className="btn-brand min-h-11 rounded-xl px-6 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em]"
              >
                <span className="btn-brand__content gap-2">
                  Talk to our team
                  <span className="btn-brand__arrow h-8 w-8" aria-hidden>
                    <ArrowRight className="size-4" strokeWidth={2} />
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════
          OUR STORY  ─  blog-style article layout
          ══════════════════════════════════════════════════ */}
      <section className="border-t border-[#e8e4df] bg-white py-16 md:py-24">
        <Container>
          <article className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-12">
              {/* left: blog meta + cover */}
              <aside className="min-w-0 lg:pr-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c49a6c]">
                  Our story
                </p>

                <h2 className="mt-5 text-[2rem] font-bold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[2.35rem] lg:text-[2.75rem]">
                  <span className="block font-sans">We started with a simple belief:</span>
                  <span
                    className="mt-1 block font-normal italic text-ink"
                    style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
                  >
                    a great event shouldn&apos;t need five different suppliers.
                  </span>
                </h2>

                <div className="relative mt-8 h-[200px] w-full overflow-hidden rounded-2xl bg-[#f3f4f6] sm:h-[220px] lg:h-[240px]">
                  <Image
                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=840&q=85"
                    alt="CaterTech hospitality and events in the UAE"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 90vw, 480px"
                  />
                </div>

                <p className="mt-6 text-sm text-body-muted">
                  CaterTech · Since 2016 · Ras Al Khor, Dubai
                </p>
              </aside>

              {/* right: article body */}
              <div className="min-w-0 lg:pl-2 xl:pl-4">
                <p className="mb-10 border-l-[3px] border-primary/30 pl-5 text-[1.125rem] font-medium leading-[1.75] text-[#2a2a32] md:text-[1.25rem] md:leading-[1.72]">
                  So we became all of them — food, crew, equipment and logistics under one
                  roof for hosts across the UAE.
                </p>

                <div className="text-[17px] leading-[1.85] text-[#3d3d45]">
                  <p className="mb-6">
                    Catertech Food Catering Services L.L.C. was built to take the friction
                    out of hosting in the Emirates. From an intimate private dinner in Dubai
                    to a full corporate banquet in Abu Dhabi or a wedding in Sharjah, our
                    role is the same — combine genuinely good food, dependable equipment and
                    a professional team into one seamless catering service, at a price that
                    makes sense.
                  </p>
                  <p className="mb-6">
                    Our management team carries years of hands-on experience across
                    hospitality, catering and event logistics in the Gulf. That depth is why
                    hoteliers, professional caterers, conference organisers and private hosts
                    across the UAE trust us not just to supply, but to advise — recommending
                    the right setup for the room, the guest count and the occasion.
                  </p>
                  <blockquote className="my-8 border-l-4 border-primary/25 bg-[#faf9f7] py-4 pl-5 pr-4 text-[1.05rem] italic leading-[1.75] text-[#2a2a32]">
                    Need coloured linen for a theme? A mobile kitchen for an outdoor feast in
                    Ras Al Khaimah? Open trucks with tail-lifts to move it all? It&apos;s handled.
                  </blockquote>
                  <p>
                    And if there&apos;s something you can&apos;t find on our site, call us — we&apos;ll
                    source it at no extra cost. You&apos;re always welcome to visit our Ras Al Khor
                    premises in Dubai to see your hire before you commit.
                  </p>
                </div>
              </div>
            </div>
          </article>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════
          OUR FOUNDER
          ══════════════════════════════════════════════════ */}
      <section className="border-t border-[#e8e4df] bg-white py-16 md:py-24">
        <Container>
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-stretch gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-12">
            {/* portrait — stretches to match text column height */}
            <div className="relative mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none lg:pr-4">
              <div
                className="pointer-events-none absolute -left-3 top-6 bottom-6 w-[88%] rounded-3xl bg-primary-soft/60"
                aria-hidden
              />
              <div className="relative flex h-full min-h-[380px] flex-col overflow-hidden rounded-3xl border border-[#e8e4df] bg-[#faf9f7] shadow-[0_20px_60px_rgba(20,19,31,0.08)] sm:min-h-[440px] lg:min-h-[620px]">
                <div className="relative h-full min-h-0 w-full flex-1">
                  <Image
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=85"
                    alt="CaterTech founder"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 90vw, 480px"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#1a1a2e]/50 via-transparent to-transparent"
                    aria-hidden
                  />
                </div>

                <div className="absolute bottom-4 right-4 z-10 rounded-2xl border border-[#e8e4df] bg-white px-4 py-3 shadow-[0_12px_40px_rgba(20,19,31,0.1)]">
                  <p className="text-xl font-bold tracking-tight text-primary">20+</p>
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-body-muted">
                    Years in UAE hospitality
                  </p>
                </div>
              </div>
            </div>

            {/* content */}
            <div className="flex flex-col justify-center lg:pl-2 xl:pl-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
                Our founder
              </p>
              <h2 className="mt-4 text-3xl font-bold leading-[1.12] tracking-tight text-ink md:text-4xl">
                Built on hospitality,
                <br />
                <span
                  className="font-normal italic"
                  style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
                >
                  grown with trust.
                </span>
              </h2>

              <p className="mt-6 text-base leading-[1.85] text-body-muted">
                CaterTech was founded on a straightforward idea: hosts in the UAE deserve one
                reliable partner for food, crew, equipment and logistics — not a patchwork of
                suppliers. From a small Dubai operation to a full-service catering and events
                company, our founder has stayed hands-on in every part of the business.
              </p>
              <p className="mt-4 text-base leading-[1.85] text-body-muted">
                That same founder-led approach still shapes how we work today — visiting venues,
                advising on setups, and making sure every event is delivered to a standard we
                would put our own name on.
              </p>

              <blockquote className="mt-8 flex gap-4 rounded-2xl border border-[#e8e4df] bg-[#faf9f7] p-6">
                <Quote className="h-8 w-8 shrink-0 text-[#C9A84C] opacity-80" strokeWidth={1.5} aria-hidden />
                <p
                  className="text-base italic leading-[1.7] text-ink"
                  style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
                >
                  &ldquo;An event is only as good as the team behind it. We built CaterTech so
                  clients never have to wonder who is showing up — or whether they will.&rdquo;
                </p>
              </blockquote>

              <div className="mt-8 flex flex-wrap gap-8 border-t border-[#e8e4df] pt-8">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-body-muted">
                    Role
                  </p>
                  <p className="mt-1 text-sm font-semibold text-ink">Founder &amp; Managing Director</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-body-muted">
                    Founded
                  </p>
                  <p className="mt-1 text-sm font-semibold text-ink">2016 · Dubai, UAE</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-body-muted">
                    Base
                  </p>
                  <p className="mt-1 text-sm font-semibold text-ink">Ras Al Khor, Dubai</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════
          STATS  ─  horizontal bar with dividers
          ══════════════════════════════════════════════════ */}
      <section className="border-y border-[#e8e4df] bg-white py-10 md:py-14">
        <Container>
          <div className="grid grid-cols-2 divide-x divide-[#e8e4df] md:grid-cols-4">
            {stats.map(({ value, label }) => (
              <div key={label} className="px-6 text-center first:pl-0 last:pr-0 md:px-10">
                <p className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">
                  {value}
                </p>
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-body-muted">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════
          WHY HOSTS CHOOSE US  ─  white cards with notch
          ══════════════════════════════════════════════════ */}
      <section className="bg-white py-16 md:py-24">
        <Container>
          <div className="mb-12 max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
              Why hosts choose us
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-[1.12] tracking-tight text-ink md:text-4xl">
              The difference is in how we show up.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {whyItems.map(({ title, body }) => (
              <WhyCard key={title} title={title} body={body} />
            ))}
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════
          EVERYTHING UNDER ONE ROOF  ─  4 service columns
          ══════════════════════════════════════════════════ */}
      <section className="border-t border-[#e8e4df] bg-[#faf9f7] py-16 md:py-24">
        <Container>
          <div className="mb-12 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
                Everything under one roof
              </p>
              <h2 className="mt-3 max-w-xl text-3xl font-bold leading-[1.12] tracking-tight text-ink md:text-4xl">
                Most clients come for one thing and stay because we handle the rest.
              </h2>
            </div>
            <p className="text-sm text-body-muted lg:text-right">Here&apos;s the full range.</p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {serviceGroups.map(({ icon: Icon, label, tone, items }) => (
              <div
                key={label}
                className="rounded-2xl border border-[#e8e4df] bg-white p-6 shadow-[0_4px_24px_rgba(20,19,31,0.05)]"
              >
                <span className={`flex h-11 w-11 items-center justify-center rounded-full ${tone}`}>
                  <Icon className="h-5 w-5 text-ink" strokeWidth={1.75} aria-hidden />
                </span>
                <h3 className="mt-4 text-sm font-bold uppercase tracking-[0.12em] text-ink">
                  {label}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-body-muted">
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#C9A84C]" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════
          WHERE WE SERVE
          ══════════════════════════════════════════════════ */}
      <section className="border-t border-[#e8e4df] bg-white py-16 md:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
                Where we serve
              </p>
              <h2 className="mt-3 text-3xl font-bold leading-[1.12] tracking-tight text-ink md:text-4xl">
                Catering &amp; event equipment, delivered across the Emirates.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-body-muted">
                From our Ras Al Khor base in Dubai, CaterTech delivers catering, event
                management and equipment rental to clients in every emirate of the UAE —
                and supports partners across the wider GCC and Middle East.
              </p>
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#e8e4df] bg-[#faf9f7] px-5 py-4">
                <Globe className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.75} aria-hidden />
                <p className="text-sm leading-snug text-body-muted">
                  Also supporting events and hospitality partners across the{" "}
                  <strong className="font-semibold text-ink">GCC &amp; wider Middle East.</strong>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {emirates.map(({ en, ar }) => (
                <div
                  key={en}
                  className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-[#e8e4df] bg-[#faf9f7] px-3 py-5 text-center"
                >
                  <MapPin className="h-4 w-4 text-[#C9A84C]" strokeWidth={1.75} aria-hidden />
                  <span className="text-sm font-bold text-ink">{en}</span>
                  <span className="text-xs text-body-muted" dir="rtl">{ar}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════
          WHO WE WORK WITH
          ══════════════════════════════════════════════════ */}
      <section className="border-t border-[#e8e4df] bg-[#faf9f7] py-16 md:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[340px_1fr] lg:gap-16">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
                Who we work with
              </p>
              <h2 className="mt-3 text-3xl font-bold leading-[1.12] tracking-tight text-ink md:text-4xl">
                Trusted partners across UAE hospitality.
              </h2>
              <p className="mt-4 text-sm text-body-muted">Our clients &amp; partners</p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {partners.map((p) => (
                <div
                  key={p}
                  className="flex items-center gap-3 rounded-xl border border-[#e8e4df] bg-white px-5 py-4 shadow-[0_2px_12px_rgba(20,19,31,0.04)]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft">
                    <Users className="h-4 w-4 text-primary" strokeWidth={1.75} aria-hidden />
                  </span>
                  <span className="text-sm font-semibold text-ink">{p}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════
          FAQ
          ══════════════════════════════════════════════════ */}
      <section className="border-t border-[#e8e4df] bg-[#faf9f7] py-16 md:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-16">
            {/* left panel */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
                Good to know
              </p>
              <h2 className="mt-4 text-3xl font-bold leading-[1.12] tracking-tight text-ink md:text-4xl">
                Frequently asked questions
              </h2>
              <p className="mt-5 text-base leading-relaxed text-body-muted">
                Quick answers about where we work, what we supply, and how we deliver
                across the UAE.
              </p>
              <Link
                href="/contact"
                className="btn-brand mt-8 inline-flex min-h-11 rounded-xl px-6 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em]"
              >
                <span className="btn-brand__content gap-2">
                  Talk to our team
                  <span className="btn-brand__arrow h-8 w-8" aria-hidden>
                    <ArrowRight className="size-4" strokeWidth={2} />
                  </span>
                </span>
              </Link>
            </div>

            {/* right accordion list */}
            <div className="space-y-4">
              {faqs.map(({ q, a }, i) => (
                <details
                  key={q}
                  className="group overflow-hidden rounded-2xl border border-[#e8e4df] bg-white transition-shadow open:shadow-[0_12px_40px_rgba(20,19,31,0.08)]"
                  {...(i === 0 ? { open: true } : {})}
                >
                  <summary className="flex cursor-pointer list-none items-start gap-4 px-6 py-5 [&::-webkit-details-marker]:hidden">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex flex-1 items-center justify-between gap-4">
                      <span className="text-left text-base font-bold leading-snug text-ink">
                        {q}
                      </span>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#e8e4df] bg-[#faf9f7] text-body-muted transition-colors group-open:border-primary group-open:bg-primary group-open:text-white">
                        <Plus
                          className="h-4 w-4 transition-transform duration-300 group-open:rotate-45"
                          strokeWidth={2}
                          aria-hidden
                        />
                      </span>
                    </span>
                  </summary>
                  <div className="border-t border-[#e8e4df] px-6 pb-6 pt-4 pl-[4.5rem]">
                    <p className="text-sm leading-[1.85] text-body-muted">{a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
