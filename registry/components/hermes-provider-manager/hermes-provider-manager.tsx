"use client";

import { ExternalLink, LogIn, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useHermesProviderAction, useHermesProviders } from "@/hooks/use-hermes";

function openFlow(result: unknown) {
  if (!result || typeof result !== "object") return;
  const value = result as Record<string, unknown>;
  const url = typeof value.auth_url === "string" ? value.auth_url : typeof value.verification_url === "string" ? value.verification_url : undefined;
  if (typeof value.user_code === "string") void navigator.clipboard?.writeText(value.user_code);
  if (url) window.open(url, "_blank", "noopener,noreferrer");
}

export function HermesProviderManager() {
  const query = useHermesProviders();
  const action = useHermesProviderAction();
  return <Card>
    <CardHeader><CardTitle className="text-base">Providers</CardTitle><p className="mt-1 text-sm text-muted-foreground">OAuth accounts and custom model endpoints.</p></CardHeader>
    <CardContent className="space-y-5">{query.isPending ? <Skeleton className="h-48 w-full" /> : query.error || !query.data ? <p className="text-sm text-destructive">Unable to load providers.</p> : <>
      <div className="divide-y rounded-md border">{query.data.oauth.providers.map((provider) => <div key={provider.id} className="flex items-center gap-3 p-3"><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="font-medium">{provider.name}</p><Badge variant={provider.status.logged_in ? "secondary" : "outline"}>{provider.status.logged_in ? "connected" : provider.flow}</Badge></div>{provider.status.token_preview ? <p className="mt-1 font-mono text-xs text-muted-foreground">{provider.status.token_preview}</p> : null}</div>{provider.status.logged_in ? <Button size="sm" variant="outline" disabled={action.isPending} onClick={() => action.mutate({ action: "oauth-disconnect", id: provider.id })}><LogOut className="mr-2 size-4" />Disconnect</Button> : <Button size="sm" disabled={action.isPending} onClick={() => action.mutate({ action: "oauth-start", id: provider.id }, { onSuccess: openFlow })}><LogIn className="mr-2 size-4" />Connect</Button>}</div>)}</div>
      <div><p className="mb-2 text-sm font-medium">Custom endpoints</p><div className="grid gap-2">{query.data.custom.endpoints.map((endpoint) => <div key={endpoint.id} className="flex items-center gap-3 rounded-md border p-3"><div className="min-w-0 flex-1"><div className="flex gap-2"><p className="font-medium">{endpoint.name}</p>{endpoint.is_current ? <Badge>active</Badge> : null}</div><p className="mt-1 truncate text-xs text-muted-foreground">{endpoint.base_url} · {endpoint.model}</p></div>{!endpoint.is_current ? <Button size="sm" variant="outline" onClick={() => action.mutate({ action: "custom-activate", id: endpoint.id })}><ExternalLink className="mr-2 size-4" />Activate</Button> : null}</div>)}{query.data.custom.endpoints.length === 0 ? <p className="text-sm text-muted-foreground">No custom endpoints.</p> : null}</div></div>
    </>}</CardContent>
  </Card>;
}
