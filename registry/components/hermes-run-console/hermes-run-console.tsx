"use client";

import { useEffect, useRef, useState } from "react";
import {
  CircleStop,
  LoaderCircle,
  Send,
  ShieldCheck,
  ShieldX,
} from "lucide-react";

import { MessageResponse } from "@/components/ai-elements/message";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  useApproveHermesRun,
  useCreateHermesRun,
  useHermesRun,
  useStopHermesRun,
} from "@/hooks/use-hermes";

type LocalMessage = {
  id: string;
  role: "user" | "assistant" | "error";
  content: string;
};

export function HermesRunConsole({
  instructions,
  model,
}: {
  instructions?: string;
  model?: string;
}) {
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string>();
  const [activeRunId, setActiveRunId] = useState<string>();
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const handledRunId = useRef<string>();

  const createRun = useCreateHermesRun();
  const run = useHermesRun(activeRunId);
  const approve = useApproveHermesRun();
  const stop = useStopHermesRun();

  useEffect(() => {
    const current = run.data;
    if (!current || !activeRunId) return;
    if (!["completed", "failed", "cancelled"].includes(current.status)) return;
    if (handledRunId.current === current.run_id) return;

    handledRunId.current = current.run_id;

    if (current.session_id) {
      setSessionId(current.session_id);
    }

    const content =
      current.status === "completed"
        ? current.output || "_Hermes completed without textual output._"
        : current.status === "cancelled"
          ? "_Run cancelled._"
          : `**Hermes run failed.**\n\n${String(current.error ?? "Unknown error")}`;

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: crypto.randomUUID(),
        role: current.status === "failed" ? "error" : "assistant",
        content,
      },
    ]);
    setActiveRunId(undefined);
  }, [activeRunId, run.data]);

  async function submit() {
    const text = input.trim();
    if (!text || activeRunId) return;

    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", content: text },
    ]);
    setInput("");

    try {
      const created = await createRun.mutateAsync({
        input: text,
        ...(sessionId ? { session_id: sessionId } : {}),
        ...(instructions ? { instructions } : {}),
        ...(model ? { model } : {}),
      });

      handledRunId.current = undefined;
      setActiveRunId(created.run_id);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "error",
          content: `**Unable to start Hermes.**\n\n${error instanceof Error ? error.message : "Unknown error"}`,
        },
      ]);
    }
  }

  const waiting = activeRunId && run.data?.status === "waiting";
  const busy = Boolean(activeRunId);

  return (
    <Card className="min-h-[560px]">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base">Hermes Run Console</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Native API Server Runs
          </p>
        </div>
        <div className="flex items-center gap-2">
          {sessionId ? <Badge variant="outline">session</Badge> : null}
          {run.data?.status ? <Badge>{run.data.status}</Badge> : null}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div
          className="max-h-[340px] space-y-4 overflow-y-auto pr-2"
          aria-live="polite"
        >
          {messages.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
              Send a request. Follow-up messages reuse the native Hermes session ID.
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.role === "user"
                    ? "ml-auto max-w-[85%] rounded-lg bg-primary px-4 py-3 text-primary-foreground"
                    : message.role === "error"
                      ? "max-w-[90%] rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3"
                      : "max-w-[90%] rounded-lg border bg-muted/20 px-4 py-3"
                }
              >
                {message.role === "user" ? (
                  <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                ) : (
                  <MessageResponse>{message.content}</MessageResponse>
                )}
              </div>
            ))
          )}

          {busy && !waiting ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <LoaderCircle className="size-4 animate-spin" />
              Hermes is running…
            </div>
          ) : null}
        </div>

        {waiting && activeRunId ? (
          <>
            <Separator />
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
              <div className="mb-3 text-sm font-medium">
                Hermes is waiting for approval.
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  disabled={approve.isPending}
                  onClick={() =>
                    approve.mutate(
                      { runId: activeRunId, choice: "once" },
                      { onSuccess: () => void run.refetch() },
                    )
                  }
                >
                  <ShieldCheck className="mr-2 size-4" />
                  Approve once
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={approve.isPending}
                  onClick={() =>
                    approve.mutate(
                      { runId: activeRunId, choice: "deny" },
                      { onSuccess: () => void run.refetch() },
                    )
                  }
                >
                  <ShieldX className="mr-2 size-4" />
                  Deny
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </CardContent>

      <CardFooter className="flex-col gap-3">
        <Textarea
          value={input}
          disabled={busy}
          placeholder="Ask Hermes…"
          rows={3}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
              event.preventDefault();
              void submit();
            }
          }}
        />
        <div className="flex w-full items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">
            Ctrl/⌘ + Enter to send
          </span>
          <div className="flex gap-2">
            {activeRunId ? (
              <Button
                variant="outline"
                disabled={stop.isPending}
                onClick={() =>
                  stop.mutate(activeRunId, {
                    onSuccess: () => void run.refetch(),
                  })
                }
              >
                <CircleStop className="mr-2 size-4" />
                Stop
              </Button>
            ) : null}
            <Button
              disabled={!input.trim() || busy || createRun.isPending}
              onClick={() => void submit()}
            >
              <Send className="mr-2 size-4" />
              Send
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
