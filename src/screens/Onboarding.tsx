import { useState } from "react";
import { Sparkles, Wrench, Search, ShieldCheck } from "lucide-react";
import { PillButton } from "../components/PillButton";

interface Props {
  onComplete: () => void;
}

interface Slide {
  Icon: typeof Sparkles;
  title: string;
  body: string;
}

const slides: Slide[] = [
  {
    Icon: Sparkles,
    title: "Your personal manual for what works.",
    body: "Save the fixes, tips, routines, settings, and checklists you do not want to rediscover later.",
  },
  {
    Icon: Wrench,
    title: "Save the fix.",
    body: "Capture what happened, what worked, what did not, and the steps to repeat next time.",
  },
  {
    Icon: Search,
    title: "Find it when you need it.",
    body: "Search your personal library instead of digging through Notes, screenshots, bookmarks, or messages.",
  },
  {
    Icon: ShieldCheck,
    title: "Private by default.",
    body: "Your manuals are stored locally in this browser for this MVP.",
  },
];

export function Onboarding({ onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const isLast = index === slides.length - 1;
  const Icon = slide.Icon;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-bg">
      <header className="px-6 pt-[calc(env(safe-area-inset-top)+24px)] pb-2 flex items-center justify-between">
        <span className="text-[15px] font-semibold text-ink">Manuals</span>
        <button
          type="button"
          onClick={onComplete}
          className="text-[14px] text-ink-muted hover:text-ink rounded-full px-3 h-9"
        >
          Skip intro
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-24 h-24 rounded-[28px] bg-[color:var(--color-primary-soft)] text-primary flex items-center justify-center mb-8 shadow-soft">
          <Icon className="w-10 h-10" strokeWidth={1.8} />
        </div>
        <h1 className="text-[28px] leading-tight font-semibold text-ink max-w-sm">
          {slide.title}
        </h1>
        <p className="mt-4 text-[16.5px] text-ink-muted max-w-sm leading-relaxed">
          {slide.body}
        </p>
      </main>

      <footer className="px-6 pb-[calc(env(safe-area-inset-bottom)+28px)] pt-4">
        <div className="flex justify-center gap-2 mb-6" aria-hidden>
          {slides.map((_, i) => (
            <span
              key={i}
              className={[
                "h-1.5 rounded-full transition-all",
                i === index ? "w-6 bg-primary" : "w-1.5 bg-line",
              ].join(" ")}
            />
          ))}
        </div>
        <PillButton
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => {
            if (isLast) onComplete();
            else setIndex((i) => i + 1);
          }}
        >
          {isLast ? "Start using Manuals" : "Continue"}
        </PillButton>
        {!isLast ? (
          <button
            type="button"
            onClick={onComplete}
            className="block mx-auto mt-4 text-[14px] text-ink-muted hover:text-ink h-9 px-3"
          >
            Skip intro
          </button>
        ) : null}
      </footer>
    </div>
  );
}
