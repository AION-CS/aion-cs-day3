import { BARRIERS, BARRIER_IDS } from "@/data/barriers";
import { REASONS, REASON_LABEL } from "@/data/debrief";
import { EXIT_NOTES, INFO_ITEMS, STRENGTH_LABEL, TRUTH_COUNTS, TRUTH_DROPPED, strengthOf, strengthPoints } from "@/data/exitNotes";
import { BUDGET, MEASURES, MODEL_MEASURES, MODEL_COST, WORKING_FOUR_COST, modelScore, speedBucket } from "@/data/measures";
import {
  DECISIONS,
  FACTORS,
  FACTOR_IDS,
  KPIS,
  LEVERS,
  LEVEL_LABEL,
  MODEL_ARCH,
  MODEL_DECISION,
  MODEL_LEVERS,
  MODEL_PHASES,
  MODEL_RISKS,
  MODEL_TRIPWIRE,
  OWNERS,
  OWNER_ACCEPT,
  RISKS,
  leverModelTotal,
} from "@/data/route2";
import type { LeverId } from "@/data/route2";

/**
 * Mentor-only answer keys for the exercises where the learner picks from fixed options. Each key gives the expected answer and a
 * reason per option, including why each rejected option is rejected, plus a teaching note wherever more than one answer defends.
 * Never exported and never shown to a learner.
 */
export type AnswerKeyOption = { label: string; expected: boolean; why: string };
export type AnswerKeyBlock = { title: string; expected: string; options: AnswerKeyOption[]; teachingNote?: string };

/* ------------------------------------------------------------------ Route 1 */

export function sortKey(): AnswerKeyBlock {
  return {
    title: "Block 1.1 · Rational, Emotional or Both",
    expected: REASONS.map((r, i) => `${i + 1} → ${REASON_LABEL[r.truth]}`).join(" · "),
    options: REASONS.flatMap((r, i) => [
      { label: `Statement ${i + 1} → ${REASON_LABEL[r.truth]}`, expected: true, why: r.why },
      ...(Object.entries(r.rejected) as [keyof typeof REASON_LABEL, string][]).map(([tag, why]) => ({ label: `Statement ${i + 1} → ${REASON_LABEL[tag]}`, expected: false, why })),
    ]),
    teachingNote:
      "The two Both items (“two firms in our association use Sentinel” and “Sentinel is the safe choice”) are the ones a learner will argue about. A learner who files the first under Rational because it can be checked is reasoning, not guessing: point to the second test, what work the sentence does for the buyer. The sort is about function, not about whether the buyer is rational.",
  };
}

export function tagKey(): AnswerKeyBlock {
  return {
    title: "Block 2.1 · The barrier in each exit note",
    expected: EXIT_NOTES.map((n) => `${n.deal.replace("Deal ", "")} → ${BARRIERS[n.truth].short}`).join(" · "),
    options: EXIT_NOTES.flatMap((n) => [
      { label: `${n.deal} → ${BARRIERS[n.truth].label}`, expected: true, why: n.why },
      ...(Object.entries(n.rejected) as [keyof typeof BARRIERS, string][]).map(([b, why]) => ({ label: `${n.deal} → ${BARRIERS[b].label}`, expected: false, why })),
    ]),
    teachingNote: `Expected counts: ${BARRIER_IDS.map((b) => `${BARRIERS[b].short} ${TRUTH_COUNTS[b]}`).join(", ")}. The two pairs learners swap most are Fear and Trust (Deals 01, 02, 11 against 03, 04, 12) and Overload and Inertia (Deals 07, 08 against 09). Send them to the pair tests in A5 before you say which is right.`,
  };
}

export function patternKey(): AnswerKeyBlock {
  const rows = BARRIER_IDS.map((b) => {
    const pts = strengthPoints(TRUTH_COUNTS[b], TRUTH_DROPPED[b]);
    return { b, pts, s: strengthOf(pts) };
  });
  return {
    title: "Block 2.2 · The four patterns and their strength",
    expected: rows
      .filter((r) => TRUTH_COUNTS[r.b] >= 2)
      .map((r) => `${BARRIERS[r.b].short} (${TRUTH_COUNTS[r.b]} notes + ${TRUTH_DROPPED[r.b]} dropouts = ${r.pts} → ${STRENGTH_LABEL[r.s]})`)
      .join(" · "),
    options: rows.map((r) => ({
      label: `${BARRIERS[r.b].label}: ${TRUTH_COUNTS[r.b]} notes, ${TRUTH_DROPPED[r.b]} dropouts`,
      expected: TRUTH_COUNTS[r.b] >= 2,
      why:
        TRUTH_COUNTS[r.b] >= 2
          ? `Central: one of the four most frequent. ${r.pts} points is ${STRENGTH_LABEL[r.s]}.${r.b === "overload" ? " Both notes only delayed, so it is Low even though it is a central pattern." : ""}`
          : `Appears in ${TRUTH_COUNTS[r.b]} note${TRUTH_COUNTS[r.b] === 1 ? "" : "s"}, so it is not among the four most frequent. ${r.b === "owner" ? "It cancelled its one deal, so it deserves a watch, not a place in the top four." : ""}`,
    })),
    teachingNote:
      "The check compares the learner's four barriers and ratings with the learner's own tally, not with this table, so a learner who tagged a note differently can still be right. If their tally matches the reference tags, the answer is Fear High, Trust High, Proof Mid, Overload Low. Ask a learner who calls Overload ‘High’ what happened to those two deals: both only delayed.",
  };
}

