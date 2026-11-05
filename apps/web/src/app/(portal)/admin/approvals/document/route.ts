import { NextResponse, type NextRequest } from "next/server";

import { requireAccount } from "@/lib/account";
import { createClient } from "@/lib/supabase/server";
import { isTestMode } from "@/lib/testMode";

/**
 * Opens a company's document for the admin: a link to the private file that works for one minute.
 * The bucket's own policy lets only the company and admins read it.
 */
export async function GET(request: NextRequest) {
  await requireAccount(["admin"]);
  const path = request.nextUrl.searchParams.get("path");
  if (!path) return new NextResponse("No document chosen.", { status: 400 });
  if (isTestMode) return new NextResponse("Test mode: there's no real document behind the demo data.", { status: 200 });
  const { data, error } = await (await createClient()).storage.from("company-documents").createSignedUrl(path, 60);
  if (error || !data) return new NextResponse("Couldn't open that document. It may have been replaced.", { status: 404 });
  return NextResponse.redirect(data.signedUrl);
}
