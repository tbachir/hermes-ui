"use client";

import { Webhook } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useEnableHermesWebhooks, useHermesWebhooks, useToggleHermesWebhook } from "@/hooks/use-hermes";

export function HermesWebhookManager() {
  const query = useHermesWebhooks();
  const enable = useEnableHermesWebhooks();
  const toggle = useToggleHermesWebhook();
  return <Card><CardHeader className="flex flex-row items-start justify-between gap-4"><div><CardTitle className="flex items-center gap-2 text-base"><Webhook className="size-4" />Webhooks</CardTitle><p className="mt-1 text-sm text-muted-foreground">Inbound Hermes event subscriptions.</p></div>{query.data && !query.data.enabled ? <Button size="sm" onClick={() => enable.mutate()}>Enable webhooks</Button> : null}</CardHeader><CardContent>{query.isPending ? <Skeleton className="h-36 w-full" /> : query.error || !query.data ? <p className="text-sm text-destructive">Unable to load webhooks.</p> : <div className="space-y-3"><div className="flex items-center gap-2"><Badge variant={query.data.enabled ? "secondary" : "outline"}>{query.data.enabled ? "gateway enabled" : "disabled"}</Badge><span className="truncate text-xs text-muted-foreground">{query.data.base_url}</span></div><div className="divide-y rounded-md border">{query.data.subscriptions.map((hook) => <div key={hook.name} className="flex items-center gap-3 p-3"><div className="min-w-0 flex-1"><div className="flex flex-wrap gap-2"><p className="font-medium">{hook.name}</p>{hook.secret_set ? <Badge variant="outline">signed</Badge> : null}<Badge variant="secondary">{hook.events.length} events</Badge></div><p className="mt-1 truncate text-xs text-muted-foreground">{hook.url}</p></div><Switch checked={hook.enabled} disabled={toggle.isPending} onCheckedChange={(enabled) => toggle.mutate({ name: hook.name, enabled })} /></div>)}{query.data.subscriptions.length === 0 ? <p className="p-6 text-center text-sm text-muted-foreground">No webhook subscriptions.</p> : null}</div></div>}</CardContent></Card>;
}
