/**
 * Route 2 (Level 3) data: the Transfer Project. SecureIT Systems' Chief Sales Officer decides how to manage customer
 * decisions as a system. Every figure below is a Case assumption (the prompt gives the role, the situation and the
 * constraints, not numbers). `truth` / `accept` / model values are used only by the checks, the answer keys and the
 * worked answers; they are never printed to a learner.
 */

export const R2_BUDGET = 120000;
export const R2_MONTHS = 6;

/* ------------------------------------------------------------------ 3.1 · central influencing factors */

export type FactorId = "trust" | "risk" | "emotion" | "proof" | "habit" | "reciprocity";
export const FACTOR_IDS: FactorId[] = ["trust", "risk", "emotion", "proof", "habit", "reciprocity"];
export const FACTORS: Record<FactorId, { id: FactorId; name: string; means: string; showsUp: string }> = {
  trust: {
    id: "trust",
    name: "Trust",
    means: "The buyer's willingness to depend on the vendor's people: their ability, their care and their word.",
    showsUp: "The buyer asks to meet the engineers, repeats technical checks, or says “we never got to know the people”.",
  },
  risk: {
    id: "risk",
    name: "Perceived risk",
    means: "What the buyer expects to lose if the choice is wrong, with a loss counted about twice as heavily as an equal gain (loss aversion).",
    showsUp: "The buyer asks how to get out, asks what happens if the migration fails, or wants to wait a quarter.",
  },
  emotion: {
    id: "emotion",
    name: "Emotion (felt safety)",
    means: "How calm or uneasy the buyer feels about the decision. It is felt first, and a reason is often found afterwards.",
    showsUp: "The buyer says they “felt calmer” with another vendor, or hesitates without being able to say why.",
  },
  proof: {
    id: "proof",
    name: "Social proof",
    means: "What comparable others have done. The buyer looks to peers when unsure, and needs something to tell their own board.",
    showsUp: "The buyer asks “who else like us uses you?” and stops replying when there is no name to give.",
  },
  habit: {
    id: "habit",
    name: "Habit and inertia",
    means: "The pull of the present way of working. Change has visible costs and its benefit is not yet visible.",
    showsUp: "The buyer says “it works, nothing has gone wrong” and puts the decision into the next budget round.",
  },
  reciprocity: {
    id: "reciprocity",
    name: "Reciprocity",
    means: "The felt wish to return what was given. A useful favour, given first, makes the buyer more willing to engage.",
    showsUp: "The buyer accepts an offered check or workshop and then agrees to a longer conversation.",
  },
};
export const FACTOR_MUST: FactorId[] = ["trust", "risk"];

/* ------------------------------------------------------------------ 3.2 · the control model */

export type PhaseId = "uncertainty" | "evaluation" | "decision";
export const PHASE_IDS: PhaseId[] = ["uncertainty", "evaluation", "decision"];

export type ModelOption = { id: string; label: string };
export type ModelPhase = {
  id: PhaseId;
  name: string;
  /** One line for the row heading. */
  hint: string;
  questions: ModelOption[];
  questionTruth: string;
  /** The factors that defend as dominant in this phase. */
  factorAccept: FactorId[];
  signals: ModelOption[];
  signalTruth: string;
  why: string;
};

