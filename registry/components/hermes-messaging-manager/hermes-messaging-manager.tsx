"use client";

import { MessageCircle, PlugZap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useHermesMessaging, useHermesMessagingAction } from "@/hooks/use-hermes";

export function HermesMessagingManager({ profile }: { profile?: string }) {
  const query = useHermesMessaging(profile);
  const action = useHermesMessagingAction();
  const data = query.data;
  return <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><MessageCircle className="size-4" />Messaging</CardTitle><p className="mt-1 text-sm text-muted-foreground">Configured native messaging platforms and pairing state.</p></CardHeader><CardContent>{query.isPending ? <Skeleton className="h-48 w-full" /> : query.error || !data ? <p className="text-sm text-destructive">Unable to load messaging platforms.</p> : <div className="space-y-4"><div className="flex flex-wrap gap-2"><Badge variant="outline">{data.pairing.pending.length} pending pairings</Badge><Badge variant="outline">{data.pairing.approved.length} approved</Badge></div><div className="space-y-2">{data.platforms.platforms.map((platform) => <div key={platform.id} className="flex flex-col gap-3 rounded-md border p-4 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="font-medium">{platform.name}</p><Badge variant={platform.configured ? "secondary" : "outline"}>{platform.configured ? "configured" : "setup required"}</Badge><Badge variant="outline">{platform.state}</Badge></div><p className="mt-1 text-xs text-muted-foreground">{platform.description}</p>{platform.error_message ? <p className="mt-1 text-xs text-destructive">{platform.error_message}</p> : null}</div><div className="flex items-center gap-2"><Button size="sm" variant="outline" disabled={action.isPending || !platform.configured} onClick={() => action.mutate({ action: "test", platform: platform.id, ...(profile ? { profile } : {}) })}><PlugZap className="mr-2 size-4" />Test</Button><Switch aria-label={`Toggle ${platform.name}`} checked={platform.enabled} disabled={action.isPending || !platform.configured} onCheckedChange={(enabled) => action.mutate({ action: "toggle", platform: platform.id, enabled, ...(profile ? { profile } : {}) })} /></div></div>)}</div></div>}</CardContent></Card>;
}
