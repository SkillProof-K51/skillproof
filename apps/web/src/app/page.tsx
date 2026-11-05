import { redirect } from "next/navigation";

import { getAccount, homeFor } from "@/lib/account";

/** The portal's front door: everyone goes to their own page, or to sign in. */
export default async function Home() {
  const account = await getAccount();
  redirect(account ? homeFor(account) : "/sign-in");
}
