import type { OnboardingOptions, WarmUp } from "../onboarding";

// Demo choices (TEST MODE). Programme names are placeholders until the profiles schema lists the
// faculty's real ones (shared core).
export const demoOnboarding: Omit<OnboardingOptions, "roles"> = {
  aims: [
    { id: "internship", label: "An internship", description: "For my industrial training" },
    { id: "first_job", label: "My first job", description: "After I graduate" },
    { id: "freelance", label: "Freelance projects", description: "Real work while I study" },
  ],
  programmes: [
    { id: "software", label: "Software Development" },
    { id: "networking", label: "Computer Networking" },
    { id: "security", label: "Computer Security" },
    { id: "media", label: "Interactive Media" },
    { id: "ai", label: "Artificial Intelligence" },
  ],
  years: [1, 2, 3, 4],
};

// One short warm-up per role, keyed by role id; `answer` is the 0-based line with the bug.
// Lines stay under ~33 characters so the code block never cuts them.
export const demoWarmUps: Record<string, { warmUp: WarmUp; answer: number }> = {
  web: {
    warmUp: {
      skill: "JavaScript",
      language: "javascript",
      lines: ["const nums = [4, 6, 10];", "let sum = 0;", "for (let i = 1; i < 3; i++) {", "  sum += nums[i];", "}", "// sum should be 20"],
      why: "The loop starts at 1, so it skips the first number. Start at 0.",
    },
    answer: 2,
  },
  data: {
    warmUp: {
      skill: "SQL",
      language: "sql",
      lines: ["-- the 3 biggest orders", "SELECT id, total", "FROM orders", "ORDER BY total ASC", "LIMIT 3;"],
      why: "ASC puts the smallest first. The biggest need DESC.",
    },
    answer: 3,
  },
  mobile: {
    warmUp: {
      skill: "JavaScript",
      language: "javascript",
      lines: ['const user = { name: "Aina" };', "function greet(u) {", '  return "Hi " + u.nme;', "}"],
      why: "u.nme is a typo, so it says “Hi undefined”. It should be u.name.",
    },
    answer: 2,
  },
  qa: {
    warmUp: {
      skill: "Testing",
      language: "javascript",
      lines: ['test("adds 2 and 2", () => {', "  expect(add(2, 2)).toBe(5);", "});"],
      why: "The test expects 5, but 2 + 2 is 4. The test is wrong, not add().",
    },
    answer: 1,
  },
};
