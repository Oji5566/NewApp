import type { ManualResult } from "../types/manual";

const styles: Record<ManualResult, string> = {
  Worked:
    "bg-[color:var(--color-primary-soft)] text-[color:var(--color-primary-hover)]",
  "Sort of": "bg-surface-muted text-ink-muted",
  "Didn’t work":
    "bg-[#FBE4E4] text-[color:var(--color-danger)] dark:bg-[#3a1f1f]",
  Unknown: "bg-surface-muted text-ink-soft",
};

export function ResultBadge({ result }: { result: ManualResult }) {
  return (
    <span
      className={[
        "inline-flex items-center px-2.5 h-6 rounded-full text-[12px] font-medium",
        styles[result],
      ].join(" ")}
    >
      {result}
    </span>
  );
}
