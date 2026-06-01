import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import ClientProviders from "@/components/layout/ClientProviders";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Catertech — Premium Catering & Event Equipment Dubai",
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
    <html lang="en">
      <body className={`${dmSans.variable} ${syne.variable} font-sans antialiased`}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
