import { NextResponse } from "next/server";
import type { HermesMcpServerCreateRequest } from "@burner-io/hermes/contracts";
import { requireHermesAccess, requireHermesMutationAccess } from "@/lib/hermes/access";
import { hermesRouteError } from "@/lib/hermes/errors";
import { getHermesManagementClient } from "@/lib/hermes/server";

export async function GET(request: Request) {
  const access = await requireHermesAccess();
  if (!access.ok) return access.response;
  try {
    const profile = new URL(request.url).searchParams.get("profile") ?? undefined;
    return NextResponse.json(await getHermesManagementClient().mcp.servers(profile));
  } catch (error) {
    return hermesRouteError(error);
  }
}

export async function POST(request: Request) {
  const access = await requireHermesMutationAccess(request);
  if (!access.ok) return access.response;
  try {
    const body = (await request.json()) as HermesMcpServerCreateRequest;
    if (!body.name?.trim() || (!body.url?.trim() && !body.command?.trim())) {
      return NextResponse.json({ error: "name_and_transport_required" }, { status: 400 });
    }
    return NextResponse.json(await getHermesManagementClient().mcp.create(body));
  } catch (error) {
    return hermesRouteError(error);
  }
}

export async function PATCH(request: Request) {
  const access = await requireHermesMutationAccess(request);
  if (!access.ok) return access.response;
  try {
    const body = (await request.json()) as {
      action?: "toggle" | "test";
      name?: string;
      enabled?: boolean;
      profile?: string;
    };
    if (!body.name?.trim() || !body.action) {
      return NextResponse.json({ error: "action_and_name_required" }, { status: 400 });
    }
    const api = getHermesManagementClient().mcp;
    if (body.action === "test") {
      return NextResponse.json(await api.test(body.name, body.profile));
    }
    if (typeof body.enabled !== "boolean") {
      return NextResponse.json({ error: "enabled_required" }, { status: 400 });
    }
    return NextResponse.json(await api.toggle(body.name, {
      enabled: body.enabled,
      ...(body.profile ? { profile: body.profile } : {}),
    }));
  } catch (error) {
    return hermesRouteError(error);
  }
}

export async function DELETE(request: Request) {
  const access = await requireHermesMutationAccess(request);
  if (!access.ok) return access.response;
  try {
    const url = new URL(request.url);
    const name = url.searchParams.get("name")?.trim();
    const profile = url.searchParams.get("profile") ?? undefined;
    if (!name) return NextResponse.json({ error: "name_required" }, { status: 400 });
    return NextResponse.json(await getHermesManagementClient().mcp.remove(name, profile));
  } catch (error) {
    return hermesRouteError(error);
  }
}
