import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { supabaseEnv } from "./env";

/**
 * Supabase on the server, signed in as whoever's cookies these are: for Server Components, Server
 * Actions and Route Handlers. Make a new one per request (the cookies differ).
 */
export async function createClient() {
  const { url, key } = supabaseEnv();
  const store = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Called from a Server Component, which can't set cookies: src/proxy.ts refreshes them.
        }
      },
    },
  });
}
