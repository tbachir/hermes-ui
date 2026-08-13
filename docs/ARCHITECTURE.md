# Architecture

```text
Browser
  │
  │ Supabase cookie auth
  ▼
Next.js UI
  ├─ shadcn/ui
  ├─ AI Elements
  └─ TanStack Query
  │
  ▼
Explicit /api/hermes/* routes
  │  requireHermesAccess()
  │  requireHermesMutationAccess()
  │
  ├──────────► Supabase Auth getClaims()
  │
  └──────────► @burner-io/hermes (server only)
                 ├─ Dashboard / management REST
                 ├─ native management namespaces
                 ├─ Kanban plugin
                 └─ API Server Runs
```

## Boundaries

### `@burner-io/hermes`

Owns Hermes-native contracts and transports. Registry code consumes those contracts
rather than reproducing them.

### `hermes-ui`

Owns:

- UI composition
- Next.js route handlers
- Supabase authentication/authorization gate
- browser query cache and invalidation
- application pages
- optional workflow editor rendering

It must not redefine `Profile`, `Skill`, `Session`, `Task`, `Run`, `MCPServer`,
`CronJob`, or other Hermes-native concepts into alternate domain models.

### `@burner-io/workflow`

Remains application-owned workflow composition. `hermes-workflow-builder` renders
those documents but does not move Workflow into Hermes.

## Three registry levels

```text
foundation
   │ server/auth/query plumbing
   ▼
components
   │ one focused native Hermes surface
   ▼
blocks
   │ deliberate compositions of components
   ▼
pages
     installable Next.js App Router entry points
```

The full `hermes-control-plane` is composition only. It does not gain extra Hermes
permissions beyond the explicit component routes it installs.

## Why explicit API routes?

The registry intentionally avoids a catch-all Hermes proxy. An authenticated user
should only receive the operations that an installed block explicitly needs. Adding
a new Hermes control requires adding a route, which creates a reviewable security
boundary and a natural place for app-specific authorization.
