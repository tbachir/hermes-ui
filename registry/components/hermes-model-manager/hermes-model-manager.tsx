"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useHermesModels, useSetHermesModel } from "@/hooks/use-hermes";

interface ModelSelectionProps {
  currentProvider: string;
  currentModel: string;
  profile?: string;
  providers: Array<{ name: string; slug: string; models?: string[]; authenticated?: boolean; warning?: string }>;
}

function ModelSelection({ currentProvider, currentModel, profile, providers }: ModelSelectionProps) {
  const [provider, setProvider] = useState(currentProvider);
  const [model, setModel] = useState(currentModel);
  const mutation = useSetHermesModel();
  const selected = providers.find((item) => item.slug === provider || item.name === provider);
  const models = selected?.models ?? [];

  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
      <Select value={provider} onValueChange={(value) => { setProvider(value); setModel(""); }}>
        <SelectTrigger><SelectValue placeholder="Provider" /></SelectTrigger>
        <SelectContent>
          {providers.map((item) => <SelectItem key={item.slug} value={item.slug}>{item.name}{item.authenticated === false ? " · not configured" : ""}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={model} onValueChange={setModel} disabled={!provider}>
        <SelectTrigger><SelectValue placeholder="Model" /></SelectTrigger>
        <SelectContent>{models.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
      </Select>
      <Button disabled={!provider || !model || mutation.isPending} onClick={() => mutation.mutate({ scope: "main", provider, model, ...(profile ? { profile } : {}) })}>Apply</Button>
    </div>
  );
}

export function HermesModelManager({ profile }: { profile?: string }) {
  const query = useHermesModels(profile);
  const providers = useMemo(() => query.data?.options.providers ?? [], [query.data]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><CardTitle className="text-base">Models</CardTitle><p className="mt-1 text-sm text-muted-foreground">Main model and provider assignment.</p></div>
          {query.data ? <div className="flex gap-2"><Badge>{query.data.info.provider}</Badge><Badge variant="secondary">{query.data.info.model}</Badge></div> : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {query.isPending ? <Skeleton className="h-10 w-full" /> : query.error || !query.data ? (
          <p className="text-sm text-destructive">Unable to load model configuration.</p>
        ) : (
          <>
            <ModelSelection key={`${query.data.info.provider}/${query.data.info.model}`} currentProvider={query.data.info.provider} currentModel={query.data.info.model} providers={providers} {...(profile ? { profile } : {})} />
            <div className="grid gap-3 border-t pt-4 text-sm sm:grid-cols-3">
              <div><p className="text-xs text-muted-foreground">Effective context</p><p className="font-medium">{query.data.info.effective_context_length?.toLocaleString() ?? "Auto"}</p></div>
              <div><p className="text-xs text-muted-foreground">Providers</p><p className="font-medium">{providers.length}</p></div>
              <div><p className="text-xs text-muted-foreground">Auxiliary tasks</p><p className="font-medium">{query.data.auxiliary.tasks.length}</p></div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
