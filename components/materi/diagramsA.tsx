"use client";

import { useId, useState } from "react";
import clsx from "clsx";
import { Bul, Diagram, Insight, Toggles } from "@/components/materi/kit";
import { BARRIERS } from "@/data/barriers";
import type { BarrierId } from "@/data/barriers";
import { HANSA, feltCost } from "@/data/feltCost";
import { REASON_LABEL } from "@/data/debrief";
import type { ReasonTag } from "@/data/debrief";
import { strengthOf, STRENGTH_LABEL } from "@/data/exitNotes";
import { speedBucket } from "@/data/measures";
import { euro, euroSigned } from "@/lib/lang";
import { Gloss } from "@/lib/glossify";

/**
 * The interactive diagrams of Materi A (Route 1). Every one uses a worked-example company (Hansawerk, Elbtal Systems), never
 * SecureIT, so the answer to a task block is never printed. Every control is followed by an always-visible "What this shows".
 */

const NAMED = { ink: "#1F2328", ash: "#59606A", paper: "#FFFEFA", mist: "#ECE6D6", line: "#D8D1BF", amber: "#8A5A0B", gold: "#D99A2B", teal: "#0F6B6B", tealSoft: "#DFEEEB", rust: "#A4472A", data: "#2F5D62", grey: "#8B9098", soft: "#FBF0D6" };

/* ------------------------------------------------------------------ A1 · three roots of loyalty */

type RootId = "trust" | "habit" | "attach";
const ROOTS: { id: RootId; name: string; kind: string; idea: string; example: string; breaks: string; test: string }[] = [
  {
    id: "trust",
    name: "Trust",
    kind: "A judgement: “I believe they will deliver and be straight with me.”",
    idea: "The customer is willing to depend on you because of what they have seen: promises kept, problems reported early, answers that turned out right.",
    example: "In IT security: the customer asks the vendor before a decision, because earlier warnings were right.",
    breaks: "A missed promise, or a problem that was hidden and found later.",
    test: "Would this customer choose you again if leaving were easy?",
  },
  {
    id: "habit",
    name: "Habit",
    kind: "A routine: “It is how we work. Changing costs effort.”",
    idea: "The customer keeps buying because switching would take time, money or learning. It says nothing about how they feel about you.",
    example: "In IT security: scripts, integrations and staff routines have all been built around one vendor's tool.",
    breaks: "A renewal date, a new CIO, or a competitor who makes switching cheap.",
    test: "Would they stay if switching cost them nothing?",
  },
  {
    id: "attach",
    name: "Attachment",
    kind: "A feeling: “I like working with these people. I feel looked after.”",
    idea: "The customer is tied to the people, not only to the service. It is emotional, personal and rare in a large B2B account.",
    example: "In IT security: the customer's IT head knows the engineer by name and calls them first.",
    breaks: "The contact leaves the company, or the vendor's team changes.",
    test: "Would they miss the people, and not only the service?",
  },
];

const ROOT_READING: Record<string, string> = {
  "": "Nothing holds this customer. They can leave the day an alternative appears, and no argument from you would change that.",
  habit: "This customer stays by routine. They leave at renewal, or when a trigger (a new CIO, a breach at a competitor) makes the effort of changing smaller than the cost of staying. That is retention without loyalty.",
  trust: "This customer stays while you keep performing and would choose you again if leaving were easy. They will tell you when something goes wrong. A proven, cheaper alternative can still win them.",
  attach: "This customer stays because of the people, even after a mistake. It is fragile in B2B: when the contact leaves or your team changes, the attachment leaves with them.",
  "habit+trust": "A solid, stable account: the customer relies on you and it is easy to stay. Nothing ties them emotionally, so a rival with a strong personal pitch has an opening.",
  "attach+trust": "A loyal customer who chooses you when switching would be easy. It is the deepest hold, but with no habit behind it, one bad quarter tests it early.",
  "attach+habit": "Comfortable, liked and routine, but nobody has checked that you can be relied on. A serious failure would find that out quickly.",
  "attach+habit+trust": "The strongest hold: reliance, routine and attachment all point the same way. It takes a serious failure or a serious trigger to break it.",
};

