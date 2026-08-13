import "server-only";

import { HermesHttpError } from "@burner-io/hermes";
import { NextResponse } from "next/server";

export function hermesRouteError(error: unknown): NextResponse {
  if (error instanceof HermesHttpError) {
    return NextResponse.json(
      {
        error: "hermes_upstream_error",
        message: error.message,
        status: error.status,
        detail: error.body,
      },
      { status: error.status >= 400 && error.status < 600 ? error.status : 502 },
    );
  }

  const message = error instanceof Error ? error.message : "Unknown Hermes error";

  return NextResponse.json(
    { error: "hermes_error", message },
    { status: 500 },
  );
}
