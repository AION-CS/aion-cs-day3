"use client";

import { Bul, Diagram } from "@/components/materi/kit";
import { BarrierExample, DecisionPath, FeltCostScale, LoyaltyRoots, ReasonSortExample, ScoreExample, StrengthExample } from "@/components/materi/diagramsA";
import { Callout, DataTable, MaterialCard } from "@/components/ui/MaterialCard";
import { BARRIERS, BARRIER_IDS, BARRIER_PAIR_TESTS, PRINCIPLES } from "@/data/barriers";
import { HANSA, HANSA_FELT, LOSS_WEIGHT } from "@/data/feltCost";
import { REASON_TESTS } from "@/data/debrief";
import { SPEED_RULE } from "@/data/measures";
import { euro } from "@/lib/lang";

/** Materi A: the seven cards of Route 1 (Levels 1 and 2 on one case). 60 minutes in all. */

const p = "text-body text-ink";

export function CardA1() {
  return (
    <MaterialCard
      id="A1"
      scan="Loyalty is not repeat buying. A customer who returns from routine, or because they have no easy alternative, can leave the day something better appears. A loyal customer stays because they trust you and feel attached."
      reasoning={[
        "Ask two questions of any customer's behaviour: do they come back (behaviour), and would they choose you again if leaving were easy (attitude)? Only both together are loyalty.",
        "Name the root behind a customer's staying: trust (a judgement they have made about you), habit (the effort of changing), or attachment (a feeling for the people). Name the evidence that shows it.",
        "Habit is not loyalty. It holds until a renewal date or a trigger (a new CIO, a breach) makes changing cheaper than staying.",
        "Attachment belongs to people, so it leaves with them. Do not count on it when the buyer's contact or your own team changes.",
        "In a B2B IT purchase the buyer must be able to depend on the vendor before anything else can grow, so trust comes first. Habit and attachment are built on top of it.",
      ]}
      sources={["dick1994", "oliver1999", "gustafsson2005", "morgan1994"]}
    >
      <Diagram
        label="Three roots of loyalty · switch each one on and off"
        caption="Read the box that changes under the buttons: it says what kind of customer you would have with only those roots. Habit alone is retention, not loyalty."
      >
        <LoyaltyRoots />
      </Diagram>
      <p className={p}>
        Loyalty has two halves. A customer can <strong>behave</strong> loyally (they keep buying) and <strong>feel</strong> loyal (they would choose you again if leaving were easy). Dick and Basu (1994) asked for both. Where only the behaviour is present, you are being kept by something other than the customer's wish.
      </p>
      <DataTable
        head={["Feeling for you", "Repeat buying", "What it is", "What it means for a seller"]}
        rows={[
          ["Strong", "Frequent", "Loyalty", "Protect it and learn from why they stay."],
          ["Weak", "Frequent", "Captive (habit)", "Stays until the effort of changing falls. The risk sits at renewal."],
          ["Strong", "Rare", "Latent loyalty", "Would buy more if something stopped them: price band, a missing option, a contact."],
          ["Weak", "Rare", "No loyalty", "A customer in name only. Do not plan revenue on it."],
        ]}
        caption="Attitude and behaviour together: four kinds of customer"
      />
      <Callout label="From Day 1" tone="signal">
        <p>
          Day 1 named three ropes: emotional, economic and contractual. In this card's words, the emotional rope is <em>attachment</em>, the economic and contractual ropes are mostly <em>habit</em> (they make leaving costly), and <em>trust</em> is what lets a buyer lean on you in the first place. Today's question is what happens in the buyer's head before any rope exists.
        </p>
      </Callout>
    </MaterialCard>
  );
}

