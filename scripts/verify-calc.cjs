/**
 * Re-derives every figure and every rule the day rests on, from the same data files the site uses, and compares them with the
 * results briefed in the README. Run: npm run verify:calc. A failed line prints FAIL and the process exits with code 1.
 *
 * The data files are TypeScript with "@/" imports, so a tiny loader transpiles them on the fly (no test framework, no extra dependency).
 */
const path = require("path");
const fs = require("fs");
const Module = require("module");
const ts = require(path.join(process.cwd(), "node_modules", "typescript"));

const root = process.cwd();
const origResolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  if (request.startsWith("@/")) {
    const base = path.join(root, request.slice(2));
    for (const ext of [".ts", ".tsx", "/index.ts"]) if (fs.existsSync(base + ext)) return base + ext;
  }
  return origResolve.call(this, request, ...rest);
};
require.extensions[".ts"] = function (module, filename) {
  const out = ts.transpileModule(fs.readFileSync(filename, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } });
  module._compile(out.outputText, filename);
};

let failed = 0;
const ok = (name, cond, detail = "") => {
  console.log(`${cond ? "ok  " : "FAIL"}  ${name}${detail ? "  " + detail : ""}`);
  if (!cond) failed++;
};
const eq = (name, a, b) => ok(name, JSON.stringify(a) === JSON.stringify(b), `got ${JSON.stringify(a)}, want ${JSON.stringify(b)}`);

const felt = require("@/data/feltCost");
const notes = require("@/data/exitNotes");
const measures = require("@/data/measures");
const r2 = require("@/data/route2");
const debrief = require("@/data/debrief");
const key = require("@/data/mentorKey");
const checks = require("@/lib/checks");
const calc = require("@/lib/calcBuilder");

console.log("\nBlock 1.2 · the felt cost (price + weight × chance × loss)");
eq("F1 felt cost of SecureIT", felt.FELT.A, 80000 + 2 * 0.12 * 150000);
eq("F1 = 116,000", felt.FELT.A, 116000);
eq("F2 = 108,000", felt.FELT.B, 108000);
eq("F3 = 8,000 (B feels cheaper)", felt.FELT.gap, 8000);
eq("price gap = 16,000 (B is dearer)", felt.FELT.priceGap, 16000);
eq("risk terms 36,000 and 12,000", [felt.FELT.riskA, felt.FELT.riskB], [36000, 12000]);
eq("builder F1 result", calc.FIGURE_BUILDERS.F1.compute({ price: 80000, chance: 12, loss: 150000, weight: 2 }), 116000);
eq("builder F3 result", calc.FIGURE_BUILDERS.F3.compute({ a: 116000, b: 108000 }), 8000);
ok("a sentence citing 8,000 is accepted", checks.citesFeltFigure("Sentinel feels €8,000 cheaper."));
ok("a sentence citing only the price is not", !checks.citesFeltFigure("Sentinel is better known and costs €96,000."));

console.log("\nMateri A3 worked example (Hansawerk) flips with the loss weight");
eq("weight 2: X 68,000, Y 63,400", [felt.HANSA_FELT.X, felt.HANSA_FELT.Y], [68000, 63400]);
ok("weight 1: X feels cheaper than Y", felt.feltCost(50000, 10, 90000, 1) < felt.feltCost(58000, 3, 90000, 1));

console.log("\nBlock 1.1 · the debrief");
eq("truth counts rational/emotional/both", debrief.REASON_TRUTH_COUNTS, { rational: 3, emotional: 3, both: 2 });
eq("model sort holds 8 of 8", checks.sortHolds(key.KEY_L1.sort), { holds: 8, placed: 8 });

