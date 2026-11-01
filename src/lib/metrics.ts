import type { CategoryRevenue, DailyRevenue, Kpi, Order, ProductCategory } from "@/types/dashboard";

/**
 * Pure functions that turn raw orders into the numbers the UI needs.
 * No React involved: arrays in, arrays out.
 *
 * Business rule: only orders with status "completed" count as revenue.
 */

const KPI_DEFINITIONS: ReadonlyArray<Pick<Kpi, "id" | "label" | "format">> = [
  { id: "revenue", label: "Revenue", format: "currency" },
  { id: "orders", label: "Orders", format: "number" },
  { id: "averageOrderValue", label: "Average order value", format: "currency" },
  { id: "completionRate", label: "Completion rate", format: "percent" },
];

type KpiValues = Record<Kpi["id"], number>;

function isCompleted(order: Order): boolean {
  return order.status === "completed";
}

/** Sum of the totals of completed orders. */
function sumRevenue(orders: Order[]): number {
  return orders.filter(isCompleted).reduce((sum, order) => sum + order.total, 0);
}

/** Percentage change between two values, or null when there is no baseline to compare with. */
function calcChangePct(value: number, previousValue: number): number | null {
  if (previousValue === 0) return null;
  return ((value - previousValue) / previousValue) * 100;
}

/** Computes the raw value of every KPI for a single period. */
function calcKpiValues(orders: Order[]): KpiValues {
  const completedCount = orders.filter(isCompleted).length;
  const revenue = sumRevenue(orders);

  return {
    revenue,
    orders: orders.length,
    averageOrderValue: completedCount > 0 ? revenue / completedCount : 0,
    completionRate: orders.length > 0 ? (completedCount / orders.length) * 100 : 0,
  };
}

/** The four dashboard KPIs for the selected period, compared with the previous one. */
export function computeKpis(current: Order[], previous: Order[]): Kpi[] {
  const currentValues = calcKpiValues(current);
  const previousValues = calcKpiValues(previous);

  return KPI_DEFINITIONS.map((definition) => ({
    ...definition,
    value: currentValues[definition.id],
    previousValue: previousValues[definition.id],
    changePct: calcChangePct(currentValues[definition.id], previousValues[definition.id]),
  }));
}

/**
 * Revenue and number of completed orders per calendar day, oldest first.
 * Days without completed orders are omitted.
 */
export function groupRevenueByDay(orders: Order[]): DailyRevenue[] {
  const byDay = new Map<string, DailyRevenue>();

  for (const order of orders.filter(isCompleted)) {
    const date = order.createdAt.slice(0, 10);
    const entry = byDay.get(date) ?? { date, revenue: 0, orders: 0 };
    entry.revenue += order.total;
    entry.orders += 1;
    byDay.set(date, entry);
  }

  // YYYY-MM-DD strings sort chronologically when compared as text.
  return Array.from(byDay.values()).sort((a, b) => a.date.localeCompare(b.date));
}

/** Revenue of completed orders per category, highest first. */
export function groupRevenueByCategory(orders: Order[]): CategoryRevenue[] {
  const byCategory = new Map<ProductCategory, number>();

  for (const order of orders.filter(isCompleted)) {
    byCategory.set(order.category, (byCategory.get(order.category) ?? 0) + order.total);
  }

  return Array.from(byCategory, ([category, revenue]) => ({ category, revenue })).sort(
    (a, b) => b.revenue - a.revenue,
  );
}
