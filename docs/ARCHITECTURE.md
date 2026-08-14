# Architecture

## Boundary

`hermes-ui` is a reusable Hermes-facing UI/BFF layer. It is not the application backend and it is not an alternate Hermes domain model.

```text
Browser / external client
          │
          │ app auth + policy
          ▼
Consuming application
          │
          ├── product/domain services
          ├── bounded Hermes BFF routes
          └── @burner-io/workflow (optional)
                    │
                    ▼
          @burner-io/hermes
                    │
                    │ HERMES_URL + HERMES_API_KEY
                    ▼
              private Hermes
```

Hermes remains private infrastructure. The browser never receives `HERMES_API_KEY` and should not have network reachability to Hermes.

## One connection, multiple SDK facades

The application contract contains only:

```dotenv
HERMES_URL=
HERMES_API_KEY=
```

`@burner-io/hermes@0.5` currently exposes two useful TypeScript facades:

- `HermesRuntimeClient` for the native control-plane namespaces used by the registry;
- `HermesApiServerApi` for Runs, capabilities and API-Server/OpenAI-compatible resources.

This is an SDK organization detail, not two deployments and not two authentication systems. `hermes-server/server.ts` constructs both from the same values:

```text
getHermesControlClient()
        │ baseUrl = HERMES_URL
        │ bearer = HERMES_API_KEY
        │
        ├─────────────────────────────┐
        │                             │
getHermesApiServer()                  │
        │ baseUrl = HERMES_URL        │
        │ apiKey  = HERMES_API_KEY    │
        └──────────────┬──────────────┘
                       ▼
                     Hermes
```

The backward-compatible `getHermesManagementClient` export is only an alias of `getHermesControlClient`; it does not select another host or credential.

## Control-plane UI

The registry deliberately keeps the complete Hermes operator catalog:

```text
Hermes Control Plane
├── Command
│   ├── status
│   ├── profiles
│   ├── Runs
│   ├── sessions
│   └── Kanban
├── Capabilities
│   ├── skills
│   ├── MCP
│   └── toolsets
├── Models
│   ├── model assignment
│   ├── providers
│   └── credentials
├── Automation
│   ├── cron
│   └── webhooks
├── Observability
│   ├── analytics
│   └── logs/sessions
├── Developer
│   ├── safe config
│   ├── env metadata
│   ├── managed files
│   ├── Git
│   └── diagnostics
├── Learning
├── Communication
└── System
```

Removing a separate Web Dashboard connection does not imply removing these UI surfaces. The application is itself a trusted control plane over Hermes.

## Explicit BFF boundary

Browser code never forwards arbitrary Hermes paths. Every operation has an explicit Route Handler under `app/api/hermes/*`, then calls a typed SDK namespace or a narrowly reviewed native action.

That gives the consuming application a place to apply:

- authentication;
- role/user policy;
- same-origin mutation checks;
- validation;
- audit/rate limits when needed;
- product-specific exposure rules.

## Capabilities

`/v1/capabilities` remains useful for API introspection and progressive UX, especially for version-dependent features. It is not used as a reason to delete control-plane components merely because a route family is not enumerated there.

A component may eventually surface a clear unavailable/read-only state when the connected Hermes version rejects an operation, while keeping the reusable UI contract intact.

## Application authorization seam

The default `hermes-access` block imports:

```ts
import { getAppUser, type AppUser } from "@/lib/app-user";
```

That seam belongs to the consuming app. The reference template implements it with Better Auth, but `hermes-ui` itself does not depend on Better Auth, Payload, Supabase or another application stack.

## Workflow boundary

`@burner-io/workflow` remains application-owned orchestration. A `hermes.run` executor delegates a native Hermes Run through the same private connection. Hermes does not learn the application workflow graph or domain concepts such as Project or Spec.

## Template boundary

The standalone `burner-hermes-app-template` demonstrates the registry in a complete application. The template is a reference integration; the registry remains the reusable Hermes layer. See [`TEMPLATE.md`](TEMPLATE.md).