export function CardA2() {
  return (
    <MaterialCard
      id="A2"
      scan="Buyers do not decide in two separate ways. Feeling and reasoning work together, and the feeling often comes first. The reasons are found afterwards to support it."
      reasoning={[
        "Rational test: could a third party check the reason against a document (a contract, a price list, a certificate)? If yes, it is rational.",
        "Emotional test: is it about how the buyer feels or expects to feel (calm, worry, familiarity, blame) rather than what the offer contains? If yes, it is emotional.",
        "Both: the sentence sounds like a fact but matters mainly because of how it makes the buyer feel. What other companies did and a reputation are the usual ones. Sort them as Both.",
        "The sort asks which job a sentence does for the buyer. It does not ask whether the buyer is “rational”. Most real decisions contain all three kinds.",
        "A product argument answers “is it good?”. A psychological effect answers “is it safe for me to choose it?”. When a buyer agrees the product is good and still hesitates, a better argument will not help.",
        "“The price is too high” and “we need to think about it” are often the acceptable reason. Ask what the buyer would have to feel in order to say yes.",
      ]}
      sources={["kahneman2011", "zajonc1980", "webster1972", "nisbett1977"]}
    >
      <p className={p}>
        Two ways of judging run side by side (Kahneman 2011). One is fast, automatic and driven by feeling. The other is slow, deliberate and works with reasons. In a purchase the fast one usually reacts first, and the slow one is then asked to justify the result. Zajonc (1980) showed that a feeling of liking or unease can arise before any reason exists. That is why a buyer says “Provider B is the safe choice” and cannot say what makes it safe.
      </p>
      <p className={p}>
        A professional buyer is not immune. In an organisation a buyer also carries what the purchase means for their own position (Webster and Wind 1972): who will be blamed, who will be thanked. So a decision that is <em>described</em> as rational is still made by a person with feelings about it.
      </p>
      <ReasonSortExample />
      <DataTable
        head={["The three tags", "The test question", "What you do in a sales conversation"]}
        rows={[
          [REASON_TESTS[0].name, REASON_TESTS[0].test, "Give the document: the contract term, the certificate, the price sheet."],
          [REASON_TESTS[1].name, REASON_TESTS[1].test, "Make the buyer feel less alone and less exposed: meet the people, show the exit, take the worry seriously."],
          [REASON_TESTS[2].name, REASON_TESTS[2].test, "Answer the feeling under the fact: if it is “others use them”, offer comparable references."],
        ]}
        caption="Rational, Emotional, Both: test and response"
      />
      <DataTable
        head={["What the seller argues", "What the buyer may hear", "The psychological question to answer"]}
        rows={[
          ["“Our detection rate is 99%.”", "A number I cannot check. If it fails, whose fault is it?", "Can I be blamed if I choose this?"],
          ["“We have 40 engineers.”", "Big enough? Do I know any of them?", "Do I know the people who will do the work?"],
          ["“We are 15% cheaper.”", "Cheaper may mean corners cut.", "What am I risking in order to save this money?"],
        ]}
        caption="Product argument against psychological effect"
      />
      <Callout label="Coaching focus" tone="amber">
        <p>Why do customers not decide “rationally”? Because the question they are answering is rarely the one on the feature list. Reflect on your own last lost deal: which argument did you keep repeating, and which question was the buyer really asking?</p>
      </Callout>
    </MaterialCard>
  );
}

