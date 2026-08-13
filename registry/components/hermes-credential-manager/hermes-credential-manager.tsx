"use client";

import { useState } from "react";
import { KeyRound, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddHermesCredential, useHermesCredentials, useRemoveHermesCredential } from "@/hooks/use-hermes";

function AddCredential() {
  const [open, setOpen] = useState(false);
  const [provider, setProvider] = useState("");
  const [label, setLabel] = useState("");
  const [key, setKey] = useState("");
  const add = useAddHermesCredential();
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button size="sm"><Plus className="mr-2 size-4" />Add credential</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Add provider credential</DialogTitle></DialogHeader><div className="space-y-4"><div className="space-y-2"><Label htmlFor="cred-provider">Provider</Label><Input id="cred-provider" value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="openrouter" /></div><div className="space-y-2"><Label htmlFor="cred-label">Label</Label><Input id="cred-label" value={label} onChange={(e) => setLabel(e.target.value)} /></div><div className="space-y-2"><Label htmlFor="cred-key">API key</Label><Input id="cred-key" type="password" autoComplete="off" value={key} onChange={(e) => setKey(e.target.value)} /></div></div><DialogFooter><Button disabled={!provider.trim() || !key.trim() || add.isPending} onClick={() => add.mutate({ provider: provider.trim(), api_key: key, ...(label.trim() ? { label: label.trim() } : {}) }, { onSuccess: () => { setOpen(false); setKey(""); } })}>Save</Button></DialogFooter></DialogContent></Dialog>;
}

export function HermesCredentialManager() {
  const query = useHermesCredentials();
  const remove = useRemoveHermesCredential();
  return <Card><CardHeader className="flex flex-row items-start justify-between gap-4"><div><CardTitle className="flex items-center gap-2 text-base"><KeyRound className="size-4" />Credential pool</CardTitle><p className="mt-1 text-sm text-muted-foreground">Server-side provider credentials managed by Hermes.</p></div><AddCredential /></CardHeader><CardContent>{query.isPending ? <Skeleton className="h-36 w-full" /> : query.error ? <p className="text-sm text-destructive">Unable to load credentials.</p> : <div className="space-y-4">{query.data?.providers.map((group) => <section key={group.provider}><p className="mb-2 text-sm font-medium">{group.provider}</p><div className="divide-y rounded-md border">{group.entries.map((entry) => <div key={entry.index} className="flex items-center gap-3 p-3"><div className="min-w-0 flex-1"><div className="flex gap-2"><p className="font-medium">{entry.label || `Credential ${entry.index}`}</p><Badge variant="outline">priority {entry.priority}</Badge>{entry.last_status ? <Badge variant="secondary">{entry.last_status}</Badge> : null}</div><p className="mt-1 font-mono text-xs text-muted-foreground">{entry.token_preview}</p></div><Button size="icon" variant="ghost" aria-label="Remove credential" onClick={() => remove.mutate({ provider: group.provider, index: entry.index })}><Trash2 className="size-4" /></Button></div>)}</div></section>)}{query.data?.providers.length === 0 ? <p className="text-sm text-muted-foreground">No pooled credentials.</p> : null}</div>}</CardContent></Card>;
}
