"use client";

import {
  BriefcaseIcon,
  BuildingsIcon,
  ChartBarIcon,
  GitDiffIcon,
  GraduationCapIcon,
  HouseIcon,
  KanbanIcon,
  SignOutIcon,
  StackIcon,
  TreeStructureIcon,
  UserCheckIcon,
  type Icon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { signOut } from "@/lib/auth-actions";
import type { IconKey, NavGroup } from "@/lib/nav";

import { BrandMark } from "./BrandMark";

const ICONS: Record<IconKey, Icon> = {
  approvals: UserCheckIcon,
  skills: StackIcon,
  roles: BriefcaseIcon,
  programmes: GraduationCapIcon,
  gap: GitDiffIcon,
  shortage: ChartBarIcon,
  home: HouseIcon,
  courses: TreeStructureIcon,
  company: BuildingsIcon,
  projects: KanbanIcon,
};

type Props = {
  nav: NavGroup[];
  account: { fullName: string; email: string; roleLabel: string };
  /** A count beside a menu item, by its href (e.g. accounts waiting for approval). */
  counts?: Record<string, number>;
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

/** The portal's sidebar (Kumo-style, look A): the mark, the role's menu, who's signed in. */
export function PortalSidebar({ nav, account, counts = {} }: Props) {
  const pathname = usePathname();
  return (
    <Sidebar>
      <SidebarHeader className="gap-3 px-3 pt-4">
        <BrandMark />
        <p className="px-1 text-xs text-muted-foreground">
          Signed in as <span className="font-medium text-sidebar-foreground">{account.roleLabel}</span>
        </p>
      </SidebarHeader>
      <SidebarContent>
        {nav.map((group, i) => (
          <SidebarGroup key={group.label ?? i}>
            {group.label ? <SidebarGroupLabel>{group.label}</SidebarGroupLabel> : null}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = ICONS[item.icon];
                  const count = counts[item.href];
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton isActive={pathname === item.href} render={<Link href={item.href} />}>
                        <Icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                      {count ? (
                        <SidebarMenuBadge className="bg-primary text-primary-foreground">{count}</SidebarMenuBadge>
                      ) : item.module ? (
                        <SidebarMenuBadge className="text-muted-foreground">{item.module}</SidebarMenuBadge>
                      ) : null}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t">
        <div className="flex items-center gap-2 px-1 py-1">
          <Avatar className="size-7">
            <AvatarFallback className="text-xs">{initials(account.fullName)}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-medium">{account.fullName}</span>
            <span className="truncate text-xs text-muted-foreground">{account.email}</span>
          </div>
          <form action={signOut}>
            <Button type="submit" variant="ghost" size="icon-sm" aria-label="Sign out" className="text-muted-foreground">
              <SignOutIcon />
            </Button>
          </form>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
