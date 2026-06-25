import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import TrustBar from "@/components/sections/TrustBar";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import TradeCTASection from "@/components/sections/TradeCTASection";

import JourneySection from "@/components/sections/JourneySection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import DeseriPartner from "@/components/sections/DeseriPartner";
import BlogPreview from "@/components/sections/BlogPreview";
import JourneyTeaser from "@/components/sections/JourneyTeaser";

export const revalidate = 60;

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <TrustBar />
      <FeaturedProducts />
      <TradeCTASection />
      <JourneyTeaser />
      {/* <JourneySection /> */}
      <TestimonialsSection />
      <DeseriPartner />
      <BlogPreview />
    </>
  );
}
