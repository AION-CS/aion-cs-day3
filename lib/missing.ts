import { REASONS } from "@/data/debrief";
import { EXIT_NOTES } from "@/data/exitNotes";
import { HYP_MIN, hasBecause } from "@/data/hypotheses";
import { BARRIERS } from "@/data/barriers";
import { CHOOSE, MEASURE_BY_ID } from "@/data/measures";
import { LEVER_BY_ID, LEVER_CHOOSE, R2_BUDGET } from "@/data/route2";
import { archIds, archOver, citesFeltFigure, funded, hasNumber } from "@/lib/checks";
import { MIN_LINE, MIN_SENTENCE } from "@/lib/progress";
import { parseAmount } from "@/lib/parseAmount";
import { euro } from "@/lib/lang";
import type { Persisted } from "@/store/useStore";

/** DOM ids the missing list points at. One place, so the list and the UI cannot drift. */
export const IDS = {
  participant: "participant-strip",
  reason: (id: string) => `reason-${id}`,
  figure: (id: string) => `fig-${id}`,
  extraReason: "extra-reason",
  role: "role-field",
  hyp: (i: number) => `hyp-${i}`,
  reflect: (k: string) => `reflect-${k}`,
  note: (id: string) => `note-${id}`,
  pattern: (i: number) => `pattern-${i}`,
  info: "info-field",
  infoText: "info-text",
  measurePick: "measure-pick",
  measure: (id: string) => `measure-${id}`,
  order: "order-field",
  why: "why-field",
  exportL1: "export-l1l2",
  // Route 2
  factorPick: "factor-pick",
  factor: (id: string) => `factor-${id}`,
  model: (id: string) => `model-${id}`,
  leverPick: "lever-pick",
  lever: (id: string) => `lever-${id}`,
  greatest: "greatest-field",
  greatestWhy: "greatest-why",
  riskPick: "risk-pick",
  risk: (id: string) => `risk-${id}`,
  arch: (id: string) => `arch-${id}`,
  archTotal: "arch-total",
  postponed: "postponed-field",
  pickup: "pickup-field",
  decision: "decision-field",
  assumption: (i: number) => `assumption-${i}`,
  trip: "trip-field",
  challenge: "challenge-field",
  exportR2: "export-l3",
} as const;

export type MissingEntry = { id: string; label: string };

export function participantMissing(p: Persisted): MissingEntry[] {
  return p.participant.name.trim() ? [] : [{ id: IDS.participant, label: "Your full name is needed for the file name." }];
}

/** Everything still missing from the Behaviour Analysis File (Route 1), each with the element to jump to. */
export function l1Missing(p: Persisted): MissingEntry[] {
  const out = participantMissing(p);
  const { l1 } = p;
  const e = (id: string, label: string) => out.push({ id, label });
  for (const r of REASONS) if (l1.sort[r.id] === null) e(IDS.reason(r.id), `Block 1.1: “${r.quote.slice(0, 44)}…” is not sorted as Rational, Emotional or Both.`);
  if (l1.extraReason.trim().length < MIN_LINE) e(IDS.extraReason, `Block 1.1: add one reason of your own that is not in the debrief (at least ${MIN_LINE} characters).`);
  for (const f of ["F1", "F2", "F3"] as const) if (parseAmount(l1.felt[f]) === null) e(IDS.figure(f), `Block 1.2: ${f} has no figure.`);
  const role = l1.role.trim();
  if (!role) e(IDS.role, "Block 1.2: the sentence on what trust and risk did is empty.");
  else if (role.length < MIN_SENTENCE) e(IDS.role, `Block 1.2: the sentence needs at least ${MIN_SENTENCE} characters.`);
  else if (!citesFeltFigure(role)) e(IDS.role, "Block 1.2: the sentence states no figure from your felt-cost calculation.");
  l1.hyp.forEach((h, i) => {
    if (!h.mech) e(IDS.hyp(i), `Block 1.3: hypothesis ${i + 1} has no mechanism chosen.`);
    else if (l1.hyp.findIndex((g) => g.mech === h.mech) !== i) e(IDS.hyp(i), `Block 1.3: hypothesis ${i + 1} repeats a mechanism. Use a different one for each.`);
    const t = h.text.trim();
    if (!t) e(IDS.hyp(i), `Block 1.3: hypothesis ${i + 1} is empty.`);
    else if (t.length < HYP_MIN) e(IDS.hyp(i), `Block 1.3: hypothesis ${i + 1} needs at least ${HYP_MIN} characters.`);
    else if (!hasBecause(t)) e(IDS.hyp(i), `Block 1.3: hypothesis ${i + 1} gives no reason. Add “because …”.`);
  });
  const rf: [keyof typeof l1.reflect, string][] = [
    ["assume", "what assumption you made about the customer"],
    ["emotional", "where you underestimated emotional factors"],
    ["manager", "how an experienced sales manager would react"],
  ];
  for (const [k, what] of rf) if (l1.reflect[k].trim().length < MIN_LINE) e(IDS.reflect(k), `Block 1.4: say ${what} (at least ${MIN_LINE} characters).`);
  for (const n of EXIT_NOTES) if (l1.tags[n.id] === null) e(IDS.note(n.id), `Block 2.1: ${n.deal} (${n.sector}) has no barrier.`);
  l1.patterns.forEach((x, i) => {
    if (!x.barrier) e(IDS.pattern(i), `Block 2.2: pattern ${i + 1} has no barrier chosen.`);
    else if (l1.patterns.findIndex((g) => g.barrier === x.barrier) !== i) e(IDS.pattern(i), `Block 2.2: pattern ${i + 1} repeats “${BARRIERS[x.barrier].short}”. Name four different barriers.`);
    if (x.behaviour.trim().length < MIN_SENTENCE) e(IDS.pattern(i), `Block 2.2: pattern ${i + 1} needs what buyers do and why (at least ${MIN_SENTENCE} characters).`);
    if (!x.strength) e(IDS.pattern(i), `Block 2.2: pattern ${i + 1} has no strength rating.`);
  });
  if (l1.info.length < 2) e(IDS.info, "Block 2.2: choose at least two things the file does not tell you.");
  if (l1.infoText.trim().length < 20) e(IDS.infoText, "Block 2.2: write the one question you would ask the buyers (at least 20 characters).");
  if (l1.chosen.length !== CHOOSE) e(IDS.measurePick, `Block 2.3: choose exactly ${CHOOSE} measures (you have ${l1.chosen.length}).`);
  for (const id of l1.chosen) {
    const name = MEASURE_BY_ID[id].name;
    if (l1.aims[id] === undefined) e(IDS.measure(id), `Block 2.3: “${name}” has no barrier it acts on (or “none”).`);
    if (!l1.inf[id] || !l1.fea[id] || !l1.spd[id]) e(IDS.measure(id), `Block 2.3: “${name}” is not fully scored (influence, feasibility, speed).`);
  }
  if (l1.chosen.length === CHOOSE) {
    if (l1.order.length !== CHOOSE || !l1.chosen.every((id) => l1.order.includes(id))) e(IDS.order, "Block 2.3: put your three measures in a priority order.");
    if (l1.why.trim().length < 60) e(IDS.why, "Block 2.3: say why your first priority goes first (at least 60 characters).");
  }
  return out;
}

