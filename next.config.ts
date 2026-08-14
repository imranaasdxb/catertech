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

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  {
    key: "Content-Security-Policy",
    value: "base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'",
  },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
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
