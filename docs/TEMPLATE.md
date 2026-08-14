# Reference app template

`hermes-ui` and the standalone app template serve different purposes:

- **hermes-ui**: reusable Hermes-facing shadcn registry bricks and full control-plane UI.
- **burner-hermes-app-template**: a clone-ready application proving how those bricks live inside a real stack.

The template currently uses Payload CMS + Better Auth for application concerns, but those choices do not belong in the Hermes registry contract. The registry requires only an application-owned identity/authorization seam before its bounded BFF routes.

## Compatibility pin

See [`../templates/burner-hermes-app/template.json`](../templates/burner-hermes-app/template.json).

The current pin points to template revision `a7769bf1f93b63f9a523b2dc34748685b25a7997`.

## Promotion rule

A change should move from the template into `hermes-ui` only when it is:

1. Hermes-specific rather than application-domain specific;
2. reusable across consuming apps;
3. faithful to a native Hermes operation/concept;
4. routed through the single private Hermes connection contract;
5. safe behind an application-owned authorization policy;
6. not dependent on exposing raw Hermes credentials or arbitrary proxy access to browsers.

Payload collections, Better Auth configuration, product navigation and business workflows remain application/template concerns.

## Hermes connection contract

Both template and registry converge on:

```dotenv
HERMES_URL=
HERMES_API_KEY=
```

`HERMES_URL` points at the private Hermes origin/reverse proxy used by the system. `HERMES_API_KEY` is the machine Bearer credential accepted by that Hermes surface. Neither value is public/browser configuration.

The SDK can expose separate control and Run/API facades without creating a second deployment contract: both facades must use this same URL/key pair.

## Template vs registry catalog

The template may choose to expose only a subset of the registry in its product navigation. That must not be interpreted as a reason to delete other Hermes control-plane items from `hermes-ui`; the registry is the reusable superset.
