import { Home, PlusCircle, BookOpen, Settings as SettingsIcon } from "lucide-react";
import type { TabId } from "../app/types";

const tabs: { id: TabId; label: string; Icon: typeof Home }[] = [
  { id: "home", label: "Home", Icon: Home },
  { id: "create", label: "Create", Icon: PlusCircle },
  { id: "library", label: "Library", Icon: BookOpen },
  { id: "settings", label: "Settings", Icon: SettingsIcon },
];

interface Props {
  active: TabId;
  onChange: (id: TabId) => void;
}

export function BottomTabs({ active, onChange }: Props) {
  return (
    <nav
      aria-label="Main"
      className="fixed bottom-0 inset-x-0 z-30 pointer-events-none"
    >
      <div className="mx-auto max-w-[560px] px-3 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-2 pointer-events-auto">
        <div className="bg-surface/95 backdrop-blur border border-line rounded-full shadow-soft flex items-center justify-around h-16 px-2">
          {tabs.map(({ id, label, Icon }) => {
            const isActive = id === active;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onChange(id)}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "flex flex-col items-center justify-center gap-0.5 h-12 min-w-14 px-3 rounded-full transition-colors",
                  isActive
                    ? "text-primary bg-[color:var(--color-primary-soft)]"
                    : "text-ink-soft hover:text-ink",
                ].join(" ")}
              >
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.2 : 1.8} />
                <span
                  className={[
                    "text-[11px] leading-none font-medium",
                    isActive ? "text-primary" : "text-ink-soft",
                  ].join(" ")}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
