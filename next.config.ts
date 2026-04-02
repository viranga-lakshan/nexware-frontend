import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // standalone supports Docker; Vercel uses its own output
  output: process.env.VERCEL ? undefined : "standalone",
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
};

export default nextConfig;
