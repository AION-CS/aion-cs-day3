import { SectionRail } from "@/components/chrome/SectionRail";
import { PageNav } from "@/components/chrome/PageNav";
import { HashFlash } from "@/components/chrome/HashFlash";
import { SuggestedOrderBanner } from "@/components/ui/Banner";
import { MateriA } from "@/components/materi/Materi";
import { Task1 } from "@/components/task1/Task1";
import { ResetRoute } from "@/components/ui/ResetRoute";

export const metadata = { title: "Route 1 · Understand and apply — Retention Lab · Day 3" };

export default function Route1() {
  return (
    <div className="space-y-8 pt-4">
      <HashFlash />
      <header className="space-y-1">
        <p className="smallcaps text-accent">Route 1 · Levels 1 and 2 · Knowledge and application</p>
        <h1>Why buyers stall, and what to do about it</h1>
      </header>
      <SuggestedOrderBanner routeKey="r1" text="Materi A → the Behaviour Analysis task, one case in two parts (Understand the decision, Analyse and act). Every section stays open, so you can start anywhere." />
      <SectionRail route={1} />
      <PageNav route={1} />
      <MateriA />
      <Task1 />
      <ResetRoute route={1} />
    </div>
  );
}
