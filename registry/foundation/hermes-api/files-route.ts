import { NextResponse } from "next/server";
import { requireHermesAccess } from "@/lib/hermes/access";
import { hermesRouteError } from "@/lib/hermes/errors";
import { getHermesManagementClient } from "@/lib/hermes/server";

export async function GET(request: Request) {
  const access = await requireHermesAccess();
  if (!access.ok) return access.response;
  try {
    const path = new URL(request.url).searchParams.get("path") ?? undefined;
    return NextResponse.json(await getHermesManagementClient().filesystem.managed.list(path));
  } catch (error) { return hermesRouteError(error); }
}
