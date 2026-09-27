"use client";

import clsx from "clsx";
import { Toggles } from "@/components/materi/kit";
import { AnswerBlock } from "@/components/ui/AnswerBlock";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { BudgetBar } from "@/components/ui/BudgetBar";
import { ExampleAnswer } from "@/components/ui/ExampleAnswer";
import { Field } from "@/components/ui/Field";
import { CheckBar, OptionList, Reading, ScorePick, TextBox } from "@/components/ui/Inputs";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { MentorGuide } from "@/components/ui/MentorGuide";
import { PlacementBoard } from "@/components/ui/PlacementBoard";
import { RevealHint } from "@/components/ui/RevealHint";
import { WritingHelp } from "@/components/ui/WritingHelp";
import { BARRIERS, BARRIER_IDS, BARRIER_PAIR_TESTS } from "@/data/barriers";
import type { BarrierId } from "@/data/barriers";
import { EXIT_NOTES, INFO_ITEMS, OUTCOME_LABEL, STRENGTH_LABEL, STRENGTH_ORDER } from "@/data/exitNotes";
import type { InfoId, NoteId, Strength } from "@/data/exitNotes";
import { BUDGET, CHOOSE, MEASURES, MEASURE_BY_ID, MONTHS, SPEED_RULE } from "@/data/measures";
import type { MeasureId } from "@/data/measures";
import { aimsHold, allTagged, coverage, infoHolds, measureScore, measureScored, orderInversions, ownPoints, patternCheck, speedHolds, tagHolds, tallyOf, totalCost } from "@/lib/checks";
import { scrollToAndFlash } from "@/lib/flash";
import { Gloss } from "@/lib/glossify";
import { euro } from "@/lib/lang";
import { IDS } from "@/lib/missing";
import { infoKey, measureKey, orderKey, patternKey, tagKey } from "@/lib/answerKey";
import { behaviourGuide, infoTextGuide, scoreGuide, whyGuide } from "@/lib/mentorGuide";
import { MIN_SENTENCE } from "@/lib/progress";
import { BLOCK_MINUTES } from "@/lib/routes";
import { useStore } from "@/store/useStore";
import type { Score } from "@/store/useStore";

/* ------------------------------------------------------------------ Block 2.1 */

