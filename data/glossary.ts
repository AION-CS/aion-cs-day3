/**
 * Plain-language glossary. Every technical term, abbreviation or German word that the material or a task uses is an entry here.
 * In the text it becomes a dotted link; a click opens the explanation. Write for someone who is NOT an expert: short sentences,
 * everyday words, one example where it helps.
 *
 * `match` lists every way the term is written. An all-capitals match ("CRM") is matched exactly, so ordinary words never turn
 * into links. Set `exactCase` when an ordinary word must only link in its written form.
 */
export type GlossEntry = {
  id: string;
  /** Heading of the explanation. */
  title: string;
  match: string[];
  /** Link only when the text is written exactly as in `match`. */
  exactCase?: boolean;
  /** The explanation, in the simplest words. */
  plain: string;
  example?: string;
  /** Where the idea comes from, when it is a named framework or law. */
  from?: string;
};

export const GLOSSARY: GlossEntry[] = [
  // --- loyalty and retention ------------------------------------------------
  {
    id: "loyalty",
    title: "Loyalty",
    match: ["loyalty", "loyal"],
    plain: "A customer who would choose you again even if leaving were easy. It is not the same as buying again: a customer can keep buying out of habit or because switching is a hassle, and still not be loyal.",
    example: "A customer who stays only because the contract auto-renews is retained, not loyal.",
    from: "Dick & Basu 1994",
  },
  {
    id: "retention",
    title: "Retention",
    match: ["retention", "retained"],
    plain: "Keeping customers from one period to the next. It says nothing about why they stay: it can be loyalty, habit or a contract.",
  },
  {
    id: "prospect",
    title: "Prospect",
    match: ["prospect", "prospects"],
    plain: "A company that might buy from you but has not yet signed. Prospects are what a sales funnel is made of.",
  },
  {
    id: "abandonment",
    title: "Abandonment rate",
    match: ["abandonment rate", "abandon", "abandonment"],
    plain: "The share of prospects who stop the purchase before they sign. “A high abandonment rate before contract closing” means many deals go far and then fall through.",
    example: "If 10 buyers get to the contract stage and 4 drop out, the abandonment rate at that stage is 40%.",
  },
  {
    id: "verbal-yes",
    title: "Verbal yes",
    match: ["verbal yes"],
    plain: "The buyer says yes in a meeting or a call, but nothing is signed yet. It is a good sign and it is not a signature: a verbal yes can still be taken back.",
  },
  {
    id: "mittelstand",
    title: "Mittelstand (mid-sized companies)",
    match: ["Mittelstand"],
    exactCase: true,
    plain: "The German word for the backbone of the economy: mid-sized, often family-owned companies. They usually have a small IT team, so one person can carry a large share of a security decision.",
  },
  {
    id: "kpi",
    title: "KPI — key performance indicator",
    match: ["KPI", "KPIs"],
    plain: "One number that shows whether something is working, such as the share of proposals that have a reference call. A good KPI is about behaviour you can act on.",
  },
  {
    id: "crm",
    title: "CRM — customer relationship management system",
    match: ["CRM"],
    plain: "The software in which a sales team records every deal: who the contacts are, what was said, what the next step is. It is where behaviour signals would be recorded.",
  },
  {
    id: "cso",
    title: "Chief Sales Officer",
    match: ["Chief Sales Officer", "CSO"],
    plain: "The senior manager who answers for the whole sales function and reports to the board. In Route 2 you decide across sellers, marketing and contracts, not inside one deal.",
  },
  {
    id: "baseline",
    title: "Baseline",
    match: ["baseline", "baselines"],
    plain: "How things stand before you change anything. Without a baseline you cannot tell whether a change worked.",
    example: "If 60% of verbal yeses sign today, 60% is the baseline. A result of 70% in month 3 is then a real improvement.",
  },

  {
    id: "case-assumption",
    title: "Case assumption",
    match: ["Case assumption", "Case assumptions"],
    exactCase: true,
    plain: "A fact or figure invented for this exercise because the brief does not give it. It is labelled wherever it appears, so you always know what is given and what is made up.",
  },
  {
    id: "pipeline",
    title: "Pipeline",
    match: ["pipeline"],
    plain: "All the deals a sales team is working on at a given moment, each at its own stage from first contact to signature.",
  },
  {
    id: "debrief",
    title: "Debrief",
    match: ["debrief"],
    plain: "A conversation after the event: here, an interview with the buyer after a deal was lost, to learn how they decided.",
  },

  // --- psychology of the buyer ------------------------------------------------
  {
    id: "loss-aversion",
    title: "Loss aversion",
    match: ["loss aversion", "loss-averse"],
    plain: "A loss hurts more than an equal gain pleases. In experiments people weighed a loss at roughly twice an equal gain. So a buyer who fears a wrong choice pays more attention to what could go wrong than to what could go right.",
    example: "Saving €8,000 on the price feels small next to the fear of a €150,000 failure that you would have to explain.",
    from: "Kahneman & Tversky 1979",
  },
  {
    id: "loss-weight",
    title: "Loss weight",
    match: ["loss weight"],
    plain: "The number of times a loss counts against an equal gain. With a weight of 2, losing €100 feels as bad as gaining €200 feels good. Tversky and Kahneman estimated about 2.25; this course uses 2 to keep the arithmetic simple.",
    from: "Tversky & Kahneman 1992",
  },
  {
    id: "social-proof",
    title: "Social proof",
    match: ["social proof"],
    plain: "When people are unsure what to do, they look at what similar others did. A reference from a company like yours says “someone like you took this step and it worked”.",
    from: "Cialdini 2021",
  },
  {
    id: "reciprocity",
    title: "Reciprocity",
    match: ["reciprocity"],
    plain: "People feel they should return what they were given. A useful gift, given first and without strings, makes the receiver more willing to give something back. A gift with strings is felt as pressure.",
    from: "Gouldner 1960",
  },
  {
    id: "trust",
    title: "Trust and security",
    match: ["trust and security"],
    plain: "The willingness to depend on someone because of what you have seen them do. It rests on ability (can they), benevolence (do they care about me) and integrity (do they keep their word).",
    from: "Mayer, Davis & Schoorman 1995",
  },
  {
    id: "benevolence",
    title: "Ability, benevolence and integrity",
    match: ["benevolence", "integrity"],
    plain: "The three things trust rests on. Ability: can they do the job. Benevolence: do they care about me and not only about the contract. Integrity: do they keep their word.",
    from: "Mayer, Davis & Schoorman 1995",
  },
  {
    id: "perceived-risk",
    title: "Perceived risk",
    match: ["perceived risk"],
    plain: "How risky a choice feels to the buyer, which can be different from how risky it is. Trust and references lower it, and an unknown vendor raises it.",
    from: "Bauer 1960",
  },
  {
    id: "felt-cost",
    title: "Felt cost",
    match: ["felt cost", "felt costs"],
    plain: "What an offer feels like it costs the buyer: the price plus the weighted risk of a bad outcome. It is a thinking aid, not a measurement. It shows how a dearer offer can feel cheaper.",
    example: "€96,000 + a small risk term can feel cheaper than €80,000 + a large one.",
  },
  {
    id: "risk-term",
    title: "Risk term",
    match: ["risk term"],
    plain: "The part of the felt cost that comes from fear: loss weight × chance it goes wrong × cost if it does. It is added to the price.",
  },
  {
    id: "status-quo",
    title: "Status quo bias and inertia",
    match: ["status quo bias", "status quo", "inertia"],
    plain: "The tendency to keep things as they are. Change has costs you can see and benefits you cannot see yet, so doing nothing feels free.",
    from: "Samuelson & Zeckhauser 1988",
  },
  {
    id: "cognitive-load",
    title: "Cognitive load and decision overload",
    match: ["cognitive load", "decision overload", "overload"],
    plain: "How much a decision asks a person to hold in their head. When there are too many options, pages or terms, people stop rather than choose badly.",
    from: "Iyengar & Lepper 2000",
  },
  {
    id: "accountability",
    title: "Accountability",
    match: ["accountability"],
    plain: "Who has to answer if something goes wrong. When nobody wants to be the one, every person can say no and nobody says yes.",
  },
  {
    id: "rationalise",
    title: "Rationalising a decision",
    match: ["rationalise", "rationalisation", "rationalised", "rational-sounding"],
    plain: "Finding good-sounding reasons for something you already decided by feeling. The reasons are real, but the feeling came first.",
  },
  {
    id: "regret",
    title: "Anticipated regret and worst regret",
    match: ["anticipated regret", "worst regret", "regret"],
    plain: "Regret is how much better off you would have been if you had chosen differently. Anticipated regret is imagining it before you decide. A “worst regret” is the largest regret one option can cause across all the ways things could turn out.",
    from: "Loomes & Sugden 1982",
  },
  {
    id: "reactance",
    title: "Reactance",
    match: ["reactance"],
    plain: "The urge to resist when you feel pushed. A hard deadline on a high-risk decision can make a buyer step back instead of moving forward.",
    from: "Brehm 1966",
  },
  {
    id: "buying-centre",
    title: "Buying centre (buying group)",
    match: ["buying centre", "buying group", "buying committee"],
    plain: "The group of people in a company who take part in a purchase. Each has their own worries, and each can stop the deal.",
    from: "Webster & Wind 1972",
  },
  {
    id: "champion",
    title: "Champion",
    match: ["champion"],
    plain: "A person on the buyer's side who wants the deal and defends it inside their own company.",
  },
  {
    id: "stakeholder",
    title: "Stakeholder",
    match: ["stakeholder", "stakeholders"],
    plain: "Anyone who has a say in, or is affected by, a decision.",
  },

  // --- tools of Level 2 -------------------------------------------------------
  {
    id: "exit-clause",
    title: "Exit clause",
    match: ["exit clause", "exit terms"],
    plain: "A term in the contract that lets the buyer step back under stated conditions. It makes a wrong decision reversible, so it makes the downside smaller.",
  },
  {
    id: "rollback",
    title: "Rollback and phased go-live",
    match: ["rollback", "phased go-live", "go-live"],
    plain: "Go-live is the day a new system starts to be used. A phased go-live starts it in steps. A rollback plan says how to return to the old setup if something fails.",
  },
  {
    id: "pilot",
    title: "Pilot",
    match: ["pilot", "pilots"],
    plain: "A small first version run before a full commitment. It can lower fear, and it can also be used by a buyer to postpone the real decision.",
  },
  {
    id: "onboarding",
    title: "Onboarding",
    match: ["onboarding"],
    plain: "The first weeks after a customer signs, when they are set up and taught to use the service.",
  },
  {
    id: "breach",
    title: "Breach (data breach)",
    match: ["breach"],
    plain: "An incident in which someone gets access to data or systems they should not. In IT security it is the event a buyer is most afraid of.",
  },
  {
    id: "iso27001",
    title: "ISO/IEC 27001",
    match: ["ISO/IEC 27001"],
    plain: "An international standard for how a company manages information security. A company can be certified against it, so it is a checkable fact.",
    from: "ISO/IEC 27001:2022",
  },
  {
    id: "time-and-material",
    title: "Time and material",
    match: ["time and material"],
    plain: "A way of pricing in which the buyer pays for the hours and materials actually used, so the final cost is not fixed in advance.",
  },
  {
    id: "master-agreement",
    title: "Master agreement",
    match: ["master agreement"],
    plain: "The main contract that sets the general terms between two companies. Individual orders are then made under it.",
  },
  {
    id: "uwg",
    title: "UWG — the German unfair competition act",
    match: ["UWG", "§ 5 UWG"],
    plain: "The German law against unfair commercial practices. § 5 makes a misleading claim illegal: an untrue statement, or one likely to mislead, that leads a market participant to a decision it would not otherwise take.",
    example: "A reference that does not exist, or a “deadline” that is not real.",
    from: "§ 5 UWG",
  },
  {
    id: "misleading-claim",
    title: "Misleading claim",
    match: ["misleading claim"],
    plain: "A statement that is untrue, or that is likely to give a false impression, and that could change what a buyer decides.",
  },

  // --- Level 3 ------------------------------------------------------------------
  {
    id: "lever",
    title: "Lever",
    match: ["lever", "levers"],
    plain: "One thing you can change that moves the result. In this course a lever changes how buyers decide: what feels safe, known or easy.",
  },
  {
    id: "leverage",
    title: "Leverage",
    match: ["leverage"],
    plain: "How much result you get for the effort. A high-leverage place to act is one where a small change moves a great deal, such as a rule that applies to every deal.",
    from: "Meadows 1999",
  },
  {
    id: "durability",
    title: "Durability",
    match: ["durability", "durable"],
    plain: "Whether a change still works when the person who made it leaves or the campaign ends. Rules and process steps last; a favour from one seller does not.",
  },
  {
    id: "scalable",
    title: "Scale (scalable)",
    match: ["scalable"],
    plain: "A measure scales when the cost of serving one more deal falls as volume grows. A one-off set-up scales; a person's hours per deal do not.",
  },
  {
    id: "systemic",
    title: "Systemic control and individual intervention",
    match: ["systemic", "individual intervention"],
    plain: "An individual intervention is one action on one deal by one person. Systemic control is a rule or process step that every deal goes through, whoever sells.",
  },
  {
    id: "choice-architecture",
    title: "Choice architecture and nudges",
    match: ["choice architecture", "nudge", "nudges", "defaults"],
    plain: "The way options, steps and defaults are arranged shapes what people choose. A nudge changes the arrangement, not the options, and it stays easy to refuse.",
    from: "Thaler & Sunstein 2008",
  },
  {
    id: "tripwire",
    title: "Tripwire",
    match: ["tripwire"],
    plain: "A result you agree in advance that tells you to change course: a metric, a threshold, a date and an action. It turns unclear reactions into a clear trigger.",
    example: "If the signature rate after a verbal yes is below 70% at month 3, adjust one lever.",
  },
  {
    id: "premortem",
    title: "Pre-mortem",
    match: ["pre-mortem", "premortem"],
    plain: "Imagining before you start that the plan has failed, then writing down the most likely reasons. It brings your hidden assumptions into view.",
    from: "Klein 2007",
  },
  {
    id: "uncertainty",
    title: "Risk and uncertainty",
    match: ["uncertainty"],
    plain: "Risk is when you can put a number on the odds. Uncertainty is when you cannot. Customer reactions to something new are uncertain.",
    from: "Knight 1921",
  },
  {
    id: "governance",
    title: "Governance",
    match: ["governance"],
    plain: "Who owns each part of a plan, how often it is looked at, and what makes the owner act.",
  },
  {
    id: "owner",
    title: "Owner",
    match: ["owner", "owners"],
    plain: "The one person who can change something without asking anyone else. An owner who cannot change it is not an owner.",
  },
  {
    id: "trigger",
    title: "Trigger",
    match: ["trigger", "triggers"],
    plain: "A written rule that says when the owner must act: a metric, a number, a date and an action.",
  },
  {
    id: "pickup",
    title: "Pickup point",
    match: ["pickup point"],
    plain: "The number and the date at which you look again at something you postponed. It turns “later” into a decision.",
  },
  {
    id: "signals",
    title: "Behaviour signals",
    match: ["behaviour signals", "buyer signals", "signals"],
    plain: "Things a buyer does that show how they feel about the deal: a question about exit terms, a request for references, a silence after a yes. They can be seen before the deal is lost.",
  },
];

// --- lookup ---------------------------------------------------------------------

export const GLOSS_BY_ID: Record<string, GlossEntry> = Object.fromEntries(GLOSSARY.map((g) => [g.id, g]));

const isAcronym = (s: string) => s === s.toUpperCase() && /[A-Z]/.test(s);

/** lowercase written form → its entry, and whether that form must be matched exactly. */
export const GLOSS_LOOKUP = new Map<string, { entry: GlossEntry; exact: string | null }>();
for (const g of GLOSSARY) {
  for (const m of g.match) GLOSS_LOOKUP.set(m.toLowerCase(), { entry: g, exact: g.exactCase || isAcronym(m) ? m : null });
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** One regex for all written forms, longest first, so "loss aversion" wins over a shorter form. */
export const GLOSS_RE = new RegExp(
  `(?<![\\p{L}\\p{N}_])(${[...GLOSS_LOOKUP.keys()]
    .sort((a, b) => b.length - a.length)
    .map(escapeRe)
    .join("|")})(?![\\p{L}\\p{N}_])`,
  "giu",
);
