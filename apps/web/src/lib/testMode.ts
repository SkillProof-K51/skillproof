// TEST MODE (AGENTS.md rule 4): demo data instead of Supabase, a visible strip, and a switch for
// which account you're viewing as. Set NEXT_PUBLIC_TEST_MODE=1 in apps/web/.env.local.
export const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === "1";
