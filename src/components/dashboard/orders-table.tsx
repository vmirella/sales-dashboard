"use client";

import { useMemo, useState } from "react";

import { formatCategory, formatCurrency, formatDate, formatNumber } from "@/lib/format";
import type { Order, OrderStatus } from "@/types/dashboard";

type OrdersTableProps = {
  orders: Order[];
};

type SortKey = "createdAt" | "customer" | "category" | "status" | "total";
type SortDirection = "asc" | "desc";

const PAGE_SIZE = 10;

const COLUMNS: ReadonlyArray<{ key: SortKey; label: string; alignRight?: boolean }> = [
  { key: "createdAt", label: "Date" },
  { key: "customer", label: "Customer" },
  { key: "category", label: "Category" },
  { key: "status", label: "Status" },
  { key: "total", label: "Total", alignRight: true },
];

/** Numbers and dates read best newest/highest first; text reads best A to Z. */
const DEFAULT_DIRECTION: Record<SortKey, SortDirection> = {
  createdAt: "desc",
  customer: "asc",
  category: "asc",
  status: "asc",
  total: "desc",
};

/** Every status has a colored dot AND a text label, so color is never the only signal. */
const STATUS_DOT: Record<OrderStatus, string> = {
  completed: "bg-positive",
  pending: "bg-warning",
  cancelled: "bg-muted",
  refunded: "bg-negative",
};

function compareOrders(a: Order, b: Order, key: SortKey): number {
  if (key === "total") return a.total - b.total;
  return a[key].localeCompare(b[key]);
}

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

/**
 * Client Component: it owns interactive state (search, sort, page).
 * Only that state is stored; the rows on screen are DERIVED from it on every render,
 * the same way a `computed` works in Vue.
 */
export function OrdersTable({ orders }: OrdersTableProps) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [page, setPage] = useState(1);

  // Filter + sort are the expensive part (up to ~1,300 rows), so they are memoized.
  const rows = useMemo(() => {
    const term = query.trim().toLowerCase();
    const filtered = term
      ? orders.filter(
          (order) =>
            order.customer.toLowerCase().includes(term) || order.id.toLowerCase().includes(term),
        )
      : orders;

    const factor = sortDirection === "asc" ? 1 : -1;
    // Sort a copy: `sort` mutates, and props must never be mutated.
    return [...filtered].sort((a, b) => compareOrders(a, b, sortKey) * factor);
  }, [orders, query, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  // The date-range filter can swap `orders` while this component stays mounted,
  // so the stored page may no longer exist. Clamp it instead of syncing it in an effect.
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageRows = rows.slice(startIndex, startIndex + PAGE_SIZE);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection(DEFAULT_DIRECTION[key]);
    }
    setPage(1);
  }

  function handleSearch(value: string) {
    setQuery(value);
    setPage(1);
  }

  return (
    <section className="rounded-xl border border-border bg-surface">
      <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold">Orders</h2>
          <p className="mt-0.5 text-xs text-muted">
            {formatNumber(rows.length)} {rows.length === 1 ? "order" : "orders"}
            {query.trim() ? " match your search" : " in the selected period"}
          </p>
        </div>
        <div>
          <label htmlFor="orders-search" className="sr-only">
            Search orders by customer or order id
          </label>
          <input
            id="orders-search"
            type="search"
            value={query}
            onChange={(event) => handleSearch(event.target.value)}
            placeholder="Search customer or order id"
            className={`w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted sm:w-64 ${focusRing}`}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-y border-border text-xs text-muted">
              <th scope="col" className="px-5 py-3 font-medium">
                Order
              </th>
              {COLUMNS.map((column) => {
                const isSorted = column.key === sortKey;
                return (
                  <th
                    key={column.key}
                    scope="col"
                    aria-sort={
                      isSorted ? (sortDirection === "asc" ? "ascending" : "descending") : "none"
                    }
                    className={`px-5 py-3 font-medium ${column.alignRight ? "text-right" : ""}`}
                  >
                    <button
                      type="button"
                      onClick={() => handleSort(column.key)}
                      // For the right-aligned column the arrow goes before the label, so the
                      // label stays flush with the numbers below it.
                      className={`inline-flex items-center gap-1 rounded hover:text-foreground ${focusRing} ${
                        column.alignRight ? "flex-row-reverse" : ""
                      } ${isSorted ? "text-foreground" : ""}`}
                    >
                      {column.label}
                      <span aria-hidden="true" className="w-3 text-[0.65rem]">
                        {isSorted ? (sortDirection === "asc" ? "▲" : "▼") : ""}
                      </span>
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length + 1} className="px-5 py-10 text-center text-muted">
                  No orders found.
                </td>
              </tr>
            ) : (
              pageRows.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-b-0">
                  <td className="px-5 py-3 font-mono text-xs whitespace-nowrap text-muted">
                    {order.id}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-muted">
                    {formatDate(order.createdAt, true)}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">{order.customer}</td>
                  <td className="px-5 py-3">{formatCategory(order.category)}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className={`h-2 w-2 rounded-full ${STATUS_DOT[order.status]}`}
                      />
                      {formatCategory(order.status)}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums">
                    {formatCurrency(order.total, 2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-border p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted" aria-live="polite">
          {rows.length === 0
            ? "Showing 0 of 0"
            : `Showing ${startIndex + 1}–${startIndex + pageRows.length} of ${formatNumber(rows.length)}`}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className={`rounded-lg border border-border px-3 py-1.5 font-medium hover:bg-background disabled:cursor-not-allowed disabled:opacity-40 ${focusRing}`}
          >
            Previous
          </button>
          <span className="px-1 text-xs text-muted">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className={`rounded-lg border border-border px-3 py-1.5 font-medium hover:bg-background disabled:cursor-not-allowed disabled:opacity-40 ${focusRing}`}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
