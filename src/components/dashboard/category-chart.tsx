"use client";

import { TodoPlaceholder } from "@/components/ui/todo-placeholder";
import type { CategoryRevenue } from "@/types/dashboard";

type CategoryChartProps = {
  data: CategoryRevenue[];
};

/**
 * TODO: bar chart of revenue per category using Recharts.
 * Use <BarChart>, <Bar>, <XAxis>, <YAxis> and <Tooltip> inside a <ResponsiveContainer>.
 */
export function CategoryChart({ data }: CategoryChartProps) {
  return (
    <TodoPlaceholder
      title="Revenue by category"
      hint={`bar chart with ${data.length} categories`}
      className="h-72"
    />
  );
}
