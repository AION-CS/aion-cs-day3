"use client";

import clsx from "clsx";
import { AnswerBlock } from "@/components/ui/AnswerBlock";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { BudgetBar } from "@/components/ui/BudgetBar";
import { CheckBar, OptionList, Reading, ScorePick, TextBox } from "@/components/ui/Inputs";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { MentorGuide } from "@/components/ui/MentorGuide";
import { RevealHint } from "@/components/ui/RevealHint";
import { WritingHelp } from "@/components/ui/WritingHelp";
import {
  BOARD_CHALLENGE,
  CRITERIA,
  DECISIONS,
  DEPENDS_LABEL,
  ENABLERS,
  FACTORS,
  FACTOR_IDS,
  KPIS,
  LEVERS,
  LEVER_BY_ID,
  LEVER_CHOOSE,
  LEVEL_LABEL,
  MODEL_PHASES,
  OWNERS,
  OWNER_IDS,
  R2_BASELINE_NOTE,
  R2_BUDGET,
  R2_MONTHS,
  RISKS,
  RISK_BY_ID,
  RISK_CHOOSE,
  archItems,
} from "@/data/route2";
import type { Criterion, DecisionId, FactorId, KpiId, LeverId, OwnerId, PhaseId, RiskId } from "@/data/route2";
import { archCost, archLeft, archOver, factorsHold, funded, hasNumber, leverTotal, modelHolds, psychologyCount, ratingFlags, seqRules, signalFlags, systemicCount, tripFlags } from "@/lib/checks";
import { scrollToAndFlash } from "@/lib/flash";
import { Gloss } from "@/lib/glossify";
import { euro } from "@/lib/lang";
import { IDS } from "@/lib/missing";
import { assumptionGuide, challengeGuide, greatestGuide, factorTextGuide, moveGuide, postponedGuide, ratingGuide, riskResponseGuide, triggerGuide } from "@/lib/mentorGuide";
import { decisionKey, factorKey, leverKey, modelKey, ownerKey, riskKey, tripKey } from "@/lib/answerKey";
import { MIN_LINE } from "@/lib/progress";
import { BLOCK_MINUTES } from "@/lib/routes";
import { useStore } from "@/store/useStore";
import type { Score } from "@/store/useStore";

const CRIT_IDS: Criterion[] = ["reach", "depth", "durability", "scale"];
const MONTHS_LIST = Array.from({ length: R2_MONTHS }, (_, i) => i + 1);

/* ------------------------------------------------------------------ Block 3.1 */