export function infoKey(): AnswerKeyBlock {
  return {
    title: "Block 2.2 · What the file does not tell you",
    expected: INFO_ITEMS.filter((i) => i.useful).map((i) => i.label).join(" · "),
    options: INFO_ITEMS.map((i) => ({ label: i.label, expected: i.useful, why: i.why })),
    teachingNote: "Any two or three of the four useful items defend. The three that do not are the ones about the vendor or already in the file. Do not accept “price list” without asking which of the twelve notes mentions price (none).",
  };
}

export function measureKey(): AnswerKeyBlock {
  return {
    title: "Block 2.3 · The three measures",
    expected: `${MODEL_MEASURES.map((id) => MEASURES.find((m) => m.id === id)!.name).join(", ")} (score 18 each, €${MODEL_COST.toLocaleString("en-US")})`,
    options: MEASURES.map((m) => ({
      label: `${m.name}: ${m.model.influence} × ${m.model.feasibility} × ${speedBucket(m.weeks)} = ${modelScore(m.id)}`,
      expected: MODEL_MEASURES.includes(m.id),
      why: `${m.model.note} ${m.verdict}`,
    })),
    teachingNote: `The budget forces the choice: the four measures that work cost €${WORKING_FOUR_COST.toLocaleString("en-US")} against €${BUDGET.toLocaleString("en-US")}, so one has to go, and the decision paper scores lowest (12). A learner who keeps the decision paper and drops the reference programme (both defensible on cost) should say which pattern is then uncovered and whether the order still follows the scores. Influence is judged from the learner's own tally, so accept a different score if it is explained by their evidence.`,
  };
}

export function orderKey(): AnswerKeyBlock {
  return {
    title: "Block 2.3 · The priority order",
    expected: "Guarantee, then deal partner, then references (all three score 18)",
    options: [
      { label: "Guarantee first", expected: true, why: "Fear is in three notes and cancelled two deals at the moment of signature. Four weeks to a first effect." },
      { label: "Deal partner second", expected: true, why: "Three weeks to a first effect on trust and on the load of the decision." },
      { label: "References third", expected: true, why: "The same score, but six weeks to a first effect and it needs customers' consent." },
    ],
    teachingNote: "With three equal scores any order can be defended if the reason is stated. What is not defensible is an order that puts a lower score above a higher one with no reason, which is what the app's check flags.",
  };
}

/* ------------------------------------------------------------------ Route 2 */

export function factorKey(): AnswerKeyBlock {
  return {
    title: "Block 3.1 · The three central factors",
    expected: "Trust, Perceived risk and Social proof (Emotion also defends as the third)",
    options: FACTOR_IDS.map((f) => ({
      label: FACTORS[f].name,
      expected: f === "trust" || f === "risk" || f === "proof",
      why:
        f === "trust" || f === "risk"
          ? "Named by the plan as central and present in the exit notes (Trust 3, Fear 3)."
          : f === "proof"
            ? "Present in two notes and it is what a comparable customer supplies. Emotion is an equally defensible third: it is how the buyer feels about the risk."
            : f === "emotion"
              ? "Defends as a third factor if the learner ties it to “felt safety”; it is broader than the others, so ask what they would observe."
              : f === "habit"
                ? "A real factor but it appeared in one note of twelve. It would be a fourth."
                : "Acts early, before the stage where the deals are lost. Not central to this evidence.",
    })),
    teachingNote: "The check requires trust and perceived risk. The third is free among proof, emotion or another with evidence. If they choose Habit or Reciprocity, ask which of the twelve notes supports it.",
  };
}

