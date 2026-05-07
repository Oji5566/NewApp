import { ChevronLeft, Pencil, Pin, Copy, Share2, Trash2, Tag, Calendar, Hash } from "lucide-react";
import type { ManualCard } from "../types/manual";
import { typeIcon } from "../components/typeIcons";
import { ResultBadge } from "../components/ResultBadge";
import { IconButton } from "../components/IconButton";
import { PillButton } from "../components/PillButton";
import { useState } from "react";
import { copyToClipboard } from "../utils/exportManuals";
import { formatStepsForCopy, formatManualMarkdown } from "../utils/formatManual";
import { ConfirmDialog } from "../components/ConfirmDialog";

interface Props {
  manual: ManualCard;
  onBack: () => void;
  onEdit: () => void;
  onTogglePin: () => void;
  onDelete: () => void;
  onToast: (msg: string) => void;
}

export function DetailScreen({
  manual,
  onBack,
  onEdit,
  onTogglePin,
  onDelete,
  onToast,
}: Props) {
  const Icon = typeIcon(manual.type);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleCopy = async () => {
    if (manual.steps.length === 0) {
      onToast("No steps to copy");
      return;
    }
    const ok = await copyToClipboard(formatStepsForCopy(manual));
    onToast(ok ? "Steps copied" : "Could not copy");
  };

  const handleShare = async () => {
    const text = formatManualMarkdown(manual);
    if (navigator.share) {
      try {
        await navigator.share({ title: manual.title, text });
        return;
      } catch {
        // user cancelled or unsupported, fall through to copy
      }
    }
    const ok = await copyToClipboard(text);
    onToast(ok ? "Manual copied to clipboard" : "Could not share");
  };

  return (
    <div className="px-5 pt-[calc(env(safe-area-inset-top)+12px)] pb-40">
      <div className="flex items-center justify-between mb-4">
        <IconButton label="Back" onClick={onBack}>
          <ChevronLeft className="w-5 h-5" strokeWidth={2} />
        </IconButton>
        <IconButton label="Edit manual" onClick={onEdit}>
          <Pencil className="w-[18px] h-[18px]" strokeWidth={1.8} />
        </IconButton>
      </div>

      <header className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[color:var(--color-primary-soft)] text-primary flex items-center justify-center">
            <Icon className="w-6 h-6" strokeWidth={1.8} />
          </div>
          {manual.pinned ? (
            <span className="inline-flex items-center gap-1 text-[12px] text-primary font-medium bg-[color:var(--color-primary-soft)] px-2.5 h-7 rounded-full">
              <Pin className="w-3.5 h-3.5" fill="currentColor" strokeWidth={2} />
              Pinned
            </span>
          ) : null}
        </div>
        <h1 className="text-[26px] font-bold text-ink leading-tight">
          {manual.title}
        </h1>
        <div className="mt-3 flex items-center gap-2 text-[13.5px] text-ink-muted flex-wrap">
          <span className="font-medium">{manual.type}</span>
          <span aria-hidden>·</span>
          <span>{manual.category}</span>
          <span aria-hidden>·</span>
          <ResultBadge result={manual.result} />
        </div>
      </header>

      {manual.summary ? (
        <Section title="Summary">
          <p className="text-[15.5px] text-ink leading-relaxed whitespace-pre-wrap">
            {manual.summary}
          </p>
        </Section>
      ) : null}

      {manual.whatWorked ? (
        <Section title="What worked">
          <p className="text-[15.5px] text-ink leading-relaxed whitespace-pre-wrap">
            {manual.whatWorked}
          </p>
        </Section>
      ) : null}

      {manual.steps.length ? (
        <Section title="Steps">
          <ol className="space-y-2.5">
            {manual.steps.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 w-7 h-7 rounded-full bg-surface-muted text-ink-muted text-[13px] font-semibold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span className="text-[15.5px] text-ink leading-relaxed pt-0.5">
                  {s}
                </span>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}

      {manual.evidence.length ? (
        <Section title="Evidence">
          <ul className="space-y-2">
            {manual.evidence.map((e) => (
              <li
                key={e.id}
                className="flex items-center gap-3 bg-surface-soft border border-line rounded-2xl px-4 py-3"
              >
                <span className="text-[12px] uppercase font-semibold text-ink-soft tracking-wider w-20 shrink-0">
                  {e.type}
                </span>
                <span className="text-[15px] text-ink truncate">
                  {e.label}
                  {e.value ? (
                    <span className="text-ink-muted"> — {e.value}</span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {manual.whatDidNotWork && manual.whatDidNotWork.length ? (
        <Section title="What did not work">
          <ul className="space-y-2">
            {manual.whatDidNotWork.map((s, i) => (
              <li
                key={i}
                className="flex gap-3 text-[15px] text-ink-muted"
              >
                <span aria-hidden className="text-ink-soft">—</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {manual.doThisNextTime ? (
        <Section title="Do this next time">
          <p className="text-[15.5px] text-ink leading-relaxed whitespace-pre-wrap">
            {manual.doThisNextTime}
          </p>
        </Section>
      ) : null}

      {manual.tags.length ? (
        <Section title="Tags">
          <div className="flex flex-wrap gap-2">
            {manual.tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 px-3 h-8 rounded-full bg-surface-muted text-ink-muted text-[13px]"
              >
                <Tag className="w-3 h-3" strokeWidth={2} />#{t}
              </span>
            ))}
          </div>
        </Section>
      ) : null}

      <Section title="Details">
        <ul className="space-y-2.5 text-[14px] text-ink-muted">
          <li className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-ink-soft" strokeWidth={1.8} />
            Created {formatDate(manual.createdAt)}
          </li>
          <li className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-ink-soft" strokeWidth={1.8} />
            Updated {formatDate(manual.updatedAt)}
          </li>
          <li className="flex items-center gap-3">
            <Hash className="w-4 h-4 text-ink-soft" strokeWidth={1.8} />
            Used {manual.useCount} {manual.useCount === 1 ? "time" : "times"}
          </li>
        </ul>
      </Section>

      <div className="fixed bottom-0 inset-x-0 z-20 pointer-events-none">
        <div className="mx-auto max-w-[560px] px-3 pb-[calc(env(safe-area-inset-bottom)+88px)] pointer-events-auto">
          <div className="bg-surface border border-line rounded-full shadow-soft px-3 py-2 flex items-center gap-2">
            <IconButton label="Copy steps" onClick={handleCopy}>
              <Copy className="w-[18px] h-[18px]" strokeWidth={1.8} />
            </IconButton>
            <IconButton label="Share manual" onClick={handleShare}>
              <Share2 className="w-[18px] h-[18px]" strokeWidth={1.8} />
            </IconButton>
            <IconButton
              label={manual.pinned ? "Unpin" : "Pin"}
              onClick={onTogglePin}
              tone={manual.pinned ? "primary" : "neutral"}
            >
              <Pin
                className="w-[18px] h-[18px]"
                strokeWidth={1.8}
                fill={manual.pinned ? "currentColor" : "none"}
              />
            </IconButton>
            <div className="flex-1" />
            <IconButton
              label="Delete manual"
              tone="danger"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="w-[18px] h-[18px]" strokeWidth={1.8} />
            </IconButton>
            <PillButton variant="primary" size="sm" onClick={handleCopy}>
              Copy steps
            </PillButton>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this manual?"
        body="This cannot be undone."
        confirmLabel="Delete"
        destructive
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          setConfirmDelete(false);
          onDelete();
        }}
      />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <h2 className="text-[12px] uppercase tracking-wider text-ink-soft font-semibold mb-3 px-1">
        {title}
      </h2>
      <div className="bg-surface border border-line rounded-3xl p-5 shadow-soft">
        {children}
      </div>
    </section>
  );
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}
