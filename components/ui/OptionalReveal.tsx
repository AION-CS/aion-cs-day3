"use client";

import type { ReactNode } from "react";
import { useOptionalOpen } from "@/store/useOptionalOpen";

/**
 * Wraps one Optional material card the same way `AnswerBlock` wraps an Optional task block: collapsed by default
 * to one quiet, low-contrast line ("Optional, about N min · title · click to show"), sharing the same
 * `useOptionalOpen` store and the same element id, so a PageNav jump or another `openOptionalBlock(id)` call
 * opens it first rather than landing on a closed card. Nothing is deleted or made unreachable — a click (or
 * "Hide" once open) is all that changes.
 */
export function OptionalReveal({ id, minutes, label, children }: { id: string; minutes: number; label: string; children: ReactNode }) {
  const opened = useOptionalOpen((s) => !!s.open[id]);
  const show = useOptionalOpen((s) => s.show);
  const hide = useOptionalOpen((s) => s.hide);

  if (!opened) {
    return (
      <div id={id} className="px-1">
        <button
          type="button"
          onClick={() => show(id)}
          aria-expanded={false}
          className="text-left text-micro normal-case tracking-normal text-ash/60 underline decoration-dotted underline-offset-2 hover:text-ash focus-visible:text-ash"
        >
          {`Optional, about ${minutes} min · ${label} · click to show`}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <button type="button" onClick={() => hide(id)} className="text-micro normal-case tracking-normal text-ash/70 underline decoration-dotted underline-offset-2 hover:text-ash">
          Hide
        </button>
      </div>
      {children}
    </div>
  );
}
