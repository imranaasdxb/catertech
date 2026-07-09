import type { ReactNode } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import ConnectUsTab from "@/components/layout/ConnectUsTab";
import Faqs from "@/components/sections/Faqs";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Faqs />
      <Footer />
      <ConnectUsTab />
      <WhatsAppButton />
    </>
  );
}
