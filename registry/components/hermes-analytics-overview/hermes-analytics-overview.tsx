"use client";

import { Activity, Coins, MessagesSquare, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useHermesAnalytics } from "@/hooks/use-hermes";

function Metric({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Activity }) {
  return <div className="rounded-md border p-3"><div className="flex items-center justify-between gap-3"><p className="text-xs text-muted-foreground">{label}</p><Icon className="size-4 text-muted-foreground" /></div><p className="mt-2 text-xl font-semibold tracking-tight">{value}</p></div>;
}

export function HermesAnalyticsOverview({ days = 30, profile }: { days?: number; profile?: string }) {
  const query = useHermesAnalytics(days, profile);
  return <Card><CardHeader><CardTitle className="text-base">Analytics</CardTitle><p className="mt-1 text-sm text-muted-foreground">Usage over the last {days} days.</p></CardHeader><CardContent>{query.isPending ? <Skeleton className="h-52 w-full" /> : query.error || !query.data ? <p className="text-sm text-destructive">Unable to load analytics.</p> : <div className="space-y-5"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Sessions" value={query.data.totals.total_sessions.toLocaleString()} icon={MessagesSquare} /><Metric label="Estimated cost" value={`$${query.data.totals.total_estimated_cost.toFixed(2)}`} icon={Coins} /><Metric label="API calls" value={(query.data.totals.total_api_calls ?? 0).toLocaleString()} icon={Activity} /><Metric label="Skill actions" value={query.data.skills.summary.total_skill_actions.toLocaleString()} icon={Wrench} /></div><div className="grid gap-5 lg:grid-cols-2"><section><p className="mb-2 text-sm font-medium">Top models</p><div className="space-y-2">{query.data.by_model.slice(0, 5).map((model) => <div key={model.model} className="flex items-center justify-between gap-3 text-sm"><span className="truncate">{model.model}</span><Badge variant="outline">{model.sessions} sessions</Badge></div>)}</div></section><section><p className="mb-2 text-sm font-medium">Top skills</p><div className="space-y-2">{query.data.skills.top_skills.slice(0, 5).map((skill) => <div key={skill.skill} className="flex items-center justify-between gap-3 text-sm"><span className="truncate">{skill.skill}</span><Badge variant="outline">{skill.total_count}</Badge></div>)}</div></section></div></div>}</CardContent></Card>;
}
