# Retention Lab · Day 3

**Customer Retention & Buying Behaviour in B2B IT Sales · Module 2, Day 1 of 2.**
*Psychological foundations of customer loyalty and behaviour control in the buying process.*
A self-study companion: study material, five live instruments (a felt-cost scale, a decision path, a barrier-tagging board, a
measure scorer and a regret table) and two working documents built on them. It carries the shared standards `../CLAUDE.md` #1 to
#28 (the day-1 level of interaction) and **#30, the two-route form that starts with this day**.

The case company is **SecureIT Systems GmbH**, a German IT security provider: *many prospects, a high abandonment rate before
contract closing, customers who delay their decisions.* Route 1 works it with €100,000 and three months; Route 2 puts the learner in
the Chief Sales Officer's chair with €120,000 and six months (Case assumption).

This repo was bootstrapped from `day2` (same chrome, primitives, store pattern and tokens) and its content was replaced. The Day 2
history is kept in git; nothing of DigitalIT Solutions remains in the tree.

> **Before you push:** `git remote -v` still points at `aion-cs-day2`, because the folder was copied from Day 2. Create or select
> the `aion-cs-day3` repository and set the remote first (`../CLAUDE.md` #17).

## Routes

| Route | Content | Export |
|---|---|---|
| `/route-1/` **Levels 1 + 2** | **Materi A**: seven cards, 60 min (A1 what creates loyalty, A2 rational and emotional decisions, A3 four principles and the felt cost, A4 the buying process, A5 reading behaviour: six barriers, A6 strength of a barrier and what is missing, A7 from barrier to measure). **Task 1, Behaviour Analysis**: one case, one task, two parts. *Part 1 · Understand the decision:* 1.1 sort what the buyer said and add a reason of your own, 1.2 trust, risk and the felt cost (three figures and a sentence), 1.3 three hypotheses, 1.4 coaching reflection. *Part 2 · Analyse and act:* 2.1 tag twelve exit notes, 2.2 four patterns, their strength and what is missing, 2.3 choose three measures, score and order them. | `1-{name}-day3-l1l2-behaviour-analysis.html` |
| `/route-2/` **Level 3** | **Materi B**: five cards, 60 min (B1 behaviour as a competitive factor, B2 leverage, B3 deciding under unclear reactions, B4 the risk of misjudging customers, B5 architecture). **Task 2, Decision Memo**, with the memo assembling itself beside the questions: 3.1 three central factors, 3.2 the control model, 3.3 three strategic levers, 3.4 risk analysis, 3.5 the measures architecture, 3.6 the decision, the tripwire and the board's challenge. | `2-{name}-day3-l3-decision-memo.html` |

Minutes: Materi A 60 + Task 1 65 (8 + 12 + 8 + 5 + 10 + 10 + 12), Materi B 60 + Task 2 55 (5 + 8 + 10 + 8 + 12 + 10). All in `lib/routes.ts`.

Route 2 quotes the learner's Route 1 patterns and measures in a soft box (`useJumpTo`) and never requires them; the routes share no answer fields.

## Stack

Next.js 14 App Router · TypeScript strict · Tailwind (tokens in `tailwind.config.ts`, the CS palette) · Zustand + `persist` (key
`cs-d3-v1`, version 1, `skipHydration` + `StoreHydrator`, a generic deep `mergeDefaults`) · static export (`output: "export"`,
`trailingSlash`). No animation, drag-and-drop, PDF or chart library: hand-written SVG, CSS keyframes, native HTML5 DnD with a
click-to-place fallback, `window.print()`. Hosting in a sub-folder: set `NEXT_PUBLIC_BASE_PATH`.

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck
npm run verify:calc  # re-derives every figure and rule from the data files and compares them with the briefed results
npm run build        # writes the static site to out/  (stop `npm run dev` first)
```

## Layout

```
app/                  page.tsx (home) · route-1/ · route-2/
components/chrome/    MentorBar, TopBar, ParticipantStrip, SectionRail, PageNav, GlossaryPanel, HashFlash, Footer, StoreHydrator, RouteCards
components/ui/        MaterialCard, PlacementBoard (sort/tag board with undo), Inputs (TextBox, OptionList, ScorePick, CheckBar), AnswerBlock, AnswerKey, MentorGuide, RevealHint, FormulaBuilder, CalcDiagnosis, ExportBar, BudgetBar, Field …
components/materi/    diagramsA / CardsA (A1–A7), diagramsB / CardsB (B1–B5), Materi (the two blocks + references)
components/task1/     Part1 (blocks 1.1–1.4), Part2 (2.1–2.3), Task1 (case brief, parts, export)
components/task2/     Blocks (3.1–3.6), MemoPanel (live memo), Task2 (situation, layout, export)
data/                 barriers, debrief, exitNotes, feltCost, hypotheses, measures, route2, references, glossary, materialIndex, materialPlain, dayIntro, pageNav, mentorKey
lib/                  checks, missing, progress, exportDoc, answerKey, mentorGuide, calcBuilder, routes, slug, flash, svg, parseAmount, glossify, useJumpTo
store/                useStore (slices l1 and r2), usePersisted, useGloss
scripts/              verify-calc.cjs
```

## What is in the data

One data file per kind of content, so the material, the tasks, the checks, the keys and the export cannot drift:

- `barriers.ts`: the six barriers (Fear, Trust, Proof, Inertia, Overload, Owner) with principle, profile, test question and pair tests, and the four principles of A3.
- `debrief.ts`: eight buyer statements (3 Rational, 3 Emotional, 2 Both) with the test, the clue, the reason and why each rejected tag is rejected.
- `exitNotes.ts`: twelve exit notes (counts 3, 3, 2, 2, 1, 1; six dropped out, six delayed), the strength rule (notes + dropouts: 5+ High, 3–4 Mid, ≤2 Low) and seven "what is missing" items.
- `feltCost.ts`: the felt cost = price + loss weight × chance × loss. SecureIT €80,000, 12%; Sentinel €96,000, 4%; loss €150,000; weight 2 → **F1 116,000, F2 108,000, F3 8,000**. Also the worked example of A3 (Hansawerk).
- `measures.ts`: nine measures with cost, weeks, dependencies and reference scores (influence × feasibility × speed): three score 18, the decision paper 12, the rest 9 or less. The three model measures cost €84,000; all four that work cost €102,000, so the €100,000 forces a choice.
- `route2.ts`: six factors, three phases with their question, factor and signal, eight levers with printed facts and model ratings, eight risks (six psychology, two not), the owner roles, the architecture rules, the three decisions and the tripwire metrics with baselines.

`npm run verify:calc` pins all of it (about 70 assertions).

## Plain-language glossary

Every technical term, abbreviation and German word in the material and the tasks is an entry in `data/glossary.ts` (about 50 entries).
In the text it is a dotted-underlined button (`lib/glossify.tsx`); a click opens one explanation card (`GlossaryPanel`) written for a
non-expert. Cards, bullets, tables, callouts, captions and field help are glossified automatically; other prose is wrapped in
`<Gloss>`. Terms inside a sortable item cannot be links (a button cannot contain a button), so the sort boards carry a "Words in the
statements" line under them. Rule: `../CLAUDE.md` #19.

## What a learner sees on top of the material and the tasks

- **Home page** (`data/dayIntro.ts`, #27): "What today is about" with the case and one tile per route, then "What's in it for you", seven skills with their pay-off at the learner's own work, each tagged with the route that teaches it.
- **Page map** (`components/chrome/PageNav.tsx`, `data/pageNav.ts`, #28): every card and every task block of the route, in page order.
- **"In plain words" box** on every card (`data/materialPlain.ts`, #22): a full `Record<MaterialId, …>`, so a card without one fails the typecheck.
- **"What this shows"** under every exploratory control (#20): the three-roots toggles, the worked sort, the felt-cost scale, the decision path, the barrier example, the strength ranking, the measure scorer, the intervention ladder, the lever profile, the regret table, the risk grid and the architecture example.
- **Hidden helps under a calculation** (#21, #24, #26): Block 1.2's F1, F2 and F3 each carry "Show the formula" (in words, no numbers, naming Materi A3, plus an automatic calculator that splits it into labelled parts) and "Show where the numbers are" (the printed rows, each a button that scrolls to and flashes its row). After a check a wrong part is outlined in amber and names the row to read, never the value; a flagged figure always gets a specific "What to check" line.
- **Test questions for the assignment exercises** (#25): the sort in 1.1, the tagging in 2.1, the measure-to-barrier matching in 2.3 and the owner choice in 3.5 each have a hidden "Show the test questions" that repeats the tests and never says which option fits which item.
- **Consequence pictures** (#16): the coverage list in 2.3 (which of your four patterns nothing you chose acts on), the budget bars (an amber hatch beyond the line), the sequence sentences in 3.5 and the risk grid in 3.4.
- **"Highlight the key words"** on the sort board (1.1) and the tagging board (2.1) (`components/ui/PlacementBoard.tsx`): an optional toggle beside "Show clue" that underlines the decisive phrase inside every statement's or note's own text at once — never only the wrong ones, and never which bin it points to. The phrases live next to each item's data (`data/debrief.ts`, `data/exitNotes.ts`).
- **"Show clue and example answer"** on every free-text field (added 2026-09-27, CLAUDE.md #23 update): a small button, open to every participant with no passcode, that reveals one worked example answer — the same `answer` string the mentor's worked guide uses (`lib/mentorGuide.ts`), so the two can never drift apart. This is the one named exception to check-on-demand's "clue, not answer" (#4), and it applies only to free text, never to the sort or tagging boards above.
- **Check on request** (#4): a Check marks something only when pressed and gives a question, not the answer. The sorts report only how many hold. The count of checks is printed in each export's footer.

## Mentor bar

The first element on every page. Enter `muchson123` once and every model answer of Routes 1 and 2 fills in (plus a participant name if empty; it also fills every formula calculator's parts), so each export downloads straight away. The same unlock shows two mentor-only tools, in rust and never the amber accent:

- an **answer key** next to each exercise with fixed options: the sort (1.1), the tagging (2.1), the four patterns and their strength (2.2), the missing information (2.2), the measures (2.3), the order (2.3), the factors (3.1), the control model (3.2), the levers (3.3), the risks (3.4), the owners (3.5), the decision and the tripwire (3.6). Each gives the expected answer, a reason per option including why each rejected option is rejected, and a teaching note where more than one answer defends;
- a **worked answer** for every other question (`lib/mentorGuide.ts`, #23): F1, F2 and F3 as tables of *step · calculation · result* with the pitfalls and the number each produces, the sentence in 1.2, each hypothesis, each reflection, each pattern (with the strength worked out from the counts), the missing-information question, the scores of each measure, the priority reason, and in Route 2 each factor definition, each phase's move, the ratings of each lever, the greatest lever, each risk response, each trigger, the postponed item and pickup, each assumption and the board's answer.

Client-side convenience gate, not security; the unlock is session-only, so a reload locks it.

## Notes on deviations from the brief and the shared rules

1. **Two routes, by the user's explicit request (CLAUDE.md #30, new).** The shared rule #12 says three routes per day. The user asked for two from Day 3: Route 1 = Levels 1 and 2 with one merged case, Route 2 = Level 3. `../CLAUDE.md` #30 records it as a standing rule and #12 carries a pointer.
2. **The Level 1 tasks and the Level 2 case are merged into one case.** The plan has Task 1 (a company chooses the dearer provider), Task 2 (customers drop out before signing) and the case study (SecureIT Systems). All three run on SecureIT: the dearer-provider scenario is a debrief after SecureIT lost the Rheinwerk Logistik deal (Provider A = SecureIT, cheaper; Provider B = Sentinel Group, dearer and better known), and the drop-outs are twelve exit notes. Every numbered task of the plan is answered somewhere in Part 1 or Part 2 (see the coverage table).
3. **English only.** CURRICULUM-GUIDE §1. The pasted plan was the Indonesian version; the site stays in English for the German learners, as on Days 1 and 2. The German switch of Day 2 was a waiver for that day and was removed with the rest of the language machinery.
4. **No Friday capstone, no optional routes.** #29 was Day 2's rule; this is a full day of two routes.
5. **The felt-cost model is an illustration, not a finding.** Loss aversion is given a number so the learner can see a dearer offer feel cheaper. Tversky and Kahneman (1992) estimated a loss weight of about 2.25 in laboratory choices; the case uses 2, says so on screen, and the material states that real buyers do not compute this. All the inputs (prices, chances, the €150,000 loss) are Case assumptions.
6. **Every figure beyond the brief is a Case assumption**, labelled where it appears: the deal names and buyers' words, the twelve exit notes, the nine measures' costs and weeks, the €120,000 and six months of Route 2, the lever costs, the KPI baselines (60%, 41 days, 10%, 30%, 14 emails) and the regret-table payoffs. The plan gives only €100,000, three months, the role and the situation.
7. **The score of a measure is the learner's own priority score.** Influence × feasibility × speed is printed in the export because the plan names it as the evaluation; it is not a mark, and the export prints no ticks, crosses or answer keys.
8. **Strength and central patterns are checked against the learner's own tally.** Block 2.2 compares the four barriers and their ratings with the counts from the learner's own tags in 2.1 (the rule of A6), not with the reference table. A learner who tagged one note differently can still be right in 2.2; 2.1's own check reports how many of the twelve hold. The reference answer is Fear High, Trust High, Proof Mid, Overload Low.
9. **Influence is judged; speed is not.** Speed follows the printed weeks by the rule of A7 (4 weeks or fewer = 3, 5 to 8 = 2, more than 8 = 1), and a check outlines a score that does not follow it. Feasibility and influence are the learner's judgement; the model scores and reasons are in the answer key and the worked answers.
10. **Deselecting keeps the work.** Choosing a fourth measure, lever or risk is refused with a note; removing one keeps the entries for it and they come back if it is chosen again (CLAUDE.md #13, #5).
11. **The decision block accepts two of three options.** "Commit now" and "Stage it" both defend (with different reasoning); "Wait for more research" is outlined by a check with a question, because the brief asks for a decision before the reactions are known and Materi B3's regret table shows waiting has the largest regret under every reading.
12. **Route 2's architecture uses the learner's own levers.** The items of Block 3.5 are the three levers chosen in 3.3 plus the two enabling items (behaviour signals and seller training) not already chosen. The two rules checked are "baseline first" (the signals start no later than the first other item) and "inside the budget". If the levers are not chosen yet, the block says so and works with what it has; nothing is locked.
13. **Reset semantics.** "Reset Route 1" clears the `l1` slice and its cards marked read, "Reset Route 2" the `r2` slice; the participant name stays. There are no shared answer fields between the routes.
14. **Persist version 1.** This is the first shape of Day 3 (`cs-d3-v1`); there is nothing older to migrate. `mergeDefaults` fills every missing field, drops a value of the wrong type, and keeps free-form maps (parts, ratings) whole.
15. **Sources need a check before teaching.** The references are published works cited by their usual details (author, year, journal and pages). Page ranges and editions differ between printings, and § 5 UWG is quoted in outline; please re-check each before you teach from it. The accordion under each Materi says so.
16. **Retrofitted 2026-09-27: "Highlight the key words" and "Show clue and example answer" (CLAUDE.md #23 update, from Day 4).** Both were added to Day 4 after this day was built and then brought back here on request. `PlacementBoard` gained an optional `keyPhrases` map and a toggle; `data/debrief.ts` and `data/exitNotes.ts` each gained a `key` field, an exact substring of the item's own quote or note text (verified by script, never the item beside it). `components/ui/ExampleAnswer.tsx` is new and is wired to every free-text field across both routes, reading `guide.answer` from the same `lib/mentorGuide.ts` entry the mentor tools already used, so nothing was retyped. No other block changed.
17. **The same day, refined further: a field whose "answer" IS the case's own calculated result or one of a small fixed set of correct picks does not show that result to a learner verbatim.** `lib/mentorGuide.ts`'s `MentorGuide` type gained an optional `example`, a separately written worked example on generic names and different numbers, teaching the same method without handing over this case's own comparison or its own correct picks; `<ExampleAnswer>` prefers it over `answer` when present. Four guides needed one: `roleGuide` (1.2 — the felt-cost comparison, now "Company A / Company B" on different figures), `behaviourGuide` (2.2 — the pattern description and its strength, now a generic "rival's proposal" scenario), `whyGuide` (2.3 — which three measures and in what order, now "Measure A / B / C"), `greatestGuide` (3.3 — which lever is greatest, now "Lever B" answering "Barrier X"). The mentor's own worked answer (`<MentorGuide>`, passcode-gated) is unaffected: it still reads `answer`, the real model text.

## Coverage: where each task block is taught, and what helps

| Block | Taught in | Help while answering |
|---|---|---|
| 1.1 Sort what the buyer said | A2 (three tests, worked sort on Hansawerk) | Show the test questions · Check (how many hold) + clue per statement · reasoning after two checks · undo/redo |
| 1.2 Felt cost and the sentence | A3 (four principles, felt-cost scale, the four steps on other numbers) | FIND IT · Show where the numbers are · Show the formula + calculator · Check + per-part clues + "What to check" |
| 1.3 Three hypotheses | A1, A2, A3 (the mechanisms; the frame) | The frame in the block · Check (distinct mechanisms, a reason) + clue |
| 1.4 Coaching reflection | A2 (coaching focus) | Character counter; worked answers for the mentor |
| 2.1 Tag the notes | A5 (six profiles, four pair tests, worked example on Elbtal) | Show the test questions · Check + clue per note · reasoning after two checks · undo/redo |
| 2.2 Patterns, strength, missing | A6 (strength rule, pattern format, four kinds of gap) | Your tally · Check against your own tally · Check my choices |
| 2.3 Measures, scores, order | A7 (matching table, three score rules, budget, ethics tests) | Show the test questions · budget bar · coverage list · Check (aims, speed) · order check |
| 3.1 Factors | B1 (the rule for a central factor) | Check (trust and risk) + clue |
| 3.2 Control model | B1 (model rows, phase rules), B3 | Check (how many of nine) + clue |
| 3.3 Levers | B1 (ladder), B2 (four tests, limits) | Printed facts on each lever · Check (ratings above the limits, systemic count) |
| 3.4 Risks | B4 (three kinds of risk, signal and response rules) | Check (how many are psychology risks; signal outlines) |
| 3.5 Architecture | B5 (owner, start, trigger tests; profiles) | Show the owner test · budget bar · sequence sentences · Check (two rules) |
| 3.6 Decision | B3 (regret, tripwire, assumptions, the challenge) | Baselines printed · Check (wait, activity metric, threshold) |
