/**
 * Task 1 · Block 1.1. The debrief interview after SecureIT lost the Rheinwerk Logistik deal to Sentinel Group:
 * eight things the buyer said, to sort into Rational, Emotional or Both. The tests are taught in Materi A2.
 * `truth` is never shown to the learner outside the mentor answer key.
 */
export type ReasonTag = "rational" | "emotional" | "both";
export const REASON_TAGS: { id: ReasonTag; label: string; hint: string }[] = [
  { id: "rational", label: "Rational", hint: "A property of the offer a third party could check in a document." },
  { id: "emotional", label: "Emotional", hint: "How the buyer feels or expects to feel: calm, worry, familiarity, blame." },
  { id: "both", label: "Both", hint: "Sounds like a fact, but matters mainly because of how it makes the buyer feel." },
];
export const REASON_LABEL: Record<ReasonTag, string> = { rational: "Rational", emotional: "Emotional", both: "Both" };

export type ReasonId = "sla" | "cert" | "fixed" | "blame" | "calm" | "unknown" | "peers" | "safe";

export type Reason = {
  id: ReasonId;
  /** What the buyer said, as printed. */
  quote: string;
  truth: ReasonTag;
  /** One question that teaches how to test the item. Shown for every row at once, never only the wrong ones. */
  clue: string;
  /** Why it belongs where it does. Opened only after two genuine checks, and recorded in the export. */
  why: string;
  /** For the mentor answer key: why each rejected tag is rejected. */
  rejected: Partial<Record<ReasonTag, string>>;
};

export const REASONS: Reason[] = [
  {
    id: "sla",
    quote: "Sentinel put a 4-hour response time into the contract. Your offer said “next business day”.",
    truth: "rational",
    clue: "Could a third party check this against the contract text or the price list?",
    why: "A response time is a property of the offer and it is written in a document. It can be compared line by line.",
    rejected: {
      emotional: "Nothing in the sentence says how the buyer feels. It names a term of the offer.",
      both: "The term does not need a feeling to matter: a 4-hour response beats next business day on its own.",
    },
  },
  {
    id: "cert",
    quote: "Sentinel already holds the ISO/IEC 27001 certificate. Yours was “in preparation” when we decided.",
    truth: "rational",
    clue: "Is there a certificate, a date or a document the buyer could point to?",
    why: "A certification is either held or not, and the certificate can be shown. That is checkable, so it is a rational reason.",
    rejected: {
      emotional: "The sentence states a fact about the two providers, not a feeling.",
      both: "The certificate matters because of what it certifies, not only because it reassures.",
    },
  },
  {
    id: "fixed",
    quote: "Sentinel priced the onboarding at a fixed fee. Yours was time and material, so we could not cap our cost.",
    truth: "rational",
    clue: "Is this a term of the price sheet that can be compared with the other offer?",
    why: "A fixed fee against an open-ended one is a term of the offer. It changes the budget in a way the buyer can compute.",
    rejected: {
      emotional: "The reason is about how the cost is structured, not about a feeling.",
      both: "The buyer could defend it to a finance director with numbers alone.",
    },
  },
  {
    id: "blame",
    quote: "When I imagined explaining a breach to our managing director, “we chose Sentinel” was a sentence I could survive. “We chose SecureIT” was not.",
    truth: "emotional",
    clue: "Is this about what the buyer expects to feel, or about something in the offer?",
    why: "It is about anticipated blame and regret. Nothing in the offer changed between the two sentences; only how the buyer expects to be judged.",
    rejected: {
      rational: "There is no property of either offer in the sentence to check.",
      both: "It does not dress a feeling as a fact; the feeling is stated openly.",
    },
  },
  {
    id: "calm",
    quote: "After the first meeting with Sentinel I simply felt calmer. Your team was good, but I could not say why I was not sure.",
    truth: "emotional",
    clue: "Could anyone verify this from a document, or is it a report of a feeling?",
    why: "“I felt calmer” and “I could not say why” are the buyer's own report of a feeling, with no fact attached.",
    rejected: {
      rational: "The buyer says outright that they cannot name a reason. There is nothing to check.",
      both: "No fact is offered that the feeling could be hiding behind.",
    },
  },
  {
    id: "unknown",
    quote: "I had never heard of SecureIT before your first email. I did not know what we would be getting.",
    truth: "emotional",
    clue: "Is this about something in the offer, or about how unfamiliar the vendor felt?",
    why: "Unfamiliarity produces uncertainty, and uncertainty is felt before it is reasoned. The sentence reports the feeling of not knowing.",
    rejected: {
      rational: "It reads like missing information, but it says nothing about the offer's terms; it says how unknown the vendor felt.",
      both: "No checkable fact is offered. It is the feeling itself.",
    },
  },
  {
    id: "peers",
    quote: "Two firms in our industry association use Sentinel. That counts for something.",
    truth: "both",
    clue: "It sounds like a fact. Does it tell you anything about this buyer's own delivery, or does it mainly reassure?",
    why: "It can be checked (call the two firms), but it says nothing about what Sentinel would deliver to Rheinwerk. Its job is reassurance from what others did: social proof.",
    rejected: {
      rational: "It does not compare any term of the two offers. It matters because others made the same choice.",
      emotional: "It is a checkable claim about other firms, so it is more than a feeling.",
    },
  },
  {
    id: "safe",
    quote: "Sentinel is the safe choice. Nobody has ever been criticised for picking them.",
    truth: "both",
    clue: "It is stated as a fact about a reputation. What work is it really doing for the buyer?",
    why: "A reputation is stated like a fact, but the sentence is about not being blamed. It is a feeling of safety given the form of a reason.",
    rejected: {
      rational: "No term of any offer is compared. “Safe” is a feeling about blame.",
      emotional: "It is presented as a fact about the market, which is why it is Both and not purely a feeling.",
    },
  },
];

export const REASON_BY_ID = Object.fromEntries(REASONS.map((r) => [r.id, r])) as Record<ReasonId, Reason>;
export const REASON_IDS = REASONS.map((r) => r.id);

/** The tests taught in Materi A2 for each tag. */
export const REASON_TESTS: { tag: ReasonTag; name: string; test: string }[] = [
  { tag: "rational", name: "Rational", test: "Could a third party check it against a document (a contract, a price list, a certificate)? If yes, it is rational." },
  { tag: "emotional", name: "Emotional", test: "Is it about how the buyer feels or expects to feel (calm, worry, familiarity, blame) rather than what the offer contains?" },
  { tag: "both", name: "Both", test: "Does it sound like a fact but matter mainly because of how it makes the buyer feel (what others did, a reputation)?" },
];

/** The counts a correct sort produces. */
export const REASON_TRUTH_COUNTS: Record<ReasonTag, number> = REASONS.reduce(
  (o, r) => ({ ...o, [r.truth]: o[r.truth] + 1 }),
  { rational: 0, emotional: 0, both: 0 } as Record<ReasonTag, number>,
);
