import { NextResponse } from "next/server";
import { requireHermesAccess } from "@/lib/hermes/access";
import { hermesRouteError } from "@/lib/hermes/errors";
import { getHermesManagementClient } from "@/lib/hermes/server";

export async function GET(request: Request) {
  const access = await requireHermesAccess();
  if (!access.ok) return access.response;
  try {
    const url = new URL(request.url);
    const requested = Number(url.searchParams.get("lines") ?? 200);
    const lines = Number.isFinite(requested) ? Math.min(Math.max(Math.trunc(requested), 20), 500) : 200;
    const level = url.searchParams.get("level") ?? undefined;
    const component = url.searchParams.get("component") ?? undefined;
    const search = url.searchParams.get("search") ?? undefined;
    return NextResponse.json(await getHermesManagementClient().logs.get({ lines, ...(level ? { level } : {}), ...(component ? { component } : {}), ...(search ? { search } : {}) }));
  } catch (error) { return hermesRouteError(error); }
}
