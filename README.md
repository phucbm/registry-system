# registry-system

Add a shadcn-compatible component registry to any Next.js project.
Live Sandpack demos, `shadcn add` install commands, and a Claude plugin for managing components across projects.

**Live demo**: https://phucbm.github.io/registry-system

## Prerequisites

- Next.js (app router)
- Tailwind v4
- shadcn CLI

## Install into your project

**1. Copy the engine:**
```bash
npx degit phucbm/registry-system/src/registry-system src/registry-system
```

**2. Copy the starter component** (rename `example` to your namespace):
```bash
npx degit phucbm/registry-system/registry/example registry/yourname
```

**3. Add scripts to `package.json`:**
```json
"build:registry": "pnpm index-registry && pnpm shadcn build && pnpm clean-registry",
"index-registry": "tsx src/registry-system/scripts/index-registry.ts",
"clean-registry": "tsx src/registry-system/scripts/clean-example-registry.ts"
```

**4. Set env vars** (copy `.env.example` → `.env.local`):
```bash
NEXT_PUBLIC_SITE_URL=https://your-site.com
NEXT_PUBLIC_REGISTRY_NAMESPACE=yourname
NEXT_PUBLIC_REGISTRY_FOLDER=r
```

**5. Build:**
```bash
pnpm build:registry
```

This generates `registry.json` and `public/r/*.json` — the served registry endpoints.

## Claude Plugin

Install:
```
/plugin install registry-system@phucbm
```

| Skill | When to use | Example prompt |
|---|---|---|
| `create-component` | Starting a new component | `create registry component my-button` |
| `validate-component` | Before publishing | `validate my-button` |
| `push-to-registry` | Sharing a component with another repo | `push my-button to phucbm/my-site` |

## How it works

```
registry/{namespace}/blocks/{name}/
├── {name}.tsx           your component
├── example.tsx          live demo (runs in Sandpack)
└── registry-item.json   shadcn registry manifest

     ↓ pnpm build:registry

registry.json            shadcn registry root
public/r/{name}.json     served registry endpoints
```

See [REGISTRY_RULES.md](./REGISTRY_RULES.md) for the full component spec.
