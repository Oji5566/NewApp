import type { ManualCard } from "../types/manual";
import { generateId } from "../utils/id";

const now = () => new Date().toISOString();

function make(
  partial: Omit<ManualCard, "id" | "createdAt" | "updatedAt" | "useCount" | "archived" | "evidence"> &
    Partial<Pick<ManualCard, "evidence" | "useCount" | "archived">>
): ManualCard {
  return {
    id: generateId(),
    createdAt: now(),
    updatedAt: now(),
    useCount: 0,
    archived: false,
    evidence: [],
    ...partial,
  };
}

export function getSeedManuals(): ManualCard[] {
  return [
    make({
      title: "Printer Wi-Fi fix",
      type: "Fix",
      category: "Home",
      summary: "Printer showed offline on Mac even though Wi-Fi worked.",
      whatWorked: "Enabled IPv6 compatibility mode in printer admin settings.",
      steps: [
        "Open the printer IP address.",
        "Go to Network.",
        "Open Advanced settings.",
        "Enable IPv6 compatibility mode.",
        "Restart the printer.",
      ],
      whatDidNotWork: ["Reinstalling the driver.", "Restarting the router only."],
      result: "Worked",
      doThisNextTime: "Check hidden network settings before reinstalling drivers.",
      tags: ["printer", "wi-fi", "mac", "home"],
      pinned: true,
    }),
    make({
      title: "Washing machine E24 error",
      type: "Fix",
      category: "Home",
      summary: "Washer stopped mid-cycle and beeped E24 (drain error).",
      whatWorked: "Cleaned the drain pump filter behind the lower panel.",
      steps: [
        "Switch off the machine and unplug it.",
        "Open the small panel at the bottom front.",
        "Place a shallow tray to catch water.",
        "Unscrew the drain filter slowly.",
        "Remove lint, coins, and debris.",
        "Refit the filter and run a rinse cycle.",
      ],
      whatDidNotWork: ["Restarting the cycle without cleaning."],
      result: "Worked",
      doThisNextTime: "Clean the drain filter every 3 months.",
      tags: ["washer", "appliance", "error-code"],
      pinned: false,
    }),
    make({
      title: "Japan packing checklist",
      type: "Checklist",
      category: "Travel",
      summary: "What I always need for a 10-day Japan trip.",
      steps: [
        "Passport and IC travel card",
        "Pocket Wi-Fi or eSIM",
        "Portable battery",
        "Comfortable walking shoes",
        "Light layer for trains",
        "Cash in yen for small shops",
        "Copy of itinerary offline",
      ],
      whatDidNotWork: [],
      result: "Worked",
      doThisNextTime: "Pack one extra pair of socks. Always.",
      tags: ["travel", "japan", "packing"],
      pinned: true,
    }),
    make({
      title: "Tired dinner formula",
      type: "Routine",
      category: "Food",
      summary: "When I’m too tired to cook but want something real.",
      whatWorked:
        "Pick one carb, one protein, one green. Heat the pan once. Done in 12 minutes.",
      steps: [
        "Boil water for noodles or rice.",
        "Heat one pan on medium-high.",
        "Cook protein for 5 minutes.",
        "Throw in greens for 2 minutes.",
        "Combine, season, eat from the pan.",
      ],
      whatDidNotWork: ["Trying a new recipe at 9pm."],
      result: "Worked",
      doThisNextTime: "Keep frozen greens and pre-cooked rice on hand.",
      tags: ["dinner", "tired", "easy", "food"],
      pinned: false,
    }),
    make({
      title: "Router restart sequence",
      type: "Routine",
      category: "Tech",
      summary: "Correct order to restart home internet when things get weird.",
      steps: [
        "Unplug the modem and the router.",
        "Wait 60 seconds.",
        "Plug in the modem first, wait until lights are steady.",
        "Plug in the router, wait until Wi-Fi appears.",
        "Reconnect devices.",
      ],
      whatDidNotWork: ["Restarting only the router.", "Toggling airplane mode."],
      result: "Worked",
      doThisNextTime: "Always modem first, router second.",
      tags: ["router", "internet", "home"],
      pinned: false,
    }),
    make({
      title: "Gift idea for Dad",
      type: "Recommendation",
      category: "Purchases",
      summary: "Things Dad has actually loved as gifts.",
      whatWorked:
        "Practical, slightly indulgent items he would not buy himself.",
      steps: [
        "Good leather wallet (slim).",
        "Quality reading lamp.",
        "Nice olive oil and aged vinegar set.",
        "Hardcover book about his hobby.",
      ],
      whatDidNotWork: ["Tech gadgets he never opens."],
      result: "Worked",
      doThisNextTime: "Skip gadgets. Pick something tactile.",
      tags: ["gift", "dad", "ideas"],
      pinned: false,
    }),
    make({
      title: "15-minute work reset routine",
      type: "Routine",
      category: "Work",
      summary: "Reset focus when the afternoon falls apart.",
      whatWorked:
        "Short walk, water, close 80% of tabs, write the next single task on paper.",
      steps: [
        "Stand up and step outside for 5 minutes.",
        "Drink a full glass of water.",
        "Close every tab not needed for the next task.",
        "Write the next single task on paper.",
        "Set a 25-minute timer and start.",
      ],
      whatDidNotWork: ["Scrolling for ‘just a minute’."],
      result: "Worked",
      doThisNextTime: "Do the walk before checking messages.",
      tags: ["focus", "work", "reset"],
      pinned: false,
    }),
  ];
}
