import { NextResponse } from "next/server";
import { requireHermesAccess } from "@/lib/hermes/access";
import { hermesRouteError } from "@/lib/hermes/errors";
import { getHermesManagementClient } from "@/lib/hermes/server";

export async function GET(request: Request) {
  const access = await requireHermesAccess();
  if (!access.ok) return access.response;
  try {
    const url = new URL(request.url);
    const daysRaw = Number(url.searchParams.get("days") ?? 30);
    const days = Number.isFinite(daysRaw) ? Math.min(Math.max(Math.trunc(daysRaw), 1), 365) : 30;
    const profile = url.searchParams.get("profile") ?? undefined;
    return NextResponse.json(await getHermesManagementClient().analytics.usage({ days, ...(profile ? { profile } : {}) }));
  } catch (error) {
    return hermesRouteError(error);
  }
}
