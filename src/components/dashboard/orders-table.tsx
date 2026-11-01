"use client";

import { TodoPlaceholder } from "@/components/ui/todo-placeholder";
import type { Order } from "@/types/dashboard";

type OrdersTableProps = {
  orders: Order[];
};

/**
 * TODO: table of orders with
 * - sorting by clicking a column header (date, customer, total...)
 * - a search input that filters by customer or order id
 * - pagination (for example 10 rows per page)
 *
 * Keep the sort/search/page state with `useState` and derive the visible rows during render.
 * Use `formatDate`, `formatCurrency` from "@/lib/format". Remember `scope="col"` on headers.
 */
export function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <TodoPlaceholder
      title="Orders"
      hint={`sortable, searchable, paginated table for ${orders.length} orders`}
      className="min-h-48"
    />
  );
}
