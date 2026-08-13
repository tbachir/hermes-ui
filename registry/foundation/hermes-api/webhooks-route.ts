import { NextResponse } from "next/server";
import type { HermesWebhookCreateRequest } from "@burner-io/hermes/contracts";
import { requireHermesAccess, requireHermesMutationAccess } from "@/lib/hermes/access";
import { hermesRouteError } from "@/lib/hermes/errors";
import { getHermesManagementClient } from "@/lib/hermes/server";

export async function GET() {
  const access = await requireHermesAccess();
  if (!access.ok) return access.response;
  try {
    return NextResponse.json(await getHermesManagementClient().webhooks.list());
  } catch (error) {
    return hermesRouteError(error);
  }
}

export async function POST(request: Request) {
  const access = await requireHermesMutationAccess(request);
  if (!access.ok) return access.response;
  try {
    const body = (await request.json()) as HermesWebhookCreateRequest & { action?: "enable" };
    const api = getHermesManagementClient().webhooks;
    if (body.action === "enable") return NextResponse.json(await api.enable());
    if (!body.name?.trim()) return NextResponse.json({ error: "name_required" }, { status: 400 });
    const { action: _action, ...input } = body;
    return NextResponse.json(await api.create(input));
  } catch (error) {
    return hermesRouteError(error);
  }
}

export async function PATCH(request: Request) {
  const access = await requireHermesMutationAccess(request);
  if (!access.ok) return access.response;
  try {
    const body = (await request.json()) as { name?: string; enabled?: boolean };
    if (!body.name?.trim() || typeof body.enabled !== "boolean") return NextResponse.json({ error: "name_and_enabled_required" }, { status: 400 });
    return NextResponse.json(await getHermesManagementClient().webhooks.setEnabled(body.name, body.enabled));
  } catch (error) {
    return hermesRouteError(error);
  }
}

export async function DELETE(request: Request) {
  const access = await requireHermesMutationAccess(request);
  if (!access.ok) return access.response;
  try {
    const name = new URL(request.url).searchParams.get("name")?.trim();
    if (!name) return NextResponse.json({ error: "name_required" }, { status: 400 });
    return NextResponse.json(await getHermesManagementClient().webhooks.remove(name));
  } catch (error) {
    return hermesRouteError(error);
  }
}
