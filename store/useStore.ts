"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { REASON_IDS } from "@/data/debrief";
import type { ReasonId, ReasonTag } from "@/data/debrief";
import { NOTE_IDS } from "@/data/exitNotes";
import type { InfoId, NoteId, Strength } from "@/data/exitNotes";
import type { BarrierId } from "@/data/barriers";
import type { FigureId } from "@/data/feltCost";
import type { HypMech } from "@/data/hypotheses";
import { HYP_COUNT } from "@/data/hypotheses";
import type { MeasureId } from "@/data/measures";
import { PHASE_IDS } from "@/data/route2";
import type { DecisionId, FactorId, KpiId, LeverId, OwnerId, PhaseId, RiskId } from "@/data/route2";
import { KEY_L1, KEY_R2 } from "@/data/mentorKey";
import { FIGURE_BUILDERS, modelParts } from "@/lib/calcBuilder";
import type { RouteNo } from "@/lib/routes";

export const STORAGE_KEY = "cs-d3-v1";
const HISTORY_CAP = 100;

/** 0 means not chosen yet. */
export type Score = 0 | 1 | 2 | 3;

export type SortMap = Record<ReasonId, ReasonTag | null>;
export type TagMap = Record<NoteId, BarrierId | null>;
export type HypRow = { mech: HypMech | null; text: string };
export type PatternRow = { barrier: BarrierId | null; behaviour: string; strength: Strength | null };

/** Route 1 · Levels 1 and 2 — the Behaviour Analysis File. */
export type L1State = {
  /** Block 1.1 */
  sort: SortMap;
  sortHistory: SortMap[];
  sortFuture: SortMap[];
  sortChecks: number;
  /** Last set-level check: how many placed statements hold. Cleared by the next placement. */
  sortResult: { holds: number; placed: number } | null;
  sortClue: boolean;
  /** Recorded in the export: the reasoning was opened after two genuine checks. */
  sortReasoning: boolean;
  /** A reason of the learner's own that is not in the debrief (Block 1.1). */
  extraReason: string;
  /** Block 1.2 */
  felt: Record<FigureId, string>;
  feltFlagged: FigureId[];
  feltClue: Record<string, boolean>;
  /** The formula calculators' parts, keyed "F1.price". */
  parts: Record<string, string>;
  partFlags: string[];
  role: string;
  roleFlagged: boolean;
  roleClue: boolean;
  /** Block 1.3 */
  hyp: HypRow[];
  hypFlagged: number[];
  hypChecked: boolean;
  hypClue: boolean;
  /** Block 1.4 */
  reflect: { assume: string; emotional: string; manager: string };
  /** Block 2.1 */
  tags: TagMap;
  tagHistory: TagMap[];
  tagFuture: TagMap[];
  tagChecks: number;
  tagResult: { holds: number; placed: number } | null;
  tagClue: boolean;
  tagReasoning: boolean;
  /** Block 2.2 */
  patterns: PatternRow[];
  patResult: { barrier: number; strength: number; filled: number } | null;
  patClue: boolean;
  info: InfoId[];
  infoText: string;
  infoResult: { holds: number; chosen: number } | null;
  /** Block 2.3 */
  chosen: MeasureId[];
  aims: Record<string, BarrierId[]>;
  inf: Record<string, Score>;
  fea: Record<string, Score>;
  spd: Record<string, Score>;
  /** Flags from the last check: "refs.aims", "refs.speed". */
  measureFlags: string[];
  measureClue: Record<string, boolean>;
  order: MeasureId[];
  why: string;
  /** Every check requested in Route 1, printed in the export footer. */
  checks: number;
};

