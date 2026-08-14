import type {
  HermesApiRun,
  HermesApiRunApprovalRequest,
  HermesApiRunCreateRequest,
  HermesApiRunCreateResponse,
  HermesApiServerCapabilities,
  HermesApiServerModelsResponse,
} from "@burner-io/hermes/contracts";

export interface HermesStatusView {
  health: Record<string, unknown>;
  capabilities: HermesApiServerCapabilities;
}

export interface HermesModelsView {
  models: HermesApiServerModelsResponse;
  options: unknown;
}

export interface HermesSkillView {
  name: string;
  description?: string;
  category?: string;
  [key: string]: unknown;
}

export interface HermesToolsetView {
  name: string;
  label?: string;
  description?: string;
  enabled?: boolean;
  configured?: boolean;
  tools?: string[];
  [key: string]: unknown;
}

export interface HermesSkillsView { skills: HermesSkillView[] }
export interface HermesToolsetsView { toolsets: HermesToolsetView[]; platform?: string }

export interface HermesUiSession {
  id: string;
  title?: string;
  preview?: string;
  profile?: string;
  model?: string;
  is_active: boolean;
  message_count: number;
  tool_call_count: number;
  input_tokens: number;
  output_tokens: number;
  last_active: number;
  [key: string]: unknown;
}

export interface HermesUiMessage {
  id?: string | number;
  row_id?: string | number;
  role?: string;
  name?: string;
  content?: unknown;
  text?: unknown;
  [key: string]: unknown;
}

export interface HermesSessionsView { sessions: HermesUiSession[]; pagination?: unknown }
export interface HermesSessionView {
  detail: HermesUiSession;
  messages: { messages: HermesUiMessage[]; pagination?: unknown };
}

export class HermesUiApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, body: unknown) {
    super(
      typeof body === "object" && body !== null && "message" in body &&
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
  if (!response.ok) throw new HermesUiApiError(response.status, body);
  return body as T;
}

export const hermesUiApi = {
  status: () => requestJson<HermesStatusView>("/api/hermes/status"),
  models: () => requestJson<HermesModelsView>("/api/hermes/models"),
  skills: () => requestJson<HermesSkillsView>("/api/hermes/skills"),
  tools: () => requestJson<HermesToolsetsView>("/api/hermes/tools"),
  sessions: (input: { limit?: number; offset?: number } = {}) => {
    const query = new URLSearchParams();
    if (input.limit !== undefined) query.set("limit", String(input.limit));
    if (input.offset !== undefined) query.set("offset", String(input.offset));
    return requestJson<HermesSessionsView>(`/api/hermes/sessions${query.size ? `?${query}` : ""}`);
  },
  session: (sessionId: string) =>
    requestJson<HermesSessionView>(`/api/hermes/sessions?sessionId=${encodeURIComponent(sessionId)}`),
  createRun: (input: HermesApiRunCreateRequest) =>
    requestJson<HermesApiRunCreateResponse>("/api/hermes/runs", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  run: (runId: string) =>
    requestJson<HermesApiRun>(`/api/hermes/runs/${encodeURIComponent(runId)}`),
  approveRun: (runId: string, input: HermesApiRunApprovalRequest) =>
    requestJson<unknown>(`/api/hermes/runs/${encodeURIComponent(runId)}/approval`, {
      method: "POST",
      body: JSON.stringify(input),
    }),
  stopRun: (runId: string) =>
    requestJson<unknown>(`/api/hermes/runs/${encodeURIComponent(runId)}`, {
      method: "DELETE",
    }),
};
