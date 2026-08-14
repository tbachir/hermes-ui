# hermes-ui

A shadcn registry of reusable **Hermes control-plane, runtime and workflow UI** powered by `@burner-io/hermes` and optional `@burner-io/workflow`.

`hermes-ui` is intentionally focused on Hermes-facing bricks. It does **not** own your product backend, authentication, public API or domain model. The consuming application decides who may access Hermes and which Hermes capabilities it exposes to its own users or services.

## One Hermes connection

The consuming application configures exactly one private Hermes origin and one machine credential:

```dotenv
HERMES_URL=http://127.0.0.1:8642
HERMES_API_KEY=
```

Internally, `@burner-io/hermes` currently exposes more than one convenient client facade. `hermes-ui` may therefore use a control facade for native `/api/*` operations and an API Server facade for Runs/OpenAI-compatible resources, but **both point to the exact same `HERMES_URL` and use the exact same `HERMES_API_KEY` Bearer credential**.

There is no second application-level Hermes URL, no second Hermes credential and no browser-to-Hermes connection.

```text
Browser / client
      │
      │ application auth + policy
      ▼
Your backend / BFF
      │
      │ server-only HERMES_API_KEY
      ▼
             HERMES_URL
                 │
        ┌────────┴────────┐
        │                 │
  control facade      run/API facade
        │                 │
        └────────┬────────┘
                 ▼
              Hermes
          private network
```

## Install from GitHub

Install one focused surface:

```bash
pnpm dlx shadcn@latest add tbachir/hermes-ui/hermes-status-card
pnpm dlx shadcn@latest add tbachir/hermes-ui/hermes-kanban-board
pnpm dlx shadcn@latest add tbachir/hermes-ui/hermes-cron-manager
pnpm dlx shadcn@latest add tbachir/hermes-ui/hermes-run-console
```

Install a composed area:

```bash
pnpm dlx shadcn@latest add tbachir/hermes-ui/hermes-command-center
pnpm dlx shadcn@latest add tbachir/hermes-ui/hermes-capabilities-center
pnpm dlx shadcn@latest add tbachir/hermes-ui/hermes-developer-center
pnpm dlx shadcn@latest add tbachir/hermes-ui/hermes-control-plane
```

Or install the complete Hermes foundation + control plane:

```bash
pnpm dlx shadcn@latest add tbachir/hermes-ui/hermes-stack
```

AI Elements expects a Radix-based shadcn setup:

```bash
pnpm dlx shadcn@latest init -d --base radix
```

## Catalog

### Foundation

| Item | Purpose |
|---|---|
| `hermes-server` | single private Hermes connection, exposed through SDK facades sharing one URL/key |
| `hermes-access` | application-owned authorization seam in front of Hermes operations |
| `hermes-api` | explicit bounded Next.js Route Handlers for native Hermes operations |
| `hermes-query` | typed browser facade + TanStack Query hooks |

### Focused components

| Area | Items |
|---|---|
| Runtime | `hermes-status-card`, `hermes-run-console`, `hermes-session-list` |
| Profiles / models | `hermes-profile-switcher`, `hermes-model-manager`, `hermes-provider-manager`, `hermes-credential-manager` |
| Capabilities | `hermes-skill-manager`, `hermes-mcp-manager`, `hermes-toolset-manager`, `hermes-plugin-manager` |
| Work | `hermes-kanban-board` |
| Automation | `hermes-cron-manager`, `hermes-webhook-manager` |
| State / learning | `hermes-memory-manager`, `hermes-learning-overview` |
| Observability | `hermes-analytics-overview`, `hermes-log-viewer` |
| Developer | `hermes-config-overview`, `hermes-env-manager`, `hermes-file-browser`, `hermes-git-status`, `hermes-operations-panel` |
| Communication | `hermes-messaging-manager`, `hermes-portal-card`, `hermes-audio-console` |
| System | `hermes-gateway-controls`, `hermes-update-card` |

### Composed blocks

- `hermes-command-center` — status, profiles, Runs, sessions and Kanban
- `hermes-capabilities-center` — skills, MCP and toolsets
- `hermes-models-center` — profiles, models, providers and credentials
- `hermes-automation-center` — cron and webhooks
- `hermes-observability-center` — analytics and sessions
- `hermes-developer-center` — config, env, managed files, Git, diagnostics and logs
- `hermes-learning-center` — learning/Curator and memory
- `hermes-communication-center` — messaging, Portal and audio
- `hermes-system-center` — status, gateway, memory, plugins and updates
- `hermes-control-plane` — complete tabbed Hermes administration surface
- `hermes-stack` — full foundation + control-plane preset

### Pages

Ready App Router compositions are provided for:

```text
/hermes
/hermes/runs
/hermes/sessions
/hermes/capabilities
/hermes/models
/hermes/automations
/hermes/observability
/hermes/developer
/hermes/learning
/hermes/communication
/hermes/system
/hermes/workflows
```

### Workflow

`hermes-workflow-builder` targets `@burner-io/workflow@^0.1.0` and composes React Flow with AI Elements. Workflow definitions remain application-owned; Hermes only receives native Hermes operations/Runs and does not learn application concepts such as Workflow, Project or Spec.

## Application boundary

The registry is auth/backend agnostic. The default access seam expects the consuming application to provide:

```ts
// @/lib/app-user
export interface AppUser {
  id: string;
  role?: string;
  demo?: boolean;
}

export async function getAppUser(): Promise<AppUser | null> {
  // Better Auth, custom auth, etc.
}
```

Optional authorization configuration:

```dotenv
HERMES_UI_ALLOWED_ROLES=admin
HERMES_UI_ALLOWED_USER_IDS=
HERMES_UI_GIT_ROOTS=
```

Payload, Better Auth or another backend/auth stack may implement the surrounding application, but they are intentionally not dependencies of `hermes-ui`.

## Security posture

- Hermes remains private infrastructure.
- Hermes credentials are server-only and never use `NEXT_PUBLIC_*`.
- Browsers call explicit application/BFF routes, never Hermes directly.
- There is no generic `/api/hermes/proxy`.
- Hermes mutations remain individually exposed and protected by the consuming application's authorization policy.
- Sensitive developer surfaces remain bounded: redacted env metadata, read-only generic file browsing, allow-listed Git roots and explicit operations.
- The same `HERMES_API_KEY` authenticates the Hermes route families used by the registry through the configured private origin.

## Reference template

The clone-ready reference application remains in `tbachir/burner-hermes-app-template`. `hermes-ui` tracks its compatible revision under [`templates/burner-hermes-app`](templates/burner-hermes-app) instead of duplicating a second source tree.

The template is the integration/reference application; this repository remains the reusable Hermes registry.

## Package compatibility

- `@burner-io/hermes@^0.5.0`
- `@burner-io/workflow@^0.1.0`

## Validate

```bash
npm run registry:check
npm run registry:build
```

GitHub source-registry installation does not require a static registry build.

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- [`docs/CATALOG.md`](docs/CATALOG.md)
- [`docs/SECURITY.md`](docs/SECURITY.md)
- [`docs/TEMPLATE.md`](docs/TEMPLATE.md)
- [`docs/ADDING-ITEMS.md`](docs/ADDING-ITEMS.md)
- [`docs/ROADMAP.md`](docs/ROADMAP.md)
