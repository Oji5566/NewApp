import { useEffect } from "react";
import { Check } from "lucide-react";

interface Props {
  message: string | null;
  onDismiss: () => void;
  duration?: number;
}

export function Toast({ message, onDismiss, duration = 1800 }: Props) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDismiss, duration);
    return () => clearTimeout(t);
  }, [message, duration, onDismiss]);

  if (!message) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed left-1/2 bottom-24 -translate-x-1/2 z-50 animate-toast-in"
    >
      <div className="bg-ink text-bg rounded-full pl-3 pr-5 h-11 flex items-center gap-2 shadow-soft">
        <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
          <Check className="w-3.5 h-3.5" strokeWidth={3} />
        </span>
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}
