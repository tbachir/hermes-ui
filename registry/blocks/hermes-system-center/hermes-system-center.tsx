"use client";

import { Activity, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useHermesStatus } from "@/hooks/use-hermes";

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function HermesSystemCenter() {
  const query = useHermesStatus();
  if (query.isPending) return <Skeleton className="h-80 w-full" />;
  if (query.error || !query.data) return <Card><CardContent className="pt-6 text-sm text-destructive">Hermes API Server is unavailable.</CardContent></Card>;

  const capabilities = record(query.data.capabilities);
  const auth = record(capabilities.auth);
  const runtime = record(capabilities.runtime);
  const endpoints = record(capabilities.endpoints);

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Activity className="size-4" />Detailed health</CardTitle></CardHeader>
        <CardContent><pre className="max-h-[520px] overflow-auto rounded-lg border bg-muted/20 p-4 text-xs">{JSON.stringify(query.data.health, null, 2)}</pre></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><ShieldCheck className="size-4" />Machine API contract</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2"><Badge>auth: {String(auth.type ?? "bearer")}</Badge><Badge variant="outline">required: {String(auth.required ?? true)}</Badge><Badge variant="outline">endpoints: {Object.keys(endpoints).length}</Badge></div>
          <div><div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Runtime</div><pre className="overflow-auto rounded-lg border bg-muted/20 p-4 text-xs">{JSON.stringify(runtime, null, 2)}</pre></div>
          <div><div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Advertised endpoints</div><pre className="max-h-72 overflow-auto rounded-lg border bg-muted/20 p-4 text-xs">{JSON.stringify(endpoints, null, 2)}</pre></div>
        </CardContent>
      </Card>
    </div>
  );
}
