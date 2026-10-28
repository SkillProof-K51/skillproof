import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";

/**
 * For our own email templates (once the project sends with its own SMTP — docs/portal.md › 5):
 * a token-hash link, checked here on the server, works whichever device asked. Supabase's default
 * links land on /auth/callback instead. Also takes a `code`, for the browser that asked.
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
