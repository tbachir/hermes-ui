"use client";

import {
  Activity,
  CircleAlert,
  RefreshCw,
  Server,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useHermesStatus } from "@/hooks/use-hermes";

export function HermesStatusCard() {
  const query = useHermesStatus();

  if (query.isPending) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-36" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (query.error || !query.data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CircleAlert className="size-4" />
            Hermes unavailable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            size="sm"
            variant="outline"
            onClick={() => void query.refetch()}
          >
            <RefreshCw className="mr-2 size-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { status, stats } = query.data;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <Server className="size-4" />
            Hermes
          </CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            {stats.hostname} · {stats.platform}
          </p>
        </div>
        <Badge variant={status.gateway_running ? "default" : "secondary"}>
          <Activity className="mr-1 size-3" />
          {status.gateway_running ? "Gateway online" : "Gateway offline"}
        </Badge>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-3">
        <Metric label="Version" value={status.version} />
        <Metric label="Active sessions" value={String(status.active_sessions)} />
        <Metric label="Gateway" value={status.gateway_state ?? "unknown"} />
      </CardContent>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted/20 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 truncate font-mono text-sm">{value}</div>
    </div>
  );
}
