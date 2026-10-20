/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  // Type checking runs separately via `npm run typecheck`; `next build` only
  // fails on real compile errors, never on lint style rules.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
