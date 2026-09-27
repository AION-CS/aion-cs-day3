"use client";

import { AnswerBlock } from "@/components/ui/AnswerBlock";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { CalcDiagnosis } from "@/components/ui/CalcDiagnosis";
import { Field } from "@/components/ui/Field";
import { FormulaBuilder } from "@/components/ui/FormulaBuilder";
import { ExampleAnswer } from "@/components/ui/ExampleAnswer";
import { CheckBar, Reading, TextBox } from "@/components/ui/Inputs";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { MentorGuide } from "@/components/ui/MentorGuide";
import { PlacementBoard } from "@/components/ui/PlacementBoard";
import { RevealHint } from "@/components/ui/RevealHint";
import { WritingHelp } from "@/components/ui/WritingHelp";
import { REASONS, REASON_TAGS, REASON_TESTS } from "@/data/debrief";
import type { ReasonId, ReasonTag } from "@/data/debrief";
import { FELT, FIGURES, FIGURE_IDS, LOSS_WEIGHT, RHEINWERK } from "@/data/feltCost";
import type { FigureId } from "@/data/feltCost";
import { HYP_COUNT, HYP_FRAME, HYP_LABEL, HYP_MECHS, HYP_MIN, hasBecause } from "@/data/hypotheses";
import type { HypMech } from "@/data/hypotheses";
import { FIGURE_BUILDERS, figurePartFlags, partKey } from "@/lib/calcBuilder";
import { citesFeltFigure, feltMatches, sortHolds } from "@/lib/checks";
import { scrollToAndFlash } from "@/lib/flash";
import { Gloss } from "@/lib/glossify";
import { IDS } from "@/lib/missing";
import { euro } from "@/lib/lang";
import { extraReasonGuide, figureGuide, hypGuide, reflectGuide, roleGuide } from "@/lib/mentorGuide";
import { sortKey } from "@/lib/answerKey";
import { MIN_LINE, MIN_SENTENCE } from "@/lib/progress";
import { BLOCK_MINUTES } from "@/lib/routes";
import { useStore } from "@/store/useStore";

/* ------------------------------------------------------------------ Block 1.1 */

