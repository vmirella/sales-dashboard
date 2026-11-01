"use client";

import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TooltipContentProps } from "recharts";

import { ChartCard } from "@/components/ui/chart-card";
import { formatCategory, formatCompactCurrency, formatCurrency } from "@/lib/format";
import type { CategoryRevenue } from "@/types/dashboard";

type CategoryChartProps = {
  data: CategoryRevenue[];
};

type CategoryTooltipProps = TooltipContentProps & { total: number };

function CategoryTooltip({ active, payload, total }: CategoryTooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload as CategoryRevenue;
  const share = total > 0 ? (item.revenue / total) * 100 : 0;

  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-sm shadow-lg">
      <p className="text-xs text-muted">{formatCategory(item.category)}</p>
      <p className="mt-1 font-semibold">{formatCurrency(item.revenue)}</p>
      <p className="mt-0.5 text-xs text-muted">{share.toFixed(1)}% of revenue</p>
    </div>
  );
}

/**
 * Horizontal bars so the category names stay readable. One series, so every bar uses the same
 * color: the category is already identified by its label, not by hue.
 */
export function CategoryChart({ data }: CategoryChartProps) {
  const total = data.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <ChartCard title="Revenue by category" description="Completed orders in the selected period">
      {data.length === 0 ? (
        <p className="flex h-64 items-center justify-center text-sm text-muted">
          No completed orders in this period.
        </p>
      ) : (
        <>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 4, right: 56, bottom: 4, left: 0 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="category"
                  width={84}
                  tickFormatter={(category: string) => formatCategory(category)}
                  tick={{ fill: "var(--foreground)", fontSize: 13 }}
                  tickLine={false}
                  axisLine={{ stroke: "var(--chart-grid)" }}
                />
                <Tooltip
                  content={(props) => <CategoryTooltip {...props} total={total} />}
                  cursor={{ fill: "var(--chart-grid)", opacity: 0.5 }}
                />
                <Bar
                  dataKey="revenue"
                  fill="var(--series-1)"
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                  isAnimationActive={false}
                >
                  <LabelList
                    dataKey="revenue"
                    position="right"
                    formatter={(value) => formatCompactCurrency(Number(value))}
                    fill="var(--foreground)"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table view for screen readers. */}
          <table className="sr-only">
            <caption>Revenue by category</caption>
            <thead>
              <tr>
                <th scope="col">Category</th>
                <th scope="col">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.category}>
                  <th scope="row">{formatCategory(item.category)}</th>
                  <td>{formatCurrency(item.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </ChartCard>
  );
}
