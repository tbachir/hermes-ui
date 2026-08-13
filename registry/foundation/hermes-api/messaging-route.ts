import { NextResponse } from "next/server";
import { requireHermesAccess, requireHermesMutationAccess } from "@/lib/hermes/access";
import { hermesRouteError } from "@/lib/hermes/errors";
import { getHermesManagementClient } from "@/lib/hermes/server";

export async function GET(request: Request) {
  const access = await requireHermesAccess();
  if (!access.ok) return access.response;
  try {
    const profile = new URL(request.url).searchParams.get("profile") ?? undefined;
    const api = getHermesManagementClient().messaging;
    const [platforms, pairing] = await Promise.all([api.platforms(profile), api.pairing.list(profile)]);
    return NextResponse.json({ platforms, pairing });
  } catch (error) { return hermesRouteError(error); }
}

export async function PATCH(request: Request) {
  const access = await requireHermesMutationAccess(request);
  if (!access.ok) return access.response;
  try {
    const body = (await request.json()) as { action?: "toggle" | "test"; platform?: string; enabled?: boolean; profile?: string };
    if (!body.platform?.trim() || !body.action) return NextResponse.json({ error: "platform_and_action_required" }, { status: 400 });
    const api = getHermesManagementClient().messaging;
    if (body.action === "test") return NextResponse.json(await api.test(body.platform, body.profile));
    if (typeof body.enabled !== "boolean") return NextResponse.json({ error: "enabled_required" }, { status: 400 });
    return NextResponse.json(await api.update(body.platform, { enabled: body.enabled, ...(body.profile ? { profile: body.profile } : {}) }));
  } catch (error) { return hermesRouteError(error); }
}
