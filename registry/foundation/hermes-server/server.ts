import "server-only";

import {
  createApiServerApi,
  createHermesClientUnchecked,
  type HermesApiServerApi,
  type HermesRuntimeClient,
} from "@burner-io/hermes";

import { getHermesServerEnv } from "@/lib/hermes/env";

let apiServerClient: HermesApiServerApi | undefined;
let controlClient: HermesRuntimeClient | undefined;

/**
 * Native Hermes control facade.
 *
 * This is NOT a second Hermes server or a second connection. The SDK exposes
 * historical control-plane methods through HermesRuntimeClient, while Runs and
 * other API Server resources live on HermesApiServerApi. Both clients point to
 * the exact same HERMES_URL and authenticate with the exact same HERMES_API_KEY
 * as a Bearer token through the private Hermes proxy/API surface.
 */
export function getHermesControlClient(): HermesRuntimeClient {
  if (controlClient) return controlClient;

  const env = getHermesServerEnv();
  controlClient = createHermesClientUnchecked({
    baseUrl: env.url,
    bearerToken: env.apiKey,
    probeOnCreate: false,
  });

  return controlClient;
}

/**
 * API Server facade for Runs, capabilities and OpenAI-compatible resources.
 * Uses the same HERMES_URL + HERMES_API_KEY pair as getHermesControlClient().
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

/**
 * Backward-compatible SDK facade name used by existing registry route sources.
 * It does not imply a Dashboard listener; it is an alias over the same private
 * Hermes URL and API key. New code should prefer getHermesControlClient().
 */
export const getHermesManagementClient = getHermesControlClient;