export const MODEL_PHASES: ModelPhase[] = [
  {
    id: "uncertainty",
    name: "Uncertainty",
    hint: "The buyer does not yet know whether to act, or what could go wrong.",
    questions: [
      { id: "u1", label: "Do I need to change at all, and what could go wrong if I do?" },
      { id: "u2", label: "Which of the three price tiers gives the best value?" },
      { id: "u3", label: "Where do I sign?" },
    ],
    questionTruth: "u1",
    factorAccept: ["risk", "emotion"],
    signals: [
      { id: "us1", label: "The buyer asks what happens if it fails, or asks for exit terms." },
      { id: "us2", label: "The buyer asks for the product brochure." },
      { id: "us3", label: "The buyer agrees to a demo." },
    ],
    signalTruth: "us1",
    why: "In the first phase the buyer is weighing loss against gain. Questions about failure and exit show that perceived risk, and the feeling of unease, are doing the work.",
  },
  {
    id: "evaluation",
    name: "Evaluation",
    hint: "The buyer compares providers and looks for evidence.",
    questions: [
      { id: "e1", label: "Who else like us has done this, and can I rely on these people?" },
      { id: "e2", label: "Do I need to do anything at all?" },
      { id: "e3", label: "How do I get this signed today?" },
    ],
    questionTruth: "e1",
    factorAccept: ["proof", "trust"],
    signals: [
      { id: "es1", label: "The buyer asks who else uses you and asks to speak to them." },
      { id: "es2", label: "The buyer asks for a price cut." },
      { id: "es3", label: "The buyer sends a thank-you note." },
    ],
    signalTruth: "es1",
    why: "Comparing needs evidence. Buyers look to comparable others (social proof) and test the people who would deliver (trust).",
  },
  {
    id: "decision",
    name: "Decision",
    hint: "The buyer is close to signing and has to stand behind the choice.",
    questions: [
      { id: "d1", label: "Can I stand behind this if it goes wrong, and who signs with me?" },
      { id: "d2", label: "What do I actually need?" },
      { id: "d3", label: "Which vendors exist on the market?" },
    ],
    questionTruth: "d1",
    factorAccept: ["trust", "risk"],
    signals: [
      { id: "ds1", label: "The buyer goes quiet after a verbal yes, or asks for more time at the last step." },
      { id: "ds2", label: "The buyer asks for a longer feature list." },
      { id: "ds3", label: "The buyer asks for a second demo of a module they already saw." },
    ],
    signalTruth: "ds1",
    why: "At the last step the anticipated regret and the wish not to be the one who signed return. A stall after a yes is the visible sign; the notes in Route 1 show ten of twelve deals stopping after a verbal yes or later.",
  },
];
export const PHASE_BY_ID = Object.fromEntries(MODEL_PHASES.map((p) => [p.id, p])) as Record<PhaseId, ModelPhase>;

/* ------------------------------------------------------------------ 3.3 · strategic levers */

export type LeverId = "reference-kit" | "safety-terms" | "deal-partner" | "decision-kit" | "training" | "signals" | "discount" | "urgency";
export const LEVER_IDS: LeverId[] = ["reference-kit", "safety-terms", "deal-partner", "decision-kit", "training", "signals", "discount", "urgency"];

export type Depends = "people" | "process" | "rule";
export type CostShape = "one-off" | "per seller" | "per deal";
export type Bucket = 1 | 2 | 3;
export type Criterion = "reach" | "depth" | "durability" | "scale";
export const CRITERIA: { id: Criterion; name: string; test: string; low: string; high: string }[] = [
  { id: "reach", name: "Reach", test: "How many deals does it touch?", low: "Only some deals (a size threshold, a segment).", high: "Every deal that enters the process." },
  { id: "depth", name: "Depth", test: "How strongly does it change the behaviour in one deal?", low: "A small nudge on one barrier.", high: "It removes the reason the buyer was stopping." },
  { id: "durability", name: "Durability", test: "Does it still work when the seller changes or the campaign ends?", low: "It depends on individual sellers or a campaign.", high: "It is built into the process or a rule." },
  { id: "scale", name: "Scale", test: "Does the cost per additional deal fall as volume grows?", low: "The cost repeats with every deal.", high: "A one-off cost that serves every deal." },
];

export type Lever = {
  id: LeverId;
  name: string;
  what: string;
  /** Level of intervention, taught in Materi B1. */
  level: "argument" | "interaction" | "process" | "structure";
  depends: Depends;
  costShape: CostShape;
  /** True when it applies to every deal, false when only to some. */
  reachAll: boolean;
  cost: number;
  weeks: number;
  /** The barrier or factor it acts on, in words. */
  acts: string;
  /** Model ratings (reference answer). */
  model: Record<Criterion, Bucket>;
  note: string;
};

