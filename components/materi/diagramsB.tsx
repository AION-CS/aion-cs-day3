"use client";

import { useId, useState } from "react";
import clsx from "clsx";
import { Bul, Insight, Toggles } from "@/components/materi/kit";
import { euro, euroSigned } from "@/lib/lang";
import { Gloss } from "@/lib/glossify";

/**
 * The interactive diagrams of Materi B (Route 2). Every one uses a worked-example company (Elbtal Systems), never SecureIT
 * levers or risks from the task menu, so the answer to a block is never printed. Numbers are Case assumptions.
 */

const C = { ink: "#1F2328", ash: "#59606A", paper: "#FFFEFA", mist: "#ECE6D6", line: "#D8D1BF", amber: "#8A5A0B", gold: "#D99A2B", teal: "#0F6B6B", tealSoft: "#DFEEEB", rust: "#A4472A", data: "#2F5D62", grey: "#8B9098", soft: "#FBF0D6" };

/* ------------------------------------------------------------------ B1 · the ladder of intervention */

type Level = "argument" | "interaction" | "process" | "structure";
const LADDER: { id: Level; name: string; what: string; example: string; stays: number; cost: string; leaves: string }[] = [
  {
    id: "argument",
    name: "Argument",
    what: "What the seller says: the pitch, the deck, the offer's wording.",
    example: "Elbtal rewrites its pitch to lead with the detection rate.",
    stays: 10,
    cost: "Repeats with every conversation.",
    leaves: "It leaves with the seller who uses it. A new seller starts from the old pitch.",
  },
  {
    id: "interaction",
    name: "Interaction",
    what: "How a person behaves in a deal: a named contact, a personal call, a coaching habit.",
    example: "A named Elbtal engineer joins each big deal in person.",
    stays: 25,
    cost: "Repeats with every deal and every person.",
    leaves: "It leaves with the person. The buyer's trust was in that engineer, not in the company.",
  },
  {
    id: "process",
    name: "Process",
    what: "How the buying process is built: the steps every deal goes through, whoever sells.",
    example: "Every Elbtal proposal contains two matching references and a one-page decision paper.",
    stays: 80,
    cost: "A one-off set-up, then a small cost per deal.",
    leaves: "It stays. The step happens because the process demands it, not because the seller remembers.",
  },
  {
    id: "structure",
    name: "Structure",
    what: "The rules, measures and defaults that decide what the process does: contract standards, targets, what is reviewed.",
    example: "Exit terms are part of Elbtal's standard contract, and a weekly review reads the buyer's signals.",
    stays: 95,
    cost: "A one-off set-up and a standing routine.",
    leaves: "It stays. The rule applies to every deal, and a new seller inherits it.",
  },
];

export function InterventionLadder() {
  const uid = useId().replace(/:/g, "");
  const [sel, setSel] = useState<Level>("process");
  const [gone, setGone] = useState(false);
  const cur = LADDER.find((l) => l.id === sel)!;
  const x = (i: number) => 20 + i * 132;
  return (
    <div className="space-y-3">
      <svg viewBox="0 0 560 230" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{`Four levels of intervention and how much of the effect stays`}</title>
        <desc id={`${uid}-d`}>{LADDER.map((l) => `${l.name}: ${gone ? `${l.stays}% of the effect stays when the seller leaves` : "full effect while the seller stays"}`).join(". ")}</desc>
        <line x1="10" x2="550" y1="196" y2="196" stroke={C.ash} strokeWidth="1.5" />
        {LADDER.map((l, i) => {
          const h = 40 + i * 30;
          const eff = gone ? l.stays : 100;
          const on = l.id === sel;
          return (
            <g key={l.id}>
              <rect x={x(i)} y={196 - h} width="112" height={h} rx="6" fill={C.mist} stroke={on ? C.amber : C.line} strokeWidth={on ? 2.6 : 1.4} />
              <rect x={x(i)} y={196 - (h * eff) / 100} width="112" height={(h * eff) / 100} rx="6" fill={C.data} opacity="0.9" className="anim-grow-y" />
              <text x={x(i) + 56} y={196 - h - 8} textAnchor="middle" fontSize="13" fontWeight="700" fill={C.ink}>{l.name}</text>
              <text x={x(i) + 56} y="214" textAnchor="middle" fontSize="12.5" fontWeight="700" fill={C.ink}>{`${eff}% stays`}</text>
            </g>
          );
        })}
      </svg>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <p className="smallcaps">Read a level</p>
          <Toggles<Level> label="Level" value={sel} onChange={setSel} options={LADDER.map((l) => ({ id: l.id, label: l.name }))} />
        </div>
        <div className="space-y-1.5">
          <p className="smallcaps">The seller who runs it</p>
          <Toggles<"stays" | "leaves"> label="Seller" value={gone ? "leaves" : "stays"} onChange={(v) => setGone(v === "leaves")} options={[{ id: "stays", label: "Stays" }, { id: "leaves", label: "Leaves the company" }]} />
        </div>
      </div>
      <Insight>
        {gone
          ? `When the seller leaves, ${cur.name.toLowerCase()} keeps ${cur.stays}% of its effect (an illustration). ${cur.leaves} A lever at the process or structure level is what you can still count on next year.`
          : `While the seller stays, every level works. The difference shows only when the seller leaves, which is the test of durability. Switch it and compare the bars.`}
      </Insight>
      <div className="rounded-lg border border-line bg-paper p-3.5 text-caption" aria-live="polite">
        <p className="smallcaps">{cur.name}</p>
        <p className="mt-1">
          <Gloss>{cur.what}</Gloss>
        </p>
        <p className="mt-1">
          <span className="font-semibold text-ink">Elbtal's example. </span>
          {cur.example}
        </p>
        <p className="mt-1 text-ash">
          <span className="font-semibold text-ink">Cost shape. </span>
          {cur.cost}
        </p>
      </div>
      <p className="text-caption text-ash">The percentages are set for the teaching example (Case assumption), not measured.</p>
    </div>
  );
}

