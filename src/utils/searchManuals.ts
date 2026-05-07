import type { ManualCard } from "../types/manual";

export function searchManuals(manuals: ManualCard[], query: string): ManualCard[] {
  const q = query.trim().toLowerCase();
  if (!q) return manuals;
  return manuals.filter((m) => matches(m, q));
}

function matches(m: ManualCard, q: string): boolean {
  const haystack = [
    m.title,
    m.summary,
    m.whatWorked ?? "",
    m.doThisNextTime ?? "",
    m.steps.join(" "),
    (m.whatDidNotWork ?? []).join(" "),
    m.tags.join(" "),
    m.category,
    m.type,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}