export function CardA3() {
  const X = HANSA.X;
  const Y = HANSA.Y;
  const risk = (c: number) => LOSS_WEIGHT * (c / 100) * HANSA.loss;
  return (
    <MaterialCard
      id="A3"
      scan="Four principles explain most of what pulls a buyer towards a vendor or away from one: trust and security, loss aversion, social proof and reciprocity. Loss aversion is the one that puts a number on fear."
      reasoning={[
        "Which principle is it? Ask what the buyer is reacting to. Someone they can rely on: trust. A possible bad outcome: loss aversion. What others like them did: social proof. Something they were given first: reciprocity.",
        "Felt cost = price + (loss weight × chance it goes wrong × cost to the buyer if it does). Add the price of the same provider last.",
        "The chance is the buyer's own expectation, printed as a percentage. Divide it by 100 before you multiply.",
        "Compare the felt costs, not the prices. Felt gap = the felt cost of the first provider minus the felt cost of the other; a positive number means the second provider feels cheaper.",
        "Trust and social proof act on the chance the buyer expects. An exit clause or a guarantee acts on the cost if it goes wrong. A discount acts only on the price and leaves the risk term where it was.",
        "A hypothesis names a mechanism: “If … then the buyer … because [principle]”. Choose a different principle for each hypothesis so that they can be tested separately.",
        "Trust is built from behaviour the buyer can see (promises kept early), not from claims about yourself. It has three parts: ability, benevolence, integrity.",
      ]}
      sources={["kahneman1979", "tversky1992", "mayer1995", "morgan1994", "cialdini2021", "gouldner1960"]}
    >
      <DataTable
        head={["Principle", "The idea", "In IT security sales", "The rule"]}
        rows={PRINCIPLES.map((x) => [x.name, x.idea, x.b2b, x.rule])}
        caption="The four principles"
      />
      <Diagram
        label="The felt-cost scale · a worked example on another company"
        caption="Hansawerk chooses between two IT security providers. Turn the loss weight from 1 to 3 and see who feels cheaper, then apply a lever to Provider X."
      >
        <FeltCostScale />
      </Diagram>
      <DataTable
        head={["Step", "Calculation for Hansawerk (Case assumption)", "Result"]}
        rows={[
          ["1 · Read the chance as a share of one", `Provider X: ${X.chance}% = ${(X.chance / 100).toFixed(2)}. Provider Y: ${Y.chance}% = ${(Y.chance / 100).toFixed(2)}.`, "0.10 and 0.03"],
          ["2 · Risk term = weight × chance × loss", `Provider X: ${LOSS_WEIGHT} × ${(X.chance / 100).toFixed(2)} × ${euro(HANSA.loss)}. Provider Y: ${LOSS_WEIGHT} × ${(Y.chance / 100).toFixed(2)} × ${euro(HANSA.loss)}.`, `${euro(risk(X.chance))} and ${euro(risk(Y.chance))}`],
          ["3 · Felt cost = price + risk term", `Provider X: ${euro(X.price)} + ${euro(risk(X.chance))}. Provider Y: ${euro(Y.price)} + ${euro(risk(Y.chance))}.`, `${euro(HANSA_FELT.X)} and ${euro(HANSA_FELT.Y)}`],
          ["4 · Felt gap = the two felt costs subtracted", `${euro(HANSA_FELT.X)} − ${euro(HANSA_FELT.Y)}`, `${euro(HANSA_FELT.X - HANSA_FELT.Y)}: Provider Y feels cheaper, though it is ${euro(Y.price - X.price)} dearer on the price list`],
        ]}
        caption="The same method as the task, on different numbers"
      />
      <Callout label="What this is, and what it is not" tone="rust">
        <p>
          A thinking aid, not a measurement. Real buyers do not calculate this. It shows the direction: a higher price can feel lower once trust has lowered the chance the buyer expects, and loss aversion multiplies that chance. Tversky and Kahneman (1992) estimated a loss weight of about 2.25 in laboratory choices between money gambles; this course uses {LOSS_WEIGHT}. In a company the buyer also carries the blame personally, which is why the weight is not small.
        </p>
      </Callout>
      <Bul
        items={[
          <>
            <strong>Ability</strong>: can they do it? Certificates and references speak to this.
          </>,
          <>
            <strong>Benevolence</strong>: do they care about me and not only about the contract? Small acts before signing speak to this.
          </>,
          <>
            <strong>Integrity</strong>: do they keep their word? A promise kept early is worth more than a claim made late.
          </>,
        ]}
      />
    </MaterialCard>
  );
}

