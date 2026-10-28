/** "just now", "5 hours", "3 days": how long something has waited (computed on the server). */
export function waitedFor(sinceIso: string, now = Date.now()): string {
  const hours = Math.floor((now - Date.parse(sinceIso)) / 3_600_000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  const days = Math.floor(hours / 24);
  return `${days} ${days === 1 ? "day" : "days"}`;
}
