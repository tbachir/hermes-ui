import { NextResponse } from "next/server";
import { requireHermesMutationAccess } from "@/lib/hermes/access";
import { hermesRouteError } from "@/lib/hermes/errors";

import type { HermesApiRunApprovalChoice } from "@burner-io/hermes/contracts";
import { getHermesApiServer } from "@/lib/hermes/server";

type Context = { params: Promise<{ runId: string }> };

const choices = new Set<HermesApiRunApprovalChoice>([
  "once",
  "session",
  "always",
  "deny",
]);

export async function POST(request: Request, context: Context) {
  const access = await requireHermesMutationAccess(request);
  if (!access.ok) return access.response;

  try {
    const { runId } = await context.params;
    const body = (await request.json()) as {
      choice?: HermesApiRunApprovalChoice;
      approval_id?: string;
    };

    if (!body.choice || !choices.has(body.choice)) {
      return NextResponse.json({ error: "invalid_approval_choice" }, { status: 400 });
    }

    return NextResponse.json(
      await getHermesApiServer().runs.approve(runId, {
        choice: body.choice,
        ...(body.approval_id ? { approval_id: body.approval_id } : {}),
      }),
    );
  } catch (error) {
    return hermesRouteError(error);
  }
}
