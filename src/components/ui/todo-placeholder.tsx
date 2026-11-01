type TodoPlaceholderProps = {
  title: string;
  hint: string;
  className?: string;
};

/** Temporary box shown by components that are not implemented yet. Delete when no longer used. */
export function TodoPlaceholder({ title, hint, className = "" }: TodoPlaceholderProps) {
  return (
    <div
      className={`flex flex-col justify-center rounded-xl border border-dashed border-border p-5 text-sm text-muted ${className}`}
    >
      <p className="font-medium text-foreground">{title}</p>
      <p className="mt-1">TODO: {hint}</p>
    </div>
  );
}
