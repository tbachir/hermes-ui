import { NextResponse } from "next/server";
import { requireHermesMutationAccess } from "@/lib/hermes/access";
import { hermesRouteError } from "@/lib/hermes/errors";

import type { HermesApiRunCreateRequest } from "@burner-io/hermes/contracts";
import { getHermesApiServer } from "@/lib/hermes/server";

export async function POST(request: Request) {
  const access = await requireHermesMutationAccess(request);
  if (!access.ok) return access.response;

  try {
    const body = (await request.json()) as Partial<HermesApiRunCreateRequest>;
    const input = typeof body.input === "string" ? body.input.trim() : "";

    if (!input) {
      return NextResponse.json({ error: "input_required" }, { status: 400 });
    }

    const payload: HermesApiRunCreateRequest = {
      input,
      ...(body.session_id ? { session_id: body.session_id } : {}),
      ...(body.instructions ? { instructions: body.instructions } : {}),
      ...(body.conversation_history ? { conversation_history: body.conversation_history } : {}),
      ...(body.previous_response_id ? { previous_response_id: body.previous_response_id } : {}),
      ...(body.provider ? { provider: body.provider } : {}),
      ...(body.model ? { model: body.model } : {}),
      ...(body.model_options ? { model_options: body.model_options } : {}),
    };

    return NextResponse.json(
      await getHermesApiServer().runs.create(payload),
      { status: 201 },
    );
  } catch (error) {
    return hermesRouteError(error);
  }
}
