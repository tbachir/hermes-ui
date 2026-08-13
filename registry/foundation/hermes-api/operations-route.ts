import { NextResponse } from "next/server";
import { requireHermesMutationAccess } from "@/lib/hermes/access";
import { hermesRouteError } from "@/lib/hermes/errors";
import { getHermesManagementClient } from "@/lib/hermes/server";

export async function POST(request: Request) {
  const access = await requireHermesMutationAccess(request);
  if (!access.ok) return access.response;
  try {
    const body = (await request.json()) as { action?: "doctor" | "security-audit" };
    const api = getHermesManagementClient().operations;
    if (body.action === "doctor") return NextResponse.json(await api.doctor());
    if (body.action === "security-audit") return NextResponse.json(await api.securityAudit());
    return NextResponse.json({ error: "unsupported_action" }, { status: 400 });
  } catch (error) { return hermesRouteError(error); }
}
