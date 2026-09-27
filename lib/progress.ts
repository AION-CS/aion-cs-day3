import { MATERIALS } from "@/data/materialIndex";
import type { MaterialId } from "@/data/materialIndex";
import { HYP_MIN, hasBecause } from "@/data/hypotheses";
import { NOTE_IDS } from "@/data/exitNotes";
import { REASON_IDS } from "@/data/debrief";
import { LEVER_CHOOSE, PHASE_IDS, RISK_CHOOSE } from "@/data/route2";
import { CHOOSE } from "@/data/measures";
import { archIds, archOver, citesFeltFigure, funded, hasNumber } from "@/lib/checks";
import type { RouteNo } from "@/lib/routes";
import { parseAmount } from "@/lib/parseAmount";
import type { Persisted } from "@/store/useStore";

export type TaskBlockId = "b11" | "b12" | "b13" | "b14" | "b21" | "b22" | "b23" | "b31" | "b32" | "b33" | "b34" | "b35" | "b36";

const len = (t: string) => t.trim().length;
export const MIN_SENTENCE = 40;
export const MIN_LINE = 30;

/** Which task blocks are complete. Complete means filled in, never correct. */
export function taskBlocks(p: Persisted): Record<TaskBlockId, boolean> {
  const { l1, r2 } = p;
  const hypOk = l1.hyp.every((h, i) => !!h.mech && h.text.trim().length >= HYP_MIN && hasBecause(h.text) && l1.hyp.findIndex((g) => g.mech === h.mech) === i);
  const patternsOk =
    l1.patterns.every((x, i) => !!x.barrier && !!x.strength && len(x.behaviour) >= MIN_SENTENCE && l1.patterns.findIndex((g) => g.barrier === x.barrier) === i) &&
    l1.info.length >= 2 &&
    len(l1.infoText) >= 20;
  const measuresOk =
    l1.chosen.length === CHOOSE &&
    l1.chosen.every((id) => l1.aims[id] !== undefined && !!l1.inf[id] && !!l1.fea[id] && !!l1.spd[id]) &&
    l1.order.length === CHOOSE &&
    l1.chosen.every((id) => l1.order.includes(id)) &&
    len(l1.why) >= 60;
  const f = funded(r2);
  const items = archIds(r2);
  const archOk =
    f.length > 0 &&
    archOver(r2) === 0 &&
    f.every((id) => r2.start[id] != null && !!r2.owner[id] && len(r2.trigger[id] ?? "") >= 20 && hasNumber(r2.trigger[id] ?? "")) &&
    (items.every((id) => r2.alloc[id]) || (len(r2.postponed) >= MIN_LINE && len(r2.pickup) >= 15 && hasNumber(r2.pickup)));
  return {
    b11: REASON_IDS.every((id) => l1.sort[id] !== null) && len(l1.extraReason) >= MIN_LINE,
    b12: (["F1", "F2", "F3"] as const).every((k) => parseAmount(l1.felt[k]) !== null) && len(l1.role) >= MIN_SENTENCE && citesFeltFigure(l1.role),
    b13: hypOk,
    b14: len(l1.reflect.assume) >= MIN_LINE && len(l1.reflect.emotional) >= MIN_LINE && len(l1.reflect.manager) >= MIN_LINE,
    b21: NOTE_IDS.every((id) => l1.tags[id] !== null),
    b22: patternsOk,
    b23: measuresOk,
    b31: r2.factors.length === 3 && r2.factors.every((k) => len(r2.factorText[k] ?? "") >= MIN_LINE),
    b32: PHASE_IDS.every((id) => !!r2.model[id].question && !!r2.model[id].factor && !!r2.model[id].signal && len(r2.model[id].move) >= MIN_LINE),
    b33:
      r2.levers.length === LEVER_CHOOSE &&
      r2.levers.every((id) => (["reach", "depth", "durability", "scale"] as const).every((c) => !!r2.rate[`${id}.${c}`])) &&
      !!r2.greatest &&
      len(r2.greatestWhy) >= 40,
    b34:
      r2.risks.length === RISK_CHOOSE &&
      r2.risks.every((id) => !!r2.riskLik[id] && !!r2.riskImp[id] && !!r2.riskSignal[id] && len(r2.riskResponse[id] ?? "") >= MIN_LINE && hasNumber(r2.riskResponse[id] ?? "")),
    b35: archOk,
    b36:
      !!r2.decision &&
      r2.assumptions.every((a) => len(a) >= MIN_LINE) &&
      !!r2.tripKpi &&
      parseAmount(r2.tripThreshold) !== null &&
      !!r2.tripMonth &&
      !!r2.tripAction &&
      len(r2.challenge) >= 60,
  };
}

/**
 * Route 2 marks three of its six task blocks Optional (3.1, 3.2, 3.4): for whoever has time, never required,
 * never counted toward the "Dossier" ring or listed as missing (`lib/missing.ts`). Its material card B4 is used
 * only by the Optional Block 3.4, so it is Optional too and stays out of the ring's total the same way; B1, B2,
 * B3 and B5 are each drawn on by a Core block (3.3 or 3.5 or 3.6) and so stay counted, required and always shown.
 */
const BLOCKS_OF: Record<RouteNo, TaskBlockId[]> = {
  1: ["b11", "b12", "b13", "b14", "b21", "b22", "b23"],
  2: ["b33", "b35", "b36"],
};
const R2_OPTIONAL_MATERIAL: MaterialId[] = ["B4"];

/** Dossier progress for one route: its cards marked read + its task blocks completed. Route 2's Optional card and blocks are left out of the total (they are never required), so the ring reflects what a complete export needs. */
export function dossierProgress(p: Persisted, route: RouteNo): { done: number; total: number } {
  const block = route === 1 ? "A" : "B";
  const optionalMaterial: MaterialId[] = route === 2 ? R2_OPTIONAL_MATERIAL : [];
  const cards = MATERIALS.filter((m) => m.block === block && !optionalMaterial.includes(m.id));
  const read = cards.filter((m) => p.ui.sectionsRead[m.id]).length;
  const tb = taskBlocks(p);
  const done = BLOCKS_OF[route].filter((b) => tb[b]).length;
  return { done: read + done, total: cards.length + BLOCKS_OF[route].length };
}
