import Link from "next/link";

import { DATE_RANGES, type DateRange } from "@/types/dashboard";

const LABELS: Record<DateRange, string> = {
  "7d": "7 days",
  "30d": "30 days",
  "90d": "90 days",
};

type RangeFilterProps = {
  /** The currently selected range, already validated on the server. */
  value: DateRange;
};

/**
 * Reference implementation: the selected range lives in the URL (`/?range=30d`),
 * so each option is a plain link. No client-side state or hooks are needed, and the
 * filtered view can be shared or bookmarked.
 */
export function RangeFilter({ value }: RangeFilterProps) {
  return (
    <nav
      aria-label="Date range"
      className="inline-flex rounded-lg border border-border bg-surface p-1 text-sm"
    >
      {DATE_RANGES.map((range) => {
        const isActive = range === value;
        return (
          <Link
            key={range}
            href={{ pathname: "/", query: { range } }}
            scroll={false}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
              isActive ? "bg-accent text-white" : "text-muted hover:text-foreground"
            }`}
          >
            {LABELS[range]}
          </Link>
        );
      })}
    </nav>
  );
}
