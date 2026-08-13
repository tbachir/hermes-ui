import { NextResponse } from "next/server";
import { requireHermesAccess, requireHermesMutationAccess } from "@/lib/hermes/access";
import { hermesRouteError } from "@/lib/hermes/errors";
import { getHermesManagementClient } from "@/lib/hermes/server";

export async function GET() {
  const access = await requireHermesAccess();
  if (!access.ok) return access.response;
  try {
    return NextResponse.json(await getHermesManagementClient().memory.status());
  } catch (error) {
    return hermesRouteError(error);
  }
}

export async function PATCH(request: Request) {
  const access = await requireHermesMutationAccess(request);
  if (!access.ok) return access.response;
  try {
    const body = (await request.json()) as { action?: "select" | "reset"; provider?: string; target?: string };
    const api = getHermesManagementClient().memory;
    if (body.action === "select") {
      if (!body.provider?.trim()) return NextResponse.json({ error: "provider_required" }, { status: 400 });
      return NextResponse.json(await api.select({ provider: body.provider }));
    }
    if (body.action === "reset") {
      return NextResponse.json(await api.reset(body.target ? { target: body.target } : undefined));
    }
    return NextResponse.json({ error: "unsupported_action" }, { status: 400 });
  } catch (error) {
    return hermesRouteError(error);
  }
}