export const LEVERS: Lever[] = [
  {
    id: "reference-kit",
    name: "Standard reference kit",
    what: "Every prospect gets two matching references and a peer call before the proposal, as a step of the process.",
    level: "process",
    depends: "process",
    costShape: "one-off",
    reachAll: true,
    cost: 30000,
    weeks: 6,
    acts: "What comparable others did (social proof) and who can be trusted.",
    model: { reach: 3, depth: 2, durability: 3, scale: 3 },
    note: "Built into the process, so it survives a change of seller. The cost is the set-up; each extra deal costs one call.",
  },
  {
    id: "safety-terms",
    name: "Buyer-safety terms as standard",
    what: "An exit clause, a phased go-live and a rollback plan written into every contract.",
    level: "structure",
    depends: "rule",
    costShape: "one-off",
    reachAll: true,
    cost: 40000,
    weeks: 8,
    acts: "How large and how reversible the buyer's downside is (loss aversion).",
    model: { reach: 3, depth: 3, durability: 3, scale: 3 },
    note: "A rule, so every deal gets it. It removes the reason most dropouts gave. It needs legal and finance work once.",
  },
  {
    id: "deal-partner",
    name: "Named deal partner on large deals",
    what: "A delivery engineer joins the buyer's team from the verbal yes, on every deal above €60,000.",
    level: "interaction",
    depends: "people",
    costShape: "per deal",
    reachAll: false,
    cost: 60000,
    weeks: 4,
    acts: "Personal trust in the people who deliver, and a guide through the decision.",
    model: { reach: 2, depth: 3, durability: 1, scale: 1 },
    note: "Strong in the deals it reaches and it works fast, but it depends on individual engineers and its cost repeats with every deal.",
  },
  {
    id: "decision-kit",
    name: "Decision-simplification kit",
    what: "Three fixed packages, one standard contract and a one-page decision paper for every proposal.",
    level: "process",
    depends: "process",
    costShape: "one-off",
    reachAll: true,
    cost: 20000,
    weeks: 5,
    acts: "How heavy the decision is to make (cognitive load).",
    model: { reach: 3, depth: 2, durability: 3, scale: 3 },
    note: "A default the process applies to every proposal, so the easy choice becomes the standard one.",
  },
  {
    id: "training",
    name: "Seller training in buyer psychology",
    what: "A two-day workshop and monthly call coaching for the eight sellers.",
    level: "interaction",
    depends: "people",
    costShape: "per seller",
    reachAll: true,
    cost: 35000,
    weeks: 8,
    acts: "How each seller reads and answers a buyer's unspoken worry.",
    model: { reach: 3, depth: 2, durability: 1, scale: 2 },
    note: "It reaches every seller's deals, but the skill leaves with the seller and every new seller has to be trained again.",
  },
  {
    id: "signals",
    name: "Behaviour signals in the CRM and a weekly deal review",
    what: "Five buyer-behaviour signals recorded on every deal and read in a weekly review, so a stall is seen while it can still be answered.",
    level: "structure",
    depends: "rule",
    costShape: "one-off",
    reachAll: true,
    cost: 25000,
    weeks: 6,
    acts: "How early SecureIT sees a stall. It does not change the buyer; it changes what the seller does about it.",
    model: { reach: 3, depth: 1, durability: 3, scale: 3 },
    note: "Every deal is covered and it lasts, but it does not by itself change a buyer's behaviour. It is the lever that lets you see whether the others work.",
  },
  {
    id: "discount",
    name: "Quarter-end discount campaign",
    what: "10% off for every deal signed before quarter end.",
    level: "argument",
    depends: "rule",
    costShape: "per deal",
    reachAll: true,
    cost: 50000,
    weeks: 1,
    acts: "The price. It leaves fear, trust and proof where they were.",
    model: { reach: 3, depth: 1, durability: 1, scale: 1 },
    note: "The margin is paid on every deal, including those that would have signed. Buyers learn to wait for the next quarter end.",
  },
  {
    id: "urgency",
    name: "Urgency messaging",
    what: "Limited-time offers on every proposal.",
    level: "argument",
    depends: "people",
    costShape: "one-off",
    reachAll: true,
    cost: 5000,
    weeks: 1,
    acts: "The felt cost of waiting. On a high-risk decision it also raises fear and resistance.",
    model: { reach: 3, depth: 1, durability: 1, scale: 3 },
    note: "Cheap and fast, and it pushes on a decision that is stalled by fear. A deadline that is not real is a misleading claim (§ 5 UWG).",
  },
];
export const LEVER_BY_ID = Object.fromEntries(LEVERS.map((l) => [l.id, l])) as Record<LeverId, Lever>;
export const LEVER_CHOOSE = 3;
export const isSystemic = (id: LeverId) => LEVER_BY_ID[id].level === "process" || LEVER_BY_ID[id].level === "structure";
export const LEVEL_LABEL = { argument: "Argument", interaction: "Interaction", process: "Process", structure: "Structure" } as const;
export const DEPENDS_LABEL: Record<Depends, string> = { people: "Individual people", process: "The process", rule: "A rule" };
export const MODEL_LEVERS: LeverId[] = ["safety-terms", "reference-kit", "decision-kit"];

