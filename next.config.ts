import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Permanent redirects for retired routes. /promotions was retired
     and replaced with /gift-cards (the only piece worth keeping). */
  async redirects() {
    return [
      {
        source: "/promotions",
        destination: "/gift-cards",
        permanent: true,
      },
    ];
  },
  images: {
    // Allow local SVG assets (e.g. /angler-logo.svg). Safe because we only
    // render static files under /public that we control.
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.squarespace-cdn.com",
      },
      {
        protocol: "https",
        hostname: "website-media.com",
      },
    ],
  },
};

export default nextConfig;