/** The decision loop of B1: see, decide, act, learn. A static picture with no controls. */
export function ControlLoop() {
  const uid = useId().replace(/:/g, "");
  const steps = [
    { t: "See", s: "Read the buyer's behaviour signals" },
    { t: "Decide", s: "Choose the lever for the phase" },
    { t: "Act", s: "Run it through the process" },
    { t: "Learn", s: "Compare with the tripwire" },
  ];
  return (
    <svg viewBox="0 0 560 150" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
      <title id={`${uid}-t`}>{`The decision loop: see, decide, act, learn`}</title>
      <desc id={`${uid}-d`}>{`Four steps in a loop: read the buyer's behaviour signals, choose the lever for the phase, run it through the process, compare with the tripwire, and start again.`}</desc>
      <defs>
        <marker id={`${uid}-a`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill={C.ash} />
        </marker>
      </defs>
      {steps.map((s, i) => (
        <g key={s.t}>
          <rect x={6 + i * 140} y="24" width="122" height="66" rx="10" fill={i % 2 ? C.tealSoft : C.soft} stroke={i % 2 ? C.teal : C.amber} strokeWidth="1.8" />
          <text x={67 + i * 140} y="50" textAnchor="middle" fontSize="16" fontWeight="700" fill={C.ink}>{s.t}</text>
          <text x={67 + i * 140} y="70" textAnchor="middle" fontSize="11" fill={C.ash}>{s.s.length > 24 ? s.s.slice(0, s.s.lastIndexOf(" ", 24)) : s.s}</text>
          <text x={67 + i * 140} y="83" textAnchor="middle" fontSize="11" fill={C.ash}>{s.s.length > 24 ? s.s.slice(s.s.lastIndexOf(" ", 24) + 1) : ""}</text>
          {i < 3 && <line x1={130 + i * 140} x2={144 + i * 140} y1="57" y2="57" stroke={C.ash} strokeWidth="2" markerEnd={`url(#${uid}-a)`} />}
        </g>
      ))}
      <path d="M528 92 C 528 130, 40 130, 40 96" fill="none" stroke={C.ash} strokeWidth="2" strokeDasharray="5 4" markerEnd={`url(#${uid}-a)`} />
      <text x="284" y="132" textAnchor="middle" fontSize="11.5" fill={C.ash}>the result becomes the next signal</text>
    </svg>
  );
}

/* ------------------------------------------------------------------ B2 · lever profile (Elbtal) */

type Crit = "reach" | "depth" | "durability" | "scale";
type EL = { id: string; name: string; level: string; depends: string; cost: string; reach: string; r: Record<Crit, 1 | 2 | 3>; why: Record<Crit, string> };
const EL_LEVERS: EL[] = [
  {
    id: "peer",
    name: "Peer visit programme",
    level: "Process",
    depends: "The process",
    cost: "One-off set-up",
    reach: "Every prospect",
    r: { reach: 3, depth: 2, durability: 3, scale: 3 },
    why: {
      reach: "Every prospect is offered a visit. It touches every deal.",
      depth: "A visit answers the proof question well but not a fear of the contract. A medium effect in one deal.",
      durability: "It is a step of the process, so it happens whoever sells. Nothing depends on one person.",
      scale: "The cost is the set-up. An extra deal costs one more visit.",
    },
  },
  {
    id: "am",
    name: "Named account manager per customer",
    level: "Interaction",
    depends: "Individual people",
    cost: "Per deal",
    reach: "Deals above a size threshold",
    r: { reach: 2, depth: 3, durability: 1, scale: 1 },
    why: {
      reach: "Only the larger deals get one, so it does not touch every deal. Reach is at most 2.",
      depth: "A person the buyer knows removes the trust gap directly. A strong effect where it applies.",
      durability: "It depends on the individual. When the manager leaves, the buyer's trust leaves too. Durability is 1.",
      scale: "Every additional deal needs additional hours. The cost per deal does not fall. Scale is 1.",
    },
  },
  {
    id: "promo",
    name: "Quarterly price promotion",
    level: "Argument",
    depends: "A campaign",
    cost: "Per deal",
    reach: "Every prospect",
    r: { reach: 3, depth: 1, durability: 1, scale: 1 },
    why: {
      reach: "The promotion is offered to everyone.",
      depth: "It changes the price, not the reason the buyer was stalling. A small nudge.",
      durability: "It ends with the campaign, and buyers learn to wait for the next one.",
      scale: "The margin is paid on every deal, so the cost grows with volume. Scale is 1.",
    },
  },
  {
    id: "check",
    name: "Standard onboarding checklist",
    level: "Structure",
    depends: "A rule",
    cost: "One-off set-up",
    reach: "Every customer",
    r: { reach: 3, depth: 2, durability: 3, scale: 3 },
    why: {
      reach: "Every new customer goes through it.",
      depth: "It removes some early friction and answers a fear of a bad start. A medium effect.",
      durability: "It is a rule that applies to every customer, whoever runs the onboarding.",
      scale: "A one-off cost. Each additional customer uses the same checklist.",
    },
  },
];
const CRIT_NAME: Record<Crit, string> = { reach: "Reach", depth: "Depth", durability: "Durability", scale: "Scale" };
const CRIT_Q: Record<Crit, string> = {
  reach: "How many deals does it touch?",
  depth: "How strongly does it change the behaviour in one deal?",
  durability: "Does it still work when the seller changes or the campaign ends?",
  scale: "Does the cost per additional deal fall as volume grows?",
};
const DOTS = ["●○○", "●●○", "●●●"];

export function LeverProfile() {
  const [sel, setSel] = useState<{ id: string; c: Crit }>({ id: "peer", c: "durability" });
  const lever = EL_LEVERS.find((l) => l.id === sel.id)!;
  const total = (l: EL) => Object.values(l.r).reduce((s, v) => s + v, 0);
  const best = [...EL_LEVERS].sort((a, b) => total(b) - total(a))[0];
  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[38rem] border-collapse text-caption">
          <caption className="sr-only">Four levers of Elbtal Systems rated on reach, depth, durability and scale</caption>
          <thead>
            <tr className="bg-mist text-left text-micro uppercase text-ash">
              <th className="px-3 py-2">Lever · what it depends on · cost</th>
              {(Object.keys(CRIT_NAME) as Crit[]).map((c) => (
                <th key={c} className="px-2 py-2 text-center">
                  {CRIT_NAME[c]}
                </th>
              ))}
              <th className="px-2 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {EL_LEVERS.map((l) => (
              <tr key={l.id} className="border-t border-line align-top">
                <td className="px-3 py-2">
                  <span className="font-semibold">{l.name}</span>
                  <br />
                  <span className="text-ash">
                    {l.level} · {l.depends} · {l.cost} · {l.reach}
                  </span>
                </td>
                {(Object.keys(CRIT_NAME) as Crit[]).map((c) => {
                  const on = sel.id === l.id && sel.c === c;
                  return (
                    <td key={c} className="px-1 py-1.5 text-center">
                      <button
                        type="button"
                        onClick={() => setSel({ id: l.id, c })}
                        aria-pressed={on}
                        aria-label={`${l.name}, ${CRIT_NAME[c]}: ${l.r[c]} of 3. Select to read why.`}
                        className={clsx("min-h-[40px] min-w-[3.6rem] rounded-md border px-2 text-body tracking-widest transition-colors", on ? "border-accent bg-accentSoft ring-2 ring-gold" : "border-line bg-paper hover:border-ash")}
                      >
                        {DOTS[l.r[c] - 1]}
                      </button>
                    </td>
                  );
                })}
                <td className="tnum px-2 py-2 text-right font-bold">{total(l)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rounded-lg border border-line bg-paper p-3.5 text-caption" aria-live="polite">
        <p className="smallcaps">
          {lever.name} · {CRIT_NAME[sel.c]}: {lever.r[sel.c]} of 3
        </p>
        <p className="mt-1">
          <span className="font-semibold text-ink">The test. </span>
          {CRIT_Q[sel.c]}
        </p>
        <p className="mt-1">
          <span className="font-semibold text-ink">Why this rating. </span>
          {lever.why[sel.c]}
        </p>
      </div>
      <Insight>
        {`The highest total is “${best.name}” with ${total(best)} of 12, and it is a ${best.level.toLowerCase()} lever. The lowest ratings sit in the columns Durability and Scale of the levers that depend on people or on a campaign. Depth alone can mislead: the named account manager is the strongest in a single deal (3) and still totals only ${total(EL_LEVERS[1])}, because it does not last and does not scale.`}
      </Insight>
      <div className="rounded-lg border border-line bg-paper p-3.5 text-caption">
        <p className="smallcaps">Limits a rating must respect</p>
        <Bul
          items={[
            "Reach: a lever that applies only above a size threshold or to one segment cannot be 3.",
            "Durability: a lever that depends on individual people cannot be more than 1. One that is a process step or a rule can be 3.",
            "Scale: a cost that repeats with every deal is 1. A cost that repeats with every seller is at most 2. A one-off cost can be 3.",
          ]}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ B3 · regret table (Elbtal) */

const STRATS = [
  { id: "commit", name: "Commit now", pay: [240, 60, -90] },
  { id: "stage", name: "Stage it, with a tripwire", pay: [170, 60, -10] },
  { id: "wait", name: "Wait for more research", pay: [-30, -30, -30] },
] as const;
const SCEN = ["Customers react well", "Reactions are mixed", "Customers react badly"];

export function RegretTable() {
  const [q, setQ] = useState(20);
  const [regret, setRegret] = useState(false);
  const [scen, setScen] = useState<0 | 1 | 2>(2);
  const best = [0, 1, 2].map((j) => Math.max(...STRATS.map((s) => s.pay[j])));
  const reg = STRATS.map((s) => s.pay.map((v, j) => best[j] - v));
  const maxReg = reg.map((r) => Math.max(...r));
  const pq = q / 100;
  const pOther = (1 - pq) / 2;
  const ev = STRATS.map((s) => pOther * s.pay[0] + pOther * s.pay[1] + pq * s.pay[2]);
  const bestEv = ev.indexOf(Math.max(...ev));
  const bestMinimax = maxReg.indexOf(Math.min(...maxReg));
  const cell = (i: number, j: number) => (regret ? reg[i][j] : STRATS[i].pay[j]);
  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[34rem] border-collapse text-caption">
          <caption className="sr-only">{regret ? "Regret" : "Net result"} of three strategies in three customer reactions, in thousand euros over twelve months</caption>
          <thead>
            <tr className="bg-mist text-left text-micro uppercase text-ash">
              <th className="px-3 py-2">{regret ? "Regret" : "Net result"} (€ thousand, 12 months)</th>
              {SCEN.map((s, j) => (
                <th key={s} className="px-2 py-2 text-center">
                  <button type="button" onClick={() => setScen(j as 0 | 1 | 2)} aria-pressed={scen === j} className={clsx("rounded px-1.5 py-1 font-semibold uppercase", scen === j && "bg-accentSoft text-accent ring-1 ring-gold")}>
                    {s}
                  </button>
                </th>
              ))}
              <th className="px-2 py-2 text-right">{regret ? "Worst regret" : "Expected"}</th>
            </tr>
          </thead>
          <tbody>
            {STRATS.map((s, i) => (
              <tr key={s.id} className="border-t border-line">
                <td className="px-3 py-2 font-semibold">{s.name}</td>
                {[0, 1, 2].map((j) => (
                  <td key={j} className={clsx("tnum px-2 py-2 text-center", scen === j && "bg-accentSoft/60 font-bold", !regret && cell(i, j) === best[j] && "underline decoration-2 underline-offset-4")}>
                    {cell(i, j) > 0 && !regret ? "+" : ""}
                    {cell(i, j)}
                  </td>
                ))}
                <td className="tnum px-2 py-2 text-right font-bold">{regret ? maxReg[i] : `${ev[i] >= 0 ? "+" : "−"}${Math.abs(Math.round(ev[i]))}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <p className="smallcaps">Show</p>
          <Toggles<"pay" | "regret"> label="Show" value={regret ? "regret" : "pay"} onChange={(v) => setRegret(v === "regret")} options={[{ id: "pay", label: "Net result" }, { id: "regret", label: "Regret (best in the column minus yours)" }]} />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="q-slider" className="smallcaps block">
            Your estimate that customers react badly: {q}%
          </label>
          <input id="q-slider" type="range" min={0} max={60} step={5} value={q} onChange={(e) => setQ(Number(e.target.value))} className="range-accent" />
          <p className="text-micro normal-case tracking-normal text-ash">The other two reactions share the rest equally.</p>
        </div>
      </div>
      <Insight>
        {`Without any estimate of the odds, the strategy with the smallest worst regret is “${STRATS[bestMinimax].name}” (${maxReg[bestMinimax]}). With your estimate of ${q}% for a bad reaction, the highest expected result is “${STRATS[bestEv].name}”. `}
        {q < 30 ? "Below about 30% the bold move pays more on average; the staged start gives up some upside to insure against the bad case." : "Above about 30% the staged start overtakes the bold one on average as well, because the tripwire caps what a bad reaction costs."}
        {` Waiting is the worst under every reading (${maxReg[2]} worst regret): the stall continues while you wait.`}
      </Insight>
      <div className="rounded-lg border border-line bg-paper p-3.5 text-caption">
        <p className="smallcaps">A tripwire in four parts</p>
        <Bul items={["A metric of the buyer's behaviour, not an activity count.", "A threshold that is better than today's baseline.", "A date early enough to still act on it.", "An action agreed in advance: scale, adjust or stop."]} />
      </div>
      <p className="text-caption text-ash">Values are Case assumptions for a different company (Elbtal Systems), in € thousand.</p>
    </div>
  );
}

/* ------------------------------------------------------------------ B4 · risk matrix (Elbtal) */

const EL_RISKS = [
  { id: "r1", name: "We assume buyers compare options on a checklist", l: 2, i: 3, assume: "The best-scoring offer wins.", maybe: "Feeling and blame decide, and the checklist is used afterwards to justify the choice.", signal: "A buyer picks the provider that scored lower, and cannot say why.", response: "If two lost deals in a month went to a lower-scoring provider, interview both buyers within 2 weeks." },
  { id: "r2", name: "We think it is simple because we know it", l: 3, i: 2, assume: "Our offer is easy to understand.", maybe: "The buyer does not share our vocabulary and stops rather than ask.", signal: "The same clarification question comes back in three deals.", response: "If a question comes back in 3 deals, rewrite the page that should have answered it within a month." },
  { id: "r3", name: "We only ask the customers who stayed", l: 3, i: 3, assume: "Our happy customers tell us what works.", maybe: "The ones who left say things the ones who stayed never would.", signal: "Every interview confirms the plan.", response: "If fewer than 3 of 10 interviews are with lost deals, add 4 lost-deal interviews before the next review." },
  { id: "r4", name: "We read every stall as proof of our theory", l: 2, i: 2, assume: "A stalled deal shows the barrier we expected.", maybe: "Each stall has its own cause, and the theory bends to fit them.", signal: "No note ever contradicts the theory.", response: "If no note out of 10 contradicts the theory, ask a colleague outside sales to tag five of them blind." },
  { id: "r5", name: "An overstated claim damages trust when it is found", l: 1, i: 3, assume: "A stronger claim wins a stronger reaction.", maybe: "A buyer who checks and finds the gap trusts nothing else we said (and § 5 UWG applies).", signal: "A buyer asks for the source of a number and the answer takes days.", response: "If a claim cannot be sourced in 2 days, take it out of the deck." },
] as const;

export function RiskMatrix() {
  const [sel, setSel] = useState<string>("r3");
  const r = EL_RISKS.find((x) => x.id === sel)!;
  const cellRisks = (l: number, i: number) => EL_RISKS.filter((x) => x.l === l && x.i === i);
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[auto_1fr] gap-2">
        <div className="flex items-center text-micro font-semibold uppercase text-ash [writing-mode:vertical-rl] rotate-180">Impact if it happens →</div>
        <div>
          <div className="grid grid-cols-3 gap-1" role="group" aria-label="Likelihood by impact grid">
            {[3, 2, 1].flatMap((imp) =>
              [1, 2, 3].map((lik) => {
                const here = cellRisks(lik, imp);
                const hot = lik * imp >= 6;
                return (
                  <div key={`${lik}-${imp}`} className={clsx("flex min-h-[64px] flex-wrap content-center items-center justify-center gap-1 rounded-md border p-1", hot ? "border-rust/40 bg-rustSoft" : lik * imp >= 3 ? "border-line bg-accentSoft/50" : "border-line bg-mist/60")}>
                    {here.map((x) => (
                      <button key={x.id} type="button" onClick={() => setSel(x.id)} aria-pressed={sel === x.id} aria-label={`${x.name}. Likelihood ${x.l}, impact ${x.i}.`} className={clsx("min-h-[40px] min-w-[40px] rounded-full border-2 px-2 text-caption font-bold", sel === x.id ? "border-ink bg-ink text-paper" : "border-ink bg-paper text-ink")}>
                        {x.id.slice(1)}
                      </button>
                    ))}
                    {here.length === 0 && <span className="text-micro text-ash/60">{hot ? "act now" : ""}</span>}
                  </div>
                );
              }),
            )}
          </div>
          <div className="mt-1 text-center text-micro font-semibold uppercase text-ash">Likelihood → (low, mid, high)</div>
        </div>
      </div>
      <ol className="grid gap-1.5 sm:grid-cols-2">
        {EL_RISKS.map((x) => (
          <li key={x.id}>
            <button type="button" onClick={() => setSel(x.id)} aria-pressed={sel === x.id} className={clsx("flex min-h-[40px] w-full items-center gap-2 rounded-md border px-2 py-1 text-left text-caption", sel === x.id ? "border-accent bg-accentSoft" : "border-line bg-paper hover:border-ash")}>
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink text-micro font-bold text-paper">{x.id.slice(1)}</span>
              {x.name}
            </button>
          </li>
        ))}
      </ol>
      <div className="space-y-1.5 rounded-lg border border-line bg-paper p-3.5 text-caption" aria-live="polite">
        <p className="smallcaps">
          {r.name} · likelihood {r.l} · impact {r.i} · score {r.l * r.i}
        </p>
        <p>
          <span className="font-semibold text-ink">We assume. </span>
          {r.assume}
        </p>
        <p>
          <span className="font-semibold text-ink">It may be true that. </span>
          {r.maybe}
        </p>
        <p>
          <span className="font-semibold text-ink">Early signal. </span>
          {r.signal}
        </p>
        <p>
          <span className="font-semibold text-ink">Response with a trigger. </span>
          {r.response}
        </p>
      </div>
      <Insight>
        {r.l * r.i >= 6
          ? `Risk ${r.id.slice(1)} scores ${r.l * r.i} and sits in the shaded top-right zone. It needs a signal you can see early and a trigger with a number now, not after the first loss.`
          : `Risk ${r.id.slice(1)} scores ${r.l * r.i}. It is worth a note and a signal, and it does not need a budget line yet. Notice that it is still written as an assumption about the buyer, and that its response contains a number.`}
        {" A risk of misjudgment is always “we assume the buyer …”. A competitor's price cut or a seller's follow-through is a different kind of risk."}
      </Insight>
    </div>
  );
}

/* ------------------------------------------------------------------ B5 · architecture (Elbtal) */

const E_MONTHS = [1, 2, 3, 4, 5, 6];
const E_ITEMS = [
  { id: "sig", name: "Buyer signals in the CRM", cost: 12000, start: 1, owner: "Head of Sales Operations", ownerWhy: "Owns the CRM, so can change what is recorded without asking anyone else.", startWhy: "Month 1: baseline first. Nothing else can be judged until the signals are being recorded.", trigger: "If fewer than 80% of open deals have all signals by month 2, stop the reviews and fix the set-up.", trigWhy: "It names a number (80%), a date (month 2) and an action (stop and fix)." },
  { id: "peer", name: "Peer visit programme", cost: 20000, start: 2, owner: "Customer success lead", ownerWhy: "Holds the customer relationships and can ask three customers to host.", startWhy: "Month 2: the first lever waits until the baseline exists, and needs a month to line up hosts.", trigger: "If fewer than 3 hosts are booked by month 3, widen the invitation to the next ten customers.", trigWhy: "The number (3) and the date (month 3) make it a trigger, and the action is defined." },
  { id: "exit", name: "Exit clause as standard", cost: 18000, start: 2, owner: "Legal counsel", ownerWhy: "Owns contract terms. Nobody else can change them.", startWhy: "Month 2: legal needs the baseline to know which contracts it will be measured on.", trigger: "If the signature rate after a verbal yes is below 60% at month 4, widen the exit terms.", trigWhy: "A behavioural metric, a threshold better than today's, a date and an action." },
  { id: "onb", name: "Onboarding checklist", cost: 10000, start: 3, owner: "Delivery director", ownerWhy: "Owns the engineers' time and the delivery plan.", startWhy: "Month 3: it acts after signing, so it can wait for the pre-signing levers.", trigger: "If more than 2 of 10 new customers miss the day-30 milestone, review the checklist.", trigWhy: "A number, a period and an action." },
] as const;
const E_BUDGET = 70000;

export function ArchitectureExample() {
  const [sel, setSel] = useState<string>("sig");
  const it = E_ITEMS.find((x) => x.id === sel)!;
  const total = E_ITEMS.reduce((s, x) => s + x.cost, 0);
  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[38rem] border-collapse text-caption">
          <caption className="sr-only">Elbtal's architecture: four items over six months with owner and cost</caption>
          <thead>
            <tr className="bg-mist text-left text-micro uppercase text-ash">
              <th className="px-3 py-2">Item · owner · cost</th>
              {E_MONTHS.map((m) => (
                <th key={m} className="px-1 py-2 text-center">
                  M{m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {E_ITEMS.map((x) => (
              <tr key={x.id} className={clsx("border-t border-line align-top", sel === x.id && "bg-accentSoft/60")}>
                <td className="px-3 py-1.5">
                  <button type="button" onClick={() => setSel(x.id)} aria-pressed={sel === x.id} className="min-h-[40px] text-left">
                    <span className="font-semibold">{x.name}</span>
                    <br />
                    <span className="text-ash">
                      {x.owner} · {euro(x.cost)}
                    </span>
                  </button>
                </td>
                {E_MONTHS.map((m) => (
                  <td key={m} className="px-1 py-1.5 text-center">
                    <span className={clsx("inline-block h-6 w-full min-w-[1.6rem] rounded border text-micro leading-6", m === x.start ? "border-ink bg-ink font-bold text-paper" : m > x.start ? "border-signal/40 bg-signalSoft text-signal" : "border-line bg-paper text-ash/40")}>
                      {m === x.start ? "▶" : m > x.start ? "·" : ""}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-caption text-ash">
        Total {euro(total)} of the {euro(E_BUDGET)} budget. Left open: a seller workshop (€25,000), postponed. Pickup point: if the signature rate after a verbal yes is still below 60% at month 4.
      </p>
      <div className="space-y-1.5 rounded-lg border border-line bg-paper p-3.5 text-caption" aria-live="polite">
        <p className="smallcaps">{it.name}</p>
        <p>
          <span className="font-semibold text-ink">Owner: {it.owner}. </span>
          {it.ownerWhy}
        </p>
        <p>
          <span className="font-semibold text-ink">Starts in month {it.start}. </span>
          {it.startWhy}
        </p>
        <p>
          <span className="font-semibold text-ink">Trigger. </span>“{it.trigger}” <span className="text-ash">{it.trigWhy}</span>
        </p>
      </div>
      <Insight>
        {`The signals start in month 1 and the levers in month 2 and 3, so by the time the first lever runs there is a baseline to compare it with. Every item has one owner who can change it without asking anyone else, and a trigger that carries a number, a date and an action. The four items cost ${euro(total)}; the ${euroSigned(E_BUDGET - total)} that is left is not spread thinly: the workshop is postponed with a pickup point instead.`}
      </Insight>
    </div>
  );
}
