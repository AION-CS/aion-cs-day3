/**
 * Day 3 route registry: Customer Retention & Buying Behaviour in B2B IT Sales, Module 2, Day 1.
 * From Day 3 a day has TWO routes (CLAUDE.md #30): Route 1 merges Level 1 and Level 2 on one case,
 * Route 2 is Level 3.
 */

export const COURSE = {
  title: "Psychological Foundations of Customer Loyalty and Behaviour Control in the Buying Process",
  site: "Retention Lab · Day 3",
  module: "Module 2, Day 1 of 2",
  day: 3,
  company: "SecureIT Systems GmbH",
} as const;

export type RouteNo = 1 | 2;

/** Minutes are a guide for the facilitator, not a timer. One place, so the home page, the rail and the blocks agree. */
export const BLOCK_MINUTES = {
  "1.1": 8,
  "1.2": 12,
  "1.3": 8,
  "1.4": 5,
  "2.1": 10,
  "2.2": 10,
  "2.3": 12,
  "3.1": 5,
  "3.2": 8,
  "3.3": 10,
  "3.4": 8,
  "3.5": 12,
  "3.6": 10,
} as const;

const sum = (keys: (keyof typeof BLOCK_MINUTES)[]) => keys.reduce((s, k) => s + BLOCK_MINUTES[k], 0);
export const TASK1_MINUTES = sum(["1.1", "1.2", "1.3", "1.4", "2.1", "2.2", "2.3"]);
export const TASK2_MINUTES = sum(["3.1", "3.2", "3.3", "3.4", "3.5", "3.6"]);
/** Blocks 3.1, 3.2 and 3.4 are Optional (for whoever has time, never required); this is the minutes of the three Core blocks alone. */
export const TASK2_CORE_MINUTES = sum(["3.3", "3.5", "3.6"]);

export type RouteInfo = {
  n: RouteNo;
  href: string;
  short: string;
  title: string;
  level: string;
  blurb: string;
  plan: { label: string; minutes: number }[];
  built: boolean;
};

export const ROUTES: RouteInfo[] = [
  {
    n: 1,
    href: "/route-1/",
    short: "Understand & apply",
    title: "Route 1 · Understand and apply",
    level: "Levels 1 + 2 · Knowledge and application",
    blurb:
      "One case, two levels: why does a buyer choose the dearer, better-known provider, and what stops SecureIT Systems' prospects from signing? You study the psychology of the buying decision, read the evidence, name the patterns and choose three measures inside €100,000 and three months. Material first, then one task that ends in a Behaviour Analysis File.",
    plan: [
      { label: "Materi A · seven cards, Levels 1 and 2", minutes: 60 },
      { label: "Task 1 · Behaviour Analysis, one task", minutes: TASK1_MINUTES },
    ],
    built: true,
  },
  {
    n: 2,
    href: "/route-2/",
    short: "Decide",
    title: "Route 2 · Management decision",
    level: "Level 3 · Management decision",
    blurb:
      "You are now the Chief Sales Officer. Customers decide slowly, the market is uncertain, competition is strong and the budget is limited. You choose three strategic levers, fund and sequence them, and decide, in writing, before the customers' reactions are known — the backbone of the memo. Naming the influencing factors, modelling each phase and sizing the risk of misjudging customers are Optional, for whoever has time. Material first, then a Decision Memo that assembles itself beside your answers.",
    plan: [
      { label: "Materi B · five cards, Level 3 (one Optional)", minutes: 60 },
      { label: "Task 2 · Decision Memo, Core", minutes: TASK2_CORE_MINUTES },
      { label: "Task 2 · Optional blocks, for whoever has time", minutes: TASK2_MINUTES - TASK2_CORE_MINUTES },
    ],
    built: true,
  },
];
