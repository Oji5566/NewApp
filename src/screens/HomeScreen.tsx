import { useMemo, useState } from "react";
import { Wrench, Lightbulb, CheckSquare, Pin, Plane, Utensils, Wifi } from "lucide-react";
import type { ManualCard, ManualType } from "../types/manual";
import { SearchField } from "../components/SearchField";
import { ManualCardListItem } from "../components/ManualCardListItem";
import { searchManuals } from "../utils/searchManuals";
import { EmptyState } from "../components/EmptyState";
import { PillButton } from "../components/PillButton";

interface Props {
  manuals: ManualCard[];
  onOpenManual: (id: string) => void;
  onQuickCreate: (type: ManualType) => void;
  onGoCreate: () => void;
  onApplyCollection: (query: string) => void;
}

const collections: { id: string; label: string; query: string; Icon: typeof Wifi }[] = [
  { id: "tech", label: "When home tech breaks", query: "router printer wi-fi", Icon: Wifi },
  { id: "travel", label: "When I travel", query: "travel packing", Icon: Plane },
  { id: "tired", label: "When I’m too tired to cook", query: "tired dinner", Icon: Utensils },
];

export function HomeScreen({
  manuals,
  onOpenManual,
  onQuickCreate,
  onGoCreate,
  onApplyCollection,
}: Props) {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const active = manuals.filter((m) => !m.archived);
    if (!query.trim()) return active;
    return searchManuals(active, query);
  }, [manuals, query]);

  const pinned = useMemo(
    () => manuals.filter((m) => m.pinned && !m.archived).slice(0, 4),
    [manuals]
  );

  const recent = useMemo(() => {
    return [...manuals]
      .filter((m) => !m.archived)
      .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
      .slice(0, 5);
  }, [manuals]);

  const totalActive = manuals.filter((m) => !m.archived).length;

  return (
    <div className="px-5 pt-[calc(env(safe-area-inset-top)+18px)] pb-32">
      <header className="mb-6">
        <h1 className="text-[30px] font-bold text-ink leading-tight">Manuals</h1>
        <p className="mt-1 text-[15.5px] text-ink-muted">
          Your personal manual for what works.
        </p>
      </header>

      <SearchField
        value={query}
        onValueChange={setQuery}
        placeholder="Search printer, packing, dinner…"
        aria-label="Search manuals"
      />

      {!query ? (
        <>
          <section className="mt-7" aria-label="Quick actions">
            <h2 className="text-[13px] uppercase tracking-wider text-ink-soft font-semibold mb-3 px-1">
              Quick actions
            </h2>
            <div className="flex gap-2 overflow-x-auto -mx-5 px-5 pb-1 scrollbar-none">
              <PillButton
                variant="secondary"
                size="md"
                icon={<Wrench className="w-4 h-4" strokeWidth={1.8} />}
                onClick={() => onQuickCreate("Fix")}
              >
                New Fix
              </PillButton>
              <PillButton
                variant="secondary"
                size="md"
                icon={<Lightbulb className="w-4 h-4" strokeWidth={1.8} />}
                onClick={() => onQuickCreate("Tip")}
              >
                New Tip
              </PillButton>
              <PillButton
                variant="secondary"
                size="md"
                icon={<CheckSquare className="w-4 h-4" strokeWidth={1.8} />}
                onClick={() => onQuickCreate("Checklist")}
              >
                New Checklist
              </PillButton>
            </div>
          </section>

          {totalActive === 0 ? (
            <EmptyState
              title="Nothing saved yet."
              body="Save your first fix, tip, or checklist so you can find it next time."
              icon={<Lightbulb className="w-7 h-7" strokeWidth={1.8} />}
              action={
                <PillButton variant="primary" size="md" onClick={onGoCreate}>
                  Create Manual
                </PillButton>
              }
            />
          ) : (
            <>
              {pinned.length > 0 ? (
                <section className="mt-8" aria-label="Pinned manuals">
                  <h2 className="text-[13px] uppercase tracking-wider text-ink-soft font-semibold mb-3 px-1 flex items-center gap-1.5">
                    <Pin className="w-3.5 h-3.5" strokeWidth={2} />
                    Pinned
                  </h2>
                  <div className="space-y-3">
                    {pinned.map((m) => (
                      <ManualCardListItem
                        key={m.id}
                        manual={m}
                        onClick={() => onOpenManual(m.id)}
                      />
                    ))}
                  </div>
                </section>
              ) : null}

              <section className="mt-8" aria-label="Recently updated">
                <h2 className="text-[13px] uppercase tracking-wider text-ink-soft font-semibold mb-3 px-1">
                  Recently updated
                </h2>
                <div className="space-y-3">
                  {recent.map((m) => (
                    <ManualCardListItem
                      key={m.id}
                      manual={m}
                      onClick={() => onOpenManual(m.id)}
                    />
                  ))}
                </div>
              </section>

              <section className="mt-8" aria-label="Suggested collections">
                <h2 className="text-[13px] uppercase tracking-wider text-ink-soft font-semibold mb-3 px-1">
                  Suggested collections
                </h2>
                <div className="space-y-3">
                  {collections.map(({ id, label, query: q, Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => onApplyCollection(q)}
                      className="w-full text-left flex items-center gap-4 bg-surface border border-line rounded-3xl p-4 shadow-soft hover:bg-surface-soft transition-colors"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-surface-muted flex items-center justify-center text-ink-muted">
                        <Icon className="w-5 h-5" strokeWidth={1.8} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[15.5px] font-medium text-ink">{label}</p>
                        <p className="text-[13px] text-ink-soft">Tap to filter</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            </>
          )}
        </>
      ) : (
        <section className="mt-6" aria-label="Search results">
          <h2 className="text-[13px] uppercase tracking-wider text-ink-soft font-semibold mb-3 px-1">
            {visible.length} result{visible.length === 1 ? "" : "s"}
          </h2>
          {visible.length === 0 ? (
            <EmptyState
              title="No manuals found."
              body="Try another word, or save this as a new manual if you just figured it out."
              icon={<Lightbulb className="w-7 h-7" strokeWidth={1.8} />}
              action={
                <PillButton variant="primary" onClick={onGoCreate}>
                  Create Manual
                </PillButton>
              }
            />
          ) : (
            <div className="space-y-3">
              {visible.map((m) => (
                <ManualCardListItem
                  key={m.id}
                  manual={m}
                  onClick={() => onOpenManual(m.id)}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
