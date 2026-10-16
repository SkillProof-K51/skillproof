import { createClient } from "@supabase/supabase-js";

// Mobile Supabase client (publishable key only — AGENTS.md rule 5).
// Session persistence (AsyncStorage adapter) is added with the shared core's auth work;
// until then a login lasts for the app session only, which is fine for warm-up PRs.
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  throw new Error(
    "Missing EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY — copy apps/mobile/.env.example to .env",
  );
}

export const supabase = createClient(url, key);
