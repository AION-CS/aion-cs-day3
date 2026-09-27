"use client";

import type { ReactNode } from "react";
import { useOptionalOpen } from "@/store/useOptionalOpen";

export type BlockKind = "OBJECTIVE" | "JUDGED" | "OBJECTIVE + JUDGED" | "EXPLORATORY";

export function Pill({ kind }: { kind: BlockKind }) {
  if (kind === "OBJECTIVE + JUDGED") {
    return (
      <>
        <Pill kind="OBJECTIVE" />
        <Pill kind="JUDGED" />
      </>
    );
  }
  const cls = kind === "OBJECTIVE" ? "pill-obj" : kind === "EXPLORATORY" ? "pill border-line bg-mist text-ash" : "pill-jdg";
  const label = kind === "OBJECTIVE" ? "OBJECTIVE" : kind === "EXPLORATORY" ? "EXPLORATORY" : "JUDGED";
  const title =
    kind === "OBJECTIVE"
      ? "One answer the case or the tables settle."
      : kind === "EXPLORATORY"
        ? "Not graded and not exported."
        : "Your judgement, defended in your own words.";
  return (
    <span className={cls} title={title}>
      {label}
    </span>
  );
}

/**
 * Where a block sits in a route that marks some of its blocks Optional: Core blocks are required for a complete
 * export, Optional blocks are for whoever has time and are never listed as missing. Minutes are a guide, not a timer.
 */
export type Tier = { level: "core" | "optional"; minutes: number };

export function TierPill({ tier }: { tier: Tier }) {
  return tier.level === "core" ? (
    <span className="pill border-signal/40 bg-signalSoft text-signal" title="Needed for a complete export.">
      {`CORE · about ${tier.minutes} min`}
    </span>
  ) : (
    <span className="pill border-dashed border-ash/60 bg-mist text-ash" title="For whoever has time. Never listed as missing.">
      {`OPTIONAL · about ${tier.minutes} min`}
    </span>
  );
}

/** The FIND IT line: exact route + widget name as printed on screen + the exact click. */
export function FindIt({ path, analyse = true }: { path: string; analyse?: boolean }) {
  return (
    <div className="space-y-0.5">
      <p className="text-caption text-ash">
        <span className="smallcaps mr-1 text-accent">FIND IT</span>· {path}
      </p>
      {analyse && <p className="text-caption italic text-ash">Analyse in the app. Write your result in the answer area below.</p>}
    </div>
  );
}

/**
 * One answer block: heading + pill, FIND IT line, then a separate blank answer area directly beneath. When `tier`
 * is Optional and not yet opened, the whole block collapses to one quiet, low-contrast line ("Optional, about N
 * min · title · click to show") instead of rendering — nothing is deleted or made unreachable, a click (or a
 * PageNav jump, which opens it first) reveals the full block, and a "Hide" link puts it away again.
 */
export function AnswerBlock({
  id,
  title,
  kind,
  findIt,
  children,
  analyse = true,
  minutes,
  tier,
}: {
  id?: string;
  title: string;
  kind: BlockKind;
  findIt: string;
  analyse?: boolean;
  children: ReactNode;
  /** A guide for the facilitator, not a timer. Ignored when `tier` is set (the tier pill shows its own minutes). */
  minutes?: number;
  /** Marks this block Core or Optional. Omit for a route with no tiers (every block required, as before). */
  tier?: Tier;
}) {
  const optional = tier?.level === "optional";
  const opened = useOptionalOpen((s) => (id ? !!s.open[id] : true));
  const show = useOptionalOpen((s) => s.show);
  const hide = useOptionalOpen((s) => s.hide);

  if (optional && !opened && id) {
    return (
      <div id={id} className="px-1">
        <button
          type="button"
          onClick={() => show(id)}
          aria-expanded={false}
          className="text-left text-micro normal-case tracking-normal text-ash/60 underline decoration-dotted underline-offset-2 hover:text-ash focus-visible:text-ash"
        >
          {`Optional, about ${tier!.minutes} min · ${title} · click to show`}
        </button>
      </div>
    );
  }

  return (
    <section id={id} className="card space-y-3 p-4 md:p-5">
      <header className="flex flex-wrap items-center gap-2">
        <h3>{title}</h3>
        <Pill kind={kind} />
        {tier && <TierPill tier={tier} />}
        {!tier && minutes ? <span className="smallcaps ml-auto whitespace-nowrap">about {minutes} min</span> : null}
        {optional && id && (
          <button type="button" onClick={() => hide(id)} className="ml-auto text-micro normal-case tracking-normal text-ash/70 underline decoration-dotted underline-offset-2 hover:text-ash">
            Hide
          </button>
        )}
      </header>
      <FindIt path={findIt} analyse={analyse} />
      <div className="space-y-4 border-t border-line pt-3">{children}</div>
    </section>
  );
}
