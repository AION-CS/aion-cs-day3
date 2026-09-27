/**
 * The home page's day intro (CLAUDE.md #27): what the day is about, the story that runs through the two routes, and "What's in it
 * for you" (WIIFM), the personal pay-off of each skill. Only facts the day's own material and cases state (SecureIT Systems, its
 * many prospects, its high abandonment before contract closing, the €100,000 and three months of Route 1, the twelve exit notes,
 * the €120,000 and six months of Route 2).
 */
export const DAY_INTRO = {
  about:
    "Today is about what goes on in a buyer's head between “we might need this” and a signature. You learn what creates loyalty, why feelings come before reasons, four psychological principles (trust and security, loss aversion, social proof and reciprocity), and what a stalled deal looks like when you read it as behaviour. In the second half you stop reading one buyer and start designing how every buyer decides.",
  caseLine:
    "One case runs through the whole day: SecureIT Systems GmbH, a German IT security provider. It has many prospects and a high abandonment rate just before contracts are closed, and customers keep delaying their decisions. A buyer has just chosen the dearer, better-known provider over it. In Route 1 you work with €100,000 and three months; in Route 2 you are the Chief Sales Officer with €120,000 and six months.",
  story: [
    {
      route: 1 as const,
      verb: "Understand and apply",
      question: "Why did a buyer pick the dearer provider, what stops SecureIT's prospects from signing, and which three measures fit inside €100,000 and three months?",
      output: "the Behaviour Analysis File (Levels 1 and 2)",
    },
    {
      route: 2 as const,
      verb: "Decide",
      question: "How do you manage customer decisions as a system, and what do you decide before you know how customers will react?",
      output: "the Decision Memo (Level 3)",
    },
  ],
  wiifm: [
    {
      skill: "Tell a feeling from a fact in what a buyer says",
      payoff: "Buyers seldom say “I was afraid”. They say “it is the safe choice”. With three simple tests you can hear which part of a sentence is checkable, which is a feeling, and which is a feeling dressed as a fact, in any customer conversation or lost-deal review.",
      route: 1 as const,
    },
    {
      skill: "Put a number on fear",
      payoff: "Price plus the weight a buyer gives to the chance of a bad outcome shows why a dearer offer can feel cheaper. You can use the same arithmetic on any proposal to see which term you would have to move: the price, the chance, or the cost if it goes wrong.",
      route: 1 as const,
    },
    {
      skill: "Read a stall as a signal, not a refusal",
      payoff: "A deal that goes quiet after a yes has usually left one question unanswered. You learn six barriers, one test question for each, and how to rate them, so that you fix the barrier the evidence shows and not the one you expected.",
      route: 1 as const,
    },
    {
      skill: "Choose measures with a score, inside a budget",
      payoff: "Influence times feasibility times speed, checked against a budget, works for any shortlist of ideas at work. It also tells you what to leave out, which is the harder half of the job.",
      route: 1 as const,
    },
    {
      skill: "Design a decision system, not a pitch",
      payoff: "You learn to ask which lever still works when the seller leaves, and which one only works while a person is in the room. That question helps you in any team where results depend on individuals.",
      route: 2 as const,
    },
    {
      skill: "Decide before the evidence is complete",
      payoff: "A staged decision with a tripwire (a metric, a threshold, a date and an action, all agreed in advance) lets you commit without betting everything on an assumption. It is the honest way to say “yes” when nobody can be sure.",
      route: 2 as const,
    },
    {
      skill: "Leave with two documents you can reuse",
      payoff: "The Behaviour Analysis File and the Decision Memo are yours: the first is a template for reading any set of lost deals, the second for defending a plan to a board when the outcome is uncertain.",
      route: 2 as const,
    },
  ],
};
