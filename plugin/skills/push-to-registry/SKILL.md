# push-to-registry

Takes a validated component from the current project and opens a PR in a target registry repo.

## Trigger

Use when:
- User says "push [component-name] to registry"
- User says "send [component] to [repo]"
- User says "add [component] to phucbm/my-registry"

## Steps

### 1 — Validate source component

Run `validate-component` for the component. If any FAIL, stop and show the report. Do not continue until all failures are resolved.

### 2 — Identify target repo

Ask the user: "Which registry repo is the target?" (e.g. `phucbm/project-b`)

If the user already provided it in their message, use that.

### 3 — Check target repo has registry-system

```bash
gh repo view {target-repo} --json name 2>&1   # confirm repo exists
```

Clone target repo to a temp dir:
```bash
git clone https://github.com/{target-repo}.git /tmp/registry-push-target --depth=1
```

Check that `/tmp/registry-push-target/src/registry-system/` exists. If not:
> "Target repo does not have registry-system installed. Ask the owner to install it first, or install it yourself via: npx degit phucbm/registry-system"
Stop.

Read `NEXT_PUBLIC_REGISTRY_NAMESPACE` from target repo's `.env` or `.env.example`. Use that namespace for the target path.

### 4 — Check for conflicts

Check if `registry/{target-namespace}/blocks/{name}/` already exists in the target repo.

If yes: ask "Component already exists in target. Overwrite? (yes/no/diff)"
- `diff` → show what changed
- `no` → stop
- `yes` → continue

### 5 — Create branch and copy files

```bash
cd /tmp/registry-push-target
git checkout -b registry/{name}
```

Copy from source project:
- `registry/{source-namespace}/blocks/{name}/` → `registry/{target-namespace}/blocks/{name}/`
- `content/components/{name}.mdx` → `content/components/{name}.mdx` (if exists)

Update namespace references inside copied files:
- `registry-item.json`: update `files[].path` to use `{target-namespace}`
- `registry-item.json`: update `files[].target` to use `{target-namespace}`
- `example.tsx`: update import path namespace if different

### 6 — Commit and push

```bash
git add .
git commit -m "feat: add {name} component to registry"
git push origin registry/{name}
```

### 7 — Open PR

```bash
gh pr create \
  --repo {target-repo} \
  --title "feat: add {name} to registry" \
  --body "$(cat <<'EOF'
## New registry component: {name}

{description from registry-item.json}

### Files added
- `registry/{namespace}/blocks/{name}/`
- `content/components/{name}.mdx`

### Validation
- Passed all registry rules checks
- Source: {source-repo or local project name}

🤖 Created via [registry-system](https://github.com/phucbm/registry-system) Claude plugin
EOF
)"
```

### 8 — Done

Print the PR URL and clean up temp dir.

## Rules
- Never push directly to main — always create a branch + PR
- Never modify files in the source project during this skill
- Clean up `/tmp/registry-push-target` after completing (or failing)
- If target namespace differs from source namespace, update all path references in copied files
