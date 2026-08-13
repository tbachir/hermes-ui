"use client";

import { Download, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useApplyHermesUpdate, useHermesUpdates } from "@/hooks/use-hermes";

export function HermesUpdateCard() {
  const query = useHermesUpdates();
  const apply = useApplyHermesUpdate();
  return <Card><CardHeader className="flex flex-row items-start justify-between gap-3"><div><CardTitle className="text-base">Hermes update</CardTitle><p className="mt-1 text-sm text-muted-foreground">Backend version and available upstream commits.</p></div>{query.data ? <Badge variant={query.data.update_available ? "default" : "secondary"}>{query.data.update_available ? `${query.data.behind ?? "?"} behind` : "up to date"}</Badge> : null}</CardHeader><CardContent>{query.isPending ? <Skeleton className="h-20 w-full" /> : query.error || !query.data ? <p className="text-sm text-destructive">Unable to check for updates.</p> : <div className="space-y-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-medium">{query.data.current_version}</p><p className="text-xs text-muted-foreground">{query.data.install_method}{query.data.message ? ` · ${query.data.message}` : ""}</p></div><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => void query.refetch()}><RefreshCw className="mr-2 size-4" />Check</Button>{query.data.update_available && query.data.can_apply ? <Button size="sm" disabled={apply.isPending} onClick={() => apply.mutate()}><Download className="mr-2 size-4" />Apply</Button> : null}</div></div>{query.data.commits?.length ? <div className="space-y-2 border-t pt-3">{query.data.commits.slice(0, 4).map((commit) => <div key={commit.sha} className="flex gap-3 text-xs"><code className="text-muted-foreground">{commit.sha.slice(0, 7)}</code><span className="line-clamp-1">{commit.summary}</span></div>)}</div> : null}</div>}</CardContent></Card>;
}
