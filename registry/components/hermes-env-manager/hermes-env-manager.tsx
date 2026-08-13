"use client";

import { useMemo, useState } from "react";
import { KeyRound, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useHermesEnv, useRemoveHermesEnv, useSetHermesEnv } from "@/hooks/use-hermes";

export function HermesEnvManager({ profile }: { profile?: string }) {
  const query = useHermesEnv(profile);
  const setEnv = useSetHermesEnv();
  const removeEnv = useRemoveHermesEnv();
  const [search, setSearch] = useState("");
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const entries = useMemo(() => Object.entries(query.data ?? {}).filter(([name, info]) => `${name} ${info.category} ${info.description}`.toLowerCase().includes(search.toLowerCase())).sort(([a], [b]) => a.localeCompare(b)), [query.data, search]);

  async function save() {
    if (!key.trim() || !value) return;
    await setEnv.mutateAsync({ key: key.trim(), value, ...(profile ? { profile } : {}) });
    setValue(""); setOpen(false);
  }

  return (
    <Card>
      <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div><CardTitle className="flex items-center gap-2 text-base"><KeyRound className="size-4" />Environment</CardTitle><p className="mt-1 text-sm text-muted-foreground">Hermes returns redacted metadata only. This UI never calls the reveal endpoint.</p></div>
        <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button size="sm">Set variable</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Set Hermes variable</DialogTitle></DialogHeader><div className="space-y-4"><div className="space-y-2"><Label htmlFor="hermes-env-key">Key</Label><Input id="hermes-env-key" value={key} onChange={(e) => setKey(e.target.value)} placeholder="PROVIDER_API_KEY" /></div><div className="space-y-2"><Label htmlFor="hermes-env-value">Value</Label><Input id="hermes-env-value" type="password" autoComplete="off" value={value} onChange={(e) => setValue(e.target.value)} /></div></div><DialogFooter><Button disabled={!key.trim() || !value || setEnv.isPending} onClick={() => void save()}>Save server-side</Button></DialogFooter></DialogContent></Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative"><Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" /><Input className="pl-9" placeholder="Search keys…" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        {query.isPending ? <Skeleton className="h-60 w-full" /> : query.error ? <p className="text-sm text-destructive">Unable to load environment metadata.</p> : (
          <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">{entries.map(([name, info]) => <div key={name} className="flex items-start justify-between gap-4 rounded-md border p-3"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="truncate font-mono text-xs font-medium">{name}</p><Badge variant={info.is_set ? "secondary" : "outline"}>{info.is_set ? "set" : "missing"}</Badge>{info.is_password ? <Badge variant="outline">secret</Badge> : null}</div><p className="mt-1 text-xs text-muted-foreground">{info.description}</p>{info.redacted_value ? <p className="mt-1 font-mono text-xs text-muted-foreground">{info.redacted_value}</p> : null}</div><div className="flex shrink-0 gap-1"><Button size="sm" variant="outline" onClick={() => { setKey(name); setValue(""); setOpen(true); }}>Set</Button>{info.is_set ? <Button size="icon" variant="ghost" aria-label={`Remove ${name}`} disabled={removeEnv.isPending} onClick={() => removeEnv.mutate({ key: name, ...(profile ? { profile } : {}) })}><Trash2 className="size-4" /></Button> : null}</div></div>)}</div>
        )}
      </CardContent>
    </Card>
  );
}
