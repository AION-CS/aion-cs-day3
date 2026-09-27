/**
 * Task 1 · Block 1.3. The mechanisms a hypothesis can rest on: the four principles of Materi A3, plus the two ideas of A1 and A2
 * that explain why a buyer stays put and why reasons come after feelings. A hypothesis names one, and the three of a learner
 * must name three different ones so that they can be tested separately.
 */
export type HypMech = "trust" | "loss" | "proof" | "reciprocity" | "inertia" | "feeling";
export const HYP_MECHS: { id: HypMech; label: string; from: string }[] = [
  { id: "trust", label: "Trust and security", from: "A3" },
  { id: "loss", label: "Loss aversion", from: "A3" },
  { id: "proof", label: "Social proof", from: "A3" },
  { id: "reciprocity", label: "Reciprocity", from: "A3" },
  { id: "inertia", label: "Habit and inertia (the present set-up feels safe)", from: "A1" },
  { id: "feeling", label: "Feeling first, reasons afterwards", from: "A2" },
];
export const HYP_LABEL = Object.fromEntries(HYP_MECHS.map((m) => [m.id, m.label])) as Record<HypMech, string>;
export const HYP_COUNT = 3;

/** True when the sentence gives a reason: it contains a causal word. The check is a floor, not a judge of quality. */
export const hasBecause = (t: string) => /\b(because|since|as it|which is why|so that|due to)\b/i.test(t);
export const HYP_MIN = 45;

export const HYP_FRAME = "If or when [what happens], the buyer [does what], because [the mechanism].";
