"use client";

import { Blocks, Wrench } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useHermesSkills, useHermesStatus, useHermesTools } from "@/hooks/use-hermes";

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function HermesCapabilitiesCenter() {
  const status = useHermesStatus();
  const skills = useHermesSkills();
  const tools = useHermesTools();

  if (status.isPending || skills.isPending || tools.isPending) {
    return <div className="grid gap-4 xl:grid-cols-2"><Skeleton className="h-72" /><Skeleton className="h-72" /></div>;
  }

  const features = record(status.data?.capabilities.features);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Blocks className="size-4" />Advertised API capabilities</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {Object.entries(features).map(([name, value]) => (
            <Badge key={name} variant={value === true ? "default" : "outline"}>{name}: {String(value)}</Badge>
          ))}
          {Object.keys(features).length === 0 ? <span className="text-sm text-muted-foreground">No capability payload available.</span> : null}
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Skills</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {skills.data?.skills.map((skill) => (
              <div key={skill.name} className="rounded-lg border p-3">
                <div className="flex items-center justify-between gap-3"><span className="font-medium">{skill.name}</span>{skill.category ? <Badge variant="outline">{skill.category}</Badge> : null}</div>
                {skill.description ? <p className="mt-1 text-sm text-muted-foreground">{skill.description}</p> : null}
              </div>
            ))}
            {!skills.data?.skills.length ? <p className="text-sm text-muted-foreground">No skills returned by `/v1/skills`.</p> : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Wrench className="size-4" />Toolsets</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {tools.data?.toolsets.map((toolset) => (
              <div key={toolset.name} className="rounded-lg border p-3">
                <div className="flex flex-wrap items-center gap-2"><span className="font-medium">{toolset.label ?? toolset.name}</span><Badge variant={toolset.enabled ? "default" : "secondary"}>{toolset.enabled ? "enabled" : "disabled"}</Badge>{toolset.configured !== undefined ? <Badge variant="outline">{toolset.configured ? "configured" : "not configured"}</Badge> : null}</div>
                {toolset.description ? <p className="mt-1 text-sm text-muted-foreground">{toolset.description}</p> : null}
                {toolset.tools?.length ? <div className="mt-2 flex flex-wrap gap-1">{toolset.tools.map((tool) => <Badge key={tool} variant="outline">{tool}</Badge>)}</div> : null}
              </div>
            ))}
            {!tools.data?.toolsets.length ? <p className="text-sm text-muted-foreground">No toolsets returned by `/v1/toolsets`.</p> : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
