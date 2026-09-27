import { BARRIER_IDS } from "@/data/barriers";
import type { BarrierId } from "@/data/barriers";
import { REASONS } from "@/data/debrief";
import { EXIT_NOTES, INFO_BY_ID, NOTE_BY_ID, NOTE_IDS, strengthOf, strengthPoints } from "@/data/exitNotes";
import type { InfoId, Strength } from "@/data/exitNotes";
import { FELT } from "@/data/feltCost";
import { MEASURE_BY_ID, speedBucket } from "@/data/measures";
import type { MeasureId } from "@/data/measures";
import {
  ENABLERS,
  KPI_BY_ID,
  LEVER_BY_ID,
  LEVER_CHOOSE,
  MODEL_PHASES,
  PHASE_BY_ID,
  R2_BUDGET,
  RISK_BY_ID,
  archItems,
  isSystemic,
  maxRating,
} from "@/data/route2";
import type { Criterion, LeverId, PhaseId, RiskId } from "@/data/route2";
import { extractAmounts, parseAmount } from "@/lib/parseAmount";
import type { L1State, R2State, SortMap, TagMap } from "@/store/useStore";

/* ------------------------------------------------------------------ Block 1.1 */

/** How many placed statements hold. Never says which: with three tags, naming the wrong ones would name the answer. */
export function sortHolds(sort: SortMap): { holds: number; placed: number } {
  let holds = 0;
  let placed = 0;
  for (const r of REASONS) {
    const t = sort[r.id];
    if (t === null || t === undefined) continue;
    placed++;
    if (t === r.truth) holds++;
  }
  return { holds, placed };
}

/* ------------------------------------------------------------------ Block 1.2 */

/** The figures a sentence about trust and risk may rest on: every value the felt-cost calculation derives. */
export const FELT_DERIVED = [FELT.A, FELT.B, FELT.gap, FELT.priceGap, FELT.riskA, FELT.riskB];

export function citesFeltFigure(text: string): boolean {
  return extractAmounts(text).some((n) => FELT_DERIVED.some((d) => Math.abs(n - d) < 0.5));
}

/** The figure checked against the learner's entry: 0.5 euro of rounding at most. */
export function feltMatches(entered: string, answer: number): boolean {
  const v = parseAmount(entered);
  return v !== null && Math.abs(v - answer) < 0.5;
}

/* ------------------------------------------------------------------ Block 2.1 and 2.2 */

export function tagHolds(tags: TagMap): { holds: number; placed: number } {
  let holds = 0;
  let placed = 0;
  for (const id of NOTE_IDS) {
    const t = tags[id];
    if (t === null || t === undefined) continue;
    placed++;
    if (t === NOTE_BY_ID[id].truth) holds++;
  }
  return { holds, placed };
}

export type Tally = { count: Record<BarrierId, number>; dropped: Record<BarrierId, number>; tagged: number };

/** The learner's own tally: how many notes they tagged with each barrier, and how many of those dropped out. */
export function tallyOf(tags: TagMap): Tally {
  const count = { fear: 0, trust: 0, proof: 0, inertia: 0, overload: 0, owner: 0 } as Record<BarrierId, number>;
  const dropped = { ...count };
  let tagged = 0;
  for (const n of EXIT_NOTES) {
    const t = tags[n.id];
    if (!t) continue;
    tagged++;
    count[t]++;
    if (n.outcome === "dropped") dropped[t]++;
  }
  return { count, dropped, tagged };
}
export const allTagged = (tags: TagMap) => NOTE_IDS.every((id) => !!tags[id]);

/** Points from the learner's own tally, and the strength they give. */
export const ownPoints = (b: BarrierId, t: Tally) => strengthPoints(t.count[b], t.dropped[b]);
export const ownStrength = (b: BarrierId, t: Tally): Strength => strengthOf(ownPoints(b, t));

/** A barrier is one of the four central patterns when its count reaches the fourth-highest count (a tie can admit more than four). */
export function isCentral(b: BarrierId, t: Tally): boolean {
  const sorted = [...BARRIER_IDS].map((x) => t.count[x]).sort((a, c) => c - a);
  const cutoff = sorted[3];
  return t.count[b] > 0 && t.count[b] >= cutoff;
}

