import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { AppState } from "react-native";

// Mobile Supabase client (publishable key only — AGENTS.md rule 5). Made on first use, so the app
// still runs on demo data (TEST MODE) on a machine without the Supabase values.
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

let client: SupabaseClient | undefined;

/** The one client. The session is kept on the phone, so the student stays signed in. */
export function supabase(): SupabaseClient {
  if (client) return client;
  if (!url || !key) {
    throw new Error("Missing EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY — copy apps/mobile/.env.example to .env");
  }
  const made = createClient(url, key, {
    auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },
  });
  // Supabase's React Native guide: refresh the session only while the app is open.
  AppState.addEventListener("change", (state) => (state === "active" ? made.auth.startAutoRefresh() : made.auth.stopAutoRefresh()));
  client = made;
  return made;
}
