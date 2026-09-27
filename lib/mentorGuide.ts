import { BARRIERS } from "@/data/barriers";
import { FELT, LOSS_WEIGHT, RHEINWERK } from "@/data/feltCost";
import type { FigureId } from "@/data/feltCost";
import { TRUTH_COUNTS, TRUTH_DROPPED, strengthOf, strengthPoints, STRENGTH_LABEL } from "@/data/exitNotes";
import { BUDGET, MEASURE_BY_ID, MODEL_COST, MODEL_MEASURES, WORKING_FOUR_COST, modelScore, speedBucket } from "@/data/measures";
import type { MeasureId } from "@/data/measures";
import { HYP_MECHS } from "@/data/hypotheses";
import { KEY_L1, KEY_R2 } from "@/data/mentorKey";
import { CRITERIA, FACTORS, LEVER_BY_ID, MODEL_PHASES, R2_BUDGET, RISK_BY_ID } from "@/data/route2";
import type { FactorId, LeverId, PhaseId, RiskId } from "@/data/route2";
import { euro } from "@/lib/lang";

/**
 * Mentor-only worked answers for every task question the answer keys (lib/answerKey.ts) do not already cover: the numeric fields,
 * with every step of the calculation written out with its numbers, and the free-text answers, with the model text and what a good
 * answer must contain. Shown only after the mentor bar is unlocked, never exported. Numbers are computed from the same constants as
 * the tables, the calculators and the answer checks, so they cannot drift from the model answers.
 */
export type WorkedStep = { label: string; calc: string; result: string };
export type MentorGuide = {
  title: string;
  /** The model answer, as a learner would enter it. */
  answer: string;
  /** For a calculation: each step with its numbers, in order. */
  steps?: WorkedStep[];
  /** Why the answer is what it is, in one or two sentences a mentor can say out loud. */
  why?: string;
  /** For free text: what an acceptable answer must contain. */
  lookFor?: string[];
  /** Typical wrong answers, with the number they produce where there is one. */
  pitfalls?: string[];
};

const n = (v: number) => (Math.round(v * 100) / 100).toLocaleString("en-US");

/* ------------------------------------------------------------------ Block 1.2 · the figures */

export function figureGuide(id: FigureId): MentorGuide {
  const A = RHEINWERK.A;
  const B = RHEINWERK.B;
  const one = (o: typeof A | typeof B, label: string, felt: number, risk: number): WorkedStep[] => [
    { label: `${label}: read the chance as a share of one`, calc: `${o.chance}% ÷ 100`, result: (o.chance / 100).toFixed(2) },
    { label: "Risk term = weight × chance × loss", calc: `${LOSS_WEIGHT} × ${(o.chance / 100).toFixed(2)} × ${n(RHEINWERK.loss)}`, result: euro(risk) },
    { label: "Felt cost = price + risk term", calc: `${n(o.price)} + ${n(risk)}`, result: euro(felt) },
  ];
  if (id === "F1")
    return {
      title: "1.2 · F1 Felt cost of Provider A",
      answer: n(FELT.A),
      steps: one(A, "Provider A", FELT.A, FELT.riskA),
      why: "The buyer counts the €80,000 and adds what the risk feels like: a 12% chance of a €150,000 loss, weighted twice because a loss hurts about twice as much as an equal gain pleases.",
      pitfalls: [
        `Forgetting to divide the chance by 100 (12 instead of 0.12): 2 × 12 × 150,000 = ${n(2 * 12 * 150000)}, plus the price gives ${n(A.price + 2 * 12 * 150000)}.`,
        `Leaving out the loss weight: ${n(A.price + 0.12 * 150000)}.`,
        `Adding no price: the risk term alone, ${n(FELT.riskA)}.`,
        `Using Provider B's chance (4%): ${n(A.price + 2 * 0.04 * 150000)}.`,
      ],
    };
  if (id === "F2")
    return {
      title: "1.2 · F2 Felt cost of Provider B",
      answer: n(FELT.B),
      steps: one(B, "Provider B", FELT.B, FELT.riskB),
      why: "Sentinel costs €16,000 more, but the buyer expects only a 4% chance of a bad outcome, so the risk term is small.",
      pitfalls: [`Using Provider A's chance (12%): ${n(B.price + 2 * 0.12 * 150000)}.`, `Leaving out the loss weight: ${n(B.price + 0.04 * 150000)}.`, `The price alone: ${n(B.price)}.`],
    };
  return {
    title: "1.2 · F3 How much cheaper Sentinel feels",
    answer: n(FELT.gap),
    steps: [
      { label: "Felt cost of Provider A (your F1)", calc: "from F1", result: euro(FELT.A) },
      { label: "Felt cost of Provider B (your F2)", calc: "from F2", result: euro(FELT.B) },
      { label: "Felt gap = A − B", calc: `${n(FELT.A)} − ${n(FELT.B)}`, result: euro(FELT.gap) },
    ],
    why: `On the price list Sentinel is ${euro(FELT.priceGap)} dearer. Once the risk is included it feels ${euro(FELT.gap)} cheaper. The sign flips, and that is the whole point of the block.`,
    pitfalls: [`The price gap, ${n(FELT.priceGap)} (subtracting the prices, not the felt costs).`, `Subtracting the other way round: ${n(-FELT.gap)}. Positive means B feels cheaper.`],
  };
}