/** Route 2 · Level 3 — the Decision Memo. */
export type R2State = {
  /** Block 3.1 */
  factors: FactorId[];
  factorText: Record<string, string>;
  factorFlagged: boolean;
  factorClue: boolean;
  /** Block 3.2 */
  model: Record<PhaseId, { question: string | null; factor: FactorId | null; signal: string | null; move: string }>;
  modelResult: { holds: number; total: number } | null;
  modelClue: boolean;
  /** Block 3.3 — ratings keyed "lever.criterion" */
  levers: LeverId[];
  rate: Record<string, Score>;
  rateFlags: string[];
  rateClue: Record<string, boolean>;
  leverResult: { systemic: number } | null;
  greatest: LeverId | null;
  greatestWhy: string;
  /** Block 3.4 */
  risks: RiskId[];
  riskLik: Record<string, Score>;
  riskImp: Record<string, Score>;
  riskSignal: Record<string, string | null>;
  riskResponse: Record<string, string>;
  riskFlags: string[];
  riskClue: Record<string, boolean>;
  riskResult: { psychology: number } | null;
  /** Block 3.5 — keyed by lever id */
  alloc: Record<string, boolean>;
  start: Record<string, number | null>;
  owner: Record<string, OwnerId | null>;
  trigger: Record<string, string>;
  postponed: string;
  pickup: string;
  seqResult: { holds: number; total: number } | null;
  seqClue: boolean;
  /** Block 3.6 */
  decision: DecisionId | null;
  decisionFlagged: boolean;
  decisionClue: boolean;
  assumptions: string[];
  tripKpi: KpiId | null;
  tripThreshold: string;
  tripMonth: number | null;
  tripAction: "" | "scale" | "adjust" | "stop";
  tripFlags: string[];
  tripClue: Record<string, boolean>;
  challenge: string;
  checks: number;
};

export type Persisted = {
  participant: { name: string };
  ui: { bannerDismissed: Record<string, boolean>; sectionsRead: Record<string, boolean> };
  l1: L1State;
  r2: R2State;
};

type Session = {
  mentorUnlocked: boolean;
  /** Bumped by a reset or a mentor fill so components holding local state remount clean. */
  resetCount: number;
};

type Patch<T> = Partial<T> | ((s: T) => Partial<T>);

type Actions = {
  setParticipant: (patch: Partial<Persisted["participant"]>) => void;
  dismissBanner: (routeKey: string) => void;
  toggleRead: (cardId: string, value?: boolean) => void;

  patchL1: (p: Patch<L1State>) => void;
  patchR2: (p: Patch<R2State>) => void;

  // placement exercises with undo and redo
  placeReason: (id: ReasonId, tag: ReasonTag | null) => void;
  undoSort: () => void;
  redoSort: () => void;
  placeTag: (id: NoteId, barrier: BarrierId | null) => void;
  undoTags: () => void;
  redoTags: () => void;

  setMentorUnlocked: (v: boolean) => void;
  mentorFill: () => void;
  resetRoute: (route: RouteNo | null) => void;
};

const emptySort = (): SortMap => Object.fromEntries(REASON_IDS.map((id) => [id, null])) as SortMap;
const emptyTags = (): TagMap => Object.fromEntries(NOTE_IDS.map((id) => [id, null])) as TagMap;

export const emptyL1 = (): L1State => ({
  sort: emptySort(),
  sortHistory: [],
  sortFuture: [],
  sortChecks: 0,
  sortResult: null,
  sortClue: false,
  sortReasoning: false,
  extraReason: "",
  felt: { F1: "", F2: "", F3: "" },
  feltFlagged: [],
  feltClue: {},
  parts: {},
  partFlags: [],
  role: "",
  roleFlagged: false,
  roleClue: false,
  hyp: Array.from({ length: HYP_COUNT }, () => ({ mech: null, text: "" })),
  hypFlagged: [],
  hypChecked: false,
  hypClue: false,
  reflect: { assume: "", emotional: "", manager: "" },
  tags: emptyTags(),
  tagHistory: [],
  tagFuture: [],
  tagChecks: 0,
  tagResult: null,
  tagClue: false,
  tagReasoning: false,
  patterns: Array.from({ length: 4 }, () => ({ barrier: null, behaviour: "", strength: null })),
  patResult: null,
  patClue: false,
  info: [],
  infoText: "",
  infoResult: null,
  chosen: [],
  aims: {},
  inf: {},
  fea: {},
  spd: {},
  measureFlags: [],
  measureClue: {},
  order: [],
  why: "",
  checks: 0,
});

