"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  HermesApiRunApprovalChoice,
  HermesApiRunCreateRequest,
  HermesCronJobCreateRequest,
  HermesCredentialPoolAddRequest,
  HermesMcpServerCreateRequest,
  HermesModelAssignmentRequest,
  HermesSkillCreateRequest,
  HermesWebhookCreateRequest,
  HermesEnvVarUpdateRequest,
} from "@burner-io/hermes/contracts";

import { hermesUiApi } from "@/lib/hermes/client";

export const hermesUiKeys = {
  all: ["hermes-ui"] as const,
  status: () => [...hermesUiKeys.all, "status"] as const,
  profiles: () => [...hermesUiKeys.all, "profiles"] as const,
  skills: (profile?: string) => [...hermesUiKeys.all, "skills", profile ?? null] as const,
  models: (profile?: string) => [...hermesUiKeys.all, "models", profile ?? null] as const,
  mcp: (profile?: string) => [...hermesUiKeys.all, "mcp", profile ?? null] as const,
  tools: (profile?: string) => [...hermesUiKeys.all, "tools", profile ?? null] as const,
  cron: (profile?: string) => [...hermesUiKeys.all, "cron", profile ?? null] as const,
  memory: () => [...hermesUiKeys.all, "memory"] as const,
  providers: () => [...hermesUiKeys.all, "providers"] as const,
  credentials: () => [...hermesUiKeys.all, "credentials"] as const,
  webhooks: () => [...hermesUiKeys.all, "webhooks"] as const,
  plugins: () => [...hermesUiKeys.all, "plugins"] as const,
  analytics: (days: number, profile?: string) => [...hermesUiKeys.all, "analytics", days, profile ?? null] as const,
  updates: () => [...hermesUiKeys.all, "updates"] as const,
  config: (profile?: string) => [...hermesUiKeys.all, "config", profile ?? null] as const,
  env: (profile?: string) => [...hermesUiKeys.all, "env", profile ?? null] as const,
  files: (path?: string) => [...hermesUiKeys.all, "files", path ?? null] as const,
  git: (path: string) => [...hermesUiKeys.all, "git", path] as const,
  logs: (input: { lines?: number; level?: string; component?: string; search?: string }) => [...hermesUiKeys.all, "logs", input] as const,
  learning: (profile?: string) => [...hermesUiKeys.all, "learning", profile ?? null] as const,
  messaging: (profile?: string) => [...hermesUiKeys.all, "messaging", profile ?? null] as const,
  portal: (profile?: string) => [...hermesUiKeys.all, "portal", profile ?? null] as const,
  voices: (profile?: string) => [...hermesUiKeys.all, "voices", profile ?? null] as const,
  sessions: (input: { limit?: number; offset?: number; profile?: string }) =>
    [...hermesUiKeys.all, "sessions", input] as const,
  kanban: (board?: string) => [...hermesUiKeys.all, "kanban", board ?? null] as const,
  run: (runId?: string) => [...hermesUiKeys.all, "run", runId ?? null] as const,
};

export function useHermesStatus() {
  return useQuery({ queryKey: hermesUiKeys.status(), queryFn: hermesUiApi.status });
}

export function useHermesProfiles() {
  return useQuery({ queryKey: hermesUiKeys.profiles(), queryFn: hermesUiApi.profiles });
}

export function useSetHermesProfile() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: hermesUiApi.setProfile,
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: hermesUiKeys.profiles() }),
        client.invalidateQueries({ queryKey: hermesUiKeys.status() }),
        client.invalidateQueries({ queryKey: hermesUiKeys.all }),
      ]);
    },
  });
}

export function useHermesSkills(profile?: string) {
  return useQuery({ queryKey: hermesUiKeys.skills(profile), queryFn: () => hermesUiApi.skills(profile) });
}
export function useToggleHermesSkill() {
  const client = useQueryClient();
  return useMutation({ mutationFn: hermesUiApi.toggleSkill, onSuccess: async () => client.invalidateQueries({ queryKey: [...hermesUiKeys.all, "skills"] }) });
}
export function useCreateHermesSkill() {
  const client = useQueryClient();
  return useMutation({ mutationFn: (input: HermesSkillCreateRequest) => hermesUiApi.createSkill(input), onSuccess: async () => client.invalidateQueries({ queryKey: [...hermesUiKeys.all, "skills"] }) });
}

