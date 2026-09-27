/**
 * The six psychological barriers a stalled deal can show (Materi A5). One place, so the material, the tagging
 * exercise (Block 2.1), the patterns (2.2), the measures (2.3), the answer keys and the export all read the same
 * definitions. The test question of each barrier is the one taught in A5; it never says which note belongs where.
 */
export type BarrierId = "fear" | "trust" | "proof" | "inertia" | "overload" | "owner";

export const BARRIER_IDS: BarrierId[] = ["fear", "trust", "proof", "inertia", "overload", "owner"];

export type Barrier = {
  id: BarrierId;
  label: string;
  short: string;
  /** The principle from A3 (or the bias) behind it. */
  principle: string;
  /** What is going on in the buyer's head, in plain words. */
  means: string;
  /** What a buyer typically says or does. Practitioner observation, not a quotation from a study. */
  sounds: string;
  /** The one question that tests whether a note shows this barrier. */
  test: string;
  /** Which lever in A7 acts on it, in words. */
  answeredBy: string;
};

export const BARRIERS: Record<BarrierId, Barrier> = {
  fear: {
    id: "fear",
    label: "Fear of a wrong decision",
    short: "Fear",
    principle: "Loss aversion",
    means: "The buyer expects the pain of a bad outcome to weigh more than the gain of a good one, so the safest move is not to move.",
    sounds: "“What if it goes wrong?”, “Can we get out of it?”, “We would rather wait a quarter.”",
    test: "Is the worry about what happens to the buyer if the choice turns out wrong?",
    answeredBy: "Make the downside smaller and reversible: an exit clause, a phased go-live, a rollback plan.",
  },
  trust: {
    id: "trust",
    label: "Trust gap",
    short: "Trust",
    principle: "Trust and security",
    means: "The buyer is not yet willing to depend on the vendor: not sure the people are competent, honest or on their side.",
    sounds: "“We don't know how you work day to day.”, “We never really met the people.”, “The last vendor promised the same.”",
    test: "Is the doubt about this vendor's ability, honesty or care, and not about the buyer's own exposure?",
    answeredBy: "Let the buyer meet and test the people who will deliver, and keep small promises visibly.",
  },
  proof: {
    id: "proof",
    label: "No social proof",
    short: "Proof",
    principle: "Social proof",
    means: "The buyer has no peer to point to. Others like them have not made this choice, or the buyer cannot see that they have.",
    sounds: "“Who else like us uses you?”, “My board will ask who else has done this.”",
    test: "Is the buyer asking for evidence from other customers or peers, rather than from the vendor's own people?",
    answeredBy: "Put comparable, named customers in front of the buyer, with the buyer's own questions answered by them.",
  },
  inertia: {
    id: "inertia",
    label: "Inertia",
    short: "Inertia",
    principle: "Status quo bias",
    means: "The present set-up feels good enough. Change has visible costs, its benefit is invisible, and nothing forces a decision.",
    sounds: "“It works, nothing has gone wrong so far.”, “Let's revisit it next budget round.”",
    test: "Does anything feel urgent enough to change, or does doing nothing feel free?",
    answeredBy: "Show the cost of standing still, with the buyer's own numbers, and give a reason to act now that is real.",
  },
  overload: {
    id: "overload",
    label: "Decision overload",
    short: "Overload",
    principle: "Cognitive load",
    means: "There are too many options, terms or comparisons to weigh. The buyer stops rather than choose badly.",
    sounds: "“I can't tell which one we need.”, “It is too much to compare.”, “Let's pick this up when I have time.”",
    test: "Is the buyer stuck on the amount of detail or the number of options, and not on a fear or a doubt?",
    answeredBy: "Cut the decision down: few options, one page, a standard contract, and a person who walks the buyer through it.",
  },
  owner: {
    id: "owner",
    label: "Nobody owns the decision",
    short: "Owner",
    principle: "Accountability",
    means: "Several people must agree and nobody wants their name on it. Each can say no; none is willing to say yes.",
    sounds: "“I don't want my name on this.”, “Three departments have to sign off.”",
    test: "Is the problem who would carry the blame or the sign-off, rather than the outcome itself?",
    answeredBy: "Name the owner on the buyer's side and give them a one-page justification they can forward.",
  },
};

/** The pairs a learner most often confuses, with the question that separates them (Materi A5). */
export const BARRIER_PAIR_TESTS: { pair: string; test: string }[] = [
  {
    pair: "Fear or Trust?",
    test: "Ask whose position is at stake. If it is the buyer's own exposure if things go wrong, it is Fear. If it is whether this vendor can be relied on, it is Trust.",
  },
  {
    pair: "Trust or Proof?",
    test: "Ask where the evidence would come from. From the vendor's own people, met and tested by the buyer, it is Trust. From other customers or peers, it is Proof.",
  },
  {
    pair: "Fear or Owner?",
    test: "Ask what the buyer is afraid of. The outcome itself is Fear. Being the person who is blamed, or who has to sign, is Owner.",
  },
  {
    pair: "Overload or Inertia?",
    test: "Ask what stops the buyer. Too much to weigh is Overload. No reason to change now, and doing nothing feeling free, is Inertia.",
  },
];

/** The four principles the plan names, with what each one means for a buyer. Materi A3. */
export type PrincipleId = "trust" | "loss" | "proof" | "reciprocity";
export const PRINCIPLES: { id: PrincipleId; name: string; idea: string; b2b: string; rule: string }[] = [
  {
    id: "trust",
    name: "Trust and security",
    idea: "People buy from those they are willing to depend on. Trust rests on three things: ability (can they do it), benevolence (do they care about me) and integrity (do they keep their word).",
    b2b: "In IT security the buyer hands over the keys to their systems. Ability is checked with certificates and references; benevolence and integrity are judged from how the people behave before the contract.",
    rule: "Trust is built by behaviour that can be seen (small promises kept), not by claims about yourself.",
  },
  {
    id: "loss",
    name: "Loss aversion",
    idea: "A loss hurts more than an equal gain pleases. In experiments the pain of losing was weighed at roughly twice the pleasure of winning the same amount.",
    b2b: "A buyer who picks the wrong provider carries the loss personally (blame, rework, a failed project). The gain of saving a little on price is small next to that.",
    rule: "Make the buyer's downside smaller (guarantee, exit, staged start) before you make the upside bigger.",
  },
  {
    id: "proof",
    name: "Social proof",
    idea: "When people are unsure what to do, they look at what similar others have done. The more similar the others, the stronger the effect.",
    b2b: "A reference from a company of the same size and sector says “someone like you took this step and it worked”. It also gives the buyer something to say to their own board.",
    rule: "Proof works when it is comparable, named and checkable. A reference the buyer cannot verify is worth less than none.",
  },
  {
    id: "reciprocity",
    name: "Reciprocity",
    idea: "People feel they should return what they were given. A gift or a favour, given first and without a condition, makes the receiver more willing to give something back.",
    b2b: "A free, useful security health check before any offer gives the buyer something real. It builds goodwill and lets the buyer see how the vendor works.",
    rule: "Give first, make it useful in itself, and do not present it as a trap. A gift with strings attached is felt as pressure.",
  },
];
