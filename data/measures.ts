import type { BarrierId } from "@/data/barriers";

/**
 * Task 1 · Block 2.3. Nine measures SecureIT could fund inside €100,000 and three months. Costs, weeks and
 * dependencies are Case assumptions. What each measure changes is described as a mechanism, never with the
 * barrier's name, so the learner has to match them (Materi A7). `targets` and the model scores are used only by
 * the answer key, the worked answers and the checks; they are never printed to a learner.
 */
export type MeasureId = "refs" | "guarantee" | "partner" | "decision" | "checkup" | "discount" | "countdown" | "webinar" | "champion";

export const BUDGET = 100000;
export const MONTHS = 3;

export type Measure = {
  id: MeasureId;
  name: string;
  /** What it is, in one sentence. */
  what: string;
  /** What it changes in the buyer, as a mechanism (no barrier name). */
  mechanism: string;
  /** What has to be true for it to work: the feasibility evidence. */
  needs: string;
  cost: number;
  /** Weeks until the first effect on a live deal. */
  weeks: number;
  /** Barriers it really acts on (reference answer). */
  targets: BarrierId[];
  /** Model scores 1 to 3, with the reason for each. */
  model: { influence: 1 | 2 | 3; feasibility: 1 | 2 | 3; note: string };
  /** Why it is not among the model measures, or why it is. */
  verdict: string;
};

export const MEASURES: Measure[] = [
  {
    id: "refs",
    name: "Reference programme",
    what: "Three named customers, one page each, and a call with any of them on request before the proposal.",
    mechanism: "Puts comparable companies in front of the buyer who took the same step and can answer the buyer's own questions.",
    needs: "Three satisfied customers agree to be named. Two have already said yes.",
    cost: 24000,
    weeks: 6,
    targets: ["proof", "trust"],
    model: { influence: 3, feasibility: 3, note: "Reaches the Proof notes (2) and part of the Trust notes (3): 5 of 12. Two of three customers already agreed, so little stands in the way." },
    verdict: "A model measure: strong on Proof and Trust, feasible, six weeks to the first effect.",
  },
  {
    id: "guarantee",
    name: "Buyer-safety guarantee",
    what: "A 90-day exit clause, a phased go-live and a written rollback plan in every contract.",
    mechanism: "Makes the worst outcome smaller and reversible, so the buyer's downside shrinks before the price is discussed.",
    needs: "The CFO and legal approve the exit clause and a risk reserve.",
    cost: 26000,
    weeks: 4,
    targets: ["fear"],
    model: { influence: 3, feasibility: 2, note: "Fear is in 3 notes and 2 of them dropped out, at the moment of signature. One internal approval is needed." },
    verdict: "A model measure: it acts on the barrier that cancels deals, at the moment they are cancelled.",
  },
  {
    id: "partner",
    name: "Deal partner",
    what: "A named delivery engineer joins the buyer's team, from the verbal yes to the signature, as a personal contact.",
    mechanism: "Lets the buyer meet and test the people who would deliver, and walks the buyer through the decision step by step.",
    needs: "Half a delivery engineer's time for three months, taken from delivery capacity.",
    cost: 34000,
    weeks: 3,
    targets: ["trust", "overload"],
    model: { influence: 3, feasibility: 2, note: "Reaches Trust (3 notes) and, by guiding the buyer, part of Overload (2 notes). Needs scarce capacity, so feasibility is 2." },
    verdict: "A model measure: personal support builds trust and cuts the load of the decision, in three weeks.",
  },
  {
    id: "decision",
    name: "Decision paper and standard package",
    what: "Three fixed packages, one standard contract and a one-page decision paper for every proposal.",
    mechanism: "Cuts the number of options and pages the buyer has to weigh, so choosing is easier than postponing.",
    needs: "Built in-house from the existing offers. No outside dependency.",
    cost: 18000,
    weeks: 5,
    targets: ["overload", "owner"],
    model: { influence: 2, feasibility: 3, note: "Overload is in 2 notes and both only delayed. Feasible without any outside help." },
    verdict: "A sound measure that just misses: influence 2 and no dropout on its barrier. The budget forces one to be left out, and this scores lowest of the four that work.",
  },
  {
    id: "checkup",
    name: "Free security health check",
    what: "A gift: a two-day check of the buyer's exposure, delivered before any offer is made.",
    mechanism: "Gives something of value first, so the buyer feels a wish to return the favour and sees how the vendor works.",
    needs: "A new tool licence and a week of the delivery team's time per check.",
    cost: 20000,
    weeks: 10,
    targets: ["trust", "inertia"],
    model: { influence: 1, feasibility: 1, note: "Works early in the funnel, not in the last weeks before signing. Ten weeks to a first effect, and it takes delivery capacity SecureIT does not have." },
    verdict: "Reciprocity is a real lever, but this one pays back after the three months and acts before the stage where deals are being lost.",
  },
  {
    id: "discount",
    name: "Quarter-end discount of 10%",
    what: "A 10% reduction on any contract signed before quarter end.",
    mechanism: "Lowers the price. It does not change what the buyer expects to go wrong or who the buyer trusts.",
    needs: "Nothing: sales can start at once. The margin falls on every deal.",
    cost: 35000,
    weeks: 1,
    targets: [],
    model: { influence: 1, feasibility: 3, note: "Price is named in none of the 12 notes. It scores well on speed and feasibility, and still comes out at 9." },
    verdict: "Rejected: it answers a barrier the evidence does not show. It also pays a discount on deals that would have signed anyway.",
  },
  {
    id: "countdown",
    name: "Countdown pressure",
    what: "“This offer expires in 10 days” on every proposal.",
    mechanism: "Raises the felt cost of waiting. On a high-risk decision it also raises the buyer's fear and the wish to resist being pushed.",
    needs: "Nothing. It is cheap and fast.",
    cost: 2000,
    weeks: 1,
    targets: [],
    model: { influence: 1, feasibility: 3, note: "It works on the barrier that is already doing the damage, and it may make it worse." },
    verdict: "Rejected: pressure on a complex, high-risk decision feeds the fear, and a deadline that is not real is a misleading claim (§ 5 UWG).",
  },
  {
    id: "webinar",
    name: "Product feature webinars",
    what: "A monthly webinar series on the product's technical features.",
    mechanism: "Adds product argument. It does not change how safe, known or easy the decision feels.",
    needs: "Marketing capacity, an audience, and time for the series to build.",
    cost: 15000,
    weeks: 12,
    targets: [],
    model: { influence: 1, feasibility: 3, note: "More argument for buyers who are not stopped by the argument. Twelve weeks to a first effect." },
    verdict: "Rejected: the buyers in the notes do not lack features. They lack safety, familiarity and simplicity.",
  },
  {
    id: "champion",
    name: "Champion and consensus kit",
    what: "A stakeholder map and a one-page internal justification the buyer's champion can forward to colleagues.",
    mechanism: "Gives the person who wants the deal what they need to carry it, and names who must sign.",
    needs: "Built in-house from a template.",
    cost: 10000,
    weeks: 4,
    targets: ["owner"],
    model: { influence: 1, feasibility: 3, note: "A valid measure, but its barrier appears in 1 note of 12. It scores 9." },
    verdict: "Not chosen: it works, and the pattern it addresses is too rare in this evidence to be among the first three.",
  },
];

