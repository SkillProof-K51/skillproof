import type { ChallengeResult, ChallengesData, TodaysChallenge } from "../challenges";

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

const PASS_MARK = 70; // the proposed pass mark (spec: Practised = 3 passes at 70 %+), still to confirm

/** Aina's attempts, keyed by challenge — what each Result screen shows. */
export const demoResults: Record<string, ChallengeResult> = {
  // today's: passing it makes Node.js Practised and opens the Bookstore REST API project
  "node-reduce-total": {
    challengeId: "node-reduce-total",
    title: demoToday.title,
    skill: "Node.js",
    kind: "fix_bug",
    score: 100,
    passMark: PASS_MARK,
    passed: true,
    progress: { skill: "Node.js", passed: 3, of: 3 },
    nowPractised: true,
    checks: [
      { label: "Returns 0 for an empty basket", passed: true },
      { label: "Adds up three items correctly", passed: true },
      { label: "Returns a number, not text", passed: true },
    ],
    unlocked: { id: "bookstore", title: "Bookstore REST API (sample)" },
  },
  "sql-no-orders": {
    challengeId: "sql-no-orders",
    title: "Find customers with no orders",
    skill: "SQL",
    kind: "sql_live",
    score: 55,
    passMark: PASS_MARK,
    passed: false,
    progress: { skill: "SQL", passed: 1, of: 3 },
    nowPractised: false,
    checks: [
      { label: "Runs without errors", passed: true },
      { label: "Returns each customer’s name and email", passed: true },
      { label: "Finds all 3 customers with no orders", passed: false, detail: "Your query found 0." },
    ],
    feedback: { kind: "hint", text: "An inner JOIN leaves out customers who have no orders. Try a LEFT JOIN, then keep the rows where the order is missing." },
  },
  "node-missing-await": {
    challengeId: "node-missing-await",
    title: "Find the missing await",
    skill: "Node.js",
    kind: "fix_bug",
    score: 90,
    passMark: PASS_MARK,
    passed: true,
    progress: { skill: "Node.js", passed: 2, of: 3 },
    nowPractised: false,
    checks: [
      { label: "Waits for the user before replying", passed: true },
      { label: "Replies 404 when there is no user", passed: true },
      { label: "Passes database errors on", passed: false, detail: "The error is caught but never passed to next(err)." },
    ],
  },
  "node-middleware": {
    challengeId: "node-middleware",
    title: "Explain what this middleware does",
    skill: "Node.js",
    kind: "explain_it",
    score: 78,
    passMark: PASS_MARK,
    passed: true,
    progress: { skill: "Node.js", passed: 2, of: 3 },
    nowPractised: false,
    checks: [
      { label: "Says what it checks: the login token", passed: true },
      { label: "Explains what happens without a token", passed: true },
      { label: "Explains what next() does", passed: true },
      { label: "Names a risk, such as an expired token", passed: false },
    ],
    feedback: { kind: "ai", text: "Clear and correct about the token check and next(). To score higher, say what happens when the token has expired." },
  },
  "sql-orders-per-customer": {
    challengeId: "sql-orders-per-customer",
    title: "Count orders per customer",
    skill: "SQL",
    kind: "sql_live",
    score: 80,
    passMark: PASS_MARK,
    passed: true,
    progress: { skill: "SQL", passed: 1, of: 3 },
    nowPractised: false,
    checks: [
      { label: "Runs without errors", passed: true },
      { label: "One row per customer", passed: true },
      { label: "Counts each customer’s orders", passed: true },
      { label: "Includes customers with 0 orders", passed: false, detail: "Customers without orders are missing from your list." },
    ],
  },
};
