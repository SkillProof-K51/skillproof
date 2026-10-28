import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No Cache Components / Partial Prefetching: every portal page depends on who is signed in, and
  // with them on, each session read needs its own <Suspense> boundary or the build fails. Plain
  // dynamic rendering is simpler for the team (and what their AI tools know).
  // Next 16.4 writes its own AGENTS.md into apps/web on `next dev`; ours at the repo root is the one
  // rule file (its Stack line carries Next's advice: read node_modules/next/dist/docs first).
  agentRules: false,
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
