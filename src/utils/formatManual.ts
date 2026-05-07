import type { ManualCard } from "../types/manual";

export function formatStepsForCopy(m: ManualCard): string {
  const lines: string[] = [m.title, ""];
  m.steps.forEach((step, i) => {
    lines.push(`${i + 1}. ${step}`);
  });
  return lines.join("\n");
}

export function formatManualMarkdown(m: ManualCard): string {
  const lines: string[] = [];
  lines.push(`# ${m.title}`);
  lines.push("");
  lines.push(`Type: ${m.type}`);
  lines.push(`Category: ${m.category}`);
  lines.push(`Result: ${m.result}`);
  lines.push("");

  if (m.summary) {
    lines.push("## Summary");
    lines.push("");
    lines.push(m.summary);
    lines.push("");
  }

  if (m.whatWorked) {
    lines.push("## What worked");
    lines.push("");
    lines.push(m.whatWorked);
    lines.push("");
  }

  if (m.steps.length) {
    lines.push("## Steps");
    lines.push("");
    m.steps.forEach((s, i) => lines.push(`${i + 1}. ${s}`));
    lines.push("");
  }

  if (m.whatDidNotWork && m.whatDidNotWork.length) {
    lines.push("## What did not work");
    lines.push("");
    m.whatDidNotWork.forEach((s) => lines.push(`- ${s}`));
    lines.push("");
  }

  if (m.evidence.length) {
    lines.push("## Evidence");
    lines.push("");
    m.evidence.forEach((e) => {
      const v = e.value ? ` — ${e.value}` : "";
      lines.push(`- ${e.type}: ${e.label}${v}`);
    });
    lines.push("");
  }

  if (m.doThisNextTime) {
    lines.push("## Do this next time");
    lines.push("");
    lines.push(m.doThisNextTime);
    lines.push("");
  }

  if (m.tags.length) {
    lines.push("## Tags");
    lines.push("");
    lines.push(m.tags.join(", "));
    lines.push("");
  }

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}

export function formatAllMarkdown(manuals: ManualCard[]): string {
  return manuals.map(formatManualMarkdown).join("\n---\n\n");
}
