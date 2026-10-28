import type { NextConfig } from 'next';

// Deliberately simple CSP for Sprint 1 — no nonce middleware yet.
// Next's App Router inlines an unsigned RSC/hydration bootstrap script on
// every page, so script-src needs 'unsafe-inline' until Sprint 8 adds a
// nonce middleware and this gets tightened.
//
// 'unsafe-eval' is added ONLY in development: Next's dev-mode webpack
// wraps every module in eval() for Fast Refresh, which a strict
// script-src blocks outright and silently breaks all client
// interactivity (confirmed while testing Sprint 2 — a pageerror, not a
// React error, so it fails quietly). This never reaches a production
// build or a deployed site.
const scriptSrc =
  process.env.NODE_ENV === 'development'
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self' 'unsafe-inline'";

const contentSecurityPolicy = [
  "default-src 'self'",
  scriptSrc,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "frame-ancestors 'none'",
].join('; ');

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
