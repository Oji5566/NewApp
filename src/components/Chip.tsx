import type { ReactNode } from "react";

interface ChipProps {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
  icon?: ReactNode;
  tone?: "neutral" | "primary";
  as?: "button" | "span";
  size?: "sm" | "md";
}

export function Chip({
  active,
  onClick,
  children,
  icon,
  tone = "primary",
  as = "button",
  size = "md",
}: ChipProps) {
  const sizeClass = size === "sm" ? "h-8 px-3 text-[13px]" : "h-10 px-4 text-sm";
  const baseClass =
    "inline-flex items-center gap-1.5 rounded-full font-medium transition-colors border";
  const activeClass =
    tone === "primary"
      ? "bg-primary text-white border-primary"
      : "bg-ink text-bg border-ink";
  const idleClass =
    "bg-surface text-ink-muted border-line hover:bg-surface-muted";

  const className = [
    baseClass,
    sizeClass,
    active ? activeClass : idleClass,
  ].join(" ");

  if (as === "span") {
    return (
      <span className={className}>
        {icon}
        <span className="truncate">{children}</span>
      </span>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {icon}
      <span className="truncate">{children}</span>
    </button>
  );
}
