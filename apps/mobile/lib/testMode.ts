// AGENTS.md rule 4: mocks only behind an env flag with a visible "TEST MODE" label.
// Set EXPO_PUBLIC_TEST_MODE=1 in apps/mobile/.env to see demo data before the shared core lands.
export const isTestMode = process.env.EXPO_PUBLIC_TEST_MODE === "1";