export function Block31() {
  const r2 = useStore((s) => s.r2);
  const patch = useStore((s) => s.patchR2);
  const mentor = useStore((s) => s.mentorUnlocked);
  const toggle = (f: FactorId) => patch((s) => ({ factors: s.factors.includes(f) ? s.factors.filter((x) => x !== f) : [...s.factors, f], factorFlagged: false }));
  const check = () => patch((s) => ({ checks: s.checks + 1, factorFlagged: !(factorsHold(s).trust && factorsHold(s).risk), factorClue: false }));
  const h = factorsHold(r2);
  return (
    <AnswerBlock
      id="block-3-1"
      title="Block 3.1 · Define the three central influencing factors"
      kind="OBJECTIVE + JUDGED"
      minutes={BLOCK_MINUTES["3.1"]}
      findIt="Route 2 → Task 2 → “Where Route 1 left off” in the case above, and the six factors below. Answer by choosing three and defining each."
    >
      <MaterialRefs refs={["B1"]} />
      <div id={IDS.factorPick} className={clsx("space-y-2 rounded-lg p-1", r2.factorFlagged && "is-flagged")}>
        <p className="text-body text-ink">
          <Gloss>Choose the three factors that decide whether a SecureIT deal is signed. A factor is central when it appears in your evidence and a lever can change it.</Gloss>
        </p>
        <OptionList<FactorId>
          multi
          cols={2}
          label="Influencing factors"
          value={r2.factors}
          onChange={toggle}
          disabledIds={r2.factors.length >= 3 ? FACTOR_IDS : []}
          onDisabledClick={() => scrollToAndFlash(IDS.factorPick, "warn")}
          options={FACTOR_IDS.map((f) => ({ id: f, label: FACTORS[f].name, sub: FACTORS[f].means }))}
        />
        <p role="status" className="text-caption text-ash">
          {r2.factors.length} of 3 chosen.{r2.factors.length >= 3 ? " To choose another, first remove one." : ""}
        </p>
        {r2.factorFlagged && (
          <p className="text-caption text-ink">
            <span className="smallcaps mr-1 text-accent">Check</span>
            {[h.trust, h.risk].filter(Boolean).length} of the 2 factors the plan names as central are among your three.{" "}
            {r2.factorClue ? (
              "Which two barriers had the most notes in your Route 1 tally, and which factors do they belong to?"
            ) : (
              <button type="button" onClick={() => patch({ factorClue: true })} className="btn-ghost btn-sm border-gold">
                Show clue
              </button>
            )}
          </p>
        )}
      </div>
      {r2.factors.map((f) => (
        <div key={f} className="space-y-1.5">
          <TextBox
            id={IDS.factor(f)}
            label={`${FACTORS[f].name} in a SecureIT deal`}
            help="Two sentences: what the buyer does that shows this factor in a SecureIT deal, and what SecureIT could see and count before the deal is lost."
            value={r2.factorText[f] ?? ""}
            onChange={(v) => patch((s) => ({ factorText: { ...s.factorText, [f]: v } }))}
            min={MIN_LINE}
            rows={3}
          />
          {mentor && <MentorGuide guide={factorTextGuide(f)} />}
        </div>
      ))}
      <CheckBar onCheck={check} checkLabel="Check my factors" checks={r2.checks} />
      <AnswerKey block={factorKey()} />
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 3.2 */

export function Block32() {
  const r2 = useStore((s) => s.r2);
  const patch = useStore((s) => s.patchR2);
  const mentor = useStore((s) => s.mentorUnlocked);
  const setPhase = (ph: PhaseId, p: Partial<(typeof r2.model)[PhaseId]>) => patch((s) => ({ model: { ...s.model, [ph]: { ...s.model[ph], ...p } }, modelResult: null }));
  const check = () => patch((s) => {
    const m = modelHolds(s);
    return { checks: s.checks + 1, modelResult: { holds: m.holds, total: m.total }, modelClue: false };
  });
  return (
    <AnswerBlock
      id="block-3-2"
      title="Block 3.2 · Build the control model: phase by phase"
      kind="OBJECTIVE + JUDGED"
      minutes={BLOCK_MINUTES["3.2"]}
      findIt="Route 2 → Task 2 → the three phases below. For each, answer the buyer's question, the dominant factor, the signal and what your system does."
    >
      <MaterialRefs refs={["B1", "B3"]} />
      <p className="text-body text-ink">
        <Gloss>One row per phase of the buying decision. In each, choose the question the buyer is settling, the factor that dominates, and the signal you would see if the question is unanswered, then say what your process does about it, whoever is selling.</Gloss>
      </p>
      {MODEL_PHASES.map((ph) => {
        const m = r2.model[ph.id];
        return (
          <div key={ph.id} id={IDS.model(ph.id)} className="space-y-3 rounded-lg border border-line bg-paper p-3.5">
            <p className="font-semibold text-ink">
              {ph.name} <span className="font-normal text-ash">· {ph.hint}</span>
            </p>
            <div>
              <p className="smallcaps">The buyer's question</p>
              <OptionList label={`${ph.name}: the buyer's question`} value={m.question} onChange={(v) => setPhase(ph.id, { question: v })} options={ph.questions} />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label htmlFor={`model-${ph.id}-factor`} className="smallcaps block">
                  The dominant factor
                </label>
                <select id={`model-${ph.id}-factor`} className="field mt-1" value={m.factor ?? ""} onChange={(e) => setPhase(ph.id, { factor: (e.target.value || null) as FactorId | null })}>
                  <option value="">Choose a factor…</option>
                  {FACTOR_IDS.map((f) => (
                    <option key={f} value={f}>
                      {FACTORS[f].name}
                    </option>
                  ))}
                </select>
                {m.factor && !r2.factors.includes(m.factor) && <p className="mt-1 text-micro normal-case tracking-normal text-ash">Not one of the three you defined in Block 3.1.</p>}
              </div>
              <div>
                <p className="smallcaps">The signal it is unanswered</p>
                <OptionList label={`${ph.name}: the signal`} value={m.signal} onChange={(v) => setPhase(ph.id, { signal: v })} options={ph.signals} />
              </div>
            </div>
            <TextBox
              id={`${IDS.model(ph.id)}-move`}
              label={`What your system does in ${ph.name}`}
              help="One or two sentences: a step of the process or a rule that answers the buyer's question, whoever is selling. Not something one seller has to remember."
              value={m.move}
              onChange={(v) => setPhase(ph.id, { move: v })}
              min={MIN_LINE}
              rows={2}
            />
            {mentor && <MentorGuide guide={moveGuide(ph.id)} />}
          </div>
        );
      })}
      <CheckBar onCheck={check} checkLabel="Check my model" checks={r2.checks} clueShown={r2.modelClue} onClue={() => patch({ modelClue: true })} />
      {r2.modelResult && (
        <Reading>
          {r2.modelResult.holds} of {r2.modelResult.total} picks hold (the question, the factor and the signal of each phase). A check never says which.
          {r2.modelClue ? " Clue: match each choice to the description at the top of its row, then ask whether the buyer would ask it, or you would see it, in that phase or in another one." : ""}
        </Reading>
      )}
      <AnswerKey block={modelKey()} />
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 3.3 */

export function Block33() {
  const r2 = useStore((s) => s.r2);
  const patch = useStore((s) => s.patchR2);
  const mentor = useStore((s) => s.mentorUnlocked);
  const toggle = (id: LeverId) =>
    patch((s) => {
      const next = s.levers.includes(id) ? s.levers.filter((x) => x !== id) : [...s.levers, id];
      return { levers: next, greatest: s.greatest && next.includes(s.greatest) ? s.greatest : null, rateFlags: [], leverResult: null };
    });
  const setRate = (id: LeverId, c: Criterion, v: Score) => patch((s) => ({ rate: { ...s.rate, [`${id}.${c}`]: v }, rateFlags: s.rateFlags.filter((f) => f !== `${id}.${c}`), leverResult: null }));
  const check = () => patch((s) => ({ checks: s.checks + 1, rateFlags: ratingFlags(s), rateClue: {}, leverResult: { systemic: systemicCount(s.levers) } }));
  const scalable = r2.levers.filter((id) => r2.rate[`${id}.scale`] === 3);
  const sustainable = r2.levers.filter((id) => r2.rate[`${id}.durability`] === 3 && (r2.rate[`${id}.depth`] || 0) >= 2);
  return (
    <AnswerBlock
      id="block-3-3"
      title="Block 3.3 · Three strategic levers, rated on four tests"
      kind="OBJECTIVE + JUDGED"
      minutes={BLOCK_MINUTES["3.3"]}
      findIt="Route 2 → Task 2 → the eight levers below, each with what it depends on and how its cost behaves. Answer by choosing three, rating each on the four tests and naming the greatest lever."
    >
      <MaterialRefs refs={["B1", "B2"]} />
      <div id={IDS.leverPick} className="space-y-2">
        <p className="text-body text-ink">
          <Gloss>Choose exactly three levers to change how buyers decide. Read what each depends on and how its cost repeats: those printed facts limit the ratings you can honestly give.</Gloss>
        </p>
        <OptionList<LeverId>
          multi
          label="Levers"
          value={r2.levers}
          onChange={toggle}
          disabledIds={r2.levers.length >= LEVER_CHOOSE ? LEVERS.map((l) => l.id) : []}
          onDisabledClick={() => scrollToAndFlash(IDS.leverPick, "warn")}
          options={LEVERS.map((l) => ({
            id: l.id,
            label: `${l.name} · ${euro(l.cost)} · ${l.weeks} weeks`,
            sub: `${l.what} Level: ${LEVEL_LABEL[l.level]}. Depends on: ${DEPENDS_LABEL[l.depends]}. Cost: ${l.costShape}. Applies to: ${l.reachAll ? "every deal" : "some deals only"}. Acts on: ${l.acts}`,
          }))}
        />
        <p role="status" className="text-caption text-ash">
          {r2.levers.length} of {LEVER_CHOOSE} chosen.{r2.levers.length >= LEVER_CHOOSE ? " To choose another, first remove one." : ""}
        </p>
        <p className="text-caption text-ash">
          Cost shapes: <strong>one-off</strong> is paid once, <strong>per seller</strong> repeats with every seller, <strong>per deal</strong> repeats with every deal. Words in the levers, explained in plain language: <Gloss>CRM, exit clause, rollback, behaviour signals.</Gloss>
        </p>
      </div>

      {r2.levers.map((id) => {
        const l = LEVER_BY_ID[id];
        return (
          <div key={id} id={IDS.lever(id)} className="space-y-2 rounded-lg border border-line bg-paper p-3.5">
            <p className="font-semibold text-ink">
              {l.name} <span className="font-normal text-ash">· {LEVEL_LABEL[l.level]} · {DEPENDS_LABEL[l.depends]} · {l.costShape}</span>
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {CRITERIA.map((c) => {
                const flagged = r2.rateFlags.includes(`${id}.${c.id}`);
                return (
                  <div key={c.id}>
                    <p className="smallcaps">{c.name}</p>
                    <p className="mb-1 text-micro normal-case leading-snug tracking-normal text-ash">{c.test}</p>
                    <ScorePick label={`${c.name} of ${l.name}`} value={r2.rate[`${id}.${c.id}`] || 0} onChange={(v) => setRate(id, c.id, v)} flagged={flagged} />
                    {flagged && (
                      <p className="mt-1 text-micro normal-case tracking-normal text-ink">
                        <span className="font-semibold text-accent">Check. </span>
                        Read the printed facts of this lever (
                        {c.id === "reach" ? "who it applies to" : c.id === "durability" ? "what it depends on" : "how its cost behaves"}) against the limits under “Four levers, four tests” in Materi B2.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="tnum text-caption text-ink">Total: {CRIT_IDS.every((c) => r2.rate[`${id}.${c}`]) ? `${leverTotal(r2, id)} of 12` : "rate all four tests"}</p>
            {mentor && <MentorGuide guide={ratingGuide(id)} />}
          </div>
        );
      })}

      {r2.levers.length > 0 && (
        <div className="space-y-1 rounded-lg border border-line bg-mist/50 p-3 text-caption text-ink" aria-live="polite">
          <p className="smallcaps">What your own ratings say</p>
          <p>
            Systemic levers (process or structure) among your three: <strong>{systemicCount(r2.levers)}</strong>.{" "}
            {systemicCount(r2.levers) === 0 ? "Every one depends on individual people or on an argument: when the seller changes, they go with them." : ""}
          </p>
          <p>Lasting (durability 3 and depth at least 2): {sustainable.length ? sustainable.map((i) => LEVER_BY_ID[i].name).join(", ") : "none yet, or not rated."}</p>
          <p>Scalable (scale 3): {scalable.length ? scalable.map((i) => LEVER_BY_ID[i].name).join(", ") : "none yet, or not rated."}</p>
        </div>
      )}

      <CheckBar onCheck={check} checkLabel="Check my levers" checks={r2.checks} />
      {r2.leverResult && (
        <Reading>
          {r2.leverResult.systemic} of {r2.levers.length} of your levers are process or structure levers.{" "}
          {r2.levers.length === LEVER_CHOOSE && r2.leverResult.systemic < 2 ? "The rule in Materi B1 asks for at least two: a system that depends on people leaves with them. Ask which of your levers would still work if the seller left." : ""}
          {r2.rateFlags.length > 0 ? ` ${r2.rateFlags.length} rating${r2.rateFlags.length === 1 ? "" : "s"} exceed what the printed facts allow and are outlined above.` : ""}
        </Reading>
      )}
      <AnswerKey block={leverKey()} />

      {r2.levers.length > 0 && (
        <div className="space-y-2 border-t border-line pt-3">
          <div id={IDS.greatest} className="space-y-1.5">
            <p className="font-semibold text-ink">Where is the greatest psychological lever?</p>
            <p className="text-caption text-ash">Choose one of your three levers, then say why in the field below.</p>
            <OptionList<LeverId> label="Greatest lever" value={r2.greatest} onChange={(v) => patch({ greatest: v })} options={r2.levers.map((id) => ({ id, label: LEVER_BY_ID[id].name, sub: `Acts on: ${LEVER_BY_ID[id].acts}` }))} />
          </div>
          <TextBox
            id={IDS.greatestWhy}
            label="Why is it the greatest lever?"
            help="Name the factor or barrier from your evidence that this lever acts on, and say why it lasts or reaches every deal. At least 40 characters."
            value={r2.greatestWhy}
            onChange={(v) => patch({ greatestWhy: v })}
            min={40}
            rows={3}
          />
          {mentor && <MentorGuide guide={greatestGuide()} />}
        </div>
      )}
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 3.4 */

const LIK = ["", "low", "mid", "high"];

export function Block34() {
  const r2 = useStore((s) => s.r2);
  const patch = useStore((s) => s.patchR2);
  const mentor = useStore((s) => s.mentorUnlocked);
  const toggle = (id: RiskId) =>
    patch((s) => ({ risks: s.risks.includes(id) ? s.risks.filter((x) => x !== id) : [...s.risks, id], riskFlags: [], riskResult: null }));
  const check = () => patch((s) => ({ checks: s.checks + 1, riskFlags: signalFlags(s), riskClue: {}, riskResult: { psychology: psychologyCount(s.risks) } }));
  const top = [...r2.risks].filter((id) => r2.riskLik[id] && r2.riskImp[id]).sort((a, b) => r2.riskLik[b] * r2.riskImp[b] - r2.riskLik[a] * r2.riskImp[a])[0];
  return (
    <AnswerBlock
      id="block-3-4"
      title="Block 3.4 · Risk analysis: what if we misjudge the customer?"
      kind="OBJECTIVE + JUDGED"
      minutes={BLOCK_MINUTES["3.4"]}
      findIt="Route 2 → Task 2 → the eight risks below. Answer by choosing three that are misjudgments of customer psychology, rating them, choosing the early signal and writing the response."
    >
      <MaterialRefs refs={["B4"]} />
      <div id={IDS.riskPick} className="space-y-2">
        <p className="text-body text-ink">
          <Gloss>Choose exactly three risks. The block asks for misjudgments of customer psychology: “we assume the buyer …”. Not every risk in the list is one.</Gloss>
        </p>
        <OptionList<RiskId>
          multi
          label="Risks"
          value={r2.risks}
          onChange={toggle}
          disabledIds={r2.risks.length >= RISK_CHOOSE ? RISKS.map((r) => r.id) : []}
          onDisabledClick={() => scrollToAndFlash(IDS.riskPick, "warn")}
          options={RISKS.map((r) => ({
            id: r.id,
            label: r.name,
            sub: r.psychology ? `We assume: ${r.weAssume} It may be that: ${r.mayBeTrue}` : r.id === "competitor" ? "A competitor lowers its prices." : "The new signals are recorded but nobody acts on them.",
          }))}
        />
        <p role="status" className="text-caption text-ash">
          {r2.risks.length} of {RISK_CHOOSE} chosen.{r2.risks.length >= RISK_CHOOSE ? " To choose another, first remove one." : ""}
        </p>
      </div>
      {r2.risks.map((id) => {
        const r = RISK_BY_ID[id];
        const flagged = r2.riskFlags.includes(`${id}.signal`);
        return (
          <div key={id} id={IDS.risk(id)} className="space-y-3 rounded-lg border border-line bg-paper p-3.5">
            <p className="font-semibold text-ink">{r.name}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="smallcaps">Likelihood</p>
                <ScorePick label={`Likelihood of ${r.name}`} value={r2.riskLik[id] || 0} onChange={(v) => patch((s) => ({ riskLik: { ...s.riskLik, [id]: v as Score } }))} />
              </div>
              <div>
                <p className="smallcaps">Impact if it happens</p>
                <ScorePick label={`Impact of ${r.name}`} value={r2.riskImp[id] || 0} onChange={(v) => patch((s) => ({ riskImp: { ...s.riskImp, [id]: v as Score } }))} />
              </div>
            </div>
            <div className={clsx("rounded-lg", flagged && "is-flagged p-1")}>
              <p className="smallcaps">The early-warning signal</p>
              <OptionList label={`Signal for ${r.name}`} value={r2.riskSignal[id] ?? null} onChange={(v) => patch((s) => ({ riskSignal: { ...s.riskSignal, [id]: v }, riskFlags: s.riskFlags.filter((f) => f !== `${id}.signal`) }))} options={r.signals} />
              {flagged && (
                <p className="mt-1 text-caption text-ink">
                  <span className="smallcaps mr-1 text-accent">Clue</span>
                  Which of the three would you see in a deal before it is lost, and is it about how the buyer behaves rather than how much you did? Read the rule on signals in Materi B4.
                </p>
              )}
            </div>
            <TextBox
              id={`${IDS.risk(id)}-response`}
              label="The response"
              help="A trigger: a number, a date and an action. If [signal] happens [how often] within [when], we [do what]. At least 30 characters, with a number."
              value={r2.riskResponse[id] ?? ""}
              onChange={(v) => patch((s) => ({ riskResponse: { ...s.riskResponse, [id]: v } }))}
              min={MIN_LINE}
              rows={2}
              flagged={(r2.riskResponse[id] ?? "").trim().length >= MIN_LINE && !hasNumber(r2.riskResponse[id] ?? "") && r2.riskResult !== null}
              clue="Add the number that says when you act: how many deals, how many weeks, what percentage."
              clueShown
            />
            {mentor && <MentorGuide guide={riskResponseGuide(id)} />}
          </div>
        );
      })}

      {r2.risks.length > 0 && (
        <div className="space-y-2">
          <p className="smallcaps">Where your risks sit (likelihood across, impact up)</p>
          <div className="grid max-w-sm grid-cols-3 gap-1" role="group" aria-label="Likelihood by impact grid of your risks">
            {[3, 2, 1].flatMap((imp) =>
              [1, 2, 3].map((lik) => {
                const here = r2.risks.filter((id) => r2.riskLik[id] === lik && r2.riskImp[id] === imp);
                const hot = lik * imp >= 6;
                return (
                  <div key={`${lik}-${imp}`} className={clsx("flex min-h-[48px] flex-wrap items-center justify-center gap-1 rounded-md border p-1", hot ? "border-rust/40 bg-rustSoft" : "border-line bg-mist/60")}>
                    {here.map((id) => (
                      <span key={id} className="rounded-full border-2 border-ink bg-paper px-2 text-caption font-bold" title={RISK_BY_ID[id].name}>
                        {RISK_BY_ID[id].name.split(" ").slice(0, 2).join(" ")}
                      </span>
                    ))}
                  </div>
                );
              }),
            )}
          </div>
          <p className="text-caption text-ash" aria-live="polite">
            {top ? `Your highest-rated risk is “${RISK_BY_ID[top].name}” (likelihood ${LIK[r2.riskLik[top]]}, impact ${LIK[r2.riskImp[top]]}). ${(r2.riskResponse[top] ?? "").trim().length < MIN_LINE || !hasNumber(r2.riskResponse[top] ?? "") ? "It has no trigger with a number yet." : "It has a trigger with a number."}` : "Rate a risk to see where it sits."}
          </p>
        </div>
      )}

      <CheckBar onCheck={check} checkLabel="Check my risks" checks={r2.checks} />
      {r2.riskResult && (
        <Reading>
          {r2.riskResult.psychology} of {r2.risks.length} chosen risks are misjudgments of customer psychology.{" "}
          {r2.risks.length > 0 && r2.riskResult.psychology < r2.risks.length ? "The others are real risks, but of another kind: ask of each “what did we assume the buyer feels?”." : ""}
          {r2.riskFlags.length > 0 ? ` ${r2.riskFlags.length} signal${r2.riskFlags.length === 1 ? " is" : "s are"} outlined above.` : ""}
        </Reading>
      )}
      <AnswerKey block={riskKey()} />
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 3.5 */

export function Block35() {
  const r2 = useStore((s) => s.r2);
  const patch = useStore((s) => s.patchR2);
  const mentor = useStore((s) => s.mentorUnlocked);
  const items = archItems(r2.levers);
  const f = funded(r2);
  const over = archOver(r2);
  const rules = seqRules(r2);
  const setItem = (id: LeverId, p: Partial<{ alloc: boolean; start: number | null; owner: OwnerId | null; trigger: string }>) =>
    patch((s) => ({
      alloc: p.alloc !== undefined ? { ...s.alloc, [id]: p.alloc } : s.alloc,
      start: p.start !== undefined ? { ...s.start, [id]: p.start } : p.alloc === false ? { ...s.start, [id]: null } : s.start,
      owner: p.owner !== undefined ? { ...s.owner, [id]: p.owner } : s.owner,
      trigger: p.trigger !== undefined ? { ...s.trigger, [id]: p.trigger } : s.trigger,
      seqResult: null,
    }));
  const check = () => patch((s) => {
    const r = seqRules(s);
    return { checks: s.checks + 1, seqResult: { holds: Number(r.baseline) + Number(r.budget), total: 2 }, seqClue: false };
  });
  const sigStart = r2.start.signals;
  const others = f.filter((id) => id !== "signals");
  const firstOther = others.length ? Math.min(...others.map((id) => r2.start[id] ?? 99)) : null;
  const notAllFunded = !items.every((id) => r2.alloc[id]);
  return (
    <AnswerBlock
      id="block-3-5"
      title="Block 3.5 · The measures architecture: fund, sequence, own"
      kind="OBJECTIVE + JUDGED"
      minutes={BLOCK_MINUTES["3.5"]}
      findIt={`Route 2 → Task 2 → the items below: your three levers from Block 3.3 and the two enabling items. The budget is ${euro(R2_BUDGET)} over ${R2_MONTHS} months. Answer in the item cards.`}
    >
      <MaterialRefs refs={["B5"]} />
      {r2.levers.length < LEVER_CHOOSE && (
        <p className="rounded-md border border-line bg-mist/60 px-3 py-2 text-caption text-ink">
          You have chosen {r2.levers.length} of your {LEVER_CHOOSE} levers in Block 3.3, so this list shows only what it has so far. Nothing is blocked.{" "}
          <button type="button" onClick={() => scrollToAndFlash(IDS.leverPick, "ref", "start")} className="font-semibold underline decoration-dotted underline-offset-2">
            Go to Block 3.3
          </button>
        </p>
      )}
      <div className="flex flex-wrap items-start gap-2">
        <RevealHint id="owner-help" label="Show the owner test" title="The tests · taught in Materi B5">
          <div className="space-y-2 text-caption text-ink">
            <ul className="list-disc space-y-1 pl-5">
              <li>Owner: who can change it without asking anyone else?</li>
              <li>Start: does something have to exist before it, such as the baseline?</li>
              <li>Trigger: does it have a metric, a number, a date and an action?</li>
            </ul>
            <p className="smallcaps text-ash">What each role can change</p>
            <ul className="space-y-1">
              {OWNER_IDS.map((o) => (
                <li key={o}>
                  <span className="font-semibold">{OWNERS[o].name}. </span>
                  {OWNERS[o].profile}
                </li>
              ))}
            </ul>
            <MaterialRefs refs={["B5"]} lead="Taught in" />
          </div>
        </RevealHint>
      </div>
      <p className="text-body text-ink">
        <Gloss>Fund the items you will carry out inside the budget. For each funded item choose the month it starts, one owner who can change it without asking anyone else, and a trigger: a number, a date and an action. Leave out what does not fit, on purpose.</Gloss>
      </p>
      <div id={IDS.archTotal} className="space-y-2">
        <BudgetBar items={f.map((id) => ({ id, short: LEVER_BY_ID[id].name.split(" ")[0], cost: LEVER_BY_ID[id].cost }))} budget={R2_BUDGET} title={`Funded items against the ${euro(R2_BUDGET)} budget`} />
        <p className="text-caption text-ash" aria-live="polite">
          Funded {euro(archCost(r2))} of {euro(R2_BUDGET)}. {over > 0 ? `${euro(over)} over: leave out the item with the weakest evidence for its lever, do not trim every item a little.` : `${euro(archLeft(r2))} left.`}
        </p>
      </div>
      {items.map((id) => {
        const l = LEVER_BY_ID[id];
        const on = !!r2.alloc[id];
        return (
          <div key={id} id={IDS.arch(id)} className={clsx("space-y-3 rounded-lg border p-3.5", on ? "border-line bg-paper" : "border-dashed border-ash/60 bg-mist/40")}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-ink">
                {l.name} <span className="font-normal text-ash">· {euro(l.cost)} · {l.weeks} weeks to a first effect{ENABLERS.includes(id) && !r2.levers.includes(id) ? " · enabling item" : ""}</span>
              </p>
              <button type="button" aria-pressed={on} onClick={() => setItem(id, { alloc: !on })} className={clsx("btn btn-sm min-h-[40px] border", on ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash")}>
                {on ? "☑ Funded" : "☐ Not funded"}
              </button>
            </div>
            <p className="text-caption text-ash">{l.what}</p>
            {on && (
              <>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label htmlFor={`start-${id}`} className="smallcaps block">
                      Starts in month
                    </label>
                    <select id={`start-${id}`} className="field mt-1 max-w-[10rem]" value={r2.start[id] ?? ""} onChange={(e) => setItem(id, { start: e.target.value ? Number(e.target.value) : null })}>
                      <option value="">Choose…</option>
                      {MONTHS_LIST.map((m) => (
                        <option key={m} value={m}>
                          Month {m}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor={`owner-${id}`} className="smallcaps block">
                      Owner (who can change it without asking anyone else)
                    </label>
                    <select id={`owner-${id}`} className="field mt-1" value={r2.owner[id] ?? ""} onChange={(e) => setItem(id, { owner: (e.target.value || null) as OwnerId | null })}>
                      <option value="">Choose an owner…</option>
                      {OWNER_IDS.map((o) => (
                        <option key={o} value={o}>
                          {OWNERS[o].name}
                        </option>
                      ))}
                    </select>
                    {r2.owner[id] && <p className="mt-1 text-micro normal-case tracking-normal text-ash">{OWNERS[r2.owner[id]!].profile}</p>}
                  </div>
                </div>
                <TextBox
                  id={`${IDS.arch(id)}-trigger`}
                  label="Trigger"
                  help="If [metric] is [worse than a number] by [month], then [action]. At least 20 characters, with a number."
                  value={r2.trigger[id] ?? ""}
                  onChange={(v) => setItem(id, { trigger: v })}
                  min={20}
                  rows={2}
                />
                {mentor && <MentorGuide guide={triggerGuide(id)} />}
              </>
            )}
          </div>
        );
      })}

      <div className="space-y-1 rounded-lg border border-line bg-mist/50 p-3 text-caption text-ink" aria-live="polite">
        <p className="smallcaps">What your sequence means</p>
        {f.length === 0 && <p>Nothing is funded yet.</p>}
        {f.length > 0 && !rules.hasSignals && <p>The behaviour signals are not funded, so nothing will tell you whether the levers change how buyers behave.</p>}
        {rules.hasSignals && sigStart != null && firstOther !== null && sigStart > firstOther && <p>The first item starts in month {firstOther}, before the signals in month {sigStart}: its first weeks have no baseline to compare with.</p>}
        {rules.hasSignals && sigStart != null && firstOther !== null && sigStart <= firstOther && <p>The signals start in month {sigStart}, no later than the first item (month {firstOther}), so the baseline exists before anything changes.</p>}
        {over > 0 && <p>The funded items are {euro(over)} over the budget.</p>}
      </div>

      {notAllFunded && (
        <div className="space-y-3 border-t border-line pt-3">
          <TextBox
            id={IDS.postponed}
            label="What you leave out, and why"
            help="Name the item and say why it is the one that goes: the budget, or the weakest evidence for its lever. At least 30 characters."
            value={r2.postponed}
            onChange={(v) => patch({ postponed: v })}
            min={MIN_LINE}
            rows={3}
          >
            <WritingHelp
              id="postponed-help"
              steps={["Name the item you leave out.", "Say what it would have cost and what that would have pushed the total to.", "Say why this one and not another: which lever depends most on individual people, or has the weakest evidence."]}
              refs={[{ label: "Budget", value: euro(R2_BUDGET), target: IDS.archTotal }]}
            />
          </TextBox>
          <TextBox
            id={IDS.pickup}
            label="The pickup point"
            help="The number and the date at which you look at it again: if [metric] is [number] by [month], we revisit it. At least 15 characters, with a number."
            value={r2.pickup}
            onChange={(v) => patch({ pickup: v })}
            min={15}
            rows={2}
          />
          {mentor && <MentorGuide guide={postponedGuide()} />}
        </div>
      )}

      <CheckBar onCheck={check} checkLabel="Check my architecture" checks={r2.checks} clueShown={r2.seqClue} onClue={() => patch({ seqClue: true })} />
      {r2.seqResult && (
        <Reading>
          {r2.seqResult.holds} of {r2.seqResult.total} rules hold (the behaviour signals start no later than the first lever, and the funded items fit the budget).
          {r2.seqClue ? " Clue: which item produces the evidence for all the others, and when should it start compared with the first lever? And do the funded costs add up to no more than the budget?" : ""}
        </Reading>
      )}
      <AnswerKey block={ownerKey(f)} />
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 3.6 */

export function Block36() {
  const r2 = useStore((s) => s.r2);
  const patch = useStore((s) => s.patchR2);
  const mentor = useStore((s) => s.mentorUnlocked);
  const k = r2.tripKpi ? KPIS.find((x) => x.id === r2.tripKpi)! : null;
  const flags = tripFlags(r2);
  const check = () => patch((s) => ({ checks: s.checks + 1, decisionFlagged: s.decision === "wait", decisionClue: false, tripFlags: tripFlags(s), tripClue: {} }));
  return (
    <AnswerBlock
      id="block-3-6"
      title="Block 3.6 · Decide before you know how customers will react"
      kind="OBJECTIVE + JUDGED"
      minutes={BLOCK_MINUTES["3.6"]}
      findIt="Route 2 → Task 2 → your own answers in Blocks 3.1 to 3.5, the baselines below, and the regret table in Materi B3. Answer in the fields below."
    >
      <MaterialRefs refs={["B3"]} />
      <div id={IDS.decision} className={clsx("space-y-2 rounded-lg p-1", r2.decisionFlagged && "is-flagged")}>
        <p className="font-semibold text-ink">Your decision</p>
        <p className="text-caption text-ash">The brief asks you to decide although customers' reactions are not clear. Choose one.</p>
        <OptionList<DecisionId> label="Decision" value={r2.decision} onChange={(v) => patch({ decision: v, decisionFlagged: false, decisionClue: false })} options={DECISIONS.map((d) => ({ id: d.id, label: d.label, sub: d.detail }))} />
        {r2.decisionFlagged && (
          <p className="text-caption text-ink">
            <span className="smallcaps mr-1 text-accent">Clue</span>
            Is waiting a decision that stops the stalling, or one that lets it continue for as long as you wait? Look at the last row of the regret table in Materi B3.
          </p>
        )}
      </div>

      <div className="space-y-3">
        <p className="font-semibold text-ink">Three assumptions your decision rests on</p>
        {r2.assumptions.map((a, i) => (
          <div key={i} className="space-y-1.5">
            <TextBox
              id={IDS.assumption(i)}
              label={`Assumption ${i + 1}`}
              help="How you think customers will react, and the sign that would show you are wrong (a number or something you could see). At least 30 characters."
              value={a}
              onChange={(v) => patch((s) => ({ assumptions: s.assumptions.map((x, j) => (j === i ? v : x)) }))}
              min={MIN_LINE}
              rows={2}
            />
            {mentor && <MentorGuide guide={assumptionGuide(i)} />}
          </div>
        ))}
      </div>

      <div id={IDS.trip} className="space-y-3 rounded-lg border border-line bg-paper p-3.5">
        <p className="font-semibold text-ink">The tripwire</p>
        <p className="text-caption text-ash">
          A metric of buyer behaviour, a threshold better than today's baseline, a month and an action agreed now. {R2_BASELINE_NOTE}
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <div className={clsx(flags.includes("kpi") && "is-flagged p-1")}>
            <label htmlFor="trip-kpi" className="smallcaps block">
              Metric
            </label>
            <select id="trip-kpi" className="field mt-1" value={r2.tripKpi ?? ""} onChange={(e) => patch({ tripKpi: (e.target.value || null) as KpiId | null, tripFlags: [] })}>
              <option value="">Choose a metric…</option>
              {KPIS.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.label} (today: {x.baseline}
                  {x.unit === "%" ? "%" : ` ${x.unit}`})
                </option>
              ))}
            </select>
            {flags.includes("kpi") && r2.tripFlags.includes("kpi") && (
              <p className="mt-1 text-micro normal-case tracking-normal text-ink">
                <span className="font-semibold text-accent">Clue. </span>Does this metric measure how the buyer behaved, or how much the sellers did?
              </p>
            )}
          </div>
          <div className={clsx(flags.includes("threshold") && "is-flagged p-1")}>
            <label htmlFor="trip-threshold" className="smallcaps block">
              Threshold{k ? ` (${k.unit === "%" ? "%" : k.unit}; better is ${k.better === "up" ? "higher" : "lower"})` : ""}
            </label>
            <input id="trip-threshold" className="field tnum mt-1" inputMode="decimal" value={r2.tripThreshold} onChange={(e) => patch({ tripThreshold: e.target.value, tripFlags: [] })} />
            {flags.includes("threshold") && r2.tripFlags.includes("threshold") && k && (
              <p className="mt-1 text-micro normal-case tracking-normal text-ink">
                <span className="font-semibold text-accent">Clue. </span>Compare it with today's figure, {k.baseline}
                {k.unit === "%" ? "%" : ` ${k.unit}`}. Would reaching it show a real change?
              </p>
            )}
          </div>
          <div>
            <label htmlFor="trip-month" className="smallcaps block">
              By month
            </label>
            <select id="trip-month" className="field mt-1 max-w-[10rem]" value={r2.tripMonth ?? ""} onChange={(e) => patch({ tripMonth: e.target.value ? Number(e.target.value) : null })}>
              <option value="">Choose…</option>
              {MONTHS_LIST.map((m) => (
                <option key={m} value={m}>
                  Month {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="trip-action" className="smallcaps block">
              If it is missed
            </label>
            <select id="trip-action" className="field mt-1" value={r2.tripAction} onChange={(e) => patch({ tripAction: e.target.value as "" | "scale" | "adjust" | "stop" })}>
              <option value="">Choose an action…</option>
              <option value="adjust">Adjust one lever and continue</option>
              <option value="stop">Stop and reconsider the plan</option>
              <option value="scale">Scale to all segments anyway</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="rounded-lg border border-gold bg-accentSoft p-3.5 text-caption text-ink">
          <p className="smallcaps text-accent">The board's challenge</p>
          <p className="mt-1">{BOARD_CHALLENGE}</p>
        </div>
        <TextBox
          id={IDS.challenge}
          label="What do you do?"
          help="Say what you check first, what you keep, and the one thing you change. At least 60 characters."
          value={r2.challenge}
          onChange={(v) => patch({ challenge: v })}
          min={60}
          rows={4}
        >
          <WritingHelp id="challenge-help" steps={["Go back to your tripwire and your signals before spending more.", "Say what the numbers still support, and keep it.", "Change one lever, not the whole plan, and say how you will find out why the customers reacted as they did."]} />
        </TextBox>
        {mentor && <MentorGuide guide={challengeGuide()} />}
      </div>

      <CheckBar onCheck={check} checkLabel="Check my decision" checks={r2.checks} />
      {r2.checks > 0 && (r2.decisionFlagged || r2.tripFlags.length > 0) && (
        <Reading>
          {r2.decisionFlagged ? "Your decision is outlined." : ""}
          {r2.tripFlags.length > 0 ? ` ${r2.tripFlags.length} part${r2.tripFlags.length === 1 ? "" : "s"} of the tripwire ${r2.tripFlags.length === 1 ? "is" : "are"} outlined.` : ""}
        </Reading>
      )}
      <AnswerKey block={decisionKey()} />
      <AnswerKey block={tripKey()} />
    </AnswerBlock>
  );
}
