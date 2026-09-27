import type { BarrierId } from "@/data/barriers";

/**
 * Task 1 · Block 2.1. Twelve exit notes from SecureIT deals that stalled or dropped out shortly before the
 * signature. Every figure and name is a Case assumption (the prompt only says: many prospects, a high
 * abandonment rate before contract closing, customers who delay). `truth` (the barrier the note shows) is
 * never printed outside the mentor answer key. The counts are 3, 3, 2, 2, 1, 1 so the four central patterns
 * are unambiguous.
 */
export type NoteId = "n01" | "n02" | "n03" | "n04" | "n05" | "n06" | "n07" | "n08" | "n09" | "n10" | "n11" | "n12";

export type ExitNote = {
  id: NoteId;
  /** "Deal 01" */
  deal: string;
  /** The buyer's sector, so the list reads like a real pipeline. */
  sector: string;
  /** Where the deal stood when it stopped. */
  stage: string;
  outcome: "dropped" | "delayed";
  /** What happened and what the buyer said. */
  text: string;
  truth: BarrierId;
  /** One question that teaches how to test the note. Shown for every note at once, never only the wrong ones. */
  clue: string;
  /** Why it shows the barrier it does. Opened only after two genuine checks, and recorded in the export. */
  why: string;
  /** For the mentor answer key: why the most tempting other barrier is rejected. */
  rejected: Partial<Record<BarrierId, string>>;
};

export const OUTCOME_LABEL = { dropped: "Dropped out", delayed: "Delayed" } as const;

