import type { Kpi } from "@/types/dashboard";

export function formatCurrency(value: number, fractionDigits = 0): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

/** Formats a signed change such as "+12.3%". Returns an em dash when there is no baseline. */
export function formatChange(changePct: number | null): string {
  if (changePct === null) return "—";
  const sign = changePct > 0 ? "+" : "";
  return `${sign}${changePct.toFixed(1)}%`;
}

/** Formats an ISO timestamp as "Oct 31" (or "Oct 31, 2026"), always in UTC. */
export function formatDate(iso: string, withYear = false): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: withYear ? "numeric" : undefined,
    timeZone: "UTC",
  });
}

export function formatKpiValue(kpi: Pick<Kpi, "format" | "value">): string {
  switch (kpi.format) {
    case "currency":
      return formatCurrency(kpi.value);
    case "percent":
      return formatPercent(kpi.value);
    case "number":
      return formatNumber(kpi.value);
  }
}
