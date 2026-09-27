import { BARRIERS, BARRIER_IDS } from "@/data/barriers";
import { REASONS, REASON_LABEL } from "@/data/debrief";
import { EXIT_NOTES, INFO_BY_ID, STRENGTH_LABEL } from "@/data/exitNotes";
import { RHEINWERK } from "@/data/feltCost";
import { HYP_LABEL } from "@/data/hypotheses";
import { BUDGET, MEASURE_BY_ID } from "@/data/measures";
import {
  DECISIONS,
  FACTORS,
  KPI_BY_ID,
  LEVER_BY_ID,
  LEVEL_LABEL,
  MODEL_PHASES,
  OWNERS,
  R2_BUDGET,
  RISK_BY_ID,
  archItems,
} from "@/data/route2";
import type { Criterion } from "@/data/route2";
import { archCost, archLeft, coverage, funded, leverTotal, measureScore, ownPoints, ownStrength, tallyOf, totalCost } from "@/lib/checks";
import { euro, num } from "@/lib/lang";
import { parseAmount } from "@/lib/parseAmount";
import { COURSE } from "@/lib/routes";
import { esc } from "@/lib/svg";
import type { Persisted } from "@/store/useStore";

/**
 * Each exported document is built here as a self-contained HTML string (inline CSS + inline SVG). The on-screen "Preview of your ..."
 * renders this same body, so what the participant reads is what they download. It never prints answer keys, ticks, crosses or scores
 * (a measure's Influence × Feasibility × Speed is the learner's own priority score, not a mark).
 */

const courseName = () => "Customer Retention & Buying Behaviour in B2B IT Sales";

export const DOC_CSS = `
.doc{font-family:Georgia,Cambria,"Times New Roman",serif;color:#1F2328;background:#FFFEFA;line-height:1.5;font-size:14px}
.doc *{box-sizing:border-box}
.doc h1{font-size:22px;margin:0 0 4px;font-weight:600}
.doc h2{font-size:15px;margin:22px 0 8px;padding-bottom:4px;border-bottom:1px solid #D8D1BF;font-weight:600;letter-spacing:.01em}
.doc h3{font-size:13.5px;margin:14px 0 4px;font-weight:600}
.doc .meta{display:grid;grid-template-columns:auto 1fr;gap:2px 14px;margin:12px 0 4px;font-family:system-ui,sans-serif;font-size:12.5px}
.doc .meta dt{color:#59606A}.doc .meta dd{margin:0}
.doc .kicker{font-family:system-ui,sans-serif;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#8A5A0B}
.doc table{width:100%;border-collapse:collapse;font-size:12.5px;font-family:system-ui,sans-serif}
.doc th{text-align:left;font-weight:600;color:#59606A;border-bottom:1px solid #59606A;padding:4px 8px 4px 0;font-size:11px;letter-spacing:.04em;text-transform:uppercase}
.doc td{border-bottom:1px solid #ECE6D6;padding:6px 8px 6px 0;vertical-align:top}
.doc td.num{text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums}
.doc td.id{font-weight:700}
.doc table{table-layout:auto}.doc td,.doc th{overflow-wrap:anywhere}
.doc blockquote{margin:6px 0;padding:6px 12px;border-left:3px solid #D99A2B;background:#FBF0D6}
.doc .box{border:1px solid #D8D1BF;padding:8px 12px;margin:8px 0;background:#fff}
.doc .muted{color:#59606A}
.doc .tag{display:inline-block;border:1px dashed #A4472A;color:#A4472A;border-radius:99px;padding:0 8px;font-family:system-ui,sans-serif;font-size:11px;margin-left:6px}
.doc .foot{margin-top:26px;padding-top:8px;border-top:1px solid #59606A;font-family:system-ui,sans-serif;font-size:12px;color:#59606A}
.doc .legend{font-family:system-ui,sans-serif;font-size:11.5px;color:#59606A;margin:4px 0 0}
.doc svg{display:block;margin:8px 0}
@media print{.doc{font-size:12px}.doc h2{break-after:avoid}.doc table,.doc svg,.doc blockquote{break-inside:avoid}}
`;

const dateLabel = () => new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

function header(title: string, level: string, p: Persisted): string {
  return `
<div class="kicker">${esc(courseName())} · ${esc(COURSE.company)}</div>
<h1>${esc(title)}</h1>
<dl class="meta">
  <dt>Course</dt><dd>${esc(courseName())} · Day ${COURSE.day}</dd>
  <dt>Position</dt><dd>${esc(level)}</dd>
  <dt>Participant</dt><dd>${esc(p.participant.name.trim() || "—")}</dd>
  <dt>Date</dt><dd>${esc(dateLabel())}</dd>
</dl>`;
}

