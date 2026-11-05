import type { Account } from "../account";

// TEST MODE: who you're viewing the portal as (the strip's switcher). Fictional people only
// (AGENTS.md rule 12).
export const TEST_VIEWS = ["admin", "coordinator", "company", "company-pending", "mentor", "student"] as const;
export type TestView = (typeof TEST_VIEWS)[number];
export const TEST_VIEW_COOKIE = "sp-test-view";

export const TEST_VIEW_LABELS: Record<TestView, string> = {
  admin: "Admin",
  coordinator: "Coordinator",
  company: "Company",
  "company-pending": "Company (waiting)",
  mentor: "Mentor",
  student: "Student",
};

export const demoAccounts: Record<TestView, Account> = {
  admin: { id: "00000000-0000-4000-8000-000000000001", email: "admin@example.com", fullName: "Admin", role: "admin", status: "active" },
  coordinator: { id: "00000000-0000-4000-8000-000000000002", email: "hafiz@example.com", fullName: "Hafiz Rahim", role: "coordinator", status: "active" },
  company: { id: "00000000-0000-4000-8000-000000000003", email: "hr@contohtech.example", fullName: "Lina Contoh", role: "company", status: "active" },
  "company-pending": { id: "00000000-0000-4000-8000-000000000004", email: "hello@kilangkod.example", fullName: "Wei Ling", role: "company", status: "pending" },
  mentor: { id: "00000000-0000-4000-8000-000000000005", email: "kamal@example.com", fullName: "Kamal Ariff", role: "mentor", status: "active" },
  student: { id: "00000000-0000-4000-8000-000000000006", email: "aina@example.com", fullName: "Aina Sofea", role: "student", status: "active" },
};
