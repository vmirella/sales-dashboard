"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TooltipContentProps } from "recharts";

import { ChartCard } from "@/components/ui/chart-card";
import { formatCompactCurrency, formatCurrency, formatDate } from "@/lib/format";
import type { DailyRevenue } from "@/types/dashboard";

type RevenueChartProps = {
  data: DailyRevenue[];
};

const AXIS_TICK = { fill: "var(--muted)", fontSize: 12 };

/** Hover readout. The value leads; the date and order count are secondary. */
function RevenueTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload as DailyRevenue;

  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-sm shadow-lg">
      <p className="text-xs text-muted">{formatDate(point.date, true)}</p>
      <p className="mt-1 flex items-center gap-2">
        <span aria-hidden="true" className="h-0.5 w-3 rounded bg-series" />
        <span className="font-semibold">{formatCurrency(point.revenue)}</span>
      </p>
      <p className="mt-0.5 text-xs text-muted">{point.orders} completed orders</p>
    </div>
  );
}

/**
 * Client Component: Recharts measures the DOM, so it can only render in the browser.
 * One series, so there is no legend; the card title already says what is plotted.
 */
export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <ChartCard title="Revenue over time" description="Daily revenue from completed orders">
      {data.length === 0 ? (
        <p className="flex h-64 items-center justify-center text-sm text-muted">
          No completed orders in this period.
        </p>
      ) : (
        <>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date: string) => formatDate(date)}
                  tick={AXIS_TICK}
                  tickLine={false}
                  axisLine={{ stroke: "var(--chart-grid)" }}
                  minTickGap={32}
                />
                <YAxis
                  tickFormatter={(value: number) => formatCompactCurrency(value)}
                  tick={AXIS_TICK}
                  tickLine={false}
                  axisLine={false}
                  width={52}
                />
                <Tooltip
                  content={RevenueTooltip}
                  cursor={{ stroke: "var(--muted)", strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--series-1)"
                  strokeWidth={2}
                  fill="var(--series-1)"
                  fillOpacity={0.1}
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: "var(--series-1)",
                    stroke: "var(--surface)",
                    strokeWidth: 2,
                  }}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Table view for screen readers: every value is reachable without hovering. */}
          <table className="sr-only">
            <caption>Daily revenue from completed orders</caption>
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Revenue</th>
                <th scope="col">Completed orders</th>
              </tr>
            </thead>
            <tbody>
              {data.map((point) => (
                <tr key={point.date}>
                  <th scope="row">{formatDate(point.date, true)}</th>
                  <td>{formatCurrency(point.revenue)}</td>
                  <td>{point.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </ChartCard>
  );
}