export function extraReasonGuide(): MentorGuide {
  return {
    title: "1.1 · A reason of your own",
    answer: KEY_L1.extraReason,
    why: "Level 1 starts by collecting reasons. A good extra reason is one the debrief does not give, and the learner says which kind it is.",
    lookFor: ["A reason that is not one of the eight statements.", "A statement of rational, emotional or both, with the test in mind: could it be checked in a document, or is it about a feeing?"],
    pitfalls: ["A rewording of one of the eight statements."],
  };
}

export function roleGuide(): MentorGuide {
  return {
    title: "1.2 · What trust and risk did",
    answer: KEY_L1.role,
    why: "The sentence must say that trust lowered the chance the buyer expects (4% against 12%), that loss aversion multiplied it, and that this outweighed the price. It should quote a figure from the calculation.",
    lookFor: [
      "At least one figure from the calculation (116,000, 108,000, 8,000, 16,000, 36,000 or 12,000).",
      "The direction: the dearer provider feels cheaper.",
      "Trust or familiarity tied to the chance, and loss aversion tied to the weight.",
    ],
    pitfalls: ["“Sentinel was better known so they picked it”: no number, no mechanism.", "A sentence that says Sentinel is cheaper on the price list (it is not)."],
  };
}

export function hypGuide(i: number): MentorGuide {
  const h = KEY_L1.hyp[i];
  const m = HYP_MECHS.find((x) => x.id === h.mech)!;
  return {
    title: `1.3 · Hypothesis ${i + 1} (${m.label})`,
    answer: h.text,
    why: "A hypothesis states what the buyer would do and why, in a form that could be shown wrong by looking at deals.",
    lookFor: [
      "One named mechanism from A1 to A3, different from the other two hypotheses.",
      "A condition (“if” or “when”), a buyer behaviour and a reason (“because …”).",
      "Something that could be tested: a buyer behaviour you could look for in a deal.",
    ],
    pitfalls: ["A restatement of the finding (“the buyer prefers known providers”) with no mechanism.", "Two hypotheses on the same mechanism, which cannot be tested apart."],
  };
}

export function reflectGuide(k: "assume" | "emotional" | "manager"): MentorGuide {
  const q = { assume: "What assumption did I make about customers?", emotional: "Where do I underestimate emotional factors?", manager: "How would an experienced sales manager react?" }[k];
  return {
    title: `1.4 · ${q}`,
    answer: KEY_L1.reflect[k],
    why: "A reflection is honest when it names something the learner actually did in Blocks 1.1 to 1.3, not a general virtue.",
    lookFor: ["A specific thing from this task (a sort, a figure, a hypothesis).", "What would change in their next conversation."],
    pitfalls: ["“I should listen more”: true of everyone and tied to nothing they did."],
  };
}

/* ------------------------------------------------------------------ Block 2.2 */

export function behaviourGuide(i: number): MentorGuide {
  const p = KEY_L1.patterns[i];
  const b = BARRIERS[p.barrier];
  const pts = strengthPoints(TRUTH_COUNTS[p.barrier], TRUTH_DROPPED[p.barrier]);
  return {
    title: `2.2 · Pattern ${i + 1}: ${b.label}`,
    answer: `${p.behaviour} (Strength: ${STRENGTH_LABEL[p.strength]})`,
    steps: [
      { label: "Notes tagged with the barrier", calc: `${BARRIERS[p.barrier].short}`, result: String(TRUTH_COUNTS[p.barrier]) },
      { label: "Of those, dropped out", calc: "from the twelve notes", result: String(TRUTH_DROPPED[p.barrier]) },
      { label: "Points = notes + dropouts", calc: `${TRUTH_COUNTS[p.barrier]} + ${TRUTH_DROPPED[p.barrier]}`, result: String(pts) },
      { label: "5 or more High, 3 to 4 Mid, 2 or fewer Low", calc: `${pts}`, result: STRENGTH_LABEL[strengthOf(pts)] },
    ],
    why: "The rating is the rule applied to the learner's own tally. If their tags differ from the reference, their points differ and the rating follows their evidence.",
    lookFor: ["What the buyer does (visible behaviour) and the mechanism behind it (“because …”).", "Behaviour from the notes, not a general statement about buyers."],
    pitfalls: ["Describing only the mechanism (“loss aversion”) with no behaviour.", "Rating Overload High because it is a central pattern: both of its notes only delayed."],
  };
}