export const emptyR2 = (): R2State => ({
  factors: [],
  factorText: {},
  factorFlagged: false,
  factorClue: false,
  model: Object.fromEntries(PHASE_IDS.map((id) => [id, { question: null, factor: null, signal: null, move: "" }])) as R2State["model"],
  modelResult: null,
  modelClue: false,
  levers: [],
  rate: {},
  rateFlags: [],
  rateClue: {},
  leverResult: null,
  greatest: null,
  greatestWhy: "",
  risks: [],
  riskLik: {},
  riskImp: {},
  riskSignal: {},
  riskResponse: {},
  riskFlags: [],
  riskClue: {},
  riskResult: null,
  alloc: {},
  start: {},
  owner: {},
  trigger: {},
  postponed: "",
  pickup: "",
  seqResult: null,
  seqClue: false,
  decision: null,
  decisionFlagged: false,
  decisionClue: false,
  assumptions: ["", "", ""],
  tripKpi: null,
  tripThreshold: "",
  tripMonth: null,
  tripAction: "",
  tripFlags: [],
  tripClue: {},
  challenge: "",
  checks: 0,
});

const emptyPersisted = (): Persisted => ({
  participant: { name: "" },
  ui: { bannerDismissed: {}, sectionsRead: {} },
  l1: emptyL1(),
  r2: emptyR2(),
});

const pushCapped = <T,>(list: T[], item: T) => [...list, item].slice(-HISTORY_CAP);
const resolve = <T,>(p: Patch<T>, s: T): Partial<T> => (typeof p === "function" ? (p as (x: T) => Partial<T>)(s) : p);

const isPlain = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

/**
 * A deep merge of a saved value onto the defaults: every field an older or partial blob lacks comes from the defaults, a value of the
 * wrong type is dropped, and an empty default array or object takes what was saved (a history, a list of chosen ids).
 */
export function mergeDefaults<T>(base: T, saved: unknown): T {
  if (saved === undefined || saved === null) return base;
  if (Array.isArray(base)) {
    if (!Array.isArray(saved)) return base;
    if (base.length === 0) return saved as T;
    return base.map((b, i) => mergeDefaults(b, saved[i])) as T;
  }
  if (isPlain(base)) {
    if (!isPlain(saved)) return base;
    const keys = Object.keys(base);
    // an empty default object is a free-form map (parts, ratings): keep every saved key
    if (keys.length === 0) return { ...saved } as T;
    const out: Record<string, unknown> = { ...(saved as Record<string, unknown>) };
    for (const k of keys) out[k] = mergeDefaults((base as Record<string, unknown>)[k], (saved as Record<string, unknown>)[k]);
    return out as T;
  }
  return typeof saved === typeof base || base === null ? (saved as T) : base;
}

