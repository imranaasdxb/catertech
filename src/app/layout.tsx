import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import ClientProviders from "@/components/layout/ClientProviders";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Catertech | Premium Catering & Event Equipment Dubai",
  description:
    "Dubai's trusted partner for catering equipment, event equipment rental, and kitchen equipment since 2005. Serving hotels, venues & events across UAE.",
  keywords: "catering equipment Dubai, event equipment rental, kitchen equipment UAE, Catertech",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={nunito.variable} data-scroll-behavior="smooth">
      <body className="font-sans antialiased">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
