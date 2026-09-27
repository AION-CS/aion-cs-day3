/** One registry for every material card: the rail, the cards and the task chips all read it. */
export type MaterialId = "A1" | "A2" | "A3" | "A4" | "A5" | "A6" | "A7" | "B1" | "B2" | "B3" | "B4" | "B5";
export type Block = "A" | "B";

export type MaterialMeta = { id: MaterialId; block: Block; title: string; minutes: number };

/**
 * Day 3 has two routes (CLAUDE.md #30). Materi A is the material of Route 1 (Levels 1 and 2 on one case): seven cards,
 * 60 minutes. Materi B is the material of Route 2 (Level 3): five cards, 60 minutes.
 */
export const MATERIALS: MaterialMeta[] = [
  { id: "A1", block: "A", title: "What creates loyalty: trust, habit and emotional attachment", minutes: 9 },
  { id: "A2", block: "A", title: "Rational and emotional decisions", minutes: 9 },
  { id: "A3", block: "A", title: "Four principles: trust, loss aversion, social proof, reciprocity", minutes: 9 },
  { id: "A4", block: "A", title: "The buying process from a psychological view", minutes: 8 },
  { id: "A5", block: "A", title: "Reading behaviour: what buyers say and what may be behind it", minutes: 9 },
  { id: "A6", block: "A", title: "How strong is a barrier, and what do we not yet know?", minutes: 8 },
  { id: "A7", block: "A", title: "From barrier to measure: match, score, budget", minutes: 8 },
  { id: "B1", block: "B", title: "Behaviour as a competitive factor you can manage", minutes: 12 },
  { id: "B2", block: "B", title: "Where is the lever? Reach, depth, durability, scale", minutes: 12 },
  { id: "B3", block: "B", title: "Deciding when customer reactions are unclear", minutes: 12 },
  { id: "B4", block: "B", title: "The risk of misjudging customer psychology", minutes: 12 },
  { id: "B5", block: "B", title: "From lever to architecture: sequence, owner, trigger", minutes: 12 },
];

export const MATERIAL_BY_ID = Object.fromEntries(MATERIALS.map((m) => [m.id, m])) as Record<MaterialId, MaterialMeta>;
export const materialAnchorId = (id: MaterialId) => `mat-${id}`;

/** Section anchors per route page, in reading order. */
export type RailSection = { id: string; label: string; sub: string; minutes: number };
export const SECTIONS: Record<1 | 2, RailSection[]> = {
  1: [
    { id: "materi-a", label: "Materi A", sub: "Levels 1 + 2 · the psychology of the buyer", minutes: 60 },
    { id: "task-1", label: "Task 1", sub: "Behaviour Analysis · one case", minutes: 65 },
  ],
  2: [
    { id: "materi-b", label: "Materi B", sub: "Level 3 · managing decisions", minutes: 60 },
    { id: "task-2", label: "Task 2", sub: "Decision Memo · CSO", minutes: 55 },
  ],
};
