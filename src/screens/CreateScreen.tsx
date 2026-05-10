import { useEffect, useMemo, useState } from "react";
import { Plus, X, GripVertical, Trash2, Image as ImageIcon, Link as LinkIcon, FileText, Camera } from "lucide-react";
import type {
  EvidenceType,
  ManualCard,
  ManualEvidence,
  ManualResult,
  ManualType,
} from "../types/manual";
import {
  EVIDENCE_TYPES,
  MANUAL_RESULTS,
  MANUAL_TYPES,
} from "../types/manual";
import { Chip } from "../components/Chip";
import { PillButton } from "../components/PillButton";
import { typeIcon } from "../components/typeIcons";
import { generateId } from "../utils/id";
import { IconButton } from "../components/IconButton";

interface Props {
  categories: string[];
  initial?: ManualCard;
  initialType?: ManualType;
  onCancel?: () => void;
  onSave: (input: ManualFormOutput, id?: string) => void;
}

export interface ManualFormOutput {
  title: string;
  type: ManualType;
  category: string;
  summary: string;
  whatWorked?: string;
  steps: string[];
  whatDidNotWork: string[];
  evidence: ManualEvidence[];
  result: ManualResult;
  doThisNextTime?: string;
  tags: string[];
  pinned: boolean;
}

interface FieldLabels {
  summary: string;
  whatWorked?: string;
  steps: string;
  whatDidNotWork?: string;
  doThisNextTime?: string;
}

const LABELS: Record<ManualType, FieldLabels> = {
  Fix: {
    summary: "What happened?",
    whatWorked: "What worked?",
    steps: "Steps",
    whatDidNotWork: "What did not work",
    doThisNextTime: "Do this next time",
  },
  Tip: {
    summary: "Tip",
    whatWorked: "Why it works",
    steps: "When to use it",
  },
  Routine: {
    summary: "When to use",
    whatWorked: "Time needed",
    steps: "Steps",
    doThisNextTime: "Do this next time",
  },
  Checklist: {
    summary: "When to use",
    steps: "Checklist items",
    doThisNextTime: "Notes",
  },
  Setting: {
    summary: "Device or app",
    whatWorked: "Value to enable",
    steps: "Setting path",
    doThisNextTime: "Notes",
  },
  Lesson: {
    summary: "What happened",
    whatWorked: "Better next time",
    steps: "What to avoid",
  },
  Recommendation: {
    summary: "What it is",
    whatWorked: "Why it worked",
    steps: "Where to get it",
    doThisNextTime: "Who or when it’s good for",
  },
};

