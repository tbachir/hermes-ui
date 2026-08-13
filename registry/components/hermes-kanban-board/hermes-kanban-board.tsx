"use client";

import { RefreshCw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useHermesKanban } from "@/hooks/use-hermes";

const visibleColumns = [
  "triage",
  "todo",
  "scheduled",
  "ready",
  "running",
  "blocked",
  "review",
  "done",
];

export function HermesKanbanBoard({ board }: { board?: string }) {
  const query = useHermesKanban(board);
  const data = query.data;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base">Kanban</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Native Hermes task board
          </p>
        </div>
        <Button
          aria-label="Refresh Kanban"
          size="icon"
          variant="ghost"
          onClick={() => void query.refetch()}
        >
          <RefreshCw className="size-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {query.isPending ? (
          <Skeleton className="h-80 w-full" />
        ) : query.error || !data ? (
          <p className="text-sm text-destructive">
            Kanban is unavailable or could not be loaded.
          </p>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-3">
            {visibleColumns.map((name) => {
              const column = data.columns.find((item) => item.name === name);
              if (!column) return null;

              return (
                <section key={name} className="w-72 shrink-0">
                  <header className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-medium capitalize">{name}</h3>
                    <Badge variant="secondary">{column.tasks.length}</Badge>
                  </header>
                  <div className="space-y-2">
                    {column.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="rounded-lg border bg-card p-3 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium leading-snug">
                            {task.title}
                          </p>
                          {task.priority ? (
                            <Badge variant="outline">P{task.priority}</Badge>
                          ) : null}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1 text-xs text-muted-foreground">
                          {task.assignee ? <span>{task.assignee}</span> : null}
                          {task.progress ? (
                            <span>
                              {task.progress.done}/{task.progress.total}
                            </span>
                          ) : null}
                          {task.warnings?.count ? (
                            <Badge variant="destructive">
                              {task.warnings.count} warning
                            </Badge>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
