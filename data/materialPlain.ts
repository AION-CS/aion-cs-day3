import type { MaterialId } from "@/data/materialIndex";

/**
 * The "In plain words" box under each card's scan line: the idea in everyday language, why it matters for the day's case
 * and tasks, and how to read the diagram or interactive below. Written for someone who has never met the topic. Typed as
 * a full Record so a card without an explanation fails the typecheck. Every control and label named in `picture` was
 * checked against the component that draws it.
 */
export type PlainExplain = {
  /** The idea itself, in everyday words. */
  idea: string;
  /** Why the learner should care, tied to the case or the task. */
  why: string;
  /** How to read or use the picture below. Omitted for cards without a diagram to read. */
  picture?: string;
};

export const MATERIAL_PLAIN: Record<MaterialId, PlainExplain> = {
  /* ---------------------------------------------------------------- Materi A */
  A1: {
    idea: "A customer who keeps buying from you is not necessarily loyal. They may keep buying because it is their routine, or because changing is a hassle. Real loyalty is when they would choose you again even if leaving were easy. Three things can hold a customer: they trust you, it is their habit, or they feel attached to the people.",
    why: "Today's case starts from a buyer who chose the dearer provider over SecureIT. To understand why, you first need to know what actually holds a buyer to a vendor, and which of the three SecureIT does not yet have with a new prospect.",
    picture: "The three boxes at the bottom are the roots: Trust, Habit and Attachment. Use the three buttons under the picture to switch each one on or off. The box under the buttons, headed “What this shows”, says what kind of customer you would have with only those roots. Below it, the last root you touched is explained.",
  },
  A2: {
    idea: "People do not decide in two separate ways, one cold and one warm. A feeling usually comes first and reasons follow to support it. Even a professional buyer says “this is the safe choice” before they can say what makes it safe. To read a decision you sort what the buyer says into three kinds: facts you could check, feelings, and feelings dressed up as facts.",
    why: "Block 1.1 gives you eight things a buyer said after choosing SecureIT's rival. You sort them with the three tests on this card. The pair of tables at the bottom also show why a better product argument does not help a buyer who is really asking whether it is safe for them.",
    picture: "Each box in the worked example is something the Hansawerk buyer said. Click one: its tag appears in the box and, underneath, the test question, and why it holds. You can open all six.",
  },
  A3: {
    idea: "Four ideas explain most of what pulls a buyer towards or away from a vendor: trust and security (can I depend on them), loss aversion (a loss hurts about twice as much as the same gain pleases), social proof (what did people like me do) and reciprocity (they gave me something first). Loss aversion can be written as a number: the chance the buyer expects something to go wrong, times what it would cost them, times how heavily a loss weighs.",
    why: "Block 1.2 asks you to work out what two offers feel like they cost, once the risk is included. The steps are the ones in the small table on this card, on other numbers. Block 1.3 asks for hypotheses, and each one needs a principle from the first table.",
    picture: "Each bar is one provider. The solid part is the price on the price list; the hatched part is the risk the buyer adds in their head. The dashed line marks where Provider Y ends. Change the loss weight with the first three buttons and apply levers to Provider X with the other buttons. The box “What this shows” says who feels cheaper and what each move changed.",
  },
  A4: {
    idea: "A buyer goes through three phases: they are unsure (uncertainty), they compare (evaluation) and they decide. Each phase has a question in the buyer's mind. If the question is not answered, the deal does not get a “no”: it slows down, and then it stalls at the last step.",
    why: "SecureIT's problem is that prospects delay and drop out shortly before the signature. This card gives you the picture of why: a deal can be well on the way and still stop, because one question is still open.",
    picture: "The thick solid line is how ready the buyer is to sign in each phase. The dashed grey line is a deal where every question was answered; the dashed line labelled “signing line” is the level at which the buyer signs. Use the four buttons under the picture to leave questions unanswered, and see where the thick line ends. The three buttons at the bottom explain each phase.",
  },
  A5: {
    idea: "What a buyer says is often the acceptable reason, not the real one. “Let's talk next quarter” can hide fear, a doubt about the people, or nobody wanting to sign. Six barriers cover most cases, and each has one test question. Four pairs of barriers look alike, and each pair has its own question that tells them apart.",
    why: "Block 2.1 gives you twelve real-sounding exit notes from SecureIT's stalled deals. You tag each one with a barrier, using the tests on this card. Your tags then decide which four patterns you name in Block 2.2.",
    picture: "Each box in the worked example is an exit note from Elbtal Systems, another vendor. Click one to see the barrier, the words that give it away (highlighted), the test question and why the nearest alternative does not fit. You can open all six.",
  },
  A6: {
    idea: "Some barriers stop more deals than others. To rate one, count how many notes show it and how many of those deals were cancelled. Add the two numbers: that is its strength in points. Then be honest about what the notes cannot tell you, such as what happened to the buyers who did sign.",
    why: "Block 2.2 asks you to name the four barriers that matter most, describe what buyers do, rate each one and say what you still do not know. The rule for the rating is on this card and is applied to your own tags, so it fits whatever you tagged.",
    picture: "Each bar is one barrier in Elbtal's ten reviewed deals. Use the first pair of buttons to switch the ranking between “notes only” and “notes + dropouts”: the dashed amber part is the dropouts. The second row of buttons picks one barrier to read its points and its strength.",
  },
  A7: {
    idea: "A measure is only useful if it answers the barrier your evidence shows. Give each measure three scores from 1 to 3: how much it changes buyer behaviour (influence), how easy it is to do (feasibility) and how soon it works (speed). Multiply them and compare, then check that the costs fit the budget.",
    why: "Block 2.3 gives you nine possible measures, €100,000 and three months. You choose three, say which barriers each one answers, score them and put them in order. The rules for every score are on this card.",
    picture: "The table lists three measures from Elbtal Systems. The tick box in front of each puts it in or out of the plan. Click an Influence or Feasibility number to change it; Speed follows from the weeks. The bar under the table is the budget: a hatched amber part is over budget. The box “What this shows” says which measure to leave out.",
  },

  /* ---------------------------------------------------------------- Materi B */
  B1: {
    idea: "A manager cannot talk to every buyer. What a manager can do is design the way buying happens, so that the safe choice is also the easy one. There are four levels to intervene at: what the seller says, how a person behaves in a deal, how the process is built, and the rules that decide the process. The higher levels last, because they do not depend on one seller.",
    why: "Route 2 asks you to build a model of how buyers decide and to choose three levers. This card gives you the way to think about both: one row per phase for the model, and the four levels to tell an individual intervention from a system.",
    picture: "The four columns are the levels, from Argument on the left to Structure on the right. The dark part of each column is how much of its effect stays. Use the first buttons to read a level and the second pair to send the seller away: when they leave, only the process and the structure keep most of their effect. The loop underneath is drawn as a picture only.",
  },
  B2: {
    idea: "To find where the leverage is, rate each lever on four questions: how many deals it touches (reach), how strongly it changes one deal (depth), whether it lasts when the seller changes (durability) and whether the cost per deal falls as volume grows (scale). Levers built into the process or a rule score highest.",
    why: "Block 3.3 asks you to choose three levers and rate each one on these four tests, and to say which one is the greatest lever and which is scalable. The limits on this card tell you what a rating may not exceed.",
    picture: "Each row is a lever from Elbtal Systems and each column is one of the four tests. Three dots mean 3, two dots mean 2, one dot means 1. Click any rating and the box underneath gives the test and the reason. The box “What this shows” compares the totals.",
  },
  B3: {
    idea: "You will never know how customers will react before you decide. What you can do is choose how much to risk, and choose in advance the result that will make you change course. Waiting is not a way out: it is a choice to let the stall go on. A staged start with a tripwire limits how much a bad reaction costs.",
    why: "Block 3.6 asks you to decide, in writing, before the customers' reactions are known. You name the decision, three assumptions and a tripwire, and you answer a challenge from the board.",
    picture: "The table shows three strategies and three ways customers might react, in thousands of euros. Click a column heading to highlight it. The first pair of buttons switches between the net result and the regret (how much less than the best you would get). The slider is your own estimate of a bad reaction. “What this shows” tells you which strategy wins on each reading.",
  },
  B4: {
    idea: "A plan built on psychology is only as good as your understanding of the buyer, and that is the part most likely to be wrong. So write down the ways you could be wrong, for each one the sign that it is happening, and what you will do if you see it. A competitor cutting prices or your own team not following through are different risks and belong elsewhere.",
    why: "Block 3.4 asks for three misjudgments of customer psychology with a likelihood, an impact, an early signal and a trigger. This card shows how to write each one and which risks do not belong.",
    picture: "The grid puts five of Elbtal's risks by how likely they are (left to right) and how bad they would be (bottom to top). The shaded cells at the top right, where both are high, are the ones that need a trigger now. Click a numbered circle or the list to read the assumption, the signal and the response.",
  },
  B5: {
    idea: "An architecture is the order and the ownership of your measures. Start by measuring what buyers do, then run the levers, and give each one an owner who can change it without asking anyone, and a trigger with a number that tells the owner when to act. If the money does not stretch, leave something out on purpose and say when you will look at it again.",
    why: "Block 3.5 asks you to fund items within a limited budget, set start months, name owners and write triggers. This card shows a finished example and the three tests that decide each choice.",
    picture: "Each row is one of Elbtal's items and each column a month. The dark box is the start month, the pale boxes after it are running. Click a row to read why it has this owner, this start and this trigger. The text under the table says what was left open and when it will be reconsidered.",
  },
};

export const plainOf = (id: MaterialId): PlainExplain => MATERIAL_PLAIN[id];
