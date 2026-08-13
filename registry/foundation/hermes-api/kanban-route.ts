import { NextResponse } from "next/server";
import { requireHermesAccess } from "@/lib/hermes/access";
import { hermesRouteError } from "@/lib/hermes/errors";

import { getHermesManagementClient } from "@/lib/hermes/server";

export async function GET(request: Request) {
  const access = await requireHermesAccess();
  if (!access.ok) return access.response;

  try {
    const url = new URL(request.url);
    const board = url.searchParams.get("board")?.trim() || undefined;
    const client = getHermesManagementClient();

    if (!client.kanban) {
      return NextResponse.json(
        { error: "kanban_unavailable" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      await client.kanban.board({
        ...(board ? { board } : {}),
        include_archived: false,
      }),
    );
  } catch (error) {
    return hermesRouteError(error);
  }
}
