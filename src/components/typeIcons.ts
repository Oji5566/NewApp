import {
  Wrench,
  Lightbulb,
  Repeat,
  CheckSquare,
  SlidersHorizontal,
  AlertCircle,
  Star,
  type LucideIcon,
} from "lucide-react";
import type { ManualType } from "../types/manual";

export const TYPE_ICONS: Record<ManualType, LucideIcon> = {
  Fix: Wrench,
  Tip: Lightbulb,
  Routine: Repeat,
  Checklist: CheckSquare,
  Setting: SlidersHorizontal,
  Lesson: AlertCircle,
  Recommendation: Star,
};

export function typeIcon(type: ManualType): LucideIcon {
  return TYPE_ICONS[type] ?? Lightbulb;
}
