export const ORDER_STATUSES = ["completed", "pending", "cancelled", "refunded"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PRODUCT_CATEGORIES = ["electronics", "fashion", "home", "beauty", "sports"] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const DATE_RANGES = ["7d", "30d", "90d"] as const;
export type DateRange = (typeof DATE_RANGES)[number];

export interface Order {
  id: string;
  customer: string;
  category: ProductCategory;
  status: OrderStatus;
  /** Order total in USD. */
  total: number;
  /** ISO 8601 timestamp (UTC). */
  createdAt: string;
}

export type KpiFormat = "currency" | "number" | "percent";

export interface Kpi {
  id: "revenue" | "orders" | "averageOrderValue" | "completionRate";
  label: string;
  format: KpiFormat;
  value: number;
  previousValue: number;
  /** Percentage change vs. the previous period, or null when there is no baseline. */
  changePct: number | null;
}

export interface DailyRevenue {
  /** Calendar day, formatted as YYYY-MM-DD. */
  date: string;
  revenue: number;
  orders: number;
}

export interface CategoryRevenue {
  category: ProductCategory;
  revenue: number;
}
