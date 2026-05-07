import { Search, X } from "lucide-react";
import type { InputHTMLAttributes } from "react";

interface SearchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  value: string;
  onValueChange: (v: string) => void;
  placeholder?: string;
}

export function SearchField({
  value,
  onValueChange,
  placeholder = "Search…",
  className = "",
  ...rest
}: SearchFieldProps) {
  return (
    <div
      className={[
        "flex items-center gap-3 bg-surface border border-line rounded-full",
        "px-5 h-14 shadow-soft",
        className,
      ].join(" ")}
    >
      <Search className="w-5 h-5 text-ink-soft shrink-0" strokeWidth={2} />
      <input
        {...rest}
        type="search"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-[16px] placeholder:text-ink-soft"
      />
      {value ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onValueChange("")}
          className="w-8 h-8 rounded-full flex items-center justify-center text-ink-muted hover:bg-surface-muted"
        >
          <X className="w-4 h-4" />
        </button>
      ) : null}
    </div>
  );
}
