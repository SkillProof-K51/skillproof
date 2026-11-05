"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useEffect } from "react";

import { supabaseEnv } from "@/lib/supabase/env";

/**
 * Finishes a sign-in from one of Supabase's default email links (a password reset). The link comes
 * in one of two shapes: `?code=` when the portal asked (the browser holds the code's key), or the
 * tokens after `#` when the app asked — only the browser can read those. Either way: sign in,
 * then go on to `next`; a link that doesn't work goes back to sign-in with a note.
 */
export function LinkSignIn() {
  useEffect(() => {
    const { url, key } = supabaseEnv();
    // our own client, so it doesn't try to read the link by itself first
    const supabase = createBrowserClient(url, key, { isSingleton: false, auth: { detectSessionInUrl: false } });
    const here = new URL(window.location.href);
    const hash = new URLSearchParams(here.hash.slice(1));
    const code = here.searchParams.get("code");
    const accessToken = hash.get("access_token");
    const refreshToken = hash.get("refresh_token");
    const next = here.searchParams.get("next") ?? "/";
    const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/"; // never another site

    (async () => {
      const { error } = code
        ? await supabase.auth.exchangeCodeForSession(code)
        : accessToken && refreshToken
          ? await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
          : { error: new Error("no token in the link") };
      // a full page load, so the server sees the new session cookie
      window.location.replace(error ? "/sign-in?link=expired" : safeNext);
    })();
  }, []);

  return <p className="text-center text-sm text-muted-foreground">Signing you in…</p>;
}
