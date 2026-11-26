/** Fictional, read-only TEST MODE snapshots for the M4 application and review screens. */
export const demoProjectJourney = {
  projectId: "cafe",
  student: "Aina Sofea",
  role: "Web Developer path",
  publicLink: "skillproof.test/p/aina-sofea",
  mentor: "Kamal Ariff",
  company: "Contoh Tech Sdn Bhd",
  stages: [
    { label: "Applied", date: "29 Oct" },
    { label: "Accepted by Kamal Ariff", date: "30 Oct" },
    { label: "Handed in", date: "11 Nov" },
    { label: "AI first review · demo", date: "11 Nov" },
    { label: "Mentor's rating", date: "Due 14 Nov" },
  ],
  review: [
    { label: "Works on a phone and a laptop", passed: true },
    { label: "Clean, readable components", passed: true },
    { label: "The booking form checks its fields", passed: true },
    { label: "Close to the café's brief", passed: true },
    { label: "Reflection shows what you learned", passed: false, note: "Say what you did differently with the menu photos, and why." },
  ],
  ratings: [
    { label: "Works on a phone and a laptop", score: 5 },
    { label: "Clean, readable components", score: 4 },
    { label: "The booking form checks its fields", score: 4 },
    { label: "Close to the café's brief", score: 4 },
    { label: "Reflection shows what you learned", score: 3 },
  ],
  mentorComment: "The booking form is solid — it catches every bad date I tried. Next time, split the menu into smaller components and say more in your reflection about the photo sizes.",
  readinessBefore: 72,
  readinessAfter: 84,
} as const;
