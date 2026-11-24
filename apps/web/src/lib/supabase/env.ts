// The only two values the portal's browser code may see (AGENTS.md rule 5): the project URL and
// the publishable key. Anything secret stays out of NEXT_PUBLIC_*.
export function supabaseEnv(): { url: string; key: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY — copy apps/web/.env.example to .env.local");
  }
  return { url, key };
}
