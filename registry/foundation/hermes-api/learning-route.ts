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
    const [graph, curator] = await Promise.all([client.learning.graph(profile), client.curator.status()]);
    return NextResponse.json({ graph, curator });
  } catch (error) { return hermesRouteError(error); }
}

export async function POST(request: Request) {
  const access = await requireHermesMutationAccess(request);
  if (!access.ok) return access.response;
  try {
    const body = (await request.json()) as { action?: "run" | "pause" | "resume" };
    const curator = getHermesManagementClient().curator;
    if (body.action === "run") return NextResponse.json(await curator.run());
    if (body.action === "pause") return NextResponse.json(await curator.setPaused(true));
    if (body.action === "resume") return NextResponse.json(await curator.setPaused(false));
    return NextResponse.json({ error: "unsupported_action" }, { status: 400 });
  } catch (error) { return hermesRouteError(error); }
}
