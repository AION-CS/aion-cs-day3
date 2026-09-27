"use client";

import { create } from "zustand";

/**
 * Which Optional material cards and task blocks the learner has opened. An Optional item starts collapsed to one
 * quiet line so attention stays on what is required; opening one is a click, never a lock. Session-only, never
 * persisted: the answers inside stay persisted as usual, only the open/closed state is not.
 */
type OptionalOpenState = {
  open: Record<string, boolean>;
  show: (id: string) => void;
  hide: (id: string) => void;
};

export const useOptionalOpen = create<OptionalOpenState>()((set) => ({
  open: {},
  show: (id) => set((s) => ({ open: { ...s.open, [id]: true } })),
  hide: (id) => set((s) => ({ open: { ...s.open, [id]: false } })),
}));

/** Opens an Optional item by its element id (a no-op for any other id), so a jump to it never lands on a closed item. */
export const openOptionalBlock = (id: string) => useOptionalOpen.getState().show(id);
