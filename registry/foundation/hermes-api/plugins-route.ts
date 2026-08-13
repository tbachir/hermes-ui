import { NextResponse } from "next/server";
import { requireHermesAccess, requireHermesMutationAccess } from "@/lib/hermes/access";
import { hermesRouteError } from "@/lib/hermes/errors";
import { getHermesManagementClient } from "@/lib/hermes/server";

export async function GET() {
  const access = await requireHermesAccess();
  if (!access.ok) return access.response;
  try {
    return NextResponse.json(await getHermesManagementClient().plugins.list());
  } catch (error) {
    return hermesRouteError(error);
  }
}

export async function POST(request: Request) {
  const access = await requireHermesMutationAccess(request);
  if (!access.ok) return access.response;
  try {
    const body = (await request.json()) as { action?: "rescan" | "enable" | "disable" | "update"; name?: string };
    const api = getHermesManagementClient().plugins;
    if (body.action === "rescan") return NextResponse.json(await api.rescan());
    if (!body.name?.trim() || !body.action) return NextResponse.json({ error: "name_and_action_required" }, { status: 400 });
    if (body.action === "enable") return NextResponse.json(await api.enable(body.name));
    if (body.action === "disable") return NextResponse.json(await api.disable(body.name));
    return NextResponse.json(await api.update(body.name));
  } catch (error) {
    return hermesRouteError(error);
  }
}