/** The four barriers the learner should name, ordered by their own points. */
export function ownTopFour(t: Tally): BarrierId[] {
  return [...BARRIER_IDS].filter((b) => isCentral(b, t)).sort((a, c) => ownPoints(c, t) - ownPoints(a, t) || t.count[c] - t.count[a]).slice(0, 4);
}

export type PatternCheck = { barrier: number; strength: number; filled: number; rowsBarrier: boolean[]; rowsStrength: boolean[] };
export function patternCheck(l1: L1State): PatternCheck {
  const t = tallyOf(l1.tags);
  const rowsBarrier = l1.patterns.map((p) => !!p.barrier && isCentral(p.barrier, t));
  const distinct = l1.patterns.map((p, i) => !!p.barrier && l1.patterns.findIndex((q) => q.barrier === p.barrier) === i);
  const rb = rowsBarrier.map((v, i) => v && distinct[i]);
  const rowsStrength = l1.patterns.map((p) => !!p.barrier && !!p.strength && p.strength === ownStrength(p.barrier, t));
  return {
    barrier: rb.filter(Boolean).length,
    strength: rowsStrength.filter(Boolean).length,
    filled: l1.patterns.filter((p) => p.barrier && p.strength).length,
    rowsBarrier: rb,
    rowsStrength,
  };
}

/** The information items the learner picked that would change what SecureIT does. */
export function infoHolds(info: InfoId[]): { holds: number; chosen: number } {
  return { holds: info.filter((i) => INFO_BY_ID[i].useful).length, chosen: info.length };
}

/* ------------------------------------------------------------------ Block 2.3 */

const sameSet = <T,>(a: T[], b: T[]) => a.length === b.length && a.every((x) => b.includes(x));

/**
 * The aims a learner names for a measure hold when they contain the measure's main target and nothing outside its real targets.
 * A measure with no real target (a discount, a countdown) holds only when its aims are empty.
 */
export function aimsHold(id: MeasureId, aims: BarrierId[]): boolean {
  const truth = MEASURE_BY_ID[id].targets;
  if (truth.length === 0) return aims.length === 0;
  return aims.includes(truth[0]) && aims.every((a) => truth.includes(a));
}
export const speedHolds = (id: MeasureId, spd: number) => spd === speedBucket(MEASURE_BY_ID[id].weeks);

export const measureScore = (l1: L1State, id: MeasureId) => (l1.inf[id] || 0) * (l1.fea[id] || 0) * (l1.spd[id] || 0);
export const measureScored = (l1: L1State, id: MeasureId) => !!l1.inf[id] && !!l1.fea[id] && !!l1.spd[id];
export const totalCost = (ids: MeasureId[]) => ids.reduce((s, id) => s + MEASURE_BY_ID[id].cost, 0);

/** The four patterns of the learner's own file, and whether the chosen measures reach them (by what each measure really acts on). */
export function coverage(l1: L1State): { barrier: BarrierId; covered: boolean }[] {
  const named = l1.patterns.map((p) => p.barrier).filter((b): b is BarrierId => !!b);
  return named.map((b) => ({ barrier: b, covered: l1.chosen.some((id) => MEASURE_BY_ID[id].targets.includes(b)) }));
}

/** Pairs where a lower score sits above a higher one in the learner's order. */
export function orderInversions(l1: L1State): { high: MeasureId; low: MeasureId }[] {
  const out: { high: MeasureId; low: MeasureId }[] = [];
  const ord = l1.order.filter((id) => l1.chosen.includes(id));
  for (let i = 0; i < ord.length; i++)
    for (let j = i + 1; j < ord.length; j++) if (measureScored(l1, ord[i]) && measureScored(l1, ord[j]) && measureScore(l1, ord[i]) < measureScore(l1, ord[j])) out.push({ high: ord[j], low: ord[i] });
  return out;
}

export { sameSet };

/* ------------------------------------------------------------------ Route 2 */

/** 3.1: the three factors must include the two the plan names as central, trust and perceived risk. */
export function factorsHold(r2: R2State): { trust: boolean; risk: boolean } {
  return { trust: r2.factors.includes("trust"), risk: r2.factors.includes("risk") };
}

