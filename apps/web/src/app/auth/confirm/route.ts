import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";

/**
 * Where Supabase's email links land (a password reset, later an email confirmation): checks the
 * token, which signs the person in, then goes on to `next`. Takes both link styles — the token
 * hash from our email templates (works whichever device asked), and the code Supabase's default
 * template sends (works in the browser that asked).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const next = searchParams.get("next") ?? "/";
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/"; // never another site
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");

  const supabase = await createClient();
  const { error } = tokenHash && type
    ? await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    : code
      ? await supabase.auth.exchangeCodeForSession(code)
      : { error: new Error("no token") };
  return NextResponse.redirect(new URL(error ? "/sign-in?link=expired" : safeNext, origin));
}