/** The rule a rating must not contradict (Materi B2). A rating above the maximum is outlined by a Check. */
export function maxRating(id: LeverId, c: Criterion): Bucket {
  const l = LEVER_BY_ID[id];
  if (c === "reach") return l.reachAll ? 3 : 2;
  if (c === "durability") return l.depends === "people" ? 1 : 3;
  if (c === "scale") return l.costShape === "per deal" ? 1 : l.costShape === "per seller" ? 2 : 3;
  return 3;
}
export const leverModelTotal = (id: LeverId) => Object.values(LEVER_BY_ID[id].model).reduce((s, v) => s + v, 0);

/* ------------------------------------------------------------------ 3.4 · risks of misjudging customer psychology */

export type RiskId = "price" | "stated" | "refs" | "pressure" | "centre" | "pilot" | "competitor" | "gaming";
export const RISK_IDS: RiskId[] = ["price", "stated", "refs", "pressure", "centre", "pilot", "competitor", "gaming"];

export type Risk = {
  id: RiskId;
  name: string;
  weAssume: string;
  mayBeTrue: string;
  /** True when it is a misjudgment of customer psychology (what Block 3.4 asks for). */
  psychology: boolean;
  signals: ModelOption[];
  signalTruth: string;
  /** Model likelihood and impact. */
  model: { likelihood: Bucket; impact: Bucket };
  why: string;
};

export const RISKS: Risk[] = [
  {
    id: "price",
    name: "We treat price as the reason",
    weAssume: "Buyers decide on price, so a lower price wins the deal.",
    mayBeTrue: "Buyers decide on felt risk. A discount is paid on deals that would have signed and does not touch fear, trust or proof.",
    psychology: true,
    signals: [
      { id: "ps1", label: "Discount requests rise but the signature rate does not." },
      { id: "ps2", label: "Competitors publish new price lists." },
      { id: "ps3", label: "Proposals get longer." },
    ],
    signalTruth: "ps1",
    model: { likelihood: 3, impact: 2 },
    why: "Route 1 found price named in none of twelve notes. A price-first reading is the most natural mistake for a sales team.",
  },
  {
    id: "stated",
    name: "We take stated reasons at face value",
    weAssume: "When a buyer says “no budget” or “bad timing”, that is the reason.",
    mayBeTrue: "The stated reason is often the acceptable one. Behind it sits a fear, a doubt or a missing owner.",
    psychology: true,
    signals: [
      { id: "st1", label: "The same objection returns after we thought we had solved it." },
      { id: "st2", label: "Buyers ask for a discount." },
      { id: "st3", label: "Sales cycles get shorter." },
    ],
    signalTruth: "st1",
    model: { likelihood: 3, impact: 3 },
    why: "If the real barrier is not found, the measure answers the wrong one. It is the risk that makes all the others invisible.",
  },
  {
    id: "refs",
    name: "The references misfire",
    weAssume: "Any reference builds proof.",
    mayBeTrue: "A reference that is not comparable, or that the buyer cannot verify, gives little or none, and one that is overstated damages trust.",
    psychology: true,
    signals: [
      { id: "rf1", label: "Reference calls happen, but the deal does not move afterwards." },
      { id: "rf2", label: "More prospects open the reference page." },
      { id: "rf3", label: "The reference customers renew their contracts." },
    ],
    signalTruth: "rf1",
    model: { likelihood: 2, impact: 2 },
    why: "Social proof is only as strong as the similarity of the person who gives it.",
  },
  {
    id: "pressure",
    name: "Pressure triggers resistance",
    weAssume: "A deadline gets a stalled buyer moving.",
    mayBeTrue: "On a complex, high-risk decision a push raises fear and the wish to resist being pushed. The buyer steps back.",
    psychology: true,
    signals: [
      { id: "pr1", label: "Replies get shorter, or stop, after a deadline message." },
      { id: "pr2", label: "Buyers ask for the contract earlier." },
      { id: "pr3", label: "The number of proposals sent goes up." },
    ],
    signalTruth: "pr1",
    model: { likelihood: 2, impact: 3 },
    why: "The tactic that looks fastest is the one that most often turns a delay into a cancellation.",
  },
  {
    id: "centre",
    name: "We assume one person decides",
    weAssume: "Our contact is the buyer and can say yes.",
    mayBeTrue: "A group decides, and each member can say no. Somebody who was never met arrives late and stops the deal.",
    psychology: true,
    signals: [
      { id: "cn1", label: "New names appear on the buyer's side in the last two weeks." },
      { id: "cn2", label: "The buyer asks for a longer feature list." },
      { id: "cn3", label: "The buyer's contact goes on holiday." },
    ],
    signalTruth: "cn1",
    model: { likelihood: 3, impact: 2 },
    why: "Route 1 found a whole deal lost because nobody would own the decision. It is common in complex purchases.",
  },
  {
    id: "pilot",
    name: "A pilot is mistaken for a decision",
    weAssume: "A pilot is a step to the signature.",
    mayBeTrue: "A buyer who fears a wrong decision can use a pilot to postpone it. The pilot becomes the new status quo.",
    psychology: true,
    signals: [
      { id: "pl1", label: "Pilots are extended with no date for a decision." },
      { id: "pl2", label: "Pilots start faster than before." },
      { id: "pl3", label: "Pilot users give positive feedback." },
    ],
    signalTruth: "pl1",
    model: { likelihood: 2, impact: 2 },
    why: "A staged start is a fair tool; a start with no end and no threshold is a way of not deciding.",
  },
  {
    id: "competitor",
    name: "A competitor cuts prices by 15%",
    weAssume: "—",
    mayBeTrue: "—",
    psychology: false,
    signals: [
      { id: "cp1", label: "Buyers quote the competitor's price." },
      { id: "cp2", label: "Sales cycles get shorter." },
      { id: "cp3", label: "Reference calls go up." },
    ],
    signalTruth: "cp1",
    model: { likelihood: 2, impact: 2 },
    why: "A real market risk, but not a misjudgment of customer psychology: nothing here is about what SecureIT assumed the buyer feels.",
  },
  {
    id: "gaming",
    name: "Sellers log the signals but do not act",
    weAssume: "—",
    mayBeTrue: "—",
    psychology: false,
    signals: [
      { id: "gm1", label: "The signals are complete but nothing changes in the deals." },
      { id: "gm2", label: "The CRM is updated on Mondays." },
      { id: "gm3", label: "Deals get bigger." },
    ],
    signalTruth: "gm1",
    model: { likelihood: 2, impact: 2 },
    why: "An execution risk of the new system, not a misjudgment of the customer's psychology.",
  },
];
export const RISK_BY_ID = Object.fromEntries(RISKS.map((r) => [r.id, r])) as Record<RiskId, Risk>;
export const RISK_CHOOSE = 3;
export const MODEL_RISKS: RiskId[] = ["stated", "price", "pressure"];