export function CardA4() {
  return (
    <MaterialCard
      id="A4"
      scan="A buyer moves from uncertainty through evaluation to a decision. Each phase has its own question, and a deal that stalls has almost always left one of those questions unanswered."
      reasoning={[
        "Name the phase first. Uncertainty: the buyer does not yet know whether to act or what could go wrong. Evaluation: the buyer compares providers and looks for evidence. Decision: the buyer is ready to choose but must be able to stand behind the choice.",
        "A stall after a positive step is usually not a refusal. Something in the phase the deal is in has not been answered.",
        "Answer the question of the current phase, not the next one. A price cut in the uncertainty phase answers nothing the buyer is asking.",
        "Barriers add up. Two small unanswered questions can stop a deal that either one alone would not.",
        "A verbal yes is not a signature. The decision phase has its own question: can I stand behind this, and who signs with me?",
      ]}
      sources={["bauer1960", "webster1972", "gartner2017", "kahneman1979"]}
    >
      <p className={p}>
        In a high-risk purchase the buyer is answering three questions in a row. First: <em>do I need to change at all, and what could go wrong?</em> (uncertainty). Then: <em>who else has done this, and can I rely on these people?</em> (evaluation). Last: <em>can I stand behind this choice, and who signs with me?</em> (decision). The sales process usually tracks a different sequence (contact, demo, proposal, contract). The two run alongside each other, and a deal stops when the buyer's question is still open while the process moves on.
      </p>
      <Diagram
        label="Readiness to sign · leave a question unanswered and see where the line ends"
        caption="The grey dashed line is a deal where every question was answered. The solid line is the one you build."
      >
        <DecisionPath />
      </Diagram>
      <Callout label="Why more people means more stalls" tone="amber">
        <p>
          The median buying group for a complex solution has 6 to 10 decision makers (Gartner 2017). Each of them has their own question in each phase, and each can say no. That is why a deal can be fully answered for your contact and still stall at the last step.
        </p>
      </Callout>
    </MaterialCard>
  );
}

export function CardA5() {
  return (
    <MaterialCard
      id="A5"
      scan="A buyer's stated reason is often the acceptable one. Six barriers explain most stalls; each has a test question, and four pairs are easy to confuse."
      reasoning={[
        "Tag a note by what the buyer says and does, not by the reason the buyer states. “No budget” and “bad timing” are often the acceptable reason.",
        "Find the one phrase that decides the note, then ask the test question of the barrier it points to. If two barriers fit, use the pair test.",
        "Fear or Trust? Whose position is at stake: the buyer's own exposure if it goes wrong (Fear), or whether this vendor can be relied on (Trust)?",
        "Trust or Proof? Where would the evidence come from: the vendor's own people, met and tested by the buyer (Trust), or other customers and peers (Proof)?",
        "Fear or Owner? What is the buyer afraid of: the outcome itself (Fear), or being the person who is blamed or who has to sign (Owner)?",
        "Overload or Inertia? What stops the buyer: too much to weigh (Overload), or no reason to change now, so that doing nothing feels free (Inertia)?",
        "A delay phrased as time (“when I have time”, “next quarter”) is the symptom. Ask what stopped the buyer, and tag that.",
        "One note has one dominant barrier. Do not tag a barrier because a measure you like happens to fit it.",
      ]}
      sources={["nisbett1977", "bauer1960", "samuelson1988", "iyengar2000", "mayer1995", "gartner2017", "kahneman1979"]}
    >
      <p className={p}>
        People are not good witnesses to their own reasons. Nisbett and Wilson (1977) found that they often report a reason that sounds sensible and does not match what moved them. So read a note for what the buyer <em>did</em>: which question they asked, what they asked for, what made them go quiet. Six barriers cover most cases. Each one below has the test question that separates it from its neighbours.
      </p>
      <DataTable
        head={["Barrier", "Principle behind it", "What is going on", "What buyers say", "Test question"]}
        rows={BARRIER_IDS.map((id) => {
          const b = BARRIERS[id];
          return [b.label, b.principle, b.means, b.sounds, b.test];
        })}
        caption="The six barriers: a profile of each"
      />
      <div className="space-y-1.5">
        <p className="smallcaps">When two barriers seem to fit</p>
        <Bul
          items={BARRIER_PAIR_TESTS.map((t) => (
            <>
              <strong>{t.pair}</strong> {t.test}
            </>
          ))}
        />
      </div>
      <BarrierExample />
      <Callout label="How to tag a note" tone="signal">
        <ol className="list-decimal space-y-1 pl-5">
          <li>Read the note once and underline the buyer's own words.</li>
          <li>Pick the barrier whose test question those words answer with “yes”.</li>
          <li>If a neighbouring barrier also fits, apply the pair test.</li>
          <li>Tag one barrier only and move on. Come back if the tally looks odd.</li>
        </ol>
      </Callout>
    </MaterialCard>
  );
}

