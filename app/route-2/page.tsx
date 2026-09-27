import { SectionRail } from "@/components/chrome/SectionRail";
import { PageNav } from "@/components/chrome/PageNav";
import { HashFlash } from "@/components/chrome/HashFlash";
import { SuggestedOrderBanner } from "@/components/ui/Banner";
import { MateriB } from "@/components/materi/Materi";
import { Task2 } from "@/components/task2/Task2";
import { ResetRoute } from "@/components/ui/ResetRoute";

export const metadata = { title: "Route 2 · Management decision — Retention Lab · Day 3" };

export default function Route2() {
  return (
    <div className="space-y-8 pt-4">
      <HashFlash />
      <header className="space-y-3">
        <div className="space-y-1">
          <p className="smallcaps text-accent">Route 2 · Level 3 · Management decision</p>
          <h1>Decide how customers decide, before you know how they will react</h1>
        </div>
        <blockquote className="max-w-prose space-y-2 border-l-4 border-gold bg-accentSoft px-4 py-3 text-body text-ink">
          <p>
            Route 1 read one buyer and twelve stalled deals. Level 3 asks a different question: what system makes the safe choice the easy one for every buyer, and what do you decide today although nobody can say how customers will react?
          </p>
        </blockquote>
      </header>
      <SuggestedOrderBanner routeKey="r2" text="Route 1 first is recommended, because the situation quotes the patterns and measures you named there. Every section stays open, so you can work through this route regardless." />
      <SectionRail route={2} />
      <PageNav route={2} />
      <MateriB />
      <Task2 />
      <ResetRoute route={2} />
    </div>
  );
}
