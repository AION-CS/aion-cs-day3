"use client";

import { useState } from "react";
import type { MentorGuide } from "@/lib/mentorGuide";

/**
 * A learner-facing, ungated "Show clue and example answer" control for a free-text (JUDGED) field: a small button, and on click a
 * panel with a Hide link — the same collapsed-by-default shape as RevealHint, open to every participant at any time, no passcode.
 *
 * For an open, reflective field the text is read straight from the same MentorGuide entry the mentor's worked answer uses
 * (`guide.answer`), never retyped, so the two can never drift apart. But a field whose "answer" IS the case's own calculated
 * result or one of a small fixed set of correct picks (a felt-cost comparison, which measures to fund, the greatest lever) would
 * stop being a clue and start being the answer if shown verbatim — so `guide.example` holds a separately written, standalone
 * worked example instead: the same method, on different numbers and generic names ("Company A", "Measure A"), so the learner
 * still has to run the method on the real case's own figures to reach their own result. `ExampleAnswer` prefers `example` when a
 * guide provides one. This is a deliberate, named exception to #4's "clue, not answer" for free-text fields only — never for a
 * classification, placement or fixed-option exercise, which keep #4 unchanged. See CLAUDE.md #23.
 */
export function ExampleAnswer({ id, guide }: { id: string; guide: MentorGuide }) {
  const [open, setOpen] = useState(false);
  const isExample = !!guide.example;
  const text = guide.example ?? guide.answer;
  if (!open) {
    return (
      <button type="button" aria-expanded={false} aria-controls={id} onClick={() => setOpen(true)} className="btn-ghost btn-sm border-gold">
        Show clue and example answer
      </button>
    );
  }
  return (
    <div id={id} className="fade-in rounded-md border border-gold bg-accentSoft p-2.5 text-caption text-ink">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="smallcaps text-accent">Clue and example answer</p>
        <button
          type="button"
          aria-expanded={true}
          aria-controls={id}
          onClick={() => setOpen(false)}
          className="text-micro font-semibold text-ash underline decoration-dotted underline-offset-2 hover:text-accentHi"
        >
          Hide
        </button>
      </div>
      <p className="mt-1.5">
        {isExample
          ? "A worked example with different names and different numbers — not this case. Use the same method on your own figures; your result will differ."
          : "One way to answer this — yours does not have to match it word for word."}
      </p>
      <p className="mt-1.5 italic text-ink">{text}</p>
    </div>
  );
}