export const EXIT_NOTES: ExitNote[] = [
  {
    id: "n01",
    deal: "Deal 01",
    sector: "Logistics",
    stage: "Contract sent",
    outcome: "delayed",
    text: "The contract went out on 3 March. The buyer wrote back twice: “We would like to be sure we can get out if the first six months go badly.” Then nothing for five weeks.",
    truth: "fear",
    clue: "Is the buyer worried about what happens to them if it goes wrong, or about whether this vendor can be relied on?",
    why: "The worry is the buyer's own exposure (“get out if it goes badly”). Nothing questions the vendor's ability; the buyer wants the downside limited.",
    rejected: { trust: "The buyer does not doubt SecureIT's people; they want a way out. The doubt is about their own exposure, not the vendor." },
  },
  {
    id: "n02",
    deal: "Deal 02",
    sector: "Manufacturing",
    stage: "Verbal yes",
    outcome: "dropped",
    text: "A verbal yes in the steering meeting. A week later the CIO wrote: “If we choose the wrong tool now, we own that mistake for three years. We would rather wait a quarter.”",
    truth: "fear",
    clue: "What is the CIO afraid of: the tool, the vendor, or owning a mistake?",
    why: "“We own that mistake for three years” is a fear of a costly wrong step. A verbal yes is undone by anticipated regret.",
    rejected: { inertia: "Waiting a quarter sounds like inertia, but the reason given is the fear of a wrong decision, not that nothing is urgent." },
  },
  {
    id: "n03",
    deal: "Deal 03",
    sector: "Retail",
    stage: "Legal review",
    outcome: "delayed",
    text: "The buyer's team sent a 90-item security questionnaire for the second time and asked to interview our engineers again. “We still do not know how you work day to day.”",
    truth: "trust",
    clue: "Is the buyer asking for more proof about SecureIT's own people, or for evidence from other customers?",
    why: "“How you work day to day” and repeated interviews of the vendor's own engineers show a trust gap: the buyer is testing whether SecureIT's people can be relied on.",
    rejected: { proof: "The evidence the buyer wants comes from SecureIT's own engineers, not from other customers." },
  },
  {
    id: "n04",
    deal: "Deal 04",
    sector: "Healthcare services",
    stage: "Signature scheduled",
    outcome: "dropped",
    text: "Before the signing date the buyer asked for a call with the engineer who would lead the project. The call was cancelled twice on their side. Final message: “We never really got to know the people.”",
    truth: "trust",
    clue: "Does the buyer doubt the outcome, or the people who would deliver it?",
    why: "“We never got to know the people” is about personal trust in those who will deliver. The buyer did not find a reason to depend on them.",
    rejected: { owner: "Nobody is avoiding a sign-off or a blame; the missing piece is knowing the people." },
  },
  {
    id: "n05",
    deal: "Deal 05",
    sector: "Manufacturing",
    stage: "Proposal",
    outcome: "delayed",
    text: "The buyer asked: “Which companies like ours use you?” Our list had one name, a customer that did not want to be a reference. The buyer stopped replying.",
    truth: "proof",
    clue: "Whose experience is the buyer asking for: the vendor's people, or other customers like them?",
    why: "“Which companies like ours use you?” asks for the choice of comparable others. With no reference to name, the buyer has nothing to lean on.",
    rejected: { trust: "The buyer is not testing SecureIT's people; they want to see who else has taken the step." },
  },
  {
    id: "n06",
    deal: "Deal 06",
    sector: "Energy supplier",
    stage: "Verbal yes",
    outcome: "dropped",
    text: "The head of IT liked the offer but said: “My board will ask who else in our sector has done this. I cannot tell them.”",
    truth: "proof",
    clue: "What would the head of IT need in order to say yes: a guarantee, a person to trust, or a peer who went first?",
    why: "The missing item is a peer in the same sector who went first. It is also what the head of IT would say to their own board.",
    rejected: { fear: "The head of IT does not name a downside they fear; they name the missing peer example the board will ask for." },
  },
  {
    id: "n07",
    deal: "Deal 07",
    sector: "Logistics",
    stage: "Contract sent",
    outcome: "delayed",
    text: "The buyer forwarded our 38-page master agreement with 60 comments and asked for the three service tiers to be combined into one simpler package. “It is too much to compare.”",
    truth: "overload",
    clue: "Is the buyer stuck on a fear or a doubt, or on the amount there is to weigh?",
    why: "The buyer says it outright: too many pages, too many tiers, too much to compare. The barrier is the load of the decision, not a worry.",
    rejected: { fear: "The 60 comments are about clarity and length, not about a downside the buyer fears." },
  },
  {
    id: "n08",
    deal: "Deal 08",
    sector: "Wholesale",
    stage: "Proposal",
    outcome: "delayed",
    text: "We sent an offer with 14 options and a price sheet in five parts. The buyer wrote: “I cannot tell which one we need. Let us pick this up when I have time.”",
    truth: "overload",
    clue: "Does anything in the reply say the buyer is afraid, or only that it cannot be worked out?",
    why: "“I cannot tell which one we need” is a buyer swamped by options. “When I have time” is the delay that follows.",
    rejected: { inertia: "“When I have time” sounds like no urgency, but it follows from not being able to choose. Overload is the cause, delay is the symptom." },
  },
  {
    id: "n09",
    deal: "Deal 09",
    sector: "Mechanical engineering",
    stage: "Verbal yes",
    outcome: "delayed",
    text: "“Our current setup works and nothing has gone wrong so far. We will revisit it in the next budget round.” No incident and no deadline on the buyer's side.",
    truth: "inertia",
    clue: "Is there anything that forces the buyer to change now?",
    why: "Nothing has gone wrong and nothing is due, so doing nothing feels free. This is the status quo winning by default.",
    rejected: { fear: "The buyer fears nothing about SecureIT; they simply have no reason to change yet." },
  },
  {
    id: "n10",
    deal: "Deal 10",
    sector: "Municipal utility",
    stage: "Legal review",
    outcome: "dropped",
    text: "Three departments had to sign off. IT wanted the service. The finance director said: “I do not want my name on this.” Nobody was named as the owner of the decision.",
    truth: "owner",
    clue: "Is the trouble the outcome itself, or who would carry the blame and the sign-off?",
    why: "“I do not want my name on this” and “nobody was named as the owner” are about accountability. Each person can say no and nobody wants to say yes.",
    rejected: { fear: "It is not the outcome that is feared; it is being the person who signed." },
  },
  {
    id: "n11",
    deal: "Deal 11",
    sector: "Software",
    stage: "Verbal yes",
    outcome: "dropped",
    text: "The buyer's message: “What if the migration fails and we lose a weekend of data? We could not recover from that.” The deal was withdrawn two days later.",
    truth: "fear",
    clue: "Does the buyer doubt SecureIT's ability, or fear an outcome they could not undo?",
    why: "“We could not recover from that” is the fear of an irreversible loss. The buyer fears the outcome, not the vendor.",
    rejected: { trust: "No doubt about SecureIT's competence is expressed. The buyer describes an outcome they could not reverse." },
  },
  {
    id: "n12",
    deal: "Deal 12",
    sector: "Services",
    stage: "Signature scheduled",
    outcome: "dropped",
    text: "The buyer's project lead called: “Our last vendor promised the same things and did not deliver. I do not yet believe you will be different.”",
    truth: "trust",
    clue: "Is the doubt about this vendor's word, or about a downside the buyer could not survive?",
    why: "“I do not yet believe you will be different” is a doubt about the vendor's word, shaped by a previous bad experience. That is a trust gap.",
    rejected: { fear: "The buyer does not describe a feared outcome; they say they do not yet believe this vendor." },
  },
];

