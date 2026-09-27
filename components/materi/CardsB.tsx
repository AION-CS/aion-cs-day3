"use client";

import { Bul, Diagram } from "@/components/materi/kit";
import { ArchitectureExample, ControlLoop, InterventionLadder, LeverProfile, RegretTable, RiskMatrix } from "@/components/materi/diagramsB";
import { Callout, DataTable, MaterialCard } from "@/components/ui/MaterialCard";
import { OWNERS, OWNER_IDS } from "@/data/route2";

/** Materi B: the five cards of Route 2 (Level 3, the management decision). 60 minutes in all. */

const p = "text-body text-ink";

export function CardB1() {
  return (
    <MaterialCard
      id="B1"
      scan="A decision system is a set of choices about how the buying process is built, so that the safe choice is also the easy one. It is influence, not control: the buyer always decides."
      reasoning={[
        "A model of the buying decision has one row per phase: the buyer's question, the factor that dominates, the signal that shows the question is unanswered, and the move the seller's system makes.",
        "A factor is central when it appears in your evidence and a lever can change it. Trust and perceived risk are central in nearly every high-risk IT purchase; a third factor, such as social proof or emotion, depends on what the evidence shows.",
        "Uncertainty is dominated by perceived risk (and the feeling of unease). Evaluation is dominated by social proof and trust. The decision phase returns to trust and to risk, because the buyer must stand behind the choice.",
        "The signal is something you can see in the buyer's behaviour before the deal is lost: a question about exit terms, a request to speak to peers, a silence after a yes. It is not the loss itself.",
        "A lever at the process or structure level keeps working when the seller changes. A lever at the argument or interaction level leaves with the seller.",
        "Influence is not control. Help the buyer decide, and pass three tests: it is true, the buyer could check it, and the buyer would feel respected if they saw what you are doing.",
        "Individual intervention against systemic control: a one-off action on one deal is fast and personal and does not scale. A designed process is slower to build and applies to every deal.",
      ]}
      sources={["thaler2008", "meadows1999", "kahneman2011", "webster1972"]}
    >
      <p className={p}>
        Level 1 and 2 were about reading one buyer. A manager has a different question: how do we make buyers decide better across <em>every</em> deal, including the ones we never see? The answer is not to persuade harder. It is to change the conditions in which the decision is made, so that the safe, easy choice is the one that gets made. Thaler and Sunstein (2008) call this choice architecture: the way options, defaults and steps are set up shapes what people choose.
      </p>
      <Diagram label="Four levels of intervention · a worked example on Elbtal Systems" caption="Pick a level, then switch the seller from “stays” to “leaves the company” and watch how much of the effect is left.">
        <InterventionLadder />
      </Diagram>
      <Diagram label="The decision loop" caption="A system is a loop. It sees the buyer's behaviour, decides, acts through the process and learns from the result against a threshold set in advance.">
        <ControlLoop />
      </Diagram>
      <DataTable
        head={["", "Individual intervention", "Systemic behaviour control"]}
        rows={[
          ["What it is", "One action on one deal: a call, a favour, a personal push.", "A rule or a step every deal goes through."],
          ["Depends on", "The seller or engineer who does it.", "The process. Whoever sells, it happens."],
          ["Speed", "Fast, and can start tomorrow.", "Slower to build, and it acts on every deal once built."],
          ["Cost shape", "Repeats with every deal.", "A set-up cost, then a small cost per deal."],
          ["Learning", "Stays in one person's head.", "Recorded in signals you can compare."],
          ["Main risk", "Depends on who is available.", "Rigid, if the assumption behind it is wrong."],
        ]}
        caption="Individual intervention against systemic behaviour control"
      />
      <DataTable
        head={["Model row", "Question it answers"]}
        rows={[
          ["The buyer's question in this phase", "What is the buyer trying to settle right now?"],
          ["The dominant factor", "Which force (trust, perceived risk, emotion, social proof, habit) decides it?"],
          ["The signal", "What would we see in the buyer's behaviour if it is unanswered?"],
          ["The move", "What does our process do, whoever is selling?"],
        ]}
        caption="A model of the buying decision, one row per phase"
      />
      <Callout label="Influence, not control" tone="rust">
        <p>
          “Controlling” a buyer's decision is not possible and not the aim. You can shape what is easy, what is safe and what is visible. The buyer still decides, and a buyer who feels controlled resists (Brehm 1966). If you would be embarrassed for the buyer to read your plan, the plan is wrong.
        </p>
      </Callout>
    </MaterialCard>
  );
}