const para = (s: string) => `<blockquote>${esc(s.trim()) || "—"}</blockquote>`;
const cell = (s: string) => esc(s.trim()) || "—";

export function wrapDocument(title: string, body: string): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<style>body{margin:0;background:#F3EFE4}.sheet{max-width:820px;margin:0 auto;padding:36px 40px;background:#FFFEFA}@media print{body{background:#fff}.sheet{padding:0;max-width:none}@page{margin:16mm}}${DOC_CSS}</style>
</head><body><div class="sheet"><div class="doc">${body}</div></div></body></html>`;
}

export function downloadHtml(filename: string, html: string) {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".html") ? filename : `${filename}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Opens the same document in a new window and prints it (no PDF library). Falls back to a hidden frame if pop-ups are blocked. */
export function printDocument(title: string, html: string) {
  const win = window.open("", "_blank");
  if (win) {
    win.document.open();
    win.document.write(html);
    win.document.close();
    win.document.title = title;
    win.focus();
    window.setTimeout(() => win.print(), 250);
    return;
  }
  const iframe = document.createElement("iframe");
  iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden";
  document.body.appendChild(iframe);
  const w = iframe.contentWindow;
  if (!w) return iframe.remove();
  w.document.open();
  w.document.write(html);
  w.document.close();
  window.setTimeout(() => {
    w.focus();
    w.print();
    window.setTimeout(() => iframe.remove(), 1000);
  }, 250);
}

/* ------------------------------------------------------------------ Route 1 · the Behaviour Analysis File */

/** Bars of the learner's own tally: notes (solid) and dropouts (dashed), as an inline SVG. */
function tallySvg(p: Persisted): string {
  const t = tallyOf(p.l1.tags);
  const W = 560;
  const rowH = 26;
  const rows = BARRIER_IDS.map((b, i) => {
    const y = 8 + i * rowH;
    const w = (t.count[b] / 6) * 220;
    const wd = (t.dropped[b] / 6) * 220;
    return `<text x="0" y="${y + 13}" font-size="11.5" fill="#1F2328" font-family="system-ui,sans-serif">${esc(BARRIERS[b].short)}</text>
<rect x="90" y="${y}" width="${Math.max(w, 1.5).toFixed(1)}" height="14" fill="#2F5D62" stroke="#1F2328"/>
${t.dropped[b] > 0 ? `<rect x="${(90 + w).toFixed(1)}" y="${y}" width="${wd.toFixed(1)}" height="14" fill="#FBF0D6" stroke="#8A5A0B" stroke-dasharray="4 3"/>` : ""}
<text x="${(96 + w + wd).toFixed(1)}" y="${y + 12}" font-size="11.5" fill="#1F2328" font-family="system-ui,sans-serif">${t.count[b]} note${t.count[b] === 1 ? "" : "s"} · ${t.dropped[b]} dropped</text>`;
  }).join("\n");
  const H = 8 + BARRIER_IDS.length * rowH;
  const title = "Notes tagged with each barrier, and how many of them dropped out, as you tagged them";
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${esc(title)}"><title>${esc(title)}</title>${rows}</svg>`;
}

export function behaviourBody(p: Persisted): string {
  const { l1 } = p;
  const t = tallyOf(l1.tags);

  const sortRows = REASONS.map((r, i) => `<tr><td class="id">${i + 1}</td><td>“${esc(r.quote)}”</td><td>${l1.sort[r.id] ? esc(REASON_LABEL[l1.sort[r.id]!]) : "—"}</td></tr>`).join("");
  const sortNote = l1.sortReasoning ? `<p class="legend">The reasoning for the sort was opened after ${l1.sortChecks} checks.</p>` : "";

  const felt = (v: string) => (v.trim() ? esc(v.trim()) : "—");
  const feltTable = `<table><thead><tr><th>Figure</th><th class="num">Your figure (€ per year)</th></tr></thead><tbody>
<tr><td class="id">F1 · Felt cost, ${esc(RHEINWERK.A.name)}</td><td class="num">${felt(l1.felt.F1)}</td></tr>
<tr><td class="id">F2 · Felt cost, ${esc(RHEINWERK.B.name)}</td><td class="num">${felt(l1.felt.F2)}</td></tr>
<tr><td class="id">F3 · Felt gap (Provider A minus Provider B)</td><td class="num">${felt(l1.felt.F3)}</td></tr></tbody></table>
<p class="legend">As briefed: ${esc(RHEINWERK.A.name)} ${euro(RHEINWERK.A.price)} a year, chance it goes wrong ${RHEINWERK.A.chance}%; ${esc(RHEINWERK.B.name)} ${euro(RHEINWERK.B.price)}, ${RHEINWERK.B.chance}%; cost to the buyer if it goes wrong ${euro(RHEINWERK.loss)}; loss weight 2 (Case assumption).</p>`;

  const hyps = l1.hyp
    .map((h, i) => `<h3>Hypothesis ${i + 1} · ${h.mech ? esc(HYP_LABEL[h.mech]) : "—"}</h3>${para(h.text)}`)
    .join("");

  const tagRows = EXIT_NOTES.map((n) => `<tr><td class="id">${esc(n.deal)}</td><td>${esc(n.sector)} · ${esc(n.stage)} · ${n.outcome === "dropped" ? "dropped out" : "delayed"}</td><td>${l1.tags[n.id] ? esc(BARRIERS[l1.tags[n.id]!].label) : "—"}</td></tr>`).join("");
  const tallyRows = BARRIER_IDS.map((b) => {
    const pts = ownPoints(b, t);
    return `<tr><td class="id">${esc(BARRIERS[b].label)}</td><td class="num">${t.count[b]}</td><td class="num">${t.dropped[b]}</td><td class="num">${pts}</td><td>${esc(STRENGTH_LABEL[ownStrength(b, t)])}</td></tr>`;
  }).join("");
  const tagNote = l1.tagReasoning ? `<p class="legend">The reasoning for the tagging was opened after ${l1.tagChecks} checks.</p>` : "";

  const patRows = l1.patterns
    .map((x, i) => `<tr><td class="id">${i + 1} · ${x.barrier ? esc(BARRIERS[x.barrier].label) : "—"}</td><td>${cell(x.behaviour)}</td><td>${x.strength ? esc(STRENGTH_LABEL[x.strength]) : "—"}</td></tr>`)
    .join("");
  const infoList = l1.info.length ? `<ul>${l1.info.map((i) => `<li>${esc(INFO_BY_ID[i].label)}</li>`).join("")}</ul>` : `<p class="muted">—</p>`;

  const chosen = l1.chosen;
  const measureRows = chosen
    .map((id) => {
      const m = MEASURE_BY_ID[id];
      const aims = l1.aims[id];
      return `<tr><td class="id">${esc(m.name)}</td><td>${aims === undefined ? "—" : aims.length ? esc(aims.map((a) => BARRIERS[a].short).join(", ")) : "none of the six"}</td><td class="num">${l1.inf[id] || "—"} × ${l1.fea[id] || "—"} × ${l1.spd[id] || "—"} = ${measureScore(l1, id) || "—"}</td><td class="num">${esc(euro(m.cost))} · ${m.weeks} wk</td></tr>`;
    })
    .join("");
  const cov = coverage(l1);
  const covLine = cov.length
    ? `Barriers named in 2.2 that at least one chosen measure acts on: ${cov.filter((c) => c.covered).length} of ${cov.length}${cov.some((c) => !c.covered) ? ` (not reached: ${esc(cov.filter((c) => !c.covered).map((c) => BARRIERS[c.barrier].short).join(", "))})` : ""}.`
    : "";
  const cost = totalCost(chosen);
  const order = l1.order.filter((id) => chosen.includes(id));

  return `${header("Behaviour Analysis File", "Levels 1 and 2 · Knowledge and application", p)}
<h2>The case</h2>
<p>SecureIT Systems GmbH has many prospects and a high abandonment rate shortly before contracts are closed; customers delay their decisions. Budget €100,000, time 3 months. Evidence in the file: the debrief after the Rheinwerk Logistik deal and twelve exit notes.</p>

<h2>Part 1 · Understand the decision</h2>
<h3>1.1 · What the buyer said, sorted</h3>
<table><thead><tr><th>#</th><th>Statement</th><th>Your tag</th></tr></thead><tbody>${sortRows}</tbody></table>${sortNote}
<h3>A reason of my own, not in the debrief</h3>${para(l1.extraReason)}
<h3>1.2 · What trust and risk did</h3>
${feltTable}
${para(l1.role)}
<h2>1.3 · Three hypotheses about decision behaviour</h2>
${hyps}
<h2>1.4 · Coaching reflection</h2>
<h3>What assumption did I make about customers?</h3>${para(l1.reflect.assume)}
<h3>Where did I underestimate emotional factors?</h3>${para(l1.reflect.emotional)}
<h3>How would an experienced sales manager react?</h3>${para(l1.reflect.manager)}

<h2>Part 2 · Analyse and act</h2>
<h3>2.1 · The twelve exit notes, as you tagged them</h3>
<table><thead><tr><th>Deal</th><th>Where it stood</th><th>Barrier</th></tr></thead><tbody>${tagRows}</tbody></table>${tagNote}
${tallySvg(p)}
<table><thead><tr><th>Barrier</th><th class="num">Notes</th><th class="num">Dropped out</th><th class="num">Points</th><th>Strength</th></tr></thead><tbody>${tallyRows}</tbody></table>
<p class="legend">Points = notes + dropouts. 5 or more is High, 3 to 4 is Mid, 2 or fewer is Low. Counts follow your own tags.</p>
<h2>2.2 · The four patterns</h2>
<table><thead><tr><th>Barrier</th><th>What buyers do, and why</th><th>Strength</th></tr></thead><tbody>${patRows}</tbody></table>
<h3>What the file does not tell you</h3>${infoList}
<h3>The one question I would ask the buyers</h3>${para(l1.infoText)}
<h2>2.3 · Three measures, scored and ordered</h2>
<table><thead><tr><th>Measure</th><th>Acts on</th><th class="num">Influence × Feasibility × Speed</th><th class="num">Cost · weeks</th></tr></thead><tbody>${measureRows || `<tr><td colspan="4">—</td></tr>`}</tbody></table>
<p class="legend">Total cost ${esc(euro(cost))} of the ${esc(euro(BUDGET))} budget${cost > BUDGET ? ` (${esc(euro(cost - BUDGET))} over)` : ""}. ${covLine}</p>
<h3>Priority order</h3>
<ol>${order.map((id) => `<li>${esc(MEASURE_BY_ID[id].name)}</li>`).join("") || "<li>—</li>"}</ol>
${para(l1.why)}

<div class="foot">Checks requested: ${l1.checks}<br/>Generated ${esc(dateLabel())}.</div>`;
}

/* ------------------------------------------------------------------ Route 2 · the Decision Memo */

/** The Level 3 memo. The on-screen live preview and the exported file are both built by this function. */
export function memoBody(p: Persisted): string {
  const { l1, r2 } = p;
  const name = p.participant.name.trim();

  const patterns = l1.patterns.filter((x) => x.barrier).map((x) => BARRIERS[x.barrier!].short);
  const situation =
    patterns.length || l1.chosen.length
      ? `<blockquote><strong>Where Route 1 left off.</strong> Patterns you named: ${esc(patterns.join(", ") || "—")}. Measures you chose: ${esc(l1.chosen.map((id) => MEASURE_BY_ID[id].name).join(", ") || "—")}.</blockquote>`
      : `<p class="muted">Route 1 is not finished, so there is nothing to quote yet. Nothing is blocked.</p>`;

  const factorRows = r2.factors.map((f) => `<tr><td class="id">${esc(FACTORS[f].name)}</td><td>${cell(r2.factorText[f] ?? "")}</td></tr>`).join("");
  const modelRows = MODEL_PHASES.map((ph) => {
    const m = r2.model[ph.id];
    const q = ph.questions.find((x) => x.id === m.question)?.label;
    const s = ph.signals.find((x) => x.id === m.signal)?.label;
    return `<tr><td class="id">${esc(ph.name)}</td><td>${cell(q ?? "")}</td><td>${m.factor ? esc(FACTORS[m.factor].name) : "—"}</td><td>${cell(s ?? "")}</td><td>${cell(m.move)}</td></tr>`;
  }).join("");

  const crit: Criterion[] = ["reach", "depth", "durability", "scale"];
  const leverRows = r2.levers
    .map((id) => {
      const l = LEVER_BY_ID[id];
      return `<tr><td class="id">${esc(l.name)}</td><td>${esc(LEVEL_LABEL[l.level])}</td>${crit.map((c) => `<td class="num">${r2.rate[`${id}.${c}`] || "—"}</td>`).join("")}<td class="num">${leverTotal(r2, id)} of 12</td></tr>`;
    })
    .join("");
  const greatest = r2.greatest ? LEVER_BY_ID[r2.greatest].name : "—";

  const riskRows = r2.risks
    .map((id) => {
      const r = RISK_BY_ID[id];
      const sig = r.signals.find((x) => x.id === r2.riskSignal[id])?.label;
      const lik = ["", "low", "mid", "high"][r2.riskLik[id] || 0] || "—";
      const imp = ["", "low", "mid", "high"][r2.riskImp[id] || 0] || "—";
      return `<tr><td class="id">${esc(r.name)}</td><td>${lik} / ${imp}</td><td>${cell(sig ?? "")}</td><td>${cell(r2.riskResponse[id] ?? "")}</td></tr>`;
    })
    .join("");

  const items = archItems(r2.levers);
  const fundedIds = funded(r2);
  const archRows = items
    .map((id) => {
      const on = !!r2.alloc[id];
      return `<tr><td class="id">${esc(LEVER_BY_ID[id].name)}</td><td>${on ? "funded" : "not funded"}</td><td class="num">${on ? esc(euro(LEVER_BY_ID[id].cost)) : "—"}</td><td class="num">${on && r2.start[id] != null ? `month ${r2.start[id]}` : "—"}</td><td>${on && r2.owner[id] ? esc(OWNERS[r2.owner[id]!].name) : "—"}</td><td>${on ? cell(r2.trigger[id] ?? "") : "—"}</td></tr>`;
    })
    .join("");
  const d = DECISIONS.find((x) => x.id === r2.decision);
  const k = r2.tripKpi ? KPI_BY_ID[r2.tripKpi] : null;
  const thr = parseAmount(r2.tripThreshold);
  const action = { "": "—", scale: "scale to all segments", adjust: "adjust one lever", stop: "stop and reconsider" }[r2.tripAction];

  return `${header("Decision Memo", "Level 3 · Management decision", p)}
<p class="muted">To: the board · From: ${esc(name || "Chief Sales Officer")}, SecureIT Systems GmbH · Budget ${esc(euro(R2_BUDGET))} over 6 months.</p>
<h2>1 · Situation</h2>
<p>Customers decide slowly, the market is uncertain, competition is strong, the budget is limited and customer needs are not fully known.</p>
${situation}
<h2>2 · Central influencing factors</h2>
<table><thead><tr><th>Factor</th><th>How it shows up in a SecureIT deal, and how we notice it</th></tr></thead><tbody>${factorRows || `<tr><td colspan="2">—</td></tr>`}</tbody></table>
<h2>3 · The model of the buying decision</h2>
<table><thead><tr><th>Phase</th><th>The buyer's question</th><th>Dominant factor</th><th>Signal</th><th>What our system does</th></tr></thead><tbody>${modelRows}</tbody></table>
<h2>4 · Three strategic levers</h2>
<table><thead><tr><th>Lever</th><th>Level</th><th class="num">Reach</th><th class="num">Depth</th><th class="num">Durability</th><th class="num">Scale</th><th class="num">Total</th></tr></thead><tbody>${leverRows || `<tr><td colspan="7">—</td></tr>`}</tbody></table>
<p><strong>Greatest psychological lever:</strong> ${esc(greatest)}</p>${para(r2.greatestWhy)}
<h2>5 · Risk analysis: what if we misjudge the customer</h2>
<table><thead><tr><th>Risk</th><th>Likelihood / impact</th><th>Early-warning signal</th><th>Response</th></tr></thead><tbody>${riskRows || `<tr><td colspan="4">—</td></tr>`}</tbody></table>
<h2>6 · The measures architecture</h2>
<table><thead><tr><th>Item</th><th>Status</th><th class="num">Cost</th><th class="num">Start</th><th>Owner</th><th>Trigger</th></tr></thead><tbody>${archRows}</tbody></table>
<p class="legend">Funded ${esc(euro(archCost(r2)))} of ${esc(euro(R2_BUDGET))} (${esc(euro(archLeft(r2)))} left) across ${fundedIds.length} item${fundedIds.length === 1 ? "" : "s"}.</p>
${items.every((id) => r2.alloc[id]) ? "" : `<h3>Left out, and when we look again</h3>${para(r2.postponed)}<p><strong>Pickup point:</strong> ${cell(r2.pickup)}</p>`}
<h2>7 · The decision</h2>
<p><strong>${d ? esc(d.label) : "—"}</strong>${d ? ` — ${esc(d.detail)}` : ""}</p>
<h3>What this decision rests on</h3>
<ol>${r2.assumptions.map((a) => `<li>${cell(a)}</li>`).join("")}</ol>
<h3>Tripwire</h3>
<p>${k ? esc(k.label) : "—"} reaches <strong>${thr !== null && k ? `${num(thr)}${k.unit === "%" ? "%" : ` ${k.unit}`}` : "—"}</strong> by month ${r2.tripMonth ?? "—"} (today: ${k ? `${k.baseline}${k.unit === "%" ? "%" : ` ${k.unit}`}` : "—"}). If it is missed: ${esc(action)}.</p>
<h3>If customers react the opposite way in month 2</h3>${para(r2.challenge)}

<div class="foot">Checks requested: ${r2.checks}<br/>Generated ${esc(dateLabel())}.</div>`;
}

