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

## Same-repository dependencies

A bare dependency such as `button` refers to shadcn's built-in registry, not
another item in this repository. Reference internal items explicitly:

```json
{
  "registryDependencies": [
    "tbachir/hermes-ui/hermes-query"
  ]
}
```

Once releases are tagged, pin cross-item GitHub dependencies to the same tag,
for example `tbachir/hermes-ui/hermes-query#v0.2.0`.
