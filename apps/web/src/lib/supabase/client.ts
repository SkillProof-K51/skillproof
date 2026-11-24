import { createBrowserClient } from "@supabase/ssr";

import { supabaseEnv } from "./env";

/** Supabase in the browser (a Client Component), e.g. uploading a file straight to Storage. */
export function createClient() {
  const { url, key } = supabaseEnv();
  return createBrowserClient(url, key);
}