export function CreateScreen({
  categories,
  initial,
  initialType,
  onCancel,
  onSave,
}: Props) {
  const [type, setType] = useState<ManualType>(
    initial?.type ?? initialType ?? "Fix"
  );
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState(initial?.category ?? categories[0] ?? "Home");
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [whatWorked, setWhatWorked] = useState(initial?.whatWorked ?? "");
  const [steps, setSteps] = useState<string[]>(initial?.steps?.length ? initial.steps : [""]);
  const [whatDidNotWork, setWhatDidNotWork] = useState<string[]>(
    initial?.whatDidNotWork?.length ? initial.whatDidNotWork : []
  );
  const [evidence, setEvidence] = useState<ManualEvidence[]>(initial?.evidence ?? []);
  const [result, setResult] = useState<ManualResult>(initial?.result ?? "Unknown");
  const [doThisNextTime, setDoThisNextTime] = useState(initial?.doThisNextTime ?? "");
  const [tagsInput, setTagsInput] = useState((initial?.tags ?? []).join(", "));
  const [pinned, setPinned] = useState(!!initial?.pinned);
  const [error, setError] = useState<string | null>(null);

  // Reset form if a new initialType is provided (e.g. quick action navigation)
  useEffect(() => {
    if (!initial && initialType) setType(initialType);
  }, [initialType, initial]);

  const labels = LABELS[type];
  const Icon = typeIcon(type);

  const tagList = useMemo(
    () =>
      tagsInput
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
    [tagsInput]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please add a title.");
      return;
    }
    setError(null);
    const cleanedSteps = steps.map((s) => s.trim()).filter(Boolean);
    const cleanedDidNot = whatDidNotWork.map((s) => s.trim()).filter(Boolean);
    onSave(
      {
        title: title.trim(),
        type,
        category,
        summary: summary.trim(),
        whatWorked: whatWorked.trim() || undefined,
        steps: cleanedSteps,
        whatDidNotWork: cleanedDidNot,
        evidence,
        result,
        doThisNextTime: doThisNextTime.trim() || undefined,
        tags: tagList,
        pinned,
      },
      initial?.id
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="px-5 pt-[calc(env(safe-area-inset-top)+18px)] pb-40"
    >
      <header className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[28px] font-bold text-ink leading-tight">
            {initial ? "Edit Manual" : "Create"}
          </h1>
          <p className="mt-1 text-[14.5px] text-ink-muted">
            What did you figure out?
          </p>
        </div>
        {onCancel ? (
          <IconButton label="Cancel" onClick={onCancel}>
            <X className="w-5 h-5" strokeWidth={2} />
          </IconButton>
        ) : null}
      </header>

      <Section label="Type">
        <div className="flex gap-2 overflow-x-auto -mx-5 px-5 pb-1 scrollbar-none">
          {MANUAL_TYPES.map((t) => (
            <Chip key={t} active={type === t} onClick={() => setType(t)}>
              {t}
            </Chip>
          ))}
        </div>
      </Section>

      <Section label="Title">
        <input
          type="text"
          required
          maxLength={120}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give it a short, memorable name"
          className="w-full bg-surface border border-line rounded-2xl h-14 px-5 text-[16px] text-ink placeholder:text-ink-soft outline-none focus:border-primary"
        />
        {error ? (
          <p className="mt-2 text-[13px] text-danger">{error}</p>
        ) : null}
      </Section>

      <Section label="Category">
        <div className="flex gap-2 overflow-x-auto -mx-5 px-5 pb-1 scrollbar-none">
          {categories.map((c) => (
            <Chip
              key={c}
              active={category === c}
              onClick={() => setCategory(c)}
              tone="neutral"
            >
              {c}
            </Chip>
          ))}
        </div>
      </Section>

      <Section label={labels.summary}>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={3}
          placeholder="A short, honest description"
          className="w-full bg-surface border border-line rounded-2xl px-5 py-4 text-[16px] text-ink placeholder:text-ink-soft outline-none focus:border-primary resize-none"
        />
      </Section>

      {labels.whatWorked ? (
        <Section label={labels.whatWorked}>
          <textarea
            value={whatWorked}
            onChange={(e) => setWhatWorked(e.target.value)}
            rows={2}
            placeholder="The thing that actually worked"
            className="w-full bg-surface border border-line rounded-2xl px-5 py-4 text-[16px] text-ink placeholder:text-ink-soft outline-none focus:border-primary resize-none"
          />
        </Section>
      ) : null}

      <Section label={labels.steps}>
        <StepsEditor steps={steps} onChange={setSteps} placeholder={stepPlaceholder(type)} />
      </Section>

      {labels.whatDidNotWork ? (
        <Section label={labels.whatDidNotWork}>
          <BulletEditor
            items={whatDidNotWork}
            onChange={setWhatDidNotWork}
            placeholder="Something you tried that did not help"
          />
        </Section>
      ) : null}

      <Section label="Evidence">
        <EvidenceEditor evidence={evidence} onChange={setEvidence} />
      </Section>

      <Section label="Result">
        <div className="flex gap-2 flex-wrap">
          {MANUAL_RESULTS.map((r) => (
            <Chip key={r} active={result === r} onClick={() => setResult(r)}>
              {r}
            </Chip>
          ))}
        </div>
      </Section>

      {labels.doThisNextTime ? (
        <Section label={labels.doThisNextTime}>
          <textarea
            value={doThisNextTime}
            onChange={(e) => setDoThisNextTime(e.target.value)}
            rows={2}
            placeholder="A reminder for future you"
            className="w-full bg-surface border border-line rounded-2xl px-5 py-4 text-[16px] text-ink placeholder:text-ink-soft outline-none focus:border-primary resize-none"
          />
        </Section>
      ) : null}

      <Section label="Tags">
        <input
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="comma, separated, tags"
          className="w-full bg-surface border border-line rounded-2xl h-14 px-5 text-[16px] text-ink placeholder:text-ink-soft outline-none focus:border-primary"
        />
        {tagList.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {tagList.map((t) => (
              <span
                key={t}
                className="inline-flex items-center px-3 h-7 rounded-full bg-surface-muted text-ink-muted text-[12.5px]"
              >
                #{t}
              </span>
            ))}
          </div>
        ) : null}
      </Section>

      <Section label="Pin to Home">
        <label className="flex items-center justify-between bg-surface border border-line rounded-2xl px-5 h-14">
          <span className="text-[15.5px] text-ink">
            Show this on Home for quick access
          </span>
          <Toggle checked={pinned} onChange={setPinned} label="Pin to Home" />
        </label>
      </Section>

      <div className="fixed bottom-0 inset-x-0 z-20 pointer-events-none">
        <div className="mx-auto max-w-[560px] px-3 pb-[calc(env(safe-area-inset-bottom)+88px)] pointer-events-auto">
          <div className="bg-surface border border-line rounded-full shadow-soft px-3 py-2 flex items-center gap-2">
            <div className="pl-3 pr-1 flex items-center gap-2 text-ink-muted text-[13.5px]">
              <Icon className="w-4 h-4" strokeWidth={1.8} />
              {type}
            </div>
            <div className="flex-1" />
            <PillButton type="submit" variant="primary" size="md">
              {initial ? "Save changes" : "Save Manual"}
            </PillButton>
          </div>
        </div>
      </div>
    </form>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <p className="text-[12px] uppercase tracking-wider text-ink-soft font-semibold mb-2.5 px-1">
        {label}
      </p>
      {children}
    </section>
  );
}