export function infoTextGuide(): MentorGuide {
  return {
    title: "2.2 · The one question you would ask the buyers",
    answer: KEY_L1.infoText,
    why: "The best question is about the buyer's behaviour at the moment of stopping, and it is answered by the buyers, not by SecureIT's own records.",
    lookFor: ["A question addressed to the buyer.", "About what they felt or feared, not about SecureIT's activity.", "Something that would change the barrier tackled or the measure funded."],
    pitfalls: ["“Would you like a discount?”: a suggestion, not a question that finds a cause."],
  };
}

/* ------------------------------------------------------------------ Block 2.3 */

export function scoreGuide(id: MeasureId): MentorGuide {
  const m = MEASURE_BY_ID[id];
  const s = speedBucket(m.weeks);
  return {
    title: `2.3 · Scores for ${m.name}`,
    answer: `Influence ${m.model.influence}, feasibility ${m.model.feasibility}, speed ${s}: ${modelScore(id)}`,
    steps: [
      { label: "Influence (from the barrier it acts on)", calc: m.model.note, result: String(m.model.influence) },
      { label: "Feasibility (what has to be true)", calc: m.needs, result: String(m.model.feasibility) },
      { label: "Speed (by the rule, from the weeks)", calc: `${m.weeks} weeks`, result: String(s) },
      { label: "Score = influence × feasibility × speed", calc: `${m.model.influence} × ${m.model.feasibility} × ${s}`, result: String(modelScore(id)) },
    ],
    why: m.verdict,
    pitfalls: ["Influence is judged from the learner's own tally, so a different score is fine if their evidence differs. Speed is not judged: it follows the weeks."],
  };
}

export function whyGuide(): MentorGuide {
  return {
    title: "2.3 · Why the first priority goes first",
    answer: KEY_L1.why,
    steps: [
      { label: "Model measures and their scores", calc: MODEL_MEASURES.map((id) => `${MEASURE_BY_ID[id].name} ${modelScore(id)}`).join("; "), result: "18 each" },
      { label: "Cost of the three", calc: MODEL_MEASURES.map((id) => n(MEASURE_BY_ID[id].cost)).join(" + "), result: euro(MODEL_COST) },
      { label: "Budget check", calc: `${n(BUDGET)} − ${n(MODEL_COST)}`, result: `${euro(BUDGET - MODEL_COST)} left` },
      { label: "All four working measures", calc: "24,000 + 26,000 + 34,000 + 18,000", result: `${euro(WORKING_FOUR_COST)}: ${euro(WORKING_FOUR_COST - BUDGET)} over` },
    ],
    why: "With ties on the score, the order is decided by where deals are being lost and how fast each measure acts. The answer must say so.",
    lookFor: ["The order and a reason for it, with a score or a barrier named.", "The total cost against €100,000.", "What was left out, or a reason nothing had to be."],
    pitfalls: ["“It has the highest score” when three measures tie."],
  };
}

/* ------------------------------------------------------------------ Route 2 */

export function factorTextGuide(f: FactorId): MentorGuide {
  return {
    title: `3.1 · ${FACTORS[f].name} in a SecureIT deal`,
    answer: KEY_R2.factorText[f] ?? FACTORS[f].showsUp,
    why: FACTORS[f].means,
    lookFor: ["What the buyer does that shows the factor, in a SecureIT deal.", "How SecureIT would notice it (a signal it can see)."],
    pitfalls: ["A dictionary definition of the factor with no signal."],
  };
}

export function moveGuide(ph: PhaseId): MentorGuide {
  const p = MODEL_PHASES.find((x) => x.id === ph)!;
  return {
    title: `3.2 · What the system does in ${p.name}`,
    answer: KEY_R2.model[ph].move,
    why: p.why,
    lookFor: ["A step of the process or a rule, not an action by one seller.", "Something that answers the buyer's question of the phase."],
    pitfalls: ["“The seller should be more empathetic”: an individual intervention, not a system move."],
  };
}