export function Block11() {
  const l1 = useStore((s) => s.l1);
  const place = useStore((s) => s.placeReason);
  const undo = useStore((s) => s.undoSort);
  const redo = useStore((s) => s.redoSort);
  const patch = useStore((s) => s.patchL1);
  const mentor = useStore((s) => s.mentorUnlocked);
  return (
    <AnswerBlock
      id="block-1-1"
      title="Block 1.1 · Sort what the buyer said"
      kind="OBJECTIVE"
      minutes={BLOCK_MINUTES["1.1"]}
      findIt="Route 1 → Task 1 → “The debrief with Rheinwerk Logistik” in the case above. The eight statements are the buyer's own words. Answer on the sort board below."
    >
      <MaterialRefs refs={["A2"]} />
      <PlacementBoard<ReasonTag>
        items={REASONS.map((r, i) => ({ id: r.id, meta: `Statement ${i + 1}`, text: `“${r.quote}”` }))}
        bins={REASON_TAGS.map((t) => ({ id: t.id, label: t.label, hint: t.hint }))}
        value={l1.sort}
        onPlace={(id, tag) => place(id as ReasonId, tag)}
        onUndo={undo}
        onRedo={redo}
        undoCount={l1.sortHistory.length}
        redoCount={l1.sortFuture.length}
        domId={IDS.reason}
        clues={Object.fromEntries(REASONS.map((r) => [r.id, r.clue]))}
        reasons={Object.fromEntries(REASONS.map((r) => [r.id, r.why]))}
        keyPhrases={Object.fromEntries(REASONS.map((r) => [r.id, r.key]))}
        result={l1.sortResult}
        checks={l1.sortChecks}
        onCheck={() => patch((s) => ({ checks: s.checks + 1, sortChecks: s.sortChecks + 1, sortResult: sortHolds(s.sort) }))}
        onClue={() => patch({ sortClue: true })}
        clueShown={l1.sortClue}
        reasoningOpened={l1.sortReasoning}
        onOpenReasoning={() => patch({ sortReasoning: true })}
        noun="statement"
        intro="Drag a statement into a bin, or select it and then select a bin. Select a placed one to move it again."
        tests={
          <RevealHint id="sort-tests" label="Show the test questions" title="Test questions · taught in Materi A2">
            <div className="space-y-2 text-caption text-ink">
              <p>Ask these of every statement. They repeat the tests from Materi A2; they never say which statement goes where.</p>
              <ul className="space-y-1.5">
                {REASON_TESTS.map((t) => (
                  <li key={t.tag}>
                    <span className="font-semibold">{t.name}. </span>
                    <Gloss>{t.test}</Gloss>
                  </li>
                ))}
              </ul>
              <MaterialRefs refs={["A2"]} lead="Taught in" />
            </div>
          </RevealHint>
        }
      />
      <TextBox
        id={IDS.extraReason}
        label="One reason of your own that is not in the debrief"
        help="Think of one more reason a buyer could have for choosing the dearer, better-known provider, and say in a few words whether it is rational, emotional or both. At least 30 characters."
        value={l1.extraReason}
        onChange={(v) => patch({ extraReason: v })}
        min={MIN_LINE}
        rows={2}
      />
      <ExampleAnswer id="extra-reason-example" guide={extraReasonGuide()} />
      {mentor && <MentorGuide guide={extraReasonGuide()} />}
      <p className="text-caption text-ash">
        Words in the statements, explained in plain language: <Gloss>breach, ISO/IEC 27001, time and material, onboarding.</Gloss>
      </p>
      <AnswerKey block={sortKey()} />
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 1.2 */

const row = (id: string, label: string, value: string) => (
  <tr id={id} className="border-t border-line">
    <td className="px-3 py-2">{label}</td>
    <td className="tnum px-3 py-2 text-right font-semibold">{value}</td>
  </tr>
);

export function Block12() {
  const l1 = useStore((s) => s.l1);
  const patch = useStore((s) => s.patchL1);
  const mentor = useStore((s) => s.mentorUnlocked);
  const flaggedFig = l1.feltFlagged;

  const setFelt = (id: FigureId, v: string) =>
    patch((s) => ({ felt: { ...s.felt, [id]: v }, feltFlagged: s.feltFlagged.filter((f) => f !== id), roleFlagged: false }));
  const check = () =>
    patch((s) => {
      const parts = figurePartFlags(s.parts);
      const feltFlagged = FIGURE_IDS.filter((id) => s.felt[id].trim() !== "" && !feltMatches(s.felt[id], id === "F1" ? FELT.A : id === "F2" ? FELT.B : FELT.gap));
      const t = s.role.trim();
      return { checks: s.checks + 1, feltFlagged, feltClue: {}, partFlags: parts, roleFlagged: t !== "" && (t.length < MIN_SENTENCE || !citesFeltFigure(t)), roleClue: false };
    });

  return (
    <AnswerBlock
      id="block-1-2"
      title="Block 1.2 · What role do trust and risk play?"
      kind="OBJECTIVE + JUDGED"
      minutes={BLOCK_MINUTES["1.2"]}
      findIt="Route 1 → Task 1 → the two tables “The two offers” and “The buyer's estimates” directly below. The numbers are printed there. Answer in the fields under the tables."
    >
      <MaterialRefs refs={["A3"]} />
      <p className="text-body text-ink">
        <Gloss>
          The buyer did not compare prices only. The two tables give the price of each offer and what the buyer expected to lose. The numbers you need are in the tables below. Look for them first; the buttons “Show where the numbers are” and “Show the formula” are there if you get stuck. The method is taught in
        </Gloss>{" "}
        <button type="button" onClick={() => scrollToAndFlash("mat-A3", "ref")} className="font-semibold text-accent underline decoration-dotted underline-offset-2">
          Materi A3
        </button>
        , on other numbers.
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="overflow-x-auto rounded-lg border border-line">
          <table className="w-full border-collapse text-caption">
            <caption className="bg-mist px-3 py-2 text-left text-micro font-semibold uppercase text-ash">The two offers · Rheinwerk Logistik</caption>
            <tbody>
              {row("felt-offer-A", `Provider A · ${RHEINWERK.A.name} · price per year`, euro(RHEINWERK.A.price))}
              {row("felt-offer-B", `Provider B · ${RHEINWERK.B.name} · price per year`, euro(RHEINWERK.B.price))}
            </tbody>
          </table>
        </div>
        <div className="overflow-x-auto rounded-lg border border-line">
          <table className="w-full border-collapse text-caption">
            <caption className="bg-mist px-3 py-2 text-left text-micro font-semibold uppercase text-ash">The buyer's estimates (Case assumption)</caption>
            <tbody>
              {row("felt-est-chanceA", "Chance it goes wrong · Provider A", `${RHEINWERK.A.chance}%`)}
              {row("felt-est-chanceB", "Chance it goes wrong · Provider B", `${RHEINWERK.B.chance}%`)}
              {row("felt-est-loss", "Cost to the buyer if it goes wrong (rework, downtime, having to answer for it)", euro(RHEINWERK.loss))}
              {row("felt-est-weight", "Loss weight (a loss counts this many times an equal gain; a simplification of 2.25)", String(LOSS_WEIGHT))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-5">
        {FIGURE_IDS.map((id) => {
          const f = FIGURES[id];
          const b = FIGURE_BUILDERS[id];
          const flagged = flaggedFig.includes(id);
          const partsFlagged = b.parts.some((p) => l1.partFlags.includes(partKey(id, p.id)));
          return (
            <div key={id} className="space-y-2">
              <Field
                id={IDS.figure(id)}
                htmlFor={`fig-${id}-in`}
                label={f.label}
                help={`${f.question} Type the figure in euros, for example 95000.`}
                flagged={flagged}
                clue={f.clue}
                clueShown={!!l1.feltClue[id]}
                onShowClue={() => patch((s) => ({ feltClue: { ...s.feltClue, [id]: true } }))}
              >
                <input id={`fig-${id}-in`} className="field tnum max-w-xs" inputMode="decimal" autoComplete="off" value={l1.felt[id]} onChange={(e) => setFelt(id, e.target.value)} aria-invalid={flagged || undefined} />
              </Field>
              {flagged && (
                <CalcDiagnosis builder={b} figure={id} parts={l1.parts} partFlags={l1.partFlags} name={`your ${id}`} mismatch={(r) => `The parts in the formula calculator are right and give ${r}, but the figure you entered differs. Press “Use this result in ${id}” or check the entry.`} />
              )}
              <div className="flex flex-wrap items-start gap-2">
                <RevealHint id={`fig-${id}-where`} label="Show where the numbers are" title="Numbers you need · the printed rows">
                  <ul className="space-y-1 text-caption">
                    {f.sources === "figures" ? (
                      <li className="text-ink">Your own answers to F1 and F2 above. There is no printed row for a difference.</li>
                    ) : (
                      f.sources.map((s) => (
                        <li key={s.label}>
                          <button type="button" onClick={() => scrollToAndFlash(s.target, "ref")} className="flex min-h-[36px] w-full flex-wrap items-baseline gap-x-2 rounded px-2 py-1 text-left hover:bg-accentSoft">
                            <span className="text-ink">{s.label}:</span>
                            <span className="tnum font-semibold text-ink">{s.value}</span>
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                </RevealHint>
                <RevealHint id={`fig-${id}-formula`} label="Show the formula" title={`The formula · from Materi ${f.taughtIn}`} forceOpen={partsFlagged}>
                  <p className="text-caption text-ink">
                    <Gloss>{f.formula}</Gloss>
                  </p>
                  <FormulaBuilder
                    figure={id}
                    builder={b}
                    parts={l1.parts}
                    partFlags={l1.partFlags}
                    onPart={(k, v) => patch((s) => ({ parts: { ...s.parts, [k]: v }, partFlags: s.partFlags.filter((x) => x !== k) }))}
                    onUse={(v) => setFelt(id, String(Math.round(v)))}
                    unit="€"
                    label={id}
                    source={id === "F3" ? "your F1 and F2" : "the two tables above"}
                  />
                </RevealHint>
              </div>
              {mentor && <MentorGuide guide={figureGuide(id)} />}
            </div>
          );
        })}
      </div>

      <TextBox
        id={IDS.role}
        label="What did trust and risk do in this decision?"
        help="One or two sentences. Use at least one figure from your calculation, and say which of the numbers trust changed and which one loss aversion multiplied."
        value={l1.role}
        onChange={(v) => patch({ role: v, roleFlagged: false })}
        min={MIN_SENTENCE}
        rows={4}
        flagged={l1.roleFlagged}
        clue="Which of your figures shows the effect of trust (the chance the buyer expects) and which shows the effect of loss aversion (the weight)? A sentence that quotes one of them and says which is which is enough."
        clueShown={l1.roleClue}
        onShowClue={() => patch({ roleClue: true })}
      >
        <WritingHelp
          id="role-help"
          steps={["Say who is cheaper on the price list and by how much.", "Say which provider the buyer expects to go wrong more often, and what that does to the risk term.", "Finish with the felt gap from F3 and what it means for who wins."]}
          refs={[
            { label: "Price gap on the price list", value: euro(RHEINWERK.B.price - RHEINWERK.A.price), target: "felt-offer-B" },
            { label: "Loss weight", value: String(LOSS_WEIGHT), target: "felt-est-weight" },
          ]}
        />
      </TextBox>
      <ExampleAnswer id="role-example" guide={roleGuide()} />
      {mentor && <MentorGuide guide={roleGuide()} />}

      <CheckBar onCheck={check} checkLabel="Check my figures and sentence" checks={l1.checks} />
      {l1.checks > 0 && (
        <Reading>
          {l1.feltFlagged.length === 0 && !l1.roleFlagged && l1.partFlags.length === 0
            ? "Nothing is outlined by the last check."
            : `${l1.feltFlagged.length > 0 ? `${l1.feltFlagged.length} figure${l1.feltFlagged.length === 1 ? " is" : "s are"} outlined above. Each says what to check.` : ""}${l1.roleFlagged ? " The sentence needs at least one of your calculated figures." : ""}${l1.partFlags.length > 0 ? " A part of the formula calculator is outlined." : ""}`}
        </Reading>
      )}
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 1.3 */

export function Block13() {
  const l1 = useStore((s) => s.l1);
  const patch = useStore((s) => s.patchL1);
  const mentor = useStore((s) => s.mentorUnlocked);
  const check = () =>
    patch((s) => ({
      checks: s.checks + 1,
      hypChecked: true,
      hypClue: false,
      hypFlagged: s.hyp
        .map((h, i) => ({ h, i }))
        .filter(({ h, i }) => !h.mech || s.hyp.findIndex((g) => g.mech === h.mech) !== i || h.text.trim().length < HYP_MIN || !hasBecause(h.text))
        .map(({ i }) => i),
    }));
  const setRow = (i: number, p: Partial<{ mech: HypMech | null; text: string }>) =>
    patch((s) => ({ hyp: s.hyp.map((h, j) => (j === i ? { ...h, ...p } : h)), hypFlagged: s.hypFlagged.filter((x) => x !== i) }));
  return (
    <AnswerBlock
      id="block-1-3"
      title="Block 1.3 · Three hypotheses about decision behaviour"
      kind="JUDGED"
      minutes={BLOCK_MINUTES["1.3"]}
      findIt="Route 1 → Task 1 → your own answers to Blocks 1.1 and 1.2 above, and the four principles in Materi A3. Answer in the three fields below."
    >
      <MaterialRefs refs={["A1", "A2", "A3"]} />
      <p className="text-body text-ink">
        <Gloss>A hypothesis says what a buyer would do and why, in a form you could show wrong by looking at deals. Write three about how buyers decide between an unknown and a known provider, each on a different mechanism, so that they can be tested apart.</Gloss>
      </p>
      <p className="text-caption text-ash">The frame: {HYP_FRAME}</p>
      <div className="space-y-4">
        {l1.hyp.map((h, i) => {
          const flagged = l1.hypFlagged.includes(i);
          return (
            <div key={i} className="space-y-1.5">
              <TextBox
                id={IDS.hyp(i)}
                label={`Hypothesis ${i + 1}`}
                help={`Choose the mechanism, then write the hypothesis in one or two sentences with a reason (“because …”), at least ${HYP_MIN} characters.`}
                value={h.text}
                onChange={(v) => setRow(i, { text: v })}
                min={HYP_MIN}
                flagged={flagged}
                clue={`Use the frame: ${HYP_FRAME} Choose a mechanism no other hypothesis uses, and finish with “because” and the mechanism.`}
                clueShown={l1.hypClue}
                onShowClue={() => patch({ hypClue: true })}
              >
                <div>
                  <label htmlFor={`hyp-${i}-mech`} className="smallcaps block">
                    Mechanism
                  </label>
                  <select id={`hyp-${i}-mech`} className="field mt-1 max-w-md" value={h.mech ?? ""} onChange={(e) => setRow(i, { mech: (e.target.value || null) as HypMech | null })}>
                    <option value="">Choose a mechanism…</option>
                    {HYP_MECHS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label} (Materi {m.from})
                      </option>
                    ))}
                  </select>
                  {h.mech && <p className="mt-1 text-micro normal-case tracking-normal text-ash">Chosen: {HYP_LABEL[h.mech]}</p>}
                </div>
              </TextBox>
              <ExampleAnswer id={`hyp-${i}-example`} guide={hypGuide(i)} />
              {mentor && <MentorGuide guide={hypGuide(i)} />}
            </div>
          );
        })}
      </div>
      <CheckBar onCheck={check} checkLabel="Check my hypotheses" checks={l1.checks} />
      {l1.hypChecked && (
        <Reading>
          {l1.hypFlagged.length === 0
            ? `All ${HYP_COUNT} hypotheses have a distinct mechanism and give a reason. Whether they are good is for you and your facilitator to judge.`
            : `${l1.hypFlagged.length} hypothesis${l1.hypFlagged.length === 1 ? " is" : "es are"} outlined: a mechanism is missing or repeated, the text is short, or it gives no reason.`}
        </Reading>
      )}
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 1.4 */

export function Block14() {
  const l1 = useStore((s) => s.l1);
  const patch = useStore((s) => s.patchL1);
  const mentor = useStore((s) => s.mentorUnlocked);
  const fields: { k: "assume" | "emotional" | "manager"; label: string; help: string }[] = [
    { k: "assume", label: "What assumption did I make about the customer?", help: "One or two sentences about something you actually did in Blocks 1.1 to 1.3, for example how you first read the buyer's decision." },
    { k: "emotional", label: "Where did I underestimate emotional factors?", help: "Name one statement or one number where the feeling mattered more than you first thought." },
    { k: "manager", label: "How would an experienced sales manager react?", help: "What would they ask first, and what would they do about it? Be concrete." },
  ];
  return (
    <AnswerBlock
      id="block-1-4"
      title="Block 1.4 · Coaching reflection: from Level 1 to Level 2"
      kind="JUDGED"
      minutes={BLOCK_MINUTES["1.4"]}
      findIt="Route 1 → Task 1 → your own answers in Blocks 1.1 to 1.3 above, and the coaching focus in Materi A2. Answer in the three fields below."
    >
      <MaterialRefs refs={["A2"]} />
      <p className="text-body text-ink">
        <Gloss>Before you analyse the stalled deals, look at how you read this one. Why do customers not decide “rationally”? And what does that mean for how you read the next twelve notes?</Gloss>
      </p>
      {fields.map((f) => (
        <div key={f.k} className="space-y-1.5">
          <TextBox id={IDS.reflect(f.k)} label={f.label} help={f.help} value={l1.reflect[f.k]} onChange={(v) => patch((s) => ({ reflect: { ...s.reflect, [f.k]: v } }))} min={MIN_LINE} rows={3} />
          <ExampleAnswer id={`reflect-${f.k}-example`} guide={reflectGuide(f.k)} />
          {mentor && <MentorGuide guide={reflectGuide(f.k)} />}
        </div>
      ))}
    </AnswerBlock>
  );
}
