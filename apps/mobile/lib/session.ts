import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

import { supabase } from "./supabase";
import { isTestMode } from "./testMode";

/**
 * Who is signed in: undefined while the saved session loads from the phone, null when signed out.
 * TEST MODE has no session (null): every screen is open on demo data.
 */
export function useSession(): Session | null | undefined {
  const [session, setSession] = useState<Session | null | undefined>(isTestMode ? null : undefined);
  useEffect(() => {
    if (isTestMode) return;
    // Fires once straight away with the saved session (INITIAL_SESSION), then on every change.
    const { data } = supabase().auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);
  return session;
}
