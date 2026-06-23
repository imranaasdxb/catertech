import type { NextConfig } from "next";

function hostnameFromPublicUrl(raw: string | undefined): string | null {
  const value = raw?.trim();
  if (!value) return null;
  try {
    return new URL(value.startsWith("http") ? value : `https://${value}`).hostname;
  } catch {
    return null;
  }
}

const r2PublicHostname = hostnameFromPublicUrl(process.env.R2_PUBLIC_URL);

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "**.r2.dev",
        pathname: "/**",
      },
      ...(r2PublicHostname
        ? [
            {
              protocol: "https" as const,
              hostname: r2PublicHostname,
              pathname: "/**",
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
