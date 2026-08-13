"use client";

import { useState } from "react";
import { FlaskConical, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useCreateHermesMcp, useHermesMcp, useRemoveHermesMcp, useTestHermesMcp, useToggleHermesMcp } from "@/hooks/use-hermes";

function AddServer({ profile }: { profile?: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const create = useCreateHermesMcp();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm"><Plus className="mr-2 size-4" />Add server</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Add MCP server</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2"><Label htmlFor="mcp-name">Name</Label><Input id="mcp-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="github" /></div>
          <div className="space-y-2"><Label htmlFor="mcp-url">HTTP URL</Label><Input id="mcp-url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://example.com/mcp" /></div>
        </div>
        <DialogFooter><Button disabled={!name.trim() || !url.trim() || create.isPending} onClick={() => create.mutate({ name: name.trim(), url: url.trim(), ...(profile ? { profile } : {}) }, { onSuccess: () => { setOpen(false); setName(""); setUrl(""); } })}>Create</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function HermesMcpManager({ profile }: { profile?: string }) {
  const query = useHermesMcp(profile);
  const toggle = useToggleHermesMcp();
  const test = useTestHermesMcp();
  const remove = useRemoveHermesMcp();
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div><CardTitle className="text-base">MCP servers</CardTitle><p className="mt-1 text-sm text-muted-foreground">Servers and tools exposed to Hermes.</p></div>
        <AddServer {...(profile ? { profile } : {})} />
      </CardHeader>
      <CardContent>
        {query.isPending ? <Skeleton className="h-40 w-full" /> : query.error ? <p className="text-sm text-destructive">Unable to load MCP servers.</p> : (
          <div className="divide-y rounded-md border">
            {query.data?.servers.map((server) => (
              <div key={server.name} className="flex items-center gap-3 p-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><p className="font-medium">{server.name}</p><Badge variant="outline">{server.transport}</Badge>{server.tools ? <Badge variant="secondary">{server.tools.length} tools</Badge> : null}</div>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{server.url ?? server.command ?? "No transport configured"}</p>
                </div>
                <Button size="icon" variant="ghost" aria-label={`Test ${server.name}`} onClick={() => test.mutate({ name: server.name, ...(profile ? { profile } : {}) })}><FlaskConical className="size-4" /></Button>
                <Button size="icon" variant="ghost" aria-label={`Remove ${server.name}`} onClick={() => remove.mutate({ name: server.name, ...(profile ? { profile } : {}) })}><Trash2 className="size-4" /></Button>
                <Switch checked={server.enabled} disabled={toggle.isPending} onCheckedChange={(enabled) => toggle.mutate({ name: server.name, enabled, ...(profile ? { profile } : {}) })} />
              </div>
            ))}
            {query.data?.servers.length === 0 ? <p className="p-6 text-center text-sm text-muted-foreground">No MCP servers configured.</p> : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
