import { MATERIALS, materialAnchorId } from "@/data/materialIndex";
import type { RouteNo } from "@/lib/routes";
import type { TaskBlockId } from "@/lib/progress";

/**
 * The page map on the right of every route: one entry per material card and per task block, in page
 * order, so a learner can see how much the route holds and jump straight to any part of it. Anchor ids
 * are the ones the page already renders (mat-A1, block-2-1, export-l1l2, ...).
 */
export type NavItem = {
  /** The element id to scroll to. */
  id: string;
  /** The pill text: "A1", "2.3", "Case", "Export". */
  short: string;
  /** The full name, shown on hover/focus and in the mobile list. */
  title: string;
  /** Completion source: a card marked read, or a task block filled in. Absent = no done state. */
  done?: { card: string } | { block: TaskBlockId };
};
export type NavGroup = { label: string; items: NavItem[] };

const cards = (block: "A" | "B"): NavItem[] =>
  MATERIALS.filter((m) => m.block === block).map((m) => ({ id: materialAnchorId(m.id), short: m.id, title: m.title, done: { card: m.id } }));

const blk = (n: string, title: string, block: TaskBlockId): NavItem => ({ id: `block-${n.replace(".", "-")}`, short: n, title, done: { block } });

export const PAGE_NAV: Record<RouteNo, NavGroup[]> = {
  1: [
    { label: "Materi A", items: cards("A") },
    {
      label: "Task 1",
      items: [
        { id: "case-brief", short: "Case", title: "The case: SecureIT Systems" },
        blk("1.1", "Sort what the buyer said", "b11"),
        blk("1.2", "Trust, risk and the felt cost", "b12"),
        blk("1.3", "Three hypotheses", "b13"),
        blk("1.4", "Coaching reflection", "b14"),
        blk("2.1", "Tag the twelve exit notes", "b21"),
        blk("2.2", "Four patterns, their strength, what is missing", "b22"),
        blk("2.3", "Three measures, scored and ordered", "b23"),
        { id: "export-l1l2", short: "Export", title: "Export the Behaviour Analysis File" },
      ],
    },
  ],
  2: [
    { label: "Materi B", items: cards("B") },
    {
      label: "Task 2",
      items: [
        { id: "task-2", short: "Case", title: "The situation and the budget" },
        blk("3.1", "Three central influencing factors", "b31"),
        blk("3.2", "The control model", "b32"),
        blk("3.3", "Three strategic levers", "b33"),
        blk("3.4", "Risk of misjudging the customer", "b34"),
        blk("3.5", "The measures architecture", "b35"),
        blk("3.6", "The decision", "b36"),
        { id: "export-l3", short: "Export", title: "Export the Decision Memo" },
      ],
    },
  ],
};