export function CardB2() {
  return (
    <MaterialCard
      id="B2"
      scan="Four tests rank levers: reach, depth, durability and scale. The places with the most leverage are the rules and the process, not the argument."
      reasoning={[
        "Reach: how many deals does it touch? A lever that applies only above a size threshold or to one segment cannot be rated 3.",
        "Depth: how strongly does it change the behaviour in one deal? A lever that removes the reason the buyer was stalling is 3. A small nudge is 1.",
        "Durability: does it work when the seller changes or the campaign ends? A lever that depends on individual people cannot be more than 1. A process step or a rule can be 3.",
        "Scale: does the cost per additional deal fall as volume grows? A cost that repeats with every deal is 1. A cost that repeats with every seller is at most 2. A one-off cost is 3.",
        "Which measure changes behaviour sustainably? The one with high durability and at least medium depth. A deep lever that does not last is an intervention, not a system.",
        "Where is the greatest psychological lever? On the factor that stops the most deals in your evidence, with the highest depth.",
        "What is scalable? The levers rated 3 on scale, because their cost per deal falls as volume grows.",
        "A lever that acts on a barrier your evidence does not show, or that worsens one (pressure on a fear), scores low on depth whatever it costs.",
      ]}
      sources={["meadows1999", "thaler2008", "cialdini2021"]}
    >
      <p className={p}>
        Donella Meadows (1999) noticed that a system responds most to changes in its rules and structure and least to changes in a single number. Sales is a system too. Retraining a seller is a parameter. Making an exit clause part of every contract is a rule. Rate levers on four tests and the difference shows.
      </p>
      <Diagram label="Four levers, four tests · a worked example on Elbtal Systems" caption="Select any rating to read the test and the reason. The limits below the table are the rules a rating must respect.">
        <LeverProfile />
      </Diagram>
      <DataTable
        head={["Test", "The question", "Low (1)", "High (3)"]}
        rows={[
          ["Reach", "How many deals does it touch?", "Only some deals (a threshold, a segment).", "Every deal that enters the process."],
          ["Depth", "How strongly does it change the behaviour in one deal?", "A small nudge on one barrier.", "It removes the reason the buyer was stopping."],
          ["Durability", "Does it still work when the seller changes or the campaign ends?", "It depends on individual sellers or a campaign.", "It is built into the process or a rule."],
          ["Scale", "Does the cost per additional deal fall as volume grows?", "The cost repeats with every deal.", "A one-off cost that serves every deal."],
        ]}
        caption="The four tests of leverage"
      />
    </MaterialCard>
  );
}

