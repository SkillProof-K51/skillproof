import type { Role } from "./account";

/** Icons by name, so the server can describe the menu and the (client) sidebar draws it. */
export type IconKey = "approvals" | "skills" | "roles" | "programmes" | "gap" | "shortage" | "home" | "courses" | "company" | "projects";
export type NavItem = { href: string; label: string; icon: IconKey; /** The module whose page this is, e.g. "M1". */ module?: string };
export type NavGroup = { label?: string; items: NavItem[] };

const REPORTS: NavGroup = {
  label: "Reports",
  items: [
    { href: "/reports/curriculum-gap", label: "Curriculum gap", icon: "gap", module: "M1" },
    { href: "/reports/skill-shortage", label: "Skill shortage", icon: "shortage", module: "M5" },
  ],
};

/** The sidebar for each role (spec › Users and apps). Students use the app, not the portal. */
export function navFor(role: Role): NavGroup[] {
  switch (role) {
    case "admin":
      return [
        { label: "Accounts", items: [{ href: "/admin/approvals", label: "Approvals", icon: "approvals" }] },
        {
          label: "Catalogue",
          items: [
            { href: "/admin/skills", label: "Skills", icon: "skills", module: "M1" },
            { href: "/admin/roles", label: "Roles & weights", icon: "roles", module: "M1" },
            { href: "/admin/programmes", label: "Programmes", icon: "programmes" },
          ],
        },
        REPORTS,
      ];
    case "coordinator":
      return [
        {
          items: [
            { href: "/coordinator", label: "Home", icon: "home" },
            { href: "/coordinator/course-maps", label: "Course maps", icon: "courses", module: "M1" },
          ],
        },
        REPORTS,
      ];
    case "company":
      return [
        {
          items: [
            { href: "/company", label: "Your company", icon: "company" },
            { href: "/company/micro-projects", label: "Micro-projects", icon: "projects", module: "M4" },
          ],
        },
      ];
    case "mentor":
      return [
        {
          items: [
            { href: "/mentor", label: "Home", icon: "home" },
            { href: "/mentor/micro-projects", label: "Micro-projects", icon: "projects", module: "M4" },
          ],
        },
      ];
    case "student":
      return [];
  }
}
