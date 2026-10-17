// AGENTS.md rule 4: mocks only behind an env flag with a visible "TEST MODE" label.
// Set EXPO_PUBLIC_TEST_MODE=1 in apps/mobile/.env to see demo data before the shared core lands.
// TODO (before demo data reaches a PR or a team screenshot): the on-screen TEST MODE label was
// removed during Azim's design review (18 Oct) — put a label back or amend rule 4.
export const isTestMode = process.env.EXPO_PUBLIC_TEST_MODE === "1";