export function Block21() {
  const l1 = useStore((s) => s.l1);
  const place = useStore((s) => s.placeTag);
  const undo = useStore((s) => s.undoTags);
  const redo = useStore((s) => s.redoTags);
  const patch = useStore((s) => s.patchL1);
  return (
    <AnswerBlock
      id="block-2-1"
      title="Block 2.1 · Tag the twelve exit notes with a barrier"
      kind="OBJECTIVE"
      minutes={BLOCK_MINUTES["2.1"]}
      findIt="Route 1 → Task 1 → “Twelve exit notes” in the case above. Read each note, find the phrase that decides it, and answer on the tagging board below."
    >
      <MaterialRefs refs={["A5"]} />
      <PlacementBoard<BarrierId>
        items={EXIT_NOTES.map((n) => ({ id: n.id, meta: `${n.deal} · ${n.sector} · ${n.stage} · ${OUTCOME_LABEL[n.outcome]}`, text: n.text }))}
        bins={BARRIER_IDS.map((b) => ({ id: b, label: BARRIERS[b].label, hint: BARRIERS[b].principle }))}
        value={l1.tags}
        onPlace={(id, b) => place(id as NoteId, b)}
        onUndo={undo}
        onRedo={redo}
        undoCount={l1.tagHistory.length}
        redoCount={l1.tagFuture.length}
        domId={IDS.note}
        clues={Object.fromEntries(EXIT_NOTES.map((n) => [n.id, n.clue]))}
        reasons={Object.fromEntries(EXIT_NOTES.map((n) => [n.id, n.why]))}
        keyPhrases={Object.fromEntries(EXIT_NOTES.map((n) => [n.id, n.key]))}
        result={l1.tagResult}
        checks={l1.tagChecks}
        onCheck={() => patch((s) => ({ checks: s.checks + 1, tagChecks: s.tagChecks + 1, tagResult: tagHolds(s.tags) }))}
        onClue={() => patch({ tagClue: true })}
        clueShown={l1.tagClue}
        reasoningOpened={l1.tagReasoning}
        onOpenReasoning={() => patch({ tagReasoning: true })}
        noun="note"
        checkLabel="Check my tags"
        intro="Drag a note into a barrier, or select it and then select a barrier. Select a placed one to move it again. Tag one barrier per note."
        tests={
          <RevealHint id="tag-tests" label="Show the test questions" title="Test questions · taught in Materi A5">
            <div className="space-y-2 text-caption text-ink">
              <p>Ask the test of the barrier you suspect. They repeat the tests from Materi A5; they never say which note goes where.</p>
              <ul className="space-y-1.5">
                {BARRIER_IDS.map((b) => (
                  <li key={b}>
                    <span className="font-semibold">{BARRIERS[b].label}. </span>
                    <Gloss>{BARRIERS[b].test}</Gloss>
                  </li>
                ))}
              </ul>
              <p className="smallcaps text-ash">When two barriers both seem to fit</p>
              <ul className="space-y-1.5">
                {BARRIER_PAIR_TESTS.map((t) => (
                  <li key={t.pair}>
                    <span className="font-semibold">{t.pair} </span>
                    <Gloss>{t.test}</Gloss>
                  </li>
                ))}
              </ul>
              <MaterialRefs refs={["A5"]} lead="Taught in" />
            </div>
          </RevealHint>
        }
      />
      <p className="text-caption text-ash">
        Words in the notes, explained in plain language: <Gloss>verbal yes, exit terms, master agreement, onboarding.</Gloss>
      </p>
      <AnswerKey block={tagKey()} />
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 2.2 */

const STRENGTH_OPTS = STRENGTH_ORDER.map((s) => ({ id: s, label: `${STRENGTH_LABEL[s]} ${s === "high" ? "●●●" : s === "mid" ? "●●○" : "●○○"}` }));

export function Block22() {
  const l1 = useStore((s) => s.l1);
  const patch = useStore((s) => s.patchL1);
  const mentor = useStore((s) => s.mentorUnlocked);
  const tally = tallyOf(l1.tags);
  const complete = allTagged(l1.tags);
  const pc = patternCheck(l1);
  const flaggedRows = l1.patResult ? l1.patterns.map((_, i) => !pc.rowsBarrier[i] || (!!l1.patterns[i].strength && !pc.rowsStrength[i])) : [];

  const setRow = (i: number, p: Partial<{ barrier: BarrierId | null; behaviour: string; strength: Strength | null }>) =>
    patch((s) => ({ patterns: s.patterns.map((r, j) => (j === i ? { ...r, ...p } : r)), patResult: null }));
  const check = () =>
    patch((s) => {
      const c = patternCheck(s);
      return { checks: s.checks + 1, patResult: { barrier: c.barrier, strength: c.strength, filled: c.filled }, patClue: false };
    });
  const checkInfo = () => patch((s) => ({ checks: s.checks + 1, infoResult: infoHolds(s.info) }));
  const toggleInfo = (id: InfoId) => patch((s) => ({ info: s.info.includes(id) ? s.info.filter((x) => x !== id) : [...s.info, id], infoResult: null }));

  return (
    <AnswerBlock
      id="block-2-2"
      title="Block 2.2 · Name the four central patterns, rate them, say what is missing"
      kind="OBJECTIVE + JUDGED"
      minutes={BLOCK_MINUTES["2.2"]}
      findIt="Route 1 → Task 1 → “Your tally” directly below: it counts your own tags from Block 2.1. Answer in the four pattern rows and the two fields under them."
    >
      <MaterialRefs refs={["A5", "A6"]} />
      <div id="tally-panel" className="space-y-2 rounded-lg border border-line bg-mist/50 p-3">
        <p className="smallcaps">Your tally · from your tags in Block 2.1</p>
        {!complete && (
          <p className="text-caption text-ash">
            {tally.tagged} of 12 notes are tagged, so the tally below is not complete yet.{" "}
            <button type="button" onClick={() => scrollToAndFlash("block-2-1", "ref", "start")} className="font-semibold text-ink underline decoration-dotted underline-offset-2">
              Go to Block 2.1
            </button>
            . Nothing is blocked; the check simply reads what is there.
          </p>
        )}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[26rem] border-collapse text-caption">
            <caption className="sr-only">Notes and dropouts per barrier, from your own tags</caption>
            <thead>
              <tr className="text-left text-micro uppercase text-ash">
                <th className="py-1 pr-2">Barrier</th>
                <th className="py-1 pr-2 text-right">Notes</th>
                <th className="py-1 pr-2 text-right">Dropped out</th>
                <th className="py-1 pr-2 text-right">Points</th>
              </tr>
            </thead>
            <tbody>
              {BARRIER_IDS.map((b) => (
                <tr key={b} className="border-t border-line">
                  <td className="py-1 pr-2 font-semibold">{BARRIERS[b].label}</td>
                  <td className="tnum py-1 pr-2 text-right">{tally.count[b]}</td>
                  <td className="tnum py-1 pr-2 text-right">{tally.dropped[b]}</td>
                  <td className="tnum py-1 pr-2 text-right">{ownPoints(b, tally)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-micro normal-case tracking-normal text-ash">
          Points = notes + dropouts. The rating rule (5 or more High, 3 to 4 Mid, 2 or fewer Low) is in Materi A6. The tally shows counts; it does not say which barriers are the central four or how strong each is.
        </p>
      </div>

      <div className="space-y-4">
        {l1.patterns.map((r, i) => (
          <div key={i} className="space-y-2">
            <Field
              id={IDS.pattern(i)}
              htmlFor={`pattern-${i}-behaviour-in`}
              label={`Pattern ${i + 1}`}
              help={`Choose the barrier, say what buyers do and why (“When …, buyers …, because …”, at least ${MIN_SENTENCE} characters), then rate how strongly it holds back the signature.`}
              flagged={l1.patResult ? flaggedRows[i] : false}
              clue={
                r.barrier && !pc.rowsBarrier[i]
                  ? "Which four barriers have the most notes in your own tally above? This one is not among them, or it repeats another row."
                  : "Add the notes and the dropouts of this barrier from your tally, then compare the total with the bands 5 or more, 3 to 4, and 2 or fewer."
              }
              clueShown={l1.patClue}
              onShowClue={() => patch({ patClue: true })}
              meta={<span className={clsx("tnum text-micro normal-case tracking-normal", r.behaviour.trim().length >= MIN_SENTENCE ? "text-signal" : "text-ash")}>{`${r.behaviour.trim().length} / ${MIN_SENTENCE} characters`}</span>}
            >
              <div className="grid gap-2 md:grid-cols-[minmax(0,16rem)_1fr]">
                <div>
                  <label htmlFor={`pattern-${i}-barrier`} className="smallcaps block">
                    Barrier
                  </label>
                  <select id={`pattern-${i}-barrier`} className="field mt-1" value={r.barrier ?? ""} onChange={(e) => setRow(i, { barrier: (e.target.value || null) as BarrierId | null })}>
                    <option value="">Choose a barrier…</option>
                    {BARRIER_IDS.map((b) => (
                      <option key={b} value={b}>
                        {BARRIERS[b].label}
                      </option>
                    ))}
                  </select>
                  {r.barrier && (
                    <p className="mt-1 text-micro normal-case tracking-normal text-ash">
                      Your tally: {tally.count[r.barrier]} note{tally.count[r.barrier] === 1 ? "" : "s"}, {tally.dropped[r.barrier]} dropped out.
                    </p>
                  )}
                </div>
                <textarea id={`pattern-${i}-behaviour-in`} rows={3} className="field" value={r.behaviour} onChange={(e) => setRow(i, { behaviour: e.target.value })} aria-describedby={`pattern-${i}-behaviour-in-help`} placeholder="When …, buyers …, because …" />
              </div>
              <div className="mt-1">
                <p className="smallcaps">How strongly does it hold back the signature?</p>
                <Toggles<Strength> label={`Strength of pattern ${i + 1}`} value={r.strength} onChange={(v) => setRow(i, { strength: v })} options={STRENGTH_OPTS} />
              </div>
            </Field>
            <ExampleAnswer id={`pattern-${i}-example`} guide={behaviourGuide(i)} />
            {mentor && <MentorGuide guide={behaviourGuide(i)} />}
          </div>
        ))}
        <CheckBar onCheck={check} checkLabel="Check my patterns" checks={l1.checks} />
        {l1.patResult && (
          <Reading>
            {complete ? (
              <>
                {l1.patResult.barrier} of 4 barriers are among your four most frequent (and different from each other). {l1.patResult.strength} of {l1.patResult.filled} ratings agree with the rule applied to your own tally. Rows that do not are outlined; each has a clue that asks you to read your own tally.
              </>
            ) : (
              <>The check reads your own tally, which is not complete: {tally.tagged} of 12 notes are tagged. Tag the rest in Block 2.1 and check again.</>
            )}
          </Reading>
        )}
        <AnswerKey block={patternKey()} />
      </div>

      <div className="space-y-3 border-t border-line pt-3">
        <div id={IDS.info}>
          <p className="font-semibold text-ink">What does the file not tell you?</p>
          <p className="text-caption text-ash">
            Choose two or more things you would want to know that would change which barrier SecureIT tackles or which measure it funds. Test each with the two questions in Materi A6.
          </p>
          <div className="mt-2">
            <OptionList<InfoId> multi label="Missing information" options={INFO_ITEMS.map((i) => ({ id: i.id, label: i.label }))} value={l1.info} onChange={toggleInfo} />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <button type="button" onClick={checkInfo} className="btn-ghost btn-sm">
              Check my choices
            </button>
            {l1.infoResult && (
              <span role="status" className="text-caption text-ink">
                {l1.infoResult.chosen === 0 ? "Nothing chosen yet." : `${l1.infoResult.holds} of ${l1.infoResult.chosen} chosen would change what SecureIT does. The others are about the vendor's activity or are already in the file.`}
              </span>
            )}
          </div>
          <AnswerKey block={infoKey()} />
        </div>
        <TextBox
          id={IDS.infoText}
          label="The one question you would ask the buyers who dropped out"
          help="One question, addressed to the buyer, about what they felt or feared at the moment they stopped. At least 20 characters."
          value={l1.infoText}
          onChange={(v) => patch({ infoText: v })}
          min={20}
          rows={2}
        />
        <ExampleAnswer id="info-text-example" guide={infoTextGuide()} />
        {mentor && <MentorGuide guide={infoTextGuide()} />}
      </div>
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 2.3 */

export function Block23() {
  const l1 = useStore((s) => s.l1);
  const patch = useStore((s) => s.patchL1);
  const mentor = useStore((s) => s.mentorUnlocked);
  const chosen = l1.chosen;
  const cost = totalCost(chosen);
  const cov = coverage(l1);
  const shown = l1.order.length === chosen.length && chosen.every((id) => l1.order.includes(id)) ? l1.order : chosen;
  const inv = orderInversions({ ...l1, order: shown });

  const toggle = (id: MeasureId) =>
    patch((s) => {
      const has = s.chosen.includes(id);
      const next = has ? s.chosen.filter((x) => x !== id) : [...s.chosen, id];
      return { chosen: next, order: s.order.filter((x) => next.includes(x)), measureFlags: [], measureClue: {} };
    });
  const setAims = (id: MeasureId, aims: BarrierId[]) => patch((s) => ({ aims: { ...s.aims, [id]: aims }, measureFlags: s.measureFlags.filter((f) => f !== `${id}.aims`) }));
  const setScore = (k: "inf" | "fea" | "spd", id: MeasureId, v: Score) =>
    patch((s) => ({ [k]: { ...s[k], [id]: v }, measureFlags: k === "spd" ? s.measureFlags.filter((f) => f !== `${id}.speed`) : s.measureFlags }) as Partial<typeof s>);
  const move = (id: MeasureId, d: -1 | 1) => {
    const list = [...shown];
    const i = list.indexOf(id);
    const j = i + d;
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    patch({ order: list });
  };
  const check = () =>
    patch((s) => {
      const flags: string[] = [];
      for (const id of s.chosen) {
        if (s.aims[id] !== undefined && !aimsHold(id, s.aims[id])) flags.push(`${id}.aims`);
        if (s.spd[id] && !speedHolds(id, s.spd[id])) flags.push(`${id}.speed`);
      }
      return { checks: s.checks + 1, measureFlags: flags, measureClue: {} };
    });
  const aimsFlagged = (id: MeasureId) => l1.measureFlags.includes(`${id}.aims`);
  const speedFlagged = (id: MeasureId) => l1.measureFlags.includes(`${id}.speed`);
  const anyFlag = l1.measureFlags.length > 0;

  return (
    <AnswerBlock
      id="block-2-3"
      title="Block 2.3 · Choose three measures, score them, put them in order"
      kind="OBJECTIVE + JUDGED"
      minutes={BLOCK_MINUTES["2.3"]}
      findIt={`Route 1 → Task 1 → “The limits” in the case above (${euro(BUDGET)}, ${MONTHS} months) and the nine measures below. Answer by choosing three and filling their cards.`}
    >
      <MaterialRefs refs={["A7"]} />
      <div id={IDS.measurePick} className="space-y-2">
        <p className="text-body text-ink">
          <Gloss>
            Choose exactly three of the nine measures. Each says what it changes in the buyer and what has to be true for it to work; it does not say which barrier it answers. That is your job. You can change your choice at any time and your entries for a measure come back if you choose it again.
          </Gloss>
        </p>
        <OptionList<MeasureId>
          multi
          label="Measures"
          value={chosen}
          onChange={toggle}
          disabledIds={chosen.length >= CHOOSE ? MEASURES.map((m) => m.id) : []}
          onDisabledClick={() => scrollToAndFlash(IDS.measurePick, "warn")}
          options={MEASURES.map((m) => ({ id: m.id, label: `${m.name} · ${euro(m.cost)} · ${m.weeks} weeks to a first effect`, sub: `${m.what} It ${m.mechanism.charAt(0).toLowerCase()}${m.mechanism.slice(1)} Needs: ${m.needs}` }))}
        />
        <p role="status" className="text-caption text-ash">
          {chosen.length} of {CHOOSE} chosen.{chosen.length >= CHOOSE ? " To choose another, first remove one." : ""}
        </p>
        <p className="text-caption text-ash">
          Words in the measures, explained in plain language: <Gloss>exit clause, phased go-live, rollback, champion, stakeholder, reciprocity.</Gloss>
        </p>
        <div className="flex flex-wrap items-start gap-2">
          <RevealHint id="aims-help" label="Show the test questions" title="How to match a measure to a barrier · taught in Materi A7">
            <div className="space-y-2 text-caption text-ink">
              <p>For each measure ask two things: what does it change in the buyer, and which barrier's test question does that change answer? This list repeats what answers each barrier; it never says which measure it is.</p>
              <ul className="space-y-1.5">
                {BARRIER_IDS.map((b) => (
                  <li key={b}>
                    <span className="font-semibold">{BARRIERS[b].label}. </span>
                    <Gloss>{BARRIERS[b].answeredBy}</Gloss>
                  </li>
                ))}
              </ul>
              <MaterialRefs refs={["A7"]} lead="Taught in" />
            </div>
          </RevealHint>
        </div>
      </div>

      {chosen.length > 0 && (
        <div className="space-y-3">
          <BudgetBar items={chosen.map((id) => ({ id, short: MEASURE_BY_ID[id].name.split(" ")[0], cost: MEASURE_BY_ID[id].cost }))} budget={BUDGET} title={`Chosen measures against the ${euro(BUDGET)} budget`} />
          <p className="text-caption text-ash">
            {chosen.length} measure{chosen.length === 1 ? "" : "s"} cost {euro(cost)} of {euro(BUDGET)}.{cost > BUDGET ? ` That is ${euro(cost - BUDGET)} over: leave out the measure with the lowest score.` : ` ${euro(BUDGET - cost)} is left.`}
          </p>
        </div>
      )}

      {chosen.map((id) => {
        const m = MEASURE_BY_ID[id];
        const aims = l1.aims[id];
        const score = measureScore(l1, id);
        return (
          <div key={id} id={IDS.measure(id)} className={clsx("space-y-3 rounded-lg border border-line bg-paper p-3.5", (aimsFlagged(id) || speedFlagged(id)) && "is-flagged")}>
            <p className="font-semibold text-ink">
              {m.name} <span className="font-normal text-ash">· {euro(m.cost)} · {m.weeks} weeks</span>
            </p>
            <div>
              <p className="smallcaps">Which barriers does it act on? (choose the ones its mechanism answers, or none)</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {BARRIER_IDS.map((b) => {
                  const on = aims?.includes(b) ?? false;
                  return (
                    <button
                      key={b}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setAims(id, on ? (aims ?? []).filter((x) => x !== b) : [...(aims ?? []), b])}
                      className={clsx("btn btn-sm min-h-[40px] border", on ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash")}
                    >
                      {on ? "☑ " : "☐ "}
                      {BARRIERS[b].short}
                    </button>
                  );
                })}
                <button type="button" aria-pressed={aims !== undefined && aims.length === 0} onClick={() => setAims(id, [])} className={clsx("btn btn-sm min-h-[40px] border", aims !== undefined && aims.length === 0 ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash")}>
                  None of the six
                </button>
              </div>
              {aimsFlagged(id) && (
                <p className="mt-1 text-caption text-ink">
                  <span className="smallcaps mr-1 text-accent">Clue</span>Read the mechanism of this measure against the table “Matching a measure to a barrier” in Materi A7. Which barrier does the change in the buyer answer, and does anything it does touch a second one?
                </p>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <p className="smallcaps">Influence</p>
                <ScorePick label={`Influence of ${m.name}`} value={l1.inf[id] || 0} onChange={(v) => setScore("inf", id, v)} />
              </div>
              <div>
                <p className="smallcaps">Feasibility</p>
                <ScorePick label={`Feasibility of ${m.name}`} value={l1.fea[id] || 0} onChange={(v) => setScore("fea", id, v)} />
              </div>
              <div>
                <p className="smallcaps">Speed (from the weeks)</p>
                <ScorePick label={`Speed of ${m.name}`} value={l1.spd[id] || 0} onChange={(v) => setScore("spd", id, v)} flagged={speedFlagged(id)} />
                {speedFlagged(id) && <p className="mt-1 text-micro normal-case tracking-normal text-ink">Read {m.weeks} weeks against the speed rule in Materi A7.</p>}
              </div>
            </div>
            <p className="tnum text-caption text-ink" aria-live="polite">
              Score: {measureScored(l1, id) ? `${l1.inf[id]} × ${l1.fea[id]} × ${l1.spd[id]} = ` : "fill all three scores · "}
              <strong>{score || "—"}</strong>
            </p>
            {mentor && <MentorGuide guide={scoreGuide(id)} />}
          </div>
        );
      })}

      {chosen.length > 0 && (
        <div className="space-y-2">
          <p className="smallcaps">Which of the four patterns do your measures reach? (from what each measure really acts on)</p>
          <ul className="grid gap-1.5 sm:grid-cols-2">
            {cov.length === 0 && <li className="text-caption text-ash">Name your four patterns in Block 2.2 to see this.</li>}
            {cov.map((c) => (
              <li key={c.barrier} className={clsx("rounded-md border px-3 py-1.5 text-caption", c.covered ? "border-signal/40 bg-signalSoft text-ink" : "border-dashed border-ash bg-mist text-ink")}>
                <span aria-hidden>{c.covered ? "● " : "○ "}</span>
                <strong>{BARRIERS[c.barrier].label}</strong>: {c.covered ? "at least one chosen measure acts on it" : "nothing you chose acts on it"}
              </li>
            ))}
          </ul>
        </div>
      )}

      <CheckBar onCheck={check} checkLabel="Check my measures" checks={l1.checks} />
      {chosen.length > 0 && (l1.measureFlags.length > 0 || l1.checks > 0) && (
        <Reading>
          {anyFlag
            ? `${l1.measureFlags.filter((f) => f.endsWith(".aims")).length} measure${l1.measureFlags.filter((f) => f.endsWith(".aims")).length === 1 ? " has" : "s have"} barriers that do not match what they act on, and ${l1.measureFlags.filter((f) => f.endsWith(".speed")).length} speed score${l1.measureFlags.filter((f) => f.endsWith(".speed")).length === 1 ? " does not" : "s do not"} follow the weeks. They are outlined in the cards above.`
            : `The barriers you named and the speed scores match the measures. Influence and feasibility are your judgement.`}
          {cost > BUDGET ? ` The plan is ${euro(cost - BUDGET)} over the budget.` : ""}
        </Reading>
      )}
      <AnswerKey block={measureKey()} />

      {chosen.length === CHOOSE && (
        <div id={IDS.order} className="space-y-2 border-t border-line pt-3">
          <p className="font-semibold text-ink">Put your three measures in priority order</p>
          <p className="text-caption text-ash">The first one is the one you start with. Use the arrows, then keep the order. {SPEED_RULE}</p>
          <ol className="space-y-1.5">
            {shown.map((id, i) => (
              <li key={id} className="flex items-center gap-2 rounded-lg border border-line bg-paper px-3 py-1.5">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-caption font-bold text-paper">{i + 1}</span>
                <span className="min-w-0 flex-1 text-caption text-ink">
                  {MEASURE_BY_ID[id].name} <span className="tnum text-ash">· score {measureScore(l1, id) || "—"}</span>
                </span>
                <button type="button" onClick={() => move(id, -1)} aria-label={`Move ${MEASURE_BY_ID[id].name} up`} className="btn-ghost btn-sm min-w-[40px]">
                  ↑
                </button>
                <button type="button" onClick={() => move(id, 1)} aria-label={`Move ${MEASURE_BY_ID[id].name} down`} className="btn-ghost btn-sm min-w-[40px]">
                  ↓
                </button>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => patch({ order: [...shown] })} className={clsx("btn-sm", l1.order.length === CHOOSE ? "btn-ghost" : "btn-primary")}>
              {l1.order.length === CHOOSE && chosen.every((id) => l1.order.includes(id)) ? "✓ Order kept" : "Keep this order"}
            </button>
            {inv.length > 0 && (
              <span role="status" className="text-caption text-ink">
                <span className="smallcaps mr-1 text-accent">Check</span>
                {inv.length === 1 ? "One measure sits above one with a higher score." : `${inv.length} measures sit above ones with a higher score.`} If the order is deliberate, say why in the field below.
              </span>
            )}
          </div>
          <AnswerKey block={orderKey()} />
          <TextBox
            id={IDS.why}
            label="Why does your first priority go first?"
            help="Give the order, name the score or the barrier that decides it, and say what your plan costs against the budget and what it leaves out. At least 60 characters."
            value={l1.why}
            onChange={(v) => patch({ why: v })}
            min={60}
            rows={4}
          >
            <WritingHelp
              id="why-help"
              steps={["Say which measure goes first and why: the score, or where deals are being lost, or how fast it acts.", "Name the psychological principle it uses (for example loss aversion, trust or social proof).", "Say what the three cost together against the €100,000.", "Say what you left out, and whether all four of your patterns are reached."]}
              refs={[
                { label: "Budget", value: euro(BUDGET), target: IDS.measurePick },
                { label: "Time", value: `${MONTHS} months`, target: IDS.measurePick },
              ]}
            />
          </TextBox>
          <ExampleAnswer id="why-example" guide={whyGuide()} />
          {mentor && <MentorGuide guide={whyGuide()} />}
        </div>
      )}
    </AnswerBlock>
  );
}

