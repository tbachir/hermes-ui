# Adding registry items

1. Put source under the matching `registry/<group>/<item>/` directory.
2. Add the item to that group's `registry.json`.
3. Prefer `registryDependencies` for shadcn and AI Elements source components.
4. Pin external npm dependencies when practical.
5. Use target placeholders:
   - `@components/`
   - `@ui/`
   - `@lib/`
   - `@hooks/`
6. Use `~/...` for Next.js route/page files.
7. Run:

```bash
npm run registry:check
npm run registry:build
```

## Hermes API rule

An installable Hermes item must target the intended machine-facing API Server contract, not private Web Dashboard routes.

Before adding a surface:

1. verify it exists on the Hermes API Server and, when optional, is advertised by `/v1/capabilities`;
2. prefer a typed `@burner-io/hermes` method; use `raw()` only for an API Server endpoint not yet wrapped by the SDK;
3. route browser calls through a bounded application BFF;
4. never expose `HERMES_URL` or `HERMES_API_KEY` to client code;
5. never add a generic Hermes proxy;
6. never fall back to Dashboard session authentication when an API Server capability is absent.

The active registry connection contract is:

```dotenv
HERMES_URL=
HERMES_API_KEY=
```

## Application concerns

Authentication/backend choices belong to the consuming application. Registry items may depend on explicit application seams such as `@/lib/app-user`, but must not force Payload, Better Auth, Supabase or another application stack into the Hermes transport layer.

## Same-repository dependencies

A bare dependency such as `button` refers to shadcn's built-in registry, not another item in this repository. Reference internal items explicitly:

```json
{
  "registryDependencies": [
    "tbachir/hermes-ui/hermes-query"
  ]
}
```

Once releases are tagged, pin cross-item GitHub dependencies to the same tag, for example `tbachir/hermes-ui/hermes-query#v0.4.0`.

## Promote from the reference template

Move code from `burner-hermes-app-template` into `hermes-ui` only when the code is Hermes-specific, reusable across applications and independent of the template's Payload/Better Auth/product layer. Update the compatibility pin under `templates/burner-hermes-app/template.json` whenever the reference revision changes.
