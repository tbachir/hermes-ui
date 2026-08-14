"use client";

import { RefreshCw, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useHermesModels } from "@/hooks/use-hermes";

export function HermesModelsCenter() {
  const query = useHermesModels();

  if (query.isPending) return <Skeleton className="h-80 w-full" />;
  if (query.error || !query.data) return <Card><CardContent className="pt-6 text-sm text-destructive">Unable to load Hermes model inventory.</CardContent></Card>;

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(300px,0.8fr)_minmax(0,1.2fr)]">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base"><Sparkles className="size-4" />OpenAI-compatible models</CardTitle>
          <Button size="icon" variant="ghost" onClick={() => void query.refetch()}><RefreshCw className="size-4" /></Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {query.data.models.data.map((model) => (
            <div key={model.id} className="rounded-lg border p-3"><div className="font-medium">{model.id}</div><div className="mt-1 flex gap-2"><Badge variant="outline">{model.owned_by ?? "hermes"}</Badge></div></div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Hermes model options</CardTitle></CardHeader>
        <CardContent>
          <p className="mb-3 text-sm text-muted-foreground">Raw curated inventory from the API Server `/api/model/options` surface. This intentionally stays read-only in the base registry.</p>
          <pre className="max-h-[620px] overflow-auto rounded-lg border bg-muted/20 p-4 text-xs">{JSON.stringify(query.data.options, null, 2)}</pre>
        </CardContent>
      </Card>
    </div>
  );
}
