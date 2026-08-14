# Roadmap

The roadmap is intentionally limited to **Hermes-facing reusable bricks**. Payload CMS, Better Auth, public application APIs and product/domain workflows live in consuming applications and are demonstrated by the separate reference template.

## v0.4 — API Server convergence

- one private Hermes connection: `HERMES_URL` + `HERMES_API_KEY`;
- one cached `HermesApiServerApi` instance per server runtime;
- `/v1/capabilities` as the source of truth for optional machine-facing features;
- detailed health/readiness;
- native Runs with status, stop and approvals;
- native API Server sessions and messages;
- model discovery + rich model options;
- read-only skills and toolsets;
- backend/auth-provider-agnostic application authorization seam;
- bounded Next.js BFF and TanStack Query facade;
- reference app compatibility pin;
- no Web Dashboard/session-auth dependency in active registry items.

## v0.5 — richer native Run/session UX

- SSE bridge for `/v1/runs/{run_id}/events`;
- live tool/subagent progress timeline;
- run steering (`/v1/runs/{run_id}/steer`);
- structured AI Elements renderers for tool/reasoning/checkpoint events;
- session create/update/delete/fork controls;
- session chat + streaming chat;
- session model lock;
- reconnect/reconciliation UX driven by native Hermes state;
- capability-gated UI so unsupported operations disappear cleanly.

## v0.6 — SDK convergence

- promote all stable API Server resources currently using `raw()` into typed `@burner-io/hermes` methods;
- expose one ergonomic high-level API Server client without inventing separate Dashboard/application protocols;
- typed capability/endpoints helpers;
- typed SSE event consumption and cancellation;
- compatibility tests against current Hermes API Server contract.

## v0.7 — reusable operator compositions

Only for operations actually exposed through the intended API Server contract:

- richer Runs workspace;
- searchable session explorer;
- model picker using `/api/model/options`;
- capability explorer;
- health/readiness diagnostics;
- workflow execution/status blocks using native Hermes Runs.

Do not restore old control-plane screens merely because an equivalent route exists in the Web Dashboard backend.

## v0.8 — template promotion loop

- automated compatibility check between `hermes-ui` and the pinned `burner-hermes-app-template` revision;
- controlled promotion of reusable Hermes-specific improvements from the app template back into the registry;
- registry diff tooling that cannot reintroduce deprecated Dashboard-era items;
- optional public template publication only when explicitly decided.

## Future candidates

When Hermes exposes additional stable machine-facing capabilities, evaluate them individually for registry inclusion. Each addition must preserve the boundary:

```text
application policy
      ↓
reusable Hermes brick
      ↓
@burner-io/hermes
      ↓
private Hermes API Server
```
