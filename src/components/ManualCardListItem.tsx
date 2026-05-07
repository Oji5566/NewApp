import { Pin } from "lucide-react";
import type { ManualCard } from "../types/manual";
import { typeIcon } from "./typeIcons";
import { ResultBadge } from "./ResultBadge";

interface Props {
  manual: ManualCard;
  onClick?: () => void;
}

export function ManualCardListItem({ manual, onClick }: Props) {
  const Icon = typeIcon(manual.type);
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left bg-surface border border-line rounded-3xl p-5 shadow-soft hover:bg-surface-soft transition-colors"
    >
      <div className="flex gap-4">
        <div className="w-11 h-11 shrink-0 rounded-2xl bg-surface-muted flex items-center justify-center text-ink-muted">
          <Icon className="w-5 h-5" strokeWidth={1.8} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <h3 className="text-[17px] font-semibold text-ink leading-snug truncate flex-1">
              {manual.title}
            </h3>
            {manual.pinned ? (
              <Pin
                className="w-4 h-4 text-primary shrink-0 mt-1"
                strokeWidth={2}
                fill="currentColor"
              />
            ) : null}
          </div>
          {manual.summary ? (
            <p className="mt-1 text-[14.5px] text-ink-muted line-clamp-2">
              {manual.summary}
            </p>
          ) : null}
          <div className="mt-3 flex items-center gap-2 text-[12.5px] text-ink-soft">
            <span className="font-medium text-ink-muted">{manual.type}</span>
            <span aria-hidden>·</span>
            <span className="truncate">{manual.category}</span>
            <span aria-hidden className="ml-auto">
              <ResultBadge result={manual.result} />
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
