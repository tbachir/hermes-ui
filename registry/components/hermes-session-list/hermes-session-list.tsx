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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useHermesSessions } from "@/hooks/use-hermes";

function relativeTime(timestamp: number) {
  const seconds = Math.max(0, Math.round(Date.now() / 1000 - timestamp));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function HermesSessionList({ limit = 12 }: { limit?: number }) {
  const query = useHermesSessions({ limit });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base">Sessions</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Recent native Hermes sessions
          </p>
        </div>
        <Button
          aria-label="Refresh sessions"
          size="icon"
          variant="ghost"
          onClick={() => void query.refetch()}
        >
          <RefreshCw className="size-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {query.isPending ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
        ) : query.error || !query.data ? (
          <p className="text-sm text-destructive">Unable to load sessions.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session</TableHead>
                  <TableHead>Profile</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Tokens</TableHead>
                  <TableHead>Activity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {query.data.sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="max-w-80">
                      <div className="truncate font-medium">
                        {session.title || session.preview || session.id}
                      </div>
                      <div className="truncate font-mono text-xs text-muted-foreground">
                        {session.id}
                      </div>
                    </TableCell>
                    <TableCell>{session.profile ?? "default"}</TableCell>
                    <TableCell className="max-w-48 truncate">
                      {session.model ?? "—"}
                    </TableCell>
                    <TableCell>
                      {(session.input_tokens + session.output_tokens).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {session.is_active ? <Badge>active</Badge> : null}
                        <span className="text-xs text-muted-foreground">
                          {relativeTime(session.last_active)}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
