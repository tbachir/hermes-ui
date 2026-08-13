"use client";

import { useState } from "react";
import { GitBranch, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useHermesGit } from "@/hooks/use-hermes";

function compact(value: unknown) { return JSON.stringify(value, null, 2); }

export function HermesGitStatus({ defaultPath = "" }: { defaultPath?: string }) {
  const [draft, setDraft] = useState(defaultPath);
  const [path, setPath] = useState(defaultPath);
  const query = useHermesGit(path || undefined);

  return <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><GitBranch className="size-4" />Git status</CardTitle><p className="mt-1 text-sm text-muted-foreground">Read-only. Server access is restricted by HERMES_UI_GIT_ROOTS.</p></CardHeader><CardContent className="space-y-4"><form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); setPath(draft.trim()); }}><Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="/workspace/project" /><Button type="submit" disabled={!draft.trim()}>Inspect</Button></form>{!path ? <div className="rounded-md border border-dashed p-5 text-sm text-muted-foreground">Enter an allowed remote repository path.</div> : query.isPending ? <p className="text-sm text-muted-foreground">Loading repository…</p> : query.error || !query.data ? <p className="text-sm text-destructive">Repository unavailable or not allowed.</p> : <div className="space-y-4"><div className="flex items-center justify-between gap-3"><div className="flex gap-2"><Badge variant="outline">{query.data.branches.length} branches</Badge><Badge variant="outline">{query.data.worktrees.length} worktrees</Badge></div><Button size="icon" variant="ghost" aria-label="Refresh git status" onClick={() => void query.refetch()}><RefreshCw className="size-4" /></Button></div><pre className="max-h-72 overflow-auto rounded-md bg-muted p-4 font-mono text-xs">{compact(query.data.status)}</pre></div>}</CardContent></Card>;
}
