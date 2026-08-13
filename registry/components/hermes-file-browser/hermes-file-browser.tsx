"use client";

import { useState } from "react";
import { File, Folder, FolderOpen, MoveUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useHermesFiles } from "@/hooks/use-hermes";

function bytes(value: number | null) {
  if (value === null) return "—";
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / 1024 / 1024).toFixed(1)} MB`;
}

export function HermesFileBrowser({ initialPath }: { initialPath?: string }) {
  const [path, setPath] = useState(initialPath);
  const query = useHermesFiles(path);
  const data = query.data;

  return <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><FolderOpen className="size-4" />Managed files</CardTitle><p className="mt-1 break-all font-mono text-xs text-muted-foreground">{data?.path ?? path ?? "Hermes managed root"}</p></CardHeader><CardContent>
    {query.isPending ? <Skeleton className="h-56 w-full" /> : query.error || !data ? <p className="text-sm text-destructive">Unable to load managed files.</p> : <div className="space-y-3">{data.parent ? <Button size="sm" variant="outline" onClick={() => setPath(data.parent ?? undefined)}><MoveUp className="mr-2 size-4" />Parent</Button> : null}<div className="divide-y rounded-md border">{data.entries.length === 0 ? <p className="p-4 text-sm text-muted-foreground">Empty directory.</p> : data.entries.map((entry) => <button key={entry.path} type="button" disabled={!entry.is_directory} onClick={() => entry.is_directory && setPath(entry.path)} className="flex w-full items-center gap-3 p-3 text-left disabled:cursor-default"><span className="shrink-0">{entry.is_directory ? <Folder className="size-4" /> : <File className="size-4 text-muted-foreground" />}</span><span className="min-w-0 flex-1 truncate text-sm">{entry.name}</span><span className="font-mono text-xs text-muted-foreground">{entry.is_directory ? "directory" : bytes(entry.size)}</span></button>)}</div></div>}
  </CardContent></Card>;
}
