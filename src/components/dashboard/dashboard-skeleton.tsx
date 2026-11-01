/** Loading state shown while the dashboard data resolves (used as the Suspense fallback). */
export function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6" aria-busy="true" aria-label="Loading dashboard">
      <div className="h-9 w-72 rounded-lg bg-border" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-28 rounded-xl bg-border" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="h-72 rounded-xl bg-border lg:col-span-2" />
        <div className="h-72 rounded-xl bg-border" />
      </div>
      <div className="h-64 rounded-xl bg-border" />
    </div>
  );
}
