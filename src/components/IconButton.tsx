import type { ButtonHTMLAttributes, ReactNode } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  children: ReactNode;
  tone?: "neutral" | "primary" | "danger";
  size?: "sm" | "md" | "lg";
}

const sizes: Record<NonNullable<IconButtonProps["size"]>, string> = {
  sm: "w-9 h-9",
  md: "w-11 h-11",
  lg: "w-12 h-12",
};

const tones: Record<NonNullable<IconButtonProps["tone"]>, string> = {
  neutral:
    "bg-surface-muted text-ink hover:bg-line active:bg-line",
  primary: "bg-primary text-white hover:bg-primary-hover",
  danger:
    "bg-surface-muted text-danger hover:bg-line",
};

export function IconButton({
  label,
  children,
  tone = "neutral",
  size = "md",
  className = "",
  ...rest
}: IconButtonProps) {
  return (
    <button
      {...rest}
      aria-label={label}
      title={label}
      className={[
        "inline-flex items-center justify-center rounded-full transition-colors",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        sizes[size],
        tones[tone],
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}