console.log("\nBlocks 2.1 and 2.2 · the exit notes");
eq("twelve notes", notes.EXIT_NOTES.length, 12);
eq("counts fear/trust/proof/inertia/overload/owner", notes.TRUTH_COUNTS, { fear: 3, trust: 3, proof: 2, inertia: 1, overload: 2, owner: 1 });
eq("dropouts", notes.TRUTH_DROPPED, { fear: 2, trust: 2, proof: 1, inertia: 0, overload: 0, owner: 1 });
const strengths = Object.fromEntries(Object.keys(notes.TRUTH_COUNTS).map((b) => [b, notes.strengthOf(notes.strengthPoints(notes.TRUTH_COUNTS[b], notes.TRUTH_DROPPED[b]))]));
eq("strength by the rule", strengths, { fear: "high", trust: "high", proof: "mid", inertia: "low", overload: "low", owner: "low" });
const tally = checks.tallyOf(key.KEY_L1.tags);
eq("own tally of the model tags = the reference counts", tally.count, notes.TRUTH_COUNTS);
eq("central barriers are exactly the four with 2+ notes", ["fear", "trust", "proof", "inertia", "overload", "owner"].filter((b) => checks.isCentral(b, tally)).sort(), ["fear", "overload", "proof", "trust"]);
const l1 = { ...key.KEY_L1, tags: key.KEY_L1.tags, patterns: key.KEY_L1.patterns, chosen: key.KEY_L1.chosen, aims: key.KEY_L1.aims, inf: key.KEY_L1.inf, fea: key.KEY_L1.fea, spd: key.KEY_L1.spd, order: key.KEY_L1.order };
const pc = checks.patternCheck(l1);
eq("model patterns: 4 barriers and 4 ratings hold", [pc.barrier, pc.strength], [4, 4]);
eq("model tags hold 12 of 12", checks.tagHolds(key.KEY_L1.tags), { holds: 12, placed: 12 });
eq("model information picks all useful", checks.infoHolds(key.KEY_L1.info), { holds: 3, chosen: 3 });

console.log("\nBlock 2.3 · the measures (influence × feasibility × speed, budget 100,000, 3 months)");
const scores = Object.fromEntries(measures.MEASURES.map((m) => [m.id, measures.modelScore(m.id)]));
eq("scores", scores, { refs: 18, guarantee: 18, partner: 18, decision: 12, checkup: 1, discount: 9, countdown: 9, webinar: 3, champion: 9 });
eq("speed rule by weeks", measures.MEASURES.map((m) => measures.speedBucket(m.weeks)), [2, 3, 3, 2, 1, 3, 3, 1, 3]);
eq("model three cost 84,000", measures.MODEL_COST, 84000);
ok("all four working measures exceed the budget", measures.WORKING_FOUR_COST > measures.BUDGET, `(${measures.WORKING_FOUR_COST})`);
ok("the model three fit the budget", measures.MODEL_COST <= measures.BUDGET);
ok("the model three are the top three by score", measures.MODEL_MEASURES.every((id) => scores[id] === 18));
ok("every model aim holds", key.KEY_L1.chosen.every((id) => checks.aimsHold(id, key.KEY_L1.aims[id])));
ok("every model speed holds", key.KEY_L1.chosen.every((id) => checks.speedHolds(id, key.KEY_L1.spd[id])));
ok("a decoy with aims chosen does not hold", !checks.aimsHold("discount", ["trust"]));
ok("a decoy with no aims holds", checks.aimsHold("discount", []));
eq("no order inversions in the model order", checks.orderInversions(l1).length, 0);
eq("the model measures cover all four patterns", checks.coverage(l1).every((c) => c.covered), true);

