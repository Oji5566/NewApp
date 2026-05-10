import { useMemo, useState } from "react";
import { BookOpen, ChevronDown } from "lucide-react";
import type { ManualCard, ManualResult, ManualType } from "../types/manual";
import { MANUAL_RESULTS, MANUAL_TYPES, DEFAULT_CATEGORIES } from "../types/manual";
import { SearchField } from "../components/SearchField";
import { Chip } from "../components/Chip";
import { ManualCardListItem } from "../components/ManualCardListItem";
import { searchManuals } from "../utils/searchManuals";
import { EmptyState } from "../components/EmptyState";
import { PillButton } from "../components/PillButton";

interface Props {
  manuals: ManualCard[];
  initialQuery?: string;
  onOpenManual: (id: string) => void;
  onGoCreate: () => void;
}

type SortKey =
  | "recent"
  | "mostUsed"
  | "az"
  | "workedOnly"
  | "pinnedFirst";

const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: "recent", label: "Recently updated" },
  { id: "pinnedFirst", label: "Pinned first" },
  { id: "mostUsed", label: "Most used" },
  { id: "az", label: "A–Z" },
  { id: "workedOnly", label: "Worked only" },
];

export function LibraryScreen({
  manuals,
  initialQuery,
  onOpenManual,
  onGoCreate,
}: Props) {
  const [query, setQuery] = useState(initialQuery ?? "");
  const [type, setType] = useState<ManualType | "All">("All");
  const [category, setCategory] = useState<string | "All">("All");
  const [result, setResult] = useState<ManualResult | "All">("All");
  const [sort, setSort] = useState<SortKey>("recent");

  const allCategories = useMemo(() => {
    const set = new Set<string>(DEFAULT_CATEGORIES);
    manuals.forEach((m) => set.add(m.category));
    return Array.from(set);
  }, [manuals]);

  const filtered = useMemo(() => {
    let items = manuals.filter((m) => !m.archived);
    if (type !== "All") items = items.filter((m) => m.type === type);
    if (category !== "All") items = items.filter((m) => m.category === category);
    if (result !== "All") items = items.filter((m) => m.result === result);
    items = searchManuals(items, query);

    const byUpdated = (a: ManualCard, b: ManualCard) =>
      +new Date(b.updatedAt) - +new Date(a.updatedAt);
    switch (sort) {
      case "recent":
        items = [...items].sort(byUpdated);
        break;
      case "mostUsed":
        items = [...items].sort((a, b) => b.useCount - a.useCount || byUpdated(a, b));
        break;
      case "az":
        items = [...items].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "workedOnly":
        items = items.filter((m) => m.result === "Worked").sort(byUpdated);
        break;
      case "pinnedFirst":
        items = [...items].sort(
          (a, b) => Number(b.pinned) - Number(a.pinned) || byUpdated(a, b)
        );
        break;
    }
    return items;
  }, [manuals, type, category, result, query, sort]);

  const totalActive = manuals.filter((m) => !m.archived).length;

  return (
    <div className="px-5 pt-[calc(env(safe-area-inset-top)+18px)] pb-32">
      <header className="mb-5">
        <h1 className="text-[28px] font-bold text-ink leading-tight">Library</h1>
        <p className="mt-1 text-[14.5px] text-ink-muted">
          Your full personal knowledge base.
        </p>
      </header>

      <SearchField
        value={query}
        onValueChange={setQuery}
        placeholder="Search everything…"
        aria-label="Search everything"
      />

      <div className="mt-5">
        <p className="text-[12px] uppercase tracking-wider text-ink-soft font-semibold mb-2 px-1">
          Type
        </p>
        <div className="flex gap-2 overflow-x-auto -mx-5 px-5 pb-1 scrollbar-none">
          <Chip active={type === "All"} onClick={() => setType("All")}>
            All
          </Chip>
          {MANUAL_TYPES.map((t) => (
            <Chip key={t} active={type === t} onClick={() => setType(t)}>
              {pluralizeType(t)}
            </Chip>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[12px] uppercase tracking-wider text-ink-soft font-semibold mb-2 px-1">
          Category
        </p>
        <div className="flex gap-2 overflow-x-auto -mx-5 px-5 pb-1 scrollbar-none">
          <Chip active={category === "All"} onClick={() => setCategory("All")}>
            All
          </Chip>
          {allCategories.map((c) => (
            <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
              {c}
            </Chip>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[12px] uppercase tracking-wider text-ink-soft font-semibold mb-2 px-1">
          Result
        </p>
        <div className="flex gap-2 overflow-x-auto -mx-5 px-5 pb-1 scrollbar-none">
          <Chip active={result === "All"} onClick={() => setResult("All")}>
            All
          </Chip>
          {MANUAL_RESULTS.map((r) => (
            <Chip key={r} active={result === r} onClick={() => setResult(r)}>
              {r}
            </Chip>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-[13px] text-ink-soft">
          {filtered.length} of {totalActive}
        </p>
        <label className="relative">
          <span className="sr-only">Sort by</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="appearance-none bg-surface border border-line rounded-full pl-4 pr-10 h-10 text-sm font-medium text-ink"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft pointer-events-none"
            strokeWidth={2}
          />
        </label>
      </div>

      <div className="mt-4 space-y-3">
        {filtered.length === 0 ? (
          totalActive === 0 ? (
            <EmptyState
              title="Your library is waiting."
              body="Manuals become useful the moment life repeats itself."
              icon={<BookOpen className="w-7 h-7" strokeWidth={1.8} />}
              action={
                <PillButton variant="primary" onClick={onGoCreate}>
                  Add your first manual
                </PillButton>
              }
            />
          ) : (
            <EmptyState
              title="No manuals match these filters."
              body="Try adjusting type, category, or result."
            />
          )
        ) : (
          filtered.map((m) => (
            <ManualCardListItem
              key={m.id}
              manual={m}
              onClick={() => onOpenManual(m.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function pluralizeType(t: ManualType): string {
  switch (t) {
    case "Fix":
      return "Fixes";
    default:
      return t + "s";
  }
}
