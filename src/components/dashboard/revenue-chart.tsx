"use client";

import { TodoPlaceholder } from "@/components/ui/todo-placeholder";
import type { DailyRevenue } from "@/types/dashboard";

type RevenueChartProps = {
  data: DailyRevenue[];
};

/**
 * TODO: area (or line) chart of revenue over time using Recharts.
 *
 * Recharts needs the browser, which is why this file is a Client Component ("use client").
 * Start with <ResponsiveContainer>, <AreaChart>, <XAxis>, <YAxis>, <Tooltip> and <Area>.
 */
export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <TodoPlaceholder
      title="Revenue over time"
      hint={`area chart with ${data.length} data points`}
      className="h-72"
    />
  );
}
