# Publishing

`hermes-ui` is designed first as a shadcn GitHub source registry. A public GitHub
repository with the root `registry.json` is enough; generated `/public/r/*.json`
files are optional.

## First publication

Create an empty public repository named `hermes-ui` under `tbachir`, then from
this checkout:

```bash
git remote add origin git@github.com:tbachir/hermes-ui.git
git push -u origin main
```

After publication, inspect before installing:

```bash
pnpm dlx shadcn@latest list tbachir/hermes-ui
pnpm dlx shadcn@latest view tbachir/hermes-ui/hermes-command-center
pnpm dlx shadcn@latest add tbachir/hermes-ui/hermes-command-center --dry-run
```

## Releases

Once an initial release is stable, tag it and prefer pinned install examples for
reproducibility:

```bash
git tag v0.2.0
git push origin v0.2.0
pnpm dlx shadcn@latest add tbachir/hermes-ui/hermes-command-center#v0.2.0
```

Same-repository `registryDependencies` may also be pinned when the registry moves
from active development to stable releases.

## Optional static registry build

A hosted static registry can still be produced when needed:

```bash
pnpm dlx shadcn@latest build ./registry.json -o ./public/r
```

The GitHub source-registry path does not require this build step.
