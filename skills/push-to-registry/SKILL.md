---
name: push-to-registry
description: Validate a component and open a PR to add it to a target registry repo. Use when the user says "push [name] to registry", "send [component] to [repo]", or "add [component] to phucbm/my-registry".
when_to_use: When the user wants to share a local registry component with another project's registry via a pull request.
allowed-tools: Bash Read Write Edit Glob Grep
---

Takes a validated component from the current project and opens a PR in a target registry repo.

## Steps

### 1 — Validate source component

Run `validate-component` for the component. If any FAIL, stop and show the report. Do not continue until all failures are resolved.

### 2 — Identify target repo

Ask the user: "Which registry repo is the target?" (e.g. `phucbm/project-b`)

If the user already provided it in their message, use that.

### 3 — Check target repo has registry-system

```bash
gh repo view {target-repo} --json name
```

Clone target repo to a temp dir:
```bash
git clone https://github.com/{target-repo}.git /tmp/registry-push-target --depth=1
```

Check that `/tmp/registry-push-target/src/registry-system/` exists. If not, stop:
> "Target repo does not have registry-system installed. Install it via: npx degit phucbm/registry-system"

Read `NEXT_PUBLIC_REGISTRY_NAMESPACE` from target repo's `.env` or `.env.example`. Use that as `{target-namespace}`.

### 4 — Check for conflicts

Check if `registry/{target-namespace}/blocks/{name}/` already exists in the target repo.

If yes: ask "Component already exists in target. Overwrite? (yes/no/diff)"
- `diff` → show what changed
- `no` → stop
- `yes` → continue

### 5 — Create branch and copy files

```bash
cd /tmp/registry-push-target && git checkout -b registry/{name}
```

Copy from source project:
- `registry/{source-namespace}/blocks/{name}/` → `registry/{target-namespace}/blocks/{name}/`
- `content/components/{name}.mdx` → `content/components/{name}.mdx` (if exists)

Update namespace references inside copied files if source and target namespaces differ:
- `registry-item.json` `files[].path` and `files[].target`
- `example.tsx` import path

### 6 — Commit, push, open PR

```bash
git add . && git commit -m "feat: add {name} component to registry"
git push origin registry/{name}
gh pr create --repo {target-repo} \
  --title "feat: add {name} to registry" \
  --body "..."
```

### 7 — Done

Print the PR URL and clean up `/tmp/registry-push-target`.

## Rules
- Never push directly to main — always branch + PR
- Never modify files in the source project
- Clean up the temp dir after completing or failing
- If namespaces differ, update all path references in copied files