export function useHermesModels(profile?: string) {
  return useQuery({ queryKey: hermesUiKeys.models(profile), queryFn: () => hermesUiApi.models(profile) });
}
export function useSetHermesModel() {
  const client = useQueryClient();
  return useMutation({ mutationFn: (input: HermesModelAssignmentRequest) => hermesUiApi.setModel(input), onSuccess: async () => client.invalidateQueries({ queryKey: [...hermesUiKeys.all, "models"] }) });
}

export function useHermesMcp(profile?: string) {
  return useQuery({ queryKey: hermesUiKeys.mcp(profile), queryFn: () => hermesUiApi.mcp(profile) });
}
export function useToggleHermesMcp() {
  const client = useQueryClient();
  return useMutation({ mutationFn: hermesUiApi.toggleMcp, onSuccess: async () => client.invalidateQueries({ queryKey: [...hermesUiKeys.all, "mcp"] }) });
}
export function useCreateHermesMcp() {
  const client = useQueryClient();
  return useMutation({ mutationFn: (input: HermesMcpServerCreateRequest) => hermesUiApi.createMcp(input), onSuccess: async () => client.invalidateQueries({ queryKey: [...hermesUiKeys.all, "mcp"] }) });
}
export function useTestHermesMcp() { return useMutation({ mutationFn: hermesUiApi.testMcp }); }
export function useRemoveHermesMcp() {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ name, profile }: { name: string; profile?: string }) => hermesUiApi.removeMcp(name, profile), onSuccess: async () => client.invalidateQueries({ queryKey: [...hermesUiKeys.all, "mcp"] }) });
}

export function useHermesTools(profile?: string) {
  return useQuery({ queryKey: hermesUiKeys.tools(profile), queryFn: () => hermesUiApi.tools(profile) });
}
export function useToggleHermesToolset() {
  const client = useQueryClient();
  return useMutation({ mutationFn: hermesUiApi.toggleToolset, onSuccess: async () => client.invalidateQueries({ queryKey: [...hermesUiKeys.all, "tools"] }) });
}
export function useSetHermesTerminalBackend() {
  const client = useQueryClient();
  return useMutation({ mutationFn: hermesUiApi.setTerminalBackend, onSuccess: async () => client.invalidateQueries({ queryKey: [...hermesUiKeys.all, "tools"] }) });
}

export function useHermesCron(profile?: string) {
  return useQuery({ queryKey: hermesUiKeys.cron(profile), queryFn: () => hermesUiApi.cron(profile) });
}
export function useCreateHermesCron() {
  const client = useQueryClient();
  return useMutation({ mutationFn: (input: HermesCronJobCreateRequest & { profile?: string }) => hermesUiApi.createCron(input), onSuccess: async () => client.invalidateQueries({ queryKey: [...hermesUiKeys.all, "cron"] }) });
}
export function useHermesCronAction() {
  const client = useQueryClient();
  return useMutation({ mutationFn: hermesUiApi.cronAction, onSuccess: async () => client.invalidateQueries({ queryKey: [...hermesUiKeys.all, "cron"] }) });
}
export function useRemoveHermesCron() {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ id, profile }: { id: string; profile?: string }) => hermesUiApi.removeCron(id, profile), onSuccess: async () => client.invalidateQueries({ queryKey: [...hermesUiKeys.all, "cron"] }) });
}

export function useHermesMemory() { return useQuery({ queryKey: hermesUiKeys.memory(), queryFn: hermesUiApi.memory }); }
export function useSelectHermesMemory() {
  const client = useQueryClient();
  return useMutation({ mutationFn: hermesUiApi.selectMemory, onSuccess: async () => client.invalidateQueries({ queryKey: hermesUiKeys.memory() }) });
}
export function useResetHermesMemory() {
  const client = useQueryClient();
  return useMutation({ mutationFn: hermesUiApi.resetMemory, onSuccess: async () => client.invalidateQueries({ queryKey: hermesUiKeys.memory() }) });
}

