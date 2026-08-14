# Security

## Hermes is private infrastructure

The intended topology is:

```text
Browser / external client
        │
        ▼
Application backend
        │ private network + bearer key
        ▼
Hermes API Server
```

Hermes is not a public application API. Prefer network isolation/firewall rules in addition to the API Server key.

## Server-only credentials

The V0.4 runtime contract is only:

```dotenv
HERMES_URL=
HERMES_API_KEY=
```

Never expose either value through `NEXT_PUBLIC_*`, client props, browser bundles, logs or rendered diagnostics.

## Application authentication is separate

`hermes-ui` does not choose the consuming application's identity provider. Authenticate and authorize the caller before entering the Hermes BFF. The default `hermes-access` block uses the application-provided `@/lib/app-user` seam and optional role/user allow-lists.

Authentication to the application does not automatically imply permission to operate Hermes.

## Bounded BFF, never a generic proxy

Do not add an endpoint that forwards arbitrary Hermes method/path/body input. Every browser-facing route should expose a reviewed operation with validated inputs.

The base registry is limited to:

- health + capabilities;
- model discovery/options;
- read-only skills/toolsets;
- session resources/messages;
- native Runs, stop and approvals.

## Capability discovery

Use `/v1/capabilities` to determine which optional features the connected Hermes version advertises. Do not silently fall back to Web Dashboard/private endpoints when an API Server feature is absent.

## Mutations

The default Next.js mutation guard rejects cross-origin browser mutations after application authorization. A consuming app can additionally apply CSRF, rate limits, audit records and domain-specific policies.

## CORS

The base architecture is server-to-server and does not require browser-to-Hermes CORS. If a deployment intentionally enables direct browser access, that is a different trust model and should not expose the server-only application key.

## Workflow

Workflow definitions and application approvals remain app-owned. A workflow Hermes node invokes the same private API Server connection; it does not bypass application policy merely because Hermes can execute powerful tools internally.
