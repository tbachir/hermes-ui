"use client";

import { Play, RotateCw, Square } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHermesGatewayAction, useHermesStatus } from "@/hooks/use-hermes";

export function HermesGatewayControls() {
  const status = useHermesStatus();
  const action = useHermesGatewayAction();
  const running = status.data?.status.gateway_running ?? false;
  return <Card><CardHeader className="flex flex-row items-start justify-between gap-3"><div><CardTitle className="text-base">Gateway</CardTitle><p className="mt-1 text-sm text-muted-foreground">Lifecycle controls for the Hermes gateway process.</p></div><Badge variant={running ? "secondary" : "outline"}>{running ? "running" : "stopped"}</Badge></CardHeader><CardContent className="flex flex-wrap gap-2"><Button size="sm" variant="outline" disabled={action.isPending} onClick={() => action.mutate("start")}><Play className="mr-2 size-4" />Start</Button><Button size="sm" variant="outline" disabled={action.isPending} onClick={() => action.mutate("restart")}><RotateCw className="mr-2 size-4" />Restart</Button><Button size="sm" variant="destructive" disabled={action.isPending} onClick={() => action.mutate("stop")}><Square className="mr-2 size-4" />Stop</Button></CardContent></Card>;
}
