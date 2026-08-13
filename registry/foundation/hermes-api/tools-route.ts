import { NextResponse } from "next/server";
import { requireHermesAccess, requireHermesMutationAccess } from "@/lib/hermes/access";
import { hermesRouteError } from "@/lib/hermes/errors";
import { getHermesManagementClient } from "@/lib/hermes/server";

export async function GET(request: Request) {
  const access = await requireHermesAccess();
  if (!access.ok) return access.response;
  try {
    const profile = new URL(request.url).searchParams.get("profile") ?? undefined;
    const client = getHermesManagementClient();
    const [toolsets, terminal, computerUse] = await Promise.all([
      client.tools.list(profile),
      client.tools.terminalBackends(profile),
      client.tools.computerUseStatus(profile),
    ]);
    return NextResponse.json({ toolsets, terminal, computerUse });
  } catch (error) {
    return hermesRouteError(error);
  }
}

export async function PATCH(request: Request) {
  const access = await requireHermesMutationAccess(request);
  if (!access.ok) return access.response;
  try {
    const body = (await request.json()) as {
      action?: "toggle" | "terminal";
      name?: string;
      enabled?: boolean;
      backend?: string;
      profile?: string;
    };
    const api = getHermesManagementClient().tools;
    if (body.action === "toggle") {
      if (!body.name?.trim() || typeof body.enabled !== "boolean") {
        return NextResponse.json({ error: "name_and_enabled_required" }, { status: 400 });
      }
      return NextResponse.json(await api.toggle(body.name, {
        enabled: body.enabled,
        ...(body.profile ? { profile: body.profile } : {}),
      }));
    }
    if (body.action === "terminal") {
      if (!body.backend?.trim()) return NextResponse.json({ error: "backend_required" }, { status: 400 });
      return NextResponse.json(await api.selectTerminalBackend({
        backend: body.backend,
        ...(body.profile ? { profile: body.profile } : {}),
      }));
    }
    return NextResponse.json({ error: "unsupported_action" }, { status: 400 });
  } catch (error) {
    return hermesRouteError(error);
  }
}
