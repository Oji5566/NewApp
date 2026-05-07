export type ManualType =
  | "Fix"
  | "Tip"
  | "Routine"
  | "Checklist"
  | "Setting"
  | "Lesson"
  | "Recommendation";

export const MANUAL_TYPES: ManualType[] = [
  "Fix",
  "Tip",
  "Routine",
  "Checklist",
  "Setting",
  "Lesson",
  "Recommendation",
];

export type ManualResult = "Worked" | "Sort of" | "Didn’t work" | "Unknown";

export const MANUAL_RESULTS: ManualResult[] = [
  "Worked",
  "Sort of",
  "Didn’t work",
  "Unknown",
];

export type EvidenceType = "Photo" | "Screenshot" | "Link" | "Note";

export const EVIDENCE_TYPES: EvidenceType[] = [
  "Photo",
  "Screenshot",
  "Link",
  "Note",
];

export interface ManualEvidence {
  id: string;
  type: EvidenceType;
  label: string;
  value?: string;
}

export interface ManualCard {
  id: string;
  title: string;
  type: ManualType;
  category: string;
  summary: string;
  whatWorked?: string;
  steps: string[];
  whatDidNotWork?: string[];
  evidence: ManualEvidence[];
  result: ManualResult;
  doThisNextTime?: string;
  tags: string[];
  pinned: boolean;
  archived: boolean;
  useCount: number;
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_CATEGORIES = [
  "Home",
  "Tech",
  "Food",
  "Travel",
  "Work",
  "Health",
  "Money",
  "Purchases",
];

export type Appearance = "system" | "light" | "dark";

export interface AppSettings {
  appearance: Appearance;
  categories: string[];
}

export const DEFAULT_SETTINGS: AppSettings = {
  appearance: "system",
  categories: DEFAULT_CATEGORIES,
};