export function useHermesProviders() { return useQuery({ queryKey: hermesUiKeys.providers(), queryFn: hermesUiApi.providers }); }
export function useHermesProviderAction() {
  const client = useQueryClient();
  return useMutation({ mutationFn: hermesUiApi.providerAction, onSuccess: async () => client.invalidateQueries({ queryKey: hermesUiKeys.providers() }) });
}

export function useHermesCredentials() { return useQuery({ queryKey: hermesUiKeys.credentials(), queryFn: hermesUiApi.credentials }); }
export function useAddHermesCredential() {
  const client = useQueryClient();
  return useMutation({ mutationFn: (input: HermesCredentialPoolAddRequest) => hermesUiApi.addCredential(input), onSuccess: async () => client.invalidateQueries({ queryKey: hermesUiKeys.credentials() }) });
}
export function useRemoveHermesCredential() {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ provider, index }: { provider: string; index: number }) => hermesUiApi.removeCredential(provider, index), onSuccess: async () => client.invalidateQueries({ queryKey: hermesUiKeys.credentials() }) });
}

export function useHermesWebhooks() { return useQuery({ queryKey: hermesUiKeys.webhooks(), queryFn: hermesUiApi.webhooks }); }
export function useEnableHermesWebhooks() {
  const client = useQueryClient();
  return useMutation({ mutationFn: hermesUiApi.enableWebhooks, onSuccess: async () => client.invalidateQueries({ queryKey: hermesUiKeys.webhooks() }) });
}
export function useCreateHermesWebhook() {
  const client = useQueryClient();
  return useMutation({ mutationFn: (input: HermesWebhookCreateRequest) => hermesUiApi.createWebhook(input), onSuccess: async () => client.invalidateQueries({ queryKey: hermesUiKeys.webhooks() }) });
}
export function useToggleHermesWebhook() {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ name, enabled }: { name: string; enabled: boolean }) => hermesUiApi.toggleWebhook(name, enabled), onSuccess: async () => client.invalidateQueries({ queryKey: hermesUiKeys.webhooks() }) });
}

export function useHermesPlugins() { return useQuery({ queryKey: hermesUiKeys.plugins(), queryFn: hermesUiApi.plugins }); }
export function useHermesPluginAction() {
  const client = useQueryClient();
  return useMutation({ mutationFn: hermesUiApi.pluginAction, onSuccess: async () => client.invalidateQueries({ queryKey: hermesUiKeys.plugins() }) });
}

export function useHermesAnalytics(days = 30, profile?: string) {
  return useQuery({ queryKey: hermesUiKeys.analytics(days, profile), queryFn: () => hermesUiApi.analytics(days, profile) });
}

export function useHermesGatewayAction() {
  const client = useQueryClient();
  return useMutation({ mutationFn: hermesUiApi.gatewayAction, onSuccess: async () => client.invalidateQueries({ queryKey: hermesUiKeys.status() }) });
}

export function useHermesUpdates() { return useQuery({ queryKey: hermesUiKeys.updates(), queryFn: () => hermesUiApi.updates(false) }); }
export function useApplyHermesUpdate() {
  const client = useQueryClient();
  return useMutation({ mutationFn: hermesUiApi.applyUpdate, onSuccess: async () => client.invalidateQueries({ queryKey: hermesUiKeys.updates() }) });
}

export function useHermesConfig(profile?: string) {
  return useQuery({ queryKey: hermesUiKeys.config(profile), queryFn: () => hermesUiApi.config(profile) });
}

export function useHermesEnv(profile?: string) {
  return useQuery({ queryKey: hermesUiKeys.env(profile), queryFn: () => hermesUiApi.env(profile) });
}
export function useSetHermesEnv() {
  const client = useQueryClient();
  return useMutation({ mutationFn: (input: HermesEnvVarUpdateRequest) => hermesUiApi.setEnv(input), onSuccess: async () => client.invalidateQueries({ queryKey: [...hermesUiKeys.all, "env"] }) });
}
export function useRemoveHermesEnv() {
  const client = useQueryClient();
  return useMutation({ mutationFn: (input: { key: string; profile?: string | null }) => hermesUiApi.removeEnv(input), onSuccess: async () => client.invalidateQueries({ queryKey: [...hermesUiKeys.all, "env"] }) });
}