function StepsEditor({
  steps,
  onChange,
  placeholder,
}: {
  steps: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const updateAt = (i: number, value: string) => {
    const next = [...steps];
    next[i] = value;
    onChange(next);
  };
  const removeAt = (i: number) => {
    const next = steps.filter((_, j) => j !== i);
    onChange(next.length ? next : [""]);
  };
  const add = () => onChange([...steps, ""]);

  return (
    <div className="space-y-2.5">
      {steps.map((s, i) => (
        <div
          key={i}
          className="flex items-center gap-2 bg-surface border border-line rounded-2xl px-3 h-14"
        >
          <span
            aria-hidden
            className="w-7 h-7 rounded-full bg-surface-muted text-ink-muted text-[13px] font-semibold flex items-center justify-center shrink-0"
          >
            {i + 1}
          </span>
          <input
            type="text"
            value={s}
            onChange={(e) => updateAt(i, e.target.value)}
            placeholder={placeholder ?? "Add a step"}
            className="flex-1 bg-transparent outline-none text-[15.5px] text-ink placeholder:text-ink-soft"
          />
          <button
            type="button"
            onClick={() => removeAt(i)}
            aria-label={`Remove step ${i + 1}`}
            className="w-9 h-9 rounded-full flex items-center justify-center text-ink-soft hover:bg-surface-muted"
          >
            <Trash2 className="w-4 h-4" strokeWidth={1.8} />
          </button>
          <span aria-hidden className="text-ink-soft pr-1">
            <GripVertical className="w-4 h-4" strokeWidth={1.8} />
          </span>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-2 h-11 px-4 rounded-full bg-surface-muted text-ink-muted hover:bg-line text-sm font-medium"
      >
        <Plus className="w-4 h-4" strokeWidth={2} />
        Add step
      </button>
    </div>
  );
}

function BulletEditor({
  items,
  onChange,
  placeholder,
}: {
  items: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
}) {
  const updateAt = (i: number, value: string) => {
    const next = [...items];
    next[i] = value;
    onChange(next);
  };
  const removeAt = (i: number) => {
    onChange(items.filter((_, j) => j !== i));
  };
  const add = () => onChange([...items, ""]);

  return (
    <div className="space-y-2.5">
      {items.map((s, i) => (
        <div
          key={i}
          className="flex items-center gap-2 bg-surface border border-line rounded-2xl px-3 h-14"
        >
          <span aria-hidden className="text-ink-soft pl-2 pr-1">
            —
          </span>
          <input
            type="text"
            value={s}
            onChange={(e) => updateAt(i, e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none text-[15.5px] text-ink placeholder:text-ink-soft"
          />
          <button
            type="button"
            onClick={() => removeAt(i)}
            aria-label={`Remove item ${i + 1}`}
            className="w-9 h-9 rounded-full flex items-center justify-center text-ink-soft hover:bg-surface-muted"
          >
            <Trash2 className="w-4 h-4" strokeWidth={1.8} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-2 h-11 px-4 rounded-full bg-surface-muted text-ink-muted hover:bg-line text-sm font-medium"
      >
        <Plus className="w-4 h-4" strokeWidth={2} />
        Add item
      </button>
    </div>
  );
}

function EvidenceEditor({
  evidence,
  onChange,
}: {
  evidence: ManualEvidence[];
  onChange: (next: ManualEvidence[]) => void;
}) {
  const [draftType, setDraftType] = useState<EvidenceType>("Note");
  const [draftLabel, setDraftLabel] = useState("");
  const [draftValue, setDraftValue] = useState("");

  const add = () => {
    if (!draftLabel.trim()) return;
    onChange([
      ...evidence,
      {
        id: generateId(),
        type: draftType,
        label: draftLabel.trim(),
        value: draftValue.trim() || undefined,
      },
    ]);
    setDraftLabel("");
    setDraftValue("");
  };

  const remove = (id: string) => onChange(evidence.filter((e) => e.id !== id));

  return (
    <div className="space-y-3">
      {evidence.length ? (
        <ul className="space-y-2">
          {evidence.map((e) => {
            const Icon = evidenceIcon(e.type);
            return (
              <li
                key={e.id}
                className="flex items-center gap-3 bg-surface-soft border border-line rounded-2xl px-4 py-3"
              >
                <span className="w-8 h-8 rounded-xl bg-surface-muted text-ink-muted flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" strokeWidth={1.8} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14.5px] text-ink truncate">{e.label}</p>
                  {e.value ? (
                    <p className="text-[12.5px] text-ink-muted truncate">
                      {e.value}
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => remove(e.id)}
                  aria-label="Remove evidence"
                  className="w-9 h-9 rounded-full text-ink-soft hover:bg-surface-muted flex items-center justify-center"
                >
                  <X className="w-4 h-4" strokeWidth={2} />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      <div className="bg-surface border border-line rounded-2xl p-4 space-y-3">
        <div className="flex gap-2 flex-wrap">
          {EVIDENCE_TYPES.map((t) => (
            <Chip key={t} size="sm" active={draftType === t} onClick={() => setDraftType(t)}>
              {t}
            </Chip>
          ))}
        </div>
        <input
          type="text"
          value={draftLabel}
          onChange={(e) => setDraftLabel(e.target.value)}
          placeholder="Short label (e.g. router admin URL)"
          className="w-full bg-surface-soft border border-line rounded-2xl h-12 px-4 text-[15px] outline-none focus:border-primary"
        />
        <input
          type="text"
          value={draftValue}
          onChange={(e) => setDraftValue(e.target.value)}
          placeholder={
            draftType === "Link" ? "https://…" : "Optional detail"
          }
          className="w-full bg-surface-soft border border-line rounded-2xl h-12 px-4 text-[15px] outline-none focus:border-primary"
        />
        <PillButton
          type="button"
          variant="secondary"
          size="sm"
          onClick={add}
          icon={<Plus className="w-4 h-4" strokeWidth={2} />}
        >
          Add evidence
        </PillButton>
      </div>
    </div>
  );
}

function evidenceIcon(t: EvidenceType) {
  switch (t) {
    case "Photo":
      return Camera;
    case "Screenshot":
      return ImageIcon;
    case "Link":
      return LinkIcon;
    case "Note":
    default:
      return FileText;
  }
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={[
        "relative w-12 h-7 rounded-full transition-colors",
        checked ? "bg-primary" : "bg-line",
      ].join(" ")}
    >
      <span
        className={[
          "absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-soft transition-transform",
          checked ? "translate-x-5" : "translate-x-0",
        ].join(" ")}
      />
    </button>
  );
}

function stepPlaceholder(t: ManualType): string {
  switch (t) {
    case "Checklist":
      return "Add a checklist item";
    case "Setting":
      return "Path, e.g. Settings → Network → Advanced";
    case "Recommendation":
      return "Where to get it";
    case "Lesson":
      return "Something to avoid";
    default:
      return "Add a step";
  }
}