export const MEASURE_BY_ID = Object.fromEntries(MEASURES.map((m) => [m.id, m])) as Record<MeasureId, Measure>;
export const MEASURE_IDS = MEASURES.map((m) => m.id);
export const CHOOSE = 3;

/** The speed rule taught in Materi A7: by weeks to the first effect. */
export const speedBucket = (weeks: number): 1 | 2 | 3 => (weeks <= 4 ? 3 : weeks <= 8 ? 2 : 1);
export const SPEED_RULE = "Speed: 4 weeks or fewer to a first effect scores 3, 5 to 8 weeks scores 2, more than 8 weeks scores 1.";

export const modelScore = (id: MeasureId) => {
  const m = MEASURE_BY_ID[id];
  return m.model.influence * m.model.feasibility * speedBucket(m.weeks);
};

/** The reference answer: the three measures with the highest model score. Their total cost fits the budget; all four that work do not. */
export const MODEL_MEASURES: MeasureId[] = ["refs", "guarantee", "partner"];
export const MODEL_COST = MODEL_MEASURES.reduce((s, id) => s + MEASURE_BY_ID[id].cost, 0);
export const WORKING_FOUR: MeasureId[] = ["refs", "guarantee", "partner", "decision"];
export const WORKING_FOUR_COST = WORKING_FOUR.reduce((s, id) => s + MEASURE_BY_ID[id].cost, 0);

export const BUCKET_LABEL: Record<1 | 2 | 3, string> = { 1: "Low (1)", 2: "Mid (2)", 3: "High (3)" };
