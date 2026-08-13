"use client";

import { useMemo, useState } from "react";
import { RefreshCw, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useHermesSkills, useToggleHermesSkill } from "@/hooks/use-hermes";

export function HermesSkillManager({ profile }: { profile?: string }) {
  const [search, setSearch] = useState("");
  const query = useHermesSkills(profile);
  const toggle = useToggleHermesSkill();
  const skills = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return query.data ?? [];
    return (query.data ?? []).filter((skill) =>
      `${skill.name} ${skill.description} ${skill.category}`.toLowerCase().includes(value),
    );
  }, [query.data, search]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-base">Skills</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">Native Hermes skills for the selected profile.</p>
        </div>
        <Button size="icon" variant="ghost" aria-label="Refresh skills" onClick={() => void query.refetch()}>
          <RefreshCw className="size-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search skills" className="pl-9" />
        </div>
        {query.isPending ? (
          <div className="space-y-2">{Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-16 w-full" />)}</div>
        ) : query.error ? (
          <p className="text-sm text-destructive">Unable to load Hermes skills.</p>
        ) : (
          <div className="divide-y rounded-md border">
            {skills.map((skill) => (
              <div key={skill.name} className="flex items-center gap-4 p-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-medium">{skill.name}</p>
                    <Badge variant="outline">{skill.category || "uncategorized"}</Badge>
                    {skill.provenance ? <Badge variant="secondary">{skill.provenance}</Badge> : null}
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{skill.description || "No description"}</p>
                </div>
                <Switch
                  checked={skill.enabled}
                  disabled={toggle.isPending}
                  aria-label={`${skill.enabled ? "Disable" : "Enable"} ${skill.name}`}
                  onCheckedChange={(enabled) => toggle.mutate({ name: skill.name, enabled, ...(profile ? { profile } : {}) })}
                />
              </div>
            ))}
            {skills.length === 0 ? <p className="p-6 text-center text-sm text-muted-foreground">No skills match this filter.</p> : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
