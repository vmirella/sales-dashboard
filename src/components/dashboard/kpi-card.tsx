import { formatChange, formatKpiValue } from "@/lib/format";
import type { Kpi } from "@/types/dashboard";

type KpiCardProps = {
  kpi: Kpi;
};

type Trend = "up" | "down" | "flat";

/**
 * Direction is never conveyed by color alone: each state also has an icon, a signed number
 * and a visually hidden label for screen readers.
 * For every KPI on this dashboard an increase is good news, so up = positive, down = negative.
 */
const TRENDS: Record<Trend, { icon: string; srLabel: string; className: string }> = {
  up: { icon: "▲", srLabel: "Up", className: "text-positive" },
  down: { icon: "▼", srLabel: "Down", className: "text-negative" },
  flat: { icon: "•", srLabel: "No change", className: "text-muted" },
};

function getTrend(changePct: number | null): Trend {
  if (changePct === null || changePct === 0) return "flat";
  return changePct > 0 ? "up" : "down";
}

export function KpiCard({ kpi }: KpiCardProps) {
  const trend = TRENDS[getTrend(kpi.changePct)];

  return (
    <article className="rounded-xl border border-border bg-surface p-5">
      <h3 className="text-sm text-muted">{kpi.label}</h3>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{formatKpiValue(kpi)}</p>
      <p className="mt-3 flex items-center gap-2 text-sm">
        <span className={`inline-flex items-center gap-1 font-medium ${trend.className}`}>
          <span aria-hidden="true" className="text-[0.65rem]">
            {trend.icon}
          </span>
          <span className="sr-only">{trend.srLabel} </span>
          {formatChange(kpi.changePct)}
        </span>
        <span className="text-muted">vs previous period</span>
      </p>
    </article>
  );
}
