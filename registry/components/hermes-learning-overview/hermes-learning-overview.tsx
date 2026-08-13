"use client";

import { Brain, Pause, Play, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useHermesCuratorAction, useHermesLearning } from "@/hooks/use-hermes";

export function HermesLearningOverview({ profile }: { profile?: string }) {
  const query = useHermesLearning(profile);
  const action = useHermesCuratorAction();
  const data = query.data;
  return <Card><CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between"><div><CardTitle className="flex items-center gap-2 text-base"><Brain className="size-4" />Learning & Curator</CardTitle><p className="mt-1 text-sm text-muted-foreground">Native Hermes starmap and curator lifecycle.</p></div>{data ? <div className="flex gap-2"><Button size="sm" variant="outline" disabled={action.isPending} onClick={() => action.mutate("run")}><Sparkles className="mr-2 size-4" />Run</Button><Button size="sm" variant="outline" disabled={action.isPending} onClick={() => action.mutate(data.curator.paused ? "resume" : "pause")}>{data.curator.paused ? <Play className="mr-2 size-4" /> : <Pause className="mr-2 size-4" />}{data.curator.paused ? "Resume" : "Pause"}</Button></div> : null}</CardHeader><CardContent>{query.isPending ? <Skeleton className="h-48 w-full" /> : query.error || !data ? <p className="text-sm text-destructive">Unable to load learning data.</p> : <div className="space-y-5"><div className="flex flex-wrap gap-2"><Badge>{data.graph.nodes.length} nodes</Badge><Badge variant="outline">{data.graph.edges.length} edges</Badge><Badge variant="outline">{data.graph.memory.length} memories</Badge><Badge variant={data.curator.paused ? "secondary" : "outline"}>{data.curator.paused ? "curator paused" : "curator active"}</Badge></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{data.graph.clusters.slice(0, 9).map((cluster) => <div key={cluster.category} className="rounded-md border p-3"><p className="text-sm font-medium">{cluster.category}</p><p className="mt-1 text-xs text-muted-foreground">{cluster.count} nodes</p></div>)}</div><p className="text-xs text-muted-foreground">Last curator run: {data.curator.last_run_at ?? "never"}</p></div>}</CardContent></Card>;
}
