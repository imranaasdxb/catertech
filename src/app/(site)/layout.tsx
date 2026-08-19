import type { ReactNode } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import ConnectUsTab from "@/components/layout/ConnectUsTab";
import QuoteBasketTab from "@/components/layout/QuoteBasketTab";
import SiteRoutePrefetcher from "@/components/layout/SiteRoutePrefetcher";
import Faqs from "@/components/sections/Faqs";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <SiteRoutePrefetcher />
      <main>{children}</main>
      <Faqs />
      <Footer />
      <ConnectUsTab />
      <QuoteBasketTab />
      <WhatsAppButton />
    </>
  );
}
