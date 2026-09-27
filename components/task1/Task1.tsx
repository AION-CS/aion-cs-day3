"use client";

import { ExportBar } from "@/components/ui/ExportBar";
import { Block11, Block12, Block13, Block14 } from "@/components/task1/Part1";
import { Block21, Block22, Block23 } from "@/components/task1/Part2";
import { Callout } from "@/components/ui/MaterialCard";
import { BUDGET, MONTHS } from "@/data/measures";
import { behaviourBody } from "@/lib/exportDoc";
import { l1Missing } from "@/lib/missing";
import { euro } from "@/lib/lang";
import { exportName } from "@/lib/slug";
import { usePersisted } from "@/store/usePersisted";
import { Gloss } from "@/lib/glossify";
import { TASK1_MINUTES } from "@/lib/routes";

/** The case, stated once, directly above the task. */
function CaseBrief() {
  return (
    <section id="case-brief" aria-labelledby="case-h" className="card space-y-3 p-4 md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="case-h">The case: SecureIT Systems GmbH</h2>
        <span className="smallcaps">Read once · about 5 min</span>
      </div>
      <p className="max-w-prose text-body text-ink">
        <Gloss>
          SecureIT Systems GmbH is a German provider of IT security services for Mittelstand (mid-sized) companies: it monitors its customers' systems and runs security implementation projects. Its sales problem is easy to say and hard to fix: it has many prospects, but a high share of them abandon the purchase shortly before the contract is closed, and customers delay their decisions.
        </Gloss>
      </p>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-line bg-canvas p-3 text-caption">
          <p className="smallcaps">What you have</p>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-ink">
            <li>The debrief after a lost deal: Rheinwerk Logistik chose Sentinel Group (better known, dearer) over SecureIT (cheaper). It is printed in Blocks 1.1 and 1.2.</li>
            <li>Twelve exit notes from deals that stalled or dropped out, printed in Block 2.1.</li>
          </ul>
        </div>
        <div className="rounded-lg border border-line bg-canvas p-3 text-caption">
          <p className="smallcaps">The limits</p>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-ink">
            <li>
              Budget: <strong>{euro(BUDGET)}</strong>
            </li>
            <li>
              Time: <strong>{MONTHS} months</strong> (about 13 weeks)
            </li>
            <li>The costs and the weeks of the measures are printed on each measure in Block 2.3.</li>
          </ul>
        </div>
        <div className="rounded-lg border border-line bg-canvas p-3 text-caption">
          <p className="smallcaps">How the task runs · about {TASK1_MINUTES} min</p>
          <ol className="mt-1 list-decimal space-y-1 pl-4 text-ink">
            <li>Understand why the buyer chose the dearer provider (Level 1).</li>
            <li>Read the twelve notes as behaviour and name the patterns (Level 2).</li>
            <li>Choose three measures and defend the order.</li>
          </ol>
        </div>
      </div>
      <Callout label="Case assumption" tone="amber">
        <p>
          The brief says: many prospects, a high abandonment rate before contract closing, customers who delay, €100,000, three months. Everything else is made up for this exercise: the deal names, the buyers' words, the figures and the costs. They are labelled where you meet them.
        </p>
      </Callout>
    </section>
  );
}

function PartHeading({ id, n, title, level }: { id: string; n: number; title: string; level: string }) {
  return (
    <div id={id} className="flex flex-wrap items-baseline gap-x-3 border-b-2 border-ink pb-1 pt-2">
      <span className="smallcaps text-accent">Part {n}</span>
      <h2>{title}</h2>
      <span className="smallcaps ml-auto">{level}</span>
    </div>
  );
}

export function Task1() {
  const p = usePersisted();
  const missing = l1Missing(p);
  const filename = exportName(p.participant.name, "l1l2-behaviour-analysis");
  return (
    <section id="task-1" aria-labelledby="task1-h" className="space-y-6">
      <header className="space-y-1">
        <p className="smallcaps text-accent">Task 1 · about {TASK1_MINUTES} minutes</p>
        <h2 id="task1-h">Behaviour Analysis: from one lost deal to three measures</h2>
      </header>
      <CaseBrief />

      <PartHeading id="part-1" n={1} title="Understand the decision" level="Level 1 · Knowledge" />
      <Block11 />
      <Block12 />
      <Block13 />
      <Block14 />

      <PartHeading id="part-2" n={2} title="Analyse and act" level="Level 2 · Application" />
      <Block21 />
      <Block22 />
      <Block23 />

      <ExportBar
        id="export-l1l2"
        previewTitle="Preview of your Behaviour Analysis File"
        exportLabel="Export the Behaviour Analysis File"
        docTitle="Behaviour Analysis File"
        filename={filename}
        missing={missing}
        buildBody={() => behaviourBody(p)}
      />
    </section>
  );
}
