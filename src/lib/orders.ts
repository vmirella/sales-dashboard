import { orders } from "@/data/orders";
import { getRangeBounds } from "@/lib/date-range";
import type { DateRange, Order } from "@/types/dashboard";

export interface OrdersForRange {
  range: DateRange;
  /** Orders inside the selected period, newest first. */
  current: Order[];
  /** Orders inside the period right before the selected one, newest first. */
  previous: Order[];
}

function isBetween(order: Order, start: string, end: string): boolean {
  const day = order.createdAt.slice(0, 10);
  return day >= start && day <= end;
}

/** Single data-access entry point, shared by the page and the API route. */
export function getOrdersForRange(range: DateRange): OrdersForRange {
  const { start, end, previousStart, previousEnd } = getRangeBounds(range);
  return {
    range,
    current: orders.filter((order) => isBetween(order, start, end)),
    previous: orders.filter((order) => isBetween(order, previousStart, previousEnd)),
  };
}
