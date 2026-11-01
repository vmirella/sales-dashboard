import { DATE_RANGES, type DateRange } from "@/types/dashboard";

export const DEFAULT_RANGE: DateRange = "30d";

/**
 * "Today" for the demo dataset (YYYY-MM-DD).
 * Fixed on purpose so the data is deterministic; see `src/data/orders.ts`.
 */
export const REFERENCE_DATE = "2026-10-31";

const DAYS_BY_RANGE: Record<DateRange, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

export interface RangeBounds {
  /** Inclusive start of the selected period (YYYY-MM-DD). */
  start: string;
  /** Inclusive end of the selected period (YYYY-MM-DD). */
  end: string;
  /** Inclusive start of the period right before the selected one. */
  previousStart: string;
  /** Inclusive end of the period right before the selected one. */
  previousEnd: string;
}

/** Adds (or subtracts) days to a YYYY-MM-DD string and returns a YYYY-MM-DD string. */
export function addDays(date: string, days: number): string {
  const result = new Date(`${date}T00:00:00Z`);
  result.setUTCDate(result.getUTCDate() + days);
  return result.toISOString().slice(0, 10);
}

/** Validates a raw `?range=` value coming from the URL and falls back to the default. */
export function parseRange(value: string | string[] | undefined): DateRange {
  const candidate = Array.isArray(value) ? value[0] : value;
  return DATE_RANGES.find((range) => range === candidate) ?? DEFAULT_RANGE;
}

export function getRangeBounds(range: DateRange): RangeBounds {
  const days = DAYS_BY_RANGE[range];
  const end = REFERENCE_DATE;
  const start = addDays(end, -(days - 1));
  const previousEnd = addDays(start, -1);
  const previousStart = addDays(previousEnd, -(days - 1));
  return { start, end, previousStart, previousEnd };
}
