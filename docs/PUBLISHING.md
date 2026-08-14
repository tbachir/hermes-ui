# Publishing

`hermes-ui` is a shadcn GitHub source registry. The public repository and root `registry.json` are sufficient; generated `/public/r/*.json` files are optional.

## Validate before release

```bash
npm run registry:check
npm run registry:build
```

Then inspect representative items before installing them into another application:

```bash
pnpm dlx shadcn@latest list tbachir/hermes-ui
pnpm dlx shadcn@latest view tbachir/hermes-ui/hermes-stack
pnpm dlx shadcn@latest view tbachir/hermes-ui/hermes-run-console
pnpm dlx shadcn@latest add tbachir/hermes-ui/hermes-stack --dry-run
```

## V0.4 release

V0.4 is the first release whose active catalog is based exclusively on the private Hermes API Server machine contract:

```dotenv
HERMES_URL=
HERMES_API_KEY=
```

Before tagging, confirm no active registry item depends on Dashboard/session-auth variables or Dashboard-only endpoints.

```bash
git tag v0.4.0
git push origin v0.4.0
```

For reproducible consumers:

```bash
pnpm dlx shadcn@latest add tbachir/hermes-ui/hermes-stack#v0.4.0
```

Same-repository `registryDependencies` can be pinned to the matching release tag once the V0.4 catalog is stable.

## Reference template

`templates/burner-hermes-app/template.json` pins the compatible standalone application revision. Updating that pin does not publish the private template source into this public repository.

If the standalone template is later intentionally made public, document that decision separately rather than silently copying its application code into the registry.

## Optional static registry build

```bash
pnpm dlx shadcn@latest build ./registry.json -o ./public/r
```

The GitHub source-registry path does not require the static build step.
