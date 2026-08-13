import type {
  HermesAnalyticsResponse,
  HermesApiRun,
  HermesApiRunApprovalChoice,
  HermesApiRunCreateRequest,
  HermesApiRunCreateResponse,
  HermesAuxiliaryModelsResponse,
  HermesAutomationBlueprint,
  HermesBackendUpdateCheckResponse,
  HermesCredentialPoolAddRequest,
  HermesCredentialPoolResponse,
  HermesCronDeliveryTarget,
  HermesCronJob,
  HermesCronJobCreateRequest,
  HermesDashboardPluginsResponse,
  HermesKanbanBoard,
  HermesMcpServerCreateRequest,
  HermesMcpServersResponse,
  HermesMemoryStatusResponse,
  HermesModelAssignmentRequest,
  HermesModelInfoResponse,
  HermesModelOptionsResponse,
  HermesOAuthProvidersResponse,
  HermesPaginatedSessions,
  HermesProfileInfo,
  HermesSkillCreateRequest,
  HermesSkillInfo,
  HermesSystemStatsResponse,
  HermesStatusResponse,
  HermesTerminalBackendsResponse,
  HermesToolsetInfo,
  HermesComputerUseStatus,
  HermesWebhookCreateRequest,
  HermesWebhooksResponse,
  HermesCustomEndpointsResponse,
  HermesEnvResponse,
  HermesEnvVarUpdateRequest,
  HermesManagedFilesResponse,
  HermesGitStatusResponse,
  HermesLogsResponse,
  HermesStarmapGraph,
  HermesCuratorStatusResponse,
  HermesMessagingPlatformsResponse,
  HermesPairingResponse,
  HermesPortalResponse,
  HermesElevenLabsVoicesResponse,
  HermesAudioSpeakResponse,
  HermesActionResponse,
} from "@burner-io/hermes/contracts";

export interface HermesProfilesView {
  profiles: HermesProfileInfo[];
  active: string;
  current: string;
}

export interface HermesStatusView {
  status: HermesStatusResponse;
  stats: HermesSystemStatsResponse;
}

export interface HermesModelsView {
  info: HermesModelInfoResponse;
  options: HermesModelOptionsResponse;
  auxiliary: HermesAuxiliaryModelsResponse;
}

export interface HermesToolsView {
  toolsets: HermesToolsetInfo[];
  terminal: HermesTerminalBackendsResponse;
  computerUse: HermesComputerUseStatus;
}

export interface HermesCronView {
  jobs: HermesCronJob[];
  targets: HermesCronDeliveryTarget[];
  blueprints: HermesAutomationBlueprint[];
}

export interface HermesProvidersView {
  oauth: HermesOAuthProvidersResponse;
  custom: HermesCustomEndpointsResponse;
}

export interface HermesSafeConfigView {
  config: Record<string, Record<string, unknown>>;
  categories: string[];
  fields: string[];
}

export interface HermesGitView {
  status: HermesGitStatusResponse;
  branches: unknown[];
  worktrees: unknown[];
}

export interface HermesLearningView {
  graph: HermesStarmapGraph;
  curator: HermesCuratorStatusResponse;
}

export interface HermesMessagingView {
  platforms: HermesMessagingPlatformsResponse;
  pairing: HermesPairingResponse;
}