/** Everything still missing from the Decision Memo (Route 2). */
export function r2Missing(p: Persisted): MissingEntry[] {
  const out = participantMissing(p);
  const { r2 } = p;
  const e = (id: string, label: string) => out.push({ id, label });
  // Blocks 3.1, 3.2 and 3.4 are Optional (CLAUDE.md #29's pattern): for whoever has time, never listed as missing,
  // whatever state they are in. Blocks 3.3, 3.5 and 3.6 are Core and are checked below as before.
  if (r2.levers.length !== LEVER_CHOOSE) e(IDS.leverPick, `Block 3.3: choose exactly ${LEVER_CHOOSE} levers (you have ${r2.levers.length}).`);
  for (const id of r2.levers) {
    if (!(["reach", "depth", "durability", "scale"] as const).every((c) => !!r2.rate[`${id}.${c}`])) e(IDS.lever(id), `Block 3.3: “${LEVER_BY_ID[id].name}” is not rated on all four tests.`);
  }
  if (!r2.greatest) e(IDS.greatest, "Block 3.3: name the lever you see as the greatest psychological lever.");
  if (r2.greatestWhy.trim().length < 40) e(IDS.greatestWhy, "Block 3.3: say why it is the greatest lever (at least 40 characters).");
  const f = funded(r2);
  if (f.length === 0) e(IDS.archTotal, "Block 3.5: fund at least one item.");
  if (archOver(r2) > 0) e(IDS.archTotal, `Block 3.5: the funded items are ${euro(archOver(r2))} over the ${euro(R2_BUDGET)} budget.`);
  for (const id of f) {
    const name = LEVER_BY_ID[id].name;
    if (r2.start[id] == null) e(IDS.arch(id), `Block 3.5: “${name}” has no start month.`);
    if (!r2.owner[id]) e(IDS.arch(id), `Block 3.5: “${name}” has no owner.`);
    const t = (r2.trigger[id] ?? "").trim();
    if (t.length < 20) e(IDS.arch(id), `Block 3.5: “${name}” needs a trigger (at least 20 characters).`);
    else if (!hasNumber(t)) e(IDS.arch(id), `Block 3.5: the trigger of “${name}” names no number.`);
  }
  if (!archIds(r2).every((id) => r2.alloc[id])) {
    if (r2.postponed.trim().length < MIN_LINE) e(IDS.postponed, "Block 3.5: say what you leave out and why.");
    if (r2.pickup.trim().length < 15 || !hasNumber(r2.pickup)) e(IDS.pickup, "Block 3.5: give the pickup point: the number and the date at which you look at it again.");
  }
  if (!r2.decision) e(IDS.decision, "Block 3.6: choose your decision.");
  r2.assumptions.forEach((a, i) => {
    if (a.trim().length < MIN_LINE) e(IDS.assumption(i), `Block 3.6: assumption ${i + 1} is missing (at least ${MIN_LINE} characters).`);
  });
  if (!r2.tripKpi) e(IDS.trip, "Block 3.6: choose the metric of your tripwire.");
  if (parseAmount(r2.tripThreshold) === null) e(IDS.trip, "Block 3.6: give the tripwire a threshold.");
  if (!r2.tripMonth) e(IDS.trip, "Block 3.6: give the tripwire a month.");
  if (!r2.tripAction) e(IDS.trip, "Block 3.6: say what you do if the tripwire is missed.");
  if (r2.challenge.trim().length < 60) e(IDS.challenge, "Block 3.6: answer the board's challenge (at least 60 characters).");
  return out;
}