export function ratingGuide(id: LeverId): MentorGuide {
  const l = LEVER_BY_ID[id];
  return {
    title: `3.3 · Ratings for ${l.name}`,
    answer: CRITERIA.map((c) => `${c.name} ${l.model[c.id]}`).join(", "),
    steps: CRITERIA.map((c) => ({ label: `${c.name}: ${c.test}`, calc: c.id === "reach" ? (l.reachAll ? "applies to every deal" : "applies to some deals") : c.id === "durability" ? `depends on ${l.depends}` : c.id === "scale" ? `cost shape: ${l.costShape}` : "how strongly it changes one deal", result: String(l.model[c.id]) })),
    why: l.note,
    pitfalls: ["A rating above what the printed facts allow is outlined by the Check: reach 3 for a threshold lever, durability above 1 for a people lever, scale 3 for a per-deal cost."],
  };
}

export function greatestGuide(): MentorGuide {
  return {
    title: "3.3 · The greatest psychological lever",
    answer: `${LEVER_BY_ID[KEY_R2.greatest].name}. ${KEY_R2.greatestWhy}`,
    why: "The greatest lever is the one that acts on the factor stopping the most deals in the evidence, with the highest depth and durability.",
    lookFor: ["A factor or barrier from Route 1 named.", "Why this lever is deep and lasting, not only fast."],
    pitfalls: ["Naming the cheapest or the fastest lever."],
  };
}

export function riskResponseGuide(id: RiskId): MentorGuide {
  const r = RISK_BY_ID[id];
  return {
    title: `3.4 · Response to “${r.name}”`,
    answer: KEY_R2.riskResponse[id] ?? "If the signal appears in 3 deals within a month, we interview the buyers within 2 weeks and change one lever.",
    why: r.why,
    lookFor: ["A number, a date and an action.", "A signal that appears before the loss is final."],
    pitfalls: ["“Monitor closely”: no number, no action."],
  };
}

export function triggerGuide(id: LeverId): MentorGuide {
  return {
    title: `3.5 · Trigger for ${LEVER_BY_ID[id].name}`,
    answer: KEY_R2.trigger[id] ?? "If the item's own metric misses its threshold by month 3, review it with its owner.",
    why: "A trigger has a metric, a number, a date and an action.",
    lookFor: ["A number.", "A date or month.", "What happens if it is missed."],
    pitfalls: ["A goal with no number (“improve the reference rate”)."],
  };
}

export function postponedGuide(): MentorGuide {
  return {
    title: "3.5 · What you leave out, and the pickup point",
    answer: `${KEY_R2.postponed} Pickup: ${KEY_R2.pickup}`,
    steps: [
      { label: "Funded items", calc: KEY_R2.arch.map((id) => `${LEVER_BY_ID[id].name} ${n(LEVER_BY_ID[id].cost)}`).join(" + "), result: euro(KEY_R2.arch.reduce((s, id) => s + LEVER_BY_ID[id].cost, 0)) },
      { label: "Budget left", calc: `${n(R2_BUDGET)} − ${n(KEY_R2.arch.reduce((s, id) => s + LEVER_BY_ID[id].cost, 0))}`, result: euro(R2_BUDGET - KEY_R2.arch.reduce((s, id) => s + LEVER_BY_ID[id].cost, 0)) },
      { label: "Adding the training (35,000) would give", calc: `${n(KEY_R2.arch.reduce((s, id) => s + LEVER_BY_ID[id].cost, 0))} + 35,000`, result: `${euro(KEY_R2.arch.reduce((s, id) => s + LEVER_BY_ID[id].cost, 0) + 35000)}: over` },
    ],
    why: "Postponing is a decision: name the item, say why, and give the number and the date at which you look again.",
    lookFor: ["An item named, not “some measures”.", "The reason (budget, weakest evidence).", "A pickup point with a number and a date."],
    pitfalls: ["Trimming every item a little instead of leaving one out."],
  };
}

export function assumptionGuide(i: number): MentorGuide {
  return {
    title: `3.6 · Assumption ${i + 1}`,
    answer: KEY_R2.assumptions[i],
    why: "Each assumption is about how customers will react, and names the sign that it is wrong.",
    lookFor: ["A statement about customer behaviour.", "The sign that would show it is wrong (a number or an observable)."],
    pitfalls: ["An assumption about SecureIT's own readiness, which is not a customer reaction."],
  };
}

export function challengeGuide(): MentorGuide {
  return {
    title: "3.6 · The board's challenge",
    answer: KEY_R2.challenge,
    why: "The answer goes back to the tripwire, keeps what the numbers support and changes one lever. It neither defends the plan blindly nor drops it.",
    lookFor: ["Reference to the tripwire or the signals.", "One lever changed, not the whole plan.", "A way to find out why (interviews, a date)."],
    pitfalls: ["Spending the rest of the budget as planned. Cancelling everything."],
  };
}
