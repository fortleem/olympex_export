import type { NextConfig } from "next";

/**
 * Security headers applied to every response.
 *
 * Deliberately omitted (they would break the sandbox preview panel, which
 * embeds this app in a cross-origin iframe):
 * - `X-Frame-Options: DENY/SAMEORIGIN` and CSP `frame-ancestors`
 * - A strict CSP — the Next.js dev runtime requires 'unsafe-eval'
 *
 * Everything below is safe for iframed previews.
 */
const securityHeaders = [
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Only send the origin (not full URLs) to third parties
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Lock down sensitive browser capabilities
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=()",
  },
  // Force HTTPS on future visits (ignored by browsers on plain HTTP dev)
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  // Remove the X-Powered-By fingerprint header
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
