import { NextResponse } from "next/server";
import { requireHermesMutationAccess } from "@/lib/hermes/access";
import { hermesRouteError } from "@/lib/hermes/errors";
import { getHermesManagementClient } from "@/lib/hermes/server";

export async function POST(request: Request) {
  const access = await requireHermesMutationAccess(request);
  if (!access.ok) return access.response;
  try {
    const body = (await request.json()) as { action?: "start" | "stop" | "restart" };
    const api = getHermesManagementClient().gateway;
    if (body.action === "start") return NextResponse.json(await api.start());
    if (body.action === "stop") return NextResponse.json(await api.stop());
    if (body.action === "restart") return NextResponse.json(await api.restart());
    return NextResponse.json({ error: "unsupported_action" }, { status: 400 });
  } catch (error) {
    return hermesRouteError(error);
  }
}
