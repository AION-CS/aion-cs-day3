"use client";

import { Block31, Block32, Block33, Block34, Block35, Block36 } from "@/components/task2/Blocks";
import { MemoPanel } from "@/components/task2/MemoPanel";
import { ExportBar } from "@/components/ui/ExportBar";
import { Callout } from "@/components/ui/MaterialCard";
import { BARRIERS } from "@/data/barriers";
import { MEASURE_BY_ID } from "@/data/measures";
import { R2_BUDGET, R2_MONTHS } from "@/data/route2";
import { Gloss } from "@/lib/glossify";
import { euro } from "@/lib/lang";
import { memoBody } from "@/lib/exportDoc";
import { r2Missing } from "@/lib/missing";
import { TASK2_CORE_MINUTES, TASK2_MINUTES } from "@/lib/routes";
import { exportName } from "@/lib/slug";
import { useJumpTo } from "@/lib/useJumpTo";
import { usePersisted } from "@/store/usePersisted";
import { useHydrated } from "@/store/useStore";

/** The situation of Route 2, stated once, directly above the task, with a soft pointer to the learner's own Route 1 answers. */
function CaseBrief() {
  const hydrated = useHydrated();
  const p = usePersisted();
  const jump = useJumpTo();
  const named = p.l1.patterns.filter((x) => x.barrier).map((x) => BARRIERS[x.barrier!].short);
  const chosen = p.l1.chosen.map((id) => MEASURE_BY_ID[id].name);
  const has = hydrated && (named.length > 0 || chosen.length > 0);
  return (
    <section id="task-2" aria-labelledby="task2-h" className="card space-y-3 p-4 md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="task2-h">The situation: you are the Chief Sales Officer</h2>
        <span className="smallcaps">Read once · about 4 min</span>
      </div>
      <p className="max-w-prose text-body text-ink">
        <Gloss>
          Three months ago SecureIT Systems GmbH fixed the deals it could see. You now own the whole sales system, and the board wants a plan that does not depend on individual sellers. Customers decide slowly. The market is uncertain, and competition is strong. The budget is limited, and what customers actually need is not fully known.
        </Gloss>
      </p>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-line bg-canvas p-3 text-caption">
          <p className="smallcaps">The limits</p>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-ink">
            <li>
              Budget: <strong>{euro(R2_BUDGET)}</strong> (Case assumption)
            </li>
            <li>
              Time: <strong>{R2_MONTHS} months</strong>
            </li>
            <li>Baselines for the tripwire are printed in Block 3.6.</li>
          </ul>
        </div>
        <div className="rounded-lg border border-line bg-canvas p-3 text-caption md:col-span-2">
          <p className="smallcaps">What you build · Core about {TASK2_CORE_MINUTES} min, all of it about {TASK2_MINUTES} min</p>
          <ol className="mt-1 grid list-decimal gap-x-6 pl-4 text-ink sm:grid-cols-2">
            <li>Three strategic levers</li>
            <li>The measures architecture</li>
            <li>A decision before the reactions are known</li>
            <li className="text-ash">The central influencing factors (optional)</li>
            <li className="text-ash">A model of how buyers decide (optional)</li>
            <li className="text-ash">The risk of misjudging customers (optional)</li>
          </ol>
        </div>
      </div>
      <p className="text-caption text-ash">
        Three blocks (naming the factors, modelling each phase, sizing the misjudgment risk) are marked <strong>Optional</strong> below: they start collapsed to one line, for whoever has time, and are never listed as missing from the memo. Choosing the levers, funding them and deciding are <strong>Core</strong> — that is what the memo needs.
      </p>
      <div role="note" className="rounded-lg border border-gold bg-accentSoft p-3 text-caption text-ink" id="task1-quote">
        <p className="smallcaps text-accent">Where Route 1 left off · your own answers</p>
        {has ? (
          <p className="mt-1">
            Patterns you named: <strong>{named.join(", ") || "none yet"}</strong>. Measures you chose: <strong>{chosen.join(", ") || "none yet"}</strong>.
          </p>
        ) : (
          <p className="mt-1">You have not answered Route 1 yet. That is fine: nothing here is blocked, and this box fills in when you do.</p>
        )}
        <button type="button" onClick={() => jump("block-2-2", "/route-1/")} className="btn-ghost btn-sm mt-2">
          Go to Block 2.2 in Route 1
        </button>
      </div>
      <Callout label="Case assumption" tone="amber">
        <p>
          The brief gives the role and the situation: slow decisions, high market uncertainty, strong competition, a limited budget, needs not fully known, and the requirement to decide anyway. The budget figure, the costs, the baselines and the levers are made up for this exercise.
        </p>
      </Callout>
    </section>
  );
}

export function Task2() {
  const p = usePersisted();
  const missing = r2Missing(p);
  const filename = exportName(p.participant.name, "l3-decision-memo");
  return (
    <div className="space-y-6">
      <CaseBrief />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
        <div className="min-w-0 space-y-6 pb-14 lg:pb-0">
          <Block31 />
          <Block32 />
          <Block33 />
          <Block34 />
          <Block35 />
          <Block36 />
          <ExportBar id="export-l3" previewTitle="Preview of your memo" exportLabel="Export the Decision Memo" docTitle="Decision Memo" filename={filename} missing={missing} buildBody={() => memoBody(p)} showPreview={false} />
        </div>
        <MemoPanel />
      </div>
    </div>
  );
}