export function modelKey(): AnswerKeyBlock {
  return {
    title: "Block 3.2 · The control model",
    expected: MODEL_PHASES.map((p) => `${p.name}: ${p.factorAccept.map((f) => FACTORS[f].name).join(" or ")}`).join(" · "),
    options: MODEL_PHASES.flatMap((p) => [
      { label: `${p.name}: the buyer's question`, expected: true, why: p.questions.find((q) => q.id === p.questionTruth)!.label },
      { label: `${p.name}: dominant factor`, expected: true, why: `${p.factorAccept.map((f) => FACTORS[f].name).join(" or ")}. ${p.why}` },
      { label: `${p.name}: signal`, expected: true, why: p.signals.find((s) => s.id === p.signalTruth)!.label },
    ]),
    teachingNote: "Two factors defend in the last two phases (Evaluation: proof or trust; Decision: trust or risk). Accept either with a reason. The check reports how many of the nine picks hold and never which ones.",
  };
}

export function leverKey(): AnswerKeyBlock {
  return {
    title: "Block 3.3 · The three levers",
    expected: `${MODEL_LEVERS.map((id) => LEVERS.find((l) => l.id === id)!.name).join(", ")}`,
    options: LEVERS.map((l) => ({
      label: `${l.name} (${LEVEL_LABEL[l.level]}): ${leverModelTotal(l.id)} of 12`,
      expected: MODEL_LEVERS.includes(l.id),
      why: l.note,
    })),
    teachingNote:
      "The check requires at least two of the three levers to be systemic (process or structure). The deal partner is defensible as the deepest lever in a single deal, but scores 7 because it depends on people and its cost repeats with every deal. The signals lever scores 10 and is best funded as the enabler in 3.5, not as one of the three psychological levers, because it does not change a buyer.",
  };
}

export function riskKey(): AnswerKeyBlock {
  return {
    title: "Block 3.4 · The three risks",
    expected: `${MODEL_RISKS.map((id) => RISKS.find((r) => r.id === id)!.name).join("; ")} (any three of the six psychology risks defend)`,
    options: RISKS.map((r) => ({
      label: `${r.name}${r.psychology ? "" : " (not a psychology risk)"}`,
      expected: r.psychology,
      why: r.why,
    })),
    teachingNote: "The check counts how many chosen risks are misjudgments of customer psychology. The two that are not (a competitor price cut, sellers logging without acting) are real risks that belong in the market analysis and the governance of the plan.",
  };
}

export function ownerKey(ids: LeverId[]): AnswerKeyBlock {
  return {
    title: "Block 3.5 · Owners",
    expected: ids.map((id) => `${LEVERS.find((l) => l.id === id)!.name}: ${OWNER_ACCEPT[id].map((o) => OWNERS[o].name).join(" or ")}`).join(" · "),
    options: ids.map((id) => ({
      label: LEVERS.find((l) => l.id === id)!.name,
      expected: true,
      why: `Owner test: who can change it without asking anyone else? ${OWNER_ACCEPT[id].map((o) => `${OWNERS[o].name} (${OWNERS[o].profile})`).join(" Or: ")}`,
    })),
    teachingNote: "Accept an alternative owner if the learner can name what that person can change. Push back on more than two items for the Chief Sales Officer, and on an owner who can coach but not change the thing (a team lead for a contract clause).",
  };
}

export function decisionKey(): AnswerKeyBlock {
  return {
    title: "Block 3.6 · The decision",
    expected: DECISIONS.find((d) => d.id === MODEL_DECISION)!.label,
    options: DECISIONS.map((d) => ({ label: d.label, expected: d.id === MODEL_DECISION, why: d.id === MODEL_DECISION ? d.why : d.rejected })),
    teachingNote: "“Commit now” defends only if the learner can say what in the plan can be undone; most of the money is spent in months 1 and 2. “Wait” is the one to refuse: the brief asks for a decision before the reactions are known, and Materi B3 shows waiting has the largest regret under every reading.",
  };
}

export function tripKey(): AnswerKeyBlock {
  const k = KPIS.find((x) => x.id === MODEL_TRIPWIRE.kpi)!;
  return {
    title: "Block 3.6 · The tripwire",
    expected: `${k.label} reaches ${MODEL_TRIPWIRE.threshold}${k.unit} by month ${MODEL_TRIPWIRE.month}, otherwise adjust one lever`,
    options: KPIS.map((x) => ({
      label: `${x.label} (baseline ${x.baseline}${x.unit === "%" ? "%" : ` ${x.unit}`})`,
      expected: x.behaviour,
      why: x.behaviour ? `A buyer behaviour. The threshold must be ${x.better === "up" ? "above" : "below"} ${x.baseline}.` : "An activity count: it says how much the sellers did, not how the buyers behaved, and it could push sellers to send more, which raises pressure.",
    })),
    teachingNote: "Any of the four behaviour metrics defends. The check flags a threshold that is not better than the baseline printed in the block, and the activity metric.",
  };
}

export const MODEL_ARCH_NAMES = MODEL_ARCH.map((id) => LEVERS.find((l) => l.id === id)!.name);