export function LoyaltyRoots() {
  const uid = useId().replace(/:/g, "");
  const [on, setOn] = useState<RootId[]>(["habit"]);
  const [focus, setFocus] = useState<RootId>("habit");
  const toggle = (id: RootId) => {
    setFocus(id);
    setOn((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  };
  const key = [...on].sort().join("+");
  const f = ROOTS.find((r) => r.id === focus)!;
  const x = { trust: 110, habit: 280, attach: 450 } as const;
  const thick = on.length === 0 ? 0 : 2 + on.length * 5;
  return (
    <div className="space-y-3">
      <svg viewBox="0 0 560 230" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{`Three roots hold a customer: trust, habit and attachment`}</title>
        <desc id={`${uid}-d`}>{`A customer at the top is held by up to three roots. ${on.length} of 3 roots are switched on: ${on.length ? on.join(", ") : "none"}.`}</desc>
        <rect x="200" y="6" width="160" height="44" rx="10" fill={NAMED.soft} stroke={NAMED.amber} strokeWidth="2" />
        <text x="280" y="34" textAnchor="middle" fontSize="16" fontWeight="700" fill={NAMED.ink}>Customer stays</text>
        <line x1="280" y1="50" x2="280" y2="88" stroke={NAMED.ink} strokeWidth={thick} strokeLinecap="round" opacity={on.length ? 1 : 0.15} />
        <text x="280" y="70" textAnchor="middle" fontSize="11.5" fill={NAMED.ash} dx="44">{on.length === 0 ? "no hold" : `${on.length} root${on.length > 1 ? "s" : ""}`}</text>
        {ROOTS.map((r) => {
          const active = on.includes(r.id);
          return (
            <g key={r.id}>
              <path d={`M280 88 C ${x[r.id]} 100, ${x[r.id]} 110, ${x[r.id]} 128`} fill="none" stroke={active ? NAMED.data : NAMED.line} strokeWidth={active ? 5 : 2} strokeDasharray={active ? undefined : "5 5"} />
              <rect x={x[r.id] - 78} y="128" width="156" height="78" rx="10" fill={active ? NAMED.tealSoft : NAMED.paper} stroke={active ? NAMED.teal : NAMED.ash} strokeWidth={active ? 2.4 : 1.4} strokeDasharray={active ? undefined : "6 4"} />
              <text x={x[r.id]} y="158" textAnchor="middle" fontSize="16" fontWeight="700" fill={NAMED.ink}>{r.name}</text>
              <text x={x[r.id]} y="178" textAnchor="middle" fontSize="12" fill={NAMED.ash}>{r.id === "trust" ? "judgement" : r.id === "habit" ? "routine" : "feeling"}</text>
              <text x={x[r.id]} y="196" textAnchor="middle" fontSize="12" fontWeight="600" fill={active ? NAMED.teal : NAMED.ash}>{active ? "● present" : "○ absent"}</text>
            </g>
          );
        })}
      </svg>
      <div className="space-y-1.5">
        <p className="smallcaps">Switch a root on or off</p>
        <Toggles multi label="Roots of loyalty" value={on} onChange={toggle} options={ROOTS.map((r) => ({ id: r.id, label: `${r.name}${on.includes(r.id) ? " · on" : " · off"}` }))} />
      </div>
      <Insight>{ROOT_READING[key]}</Insight>
      <div className="rounded-lg border border-line bg-paper p-3.5 text-caption">
        <p className="smallcaps">{f.name}</p>
        <p className="mt-1 font-semibold text-ink">{f.kind}</p>
        <p className="mt-1">
          <Gloss>{f.idea}</Gloss>
        </p>
        <p className="mt-1 text-ash">
          <span className="font-semibold text-ink">Example. </span>
          {f.example}
        </p>
        <p className="mt-1 text-ash">
          <span className="font-semibold text-ink">What breaks it. </span>
          {f.breaks}
        </p>
        <p className="mt-1">
          <span className="font-semibold text-ink">Test question. </span>
          {f.test}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ A2 · worked sort: Hansawerk */

const HANSA_REASONS: { id: string; quote: string; tag: ReasonTag; test: string; why: string }[] = [
  {
    id: "h1",
    quote: "Provider Y put a 2-hour response time into the contract. Provider X offered business hours only.",
    tag: "rational",
    test: "Could a third party check this against the contract?",
    why: "A response time is a term of the offer and it is written down. It can be compared line by line.",
  },
  {
    id: "h2",
    quote: "Y's contract has one fixed price for the whole first year. X bills by the hour.",
    tag: "rational",
    test: "Is it a term of the price sheet that can be compared with the other offer?",
    why: "A fixed price against an open one changes what the buyer can budget. It can be computed, so it is rational.",
  },
  {
    id: "h3",
    quote: "After the demo I felt X's people were rushed, and I could not shake that.",
    tag: "emotional",
    test: "Is this a report of a feeling, with no fact attached?",
    why: "“I felt” and “could not shake that” report a feeling. No term of either offer is compared.",
  },
  {
    id: "h4",
    quote: "I had never heard of X, and I could not imagine explaining that choice to our board.",
    tag: "emotional",
    test: "Is it about how unfamiliar the vendor felt and how the buyer expects to be judged?",
    why: "Unfamiliarity and the fear of being asked to justify a choice are feelings about blame, not properties of the offer.",
  },
  {
    id: "h5",
    quote: "Three companies I know use Y.",
    tag: "both",
    test: "It sounds like a fact. Does it say anything about what Y would deliver to this buyer, or does it mainly reassure?",
    why: "It can be checked, but it says nothing about Y's delivery to Hansawerk. Its job is reassurance from what others did. Both.",
  },
  {
    id: "h6",
    quote: "Y is the brand everybody expects us to pick.",
    tag: "both",
    test: "It is stated as a fact about a reputation. What work does it do for the buyer?",
    why: "A reputation is presented as a fact, but the sentence is about not being questioned. It is a feeling in the form of a reason. Both.",
  },
];
const TAG_STYLE: Record<ReasonTag, string> = {
  rational: "border-signal/50 bg-signalSoft text-signal",
  emotional: "border-accent/50 bg-accentSoft text-accent",
  both: "border-ash/50 bg-mist text-ink",
};

export function ReasonSortExample() {
  const [sel, setSel] = useState<string>("h1");
  const [seen, setSeen] = useState<string[]>(["h1"]);
  const r = HANSA_REASONS.find((x) => x.id === sel)!;
  const pick = (id: string) => {
    setSel(id);
    setSeen((s) => (s.includes(id) ? s : [...s, id]));
  };
  return (
    <Diagram label="Worked example · Hansawerk chose the dearer, better-known Provider Y over Provider X (Case assumption, read-only)">
      <ol className="grid gap-2 sm:grid-cols-2">
        {HANSA_REASONS.map((h) => {
          const on = h.id === sel;
          const opened = seen.includes(h.id);
          return (
            <li key={h.id}>
              <button
                type="button"
                onClick={() => pick(h.id)}
                aria-pressed={on}
                className={clsx("flex min-h-[48px] w-full flex-col items-start gap-1 rounded-lg border bg-paper px-3 py-2 text-left text-caption transition-colors", on ? "border-accent bg-accentSoft ring-2 ring-gold" : "border-line hover:border-ash")}
              >
                <span className="text-ink">“{h.quote}”</span>
                {opened && <span className={clsx("pill", TAG_STYLE[h.tag])}>{REASON_LABEL[h.tag]}</span>}
              </button>
            </li>
          );
        })}
      </ol>
      <div className="mt-3 space-y-1 rounded-lg border border-line bg-paper p-3 text-caption" aria-live="polite">
        <p className="smallcaps">
          Tag: <span className="text-accent">{REASON_LABEL[r.tag]}</span>
        </p>
        <p>
          <span className="font-semibold text-ink">The test question. </span>
          {r.test}
        </p>
        <p>
          <span className="font-semibold text-ink">Why. </span>
          {r.why}
        </p>
      </div>
      <Insight className="mt-3">
        Two of the six statements are plainly checkable, two are plainly feelings, and two are the interesting ones: they sound like facts and work as reassurance. Buyers seldom say “I was afraid”. They say “Y is the safe choice”. The sort is about which job a sentence does for the buyer, not about whether the buyer is “rational”. You have opened {seen.length} of 6.
      </Insight>
    </Diagram>
  );
}

/* ------------------------------------------------------------------ A3 · the felt-cost scale (Hansawerk) */

type ScaleLever = "refs" | "exit" | "cut";
const H_LEVERS: { id: ScaleLever; label: string; what: string }[] = [
  { id: "refs", label: "Three references for X", what: "the chance the buyer expects falls from 10% to 5%" },
  { id: "exit", label: "Exit clause for X", what: "the cost to the buyer if it goes wrong falls from €90,000 to €54,000" },
  { id: "cut", label: "Cut X's price by 10%", what: "the price falls from €50,000 to €45,000" },
];

export function FeltCostScale() {
  const uid = useId().replace(/:/g, "");
  const [weight, setWeight] = useState<1 | 2 | 3>(2);
  const [on, setOn] = useState<ScaleLever[]>([]);
  const toggle = (id: ScaleLever) => setOn((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  const x = {
    price: on.includes("cut") ? 45000 : HANSA.X.price,
    chance: on.includes("refs") ? 5 : HANSA.X.chance,
    loss: on.includes("exit") ? 54000 : HANSA.loss,
  };
  const felt = (price: number, chance: number, loss: number) => feltCost(price, chance, loss, weight);
  const fx = felt(x.price, x.chance, x.loss);
  const fy = felt(HANSA.Y.price, HANSA.Y.chance, HANSA.loss);
  const baseFx = felt(HANSA.X.price, HANSA.X.chance, HANSA.loss);
  const riskX = fx - x.price;
  const riskY = fy - HANSA.Y.price;
  const S = (v: number) => 120 + (v / 90000) * 400;
  const priceList = HANSA.Y.price - x.price;
  const gap = fx - fy; // positive: X feels dearer
  const others = on.map((id) => {
    const solo = felt(id === "cut" ? 45000 : HANSA.X.price, id === "refs" ? 5 : HANSA.X.chance, id === "exit" ? 54000 : HANSA.loss);
    return { id, delta: solo - baseFx };
  });

  return (
    <div className="space-y-3">
      <svg viewBox="0 0 560 190" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{`Felt cost of two providers at loss weight ${weight}`}</title>
        <desc id={`${uid}-d`}>{`Provider X price ${euro(x.price)} plus risk term ${euro(riskX)} makes a felt cost of ${euro(fx)}. Provider Y price ${euro(HANSA.Y.price)} plus risk term ${euro(riskY)} makes ${euro(fy)}.`}</desc>
        <defs>
          <pattern id={`${uid}-hatch`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="8" height="8" fill={NAMED.soft} />
            <line x1="0" y1="0" x2="0" y2="8" stroke={NAMED.amber} strokeWidth="3" />
          </pattern>
        </defs>
        {[
          { name: "Provider X", sub: "cheaper, less known", y: 30, price: x.price, risk: riskX, total: fx },
          { name: "Provider Y", sub: "dearer, better known", y: 100, price: HANSA.Y.price, risk: riskY, total: fy },
        ].map((b) => (
          <g key={b.name}>
            <text x="4" y={b.y + 16} fontSize="14" fontWeight="700" fill={NAMED.ink}>{b.name}</text>
            <text x="4" y={b.y + 33} fontSize="11.5" fill={NAMED.ash}>{b.sub}</text>
            <rect x="120" y={b.y} width={S(b.price) - 120} height="40" fill={NAMED.data} stroke={NAMED.ink} className="anim-grow-x" />
            <text x={120 + (S(b.price) - 120) / 2} y={b.y + 25} textAnchor="middle" fontSize="13" fontWeight="700" fill={NAMED.paper}>{euro(b.price)}</text>
            <rect x={S(b.price)} y={b.y} width={Math.max(S(b.total) - S(b.price), 0.5)} height="40" fill={`url(#${uid}-hatch)`} stroke={NAMED.amber} strokeWidth="1.6" />
            {S(b.total) - S(b.price) > 44 && (
              <text x={S(b.price) + (S(b.total) - S(b.price)) / 2} y={b.y + 25} textAnchor="middle" fontSize="13" fontWeight="700" fill={NAMED.ink} stroke={NAMED.paper} strokeWidth="3" paintOrder="stroke">
                {euro(b.risk)}
              </text>
            )}
            <text x={S(b.total) + 6} y={b.y + 25} fontSize="13" fontWeight="700" fill={NAMED.ink}>{`felt ${euro(b.total)}`}</text>
          </g>
        ))}
        <line x1={S(fy)} x2={S(fy)} y1="20" y2="150" stroke={NAMED.ink} strokeWidth="1.6" strokeDasharray="5 4" />
        <text x="120" y="172" fontSize="11.5" fill={NAMED.ash}>solid = price on the price list</text>
        <text x="300" y="172" fontSize="11.5" fill={NAMED.ash}>hatched = risk term (weight × chance × loss)</text>
      </svg>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <p className="smallcaps">Loss weight (how much a loss counts against an equal gain)</p>
          <Toggles<"1" | "2" | "3">
            label="Loss weight"
            value={String(weight) as "1" | "2" | "3"}
            onChange={(v) => setWeight(Number(v) as 1 | 2 | 3)}
            options={[
              { id: "1", label: "1 · counted equally" },
              { id: "2", label: "2 · as measured" },
              { id: "3", label: "3 · anxious buyer" },
            ]}
          />
        </div>
        <div className="space-y-1.5">
          <p className="smallcaps">Apply to Provider X</p>
          <Toggles multi label="Levers for Provider X" value={on} onChange={toggle} options={H_LEVERS.map((l) => ({ id: l.id, label: l.label }))} />
        </div>
      </div>

      <p className="text-caption text-ash">
        Hansawerk's buyer puts the cost to the business of a failed rollout at {euro(HANSA.loss)}, the chance of it going wrong at {HANSA.X.chance}% for X and {HANSA.Y.chance}% for Y. Case assumption, and an illustration: a thinking aid, not a measurement.
      </p>
      <Insight>
        {weight === 1
          ? `At weight 1 a loss counts no more than a gain, so the buyer is a plain expected-value calculator. X feels ${euro(Math.abs(gap))} ${gap < 0 ? "cheaper" : "dearer"} than Y${on.length === 0 ? `, close to its ${euro(Math.abs(priceList))} price advantage` : ""}. Loss aversion is what changes the result.`
          : gap > 0
            ? `X is ${euro(Math.abs(priceList))} cheaper on the price list, yet at weight ${weight} it feels ${euro(gap)} dearer than Y. The risk term is ${euro(riskX)} for X and ${euro(riskY)} for Y: the chance the buyer expects is higher for the unknown provider, and the weight multiplies it. That is how a dearer provider wins.`
            : `With ${on.map((id) => H_LEVERS.find((l) => l.id === id)!.label.toLowerCase()).join(" and ")}, X now feels ${euro(Math.abs(gap))} ${gap < 0 ? "cheaper" : "the same"} than Y. `}
        {on.length > 0 && others.length > 0 && (
          <>
            {" "}
            On its own each move changes X's felt cost by: {others.map((o) => `${H_LEVERS.find((l) => l.id === o.id)!.label.toLowerCase()} ${euroSigned(o.delta)}`).join("; ")}.
            {on.includes("cut") ? ` The price cut moves the number by exactly what it gives away (${euroSigned(x.price - HANSA.X.price)}); references and an exit clause move the risk term, which costs the seller far less than the margin.` : ""}
          </>
        )}
      </Insight>
    </div>
  );
}

/* ------------------------------------------------------------------ A4 · the decision path */

type BarrierKey = "fear" | "trust" | "proof" | "overload";
const PEN: Record<BarrierKey, [number, number, number]> = { fear: [10, 15, 25], trust: [0, 10, 25], proof: [0, 20, 15], overload: [0, 10, 15] };
const BASE = [30, 60, 90];
const LINE = 70;
const PHASES_A4: { id: "u" | "e" | "d"; name: string; question: string; forces: string; unanswered: string; job: string }[] = [
  {
    id: "u",
    name: "Uncertainty",
    question: "Do I need to change at all, and what could go wrong if I do?",
    forces: "Perceived risk, loss aversion, and the wish to keep things as they are.",
    unanswered: "The buyer keeps asking what happens if it fails, or postpones the first meeting.",
    job: "Make the downside clear and small. Do not discuss price yet.",
  },
  {
    id: "e",
    name: "Evaluation",
    question: "Who else like us has done this, and can I rely on these people?",
    forces: "Social proof, trust in the people, and the wish to compare.",
    unanswered: "The buyer asks for more references, more documents and a second interview.",
    job: "Give comparable, checkable proof and let the buyer meet the people who will deliver.",
  },
  {
    id: "d",
    name: "Decision",
    question: "Can I stand behind this if it goes wrong, and who signs with me?",
    forces: "Anticipated regret, accountability, and the effort of the last steps.",
    unanswered: "A verbal yes is followed by silence, or a new person appears at the last step.",
    job: "Cut the last steps down, name the owner on the buyer's side and keep the exit visible.",
  },
];

export function DecisionPath() {
  const uid = useId().replace(/:/g, "");
  const [off, setOff] = useState<BarrierKey[]>(["fear"]);
  const [phase, setPhase] = useState<"u" | "e" | "d">("u");
  const toggle = (k: BarrierKey) => setOff((c) => (c.includes(k) ? c.filter((x) => x !== k) : [...c, k]));
  const val = BASE.map((b, i) => Math.max(0, b - off.reduce((s, k) => s + PEN[k][i], 0)));
  const X = [110, 280, 450];
  const Y = (v: number) => 176 - (v / 100) * 150;
  const final = val[2];
  const lostAt = off.length ? [0, 1, 2].reduce((best, i) => (BASE[i] - val[i] > BASE[best] - val[best] ? i : best), 0) : -1;
  const short = LINE - final;
  const p = PHASES_A4.find((x) => x.id === phase)!;
  const NAMES: Record<BarrierKey, string> = { fear: "Fear unanswered", trust: "Trust unanswered", proof: "No proof", overload: "Too much to weigh" };
  const biggest = off.length ? off.reduce((a, b) => (PEN[b][2] > PEN[a][2] ? b : a)) : null;
  const named = off.map((k) => NAMES[k].toLowerCase());
  const joined = named.length > 1 ? `${named.slice(0, -1).join(", ")} and ${named[named.length - 1]}` : (named[0] ?? "");

  return (
    <div className="space-y-3">
      <svg viewBox="0 0 560 220" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{`Readiness to sign across the three phases`}</title>
        <desc id={`${uid}-d`}>{`Readiness is ${val[0]}% in uncertainty, ${val[1]}% in evaluation and ${val[2]}% at the decision. The signing line is at ${LINE}%. ${final >= LINE ? "The line is crossed." : `The deal stops ${short} points short.`}`}</desc>
        {PHASES_A4.map((ph, i) => (
          <g key={ph.id}>
            <rect x={X[i] - 84} y="4" width="168" height="24" rx="6" fill={ph.id === phase ? NAMED.soft : NAMED.mist} stroke={ph.id === phase ? NAMED.amber : NAMED.line} strokeWidth={ph.id === phase ? 2.2 : 1} />
            <text x={X[i]} y="21" textAnchor="middle" fontSize="13.5" fontWeight="700" fill={NAMED.ink}>{ph.name}</text>
          </g>
        ))}
        <line x1="20" x2="540" y1={Y(LINE)} y2={Y(LINE)} stroke={NAMED.rust} strokeWidth="1.8" strokeDasharray="6 4" />
        <text x="540" y={Y(LINE) - 5} textAnchor="end" fontSize="11.5" fontWeight="700" fill={NAMED.rust}>{`signing line ${LINE}%`}</text>
        <polyline points={BASE.map((v, i) => `${X[i]},${Y(v)}`).join(" ")} fill="none" stroke={NAMED.grey} strokeWidth="2" strokeDasharray="4 4" />
        <polyline points={val.map((v, i) => `${X[i]},${Y(v)}`).join(" ")} fill="none" stroke={NAMED.data} strokeWidth="4" strokeLinejoin="round" />
        {val.map((v, i) => (
          <g key={i}>
            <circle cx={X[i]} cy={Y(v)} r="6" fill={i === 2 && final < LINE ? NAMED.gold : NAMED.data} stroke={NAMED.ink} strokeWidth="1.5" />
            <text x={X[i]} y={Y(v) - 11} textAnchor="middle" fontSize="13" fontWeight="700" fill={NAMED.ink}>{`${v}%`}</text>
          </g>
        ))}
        <text x="20" y="212" fontSize="11.5" fill={NAMED.ash}>dashed grey = every question answered · solid = with the questions you left unanswered</text>
      </svg>

      <div className="space-y-1.5">
        <p className="smallcaps">Leave a question unanswered</p>
        <Toggles multi label="Unanswered questions" value={off} onChange={toggle} options={(Object.keys(PEN) as BarrierKey[]).map((k) => ({ id: k, label: NAMES[k] }))} />
      </div>
      <Insight>
        {off.length === 0
          ? `Every question is answered, so readiness climbs to ${val[2]}% at the decision and crosses the signing line. A deal that signs is the ordinary case, and it does not need a clever trick.`
          : final >= LINE
            ? `With ${joined} the line still reaches ${final}%, ${final - LINE} points above the signing line: the deal signs, but with less to spare. Add one more unanswered question and it will stop.`
            : `With ${joined} the line ends at ${final}%, ${short} point${short === 1 ? "" : "s"} short of ${LINE}%. Nobody says no. The deal is delayed at the last step, which is what “customers delay decisions” looks like. The biggest single cost is ${biggest ? NAMES[biggest].toLowerCase() : ""} at the decision (${biggest ? PEN[biggest][2] : 0} points), and the gap to the baseline is widest in the ${["uncertainty", "evaluation", "decision"][Math.max(lostAt, 0)]} phase. Barriers add up: two small unanswered questions can stop a deal that either alone would not.`}
      </Insight>
      <p className="text-caption text-ash">An illustration, not a measurement: the points are set for this teaching example. The 70% signing line is a Case assumption.</p>

      <div className="space-y-2 rounded-lg border border-line bg-paper p-3.5 text-caption">
        <p className="smallcaps">Read a phase</p>
        <Toggles<"u" | "e" | "d"> label="Phase" value={phase} onChange={setPhase} options={PHASES_A4.map((x) => ({ id: x.id, label: x.name }))} />
        <div aria-live="polite" className="space-y-1">
          <p>
            <span className="font-semibold text-ink">The buyer's question. </span>
            {p.question}
          </p>
          <p>
            <span className="font-semibold text-ink">The forces at work. </span>
            <Gloss>{p.forces}</Gloss>
          </p>
          <p>
            <span className="font-semibold text-ink">When it is unanswered. </span>
            {p.unanswered}
          </p>
          <p>
            <span className="font-semibold text-ink">The seller's job. </span>
            {p.job}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ A5 · worked tagging: Elbtal Systems */

const ELBTAL: { id: string; barrier: BarrierId; text: string; key: string; alt: BarrierId; altWhy: string }[] = [
  {
    id: "w1",
    barrier: "fear",
    text: "Contract sent. The buyer wrote: “Before we sign I need the exit terms in writing. If the rollout fails we must be able to step back.”",
    key: "If the rollout fails we must be able to step back",
    alt: "trust",
    altWhy: "The buyer does not question Elbtal's people. They want their own downside limited.",
  },
  {
    id: "w2",
    barrier: "trust",
    text: "Proposal stage. The buyer asked three times for our engineers' CVs and a second technical interview: “We are still not sure your people can do this.”",
    key: "not sure your people can do this",
    alt: "proof",
    altWhy: "The evidence is asked from Elbtal's own people, not from other customers.",
  },
  {
    id: "w3",
    barrier: "proof",
    text: "The buyer asked: “Do you have a customer in metal-working I can call?” We had none. The buyer went quiet.",
    key: "a customer in metal-working I can call",
    alt: "trust",
    altWhy: "The buyer wants a peer's experience, not a test of Elbtal's people.",
  },
  {
    id: "w4",
    barrier: "overload",
    text: "Our offer had eleven modules and four price lists. The buyer: “I cannot tell what we need.” They asked us to call back in autumn.",
    key: "I cannot tell what we need",
    alt: "inertia",
    altWhy: "“Call back in autumn” looks like no urgency, but it follows from being unable to choose. Overload is the cause and the delay is the symptom.",
  },
  {
    id: "w5",
    barrier: "inertia",
    text: "“Our current tool is fine. We will look again when the licence runs out in 14 months.” No incident, no deadline on the buyer's side.",
    key: "Our current tool is fine",
    alt: "overload",
    altWhy: "Nothing is too complex to choose. There is simply no reason to move yet.",
  },
  {
    id: "w6",
    barrier: "owner",
    text: "IT wants the service and finance wants a second offer. “Nobody will sign as project owner.”",
    key: "Nobody will sign as project owner",
    alt: "fear",
    altWhy: "It is not the outcome that is feared. It is being the person who signs.",
  },
];

function Marked({ text, mark }: { text: string; mark: string }) {
  const i = text.indexOf(mark);
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded bg-gold/40 px-0.5 font-semibold text-ink">{mark}</mark>
      {text.slice(i + mark.length)}
    </>
  );
}

export function BarrierExample() {
  const [sel, setSel] = useState("w1");
  const [seen, setSeen] = useState<string[]>(["w1"]);
  const w = ELBTAL.find((x) => x.id === sel)!;
  const b = BARRIERS[w.barrier];
  const alt = BARRIERS[w.alt];
  const pick = (id: string) => {
    setSel(id);
    setSeen((s) => (s.includes(id) ? s : [...s, id]));
  };
  return (
    <Diagram label="Worked example · six exit notes from Elbtal Systems, another vendor (Case assumption, read-only)">
      <ol className="grid gap-2 sm:grid-cols-2">
        {ELBTAL.map((n, i) => {
          const on = n.id === sel;
          const opened = seen.includes(n.id);
          return (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => pick(n.id)}
                aria-pressed={on}
                className={clsx("flex min-h-[48px] w-full flex-col items-start gap-1 rounded-lg border bg-paper px-3 py-2 text-left text-caption transition-colors", on ? "border-accent bg-accentSoft ring-2 ring-gold" : "border-line hover:border-ash")}
              >
                <span className="smallcaps">{`Note ${i + 1}`}</span>
                <span className="text-ink">{n.text}</span>
                {opened && <span className="pill border-signal/50 bg-signalSoft text-signal">{BARRIERS[n.barrier].short}</span>}
              </button>
            </li>
          );
        })}
      </ol>
      <div className="mt-3 space-y-1.5 rounded-lg border border-line bg-paper p-3 text-caption" aria-live="polite">
        <p className="smallcaps">
          Barrier: <span className="text-accent">{b.label}</span> · principle: {b.principle}
        </p>
        <p>
          <span className="font-semibold text-ink">The words that give it away. </span>
          <Marked text={w.text} mark={w.key} />
        </p>
        <p>
          <span className="font-semibold text-ink">The test question. </span>
          {b.test}
        </p>
        <p>
          <span className="font-semibold text-ink">Why not {alt.short}? </span>
          {w.altWhy}
        </p>
      </div>
      <Insight className="mt-3">
        Each note is settled by one phrase, the highlighted one, and by asking the test question of the barrier it points to. The tempting alternative is always a neighbour: worry about being trapped looks like a doubt about the vendor, and a request for evidence looks like a request for proof. When two fit, the pair tests above decide. You have opened {seen.length} of 6.
      </Insight>
    </Diagram>
  );
}

/* ------------------------------------------------------------------ A6 · strength: Elbtal's ten deals */

const E10: { id: BarrierId; notes: number; dropped: number }[] = [
  { id: "fear", notes: 4, dropped: 3 },
  { id: "trust", notes: 2, dropped: 1 },
  { id: "proof", notes: 2, dropped: 2 },
  { id: "overload", notes: 1, dropped: 0 },
  { id: "inertia", notes: 1, dropped: 0 },
];

export function StrengthExample() {
  const uid = useId().replace(/:/g, "");
  const [by, setBy] = useState<"count" | "points">("count");
  const [sel, setSel] = useState<BarrierId>("proof");
  const rows = E10.map((r) => ({ ...r, points: r.notes + r.dropped })).sort((a, b) => (by === "points" ? b.points - a.points || b.notes - a.notes : b.notes - a.notes));
  const cur = E10.find((r) => r.id === sel)!;
  const pts = cur.notes + cur.dropped;
  const rank = (k: "count" | "points") => [...E10].map((r) => ({ id: r.id, v: k === "points" ? r.notes + r.dropped : r.notes })).sort((a, b) => b.v - a.v).map((r) => BARRIERS[r.id].short);
  const S = (v: number) => 130 + (v / 8) * 380;
  return (
    <div className="space-y-3">
      <svg viewBox="0 0 560 200" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{`Strength of five barriers in Elbtal's ten reviewed deals`}</title>
        <desc id={`${uid}-d`}>{rows.map((r) => `${BARRIERS[r.id].short}: ${r.notes} notes, ${r.dropped} dropped out, ${r.points} points, ${STRENGTH_LABEL[strengthOf(r.points)]}`).join(". ")}</desc>
        {rows.map((r, i) => {
          const y = 8 + i * 36;
          const on = r.id === sel;
          const s = strengthOf(r.points);
          return (
            <g key={r.id}>
              <text x="4" y={y + 20} fontSize="13.5" fontWeight={on ? 800 : 700} fill={NAMED.ink}>{BARRIERS[r.id].short}</text>
              <rect x={S(0)} y={y + 4} width={S(r.notes) - S(0)} height="22" fill={NAMED.data} stroke={NAMED.ink} className="anim-grow-x" />
              {by === "points" && r.dropped > 0 && <rect x={S(r.notes)} y={y + 4} width={S(r.dropped) - S(0)} height="22" fill={NAMED.soft} stroke={NAMED.amber} strokeWidth="1.6" strokeDasharray="4 3" />}
              <text x={S(by === "points" ? r.points : r.notes) + 6} y={y + 20} fontSize="12.5" fontWeight="700" fill={NAMED.ink}>{by === "points" ? `${r.points} pts · ${STRENGTH_LABEL[s]}` : `${r.notes} notes`}</text>
              {on && <rect x="0" y={y} width="556" height="30" fill="none" stroke={NAMED.gold} strokeWidth="2" rx="4" />}
            </g>
          );
        })}
        <text x={S(0)} y="196" fontSize="11.5" fill={NAMED.ash}>solid = notes · dashed amber = of those, dropped out (added in “points”)</text>
      </svg>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <p className="smallcaps">Rank the barriers by</p>
          <Toggles<"count" | "points"> label="Ranking basis" value={by} onChange={setBy} options={[{ id: "count", label: "Notes only" }, { id: "points", label: "Notes + dropouts (points)" }]} />
        </div>
        <div className="space-y-1.5">
          <p className="smallcaps">Read one barrier</p>
          <Toggles<BarrierId> label="Barrier" value={sel} onChange={setSel} options={E10.map((r) => ({ id: r.id, label: BARRIERS[r.id].short }))} />
        </div>
      </div>
      <Insight>
        {`${BARRIERS[sel].short}: ${cur.notes} note${cur.notes > 1 ? "s" : ""} + ${cur.dropped} dropout${cur.dropped === 1 ? "" : "s"} = ${pts} points, which is ${STRENGTH_LABEL[strengthOf(pts)]}. `}
        {by === "count"
          ? `Counting notes only, the order is ${rank("count").join(", ")}. That puts Trust level with Proof.`
          : `Adding the dropouts, the order is ${rank("points").join(", ")}: Proof moves above Trust, because both of its notes ended in a cancelled deal and only one of Trust's did. A barrier that cancels deals is stronger than one that only delays them, even when it is not more frequent.`}
      </Insight>
      <div className="rounded-lg border border-line bg-paper p-3.5 text-caption">
        <p className="smallcaps">The rule</p>
        <Bul items={["Points = number of notes with the barrier + number of those that dropped out.", "5 or more points is High, 3 to 4 is Mid, 2 or fewer is Low.", "The four barriers with the most notes are the central patterns. Break a tie with the dropouts."]} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ A7 · scoring: Elbtal's three measures */

type EM = { id: string; name: string; cost: number; weeks: number; needs: string; inf: 1 | 2 | 3; fea: 1 | 2 | 3 };
const EM_START: EM[] = [
  { id: "p", name: "Peer visit programme", cost: 20000, weeks: 6, needs: "Three customers agree to host a visit.", inf: 3, fea: 2 },
  { id: "q", name: "Exit clause as standard", cost: 18000, weeks: 3, needs: "Legal and finance approve once.", inf: 3, fea: 2 },
  { id: "r", name: "Price promotion", cost: 15000, weeks: 1, needs: "Sales can start at once.", inf: 1, fea: 3 },
];
const BUD_E = 50000;

export function ScoreExample() {
  const uid = useId().replace(/:/g, "");
  const [rows, setRows] = useState(EM_START);
  const [inc, setInc] = useState<string[]>(["p", "q", "r"]);
  const cycle = (id: string, f: "inf" | "fea") => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [f]: ((r[f] % 3) + 1) as 1 | 2 | 3 } : r)));
  const toggle = (id: string) => setInc((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  const scored = rows.map((r) => ({ ...r, spd: speedBucket(r.weeks), score: r.inf * r.fea * speedBucket(r.weeks) }));
  const chosen = scored.filter((r) => inc.includes(r.id));
  const total = chosen.reduce((s, r) => s + r.cost, 0);
  const over = total - BUD_E;
  const lowest = [...chosen].sort((a, b) => a.score - b.score)[0];
  const S = (v: number) => 8 + (v / (BUD_E * 1.3)) * 544;
  let acc = 0;
  const segs = chosen.map((r) => {
    const s = { r, from: acc, to: acc + r.cost };
    acc += r.cost;
    return s;
  });
  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[36rem] border-collapse text-caption">
          <caption className="sr-only">Three measures of Elbtal Systems scored on influence, feasibility and speed</caption>
          <thead>
            <tr className="bg-mist text-left text-micro uppercase text-ash">
              <th className="px-3 py-2">In the plan</th>
              <th className="px-3 py-2">Measure</th>
              <th className="px-3 py-2">Cost · weeks</th>
              <th className="px-3 py-2">Influence</th>
              <th className="px-3 py-2">Feasibility</th>
              <th className="px-3 py-2">Speed</th>
              <th className="px-3 py-2 text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {scored.map((r) => (
              <tr key={r.id} className={clsx("border-t border-line align-top", !inc.includes(r.id) && "opacity-60")}>
                <td className="px-3 py-2">
                  <input type="checkbox" checked={inc.includes(r.id)} onChange={() => toggle(r.id)} aria-label={`Include ${r.name}`} className="h-5 w-5 accent-[#8A5A0B]" />
                </td>
                <td className="px-3 py-2">
                  <span className="font-semibold">{r.name}</span>
                  <br />
                  <span className="text-ash">{r.needs}</span>
                </td>
                <td className="tnum px-3 py-2">
                  {euro(r.cost)} · {r.weeks} wk
                </td>
                <td className="px-3 py-2">
                  <button type="button" onClick={() => cycle(r.id, "inf")} className="btn-ghost btn-sm min-w-[3rem]" aria-label={`Influence of ${r.name}: ${r.inf}. Click to change.`}>
                    {r.inf}
                  </button>
                </td>
                <td className="px-3 py-2">
                  <button type="button" onClick={() => cycle(r.id, "fea")} className="btn-ghost btn-sm min-w-[3rem]" aria-label={`Feasibility of ${r.name}: ${r.fea}. Click to change.`}>
                    {r.fea}
                  </button>
                </td>
                <td className="tnum px-3 py-2">{r.spd}</td>
                <td className="tnum px-3 py-2 text-right font-bold">{r.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <svg viewBox="0 0 560 84" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{`Budget check against ${euro(BUD_E)}`}</title>
        <desc id={`${uid}-d`}>{`${chosen.length} measures in the plan cost ${euro(total)} against a budget of ${euro(BUD_E)}${over > 0 ? `, ${euro(over)} over` : ""}.`}</desc>
        <defs>
          <pattern id={`${uid}-over`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="7" height="7" fill={NAMED.soft} />
            <line x1="0" y1="0" x2="0" y2="7" stroke={NAMED.amber} strokeWidth="2.8" />
          </pattern>
        </defs>
        <rect x={S(0)} y="22" width={S(BUD_E * 1.3) - S(0)} height="30" fill={NAMED.mist} stroke={NAMED.line} />
        {segs.map(({ r, from, to }, i) => (
          <g key={r.id}>
            <rect x={S(from)} y="22" width={S(to) - S(from)} height="30" fill={i % 2 ? NAMED.grey : NAMED.data} stroke={NAMED.ink} />
            <text x={S(from) + (S(to) - S(from)) / 2} y="42" textAnchor="middle" fontSize="12.5" fontWeight="700" fill={NAMED.paper}>{r.name.split(" ")[0]}</text>
          </g>
        ))}
        {over > 0 && <rect x={S(BUD_E)} y="22" width={S(total) - S(BUD_E)} height="30" fill={`url(#${uid}-over)`} stroke={NAMED.amber} strokeWidth="1.6" />}
        <line x1={S(BUD_E)} x2={S(BUD_E)} y1="12" y2="62" stroke={NAMED.ink} strokeWidth="2.2" />
        <text x={S(BUD_E)} y="9" textAnchor="middle" fontSize="12.5" fontWeight="700" fill={NAMED.ink}>{`Budget ${euro(BUD_E)}`}</text>
        <text x="8" y="78" fontSize="12" fill={NAMED.ash}>{`Plan ${euro(total)}`}</text>
        {over > 0 && <text x="552" y="78" textAnchor="end" fontSize="12.5" fontWeight="700" fill={NAMED.amber}>{`${euro(over)} over`}</text>}
      </svg>
      <Insight>
        {over > 0
          ? `The plan costs ${euro(total)}, which is ${euro(over)} over the ${euro(BUD_E)} budget. The rule is to leave out the measure with the lowest score, which here is ${lowest ? `“${lowest.name}” with ${lowest.score}` : "none"}. `
          : `The plan costs ${euro(total)} and fits the ${euro(BUD_E)} budget with ${euro(-over)} to spare. `}
        {`The score multiplies three numbers, so a 1 in any of them pulls it down hard: 3 × 3 × 1 is 9, but 2 × 2 × 2 is 8. Speed comes from the weeks by the rule (4 weeks or fewer is 3, 5 to 8 is 2, more than 8 is 1), so you do not judge it. Change a number and watch which measure leads.`}
      </Insight>
    </div>
  );
}