export function CardA6() {
  return (
    <MaterialCard
      id="A6"
      scan="Not every barrier stops deals equally. Count how often it appears, count how often it cancelled a deal, and add the two. Then say what the evidence cannot tell you."
      reasoning={[
        "Points = the number of notes with the barrier + the number of those that dropped out. 5 or more points is High, 3 to 4 is Mid, 2 or fewer is Low.",
        "Apply the rule to your own tally. If you tagged a note differently, your points differ and your rating follows your own evidence.",
        "The four central patterns are the four barriers with the most notes. Break a tie with the dropouts.",
        "A barrier that only delays is slower, not harmless: it costs time. But it cancels fewer deals, so it is rated lower than one that cancels.",
        "A pattern names what the buyer does and the mechanism behind it: “When [situation], buyers [behaviour], because [mechanism].”",
        "Twelve notes show a pattern; they do not prove one. Say what the file cannot tell you, and ask which missing item would change the barrier you tackle or the measure you fund.",
        "A useful question is about the buyer's behaviour, not the vendor's activity, and it is not already printed in the file. Counting emails sent says how much you did, not how the buyer felt.",
      ]}
      sources={["nisbett1977", "samuelson1988", "kahneman1979"]}
    >
      <p className={p}>
        Suppose Elbtal Systems (the vendor from the last card) reviewed ten lost or stalled deals. Counting notes says how often a barrier appears. Counting dropouts says how often it ended a deal. Add them and you have one number that ranks the barriers by how much they cost.
      </p>
      <Diagram label="Strength of five barriers · a worked example on Elbtal's ten deals" caption="Switch the ranking between notes only and notes plus dropouts and watch Proof and Trust change places.">
        <StrengthExample />
      </Diagram>
      <DataTable
        head={["Format of a pattern", "Elbtal's example (Case assumption)"]}
        rows={[
          ["When [situation], buyers [behaviour], because [mechanism].", "When the contract is sent, buyers ask for exit terms and go silent for weeks, because a wrong decision would be theirs alone to carry."],
        ]}
        caption="How to write a pattern"
      />
      <div className="space-y-1.5">
        <p className="smallcaps">What the file cannot tell you: four kinds of gap</p>
        <Bul
          items={[
            <>
              <strong>No comparison group.</strong> Notes from failed deals show what failed. What worked is missing.
            </>,
            <>
              <strong>No “what happened next”.</strong> A buyer who dropped out either stayed as they were or bought elsewhere. The two point at different causes.
            </>,
            <>
              <strong>No “who”.</strong> Who joined the buyer's side, and when, and who wanted the deal.
            </>,
            <>
              <strong>Activity instead of behaviour.</strong> A count of what the seller did (calls, emails) is not a measure of what the buyer felt.
            </>,
          ]}
        />
        <p className="text-caption text-ash">
          Test any missing item with two questions: would knowing it change the barrier you tackle or the measure you fund? And is it about the buyer's behaviour and not yet in the file?
        </p>
      </div>
      <Callout label="Small numbers" tone="rust">
        <p>Twelve notes are a pattern to act on, not a statistic to quote. Say “in the twelve notes”, not “buyers usually”.</p>
      </Callout>
    </MaterialCard>
  );
}

