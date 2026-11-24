import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { PortalSidebar } from "@/components/portal/PortalSidebar";
import { TestModeStrip } from "@/components/portal/TestModeStrip";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { getAccount, homeFor, type Role } from "@/lib/account";
import { getPendingCount } from "@/lib/approvals";
import { navFor } from "@/lib/nav";
import { isTestMode } from "@/lib/testMode";

const ROLE_LABELS: Record<Role, string> = { admin: "Admin", coordinator: "Coordinator", company: "Company", mentor: "Mentor", student: "Student" };

/**
 * The signed-in portal: the sidebar for the account's role, then the page. Each page also checks
 * its own role (requireAccount): a layout isn't re-run on every navigation.
 */
export default async function PortalLayout({ children }: { children: ReactNode }) {
  const account = await getAccount();
  if (!account) redirect("/sign-in");
  if (account.role === "student" || account.status !== "active") redirect(homeFor(account));
  const counts = account.role === "admin" ? { "/admin/approvals": await getPendingCount() } : undefined;
  return (
    <SidebarProvider>
      <PortalSidebar
        nav={navFor(account.role)}
        account={{ fullName: account.fullName, email: account.email, roleLabel: ROLE_LABELS[account.role] }}
        counts={counts}
      />
      <SidebarInset>
        {/* on top of the page column, not the window: the sidebar is pinned to the window's top */}
        {isTestMode ? <TestModeStrip /> : null}
        <header className="flex h-12 items-center border-b px-4 md:hidden">
          <SidebarTrigger />
        </header>
        <div className="mx-auto w-full max-w-6xl flex-1 p-6 md:p-8">{children}</div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}
