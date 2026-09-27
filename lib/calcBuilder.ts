import { FELT, FIGURE_IDS, LOSS_WEIGHT, RHEINWERK, feltCost } from "@/data/feltCost";
import type { FigureId } from "@/data/feltCost";
import { parseAmount } from "@/lib/parseAmount";

/**
 * The "automatic calculator" under a calculation question: the formula split into small labelled parts. The learner types each
 * part (a value read from a printed row); the result is computed live and can be copied into the answer field. On "Check",
 * every part is compared with the value it should hold, and a wrong part names the exact row and part of the row to read,
 * never the value itself. Expected values come from the same constants as the tables and the model answers (data/feltCost.ts).
 */
export type CalcPart = {
  id: string;
  /** Short label shown above the input. */
  label: string;
  expected: number;
  /** Absolute tolerance; 0 for a value read straight off a table. */
  tolerance?: number;
  /** Where to read it, shown when the part is flagged: the row and which part of it, never the value. */
  clue: string;
};

export type CalcBuilder = {
  parts: CalcPart[];
  compute: (v: Record<string, number>) => number;
  /** The formula with the learner's values in place, for display. */
  show: (v: Record<string, string>) => string;
};

/** F1 and F2: one provider's felt cost. */
function providerBuilder(who: "A" | "B"): CalcBuilder {
  const o = RHEINWERK[who];
  const row = who === "A" ? "Provider A" : "Provider B";
  return {
    parts: [
      { id: "price", label: "Price per year (€)", expected: o.price, clue: `The two offers: the price per year in the ${row} row. Not the other provider's price.` },
      {
        id: "chance",
        label: "Chance it goes wrong (%)",
        expected: o.chance,
        clue: `The buyer's estimates: the chance it goes wrong, in the ${row} row. Type it as printed, as a percentage, not as a fraction. It is different for the two providers.`,
      },
      { id: "loss", label: "Cost to the buyer if it goes wrong (€)", expected: RHEINWERK.loss, clue: "The buyer's estimates: the cost to the buyer if it goes wrong. It is one figure for both providers." },
      { id: "weight", label: "Loss weight", expected: LOSS_WEIGHT, clue: "The buyer's estimates: the loss weight. It is the same for both providers and it multiplies the risk, not the price." },
    ],
    compute: (v) => feltCost(v.price, v.chance, v.loss, v.weight),
    show: (v) => `${v.price} + ${v.weight} × ${v.chance}% × ${v.loss}`,
  };
}

/** F3: the difference of the two felt costs. */
const gapBuilder: CalcBuilder = {
  parts: [
    { id: "a", label: "Felt cost of Provider A (your F1)", expected: FELT.A, tolerance: 0.5, clue: "Your answer to F1 above. If it does not match what the check expects, correct F1 first." },
    { id: "b", label: "Felt cost of Provider B (your F2)", expected: FELT.B, tolerance: 0.5, clue: "Your answer to F2 above. If it does not match what the check expects, correct F2 first." },
  ],
  compute: (v) => v.a - v.b,
  show: (v) => `${v.a} − ${v.b}`,
};

export const FIGURE_BUILDERS: Record<FigureId, CalcBuilder> = { F1: providerBuilder("A"), F2: providerBuilder("B"), F3: gapBuilder };
export const feltAnswer = (id: FigureId) => ({ F1: FELT.A, F2: FELT.B, F3: FELT.gap })[id];
export { FIGURE_IDS };

/* ------------------------------------------------------------------ shared helpers */

export const partKey = (figure: string, part: string) => `${figure}.${part}`;

/** Parses every part of a builder; null for a part that is empty or unreadable. */
export function partValues(b: CalcBuilder, figure: string, parts: Record<string, string>): Record<string, number | null> {
  return Object.fromEntries(
    b.parts.map((p) => {
      const raw = (parts[partKey(figure, p.id)] ?? "").trim();
      return [p.id, raw ? parseAmount(raw) : null];
    }),
  );
}

/** The live result, or null while a part is missing. */
export function builderResult(b: CalcBuilder, figure: string, parts: Record<string, string>): number | null {
  const v = partValues(b, figure, parts);
  if (Object.values(v).some((x) => x === null)) return null;
  const r = b.compute(v as Record<string, number>);
  return Number.isFinite(r) ? Math.round(r * 1e6) / 1e6 : null;
}

/** Part keys ("F1.price") whose entered value differs from what the row holds. Empty parts are not flagged. */
export function wrongParts(b: CalcBuilder, figure: string, parts: Record<string, string>): string[] {
  const v = partValues(b, figure, parts);
  return b.parts
    .filter((p) => {
      const x = v[p.id];
      return x !== null && Math.abs(x - p.expected) > (p.tolerance ?? 1e-9);
    })
    .map((p) => partKey(figure, p.id));
}

/** True when every part is filled and none is wrong. */
export function allPartsRight(b: CalcBuilder, figure: string, parts: Record<string, string>): boolean {
  const v = partValues(b, figure, parts);
  return Object.values(v).every((x) => x !== null) && wrongParts(b, figure, parts).length === 0;
}

/** The model part values, as strings, for the mentor fill. */
export function modelParts(builders: Partial<Record<string, CalcBuilder>>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [fid, b] of Object.entries(builders)) if (b) for (const p of b.parts) out[partKey(fid, p.id)] = String(p.expected);
  return out;
}

/** Part flags for every figure, from the learner's parts. */
export function figurePartFlags(parts: Record<string, string>): string[] {
  return FIGURE_IDS.flatMap((f) => wrongParts(FIGURE_BUILDERS[f], f, parts));
}
