import type { PendingAccount } from "../approvals";
import type { Company, Mentor } from "../company";

// TEST MODE demo data for the portal. Fictional companies and people only (AGENTS.md rule 12).
const hoursAgo = (h: number) => new Date(Date.UTC(2026, 9, 28, 8) - h * 3_600_000).toISOString();

export const demoPending: PendingAccount[] = [
  {
    id: "00000000-0000-4000-8000-0000000000a1",
    kind: "company",
    name: "Kilang Kod Studio",
    contactName: "Wei Ling",
    email: "hello@kilangkod.example",
    ssmNo: "202201056789",
    documentPath: "00000000-0000-4000-8000-0000000000a1/ssm.pdf",
    createdAt: hoursAgo(72),
  },
  {
    id: "00000000-0000-4000-8000-0000000000a2",
    kind: "company",
    name: "Awan Biru Solutions",
    contactName: "Farid Hashim",
    email: "talent@awanbiru.example",
    ssmNo: "201901034567",
    website: "https://awanbiru.example",
    createdAt: hoursAgo(26),
  },
  {
    id: "00000000-0000-4000-8000-0000000000a3",
    kind: "coordinator",
    name: "Nurul Hidayah",
    contactName: "Nurul Hidayah",
    email: "nurul@example.com",
    faculty: "Faculty of ICT",
    createdAt: hoursAgo(5),
  },
];


export const demoCompany: Company = {
  id: "00000000-0000-4000-8000-0000000000c1",
  name: "Contoh Tech Sdn Bhd",
  ssmNo: "202401012345",
  website: "https://contohtech.example",
  documentPath: "00000000-0000-4000-8000-000000000003/ssm-certificate.pdf",
  joinCode: "K7QF-M2XP",
};

/** The waiting company's own (TEST MODE view "Company (waiting)"): no document yet. */
export const demoPendingCompany: Company = {
  id: "00000000-0000-4000-8000-0000000000c2",
  name: "Kilang Kod Studio",
  ssmNo: "202201056789",
  joinCode: "P8WN-4HTD",
};

export const demoMentors: Mentor[] = [
  { id: "00000000-0000-4000-8000-000000000005", fullName: "Kamal Ariff", email: "kamal@example.com", jobTitle: "Senior developer", joinedAt: "2026-10-27T09:00:00Z" },
  { id: "00000000-0000-4000-8000-0000000000b2", fullName: "Siti Aminah", email: "siti@example.com", jobTitle: "QA lead", joinedAt: "2026-10-26T03:00:00Z" },
];

/** TEST MODE micro-projects for the Company and Mentor portal pages. */
export const demoMicroProjects = [
  {
    id: "00000000-0000-4000-8000-0000000000d1",
    ownerId: demoMentors[0].id,
    title: "Build a landing page",
    summary: "Create a responsive landing page for a local community event.",
    requiredSkills: ["HTML & CSS", "JavaScript"],
    status: "open" as const,
    applications: 3,
  },
  {
    id: "00000000-0000-4000-8000-0000000000d2",
    ownerId: demoMentors[0].id,
    title: "Test a booking flow",
    summary: "Write clear test cases for a small appointment booking flow.",
    requiredSkills: ["Testing", "Communication"],
    status: "draft" as const,
    applications: 0,
  },
  {
    id: "00000000-0000-4000-8000-0000000000d3",
    ownerId: demoMentors[1].id,
    title: "Tidy a data dashboard",
    summary: "Improve labels and filters on a small sales dashboard.",
    requiredSkills: ["SQL", "Data visualisation"],
    status: "closed" as const,
    applications: 2,
  },
];
