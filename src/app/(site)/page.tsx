import HeroSection from "@/components/sections/HeroSection";
import TrustBar from "@/components/sections/TrustBar";
import ServicesSection from "@/components/sections/ServicesSection";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import TradeCTASection from "@/components/sections/TradeCTASection";

import JourneySection from "@/components/sections/JourneySection";
import ClientLogos from "@/components/sections/ClientLogos";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import DeseriPartner from "@/components/sections/DeseriPartner";
import BlogPreview from "@/components/sections/BlogPreview";
import JourneyTeaser from "@/components/sections/JourneyTeaser";

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <ClientLogos />
      <ServicesSection />
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
