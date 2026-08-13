import { NextResponse } from "next/server";
import { requireHermesAccess, requireHermesMutationAccess } from "@/lib/hermes/access";
import { hermesRouteError } from "@/lib/hermes/errors";
import { getHermesManagementClient } from "@/lib/hermes/server";

export async function GET() {
  const access = await requireHermesAccess();
  if (!access.ok) return access.response;
  try {
    const client = getHermesManagementClient();
    const [oauth, custom] = await Promise.all([
      client.providers.oauth.list(),
      client.providers.custom_endpoints.list(),
    ]);
    return NextResponse.json({ oauth, custom });
  } catch (error) {
    return hermesRouteError(error);
  }
}

export async function POST(request: Request) {
  const access = await requireHermesMutationAccess(request);
  if (!access.ok) return access.response;
  try {
    const body = (await request.json()) as { action?: "oauth-start" | "oauth-disconnect" | "custom-activate"; id?: string };
    if (!body.id?.trim() || !body.action) return NextResponse.json({ error: "id_and_action_required" }, { status: 400 });
    const api = getHermesManagementClient().providers;
    if (body.action === "oauth-start") return NextResponse.json(await api.oauth.start(body.id));
    if (body.action === "oauth-disconnect") return NextResponse.json(await api.oauth.disconnect(body.id));
    return NextResponse.json(await api.custom_endpoints.activate(body.id));
  } catch (error) {
    return hermesRouteError(error);
  }
}
