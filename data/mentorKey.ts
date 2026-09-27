import { REASONS } from "@/data/debrief";
import type { ReasonId, ReasonTag } from "@/data/debrief";
import { EXIT_NOTES, TRUTH_DROPPED, TRUTH_COUNTS, strengthOf, strengthPoints } from "@/data/exitNotes";
import type { InfoId, NoteId, Strength } from "@/data/exitNotes";
import type { BarrierId } from "@/data/barriers";
import { FELT } from "@/data/feltCost";
import type { HypMech } from "@/data/hypotheses";
import { MEASURE_BY_ID, MODEL_MEASURES, speedBucket } from "@/data/measures";
import type { MeasureId } from "@/data/measures";
import {
  LEVER_BY_ID,
  MODEL_ARCH,
  MODEL_LEVERS,
  MODEL_PHASES,
  MODEL_RISKS,
  MODEL_START,
  MODEL_TRIGGER,
  MODEL_TRIPWIRE,
  OWNER_ACCEPT,
  RISK_BY_ID,
} from "@/data/route2";
import type { Criterion, FactorId, LeverId, OwnerId, PhaseId, RiskId } from "@/data/route2";

/**
 * Every model answer of the day, in one file. "Fill all model answers" in the mentor bar enters these, so that after one fill every
 * route's missing list is empty and every export downloads at once. The answer keys (lib/answerKey.ts) and the worked answers
 * (lib/mentorGuide.ts) read the same constants, so the three cannot drift apart. A convenience for facilitators, not security.
 */
export const MENTOR_PASSCODE = "muchson123";

/* ------------------------------------------------------------------ Route 1 */

const noteBarriers = Object.fromEntries(EXIT_NOTES.map((n) => [n.id, n.truth])) as Record<NoteId, BarrierId>;

export const KEY_L1 = {
  sort: Object.fromEntries(REASONS.map((r) => [r.id, r.truth])) as Record<ReasonId, ReasonTag>,
  extraReason:
    "A bad experience with a small vendor in the past makes every small vendor feel risky to this buyer. It is an emotional reason (a memory), even if the buyer would present it as a lesson learned.",
  felt: { F1: String(FELT.A), F2: String(FELT.B), F3: String(FELT.gap) },
  role: "SecureIT is €16,000 cheaper on the price list, but the buyer expects a 12% chance of a bad outcome with SecureIT against 4% with Sentinel. Weighted twice as heavily as a gain, that risk adds €36,000 to SecureIT and only €12,000 to Sentinel, so Sentinel feels €8,000 cheaper (€108,000 against €116,000). Trust lowered the chance the buyer expects, and loss aversion multiplied it. The price was never the deciding number.",
  hyp: [
    {
      mech: "loss" as HypMech,
      text: "When a buyer compares an unknown vendor with a known one, the buyer picks the known one even at a higher price, because a wrong choice would cost them personally far more than the price difference saves.",
    },
    {
      mech: "proof" as HypMech,
      text: "If a buyer hears that companies in their own industry association use a provider, the buyer becomes more willing to choose it, because what similar others did counts as evidence that the choice is safe.",
    },
    {
      mech: "trust" as HypMech,
      text: "When the buyer has met the people who would do the work before deciding, the buyer expects fewer problems, because trust in those people lowers the chance the buyer expects something to go wrong.",
    },
  ],
  reflect: {
    assume: "I assumed the buyer compares the two offers line by line and picks the better value. In the debrief the strongest reasons were about blame and calm, not about the offers.",
    emotional: "I underestimated the fear of being blamed. I read “Sentinel is the safe choice” as a fact about the market, when it is a feeling about the buyer's own position.",
    manager: "An experienced sales manager would ask what the buyer was afraid of before comparing terms, and would look for a way to make the risk smaller, such as a reference or an exit clause, instead of lowering the price.",
  },
  tags: noteBarriers,
  patterns: [
    {
      barrier: "fear" as BarrierId,
      behaviour: "When the contract is sent or a verbal yes is given, buyers ask for exit terms or say they would rather wait, because a wrong decision would be theirs alone to carry.",
    },
    {
      barrier: "trust" as BarrierId,
      behaviour: "Buyers ask again and again for questionnaires, interviews and calls with the engineers, or cancel the intro call, because they have not yet found a reason to depend on SecureIT's people.",
    },
    {
      barrier: "proof" as BarrierId,
      behaviour: "Buyers ask which companies like them use SecureIT and go quiet when there is no name to give, because they have no peer to point to and nothing to tell their board.",
    },
    {
      barrier: "overload" as BarrierId,
      behaviour: "Buyers send back long agreements with many comments, or ask for a simpler package and postpone, because there are too many options and pages to weigh.",
    },
  ].map((r) => {
    const pts = strengthPoints(TRUTH_COUNTS[r.barrier], TRUTH_DROPPED[r.barrier]);
    return { ...r, strength: strengthOf(pts) as Strength };
  }),
  info: ["win", "champion", "after"] as InfoId[],
  infoText: "For the buyers who dropped out after a verbal yes, what exactly were they afraid of at the moment they stopped, in their own words?",
  chosen: MODEL_MEASURES,
  aims: Object.fromEntries(MODEL_MEASURES.map((id) => [id, MEASURE_BY_ID[id].targets])) as Record<string, BarrierId[]>,
  inf: Object.fromEntries(MODEL_MEASURES.map((id) => [id, MEASURE_BY_ID[id].model.influence])),
  fea: Object.fromEntries(MODEL_MEASURES.map((id) => [id, MEASURE_BY_ID[id].model.feasibility])),
  spd: Object.fromEntries(MODEL_MEASURES.map((id) => [id, speedBucket(MEASURE_BY_ID[id].weeks)])),
  order: ["guarantee", "partner", "refs"] as MeasureId[],
  why: "The guarantee goes first: fear is in three notes and cancelled two deals at the moment of signature, and the exit clause is in place in four weeks. The deal partner is second because it works in three weeks on trust and on the load of the decision. The references come third because they need six weeks. All three score 18, so the order follows where deals are being lost and how fast each acts. Together they cost €84,000 of the €100,000 and cover all four patterns. The decision paper scores 12 and is left out, because all four would cost €102,000.",
};

