"use client";

import { useState } from "react";
import type { DragEvent, ReactNode } from "react";
import clsx from "clsx";
import { UndoRedoControls, undoRedoKeyHandler } from "@/components/ui/UndoRedoControls";

export type BoardItem = { id: string; meta?: string; text: string };
export type BoardBin<B extends string> = { id: B; label: string; hint: string };

function Marked({ text, mark }: { text: string; mark: string }) {
  const i = text.indexOf(mark);
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded bg-gold/40 px-0.5 font-semibold text-ink">{mark}</mark>
      {text.slice(i + mark.length)}
    </>
  );
}

/**
 * A sort exercise: items go into named bins by native HTML5 drag and drop, or by click (select an item, then a bin) for touch and
 * keyboard. Every placement is undoable (buttons, Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z, Ctrl+Y). One set-level Check reports only how many
 * placed items hold, never which ones, because with a few bins naming the wrong items would name the answer. "Show clue" prints a test
 * question under every item at once. After two genuine checks a "show the reasoning" button opens and is recorded in the export.
 * An optional "Highlight the key words" toggle underlines the decisive phrase of every item's own text at once — never only the
 * wrong ones, and never which bin it points to (CLAUDE.md #4) — so a learner spends effort reasoning about the phrase, not hunting
 * for it inside a longer quotation.
 */
