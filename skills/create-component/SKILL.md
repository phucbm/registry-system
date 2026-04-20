---
name: create-component
description: Scaffold a new registry component with all required files following REGISTRY_RULES.md. Use when the user says "create registry component [name]", "add [name] to the registry", or "scaffold [name]".
when_to_use: When the user wants to add a new component to the current project's registry.
allowed-tools: Bash Read Write Edit Glob
---

Scaffolds a new registry component in the current project following REGISTRY_RULES.md.

## Steps

### 1 — Gather info

Ask (or read from args) if not obvious:
- Component name (kebab-case)
- Brief description (one sentence)
- npm dependencies (comma-separated, or "none")
- Category (e.g. "Animation", "Layout", "Text")
- Tags (comma-separated)

Read `NEXT_PUBLIC_REGISTRY_NAMESPACE` from `.env` / `.env.local`. Fail loudly if missing.

### 2 — Confirm before writing

Show the user the full file list that will be created:
```
registry/{namespace}/blocks/{name}/{name}.tsx
registry/{namespace}/blocks/{name}/example.tsx
registry/{namespace}/blocks/{name}/registry-item.json
content/components/{name}.mdx
```

Ask: "Create these files? (yes/no)"

### 3 — Write files

Use these exact templates:

**`{name}.tsx`:**
```tsx
import { cn } from "@/lib/utils";

export type {PascalName}Props = {
    className?: string;
    // TODO: add your props here
};

export function {PascalName}({ className }: {PascalName}Props) {
    return (
        <div className={cn("", className)}>
            {/* TODO: implement */}
        </div>
    );
}
```

**`example.tsx`:**
```tsx
import { {PascalName} } from "@/components/{namespace}/{name}";

export default function {PascalName}Example() {
    return (
        <div className="p-8">
            <{PascalName} />
        </div>
    );
}
```

**`registry-item.json`:** fill with provided name, title, description, dependencies.

**`{name}.mdx`:** use the standard MDX template from REGISTRY_RULES.md with provided category and tags.

### 4 — Done

Print:
```
✅ Created 4 files for "{name}".
Next: implement the component, then run validate-component to confirm it's registry-ready.
```

## Rules
- Never overwrite existing files — check first, warn if any exist
- PascalName is derived by converting kebab-case to PascalCase (e.g. `my-button` → `MyButton`)
- Always include `cn` import from `@/lib/utils` — it's a registry convention