export const NOTE_BY_ID = Object.fromEntries(EXIT_NOTES.map((n) => [n.id, n])) as Record<NoteId, ExitNote>;
export const NOTE_IDS = EXIT_NOTES.map((n) => n.id);

/** How many notes carry each barrier in the reference tagging. */
export const TRUTH_COUNTS: Record<BarrierId, number> = EXIT_NOTES.reduce(
  (o, n) => ({ ...o, [n.truth]: o[n.truth] + 1 }),
  { fear: 0, trust: 0, proof: 0, inertia: 0, overload: 0, owner: 0 } as Record<BarrierId, number>,
);

/** How many notes of one barrier dropped out (the reference tagging). */
export const TRUTH_DROPPED: Record<BarrierId, number> = EXIT_NOTES.reduce(
  (o, n) => ({ ...o, [n.truth]: o[n.truth] + (n.outcome === "dropped" ? 1 : 0) }),
  { fear: 0, trust: 0, proof: 0, inertia: 0, overload: 0, owner: 0 } as Record<BarrierId, number>,
);

/** Strength points from a tally: notes plus dropouts. The rule taught in Materi A6. */
export const strengthPoints = (notes: number, dropped: number) => notes + dropped;
export type Strength = "low" | "mid" | "high";
export const STRENGTH_ORDER: Strength[] = ["low", "mid", "high"];
export const STRENGTH_LABEL: Record<Strength, string> = { low: "Low", mid: "Mid", high: "High" };
/** 5 or more points is High, 3 to 4 is Mid, 2 or fewer is Low. */
export const strengthOf = (points: number): Strength => (points >= 5 ? "high" : points >= 3 ? "mid" : "low");

/** The information the file does not hold (Block 2.2), and which of it would change what SecureIT does. */
export type InfoId = "win" | "champion" | "after" | "latecomers" | "price" | "sector" | "emails";
export const INFO_ITEMS: { id: InfoId; label: string; useful: boolean; why: string }[] = [
  {
    id: "win",
    label: "Why the buyers who did sign chose SecureIT (win interviews)",
    useful: true,
    why: "Shows what worked. The twelve notes only show what failed, so any pattern in them has no comparison group.",
  },
  {
    id: "champion",
    label: "How many of the 12 deals had a named champion on the buyer's side",
    useful: true,
    why: "A champion is a person who wants the deal and defends it inside the buyer. It separates Trust and Owner from the rest, and it is the first thing a seller can change.",
  },
  {
    id: "after",
    label: "What the buyers who dropped out did next: stayed as they were, or bought elsewhere",
    useful: true,
    why: "Tells Inertia (nothing changed) from a lost comparison (they bought from someone else), so the measures target the right cause.",
  },
  {
    id: "latecomers",
    label: "Which people joined the buyer's side in the last two weeks before the drop-out",
    useful: true,
    why: "Late arrivals are where accountability and proof questions appear. They show who really decides.",
  },
  {
    id: "price",
    label: "SecureIT's price list against the competitors' price lists",
    useful: false,
    why: "Price appears in none of the twelve notes. Knowing it will not explain why deals stop.",
  },
  {
    id: "sector",
    label: "The buyers' company size and sector, listed one by one",
    useful: false,
    why: "It is already printed in the notes and none of the six barriers depends on it.",
  },
  {
    id: "emails",
    label: "How many emails the sellers sent per deal",
    useful: false,
    why: "A count of activity says how much was sent, not how the buyer felt. It could push sellers to send more, which raises pressure.",
  },
];
export const INFO_BY_ID = Object.fromEntries(INFO_ITEMS.map((i) => [i.id, i])) as Record<InfoId, (typeof INFO_ITEMS)[number]>;
