import "server-only";

import {
  createApiServerApi,
  type HermesApiServerApi,
} from "@burner-io/hermes";

import { getHermesServerEnv } from "@/lib/hermes/env";

let apiServerClient: HermesApiServerApi | undefined;

/**
 * Single trusted Hermes connection for the consuming application.
 *
 * The Hermes API Server exposes the stable machine-facing surface used by
 * external UIs and orchestrators: `/v1/*`, selected `/api/*`, and `/health/*`.
 * Authenticated calls use the same API_SERVER_KEY bearer credential.
 */
export function getHermesApiServer(): HermesApiServerApi {
  if (apiServerClient) return apiServerClient;

  const env = getHermesServerEnv();
  apiServerClient = createApiServerApi({
    baseUrl: env.url,
    apiKey: env.apiKey,
  });

  return apiServerClient;
}
