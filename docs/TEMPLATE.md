# Reference app template

`hermes-ui` and the standalone app template serve different purposes:

- **hermes-ui**: reusable Hermes-facing shadcn registry bricks.
- **burner-hermes-app-template**: a clone-ready application proving how those bricks live inside a real stack.

The template currently uses Payload CMS + Better Auth for application concerns, but those choices do not belong in the Hermes registry contract. The registry requires only an application-owned identity/authorization seam before its bounded BFF routes.

## Compatibility pin

See [`../templates/burner-hermes-app/template.json`](../templates/burner-hermes-app/template.json).

The current pin points to template revision `a7769bf1f93b63f9a523b2dc34748685b25a7997`.

## Promotion rule

A change should move from the template into `hermes-ui` only when it is:

1. Hermes-specific rather than application-domain specific;
2. reusable across consuming apps;
3. backed by the public/stable Hermes API Server surface;
4. safe behind an application-owned authorization policy;
5. not dependent on exposing raw Hermes internals to browsers.

Payload collections, Better Auth configuration, product navigation and business workflows remain application/template concerns.

## Hermes connection contract

Both the template and V0.4 registry converge on:

```dotenv
HERMES_URL=
HERMES_API_KEY=
```

`HERMES_URL` points at the private Hermes API Server listener or a private reverse proxy in front of that same listener. `HERMES_API_KEY` is the API Server bearer credential. Neither value is public/browser configuration.