/** 3.2: how many of the nine picks hold (a question, a factor and a signal for each of the three phases). */
export function modelHolds(r2: R2State): { holds: number; total: number; rows: Record<PhaseId, { question: boolean; factor: boolean; signal: boolean }> } {
  let holds = 0;
  const rows = {} as Record<PhaseId, { question: boolean; factor: boolean; signal: boolean }>;
  for (const ph of MODEL_PHASES) {
    const m = r2.model[ph.id];
    const q = m.question === ph.questionTruth;
    const f = !!m.factor && ph.factorAccept.includes(m.factor);
    const s = m.signal === ph.signalTruth;
    rows[ph.id] = { question: q, factor: f, signal: s };
    holds += Number(q) + Number(f) + Number(s);
  }
  return { holds, total: MODEL_PHASES.length * 3, rows };
}
export { PHASE_BY_ID };

/** 3.3: the ratings that exceed what the printed facts of the lever allow. */
export function ratingFlags(r2: R2State): string[] {
  const out: string[] = [];
  for (const l of r2.levers)
    for (const c of ["reach", "depth", "durability", "scale"] as Criterion[]) {
      const v = r2.rate[`${l}.${c}`] || 0;
      if (v > maxRating(l, c)) out.push(`${l}.${c}`);
    }
  return out;
}
export const leverRated = (r2: R2State, id: LeverId) => (["reach", "depth", "durability", "scale"] as Criterion[]).every((c) => !!r2.rate[`${id}.${c}`]);
export const leverTotal = (r2: R2State, id: LeverId) => (["reach", "depth", "durability", "scale"] as Criterion[]).reduce((s, c) => s + (r2.rate[`${id}.${c}`] || 0), 0);
export const systemicCount = (levers: LeverId[]) => levers.filter(isSystemic).length;
export const LEVERS_OK = LEVER_CHOOSE;

/** 3.4: risks that are misjudgments of customer psychology, and signals that are not the early warning. */
export const psychologyCount = (risks: RiskId[]) => risks.filter((r) => RISK_BY_ID[r].psychology).length;
export function signalFlags(r2: R2State): string[] {
  return r2.risks.filter((id) => r2.riskSignal[id] && r2.riskSignal[id] !== RISK_BY_ID[id].signalTruth).map((id) => `${id}.signal`);
}
export const hasNumber = (t: string) => /\d/.test(t);

/** 3.5 */
export const archIds = (r2: R2State): LeverId[] => archItems(r2.levers);
export const funded = (r2: R2State): LeverId[] => archIds(r2).filter((id) => r2.alloc[id]);
export const archCost = (r2: R2State) => funded(r2).reduce((s, id) => s + LEVER_BY_ID[id].cost, 0);
export const archOver = (r2: R2State) => Math.max(0, archCost(r2) - R2_BUDGET);
export const archLeft = (r2: R2State) => R2_BUDGET - archCost(r2);

/**
 * The two rules of Materi B5 that the learner's sequence is checked against: the behaviour signals are funded and start no later than the
 * first lever (baseline first), and the total is inside the budget. Returns how many hold, out of two.
 */
export function seqRules(r2: R2State): { baseline: boolean; budget: boolean; hasSignals: boolean } {
  const f = funded(r2);
  const hasSignals = f.includes("signals");
  const levers = f.filter((id) => !ENABLERS.includes(id) || r2.levers.includes(id)).filter((id) => id !== "signals");
  const sigStart = r2.start.signals;
  const firstLever = Math.min(...levers.map((id) => r2.start[id] ?? 99));
  const baseline = hasSignals && sigStart != null && (levers.length === 0 || sigStart <= firstLever);
  return { baseline, budget: archOver(r2) === 0 && f.length > 0, hasSignals };
}

/** 3.6: a tripwire whose metric is a buyer behaviour and whose threshold is better than the baseline. */
export function tripFlags(r2: R2State): string[] {
  const out: string[] = [];
  if (r2.tripKpi && !KPI_BY_ID[r2.tripKpi].behaviour) out.push("kpi");
  if (r2.tripKpi && r2.tripThreshold.trim()) {
    const v = parseAmount(r2.tripThreshold);
    const k = KPI_BY_ID[r2.tripKpi];
    if (v !== null && (k.better === "up" ? v <= k.baseline : v >= k.baseline)) out.push("threshold");
  }
  return out;
}
