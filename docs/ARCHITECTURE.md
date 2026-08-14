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
             Hermes API Server
```

Hermes should remain private infrastructure. The browser never receives `HERMES_API_KEY` and should not have network reachability to Hermes.

## One Hermes machine API

V0.4 uses one `HermesApiServerApi` instance. The API Server itself exposes the machine-facing surfaces used by external UIs and orchestrators:

```text
/v1/capabilities
/v1/models
/v1/skills
/v1/toolsets
/v1/runs/*
/api/model/options
/api/sessions/*
/health
/health/detailed
```

The fact that some paths begin with `/v1` and others with `/api` does not create two application connections. They share the same API Server listener and bearer credential.

## Capability-driven UI

`GET /v1/capabilities` is treated as the runtime contract. Optional UI should check the advertised feature/endpoints surface instead of assuming private Web Dashboard routes exist.

The base registry therefore exposes only operations backed by the stable API Server contract. Dashboard-only administration surfaces are not part of the V0.4 installable catalog.

## Application authorization seam

The default `hermes-access` block imports:

```ts
import { getAppUser, type AppUser } from "@/lib/app-user";
```

That seam belongs to the consuming app. A template may implement it with Better Auth; another product can use another identity system without changing Hermes transport code.

## Workflow boundary

`@burner-io/workflow` remains application-owned orchestration. A `hermes.run` executor calls the same server-only Hermes API Server client. Hermes receives a native Run and does not know about the application workflow graph.

## Template boundary

The standalone `burner-hermes-app-template` demonstrates Payload CMS + Better Auth + the Hermes registry in a complete app. Those application-stack choices are deliberately not pushed down into the Hermes registry. See [`TEMPLATE.md`](TEMPLATE.md).
