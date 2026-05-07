import type { HTMLAttributes, ReactNode } from "react";

interface SoftCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: "sm" | "md" | "lg";
  as?: "div" | "section" | "article";
}

const paddings = {
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export function SoftCard({
  children,
  padding = "md",
  className = "",
  ...rest
}: SoftCardProps) {
  return (
    <div
      {...rest}
      className={[
        "bg-surface rounded-3xl border border-line shadow-soft",
        paddings[padding],
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
