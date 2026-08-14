# Hermes UI Catalog

V0.4 intentionally mirrors the **stable Hermes API Server machine contract**, not the Web Dashboard backend.

## Foundation

| Item | Hermes surface |
|---|---|
| `hermes-server` | one `HermesApiServerApi` using `HERMES_URL` + `HERMES_API_KEY` |
| `hermes-access` | consuming-app authorization seam before Hermes |
| `hermes-api` | explicit Next.js BFF routes |
| `hermes-query` | browser facade and TanStack Query hooks |

## Components

| Item | Source |
|---|---|
| `hermes-status-card` | `/health/detailed` + `/v1/capabilities` |
| `hermes-run-console` | `/v1/runs/*` |
| `hermes-session-list` | `/api/sessions` |

## Blocks

| Item | Composition |
|---|---|
| `hermes-capabilities-center` | `/v1/capabilities`, `/v1/skills`, `/v1/toolsets` |
| `hermes-models-center` | `/v1/models`, `/api/model/options` |
| `hermes-system-center` | detailed health + runtime/endpoints contract |
| `hermes-stack` | supported foundation + components + blocks |

## Pages

- `hermes-dashboard-page` → `/hermes`
- `hermes-runs-page` → `/hermes/runs`
- `hermes-sessions-page` → `/hermes/sessions`
- `hermes-capabilities-page` → `/hermes/capabilities`
- `hermes-models-page` → `/hermes/models`
- `hermes-system-page` → `/hermes/system`
- `hermes-workflows-page` → `/hermes/workflows`

## Workflow

`hermes-workflow-builder` is the only workflow item. The workflow graph remains application-owned and calls Hermes through native Runs.

## Deliberately not installable in V0.4

The previous registry attempted to mirror Dashboard-only/private management surfaces such as profile administration, credentials, cron/webhooks, gateway lifecycle, plugins/updates, config/env/files/Git, learning/memory, messaging/Portal/audio and Kanban.

Those sources may remain in repository history while migrating, but they are not part of the active V0.4 registry unless/until an intended machine-facing API Server contract exposes them. Do not route around this by authenticating against the Web Dashboard backend.

## Adding a surface

Before adding a new installable Hermes item:

1. verify that the connected API Server advertises/supports the operation;
2. add or reuse the typed seam in `@burner-io/hermes`;
3. expose a bounded application BFF operation rather than a generic proxy;
4. add client/query/UI only after the server contract is explicit;
5. keep application domain concepts outside Hermes.
