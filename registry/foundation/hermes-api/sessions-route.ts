import { NextResponse } from "next/server";
import { requireHermesAccess } from "@/lib/hermes/access";
import { hermesRouteError } from "@/lib/hermes/errors";

import { getHermesManagementClient } from "@/lib/hermes/server";

function integer(value: string | null, fallback: number, min: number, max: number) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : fallback;
}

export async function GET(request: Request) {
  const access = await requireHermesAccess();
  if (!access.ok) return access.response;

  try {
    const url = new URL(request.url);
    const limit = integer(url.searchParams.get("limit"), 20, 1, 100);
    const offset = integer(url.searchParams.get("offset"), 0, 0, 100_000);
    const profile = url.searchParams.get("profile")?.trim() || undefined;

    const result = await getHermesManagementClient().sessions.list({
      limit,
      offset,
      order: "recent",
      ...(profile ? { profile } : {}),
    });

    return NextResponse.json(result);
  } catch (error) {
    return hermesRouteError(error);
  }
}