export class HermesUiApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, body: unknown) {
    super(
      typeof body === "object" &&
        body !== null &&
        "message" in body &&
        typeof (body as { message?: unknown }).message === "string"
        ? (body as { message: string }).message
        : `Hermes UI API request failed (${status})`,
    );
    this.name = "HermesUiApiError";
    this.status = status;
    this.body = body;
  }
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      ...(init?.body ? { "content-type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  const body = await response.json().catch(() => undefined);

  if (!response.ok) {
    throw new HermesUiApiError(response.status, body);
  }

  return body as T;
}

function withProfile(path: string, profile?: string) {
  return profile ? `${path}?profile=${encodeURIComponent(profile)}` : path;
}

export const hermesUiApi = {
  status: () => requestJson<HermesStatusView>("/api/hermes/status"),
  profiles: () => requestJson<HermesProfilesView>("/api/hermes/profiles"),
  setProfile: (name: string) =>
    requestJson<{ ok: boolean; active: string }>("/api/hermes/profiles", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),

  skills: (profile?: string) =>
    requestJson<HermesSkillInfo[]>(withProfile("/api/hermes/skills", profile)),
  toggleSkill: (input: { name: string; enabled: boolean; profile?: string }) =>
    requestJson<unknown>("/api/hermes/skills", {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  createSkill: (input: HermesSkillCreateRequest) =>
    requestJson<unknown>("/api/hermes/skills", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  models: (profile?: string) =>
    requestJson<HermesModelsView>(withProfile("/api/hermes/models", profile)),
  setModel: (input: HermesModelAssignmentRequest) =>
    requestJson<unknown>("/api/hermes/models", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  mcp: (profile?: string) =>
    requestJson<HermesMcpServersResponse>(withProfile("/api/hermes/mcp", profile)),
  createMcp: (input: HermesMcpServerCreateRequest) =>
    requestJson<unknown>("/api/hermes/mcp", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  toggleMcp: (input: { name: string; enabled: boolean; profile?: string }) =>
    requestJson<unknown>("/api/hermes/mcp", {
      method: "PATCH",
      body: JSON.stringify({ action: "toggle", ...input }),
    }),
  testMcp: (input: { name: string; profile?: string }) =>
    requestJson<unknown>("/api/hermes/mcp", {
      method: "PATCH",
      body: JSON.stringify({ action: "test", ...input }),
    }),
  removeMcp: (name: string, profile?: string) => {
    const query = new URLSearchParams({ name });
    if (profile) query.set("profile", profile);
    return requestJson<unknown>(`/api/hermes/mcp?${query}`, { method: "DELETE" });
  },

  tools: (profile?: string) =>
    requestJson<HermesToolsView>(withProfile("/api/hermes/tools", profile)),
  toggleToolset: (input: { name: string; enabled: boolean; profile?: string }) =>
    requestJson<unknown>("/api/hermes/tools", {
      method: "PATCH",
      body: JSON.stringify({ action: "toggle", ...input }),
    }),
  setTerminalBackend: (input: { backend: string; profile?: string }) =>
    requestJson<unknown>("/api/hermes/tools", {
      method: "PATCH",
      body: JSON.stringify({ action: "terminal", ...input }),
    }),

  cron: (profile?: string) =>
    requestJson<HermesCronView>(withProfile("/api/hermes/cron", profile)),
  createCron: (input: HermesCronJobCreateRequest & { profile?: string }) =>
    requestJson<HermesCronJob>("/api/hermes/cron", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  cronAction: (input: { action: "pause" | "resume" | "trigger"; id: string; profile?: string }) =>
    requestJson<HermesCronJob>("/api/hermes/cron", {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  removeCron: (id: string, profile?: string) => {
    const query = new URLSearchParams({ id });
    if (profile) query.set("profile", profile);
    return requestJson<unknown>(`/api/hermes/cron?${query}`, { method: "DELETE" });
  },

  memory: () => requestJson<HermesMemoryStatusResponse>("/api/hermes/memory"),
  selectMemory: (provider: string) =>
    requestJson<unknown>("/api/hermes/memory", {
      method: "PATCH",
      body: JSON.stringify({ action: "select", provider }),
    }),
  resetMemory: (target: string = "all") =>
    requestJson<unknown>("/api/hermes/memory", {
      method: "PATCH",
      body: JSON.stringify({ action: "reset", target }),
    }),

  providers: () => requestJson<HermesProvidersView>("/api/hermes/providers"),
  providerAction: (input: { action: "oauth-start" | "oauth-disconnect" | "custom-activate"; id: string }) =>
    requestJson<unknown>("/api/hermes/providers", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  credentials: () => requestJson<HermesCredentialPoolResponse>("/api/hermes/credentials"),
  addCredential: (input: HermesCredentialPoolAddRequest) =>
    requestJson<unknown>("/api/hermes/credentials", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  removeCredential: (provider: string, index: number) =>
    requestJson<unknown>(`/api/hermes/credentials?provider=${encodeURIComponent(provider)}&index=${index}`, { method: "DELETE" }),

  webhooks: () => requestJson<HermesWebhooksResponse>("/api/hermes/webhooks"),
  enableWebhooks: () =>
    requestJson<unknown>("/api/hermes/webhooks", {
      method: "POST",
      body: JSON.stringify({ action: "enable" }),
    }),
  createWebhook: (input: HermesWebhookCreateRequest) =>
    requestJson<unknown>("/api/hermes/webhooks", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  toggleWebhook: (name: string, enabled: boolean) =>
    requestJson<unknown>("/api/hermes/webhooks", {
      method: "PATCH",
      body: JSON.stringify({ name, enabled }),
    }),
  removeWebhook: (name: string) =>
    requestJson<unknown>(`/api/hermes/webhooks?name=${encodeURIComponent(name)}`, { method: "DELETE" }),

  plugins: () => requestJson<HermesDashboardPluginsResponse>("/api/hermes/plugins"),
  pluginAction: (input: { action: "rescan" | "enable" | "disable" | "update"; name?: string }) =>
    requestJson<unknown>("/api/hermes/plugins", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  analytics: (days = 30, profile?: string) => {
    const query = new URLSearchParams({ days: String(days) });
    if (profile) query.set("profile", profile);
    return requestJson<HermesAnalyticsResponse>(`/api/hermes/analytics?${query}`);
  },

  gatewayAction: (action: "start" | "stop" | "restart") =>
    requestJson<unknown>("/api/hermes/gateway", {
      method: "POST",
      body: JSON.stringify({ action }),
    }),

  updates: (force = false) =>
    requestJson<HermesBackendUpdateCheckResponse>(`/api/hermes/updates${force ? "?force=1" : ""}`),
  applyUpdate: () => requestJson<unknown>("/api/hermes/updates", { method: "POST" }),

  config: (profile?: string) => requestJson<HermesSafeConfigView>(withProfile("/api/hermes/config", profile)),
  env: (profile?: string) => requestJson<HermesEnvResponse>(withProfile("/api/hermes/env", profile)),
  setEnv: (input: HermesEnvVarUpdateRequest) => requestJson<unknown>("/api/hermes/env", { method: "POST", body: JSON.stringify(input) }),
  removeEnv: (input: { key: string; profile?: string | null }) => requestJson<unknown>("/api/hermes/env", { method: "DELETE", body: JSON.stringify(input) }),
  files: (path?: string) => requestJson<HermesManagedFilesResponse>(`/api/hermes/files${path ? `?path=${encodeURIComponent(path)}` : ""}`),
  git: (path: string) => requestJson<HermesGitView>(`/api/hermes/git?path=${encodeURIComponent(path)}`),
  operation: (action: "doctor" | "security-audit") => requestJson<HermesActionResponse>("/api/hermes/operations", { method: "POST", body: JSON.stringify({ action }) }),
  logs: (input: { lines?: number; level?: string; component?: string; search?: string } = {}) => {
    const query = new URLSearchParams();
    if (input.lines) query.set("lines", String(input.lines));
    if (input.level) query.set("level", input.level);
    if (input.component) query.set("component", input.component);
    if (input.search) query.set("search", input.search);
    return requestJson<HermesLogsResponse>(`/api/hermes/logs${query.size ? `?${query}` : ""}`);
  },
  learning: (profile?: string) => requestJson<HermesLearningView>(withProfile("/api/hermes/learning", profile)),
  curatorAction: (action: "run" | "pause" | "resume") => requestJson<unknown>("/api/hermes/learning", { method: "POST", body: JSON.stringify({ action }) }),
  messaging: (profile?: string) => requestJson<HermesMessagingView>(withProfile("/api/hermes/messaging", profile)),
  messagingAction: (input: { action: "toggle" | "test"; platform: string; enabled?: boolean; profile?: string }) => requestJson<unknown>("/api/hermes/messaging", { method: "PATCH", body: JSON.stringify(input) }),
  portal: (profile?: string) => requestJson<HermesPortalResponse>(withProfile("/api/hermes/portal", profile)),
  voices: (profile?: string) => requestJson<HermesElevenLabsVoicesResponse>(withProfile("/api/hermes/audio", profile)),
  speak: (text: string, profile?: string) => requestJson<HermesAudioSpeakResponse>(withProfile("/api/hermes/audio", profile), { method: "POST", body: JSON.stringify({ text }) }),

  sessions: (input: { limit?: number; offset?: number; profile?: string } = {}) => {
    const query = new URLSearchParams();
    if (input.limit !== undefined) query.set("limit", String(input.limit));
    if (input.offset !== undefined) query.set("offset", String(input.offset));
    if (input.profile) query.set("profile", input.profile);
    return requestJson<HermesPaginatedSessions>(
      `/api/hermes/sessions${query.size ? `?${query}` : ""}`,
    );
  },
  kanban: (board?: string) =>
    requestJson<HermesKanbanBoard>(
      `/api/hermes/kanban${board ? `?board=${encodeURIComponent(board)}` : ""}`,
    ),
  createRun: (input: HermesApiRunCreateRequest) =>
    requestJson<HermesApiRunCreateResponse>("/api/hermes/runs", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  run: (runId: string) =>
    requestJson<HermesApiRun>(`/api/hermes/runs/${encodeURIComponent(runId)}`),
  stopRun: (runId: string) =>
    requestJson<unknown>(`/api/hermes/runs/${encodeURIComponent(runId)}`, {
      method: "DELETE",
    }),
  approveRun: (
    runId: string,
    input: { choice: HermesApiRunApprovalChoice; approval_id?: string },
  ) =>
    requestJson<unknown>(
      `/api/hermes/runs/${encodeURIComponent(runId)}/approval`,
      {
        method: "POST",
        body: JSON.stringify(input),
      },
    ),
};
