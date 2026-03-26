import Link from "next/link";
import Image from "next/image";
import { gemsApi } from "@/lib/api";
import { Scissors, Plus, ArrowRight, Clock, Weight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddSessionButton } from "@/components/gems/workbench-add-session";
import type { GemSummaryDto } from "@/lib/types";

const STAGES = ["Rough", "Preforming", "Pavilion", "Crown", "Polishing", "Complete"] as const;
type Stage = typeof STAGES[number];

const STAGE_COLORS: Record<Stage, string> = {
  Rough: "bg-stone-100 text-stone-700",
  Preforming: "bg-blue-100 text-blue-700",
  Pavilion: "bg-violet-100 text-violet-700",
  Crown: "bg-indigo-100 text-indigo-700",
  Polishing: "bg-amber-100 text-amber-700",
  Complete: "bg-green-100 text-green-700",
};

export default async function WorkbenchPage() {
  const [rough, cutting] = await Promise.all([
    gemsApi.list({ gemStatus: "Rough", pageSize: 100 }),
    gemsApi.list({ gemStatus: "Cutting", pageSize: 100 }),
  ]);

  const gems = [...rough.items, ...cutting.items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const totalHours = gems.reduce((sum, g) => sum + (g.totalCuttingHours ?? 0), 0);
  const gemsWithYield = gems.filter(
    (g) => g.roughWeightCarats != null && g.weightCarats != null && g.roughWeightCarats > 0
  );
  const avgYield =
    gemsWithYield.length > 0
      ? gemsWithYield.reduce(
          (sum, g) => sum + ((g.weightCarats! / g.roughWeightCarats!) * 100),
          0
        ) / gemsWithYield.length
      : null;

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight flex items-center gap-2">
            <Scissors size={18} className="text-zinc-400" />
            Workbench
          </h1>
          <p className="mt-0.5 text-sm text-zinc-500">All rough and in-progress stones</p>
        </div>
        <Button asChild variant="violet" size="sm">
          <Link href="/dashboard/gems/new">
            <Plus size={14} />
            Add rough stone
          </Link>
        </Button>
      </div>

      {/* Stats row */}
      {gems.length > 0 && (
        <div className="flex flex-wrap gap-4">
          <StatPill label="In progress" value={String(gems.length)} />
          {totalHours > 0 && (
            <StatPill
              label="Total hours"
              value={totalHours % 1 === 0 ? String(totalHours) : totalHours.toFixed(1)}
            />
          )}
          {avgYield != null && (
            <StatPill label="Avg yield" value={`${avgYield.toFixed(1)}%`} />
          )}
        </div>
      )}

      {/* Empty state */}
      {gems.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50 py-16 gap-3 text-center">
          <Scissors size={32} className="text-zinc-300" />
          <p className="text-sm font-medium text-zinc-500">No rough or in-progress stones</p>
          <p className="text-xs text-zinc-400 max-w-xs">
            Add a gem with status <span className="font-medium text-zinc-500">Rough</span> or{" "}
            <span className="font-medium text-zinc-500">Cutting</span> to start tracking your cutting work.
          </p>
          <Button asChild variant="violet" size="sm" className="mt-2">
            <Link href="/dashboard/gems/new">
              <Plus size={14} />
              Add rough stone
            </Link>
          </Button>
        </div>
      )}

      {/* Workbench grid */}
      {gems.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gems.map((gem) => (
            <WorkbenchCard key={gem.id} gem={gem} />
          ))}
        </div>
      )}
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col rounded-lg border border-zinc-200 bg-white px-4 py-2.5 min-w-[90px]">
      <span className="text-[10px] font-medium uppercase tracking-wide text-zinc-400">{label}</span>
      <span className="text-lg font-bold text-zinc-900 leading-tight">{value}</span>
    </div>
  );
}

function WorkbenchCard({ gem }: { gem: GemSummaryDto }) {
  const stage = gem.currentCuttingStage as Stage | null;
  const stageIdx = stage ? STAGES.indexOf(stage) : -1;
  const stageColor = stage ? (STAGE_COLORS[stage] ?? "bg-zinc-100 text-zinc-600") : null;

  const hasRough = gem.roughWeightCarats != null;
  const hasFinal = gem.weightCarats != null && gem.weightCarats > 0;
  const yield_ =
    hasRough && hasFinal && gem.roughWeightCarats! > 0
      ? ((gem.weightCarats! / gem.roughWeightCarats!) * 100).toFixed(1)
      : null;

  return (
    <div className="flex flex-col rounded-xl border border-zinc-200 bg-white overflow-hidden hover:shadow-sm transition-shadow">
      {/* Top: photo + name */}
      <div className="flex items-start gap-3 p-4 pb-3">
        <div className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden bg-zinc-100">
          {gem.coverPhotoUrl ? (
            <Image src={gem.coverPhotoUrl} alt={gem.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Scissors size={20} className="text-zinc-300" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-zinc-900 truncate">{gem.name}</p>
          {(gem.species || gem.variety) && (
            <p className="text-xs text-zinc-400 truncate">
              {[gem.species, gem.variety].filter(Boolean).join(" — ")}
            </p>
          )}
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <span className="rounded-full bg-stone-100 text-stone-600 px-1.5 py-0.5 text-[10px] font-medium">
              {gem.status}
            </span>
            {stage && stageColor && (
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${stageColor}`}>
                {stage}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stage progress bar */}
      <div className="px-4 pb-3">
        <div className="flex gap-0.5">
          {STAGES.map((s, i) => (
            <div
              key={s}
              title={s}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= stageIdx ? "bg-violet-500" : "bg-zinc-100"
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[9px] text-zinc-400">Rough</span>
          <span className="text-[9px] text-zinc-400">Complete</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 px-4 pb-3 text-xs text-zinc-500 flex-wrap">
        {hasRough && (
          <span className="flex items-center gap-1">
            <Weight size={11} className="text-zinc-400" />
            {gem.roughWeightCarats} ct rough
            {hasFinal && (
              <span className="text-zinc-400">→ {gem.weightCarats} ct</span>
            )}
          </span>
        )}
        {yield_ && (
          <span className={`font-medium ${Number(yield_) >= 50 ? "text-green-600" : "text-amber-600"}`}>
            {yield_}% yield
          </span>
        )}
        {gem.totalCuttingHours != null && gem.totalCuttingHours > 0 && (
          <span className="flex items-center gap-1">
            <Clock size={11} className="text-zinc-400" />
            {gem.totalCuttingHours % 1 === 0
              ? gem.totalCuttingHours
              : gem.totalCuttingHours.toFixed(1)} hrs
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-zinc-100 bg-zinc-50/50">
        <AddSessionButton gemId={gem.id} />
        <Link
          href={`/dashboard/gems/${gem.id}`}
          className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 transition-colors ml-auto"
        >
          View
          <ArrowRight size={11} />
        </Link>
      </div>
    </div>
  );
}
