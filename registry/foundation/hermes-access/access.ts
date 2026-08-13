import "server-only";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export interface HermesAccessContext {
  userId: string;
  claims: Record<string, unknown>;
}

export type HermesAccessResult =
  | { ok: true; value: HermesAccessContext }
  | { ok: false; response: NextResponse };

function allowedUserIds(): Set<string> {
  return new Set(
    (process.env.HERMES_UI_ALLOWED_USER_IDS ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
  );
}

export async function requireHermesAccess(): Promise<HermesAccessResult> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims as Record<string, unknown> | undefined;
  const userId = typeof claims?.sub === "string" ? claims.sub : undefined;

  if (error || !userId || !claims) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "unauthorized" },
        { status: 401 },
      ),
    };
  }

  const allowed = allowedUserIds();

  if (allowed.size === 0) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: "hermes_access_not_configured",
          message: "Set HERMES_UI_ALLOWED_USER_IDS before exposing Hermes controls.",
        },
        { status: 503 },
      ),
    };
  }

  if (!allowed.has("*") && !allowed.has(userId)) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "forbidden" },
        { status: 403 },
      ),
    };
  }

  return { ok: true, value: { userId, claims } };
}


export async function requireHermesMutationAccess(
  request: Request,
): Promise<HermesAccessResult> {
  const access = await requireHermesAccess();
  if (!access.ok) return access;

  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "cross_origin_mutation_forbidden" },
        { status: 403 },
      ),
    };
  }

  return access;
}

function normalizeRemotePath(value: string): string | null {
  const normalized = value.trim().replaceAll("\\", "/").replace(/\/{2,}/g, "/").replace(/\/$/, "");
  if (!normalized) return null;
  if (normalized.split("/").some((segment) => segment === "..")) return null;
  return normalized.toLowerCase();
}

export function isHermesRemotePathAllowed(path: string, rawRoots: string): boolean {
  const candidate = normalizeRemotePath(path);
  if (!candidate) return false;
  const roots = rawRoots
    .split(",")
    .map(normalizeRemotePath)
    .filter((value): value is string => Boolean(value));
  if (roots.length === 0) return false;
  return roots.some((root) => candidate === root || candidate.startsWith(`${root}/`));
}