/* ------------------------------------------------------------------ 3.5 · measures architecture */

export type OwnerId = "cso" | "salesops" | "teamlead" | "legal" | "cs" | "marketing" | "delivery";
export const OWNER_IDS: OwnerId[] = ["cso", "salesops", "teamlead", "legal", "cs", "marketing", "delivery"];
export const OWNERS: Record<OwnerId, { id: OwnerId; name: string; profile: string }> = {
  cso: { id: "cso", name: "Chief Sales Officer (you)", profile: "Decides across sales and marketing and answers to the board. Should hold few items, or the decisions queue up at one desk." },
  salesops: { id: "salesops", name: "Head of Sales Operations", profile: "Owns the CRM, the deal process, the reports and the standard documents." },
  teamlead: { id: "teamlead", name: "Sales team lead", profile: "Leads a group of sellers day to day, runs the reviews and coaches. Cannot change contracts or systems." },
  legal: { id: "legal", name: "Legal counsel", profile: "Owns contract terms and what may be promised. Cannot change how sellers work." },
  cs: { id: "cs", name: "Customer success lead", profile: "Holds the relationships with existing customers and can ask them for references." },
  marketing: { id: "marketing", name: "Marketing lead", profile: "Owns the written material, the website and the packaging of offers." },
  delivery: { id: "delivery", name: "Delivery director", profile: "Owns the engineers' time and the delivery plan." },
};

