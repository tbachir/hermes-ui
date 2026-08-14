import { NextResponse } from "next/server";

import { requireHermesAccess } from "@/lib/hermes/access";
import { hermesRouteError } from "@/lib/hermes/errors";
import { getHermesApiServer } from "@/lib/hermes/server";

function integer(value: string | null, fallback: number, min: number, max: number) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : fallback;
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function numberValue(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const numeric = Number(value);
    if (Number.isFinite(numeric)) return numeric;
    const timestamp = Date.parse(value);
    if (Number.isFinite(timestamp)) return Math.floor(timestamp / 1000);
  }
  return fallback;
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function normalizeSession(value: unknown) {
  const session = record(value);
  const id = stringValue(session.id) ?? stringValue(session.session_id) ?? "unknown-session";
  const ended = session.ended_at !== undefined && session.ended_at !== null;
  const archived = Boolean(session.archived);

  return {
    ...session,
    id,
    title: stringValue(session.title),
    preview: stringValue(session.preview),
    profile: stringValue(session.profile) ?? stringValue(session.source) ?? "api_server",
    model: stringValue(session.model),
    is_active: !ended && !archived,
    message_count: numberValue(session.message_count),
    tool_call_count: numberValue(session.tool_call_count),
    input_tokens: numberValue(session.input_tokens),
    output_tokens: numberValue(session.output_tokens),
    last_active: numberValue(
      session.last_active,
      numberValue(session.started_at, Math.floor(Date.now() / 1000)),
    ),
  };
}

export async function GET(request: Request) {
  const access = await requireHermesAccess();
  if (!access.ok) return access.response;

  try {
    const url = new URL(request.url);
    const limit = integer(url.searchParams.get("limit"), 20, 1, 200);
    const offset = integer(url.searchParams.get("offset"), 0, 0, 1_000_000);
    const sessionId = url.searchParams.get("sessionId")?.trim() || undefined;
    const hermes = getHermesApiServer();

    if (sessionId) {
      const encoded = encodeURIComponent(sessionId);
      const [detail, messages] = await Promise.all([
        hermes.raw("GET", `/api/sessions/${encoded}`),
        hermes.raw<{ data?: unknown[]; pagination?: unknown }>(
          "GET",
          `/api/sessions/${encoded}/messages`,
          { query: { limit: 100, order: "oldest" } },
        ),
      ]);

      return NextResponse.json({
        detail: normalizeSession(detail),
        messages: {
          messages: Array.isArray(messages.data) ? messages.data : [],
          ...(messages.pagination !== undefined ? { pagination: messages.pagination } : {}),
        },
      });
    }

    const result = await hermes.raw<{
      data?: unknown[];
      sessions?: unknown[];
      pagination?: unknown;
    }>("GET", "/api/sessions", { query: { limit, offset } });

    const rows = Array.isArray(result.data)
      ? result.data
      : Array.isArray(result.sessions)
        ? result.sessions
        : [];

    return NextResponse.json({
      sessions: rows.map(normalizeSession),
      ...(result.pagination !== undefined ? { pagination: result.pagination } : {}),
    });
  } catch (error) {
    return hermesRouteError(error);
  }
}
