"use client";

import { Database, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useHermesMemory, useResetHermesMemory, useSelectHermesMemory } from "@/hooks/use-hermes";

export function HermesMemoryManager() {
  const query = useHermesMemory();
  const select = useSelectHermesMemory();
  const reset = useResetHermesMemory();
  const data = query.data;
  return <Card>
    <CardHeader className="flex flex-row items-start justify-between gap-4"><div><CardTitle className="flex items-center gap-2 text-base"><Database className="size-4" />Memory</CardTitle><p className="mt-1 text-sm text-muted-foreground">Select the active Hermes memory provider.</p></div><Button size="sm" variant="outline" disabled={reset.isPending} onClick={() => reset.mutate("all")}><RotateCcw className="mr-2 size-4" />Reset builtin</Button></CardHeader>
    <CardContent>{query.isPending ? <Skeleton className="h-28 w-full" /> : query.error || !data ? <p className="text-sm text-destructive">Unable to load memory status.</p> : <div className="space-y-4">
      <Select value={data.active} disabled={select.isPending} onValueChange={(provider) => select.mutate(provider)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{data.providers.map((provider) => <SelectItem key={provider.name} value={provider.name} disabled={provider.available === false}>{provider.name}</SelectItem>)}</SelectContent></Select>
      <div className="grid gap-3 sm:grid-cols-2">{data.providers.map((provider) => <div key={provider.name} className="rounded-md border p-3"><div className="flex items-center justify-between gap-3"><p className="font-medium">{provider.name}</p><Badge variant={provider.name === data.active ? "default" : provider.configured ? "secondary" : "outline"}>{provider.name === data.active ? "active" : provider.status ?? (provider.configured ? "configured" : "setup")}</Badge></div><p className="mt-1 text-xs text-muted-foreground">{provider.description}</p></div>)}</div>
      <p className="text-xs text-muted-foreground">Builtin files: {data.builtin_files.memory} memory · {data.builtin_files.user} user</p>
    </div>}</CardContent>
  </Card>;
}
