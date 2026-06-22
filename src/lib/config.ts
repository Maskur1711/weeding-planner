export const WEDDING_DATE = new Date("2028-12-31");

export const TOTAL_BUDGET = 100_000_000;

export function getDaysUntil(date: Date): number {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