export type ArchId = LeverId;
/** Owners who defend for each item (reference answer). */
export const OWNER_ACCEPT: Record<LeverId, OwnerId[]> = {
  "reference-kit": ["cs", "marketing"],
  "safety-terms": ["legal", "cso"],
  "deal-partner": ["delivery"],
  "decision-kit": ["salesops", "marketing"],
  training: ["teamlead", "cso"],
  signals: ["salesops"],
  discount: ["cso", "teamlead"],
  urgency: ["teamlead", "marketing"],
};
/** The enabling item that is always offered besides the three chosen levers. */
export const ENABLERS: LeverId[] = ["signals", "training"];

/** The items of the architecture grid: the learner's three levers, then the enabling items not already among them. */
export function archItems(levers: (LeverId | null)[]): LeverId[] {
  const chosen = levers.filter((l): l is LeverId => l !== null);
  return [...chosen, ...ENABLERS.filter((e) => !chosen.includes(e))];
}

export const MODEL_ARCH: LeverId[] = ["safety-terms", "reference-kit", "decision-kit", "signals"];
export const MODEL_START: Partial<Record<LeverId, number>> = { signals: 1, "reference-kit": 1, "decision-kit": 2, "safety-terms": 2 };
export const MODEL_TRIGGER: Partial<Record<LeverId, string>> = {
  signals: "If fewer than 80% of open deals have all five signals recorded by month 2, the weekly review stops and the CRM set-up is fixed first.",
  "reference-kit": "If fewer than 60% of proposals have a reference call before they are sent by month 3, the kit is reviewed with the customer success lead.",
  "decision-kit": "If the median time from proposal to decision is still above 30 days at month 4, the packages are cut to two.",
  "safety-terms": "If the signature rate after a verbal yes is below 70% at month 4, the exit terms are widened and legal reviews the wording.",
};

/* ------------------------------------------------------------------ 3.6 · the decision */

export type DecisionId = "commit" | "stage" | "wait";
export const DECISIONS: { id: DecisionId; label: string; detail: string; why: string; rejected: string }[] = [
  {
    id: "commit",
    label: "Commit now",
    detail: "Fund the whole architecture and roll it out to every deal from month 1.",
    why: "It starts every effect as early as possible and it is the boldest answer. It defends only if almost everything in it can be undone.",
    rejected: "Most of the money is spent in months 1 and 2, on assumptions about how customers will react that nobody has tested. Nothing tells you early that it is not working.",
  },
  {
    id: "stage",
    label: "Stage it, with a tripwire",
    detail: "Start with the deals already in the pipeline, set a tripwire for month 3, and scale to all segments only if it is met.",
    why: "It decides now, spends in steps and lets the customers' first reactions steer the rest. The tripwire turns unclear reactions into a defined trigger.",
    rejected: "",
  },
  {
    id: "wait",
    label: "Wait for more research",
    detail: "Hold the budget and run three more months of customer research first.",
    why: "",
    rejected: "Waiting is also a decision, and it lets the stalling continue for three more months while the competition moves. The brief asks for a decision before the reactions are known.",
  },
];
export const MODEL_DECISION: DecisionId = "stage";

export type KpiId = "signature" | "days" | "refcall" | "owner" | "emails";
export const KPIS: { id: KpiId; label: string; unit: string; baseline: number; better: "up" | "down"; behaviour: boolean }[] = [
  { id: "signature", label: "Signature rate after a verbal yes", unit: "%", baseline: 60, better: "up", behaviour: true },
  { id: "days", label: "Median days from proposal to decision", unit: "days", baseline: 41, better: "down", behaviour: true },
  { id: "refcall", label: "Proposals with a reference call before they are sent", unit: "%", baseline: 10, better: "up", behaviour: true },
  { id: "owner", label: "Deals with a named owner on the buyer's side", unit: "%", baseline: 30, better: "up", behaviour: true },
  { id: "emails", label: "Emails sent per deal", unit: "emails", baseline: 14, better: "up", behaviour: false },
];
export const KPI_BY_ID = Object.fromEntries(KPIS.map((k) => [k.id, k])) as Record<KpiId, (typeof KPIS)[number]>;
export const MODEL_TRIPWIRE = { kpi: "signature" as KpiId, threshold: 70, month: 3 };

export const R2_BASELINE_NOTE =
  "Baselines are Case assumptions from the last twelve months of SecureIT's own pipeline review.";

/** The board's challenge in Block 3.6. */
export const BOARD_CHALLENGE =
  "It is month 2. The customers you assumed would react well to the reference calls react the other way: the calls happen, but the deals do not move. The board asks what you do with the rest of the budget.";
