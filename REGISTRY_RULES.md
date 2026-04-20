# Registry Rules

Formal spec for a valid registry component. Both humans and the Claude plugin use this document.

## Directory structure

Every component lives under:

```
registry/{namespace}/blocks/{name}/
├── {name}.tsx              required — main component
├── example.tsx             required — primary demo
├── example-02.tsx          optional — additional demo
├── example-02.json         optional — metadata overrides for example-02
└── registry-item.json      required — registry manifest
```

And optionally a doc page:

```
content/components/{name}.mdx
```

## Rules

### 1. Naming

- `{name}` must be `kebab-case`
- Directory name, `registry-item.json` `name` field, and main file `{name}.tsx` must all match exactly

### 2. Main component file (`{name}.tsx`)

- Must export a named component matching PascalCase of `{name}` (e.g. `hello-world` → `export function HelloWorld`)
- Must export a TypeScript props type named `{PascalName}Props` (e.g. `export type HelloWorldProps`) — required for `<RegistryPropsTable>` to work
- Must not import from other registry components (use `registryDependencies` instead)

### 3. Example file (`example.tsx`)

- Must import the main component from its target path, not registry path: `@/components/{namespace}/{name}` not `@/registry/...`
- Must render a self-contained demo — no external data fetching, no auth
- Must work inside CodeSandbox Sandpack (browser-only, CDN Tailwind)

### 4. `registry-item.json`

Required fields:

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "{name}",
  "type": "registry:component",
  "title": "Human Readable Title",
  "description": "One sentence describing what this component does.",
  "dependencies": ["list", "of", "npm", "packages"],
  "files": [
    {
      "path": "registry/{namespace}/blocks/{name}/{name}.tsx",
      "type": "registry:component",
      "target": "components/{namespace}/{name}.tsx"
    }
  ]
}
```

- `dependencies` must list every npm package imported by the component (not devDeps, not Next.js built-ins)
- Each file in `files` must have `path` (source), `type`, and `target` (where shadcn installs it)
- Shared lib files go in `registry/{namespace}/lib/` with `type: "registry:lib"` and `target: "lib/{file}.ts"`

### 5. MDX doc page (`content/components/{name}.mdx`)

Minimum required frontmatter and content:

```mdx
---
category: "Category"
tags: ["tag1", "tag2"]
---

# Component Title

Brief description.

<RegistryDemo name="{name}"/>

## Installation

<RegistryInstall name="{name}"/>

## Props

<RegistryPropsTable name="{name}"/>
```

- `category` and `tags` are used for filtering on the components listing page
- File name must match `{name}.mdx` exactly

## Validation checklist

The `validate-component` skill checks all of the following:

- [ ] Directory exists at `registry/{namespace}/blocks/{name}/`
- [ ] `{name}.tsx` exists and exports `{PascalName}` and `{PascalName}Props`
- [ ] `example.tsx` exists
- [ ] `registry-item.json` exists with all required fields populated (no empty strings)
- [ ] `registry-item.json` `name` matches directory name
- [ ] All files listed in `registry-item.json` `files` array actually exist on disk
- [ ] No imports from `@/registry/...` inside example files (must use target path)
- [ ] MDX doc page exists (warning, not error — can be created during push)
