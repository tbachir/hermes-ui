"use client";

import { ExternalLink, Globe2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useHermesPortal } from "@/hooks/use-hermes";

export function HermesPortalCard({ profile }: { profile?: string }) {
  const query = useHermesPortal(profile);
  const portal = query.data;
  return <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Globe2 className="size-4" />Hermes Portal</CardTitle><p className="mt-1 text-sm text-muted-foreground">Native portal/subscription status for the connected Hermes instance.</p></CardHeader><CardContent>{query.isPending ? <Skeleton className="h-32 w-full" /> : query.error || !portal ? <p className="text-sm text-destructive">Unable to load Portal status.</p> : <div className="space-y-4"><div className="flex flex-wrap gap-2"><Badge variant={portal.logged_in ? "default" : "outline"}>{portal.logged_in ? "logged in" : "logged out"}</Badge>{portal.provider ? <Badge variant="outline">{portal.provider}</Badge> : null}</div>{portal.features?.length ? <div className="grid gap-2 sm:grid-cols-2">{portal.features.map((feature) => <div key={feature.label} className="flex items-center justify-between gap-3 rounded-md border p-3 text-sm"><span>{feature.label}</span><Badge variant="secondary">{feature.state}</Badge></div>)}</div> : null}<div className="flex flex-wrap gap-2">{portal.portal_url ? <Button asChild size="sm" variant="outline"><a href={portal.portal_url} target="_blank" rel="noreferrer">Portal <ExternalLink className="ml-2 size-4" /></a></Button> : null}{portal.subscription_url ? <Button asChild size="sm" variant="outline"><a href={portal.subscription_url} target="_blank" rel="noreferrer">Subscription <ExternalLink className="ml-2 size-4" /></a></Button> : null}</div></div>}</CardContent></Card>;
}
