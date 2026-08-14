import type { StaticImageData } from "next/image";
import partnerAasLogo from "@/assets/partners/partner-aas-logo.png";
import partnerTruescaleLogo from "@/assets/partners/partner-truescale-logo.png";

export type PartnerEntry = {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  website: string;
  websiteLabel: string;
  logo: StaticImageData;
  logoAlt: string;
  services?: string[];
  accent?: "gold" | "ember";
};

export const PARTNERS: PartnerEntry[] = [
  {
    id: "aas",
    name: "AAS Information Technology",
    category: "IT & Software",
    tagline: "Secure systems. Smarter operations.",
    description:
      "AAS Information Technology implements secure software solutions, enterprise IT consulting, and scalable digital transformation strategies tailored for your business. Whether you are ready to discuss a project or explore their range of services, they are here to help.",
    website: "https://aasit.ae/",
    websiteLabel: "aasit.ae",
    logo: partnerAasLogo,
    logoAlt: "AAS Information Technology logo",
    services: [
      "Enterprise software development",
      "IT consulting & strategy",
      "Secure cloud & infrastructure",
      "Digital transformation",
    ],
    accent: "gold",
  },
  {
    id: "truescale",
    name: "TrueScale",
    category: "Marketing & Creative",
    tagline: "Built to scale. Made for the Middle East.",
    description:
      "TrueScale is a performance-driven creative marketing agency helping modern businesses grow through strategy, branding, content, advertising, and scalable digital systems.",
    website: "https://truescale.netlify.app/",
    websiteLabel: "truescale.netlify.app",
    logo: partnerTruescaleLogo,
    logoAlt: "TrueScale logo",
    services: [
      "Branding & Strategy",
      "Digital Performance",
      "Creative Production",
      "Digital Development",
    ],
    accent: "ember",
  },
];