export function CardB3() {
  return (
    <MaterialCard
      id="B3"
      scan="You cannot know how customers will react. You can decide how much to risk before you know, and which result will make you change course."
      reasoning={[
        "Waiting is also a decision. It leaves the present stalling in place for as long as you wait, so it is never free.",
        "When you cannot estimate the odds, choose the option with the smallest worst regret. When you can estimate them, compare expected results, and see whether the choice changes as your estimate changes.",
        "Prefer steps you can undo. Spend in stages and let the customers' first reactions decide what comes next.",
        "A tripwire has four parts: a metric of the buyer's behaviour (not an activity count such as emails sent), a threshold that is better than today's baseline, a date early enough to still act on, and an action agreed in advance (scale, adjust or stop).",
        "Write three assumptions your decision rests on. Each must be about how customers will react, must be testable, and must name the sign that it is wrong.",
        "When the board challenges an assumption after the start, go back to the tripwire first. Keep what the numbers support and change one lever, not the whole plan.",
        "Risk is a chance you can put a number on. Uncertainty is when you cannot (Knight 1921). A plan for uncertainty spends in stages and looks for early signals.",
      ]}
      sources={["knight1921", "klein2007", "loomes1982", "kahneman1979"]}
    >
      <p className={p}>
        A decision under uncertainty is not a guess. Knight (1921) separated <em>risk</em>, where you know the odds, from <em>uncertainty</em>, where you do not. Customers' reactions to a new way of selling are uncertain. So the question is not “what will happen?” but “how much can I afford to be wrong, and how soon will I know?”
      </p>
      <Diagram label="Three strategies, three reactions · a worked example on Elbtal Systems" caption="Switch to regret, then move the slider for your own estimate of a bad reaction and see when the answer changes.">
        <RegretTable />
      </Diagram>
      <DataTable
        head={["Step", "What you write", "Example (Elbtal, Case assumption)"]}
        rows={[
          ["1 · The decision", "One of: commit, stage, wait. Never “decide later”.", "Stage it: start with the deals already in the pipeline."],
          ["2 · Three assumptions", "How you think customers will react, each with the sign that it is wrong.", "“Buyers accept an exit clause without asking for a discount.” Wrong if discount requests rise in 3 deals."],
          ["3 · The tripwire", "Metric, threshold, date, action.", "Signature rate after a verbal yes reaches 70% by month 3. If not, adjust one lever."],
          ["4 · The pre-mortem", "Imagine it failed. Write down why.", "“We funded references that customers did not want to give.” Check with 3 customers in month 1."],
        ]}
        caption="How to write a decision when reactions are unclear"
      />
      <Callout label="The pre-mortem" tone="signal">
        <p>Klein (2007) suggests one exercise before you start: imagine the plan has already failed and write down the most likely reasons. It brings out the assumptions you were about to rely on without seeing them.</p>
      </Callout>
    </MaterialCard>
  );
}

export function CardB4() {
  return (
    <MaterialCard
      id="B4"
      scan="The largest risk in a plan built on psychology is being wrong about the buyer. Name the misjudgment, watch for the sign that it is happening, and decide in advance what you will do."
      reasoning={[
        "A risk of misjudging customer psychology is an assumption about the buyer: “we assume they …”. A competitor's price cut is a market risk, and a seller's failure to follow through is an execution risk. Do not list those here.",
        "Rate likelihood and impact from low to high. A risk in the high-likelihood, high-impact corner needs a signal and a trigger now. A risk that is low on both is noted and watched.",
        "An early-warning signal must appear before the loss is final: a behaviour you can see in a deal, not the lost deal itself.",
        "A response is a trigger: a number, a date and an action. “Monitor closely” is not a response.",
        "The most dangerous misjudgment is the one that hides the others: taking stated reasons at face value means every other risk stays invisible.",
        "Pressure on a buyer's fear raises resistance (reactance), so a tactic that looks fast can turn a delay into a cancellation.",
        "An overstated claim, once found, damages trust in everything else you said, and a misleading claim is a legal risk (§ 5 UWG).",
      ]}
      sources={["nisbett1977", "klein2007", "brehm1966", "uwg5"]}
    >
      <p className={p}>
        A plan built on psychology rests on assumptions about how buyers feel, and those are the assumptions most often wrong. People do not report their reasons well (Nisbett and Wilson 1977), and you will build on what they said. So the plan needs a list of the misjudgments it could contain, a signal for each, and a pre-agreed response.
      </p>
      <Diagram label="Five misjudgments on a likelihood-by-impact grid · a worked example on Elbtal Systems" caption="Select a risk (by its number) to read the assumption, the early signal and the response. The shaded cells at the top right are the ones that need a trigger now.">
        <RiskMatrix />
      </Diagram>
      <DataTable
        head={["If the risk is about …", "It is a …", "Belongs in a psychology risk analysis?"]}
        rows={[
          ["What we assumed the buyer feels or will do", "Misjudgment of customer psychology", "Yes"],
          ["What a competitor does (prices, offers)", "Market risk", "No. Cover it in the market analysis."],
          ["Whether our own people follow the plan", "Execution risk", "No. Cover it in the governance of the plan."],
        ]}
        caption="Three kinds of risk, and which one this block is about"
      />
      <Bul
        items={[
          "Signal: something you can see before the loss is final, such as a silence after a message, or the same question in three deals.",
          "Response: a number, a date and an action. If fewer than X by month N, do Y.",
          "Owner: one person who can act on it without asking permission.",
        ]}
      />
    </MaterialCard>
  );
}

