import "server-only";

import { NextResponse } from "next/server";
import { getAppUser, type AppUser } from "@/lib/app-user";

export interface HermesAccessContext {
  userId: string;
  user: AppUser;
}

export type HermesAccessResult =
  | { ok: true; value: HermesAccessContext }
  | { ok: false; response: NextResponse };

function csv(value: string | undefined): Set<string> {
  return new Set(
    (value ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  );
}

function userRoles(user: AppUser): Set<string> {
  return csv(user.role);
}

export async function requireHermesAccess(): Promise<HermesAccessResult> {
  const user = await getAppUser();
  if (!user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "unauthorized" }, { status: 401 }),
    };
  }

  if (user.demo) return { ok: true, value: { userId: user.id, user } };

  const allowedIds = csv(process.env.HERMES_UI_ALLOWED_USER_IDS);
  const configuredRoles = csv(process.env.HERMES_UI_ALLOWED_ROLES);
  const allowedRoles = configuredRoles.size > 0 ? configuredRoles : new Set(["admin"]);
  const roles = userRoles(user);

  const idAllowed = allowedIds.has("*") || allowedIds.has(user.id);
  const roleAllowed = [...roles].some((role) => allowedRoles.has(role));

  if (!idAllowed && !roleAllowed) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: "forbidden",
          message: "This application user is not allowed to operate Hermes.",
        },
        { status: 403 },
      ),
    };
  }

  return { ok: true, value: { userId: user.id, user } };
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
