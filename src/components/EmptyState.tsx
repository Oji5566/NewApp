import type { ReactNode } from "react";

interface Props {
  title: string;
  body?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, body, icon, action }: Props) {
  return (
    <div className="text-center px-6 py-12">
      {icon ? (
        <div className="mx-auto w-16 h-16 rounded-3xl bg-surface-muted flex items-center justify-center text-ink-soft mb-4">
          {icon}
        </div>
      ) : null}
      <h3 className="text-[20px] font-semibold text-ink">{title}</h3>
      {body ? (
        <p className="mt-2 text-[15.5px] text-ink-muted max-w-xs mx-auto">
          {body}
        </p>
      ) : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
