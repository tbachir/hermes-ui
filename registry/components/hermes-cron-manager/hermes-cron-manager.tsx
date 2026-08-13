"use client";

import { useState } from "react";
import { Pause, Play, Plus, RotateCw, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useCreateHermesCron, useHermesCron, useHermesCronAction, useRemoveHermesCron } from "@/hooks/use-hermes";

function CreateCron({ profile }: { profile?: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [schedule, setSchedule] = useState("");
  const [prompt, setPrompt] = useState("");
  const create = useCreateHermesCron();
  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild><Button size="sm"><Plus className="mr-2 size-4" />New job</Button></DialogTrigger>
    <DialogContent><DialogHeader><DialogTitle>Create Hermes cron job</DialogTitle></DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2"><Label htmlFor="cron-name">Name</Label><Input id="cron-name" value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div className="space-y-2"><Label htmlFor="cron-schedule">Schedule</Label><Input id="cron-schedule" value={schedule} onChange={(e) => setSchedule(e.target.value)} placeholder="0 8 * * *" /></div>
        <div className="space-y-2"><Label htmlFor="cron-prompt">Prompt</Label><Textarea id="cron-prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Summarize overnight changes" /></div>
      </div>
      <DialogFooter><Button disabled={!schedule.trim() || create.isPending} onClick={() => create.mutate({ name: name.trim(), schedule: schedule.trim(), prompt: prompt.trim(), ...(profile ? { profile } : {}) }, { onSuccess: () => setOpen(false) })}>Create</Button></DialogFooter>
    </DialogContent>
  </Dialog>;
}

export function HermesCronManager({ profile }: { profile?: string }) {
  const query = useHermesCron(profile);
  const action = useHermesCronAction();
  const remove = useRemoveHermesCron();
  return <Card>
    <CardHeader className="flex flex-row items-start justify-between gap-4"><div><CardTitle className="text-base">Cron & automations</CardTitle><p className="mt-1 text-sm text-muted-foreground">Native Hermes scheduled jobs.</p></div><CreateCron {...(profile ? { profile } : {})} /></CardHeader>
    <CardContent>{query.isPending ? <Skeleton className="h-48 w-full" /> : query.error ? <p className="text-sm text-destructive">Unable to load cron jobs.</p> : <div className="divide-y rounded-md border">
      {query.data?.jobs.map((job) => <div key={job.id} className="flex items-center gap-3 p-3"><div className="min-w-0 flex-1"><div className="flex flex-wrap gap-2"><p className="font-medium">{job.name || job.id}</p><Badge variant={job.enabled ? "secondary" : "outline"}>{job.enabled ? "enabled" : "paused"}</Badge>{job.state ? <Badge variant="outline">{job.state}</Badge> : null}</div><p className="mt-1 text-xs text-muted-foreground">{job.schedule_display ?? job.schedule?.display ?? job.schedule?.expr ?? "No schedule display"}{job.next_run_at ? ` · next ${job.next_run_at}` : ""}</p></div>
        <Button size="icon" variant="ghost" aria-label="Trigger job" onClick={() => action.mutate({ action: "trigger", id: job.id, ...(profile ? { profile } : {}) })}><RotateCw className="size-4" /></Button>
        <Button size="icon" variant="ghost" aria-label={job.enabled ? "Pause job" : "Resume job"} onClick={() => action.mutate({ action: job.enabled ? "pause" : "resume", id: job.id, ...(profile ? { profile } : {}) })}>{job.enabled ? <Pause className="size-4" /> : <Play className="size-4" />}</Button>
        <Button size="icon" variant="ghost" aria-label="Delete job" onClick={() => remove.mutate({ id: job.id, ...(profile ? { profile } : {}) })}><Trash2 className="size-4" /></Button>
      </div>)}
      {query.data?.jobs.length === 0 ? <p className="p-6 text-center text-sm text-muted-foreground">No scheduled jobs.</p> : null}
    </div>}</CardContent>
  </Card>;
}
