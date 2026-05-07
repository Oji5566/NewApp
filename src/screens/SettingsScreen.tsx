import { useRef, useState } from "react";
import {
  Download,
  Upload,
  FileDown,
  Trash2,
  Database,
  Sparkles,
  Sun,
  Moon,
  Monitor,
  Tag as TagIcon,
  Folder,
  Archive,
  ChevronRight,
  Smartphone,
} from "lucide-react";
import type { Appearance, AppSettings, ManualCard } from "../types/manual";
import { PillButton } from "../components/PillButton";
import {
  exportManualsAsJSON,
  exportManualsAsMarkdown,
} from "../utils/exportManuals";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { getStorageInfo } from "../storage/manualsStorage";

interface Props {
  manuals: ManualCard[];
  settings: AppSettings;
  onChangeSettings: (next: AppSettings) => void;
  onImportJSON: (json: string) => { ok: true; count: number } | { ok: false; error: string };
  onClearAll: () => void;
  onRestoreDemo: () => void;
  onToast: (msg: string) => void;
  archivedCount: number;
  tagCount: number;
}

export function SettingsScreen({
  manuals,
  settings,
  onChangeSettings,
  onImportJSON,
  onClearAll,
  onRestoreDemo,
  onToast,
  archivedCount,
  tagCount,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmRestore, setConfirmRestore] = useState(false);

  const storage = getStorageInfo();
  const totalActive = manuals.filter((m) => !m.archived).length;

  const setAppearance = (a: Appearance) =>
    onChangeSettings({ ...settings, appearance: a });

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      const result = onImportJSON(text);
      if (result.ok) {
        onToast(`Imported ${result.count} manual${result.count === 1 ? "" : "s"}`);
      } else {
        onToast(`Import failed: ${result.error}`);
      }
    };
    reader.onerror = () => onToast("Could not read file");
    reader.readAsText(file);
  };

  return (
    <div className="px-5 pt-[calc(env(safe-area-inset-top)+18px)] pb-32">
      <header className="mb-6">
        <h1 className="text-[28px] font-bold text-ink leading-tight">Settings</h1>
        <p className="mt-1 text-[14.5px] text-ink-muted">
          Manage your personal knowledge base.
        </p>
      </header>

      <SectionTitle>Data</SectionTitle>
      <Group>
        <SettingRow
          icon={<Download className="w-5 h-5" strokeWidth={1.8} />}
          title="Backup manuals"
          subtitle={`${totalActive} active manual${totalActive === 1 ? "" : "s"}`}
        >
          <PillButton
            size="sm"
            variant="secondary"
            onClick={() => {
              if (manuals.length === 0) {
                onToast("Nothing to back up yet");
                return;
              }
              exportManualsAsJSON(manuals);
              onToast("JSON backup downloaded");
            }}
          >
            Backup
          </PillButton>
        </SettingRow>
        <Divider />
        <SettingRow
          icon={<Upload className="w-5 h-5" strokeWidth={1.8} />}
          title="Import manuals"
          subtitle="Bring in a previous JSON backup"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImport(f);
              e.target.value = "";
            }}
          />
          <PillButton
            size="sm"
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
          >
            Import
          </PillButton>
        </SettingRow>
        <Divider />
        <SettingRow
          icon={<FileDown className="w-5 h-5" strokeWidth={1.8} />}
          title="Export as JSON"
        >
          <PillButton
            size="sm"
            variant="secondary"
            onClick={() => {
              if (manuals.length === 0) {
                onToast("Nothing to export yet");
                return;
              }
              exportManualsAsJSON(manuals);
              onToast("JSON exported");
            }}
          >
            Export
          </PillButton>
        </SettingRow>
        <Divider />
        <SettingRow
          icon={<FileDown className="w-5 h-5" strokeWidth={1.8} />}
          title="Export as Markdown"
        >
          <PillButton
            size="sm"
            variant="secondary"
            onClick={() => {
              if (manuals.length === 0) {
                onToast("Nothing to export yet");
                return;
              }
              exportManualsAsMarkdown(manuals);
              onToast("Markdown exported");
            }}
          >
            Export
          </PillButton>
        </SettingRow>
      </Group>

      <SectionTitle>Organization</SectionTitle>
      <Group>
        <SettingRow
          icon={<Folder className="w-5 h-5" strokeWidth={1.8} />}
          title="Manage categories"
          subtitle={`${settings.categories.length} categories`}
        >
          <ChevronRight className="w-4 h-4 text-ink-soft" />
        </SettingRow>
        <Divider />
        <SettingRow
          icon={<TagIcon className="w-5 h-5" strokeWidth={1.8} />}
          title="Manage tags"
          subtitle={`${tagCount} tag${tagCount === 1 ? "" : "s"} in use`}
        >
          <ChevronRight className="w-4 h-4 text-ink-soft" />
        </SettingRow>
        <Divider />
        <SettingRow
          icon={<Archive className="w-5 h-5" strokeWidth={1.8} />}
          title="Archived manuals"
          subtitle={`${archivedCount} archived`}
        >
          <ChevronRight className="w-4 h-4 text-ink-soft" />
        </SettingRow>
      </Group>

      <SectionTitle>App</SectionTitle>
      <Group>
        <SettingRow
          icon={<Smartphone className="w-5 h-5" strokeWidth={1.8} />}
          title="App icon"
          subtitle="Coming soon"
        >
          <span className="w-10 h-10 rounded-2xl bg-[color:var(--color-primary-soft)] text-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5" strokeWidth={1.8} />
          </span>
        </SettingRow>
        <Divider />
        <div className="px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-surface-muted text-ink-muted flex items-center justify-center">
              <Sun className="w-[18px] h-[18px]" strokeWidth={1.8} />
            </span>
            <div className="flex-1">
              <p className="text-[15.5px] font-medium text-ink">Appearance</p>
              <p className="text-[13px] text-ink-muted">Match system or pick manually</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { id: "system" as const, label: "System", Icon: Monitor },
              { id: "light" as const, label: "Light", Icon: Sun },
              { id: "dark" as const, label: "Dark", Icon: Moon },
            ].map(({ id, label, Icon }) => {
              const active = settings.appearance === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setAppearance(id)}
                  className={[
                    "h-12 rounded-2xl border flex items-center justify-center gap-2 text-sm font-medium transition-colors",
                    active
                      ? "border-primary text-primary bg-[color:var(--color-primary-soft)]"
                      : "border-line text-ink-muted bg-surface hover:bg-surface-soft",
                  ].join(" ")}
                >
                  <Icon className="w-4 h-4" strokeWidth={1.8} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
        <Divider />
        <SettingRow
          icon={<Download className="w-5 h-5" strokeWidth={1.8} />}
          title="Install instructions"
          subtitle="Add to Home Screen for app feel"
        >
          <ChevronRight className="w-4 h-4 text-ink-soft" />
        </SettingRow>
      </Group>

      <SectionTitle>Privacy</SectionTitle>
      <Group>
        <SettingRow
          icon={<Database className="w-5 h-5" strokeWidth={1.8} />}
          title="Local storage"
          subtitle={
            storage.available
              ? `${(storage.used / 1024).toFixed(1)} KB used in this browser`
              : "Storage unavailable"
          }
        />
        <Divider />
        <SettingRow
          icon={<Sparkles className="w-5 h-5" strokeWidth={1.8} />}
          title="Restore demo data"
          subtitle="Replace your library with the starter examples"
        >
          <PillButton
            size="sm"
            variant="secondary"
            onClick={() => setConfirmRestore(true)}
          >
            Restore
          </PillButton>
        </SettingRow>
        <Divider />
        <SettingRow
          icon={<Trash2 className="w-5 h-5 text-danger" strokeWidth={1.8} />}
          title="Clear all data"
          subtitle="Delete every manual and reset onboarding"
        >
          <PillButton
            size="sm"
            variant="danger"
            onClick={() => setConfirmClear(true)}
          >
            Clear
          </PillButton>
        </SettingRow>
      </Group>

      <SectionTitle>About</SectionTitle>
      <Group>
        <div className="px-5 py-5">
          <p className="text-[18px] font-semibold text-ink">Manuals</p>
          <p className="text-[14.5px] text-ink-muted mt-0.5">
            Your personal manual for what works.
          </p>
          <p className="text-[12.5px] text-ink-soft mt-3">
            Local-first MVP · v0.1
          </p>
        </div>
      </Group>

      <ConfirmDialog
        open={confirmClear}
        title="Clear all data?"
        body="This deletes every manual on this device and resets onboarding. This cannot be undone."
        confirmLabel="Clear everything"
        destructive
        onCancel={() => setConfirmClear(false)}
        onConfirm={() => {
          setConfirmClear(false);
          onClearAll();
          onToast("All data cleared");
        }}
      />

      <ConfirmDialog
        open={confirmRestore}
        title="Restore demo data?"
        body="Your current manuals will be replaced with the starter examples."
        confirmLabel="Restore demo"
        onCancel={() => setConfirmRestore(false)}
        onConfirm={() => {
          setConfirmRestore(false);
          onRestoreDemo();
          onToast("Demo data restored");
        }}
      />
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[12px] uppercase tracking-wider text-ink-soft font-semibold mt-7 mb-2.5 px-2">
      {children}
    </h2>
  );
}

function Group({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-line rounded-3xl shadow-soft overflow-hidden">
      {children}
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-line mx-5" />;
}

function SettingRow({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-4">
      <span className="w-9 h-9 rounded-xl bg-surface-muted text-ink-muted flex items-center justify-center shrink-0">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[15.5px] font-medium text-ink truncate">{title}</p>
        {subtitle ? (
          <p className="text-[13px] text-ink-muted truncate">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}
