import { CategoryChart } from "@/components/dashboard/category-chart";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { OrdersTable } from "@/components/dashboard/orders-table";
import { RangeFilter } from "@/components/dashboard/range-filter";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { parseRange } from "@/lib/date-range";
import { computeKpis, groupRevenueByCategory, groupRevenueByDay } from "@/lib/metrics";
import { getOrdersForRange } from "@/lib/orders";

type DashboardProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * Server Component. Reading `searchParams` is request-time data, so the page renders this
 * component inside <Suspense>; the rest of the page is prerendered as a static shell.
 */
export async function Dashboard({ searchParams }: DashboardProps) {
  const { range: rawRange } = await searchParams;
  const range = parseRange(rawRange);

  const { current, previous } = getOrdersForRange(range);
  const kpis = computeKpis(current, previous);
  const revenueByDay = groupRevenueByDay(current);
  const revenueByCategory = groupRevenueByCategory(current);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <RangeFilter value={range} />
      </div>

      <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </section>

      <section aria-label="Charts" className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueByDay} />
        </div>
        <CategoryChart data={revenueByCategory} />
      </section>

      <section aria-label="Orders">
        <OrdersTable orders={current} />
      </section>
    </div>
  );
}
