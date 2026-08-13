# hermes-ui

A shadcn registry of ready-to-use **Next.js + Supabase + shadcn/ui + AI Elements**
surfaces powered by [`@burner-io/hermes`](https://www.npmjs.com/package/@burner-io/hermes).

`hermes-ui` is an application/UI layer, not a replacement domain model. Hermes-native
contracts and transports stay in `@burner-io/hermes`; access policy, browser cache,
page composition and workflow documents stay in the consuming application.

## Install from GitHub

Once this repository is public as `tbachir/hermes-ui`, shadcn CLI can install any
item directly from the source registry:

```bash
pnpm dlx shadcn@latest add tbachir/hermes-ui/hermes-status-card
pnpm dlx shadcn@latest add tbachir/hermes-ui/hermes-capabilities-center
pnpm dlx shadcn@latest add tbachir/hermes-ui/hermes-developer-center
pnpm dlx shadcn@latest add tbachir/hermes-ui/hermes-control-plane
pnpm dlx shadcn@latest add tbachir/hermes-ui/hermes-workflow-builder
```

For the complete opinionated personal stack:

```bash
pnpm dlx shadcn@latest add tbachir/hermes-ui/hermes-stack
```

AI Elements expects a Radix-based shadcn setup. For a new app:

```bash
pnpm dlx shadcn@latest init -d --base radix
```

## V0.2 catalog

The registry contains **55 installable items**: 5 foundation items, 28 focused
components, 11 compositional blocks, 10 App Router pages and 1 workflow item.

### Foundation

| Item | Purpose |
|---|---|
| `supabase-next` | Supabase browser/server clients + Next.js 16 `proxy.ts` |
| `hermes-server` | server-only management + API Server clients |
| `hermes-access` | Supabase claims validation + user/path allow-lists |
| `hermes-api` | protected, explicitly allow-listed `/api/hermes/*` route handlers |
| `hermes-query` | typed browser client + TanStack Query provider/hooks |

### Focused native Hermes components

| Area | Items |
|---|---|
| Runtime | `hermes-status-card`, `hermes-gateway-controls`, `hermes-update-card`, `hermes-run-console` |
| Identity / model | `hermes-profile-switcher`, `hermes-model-manager`, `hermes-provider-manager`, `hermes-credential-manager` |
| Capabilities | `hermes-skill-manager`, `hermes-mcp-manager`, `hermes-toolset-manager`, `hermes-plugin-manager` |
| Work / observability | `hermes-session-list`, `hermes-kanban-board`, `hermes-analytics-overview`, `hermes-log-viewer` |
| Automation | `hermes-cron-manager`, `hermes-webhook-manager` |
| State / learning | `hermes-memory-manager`, `hermes-learning-overview` |
| Developer | `hermes-config-overview`, `hermes-env-manager`, `hermes-file-browser`, `hermes-git-status`, `hermes-operations-panel` |
| Communication | `hermes-messaging-manager`, `hermes-portal-card`, `hermes-audio-console` |

### Advanced blocks

| Item | Composition |
|---|---|
| `hermes-command-center` | Runs + Sessions + Kanban |
| `hermes-capabilities-center` | Skills + MCP + Toolsets |
| `hermes-models-center` | Profiles + Models + Providers + Credentials |
| `hermes-automation-center` | Cron + Webhooks |
| `hermes-observability-center` | Analytics + Sessions |
| `hermes-developer-center` | Safe config + env + files + Git + diagnostics + logs |
| `hermes-learning-center` | Learning/Curator + Memory |
| `hermes-communication-center` | Messaging + Portal + Audio |
| `hermes-system-center` | Status + Gateway + Memory + Plugins + Updates |
| `hermes-control-plane` | complete tabbed Hermes administration surface |
| `hermes-stack` | foundation + complete control-plane preset |

### Pages

Ready App Router pages are provided for `/hermes` and the focused
`/hermes/{capabilities,models,automations,observability,developer,learning,communication,system,workflows}`
entry points.

### Workflow

`hermes-workflow-builder` targets `@burner-io/workflow@^0.1.0` and composes
React Flow with AI Elements. The workflow document remains application-owned;
Hermes is invoked through the workflow adapter rather than learning a new
`Workflow` domain concept.

## Security posture

The default stack intentionally exposes less than the underlying Hermes SDK:

- no generic `/api/hermes/proxy`;
- no Hermes credential in `NEXT_PUBLIC_*`;
- environment values are redacted and the `env.reveal` operation is not exposed;
- config is a safe read-only subset rather than raw YAML;
- managed files are read-only in the browser block;
- Git is read-only and fails closed unless its remote path matches `HERMES_UI_GIT_ROOTS`;
- operations are limited to `doctor` and `security-audit`;
- log reads are capped at 500 lines;
- mutations require Supabase identity, the user allow-list and a same-origin check.

The full native SDK remains available server-side if a consuming application chooses
to add a reviewed route with its own authorization policy.

## Required environment variables

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=

HERMES_DASHBOARD_URL=http://127.0.0.1:9119
HERMES_SESSION_TOKEN=
HERMES_BEARER_TOKEN=

HERMES_API_SERVER_URL=http://127.0.0.1:8642
HERMES_API_SERVER_KEY=
HERMES_DEFAULT_PROFILE=

# Comma-separated Supabase auth.users IDs. Use * only intentionally.
HERMES_UI_ALLOWED_USER_IDS=

# Optional comma-separated allow-list of remote Hermes repository roots.
HERMES_UI_GIT_ROOTS=
```

## Package compatibility

The current registry targets:

- `@burner-io/hermes@^0.5.0`
- `@burner-io/workflow@^0.1.0` for workflow items

## Build / validate

```bash
npm run registry:check
npm run registry:build
```

Generated static registry items are written to `public/r`. GitHub source-registry
installation does not require the static build.

## Documentation

- [`docs/CATALOG.md`](docs/CATALOG.md)
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- [`docs/SECURITY.md`](docs/SECURITY.md)
- [`docs/ADDING-ITEMS.md`](docs/ADDING-ITEMS.md)
- [`docs/ROADMAP.md`](docs/ROADMAP.md)
