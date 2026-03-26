"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Scissors, Plus, Trash2, ChevronDown, ChevronUp, Pencil, X, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addCuttingSession, updateCuttingSession, deleteCuttingSession } from "@/lib/cutting-session-actions";
import type { GemDto, CuttingSessionDto } from "@/lib/types";

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

interface Props {
  gem: GemDto;
}

function today() {
  return new Date().toISOString().split("T")[0];
}

export function CuttingJournalCard({ gem }: Props) {
  const router = useRouter();
  const sessions = gem.cuttingSessions ?? [];
  const [adding, setAdding] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [sessionDate, setSessionDate] = useState(today());
  const [stage, setStage] = useState<Stage>("Preforming");
  const [hours, setHours] = useState("");
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const totalHours = sessions.reduce((sum, s) => sum + (s.hoursSpent ?? 0), 0);
  const latestStage = sessions.length > 0 ? (sessions[0].stage as Stage) : null;

  const stageOrder = STAGES.indexOf.bind(STAGES);
  const latestIdx = latestStage ? stageOrder(latestStage) : -1;

  function handleAdd() {
    startTransition(async () => {
      setFormError(null);
      const result = await addCuttingSession(
        gem.id,
        sessionDate,
        stage,
        hours ? Number(hours) : null,
        notes || null
      );
      if (result.error) {
        setFormError(result.error);
      } else {
        setAdding(false);
        setSessionDate(today());
        setStage("Preforming");
        setHours("");
        setNotes("");
        router.refresh();
      }
    });
  }

  function handleDelete(id: string) {
    setDeletingId(id);
    startTransition(async () => {
      await deleteCuttingSession(id);
      setDeletingId(null);
      router.refresh();
    });
  }

  return (
    <Card hoverable>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-semibold text-zinc-500 uppercase tracking-wide flex items-center gap-1.5">
              <Scissors size={13} />
              Cutting Journal
            </CardTitle>
            {totalHours > 0 && (
              <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
                {totalHours % 1 === 0 ? totalHours : totalHours.toFixed(2)} hrs total
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {!adding && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-zinc-400 hover:text-zinc-700"
                onClick={() => { setAdding(true); setExpanded(true); }}
              >
                <Plus size={12} className="mr-1" />
                Add
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-zinc-400 hover:text-zinc-700"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </Button>
          </div>
        </div>

        {/* Stage progress strip */}
        <div className="flex gap-1 mt-2 flex-wrap">
          {STAGES.map((s, i) => {
            const isDone = i < latestIdx;
            const isCurrent = i === latestIdx;
            return (
              <span
                key={s}
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors ${
                  isCurrent
                    ? "bg-violet-600 text-white"
                    : isDone
                    ? "bg-green-100 text-green-700"
                    : "bg-zinc-100 text-zinc-400"
                }`}
              >
                {s}
              </span>
            );
          })}
        </div>
      </CardHeader>

      {expanded && (
        <CardContent>
          {/* Add session form */}
          {adding && (
            <div className="mb-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3 flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="csDate" className="text-xs text-zinc-500">Date</Label>
                  <Input
                    id="csDate"
                    type="date"
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="csStage" className="text-xs text-zinc-500">Stage</Label>
                  <select
                    id="csStage"
                    value={stage}
                    onChange={(e) => setStage(e.target.value as Stage)}
                    className="flex h-8 w-full rounded-md border border-input bg-transparent px-2 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/20 focus-visible:border-zinc-300"
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="csHours" className="text-xs text-zinc-500">Hours spent</Label>
                <Input
                  id="csHours"
                  type="number"
                  min="0.25"
                  step="0.25"
                  placeholder="e.g. 2.5"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="h-8 text-sm max-w-[120px]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="csNotes" className="text-xs text-zinc-500">Notes</Label>
                <textarea
                  id="csNotes"
                  rows={2}
                  placeholder="Lap used, angles tried, observations…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={2000}
                  className="flex w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/30 resize-none"
                />
              </div>
              {formError && <p className="text-xs text-red-600">{formError}</p>}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="violet"
                  className="h-7 px-3 text-xs"
                  onClick={handleAdd}
                  disabled={isPending || !sessionDate}
                >
                  {isPending ? "Saving…" : "Log session"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-3 text-xs"
                  onClick={() => { setAdding(false); setFormError(null); }}
                  disabled={isPending}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Session list */}
          {sessions.length === 0 ? (
            <p className="text-sm text-zinc-400">No sessions logged yet.</p>
          ) : (
            <div className="flex flex-col divide-y divide-zinc-100">
              {sessions.map((s) =>
                editingId === s.id ? (
                  <EditSessionRow
                    key={s.id}
                    session={s}
                    onSave={(date, stage, hours, notes) => {
                      startTransition(async () => {
                        const result = await updateCuttingSession(s.id, date, stage, hours, notes);
                        if (!result.error) {
                          setEditingId(null);
                          router.refresh();
                        }
                      });
                    }}
                    onCancel={() => setEditingId(null)}
                    saving={isPending}
                  />
                ) : (
                  <SessionRow
                    key={s.id}
                    session={s}
                    deleting={deletingId === s.id}
                    onDelete={() => handleDelete(s.id)}
                    onEdit={() => setEditingId(s.id)}
                  />
                )
              )}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

function SessionRow({
  session,
  deleting,
  onDelete,
  onEdit,
}: {
  session: CuttingSessionDto;
  deleting: boolean;
  onDelete: () => void;
  onEdit: () => void;
}) {
  const stageName = session.stage as Stage;
  const stageColor = STAGE_COLORS[stageName] ?? "bg-zinc-100 text-zinc-600";

  return (
    <div className="flex items-start gap-3 py-2.5 group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-zinc-400">
            {new Date(session.sessionDate).toLocaleDateString()}
          </span>
          <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${stageColor}`}>
            {session.stage}
          </span>
          {session.hoursSpent && (
            <span className="text-xs text-zinc-500 font-medium">{session.hoursSpent} hrs</span>
          )}
        </div>
        {session.notes && (
          <p className="mt-1 text-xs text-zinc-500 leading-relaxed line-clamp-2">{session.notes}</p>
        )}
      </div>
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onEdit}
          className="p-1 rounded text-zinc-300 hover:text-violet-500 hover:bg-violet-50"
          title="Edit session"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={onDelete}
          disabled={deleting}
          className="p-1 rounded text-zinc-300 hover:text-red-500 hover:bg-red-50 disabled:opacity-50"
          title="Delete session"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

function EditSessionRow({
  session,
  onSave,
  onCancel,
  saving,
}: {
  session: CuttingSessionDto;
  onSave: (date: string, stage: string, hours: number | null, notes: string | null) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [date, setDate] = useState(new Date(session.sessionDate).toISOString().split("T")[0]);
  const [stage, setStage] = useState<Stage>((session.stage as Stage) ?? "Preforming");
  const [hours, setHours] = useState(session.hoursSpent != null ? String(session.hoursSpent) : "");
  const [notes, setNotes] = useState(session.notes ?? "");

  return (
    <div className="py-2.5 flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="h-7 text-xs"
        />
        <select
          value={stage}
          onChange={(e) => setStage(e.target.value as Stage)}
          className="flex h-7 w-full rounded-md border border-input bg-transparent px-2 py-0.5 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/20"
        >
          {STAGES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <Input
        type="number"
        min="0.25"
        step="0.25"
        placeholder="Hours"
        value={hours}
        onChange={(e) => setHours(e.target.value)}
        className="h-7 text-xs max-w-[120px]"
      />
      <textarea
        rows={2}
        placeholder="Notes…"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        maxLength={2000}
        className="flex w-full rounded-md border border-input bg-white px-2 py-1.5 text-xs shadow-sm placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/30 resize-none"
      />
      <div className="flex gap-1.5">
        <button
          onClick={() => onSave(date, stage, hours ? Number(hours) : null, notes || null)}
          disabled={saving || !date}
          className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50"
        >
          <Check size={11} />
          Save
        </button>
        <button
          onClick={onCancel}
          disabled={saving}
          className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
        >
          <X size={11} />
          Cancel
        </button>
      </div>
    </div>
  );
}
