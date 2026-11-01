import { TodoPlaceholder } from "@/components/ui/todo-placeholder";
import type { Kpi } from "@/types/dashboard";

type KpiCardProps = {
  kpi: Kpi;
};

/**
 * TODO: render a card with the KPI label, its value and the change vs. the previous period.
 *
 * Helpers you can use from "@/lib/format": `formatKpiValue(kpi)` and `formatChange(kpi.changePct)`.
 * Show positive changes in green and negative ones in red (and do not rely on color alone).
 */
export function KpiCard({ kpi }: KpiCardProps) {
  return <TodoPlaceholder title={kpi.label} hint="KPI value and change vs. previous period" />;
}