console.log("\nRoute 2 · levers, risks, architecture, decision");
const rate = {};
ok("model ratings respect the printed limits", r2.MODEL_LEVERS.every((id) => ["reach", "depth", "durability", "scale"].every((c) => r2.LEVER_BY_ID[id].model[c] <= r2.maxRating(id, c))));
ok("every lever's own model ratings respect its limits", r2.LEVERS.every((l) => ["reach", "depth", "durability", "scale"].every((c) => l.model[c] <= r2.maxRating(l.id, c))));
eq("model levers are all systemic", r2.MODEL_LEVERS.every(r2.isSystemic), true);
eq("lever totals", Object.fromEntries(r2.LEVERS.map((l) => [l.id, r2.leverModelTotal(l.id)])), { "reference-kit": 11, "safety-terms": 12, "deal-partner": 7, "decision-kit": 11, training: 8, signals: 10, discount: 6, urgency: 8 });
eq("model risks are all psychology risks", checks.psychologyCount(r2.MODEL_RISKS), 3);
eq("two decoy risks are not psychology", r2.RISKS.filter((r) => !r.psychology).length, 2);
const modelArchCost = r2.MODEL_ARCH.reduce((s, id) => s + r2.LEVER_BY_ID[id].cost, 0);
eq("model architecture costs 115,000", modelArchCost, 115000);
ok("model architecture fits 120,000", modelArchCost <= r2.R2_BUDGET);
ok("adding the training would exceed the budget", modelArchCost + r2.LEVER_BY_ID.training.cost > r2.R2_BUDGET);
const r2s = {
  levers: key.KEY_R2.levers,
  alloc: Object.fromEntries(key.KEY_R2.arch.map((id) => [id, true])),
  start: key.KEY_R2.start,
  rate: key.KEY_R2.rate,
  model: key.KEY_R2.model,
  factors: key.KEY_R2.factors,
  risks: key.KEY_R2.risks,
  riskSignal: key.KEY_R2.riskSignal,
  tripKpi: key.KEY_R2.tripKpi,
  tripThreshold: key.KEY_R2.tripThreshold,
};
eq("model factors include trust and risk", checks.factorsHold(r2s), { trust: true, risk: true });
eq("model control model: 9 of 9", checks.modelHolds(r2s).holds, 9);
eq("model ratings: none flagged", checks.ratingFlags(r2s), []);
eq("model signals: none flagged", checks.signalFlags(r2s), []);
eq("model sequence: baseline and budget hold", (({ baseline, budget }) => [baseline, budget])(checks.seqRules(r2s)), [true, true]);
eq("model tripwire: nothing flagged", checks.tripFlags(r2s), []);
eq("the activity metric is flagged", checks.tripFlags({ tripKpi: "emails", tripThreshold: "20" }).includes("kpi"), true);
eq("a threshold at the baseline is flagged", checks.tripFlags({ tripKpi: "signature", tripThreshold: "60" }).includes("threshold"), true);
ok("every model owner is an accepted owner", key.KEY_R2.arch.every((id) => r2.OWNER_ACCEPT[id].includes(key.KEY_R2.owner[id])));
ok("every model trigger names a number", key.KEY_R2.arch.every((id) => /\d/.test(key.KEY_R2.trigger[id])));

console.log("\nMateri B3 regret table (Elbtal, € thousand)");
const pay = { commit: [240, 60, -90], stage: [170, 60, -10], wait: [-30, -30, -30] };
const best = [0, 1, 2].map((j) => Math.max(...Object.values(pay).map((p) => p[j])));
const worst = Object.fromEntries(Object.entries(pay).map(([k, p]) => [k, Math.max(...p.map((v, j) => best[j] - v))]));
eq("worst regret", worst, { commit: 80, stage: 70, wait: 270 });
const ev = (p, q) => ((1 - q) / 2) * (p[0] + p[1]) + q * p[2];
ok("crossover of commit and stage at about 30%", Math.abs((150 - 115) / (240 - 125) - 0.3043) < 0.001);
ok("stage beats commit above 30%, commit beats stage below", ev(pay.stage, 0.4) > ev(pay.commit, 0.4) && ev(pay.commit, 0.2) > ev(pay.stage, 0.2));

console.log(failed ? `\n${failed} check(s) FAILED` : "\nAll checks passed.");
process.exit(failed ? 1 : 0);
