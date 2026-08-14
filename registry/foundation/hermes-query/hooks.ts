"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  HermesApiRunApprovalChoice,
  HermesApiRunCreateRequest,
} from "@burner-io/hermes/contracts";

import { hermesUiApi } from "@/lib/hermes/client";

export const hermesUiKeys = {
  all: ["hermes-ui"] as const,
  status: () => [...hermesUiKeys.all, "status"] as const,
  models: () => [...hermesUiKeys.all, "models"] as const,
  skills: () => [...hermesUiKeys.all, "skills"] as const,
  tools: () => [...hermesUiKeys.all, "tools"] as const,
  sessions: (input: { limit?: number; offset?: number }) =>
    [...hermesUiKeys.all, "sessions", input] as const,
  session: (id?: string) => [...hermesUiKeys.all, "session", id ?? null] as const,
  run: (runId?: string) => [...hermesUiKeys.all, "run", runId ?? null] as const,
};

export function useHermesStatus() {
  return useQuery({ queryKey: hermesUiKeys.status(), queryFn: hermesUiApi.status });
}

export function useHermesModels() {
  return useQuery({ queryKey: hermesUiKeys.models(), queryFn: hermesUiApi.models });
}

export function useHermesSkills() {
  return useQuery({ queryKey: hermesUiKeys.skills(), queryFn: hermesUiApi.skills });
}

export function useHermesTools() {
  return useQuery({ queryKey: hermesUiKeys.tools(), queryFn: hermesUiApi.tools });
}

export function useHermesSessions(input: { limit?: number; offset?: number } = {}) {
  return useQuery({
    queryKey: hermesUiKeys.sessions(input),
    queryFn: () => hermesUiApi.sessions(input),
  });
}

export function useHermesSession(sessionId?: string) {
  return useQuery({
    queryKey: hermesUiKeys.session(sessionId),
    queryFn: () => hermesUiApi.session(sessionId!),
    enabled: Boolean(sessionId),
  });
}

export function useCreateHermesRun() {
  return useMutation({
    mutationFn: (input: HermesApiRunCreateRequest) => hermesUiApi.createRun(input),
  });
}

export function useHermesRun(runId?: string) {
  return useQuery({
    queryKey: hermesUiKeys.run(runId),
    queryFn: () => hermesUiApi.run(runId!),
    enabled: Boolean(runId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status && ["completed", "failed", "cancelled", "waiting"].includes(status)
        ? false
        : 1_000;
    },
  });
}

export function useApproveHermesRun() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      runId,
      choice,
      approvalId,
    }: {
      runId: string;
      choice: HermesApiRunApprovalChoice;
      approvalId?: string;
    }) =>
      hermesUiApi.approveRun(runId, {
        choice,
        ...(approvalId ? { approval_id: approvalId } : {}),
      }),
    onSuccess: async (_, variables) =>
      client.invalidateQueries({ queryKey: hermesUiKeys.run(variables.runId) }),
  });
}

export function useStopHermesRun() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (runId: string) => hermesUiApi.stopRun(runId),
    onSuccess: async (_, runId) =>
      client.invalidateQueries({ queryKey: hermesUiKeys.run(runId) }),
  });
}
