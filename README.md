# hermes-ui

A shadcn registry for building **trusted application surfaces on top of the Hermes API Server**, powered by `@burner-io/hermes` and optional `@burner-io/workflow`.

`hermes-ui` owns reusable Hermes-facing UI/BFF bricks only. It does **not** own your application backend, authentication, domain model or public API. The consuming application decides who can access a Hermes capability and exposes only the bounded services it intends to provide.

## Architecture

```text
Browser / client
      │
      │ application auth + policy
      ▼
Your backend / BFF
      │
      │ HERMES_API_KEY (server only)
      ▼
HERMES_URL
      │
      ▼
Hermes API Server
├── /v1/capabilities
├── /v1/models
├── /v1/skills
├── /v1/toolsets
├── /v1/runs/*
├── /api/model/options
├── /api/sessions/*
└── /health/*
```

The browser never receives Hermes credentials and should not reach Hermes directly.

## Install from GitHub

```bash
pnpm dlx shadcn@latest add tbachir/hermes-ui/hermes-status-card
pnpm dlx shadcn@latest add tbachir/hermes-ui/hermes-run-console
pnpm dlx shadcn@latest add tbachir/hermes-ui/hermes-capabilities-center
pnpm dlx shadcn@latest add tbachir/hermes-ui/hermes-models-center
pnpm dlx shadcn@latest add tbachir/hermes-ui/hermes-system-center
```

Or install the supported Hermes foundation and UI set:

```bash
pnpm dlx shadcn@latest add tbachir/hermes-ui/hermes-stack
```

AI Elements expects a Radix-based shadcn setup:

```bash
pnpm dlx shadcn@latest init -d --base radix
```

## V0.4 catalog

The active registry intentionally tracks the stable machine-facing API Server surface rather than mirroring the Web Dashboard backend.

### Foundation

| Item | Purpose |
|---|---|
| `hermes-server` | one server-only `HermesApiServerApi` using `HERMES_URL` + `HERMES_API_KEY` |
| `hermes-access` | app-owned authorization seam in front of Hermes routes |
| `hermes-api` | explicit bounded Next.js BFF routes for API Server resources |
| `hermes-query` | typed browser facade + TanStack Query hooks |

### Components

- `hermes-status-card`
- `hermes-run-console`
- `hermes-session-list`

### Blocks

- `hermes-capabilities-center`
- `hermes-models-center`
- `hermes-system-center`
- `hermes-stack`

### Pages

- `/hermes`
- `/hermes/runs`
- `/hermes/sessions`
- `/hermes/capabilities`
- `/hermes/models`
- `/hermes/system`
- `/hermes/workflows`

### Workflow

`hermes-workflow-builder` remains application-owned orchestration through `@burner-io/workflow`. Hermes only sees native Runs; Hermes does not learn a `Workflow` domain concept.

## Required Hermes environment

```dotenv
HERMES_URL=http://127.0.0.1:8642
HERMES_API_KEY=
```

These values are **server-only**. There is no `HERMES_DASHBOARD_URL`, `HERMES_SESSION_TOKEN`, `HERMES_BEARER_TOKEN`, duplicate API Server URL or `NEXT_PUBLIC_HERMES_*` credential in the V0.4 contract.

The optional default access block also understands:

```dotenv
HERMES_UI_ALLOWED_ROLES=admin
HERMES_UI_ALLOWED_USER_IDS=
```

`hermes-access` deliberately depends on a consuming-app seam `@/lib/app-user`. The template currently implements that seam with Better Auth, but the registry itself does not require Better Auth, Payload or any other application backend.

## Template

The clone-ready reference application is tracked separately as `tbachir/burner-hermes-app-template`. `hermes-ui` pins the compatible template revision under [`templates/burner-hermes-app`](templates/burner-hermes-app) instead of silently duplicating a second source of truth.

The current pinned template already uses the same single private Hermes API Server connection and has removed obsolete Dashboard-only surfaces.

## Security posture

- Hermes is private infrastructure, not a public application API.
- no generic `/api/hermes/proxy`;
- no Hermes credential in `NEXT_PUBLIC_*`;
- the consuming application authenticates and authorizes users/clients before Hermes is called;
- mutations use same-origin checks in the default Next.js BFF;
- base V0.4 surfaces are limited to API Server capabilities, model discovery, skills/toolsets, sessions and Runs;
- `/v1/capabilities` is treated as the runtime contract/source of truth for optional API features.

## Package compatibility

- `@burner-io/hermes@^0.5.0`
- `@burner-io/workflow@^0.1.0` for workflow items

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
