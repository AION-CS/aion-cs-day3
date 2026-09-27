/**
 * Task 1 · Block 1.2, and the worked example of Materi A3. The buyer's "felt cost" of an offer is
 *
 *   price + (loss weight × chance it goes wrong × cost to the buyer if it does)
 *
 * It is a thinking aid, not a measurement: real buyers do not compute this. It shows in numbers how a higher price
 * can feel lower once trust has lowered the chance the buyer expects, and how loss aversion (the loss weight)
 * multiplies that chance. Every input below is either given in the case (Case assumption) or a stated
 * simplification: Tversky & Kahneman (1992) estimated a loss weight of about 2.25; the case uses 2.
 */
export const LOSS_WEIGHT = 2;

export type FeltInputs = { price: number; chance: number; loss: number };

export const RHEINWERK = {
  buyer: "Rheinwerk Logistik",
  loss: 150000,
  A: { name: "SecureIT Systems", price: 80000, chance: 12 },
  B: { name: "Sentinel Group", price: 96000, chance: 4 },
} as const;

/** The result of the formula for one provider: price + weight × chance × loss. */
export function feltCost(price: number, chancePct: number, loss: number, weight = LOSS_WEIGHT): number {
  return price + weight * (chancePct / 100) * loss;
}
/** The risk term alone: weight × chance × loss. */
export const riskTerm = (chancePct: number, loss: number, weight = LOSS_WEIGHT) => weight * (chancePct / 100) * loss;

export const FELT = {
  A: feltCost(RHEINWERK.A.price, RHEINWERK.A.chance, RHEINWERK.loss),
  B: feltCost(RHEINWERK.B.price, RHEINWERK.B.chance, RHEINWERK.loss),
  riskA: riskTerm(RHEINWERK.A.chance, RHEINWERK.loss),
  riskB: riskTerm(RHEINWERK.B.chance, RHEINWERK.loss),
  priceGap: RHEINWERK.B.price - RHEINWERK.A.price,
  /** How much cheaper B feels than A. */
  gap: 0,
};
FELT.gap = FELT.A - FELT.B;

/** The three figures the learner enters in Block 1.2. */
export type FigureId = "F1" | "F2" | "F3";
export const FIGURE_IDS: FigureId[] = ["F1", "F2", "F3"];
export const FIGURES: Record<
  FigureId,
  {
    id: FigureId;
    label: string;
    question: string;
    answer: number;
    unit: string;
    /** The formula in words, with no numbers (CLAUDE.md #24). */
    formula: string;
    /** The material card that teaches it. */
    taughtIn: "A3";
    clue: string;
    /** Printed rows the numbers come from (CLAUDE.md #21). Filled with row ids below. */
    sources: { label: string; value: string; target: string }[] | "figures";
  }
> = {
  F1: {
    id: "F1",
    label: "F1 · Felt cost of the SecureIT offer (Provider A), € per year",
    question: "What does the SecureIT offer feel like it costs the buyer per year?",
    answer: FELT.A,
    unit: "€",
    formula: "Felt cost = the price per year + (the loss weight × the buyer's chance that it goes wrong × the cost to the buyer if it does). Use the row of Provider A.",
    taughtIn: "A3",
    clue: "Check that the chance is read as a percentage of one (12 out of 100), that it is multiplied by the loss and by the weight, and that the price of the same provider is added at the end.",
    sources: [
      { label: "The two offers · Provider A · price per year", value: "€80,000", target: "felt-offer-A" },
      { label: "The buyer's estimates · chance it goes wrong · Provider A", value: "12%", target: "felt-est-chanceA" },
      { label: "The buyer's estimates · cost to the buyer if it goes wrong", value: "€150,000", target: "felt-est-loss" },
      { label: "The buyer's estimates · loss weight", value: "2", target: "felt-est-weight" },
    ],
  },
  F2: {
    id: "F2",
    label: "F2 · Felt cost of the Sentinel offer (Provider B), € per year",
    question: "What does the Sentinel offer feel like it costs the buyer per year?",
    answer: FELT.B,
    unit: "€",
    formula: "Felt cost = the price per year + (the loss weight × the buyer's chance that it goes wrong × the cost to the buyer if it does). Use the row of Provider B.",
    taughtIn: "A3",
    clue: "Same steps as for Provider A, with the numbers from the Provider B row. The loss and the weight are the same for both; the price and the chance are not.",
    sources: [
      { label: "The two offers · Provider B · price per year", value: "€96,000", target: "felt-offer-B" },
      { label: "The buyer's estimates · chance it goes wrong · Provider B", value: "4%", target: "felt-est-chanceB" },
      { label: "The buyer's estimates · cost to the buyer if it goes wrong", value: "€150,000", target: "felt-est-loss" },
      { label: "The buyer's estimates · loss weight", value: "2", target: "felt-est-weight" },
    ],
  },
  F3: {
    id: "F3",
    label: "F3 · How much cheaper Sentinel feels than SecureIT, € per year",
    question: "By how many euros does the Sentinel offer feel cheaper than the SecureIT offer, once the risk is included?",
    answer: FELT.gap,
    unit: "€",
    formula: "Felt gap = the felt cost of Provider A minus the felt cost of Provider B (your own F1 and F2).",
    taughtIn: "A3",
    clue: "It is the difference between your two felt costs, not between the two prices. A positive answer means Provider B feels cheaper.",
    sources: "figures",
  },
};

/** Worked example of Materi A3: a different company, so the task's answer is never printed. Case assumption. */
export const HANSA = {
  buyer: "Hansawerk",
  loss: 90000,
  X: { name: "Provider X", price: 50000, chance: 10 },
  Y: { name: "Provider Y", price: 58000, chance: 3 },
};
export const HANSA_FELT = {
  X: feltCost(HANSA.X.price, HANSA.X.chance, HANSA.loss),
  Y: feltCost(HANSA.Y.price, HANSA.Y.chance, HANSA.loss),
};
