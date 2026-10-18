import type { ChallengesData, TodaysChallenge } from "../challenges";

// Fictional persona (AGENTS.md rule 12): Aina Sofea, BITS student on the Web Developer path.
// Scores are illustrative — the real ones come from the Module 3 challenge scorer.

/** Today's challenge — Home shows the same one. Passing it makes Node.js Practised (2 → 3 of 3). */
export const demoToday: TodaysChallenge = {
  id: "node-reduce-total",
  title: "Fix the bug in this Node.js function",
  preview: ["function total(items) {", "  return items.reduce((s, i) =>", "    s + i.price);", "}"],
  skill: "Node.js",
  passed: 2,
  of: 3,
  minutes: 3,
};

export const demoChallenges: ChallengesData = {
  passesToPractise: 3,
  today: demoToday,
  inProgress: [
    { skill: "Node.js", passed: 2, of: 3 },
    { skill: "SQL", passed: 1, of: 3 },
    { skill: "Testing", passed: 0, of: 3 },
  ],
  challenges: [
    { id: "sql-no-orders", title: "Find customers with no orders", skill: "SQL", kind: "sql_live", minutes: 5, best: { score: 55, passed: false } },
    { id: "test-flaky", title: "Explain why this test is flaky", skill: "Testing", kind: "explain_it", minutes: 5 },
    { id: "test-date", title: "Fix the failing date test", skill: "Testing", kind: "fix_bug", minutes: 4 },
    { id: "sql-top-products", title: "Top 3 products by sales", skill: "SQL", kind: "sql_live", minutes: 4 },
    { id: "node-missing-await", title: "Find the missing await", skill: "Node.js", kind: "fix_bug", minutes: 3, best: { score: 90, passed: true } },
    { id: "node-middleware", title: "Explain what this middleware does", skill: "Node.js", kind: "explain_it", minutes: 4, best: { score: 78, passed: true } },
    { id: "sql-orders-per-customer", title: "Count orders per customer", skill: "SQL", kind: "sql_live", minutes: 4, best: { score: 80, passed: true } },
  ],
};
