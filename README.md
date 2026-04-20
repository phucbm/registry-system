# registry-system

An installable registry system for Next.js + shadcn projects. Drop it into any existing codebase to get a full component registry with live Sandpack demos, `shadcn add` installation, and a Claude plugin for managing components across projects.

## Prerequisites

- Next.js (app router)
- Tailwind v4
- shadcn CLI

## Install

### Option A — degit (recommended)

```bash
npx degit phucbm/registry-system .
```

### Option B — manual

Clone this repo and copy the contents into your project root.

## Setup

**1. Install dependencies**

```bash
pnpm add @codesandbox/sandpack-react @codesandbox/sandpack-themes shadcn
```

**2. Configure env vars**

Copy `.env.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_SITE_URL=https://your-site.com
NEXT_PUBLIC_REGISTRY_NAMESPACE=yourname   # used as registry/{namespace}/blocks/
NEXT_PUBLIC_REGISTRY_FOLDER=r
NEXT_PUBLIC_REGISTRY_HOMEPAGE=https://your-site.com
```

**3. Add build scripts to `package.json`**

```json
{
  "scripts": {
    "build:registry": "pnpm index-registry && pnpm shadcn build && pnpm clean-example-registry",
    "index-registry": "tsx src/registry-system/scripts/index-registry.ts",
    "clean-example-registry": "tsx src/registry-system/scripts/clean-example-registry.ts"
  }
}
```

**4. Rename the example namespace**

```bash
mv registry/example registry/yourname
```

Update the `files[].path` and `files[].target` in `registry/yourname/blocks/hello-world/registry-item.json` to use your namespace.

**5. Build**

```bash
pnpm build:registry
```

This generates `registry.json` and `public/r/*.json` — the served registry endpoints.

## Adding components

Use the Claude plugin:

```
/create-component my-button
```

Or follow the rules in [REGISTRY_RULES.md](./REGISTRY_RULES.md) manually.

## Claude Plugin

The `plugin/` folder contains Claude Code skills for managing registry components across projects.

### Available skills

| Skill | Description |
|---|---|
| `create-component` | Scaffold a new component with all required files |
| `validate-component` | Check a component against registry rules |
| `push-to-registry` | Validate and open a PR to a target registry repo |

### Install plugin

```bash
/plugin install registry-system@phucbm
```

## How it works

```
registry/{namespace}/blocks/{name}/
├── {name}.tsx           your component
├── example.tsx          live demo (runs in Sandpack)
└── registry-item.json   shadcn registry manifest

     ↓ pnpm build:registry

registry.json            shadcn registry root
public/r/{name}.json     served registry endpoints

     ↓ in MDX pages

<RegistryDemo name="{name}"/>      live Sandpack demo
<RegistryInstall name="{name}"/>   shadcn add command
<RegistryPropsTable name="{name}"/> auto-generated props docs
```

See [REGISTRY_RULES.md](./REGISTRY_RULES.md) for the full component spec.
