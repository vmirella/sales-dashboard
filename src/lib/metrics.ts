import type { CategoryRevenue, DailyRevenue, Kpi, Order } from "@/types/dashboard";

/**
 * Pure functions that turn raw orders into the numbers the UI needs.
 * They are the first thing to implement: no React involved, just TypeScript.
 *
 * Business rule: only orders with status "completed" count as revenue.
 */

const KPI_DEFINITIONS: ReadonlyArray<Pick<Kpi, "id" | "label" | "format">> = [
  { id: "revenue", label: "Revenue", format: "currency" },
  { id: "orders", label: "Orders", format: "number" },
  { id: "averageOrderValue", label: "Average order value", format: "currency" },
  { id: "completionRate", label: "Completion rate", format: "percent" },
];

/**
 * TODO: compute the four KPIs for the selected period and the previous one.
 *
 * - revenue:           sum of `total` of completed orders
 * - orders:            number of orders (any status)
 * - averageOrderValue: revenue / completed orders (0 when there are none)
 * - completionRate:    completed orders / all orders * 100 (0 when there are none)
 * - changePct:         (value - previousValue) / previousValue * 100, or null when previousValue is 0
 */
export function computeKpis(_current: Order[], _previous: Order[]): Kpi[] {
  return KPI_DEFINITIONS.map((definition) => ({
    ...definition,
    value: 0,
    previousValue: 0,
    changePct: null,
  }));
}

/**
 * TODO: group completed orders by calendar day (YYYY-MM-DD).
 * Return one entry per day, sorted from oldest to newest. Days without orders may be omitted.
 */
export function groupRevenueByDay(_orders: Order[]): DailyRevenue[] {
  return [];
}

/**
 * TODO: sum the revenue of completed orders per category.
 * Return the categories sorted by revenue, highest first.
 */
export function groupRevenueByCategory(_orders: Order[]): CategoryRevenue[] {
  return [];
}