/* ------------------------------------------------------------------ Route 2 */

const modelRating = (id: LeverId) => LEVER_BY_ID[id].model;

export const KEY_R2 = {
  factors: ["trust", "risk", "proof"] as FactorId[],
  factorText: {
    trust: "In a SecureIT deal it shows when the buyer asks to meet the engineers, repeats the security questionnaire or says they never got to know the people. We would notice it in the number of calls the buyer accepts before the proposal.",
    risk: "It shows when the buyer asks how to get out, what happens if the migration fails, or wants to wait a quarter. We would notice it in questions about exit terms and in silence after a verbal yes.",
    proof: "It shows when the buyer asks which companies like them use SecureIT and stops replying when there is no name to give. We would notice it in requests for references and in deals that stall right after that question.",
  } as Record<string, string>,
  model: Object.fromEntries(
    MODEL_PHASES.map((ph) => [
      ph.id,
      {
        question: ph.questionTruth,
        factor: ph.factorAccept[0],
        signal: ph.signalTruth,
        move:
          ph.id === "uncertainty"
            ? "Make the downside small and clear before any price is discussed: exit terms and a staged go-live are in the first proposal."
            : ph.id === "evaluation"
              ? "Give every buyer two comparable references and a call with the people who will deliver, as a step of the process."
              : "Cut the last steps down with one standard contract and a one-page decision paper, name the owner on the buyer's side and keep the exit visible.",
      },
    ]),
  ) as Record<PhaseId, { question: string; factor: FactorId; signal: string; move: string }>,
  levers: MODEL_LEVERS,
  rate: Object.fromEntries(MODEL_LEVERS.flatMap((id) => (["reach", "depth", "durability", "scale"] as Criterion[]).map((c) => [`${id}.${c}`, modelRating(id)[c]]))) as Record<string, number>,
  greatest: "safety-terms" as LeverId,
  greatestWhy: "Fear of a wrong decision is the barrier that cancelled the most deals in Route 1, and buyer-safety terms act on it directly. As a rule in every contract it works in every deal, whoever sells, and its cost is a one-off.",
  risks: MODEL_RISKS as RiskId[],
  riskLik: Object.fromEntries(MODEL_RISKS.map((id) => [id, RISK_BY_ID[id].model.likelihood])) as Record<string, number>,
  riskImp: Object.fromEntries(MODEL_RISKS.map((id) => [id, RISK_BY_ID[id].model.impact])) as Record<string, number>,
  riskSignal: Object.fromEntries(MODEL_RISKS.map((id) => [id, RISK_BY_ID[id].signalTruth])) as Record<string, string>,
  riskResponse: {
    stated: "If the same objection returns in 3 deals after we thought we had solved it, we interview the buyers of those deals within 2 weeks and change the lever, not the pitch.",
    price: "If discount requests rise for 2 months and the signature rate after a verbal yes stays below 70%, we stop offering discounts and move the money to the exit terms.",
    pressure: "If replies stop within 5 days of a deadline message in more than 3 deals in a month, we ban deadline messages that are not set by the buyer.",
  } as Record<string, string>,
  arch: MODEL_ARCH,
  start: MODEL_START as Record<string, number>,
  owner: Object.fromEntries(MODEL_ARCH.map((id) => [id, OWNER_ACCEPT[id][0]])) as Record<string, OwnerId>,
  trigger: MODEL_TRIGGER as Record<string, string>,
  postponed:
    "The seller training in buyer psychology (€35,000) is left out. The four funded items already cost €115,000 of the €120,000, and the training depends on individual sellers, so it lasts less than the process levers.",
  pickup: "If the signature rate after a verbal yes is still below 70% at month 4, we look at the training again with the €5,000 left and the next budget round.",
  decision: "stage" as const,
  assumptions: [
    "Buyers accept an exit clause as standard without asking for a lower price. This is wrong if discount requests rise in 3 deals in the first two months.",
    "Two references that match the buyer's size and sector are enough to answer the question “who else has done this”. This is wrong if reference calls happen and the deal still does not move.",
    "Sellers will follow the standard steps if the review reads the signals every week. This is wrong if fewer than 80% of deals carry all signals by month 2.",
  ],
  tripKpi: MODEL_TRIPWIRE.kpi,
  tripThreshold: String(MODEL_TRIPWIRE.threshold),
  tripMonth: MODEL_TRIPWIRE.month,
  tripAction: "adjust" as const,
  challenge:
    "I would go back to the tripwire and read the signals before spending more. If the reference calls happen and the deals do not move, I keep the exit terms and the decision kit, which the signals may still support, and I move the reference money to the deal signals until I know why. I would interview five of the buyers from the calls within two weeks and change one lever, not the whole plan.",
};

