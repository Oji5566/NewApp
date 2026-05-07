import { useEffect } from "react";
import { PillButton } from "./PillButton";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  body?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 animate-fade-in"
      onClick={onCancel}
    >
      <div
        className="bg-surface w-full sm:max-w-sm m-3 rounded-3xl p-6 shadow-soft animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-title" className="text-[20px] font-semibold text-ink">
          {title}
        </h2>
        {body ? (
          <p className="mt-2 text-[15px] text-ink-muted">{body}</p>
        ) : null}
        <div className="mt-6 flex gap-3">
          <PillButton
            onClick={onCancel}
            variant="secondary"
            fullWidth
          >
            {cancelLabel}
          </PillButton>
          <PillButton
            onClick={onConfirm}
            variant={destructive ? "primary" : "primary"}
            fullWidth
            className={destructive ? "!bg-danger hover:!bg-danger" : ""}
          >
            {confirmLabel}
          </PillButton>
        </div>
      </div>
    </div>
  );
}
