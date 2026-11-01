import type { ReactNode } from "react";

type ChartCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

/** Shared frame for charts: surface, hairline border, title and optional subtitle. */
export function ChartCard({ title, description, children }: ChartCardProps) {
  return (
    <section className="h-full rounded-xl border border-border bg-surface p-5">
      <h2 className="text-sm font-semibold">{title}</h2>
      {description ? <p className="mt-0.5 text-xs text-muted">{description}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}
