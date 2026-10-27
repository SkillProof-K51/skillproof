import type { ReactNode } from "react";

import { Brand } from "@/components/portal/Brand";

/** Signed-out pages: the mark, then one card in the middle of the page. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
      <Brand subtitle="Portal" />
      <div className="w-full max-w-sm">{children}</div>
    </main>
  );
}
