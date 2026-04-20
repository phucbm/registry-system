# validate-component

Validates a registry component against REGISTRY_RULES.md. Returns a pass/fail report with actionable fixes.

## Trigger

Use when:
- User says "validate [component-name]"
- User says "check if [component] is registry-ready"
- Before `push-to-registry` runs (called automatically)

## Steps

### 1 — Resolve namespace and component name

Read `NEXT_PUBLIC_REGISTRY_NAMESPACE` from `.env` or `.env.local`. If not found, ask the user.

The component directory is: `registry/{namespace}/blocks/{name}/`

### 2 — Run all checks

Check each rule. Mark each as PASS, WARN, or FAIL.

**File existence (FAIL if missing):**
- `registry/{namespace}/blocks/{name}/{name}.tsx`
- `registry/{namespace}/blocks/{name}/example.tsx`
- `registry/{namespace}/blocks/{name}/registry-item.json`

**File existence (WARN if missing):**
- `content/components/{name}.mdx`

**`registry-item.json` checks (FAIL):**
- `name` field matches `{name}` exactly
- `type` is `"registry:component"`
- `title` is non-empty
- `description` is non-empty
- `dependencies` is an array (can be empty)
- `files` array has at least one entry
- Every file in `files[].path` exists on disk
- Every file in `files` has `path`, `type`, and `target` populated

**`{name}.tsx` checks (FAIL):**
- Grep for `export function {PascalName}` or `export const {PascalName}`
- Grep for `export type {PascalName}Props`

**`example.tsx` checks (FAIL):**
- Must NOT import from `@/registry/...` — must use target path (`@/components/{namespace}/{name}`)

### 3 — Report

Print a table:

```
✅ PASS  {name}.tsx — exports HelloWorld
✅ PASS  {name}.tsx — exports HelloWorldProps
✅ PASS  registry-item.json — all required fields present
✅ PASS  example.tsx — no @/registry/ imports
⚠️ WARN  content/components/hello-world.mdx — not found (will be created on push)
```

If any FAIL: list each with the exact fix needed. Do not proceed to push.
If only WARNs: ask user if they want to continue.
If all PASS: print "✅ Component is registry-ready."

## Rules
- Never auto-fix — report only, let the user or create-component fix
- WARN does not block push, FAIL does
