import tradeBgImage from "@/assets/tradebg.png";
import { BrandCtaWithIcon } from "@/components/ui/WaterRiseCta";
import Container from "@/components/Container";
import Image from "next/image";

const BRAND_PURPLE = "#322b81";
const BRAND_RED = "#c21722";

const PERKS = [
  { value: "4 hrs", label: "Enquiry response time" },
  { value: "All UAE", label: "Delivery coverage" },
  { value: "No minimum", label: "Order requirement" },
  { value: "Flexible", label: "Payment terms for trade" },
];

const INDUSTRIES = [
  "Hotels",
  "Event companies",
  "Restaurants",
  "Government",
  "Catering firms",
  "Hospitals",
];

const EMIRATES = ["Dubai", "Abu Dhabi", "Sharjah", "RAK", "Fujairah", "Ajman", "UAQ"];

export default function TradeCTASection() {
  return (
    <section
      className="relative isolate w-full overflow-hidden bg-[#f9f4ec] py-16 sm:py-20 lg:py-24"
      aria-labelledby="trade-cta-heading"
    >
      <Image
        src={tradeBgImage}
        alt=""
        fill
        className="-z-10 object-contain object-center sm:object-cover sm:object-center"
        sizes="100vw"
      />

      <Container className="relative z-10">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9ca3af]">
            For business
          </p>
          <h2
            id="trade-cta-heading"
            className="mt-3 text-3xl font-bold leading-[1.1] tracking-tight text-[#0a0a0a] sm:text-4xl lg:text-[2.65rem]"
          >
            Trade &amp;{" "}
            <span style={{ color: BRAND_PURPLE }}>Corporate</span>
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[#6b7280] sm:text-lg">
            Volume pricing, dedicated account support and formal quotes for hospitality
            procurement teams across the UAE.
          </p>
        </div>

        <div className="mt-14 grid gap-14 lg:mt-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-20 xl:gap-24">
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold leading-snug tracking-tight text-[#0a0a0a] sm:text-3xl lg:text-[2rem]">
              Supplying hotels, venues &amp; F&amp;B brands across the UAE.
            </h3>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-[#6b7280] sm:text-base">
              Trade and corporate accounts get our full catalogue, volume pricing and a dedicated
              account manager. Submit an enquiry or request a formal quote for your next project.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <BrandCtaWithIcon href="/trade/enquiry">Submit an enquiry</BrandCtaWithIcon>
              <BrandCtaWithIcon href="/trade/rfq">Request full quote</BrandCtaWithIcon>
            </div>

            <div className="mt-12">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c21722]">
                Sectors we serve
              </p>
              <ul className="mt-4 flex flex-wrap gap-2" role="list">
                {INDUSTRIES.map((ind) => (
                  <li key={ind}>
                    <span className="inline-block rounded-full border border-[#322b81]/25 bg-white/95 px-3.5 py-1.5 text-sm font-semibold text-[#0a0a0a] shadow-sm transition-colors duration-200 hover:border-[#322b81] hover:bg-[#322b81] hover:text-white">
                      {ind}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-12">
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:gap-x-12">
              {PERKS.map((p) => (
                <div key={p.label}>
                  <p
                    className="text-[2rem] font-bold leading-none tracking-tight sm:text-[2.35rem]"
                    style={{ color: BRAND_RED }}
                  >
                    {p.value}
                  </p>
                  <p className="mt-2 text-sm leading-snug text-[#6b7280]">{p.label}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c21722]">
                Delivery coverage
              </p>
              <ul className="mt-4 flex flex-wrap gap-2" role="list">
                {EMIRATES.map((em) => (
                  <li key={em}>
                    <span className="inline-block rounded-full border border-[#c21722]/30 bg-white/95 px-3.5 py-1.5 text-sm font-semibold text-[#322b81] shadow-sm transition-colors duration-200 hover:border-[#c21722] hover:bg-[#c21722] hover:text-white">
                      {em}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