export function CardB5() {
  return (
    <MaterialCard
      id="B5"
      scan="An architecture is the order and the ownership of your measures: what you measure first, what you build next, who owns each item, and what number makes them act."
      reasoning={[
        "Baseline first. Start recording the buyer's behaviour signals before, or in the same month as, the first lever. Otherwise you cannot tell whether the lever worked.",
        "Owner test: who can change this without asking anyone else? An owner who cannot change the thing is not an owner. Do not put more than two items on the Chief Sales Officer.",
        "Trigger test: it has a metric, a number, a date and an action. If fewer than X by month N, do Y.",
        "The total of the funded items must not exceed the budget. If it does, leave out the item with the weakest evidence for its lever. Do not trim every item a little.",
        "Postponing is a decision: name the item, and give a pickup point, meaning the number and the date at which you will look at it again.",
        "Stage the start. Put the item that produces the signals in the first month, the levers that act before signing next, and the ones that act after signing last.",
        "If you fund a lever that depends on individual people, say who holds it and what happens when they are away.",
      ]}
      sources={["kaplan1992", "doran1981", "deming1986", "meadows1999"]}
    >
      <p className={p}>
        Levers only work if somebody owns them and somebody notices when they do not. The architecture is that layer: what starts when, who owns it, and what makes the owner act. It follows Deming's cycle (1986): plan, do, study, act. The signals are the “study” that keeps the rest honest.
      </p>
      <Diagram label="A six-month architecture · a worked example on Elbtal Systems" caption="Select an item to read why it has this owner, this start month and this trigger.">
        <ArchitectureExample />
      </Diagram>
      <DataTable
        head={["Role", "What the role can change", "Use it for"]}
        rows={OWNER_IDS.map((id) => [OWNERS[id].name, OWNERS[id].profile, ownerUse(OWNERS[id].name)])}
        caption="Profiles of the owner roles"
      />
      <Callout label="The three tests" tone="signal">
        <ol className="list-decimal space-y-1 pl-5">
          <li>Owner: who can change it without asking anyone else?</li>
          <li>Start: does something have to exist before it, such as the baseline?</li>
          <li>Trigger: does it have a metric, a number, a date and an action?</li>
        </ol>
      </Callout>
    </MaterialCard>
  );
}

function ownerUse(name: string): string {
  if (name.startsWith("Chief")) return "Decisions that cross sales and marketing; not day-to-day items.";
  if (name.startsWith("Head of Sales")) return "The CRM, the deal process and standard documents.";
  if (name.startsWith("Sales team")) return "Coaching, reviews and seller habits.";
  if (name.startsWith("Legal")) return "Contract terms and promises.";
  if (name.startsWith("Customer")) return "Anything that needs existing customers.";
  if (name.startsWith("Marketing")) return "Written material, packaging and the website.";
  return "Engineer time and the delivery plan.";
}

export const CARDS_B = [CardB1, CardB2, CardB3, CardB4, CardB5];
