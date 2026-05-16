import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import ClientProviders from "@/components/layout/ClientProviders";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
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
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