export function CardA7() {
  return (
    <MaterialCard
      id="A7"
      scan="A measure works when it answers the barrier the evidence shows. Score it on influence, feasibility and speed, multiply the three, and check the budget."
      reasoning={[
        "Match first. Each measure says what it changes in the buyer. Choose the ones that act on a barrier that appears in your own tally, not the ones that are easiest to run.",
        `Influence: 3 if it acts on a barrier seen in three or more of your notes or in the deals that dropped out. 2 if it acts on a barrier seen in two notes, or only on delays. 1 if it acts on a barrier your evidence does not show, or makes one worse.`,
        "Feasibility: 3 if it can be done with what you have and no outside dependency. 2 if it needs one approval or one scarce person. 1 if it needs something you do not control.",
        SPEED_RULE,
        "Score = influence × feasibility × speed, from 1 to 27. A 1 in any factor pulls it down hard. Compare the products, and check that the plan's costs add up to no more than the budget.",
        "If the measures that work together cost more than the budget, leave out the one with the lowest score. Do not shave every measure a little.",
        "A price cut answers a price barrier. Look at your tally first: if price appears in none of the notes, the cut answers a barrier that is not there.",
        "Pressure (a countdown, a deadline) acts on the fear you are trying to reduce, and a deadline that is not real is a misleading claim. Use a deadline only when it is real.",
        "Check coverage: a barrier is covered when at least one chosen measure acts on it. A measure can cover more than one.",
      ]}
      sources={["cialdini2021", "brehm1966", "uwg5", "thaler2008"]}
    >
      <DataTable
        head={["Barrier", "What answers it", "What does not"]}
        rows={[
          [BARRIERS.fear.label, BARRIERS.fear.answeredBy, "A price cut, or more feature argument."],
          [BARRIERS.trust.label, BARRIERS.trust.answeredBy, "More claims about the company."],
          [BARRIERS.proof.label, BARRIERS.proof.answeredBy, "A discount, or a longer brochure."],
          [BARRIERS.inertia.label, BARRIERS.inertia.answeredBy, "More product detail, or false urgency."],
          [BARRIERS.overload.label, BARRIERS.overload.answeredBy, "More options and more documents."],
          [BARRIERS.owner.label, BARRIERS.owner.answeredBy, "Pressure on the contact."],
        ]}
        caption="Matching a measure to a barrier"
      />
      <Diagram label="Scoring three measures · a worked example on Elbtal Systems" caption="Elbtal has €50,000 and three months. Change an influence or a feasibility score, or leave a measure out of the plan.">
        <ScoreExample />
      </Diagram>
      <DataTable
        head={["Factor", "3", "2", "1"]}
        rows={[
          ["Influence on behaviour", "Acts on a barrier in 3 or more notes, or on dropouts", "Acts on a barrier in 2 notes, or only on delays", "Acts on a barrier the evidence does not show, or worsens one"],
          ["Feasibility", "In-house, no outside dependency", "One approval or one scarce person", "Needs something you do not control"],
          ["Speed", "4 weeks or fewer", "5 to 8 weeks", "More than 8 weeks"],
        ]}
        caption="The three scores"
      />
      <Callout label="Influence is not manipulation: three tests" tone="rust">
        <ol className="list-decimal space-y-1 pl-5">
          <li>Is it true? A reference that does not exist, or a deadline that is not real, is a misleading claim (§ 5 UWG).</li>
          <li>Could the buyer check it? A claim the buyer can verify builds trust; one they cannot is a demand for faith.</li>
          <li>Would the buyer feel respected if they saw exactly what you are doing? If not, it is pressure, not help.</li>
        </ol>
      </Callout>
      <p className="text-caption text-ash">
        Reciprocity is a real lever: a useful gift, given first, makes people willing to engage. It usually works early in the process, and it takes time to pay back. A measure that takes ten weeks to a first effect is too slow for a three-month window, even if it is a good idea.
      </p>
    </MaterialCard>
  );
}

export const CARDS_A = [CardA1, CardA2, CardA3, CardA4, CardA5, CardA6, CardA7];
