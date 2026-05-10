import { useCallback, useEffect, useMemo, useState } from "react";
import { BottomTabs } from "../components/BottomTabs";
import { Onboarding } from "../screens/Onboarding";
import { HomeScreen } from "../screens/HomeScreen";
import { CreateScreen, type ManualFormOutput } from "../screens/CreateScreen";
import { LibraryScreen } from "../screens/LibraryScreen";
import { DetailScreen } from "../screens/DetailScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { Toast } from "../components/Toast";
import {
  isOnboardingComplete,
  setOnboardingComplete,
  loadSettings,
  saveSettings,
  clearAllData,
} from "../storage/manualsStorage";
import { useManuals } from "../hooks/useManuals";
import type {
  AppSettings,
  ManualCard,
  ManualType,
} from "../types/manual";
import { DEFAULT_CATEGORIES } from "../types/manual";
import type { TabId } from "./types";

type View =
  | { kind: "tab"; tab: TabId }
  | { kind: "detail"; id: string }
  | { kind: "edit"; id: string };

function applyTheme(appearance: AppSettings["appearance"]) {
  const root = document.documentElement;
  let theme = appearance;
  if (appearance === "system") {
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    theme = prefersDark ? "dark" : "light";
  }
  root.setAttribute("data-theme", theme);
}

export function App() {
  const [onboardingDone, setOnboardingDone] = useState<boolean>(() =>
    isOnboardingComplete()
  );
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [view, setView] = useState<View>({ kind: "tab", tab: "home" });
  const [toast, setToast] = useState<string | null>(null);
  const [createInitialType, setCreateInitialType] = useState<ManualType | undefined>();
  const [librarySeedQuery, setLibrarySeedQuery] = useState<string | undefined>();

  const {
    manuals,
    createManual,
    updateManual,
    deleteManual,
    togglePin,
    incrementUse,
    importFromJSON,
    restoreDemo,
    clearAll,
  } = useManuals();

  useEffect(() => {
    saveSettings(settings);
    applyTheme(settings.appearance);
  }, [settings]);

  useEffect(() => {
    if (settings.appearance !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, [settings.appearance]);

  const allCategories = useMemo(() => {
    const set = new Set<string>([
      ...(settings.categories?.length ? settings.categories : DEFAULT_CATEGORIES),
    ]);
    manuals.forEach((m) => set.add(m.category));
    return Array.from(set);
  }, [manuals, settings.categories]);

  const handleOpenManual = useCallback(
    (id: string) => {
      incrementUse(id);
      setView({ kind: "detail", id });
      window.scrollTo({ top: 0 });
    },
    [incrementUse]
  );

  const handleQuickCreate = (type: ManualType) => {
    setCreateInitialType(type);
    setView({ kind: "tab", tab: "create" });
    window.scrollTo({ top: 0 });
  };

  const handleApplyCollection = (q: string) => {
    setLibrarySeedQuery(q);
    setView({ kind: "tab", tab: "library" });
    window.scrollTo({ top: 0 });
  };

  const handleSaveManual = (input: ManualFormOutput, id?: string) => {
    if (id) {
      updateManual(id, input);
      setToast("Manual updated");
      setView({ kind: "detail", id });
    } else {
      const m = createManual(input);
      setToast("Manual saved");
      setView({ kind: "detail", id: m.id });
    }
    setCreateInitialType(undefined);
    window.scrollTo({ top: 0 });
  };

  const editingManual: ManualCard | undefined =
    view.kind === "edit"
      ? manuals.find((m) => m.id === view.id)
      : undefined;

  const detailManual: ManualCard | undefined =
    view.kind === "detail"
      ? manuals.find((m) => m.id === view.id)
      : undefined;

  // Onboarding
  if (!onboardingDone) {
    return (
      <Onboarding
        onComplete={() => {
          setOnboardingComplete(true);
          setOnboardingDone(true);
        }}
      />
    );
  }

  const activeTab: TabId =
    view.kind === "tab"
      ? view.tab
      : view.kind === "detail" || view.kind === "edit"
      ? "library"
      : "home";

  const handleTabChange = (id: TabId) => {
    if (id === "create") {
      setCreateInitialType(undefined);
    }
    if (id === "library") {
      setLibrarySeedQuery(undefined);
    }
    setView({ kind: "tab", tab: id });
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="min-h-[100dvh] bg-bg text-ink">
      <div className="mx-auto max-w-[560px]">
        {renderView()}
      </div>

      <BottomTabs active={activeTab} onChange={handleTabChange} />
      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );

  function renderView() {
    if (view.kind === "edit") {
      if (!editingManual) {
        return (
          <div className="px-5 py-10 text-center text-ink-muted">
            This manual is no longer available.
          </div>
        );
      }
      return (
        <CreateScreen
          categories={allCategories}
          initial={editingManual}
          onCancel={() => setView({ kind: "detail", id: editingManual.id })}
          onSave={handleSaveManual}
        />
      );
    }
    if (view.kind === "detail") {
      if (!detailManual) {
        return (
          <div className="px-5 py-10 text-center text-ink-muted">
            This manual is no longer available.
          </div>
        );
      }
      return (
        <DetailScreen
          manual={detailManual}
          onBack={() => setView({ kind: "tab", tab: "library" })}
          onEdit={() => setView({ kind: "edit", id: detailManual.id })}
          onTogglePin={() => {
            togglePin(detailManual.id);
            setToast(detailManual.pinned ? "Unpinned" : "Pinned to Home");
          }}
          onDelete={() => {
            deleteManual(detailManual.id);
            setToast("Manual deleted");
            setView({ kind: "tab", tab: "library" });
          }}
          onToast={setToast}
        />
      );
    }
    if (view.tab === "home") {
      return (
        <HomeScreen
          manuals={manuals}
          onOpenManual={handleOpenManual}
          onQuickCreate={handleQuickCreate}
          onGoCreate={() => setView({ kind: "tab", tab: "create" })}
          onApplyCollection={handleApplyCollection}
        />
      );
    }
    if (view.tab === "create") {
      return (
        <CreateScreen
          categories={allCategories}
          initialType={createInitialType}
          onSave={handleSaveManual}
        />
      );
    }
    if (view.tab === "library") {
      return (
        <LibraryScreen
          manuals={manuals}
          initialQuery={librarySeedQuery}
          onOpenManual={handleOpenManual}
          onGoCreate={() => setView({ kind: "tab", tab: "create" })}
        />
      );
    }
    return (
      <SettingsScreen
        manuals={manuals}
        settings={settings}
        onChangeSettings={setSettings}
        onImportJSON={(json) => importFromJSON(json, "merge")}
        onClearAll={() => {
          clearAll();
          clearAllData();
          setOnboardingDone(false);
        }}
        onRestoreDemo={restoreDemo}
        onToast={setToast}
        archivedCount={manuals.filter((m) => m.archived).length}
        tagCount={new Set(manuals.flatMap((m) => m.tags)).size}
      />
    );
  }
}

export default App;