export function PlacementBoard<B extends string>({
  items,
  bins,
  value,
  onPlace,
  onUndo,
  onRedo,
  undoCount,
  redoCount,
  domId,
  clues,
  reasons,
  result,
  checks,
  onCheck,
  onClue,
  clueShown,
  reasoningOpened,
  onOpenReasoning,
  tests,
  noun,
  intro,
  binCols = 3,
  checkLabel = "Check my sort",
  keyPhrases,
}: {
  items: BoardItem[];
  bins: BoardBin<B>[];
  value: Record<string, B | null>;
  onPlace: (id: string, bin: B | null) => void;
  onUndo: () => void;
  onRedo: () => void;
  undoCount: number;
  redoCount: number;
  domId: (id: string) => string;
  clues: Record<string, string>;
  reasons: Record<string, string>;
  result: { holds: number; placed: number } | null;
  checks: number;
  onCheck: () => void;
  onClue: () => void;
  clueShown: boolean;
  reasoningOpened: boolean;
  onOpenReasoning: () => void;
  tests: ReactNode;
  noun: string;
  intro: string;
  binCols?: 2 | 3;
  checkLabel?: string;
  /** The decisive phrase inside each item's own text, keyed by item id. Drives "Highlight the key words". */
  keyPhrases?: Record<string, string>;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const [highlightOn, setHighlightOn] = useState(false);
  const byId = Object.fromEntries(items.map((i) => [i.id, i]));
  const unplaced = items.filter((i) => value[i.id] === null || value[i.id] === undefined);

  const put = (id: string, bin: B | null) => {
    onPlace(id, bin);
    setSelected(null);
  };
  const dropOn = (bin: B | null) => (e: DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || dragging;
    setOver(null);
    setDragging(null);
    if (id && id in byId) put(id, bin);
  };
  const dragOn = (key: string) => (e: DragEvent) => {
    e.preventDefault();
    setOver(key);
  };

  const card = (it: BoardItem) => (
    <div key={it.id} id={domId(it.id)} className="space-y-1 rounded-lg">
      <button
        type="button"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("text/plain", it.id);
          e.dataTransfer.effectAllowed = "move";
          setDragging(it.id);
        }}
        onDragEnd={() => {
          setDragging(null);
          setOver(null);
        }}
        onClick={() => setSelected(selected === it.id ? null : it.id)}
        aria-pressed={selected === it.id}
        className={clsx(
          "flex w-full flex-col items-start gap-0.5 rounded-lg border bg-paper px-2.5 py-2 text-left transition-colors",
          selected === it.id ? "border-accent bg-accentSoft ring-2 ring-gold anim-pulse" : "border-line hover:border-ash",
          dragging === it.id && "is-dragging",
        )}
      >
        {it.meta && <span className="smallcaps">{it.meta}</span>}
        <span className="text-caption leading-snug text-ink">
          {highlightOn && keyPhrases?.[it.id] ? <Marked text={it.text} mark={keyPhrases[it.id]} /> : it.text}
        </span>
      </button>
      {clueShown && clues[it.id] && <p className="fade-in rounded-md border border-gold bg-accentSoft px-2 py-1 text-micro normal-case tracking-normal text-ink">{clues[it.id]}</p>}
    </div>
  );

  const canReveal = checks >= 2;
  return (
    <div className="space-y-4" onKeyDown={undoRedoKeyHandler(onUndo, onRedo)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-caption text-ash">{intro}</p>
        <UndoRedoControls onUndo={onUndo} onRedo={onRedo} undoCount={undoCount} redoCount={redoCount} />
      </div>

      <div onDragOver={dragOn("tray")} onDragLeave={() => setOver(null)} onDrop={dropOn(null)} className={clsx("rounded-lg border border-dashed border-ash/60 bg-mist/60 p-3", over === "tray" && "is-drop-target")}>
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="smallcaps">
            {noun}s not sorted ({unplaced.length})
          </p>
          {selected && value[selected] != null && (
            <button type="button" onClick={() => put(selected, null)} className="btn-ghost btn-sm">
              Return to this tray
            </button>
          )}
        </div>
        {unplaced.length === 0 ? <p className="text-caption text-ash">Every {noun} is in a bin.</p> : <div className="grid gap-2 sm:grid-cols-2">{unplaced.map(card)}</div>}
      </div>

      <div className={clsx("grid gap-3", binCols === 3 ? "md:grid-cols-3" : "md:grid-cols-2")}>
        {bins.map((b) => {
          const inBin = items.filter((i) => value[i.id] === b.id);
          return (
            <div
              key={b.id}
              onDragOver={dragOn(b.id)}
              onDragLeave={() => setOver(null)}
              onDrop={dropOn(b.id)}
              className={clsx("flex min-h-[8rem] flex-col rounded-lg border border-line bg-paper p-2.5", over === b.id && "is-drop-target")}
            >
              <button
                type="button"
                onClick={() => selected && put(selected, b.id)}
                aria-label={selected ? `Place “${byId[selected].text.slice(0, 40)}…” in ${b.label}` : `${b.label}. Select a ${noun} first.`}
                className={clsx("mb-2 rounded-md border px-2 py-1.5 text-left transition-colors", selected ? "border-accent bg-accentSoft hover:bg-gold/30" : "border-transparent bg-mist")}
              >
                <span className="block text-caption font-bold leading-tight">
                  {b.label} <span className="tnum font-normal text-ash">({inBin.length})</span>
                </span>
                <span className="mt-0.5 block text-micro normal-case leading-snug tracking-normal text-ash">{b.hint}</span>
              </button>
              <div className="space-y-1.5">{inBin.map(card)}</div>
              {inBin.length === 0 && <p className="mt-auto pt-2 text-micro normal-case tracking-normal text-ash">Empty</p>}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-start gap-2">{tests}</div>

      <div className="space-y-3 border-t border-line pt-3">
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={onCheck} className="btn-primary">
            {checkLabel}
          </button>
          {!clueShown && (
            <button type="button" onClick={onClue} className="btn-ghost btn-sm border-gold">
              Show clue
            </button>
          )}
          {keyPhrases && (
            <button type="button" onClick={() => setHighlightOn((v) => !v)} className="btn-ghost btn-sm border-gold" aria-pressed={highlightOn}>
              {highlightOn ? "Hide the key words" : "Highlight the key words"}
            </button>
          )}
          <span className="text-caption text-ash">
            Checks requested: <span className="tnum font-semibold text-ink">{checks}</span>
          </span>
        </div>
        <p className="text-micro normal-case tracking-normal text-ash">A check counts how many placed {noun}s hold. It never says which, because naming the wrong ones would name the answer.</p>
        {result && (
          <p role="status" className="text-caption text-ink">
            {result.placed === 0
              ? `Nothing is sorted yet.`
              : `${result.holds} of ${result.placed} placed ${noun}${result.placed === 1 ? "" : "s"} ${result.placed === 1 ? "holds" : "hold"}.`}
            {result.placed < items.length && ` ${items.length - result.placed} not placed yet, so not checked.`}
          </p>
        )}
        {clueShown && <p className="text-micro normal-case tracking-normal text-ash">The clue is a test question under every {noun}, not only under the ones that are off.</p>}
        {highlightOn && <p className="text-micro normal-case tracking-normal text-ash">The highlight marks the decisive phrase in every {noun}&apos;s own text, not which bin it belongs in.</p>}
        {canReveal && !reasoningOpened && (
          <button type="button" onClick={onOpenReasoning} className="btn-ghost btn-sm">
            Show the reasoning (recorded in your export)
          </button>
        )}
        {reasoningOpened && (
          <ul className="fade-in space-y-1.5 rounded-lg border border-gold bg-accentSoft p-3 text-caption text-ink">
            <li className="smallcaps text-accent">The reasoning · opened after {checks} checks</li>
            {items.map((i) => (
              <li key={i.id}>
                <span className="font-semibold">{i.meta ? `${i.meta.split(" · ")[0]}` : i.text.slice(0, 30)}:</span> {reasons[i.id]}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
