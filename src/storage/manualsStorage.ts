import type { AppSettings, ManualCard } from "../types/manual";
import { DEFAULT_SETTINGS } from "../types/manual";
import { getSeedManuals } from "../data/seedManuals";

const KEY_MANUALS = "manuals:cards";
const KEY_SETTINGS = "manuals:settings";
const KEY_ONBOARDING = "manuals:onboardingComplete";
const KEY_SEEDED = "manuals:seeded";

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function safeRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function loadManuals(): ManualCard[] {
  const raw = safeGet(KEY_MANUALS);
  if (raw == null) {
    if (safeGet(KEY_SEEDED) === "1") {
      return [];
    }
    const seeds = getSeedManuals();
    safeSet(KEY_MANUALS, JSON.stringify(seeds));
    safeSet(KEY_SEEDED, "1");
    return seeds;
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isManualLike).map(normalizeManual);
  } catch {
    return [];
  }
}

export function saveManuals(manuals: ManualCard[]): boolean {
  return safeSet(KEY_MANUALS, JSON.stringify(manuals));
}

export function loadSettings(): AppSettings {
  const raw = safeGet(KEY_SETTINGS);
  if (!raw) return { ...DEFAULT_SETTINGS };
  try {
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(s: AppSettings): boolean {
  return safeSet(KEY_SETTINGS, JSON.stringify(s));
}

export function isOnboardingComplete(): boolean {
  return safeGet(KEY_ONBOARDING) === "1";
}

export function setOnboardingComplete(value: boolean): void {
  if (value) safeSet(KEY_ONBOARDING, "1");
  else safeRemove(KEY_ONBOARDING);
}

export function clearAllData(): void {
  safeRemove(KEY_MANUALS);
  safeRemove(KEY_SETTINGS);
  safeRemove(KEY_ONBOARDING);
  safeRemove(KEY_SEEDED);
}

export function restoreDemoData(): ManualCard[] {
  const seeds = getSeedManuals();
  safeSet(KEY_MANUALS, JSON.stringify(seeds));
  safeSet(KEY_SEEDED, "1");
  return seeds;
}

export function getStorageInfo(): { used: number; available: boolean } {
  try {
    let used = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("manuals:")) {
        used += (localStorage.getItem(k) || "").length;
      }
    }
    return { used, available: true };
  } catch {
    return { used: 0, available: false };
  }
}

function isManualLike(value: unknown): value is Partial<ManualCard> {
  return (
    !!value &&
    typeof value === "object" &&
    typeof (value as { title?: unknown }).title === "string"
  );
}

function normalizeManual(m: Partial<ManualCard>): ManualCard {
  const now = new Date().toISOString();
  return {
    id: m.id ?? cryptoId(),
    title: m.title ?? "Untitled",
    type: m.type ?? "Tip",
    category: m.category ?? "Home",
    summary: m.summary ?? "",
    whatWorked: m.whatWorked,
    steps: Array.isArray(m.steps) ? m.steps.filter((s) => typeof s === "string") : [],
    whatDidNotWork: Array.isArray(m.whatDidNotWork)
      ? m.whatDidNotWork.filter((s) => typeof s === "string")
      : [],
    evidence: Array.isArray(m.evidence) ? m.evidence : [],
    result: m.result ?? "Unknown",
    doThisNextTime: m.doThisNextTime,
    tags: Array.isArray(m.tags) ? m.tags.filter((t) => typeof t === "string") : [],
    pinned: !!m.pinned,
    archived: !!m.archived,
    useCount: typeof m.useCount === "number" ? m.useCount : 0,
    createdAt: m.createdAt ?? now,
    updatedAt: m.updatedAt ?? now,
  };
}

function cryptoId(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    // ignore
  }
  return "id-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
}

export function importManualsFromJSON(
  json: string
): { ok: true; manuals: ManualCard[] } | { ok: false; error: string } {
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) {
      return { ok: false, error: "Expected an array of manuals." };
    }
    const cleaned = parsed.filter(isManualLike).map(normalizeManual);
    return { ok: true, manuals: cleaned };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Invalid JSON",
    };
  }
}
