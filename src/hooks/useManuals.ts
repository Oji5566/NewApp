import { useCallback, useEffect, useMemo, useState } from "react";
import type { ManualCard } from "../types/manual";
import {
  loadManuals,
  saveManuals,
  restoreDemoData as storageRestoreDemo,
  importManualsFromJSON as storageImport,
} from "../storage/manualsStorage";
import { generateId } from "../utils/id";

export interface NewManualInput {
  title: string;
  type: ManualCard["type"];
  category: string;
  summary?: string;
  whatWorked?: string;
  steps?: string[];
  whatDidNotWork?: string[];
  evidence?: ManualCard["evidence"];
  result?: ManualCard["result"];
  doThisNextTime?: string;
  tags?: string[];
  pinned?: boolean;
}

export function useManuals() {
  const [manuals, setManuals] = useState<ManualCard[]>(() => loadManuals());

  useEffect(() => {
    saveManuals(manuals);
  }, [manuals]);

  const createManual = useCallback((input: NewManualInput): ManualCard => {
    const now = new Date().toISOString();
    const card: ManualCard = {
      id: generateId(),
      title: input.title.trim() || "Untitled",
      type: input.type,
      category: input.category,
      summary: input.summary?.trim() ?? "",
      whatWorked: input.whatWorked?.trim() || undefined,
      steps: (input.steps ?? []).map((s) => s.trim()).filter(Boolean),
      whatDidNotWork: (input.whatDidNotWork ?? [])
        .map((s) => s.trim())
        .filter(Boolean),
      evidence: input.evidence ?? [],
      result: input.result ?? "Unknown",
      doThisNextTime: input.doThisNextTime?.trim() || undefined,
      tags: (input.tags ?? []).map((t) => t.trim().toLowerCase()).filter(Boolean),
      pinned: !!input.pinned,
      archived: false,
      useCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    setManuals((prev) => [card, ...prev]);
    return card;
  }, []);

  const updateManual = useCallback(
    (id: string, patch: Partial<ManualCard>) => {
      setManuals((prev) =>
        prev.map((m) =>
          m.id === id
            ? { ...m, ...patch, updatedAt: new Date().toISOString() }
            : m
        )
      );
    },
    []
  );

  const deleteManual = useCallback((id: string) => {
    setManuals((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const togglePin = useCallback(
    (id: string) => {
      setManuals((prev) =>
        prev.map((m) =>
          m.id === id
            ? { ...m, pinned: !m.pinned, updatedAt: new Date().toISOString() }
            : m
        )
      );
    },
    []
  );

  const toggleArchive = useCallback((id: string) => {
    setManuals((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, archived: !m.archived, updatedAt: new Date().toISOString() }
          : m
      )
    );
  }, []);

  const incrementUse = useCallback((id: string) => {
    setManuals((prev) =>
      prev.map((m) => (m.id === id ? { ...m, useCount: m.useCount + 1 } : m))
    );
  }, []);

  const replaceAll = useCallback((next: ManualCard[]) => {
    setManuals(next);
  }, []);

  const importFromJSON = useCallback(
    (json: string, mode: "merge" | "replace" = "merge") => {
      const result = storageImport(json);
      if (!result.ok) return result;
      if (mode === "replace") {
        setManuals(result.manuals);
      } else {
        setManuals((prev) => mergeById(prev, result.manuals));
      }
      return { ok: true as const, count: result.manuals.length };
    },
    []
  );

  const restoreDemo = useCallback(() => {
    const seeds = storageRestoreDemo();
    setManuals(seeds);
  }, []);

  const clearAll = useCallback(() => {
    setManuals([]);
  }, []);

  const tags = useMemo(() => {
    const set = new Set<string>();
    manuals.forEach((m) => m.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [manuals]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    manuals.forEach((m) => set.add(m.category));
    return Array.from(set).sort();
  }, [manuals]);

  return {
    manuals,
    createManual,
    updateManual,
    deleteManual,
    togglePin,
    toggleArchive,
    incrementUse,
    importFromJSON,
    restoreDemo,
    clearAll,
    replaceAll,
    tags,
    categories,
  };
}

function mergeById(a: ManualCard[], b: ManualCard[]): ManualCard[] {
  const map = new Map<string, ManualCard>();
  [...a, ...b].forEach((m) => map.set(m.id, m));
  return Array.from(map.values()).sort(
    (x, y) => +new Date(y.updatedAt) - +new Date(x.updatedAt)
  );
}