export function useHermesFiles(path?: string) {
  return useQuery({ queryKey: hermesUiKeys.files(path), queryFn: () => hermesUiApi.files(path) });
}

export function useHermesGit(path?: string) {
  return useQuery({ queryKey: hermesUiKeys.git(path ?? ""), queryFn: () => hermesUiApi.git(path!), enabled: Boolean(path) });
}

export function useHermesOperation() {
  return useMutation({ mutationFn: hermesUiApi.operation });
}

export function useHermesLogs(input: { lines?: number; level?: string; component?: string; search?: string } = {}) {
  return useQuery({ queryKey: hermesUiKeys.logs(input), queryFn: () => hermesUiApi.logs(input) });
}

export function useHermesLearning(profile?: string) {
  return useQuery({ queryKey: hermesUiKeys.learning(profile), queryFn: () => hermesUiApi.learning(profile) });
}
export function useHermesCuratorAction() {
  const client = useQueryClient();
  return useMutation({ mutationFn: hermesUiApi.curatorAction, onSuccess: async () => client.invalidateQueries({ queryKey: [...hermesUiKeys.all, "learning"] }) });
}

export function useHermesMessaging(profile?: string) {
  return useQuery({ queryKey: hermesUiKeys.messaging(profile), queryFn: () => hermesUiApi.messaging(profile) });
}
export function useHermesMessagingAction() {
  const client = useQueryClient();
  return useMutation({ mutationFn: hermesUiApi.messagingAction, onSuccess: async () => client.invalidateQueries({ queryKey: [...hermesUiKeys.all, "messaging"] }) });
}

export function useHermesPortal(profile?: string) {
  return useQuery({ queryKey: hermesUiKeys.portal(profile), queryFn: () => hermesUiApi.portal(profile) });
}

export function useHermesVoices(profile?: string) {
  return useQuery({ queryKey: hermesUiKeys.voices(profile), queryFn: () => hermesUiApi.voices(profile) });
}
export function useHermesSpeak() {
  return useMutation({ mutationFn: ({ text, profile }: { text: string; profile?: string }) => hermesUiApi.speak(text, profile) });
}

export function useHermesSessions(input: { limit?: number; offset?: number; profile?: string } = {}) {
  return useQuery({ queryKey: hermesUiKeys.sessions(input), queryFn: () => hermesUiApi.sessions(input) });
}
export function useHermesKanban(board?: string) {
  return useQuery({ queryKey: hermesUiKeys.kanban(board), queryFn: () => hermesUiApi.kanban(board) });
}
export function useCreateHermesRun() { return useMutation({ mutationFn: (input: HermesApiRunCreateRequest) => hermesUiApi.createRun(input) }); }
export function useHermesRun(runId?: string) {
  return useQuery({
    queryKey: hermesUiKeys.run(runId),
    queryFn: () => hermesUiApi.run(runId!),
    enabled: Boolean(runId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status && ["completed", "failed", "cancelled", "waiting"].includes(status) ? false : 1_000;
    },
  });
}
export function useApproveHermesRun() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ runId, choice, approvalId }: { runId: string; choice: HermesApiRunApprovalChoice; approvalId?: string }) =>
      hermesUiApi.approveRun(runId, { choice, ...(approvalId ? { approval_id: approvalId } : {}) }),
    onSuccess: async (_, variables) => client.invalidateQueries({ queryKey: hermesUiKeys.run(variables.runId) }),
  });
}
export function useStopHermesRun() {
  const client = useQueryClient();
  return useMutation({ mutationFn: (runId: string) => hermesUiApi.stopRun(runId), onSuccess: async (_, runId) => client.invalidateQueries({ queryKey: hermesUiKeys.run(runId) }) });
}
