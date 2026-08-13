"use client";

import { Settings2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useHermesConfig } from "@/hooks/use-hermes";

function displayValue(value: unknown) {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean") return value ? "true" : "false";
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export function HermesConfigOverview({ profile }: { profile?: string }) {
  const query = useHermesConfig(profile);
  const data = query.data;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base"><Settings2 className="size-4" />Safe config</CardTitle>
        <p className="text-sm text-muted-foreground">Read-only, non-secret configuration selected by the registry server adapter.</p>
      </CardHeader>
      <CardContent>
        {query.isPending ? <Skeleton className="h-48 w-full" /> : query.error || !data ? (
          <p className="text-sm text-destructive">Unable to load Hermes configuration.</p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {Object.entries(data.config).map(([section, values]) => (
              <section key={section} className="rounded-md border p-4">
                <div className="mb-3 flex items-center justify-between gap-3"><h3 className="font-medium capitalize">{section}</h3><Badge variant="outline">{Object.keys(values).length}</Badge></div>
                <dl className="space-y-2 text-sm">
                  {Object.entries(values).length === 0 ? <p className="text-muted-foreground">No safe fields exposed.</p> : Object.entries(values).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-3"><dt className="truncate text-muted-foreground">{key}</dt><dd className="break-words text-right font-mono text-xs">{displayValue(value)}</dd></div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