export const useStore = create<Persisted & Session & Actions>()(
  persist(
    (set) => ({
      ...emptyPersisted(),
      mentorUnlocked: false,
      resetCount: 0,

      setParticipant: (patch) => set((s) => ({ participant: { ...s.participant, ...patch } })),
      dismissBanner: (routeKey) => set((s) => ({ ui: { ...s.ui, bannerDismissed: { ...s.ui.bannerDismissed, [routeKey]: true } } })),
      toggleRead: (cardId, value) =>
        set((s) => ({ ui: { ...s.ui, sectionsRead: { ...s.ui.sectionsRead, [cardId]: value ?? !s.ui.sectionsRead[cardId] } } })),

      patchL1: (p) => set((s) => ({ l1: { ...s.l1, ...resolve(p, s.l1) } })),
      patchR2: (p) => set((s) => ({ r2: { ...s.r2, ...resolve(p, s.r2) } })),

      // --- Block 1.1: sort the debrief statements ------------------------------
      placeReason: (id, tag) =>
        set((s) => {
          const before = s.l1.sort;
          if (before[id] === tag) return {};
          return { l1: { ...s.l1, sort: { ...before, [id]: tag }, sortHistory: pushCapped(s.l1.sortHistory, before), sortFuture: [], sortResult: null } };
        }),
      undoSort: () =>
        set((s) => {
          const prev = s.l1.sortHistory[s.l1.sortHistory.length - 1];
          if (!prev) return {};
          return { l1: { ...s.l1, sort: prev, sortHistory: s.l1.sortHistory.slice(0, -1), sortFuture: pushCapped(s.l1.sortFuture, s.l1.sort), sortResult: null } };
        }),
      redoSort: () =>
        set((s) => {
          const next = s.l1.sortFuture[s.l1.sortFuture.length - 1];
          if (!next) return {};
          return { l1: { ...s.l1, sort: next, sortHistory: pushCapped(s.l1.sortHistory, s.l1.sort), sortFuture: s.l1.sortFuture.slice(0, -1), sortResult: null } };
        }),

      // --- Block 2.1: tag the exit notes -----------------------------------------
      placeTag: (id, barrier) =>
        set((s) => {
          const before = s.l1.tags;
          if (before[id] === barrier) return {};
          return {
            l1: {
              ...s.l1,
              tags: { ...before, [id]: barrier },
              tagHistory: pushCapped(s.l1.tagHistory, before),
              tagFuture: [],
              tagResult: null,
              // the patterns and their ratings are read off these tags, so a changed tag clears their last check
              patResult: null,
            },
          };
        }),
      undoTags: () =>
        set((s) => {
          const prev = s.l1.tagHistory[s.l1.tagHistory.length - 1];
          if (!prev) return {};
          return { l1: { ...s.l1, tags: prev, tagHistory: s.l1.tagHistory.slice(0, -1), tagFuture: pushCapped(s.l1.tagFuture, s.l1.tags), tagResult: null, patResult: null } };
        }),
      redoTags: () =>
        set((s) => {
          const next = s.l1.tagFuture[s.l1.tagFuture.length - 1];
          if (!next) return {};
          return { l1: { ...s.l1, tags: next, tagHistory: pushCapped(s.l1.tagHistory, s.l1.tags), tagFuture: s.l1.tagFuture.slice(0, -1), tagResult: null, patResult: null } };
        }),

      setMentorUnlocked: (v) => set({ mentorUnlocked: v }),

      // Mentor autofill: every model answer in Routes 1 and 2, plus the participant name if it is empty, so each document can be exported straight away.
      mentorFill: () =>
        set((s) => {
          const l1 = emptyL1();
          l1.sort = { ...KEY_L1.sort };
          l1.extraReason = KEY_L1.extraReason;
          l1.felt = { ...KEY_L1.felt };
          l1.parts = modelParts(FIGURE_BUILDERS);
          l1.role = KEY_L1.role;
          l1.hyp = KEY_L1.hyp.map((h) => ({ ...h }));
          l1.reflect = { ...KEY_L1.reflect };
          l1.tags = { ...KEY_L1.tags };
          l1.patterns = KEY_L1.patterns.map((p) => ({ ...p }));
          l1.info = [...KEY_L1.info];
          l1.infoText = KEY_L1.infoText;
          l1.chosen = [...KEY_L1.chosen];
          l1.aims = Object.fromEntries(Object.entries(KEY_L1.aims).map(([k, v]) => [k, [...v]]));
          l1.inf = { ...KEY_L1.inf } as Record<string, Score>;
          l1.fea = { ...KEY_L1.fea } as Record<string, Score>;
          l1.spd = { ...KEY_L1.spd } as Record<string, Score>;
          l1.order = [...KEY_L1.order];
          l1.why = KEY_L1.why;

          const r2 = emptyR2();
          r2.factors = [...KEY_R2.factors];
          r2.factorText = { ...KEY_R2.factorText };
          r2.model = Object.fromEntries(PHASE_IDS.map((id) => [id, { ...KEY_R2.model[id] }])) as R2State["model"];
          r2.levers = [...KEY_R2.levers];
          r2.rate = { ...KEY_R2.rate } as Record<string, Score>;
          r2.greatest = KEY_R2.greatest;
          r2.greatestWhy = KEY_R2.greatestWhy;
          r2.risks = [...KEY_R2.risks];
          r2.riskLik = { ...KEY_R2.riskLik } as Record<string, Score>;
          r2.riskImp = { ...KEY_R2.riskImp } as Record<string, Score>;
          r2.riskSignal = { ...KEY_R2.riskSignal };
          r2.riskResponse = { ...KEY_R2.riskResponse };
          r2.alloc = Object.fromEntries(KEY_R2.arch.map((id) => [id, true]));
          r2.start = { ...KEY_R2.start };
          r2.owner = { ...KEY_R2.owner };
          r2.trigger = { ...KEY_R2.trigger };
          r2.postponed = KEY_R2.postponed;
          r2.pickup = KEY_R2.pickup;
          r2.decision = KEY_R2.decision;
          r2.assumptions = [...KEY_R2.assumptions];
          r2.tripKpi = KEY_R2.tripKpi;
          r2.tripThreshold = KEY_R2.tripThreshold;
          r2.tripMonth = KEY_R2.tripMonth;
          r2.tripAction = KEY_R2.tripAction;
          r2.challenge = KEY_R2.challenge;

          const participant = { name: s.participant.name.trim() ? s.participant.name : "Mentor Check" };
          return { participant, l1, r2, resetCount: s.resetCount + 1 };
        }),

      // One route's state (the participant strip and the other route stay).
      resetRoute: (route) =>
        set((s) => {
          const prefix = route === 1 ? "A" : route === 2 ? "B" : "";
          const keep = (k: string) => (route === null ? false : !k.startsWith(prefix));
          const sectionsRead = Object.fromEntries(Object.entries(s.ui.sectionsRead).filter(([k]) => keep(k)));
          const bannerDismissed = { ...s.ui.bannerDismissed };
          if (route === null) for (const k of Object.keys(bannerDismissed)) delete bannerDismissed[k];
          else delete bannerDismissed[`r${route}`];
          return {
            l1: route === null || route === 1 ? emptyL1() : s.l1,
            r2: route === null || route === 2 ? emptyR2() : s.r2,
            ui: { bannerDismissed, sectionsRead },
            resetCount: s.resetCount + 1,
          };
        }),
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      // Session-only flags (mentor unlock, reset counter) never persist.
      partialize: (s) => ({ participant: s.participant, ui: s.ui, l1: s.l1, r2: s.r2 }),
      // Any change to the persisted shape bumps `version` and adds a step here; `merge` below then fills every field an older
      // blob lacks from the defaults. Version 1 is the first shape of Day 3 (there is nothing older to migrate).
      migrate: (persisted) => (persisted ?? {}) as Persisted,
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<Persisted>;
        const base = emptyPersisted();
        const merged = mergeDefaults(base, p);
        return { ...current, ...merged };
      },
    },
  ),
);

/**
 * The store is created with `skipHydration`, so the server render and the first client paint both see the
 * defaults (no hydration mismatch). <StoreHydrator/> reads localStorage once after mount. This hook reports
 * when it has finished, for UI that must not flash a default (a dismissed banner, a read mark).
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const unsub = useStore.persist.onFinishHydration(() => setHydrated(true));
    if (useStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);
  return hydrated;
}

export function rehydrateStore() {
  return useStore.persist.rehydrate();
}
