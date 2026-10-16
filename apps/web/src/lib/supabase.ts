import { createClient } from "@supabase/supabase-js";

// Browser/client-side Supabase client (publishable key only — AGENTS.md rule 5).
// Server actions and auth cookies come with the shared core (weeks 6–7), where this
// moves to @supabase/ssr with separate server and browser clients.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY — copy apps/web/.env.example to .env.local",
  );
}

export const supabase = createClient(url, key);
