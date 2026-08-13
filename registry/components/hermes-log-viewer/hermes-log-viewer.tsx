"use client";

import { useState } from "react";
import { RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useHermesLogs } from "@/hooks/use-hermes";

export function HermesLogViewer() {
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [level, setLevel] = useState("all");
  const query = useHermesLogs({ lines: 300, ...(level !== "all" ? { level } : {}), ...(appliedSearch ? { search: appliedSearch } : {}) });
  return <Card><CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between"><div><CardTitle className="text-base">Hermes logs</CardTitle><p className="mt-1 text-sm text-muted-foreground">Read-only server logs; requests are capped at 500 lines.</p></div><Button size="icon" variant="outline" aria-label="Refresh logs" onClick={() => void query.refetch()}><RefreshCw className="size-4" /></Button></CardHeader><CardContent className="space-y-4"><div className="flex flex-col gap-2 sm:flex-row"><Select value={level} onValueChange={setLevel}><SelectTrigger className="sm:w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All levels</SelectItem><SelectItem value="DEBUG">Debug</SelectItem><SelectItem value="INFO">Info</SelectItem><SelectItem value="WARNING">Warning</SelectItem><SelectItem value="ERROR">Error</SelectItem></SelectContent></Select><form className="relative flex-1" onSubmit={(e) => { e.preventDefault(); setAppliedSearch(search.trim()); }}><Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" /><Input className="pl-9" placeholder="Search logs and press Enter" value={search} onChange={(e) => setSearch(e.target.value)} /></form></div>{query.error ? <p className="text-sm text-destructive">Unable to load logs.</p> : <pre className="max-h-[440px] min-h-64 overflow-auto rounded-md bg-muted p-4 font-mono text-xs leading-relaxed">{query.data?.lines.join("\n") || (query.isPending ? "Loading…" : "No matching log lines.")}</pre>}</CardContent></Card>;
}
