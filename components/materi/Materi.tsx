"use client";

import { CARDS_A } from "@/components/materi/CardsA";
import { CARDS_B } from "@/components/materi/CardsB";
import { ReferencesAccordion } from "@/components/ui/ReferencesAccordion";
import { SECTIONS } from "@/data/materialIndex";
import type { RefKey } from "@/data/references";

/** The material block of a route: one continuous run of study cards, then the block's own reference list. */

const REFS_A: RefKey[] = ["dick1994", "oliver1999", "gustafsson2005", "morgan1994", "mayer1995", "kahneman2011", "zajonc1980", "webster1972", "bauer1960", "kahneman1979", "tversky1992", "cialdini2021", "gouldner1960", "samuelson1988", "gartner2017", "iyengar2000", "nisbett1977", "brehm1966", "uwg5", "thaler2008"];
const REFS_B: RefKey[] = ["thaler2008", "meadows1999", "kahneman2011", "webster1972", "cialdini2021", "knight1921", "klein2007", "loomes1982", "kahneman1979", "nisbett1977", "brehm1966", "uwg5", "kaplan1992", "doran1981", "deming1986"];

function Block({ id, title, intro, children }: { id: string; title: string; intro: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="space-y-4">
      <header className="space-y-1">
        <p className="smallcaps text-accent">{title}</p>
        <h2 id={`${id}-h`}>{intro}</h2>
      </header>
      {children}
    </section>
  );
}

export function MateriA() {
  const s = SECTIONS[1][0];
  return (
    <Block id={s.id} title={`Materi A · ${s.minutes} minutes, facilitator-led`} intro="The psychology of the buyer: what creates loyalty, how a decision is made, and how to read and answer a stall">
      <p className="max-w-prose text-body text-ash">
        Seven cards, Level 1 and Level 2 in one run: knowledge first (loyalty, rational and emotional decisions, four principles, the buying process), then application (reading behaviour, rating a barrier, choosing a measure). Every diagram uses another company, so the task is never answered for you.
      </p>
      {CARDS_A.map((C, i) => (
        <C key={i} />
      ))}
      <ReferencesAccordion block="A" keys={REFS_A} note="Check every source before you teach from it: page numbers and editions differ between printings." />
    </Block>
  );
}

export function MateriB() {
  const s = SECTIONS[2][0];
  return (
    <Block id={s.id} title={`Materi B · ${s.minutes} minutes, facilitator-led`} intro="Managing decisions as a system: levers, decisions under uncertainty, the risk of being wrong, and the architecture that carries it">
      <p className="max-w-prose text-body text-ash">
        Five cards for Level 3. You stop reading one buyer and start designing conditions for every buyer. Each card ends in rules the task uses; each diagram uses Elbtal Systems, another vendor.
      </p>
      {CARDS_B.map((C, i) => (
        <C key={i} />
      ))}
      <ReferencesAccordion block="B" keys={REFS_B} note="Check every source before you teach from it: page numbers and editions differ between printings." />
    </Block>
  );
}
