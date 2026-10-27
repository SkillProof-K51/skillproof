import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // Next 16.4 writes its own AGENTS.md into apps/web on `next dev`; ours at the repo root is the one
  // rule file (its Stack line carries Next's advice: read node_modules/next/dist/docs first).
  agentRules: false,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
