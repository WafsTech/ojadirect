import type { ReactNode } from "react";

/** Generic empty/error placeholder — no products, no search results, network trouble. */
export function EmptyState({
  icon,
  title,
  message,
  action,
}: {
  icon?: ReactNode;
  title: string;
  message?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-paper px-6 py-12 text-center">
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ground text-muted">
          {icon}
        </div>
      )}
      <h3 className="font-display text-lg font-extrabold text-ink">{title}</h3>
      {message && <p className="max-w-sm text-sm text-muted">{message}</p>}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
