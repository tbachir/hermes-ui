# Burner Hermes app template

This directory pins the standalone clone-ready reference application used to validate the registry against a real product shell.

Current source:

- repository: `tbachir/burner-hermes-app-template`
- revision: `a7769bf1f93b63f9a523b2dc34748685b25a7997`
- hermes-ui compatibility: `0.4.x`

The source is intentionally not duplicated here: the template repository remains the canonical application history, while this public registry tracks the exact compatible revision.

The pinned revision uses the current Hermes integration contract:

```dotenv
HERMES_URL=http://127.0.0.1:8642
HERMES_API_KEY=
```

It does not depend on the Hermes Web Dashboard backend or Dashboard session authentication. The browser communicates with the application backend; only trusted server code talks to the private Hermes API Server.

When promoting reusable code from the template, move only product-independent Hermes bricks into the registry and keep Payload, Better Auth and application-domain code in the template/application layer.
