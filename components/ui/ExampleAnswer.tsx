"use client";

import { useState } from "react";
import type { MentorGuide } from "@/lib/mentorGuide";

/**
 * A learner-facing, ungated "Show clue and example answer" control for a free-text (JUDGED) field: a small button, and on click a
 * panel with a Hide link — the same collapsed-by-default shape as RevealHint, open to every participant at any time, no passcode.
 * The example text is read straight from the same MentorGuide entry the mentor's worked answer uses (`guide.answer`), never
 * retyped, so the two can never drift apart. Participants asked for a comparison example on reflective fields; see CLAUDE.md #23.
 * This is a deliberate, named exception to #4's "clue, not answer" for free-text fields only — never for a classification,
 * placement or fixed-option exercise, which keep #4 unchanged.
 */
export function ExampleAnswer({ id, guide }: { id: string; guide: MentorGuide }) {
  const [open, setOpen] = useState(false);
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
      <p className="mt-1.5">One way to answer this — yours does not have to match it word for word.</p>
      <p className="mt-1.5 italic text-ink">{guide.answer}</p>
    </div>
  );
}
