"use client";

import { useState } from "react";
import { HeartPulse, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHermesOperation } from "@/hooks/use-hermes";

export function HermesOperationsPanel() {
  const operation = useHermesOperation();
  const [result, setResult] = useState<unknown>();
  async function run(action: "doctor" | "security-audit") { setResult(await operation.mutateAsync(action)); }
  return <Card><CardHeader><CardTitle className="text-base">Safe operations</CardTitle><p className="mt-1 text-sm text-muted-foreground">Only diagnostic operations are exposed by this registry block.</p></CardHeader><CardContent className="space-y-4"><div className="flex flex-wrap gap-2"><Button variant="outline" disabled={operation.isPending} onClick={() => void run("doctor")}><HeartPulse className="mr-2 size-4" />Doctor</Button><Button variant="outline" disabled={operation.isPending} onClick={() => void run("security-audit")}><ShieldCheck className="mr-2 size-4" />Security audit</Button></div>{operation.error ? <p className="text-sm text-destructive">{operation.error.message}</p> : null}{result ? <pre className="max-h-72 overflow-auto rounded-md bg-muted p-4 font-mono text-xs">{JSON.stringify(result, null, 2)}</pre> : <p className="text-sm text-muted-foreground">No diagnostic run yet.</p>}</CardContent></Card>;
}
