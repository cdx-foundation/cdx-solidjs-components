# GitHub Actions CI/CD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add CI checks on PRs and automated npm releases to GitHub Packages using semantic-release.

**Architecture:** Two GitHub Actions workflows: `ci.yml` runs lint/typecheck/test/build on PRs; `release.yml` runs full CI + semantic-release on push to main. Config files (`.releaserc.json`, `.npmrc`) configure the publish target and versioning rules. An existing `deploy.yml` handles demo deploys — no changes needed there.

**Tech Stack:** GitHub Actions, Bun, Biome, TypeScript, Vitest, Vite, semantic-release, GitHub Packages

---

### Task 1: Add semantic-release devDependencies

**Files:**

- Modify: `package.json`

- [ ] **Step 1: Install semantic-release and plugins**

```bash
bun add -d semantic-release @semantic-release/changelog @semantic-release/git @semantic-release/npm @semantic-release/github
```

Expected output: packages added to `devDependencies` in `package.json` and `bun.lock` updated.

- [ ] **Step 2: Commit**

```bash
git add package.json bun.lock
git commit -m "chore: add semantic-release devDependencies"
```

---

### Task 2: Create `.releaserc.json`

**Files:**

- Create: `.releaserc.json`

- [ ] **Step 1: Write `.releaserc.json`**

```json
{
  "branches": ["master"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/npm",
    "@semantic-release/github",
    "@semantic-release/git"
  ]
}
```

Key config details:

- `branches: ["master"]` — only release from the `master` branch (matches existing `deploy.yml` target)
- `@semantic-release/changelog` generates/updates `CHANGELOG.md`
- `@semantic-release/npm` publishes to the registry configured in `.npmrc` (GitHub Packages)
- `@semantic-release/github` creates a GitHub Release with release notes
- `@semantic-release/git` commits back the version bump in `package.json` and `CHANGELOG.md`

- [ ] **Step 2: Commit**

```bash
git add .releaserc.json
git commit -m "chore: add semantic-release config"
```

---

### Task 3: Create `.npmrc` for GitHub Packages

**Files:**

- Create: `.npmrc`

- [ ] **Step 1: Write `.npmrc`**

```
@cdx-foundation:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

This tells npm/pnpm/bun to:

- Resolve `@cdx-foundation/*` packages via GitHub Packages instead of public npm
- Use the `NPM_TOKEN` environment variable (set in GitHub Actions as a secret) for authentication

**Note:** The `NPM_TOKEN` in CI will be set to `${{ secrets.GITHUB_TOKEN }}` (built-in, sufficient for GitHub Packages within the same repo). Alternatively, a PAT with `packages:write` scope can be stored as a repo secret.

- [ ] **Step 2: Commit**

```bash
git add .npmrc
git commit -m "chore: configure npm for GitHub Packages"
```

---

### Task 4: Create CI workflow

**Files:**

- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Write `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  push:
    branches: [master]
  pull_request:
    branches: [master]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Lint
        run: bun run lint

      - name: Typecheck
        run: bun run typecheck

      - name: Test
        run: bun run test

      - name: Build
        run: bun run build
```

Key details:

- Runs on PRs to `master` and pushes to `master`
- `concurrency` group cancels stale runs (new push to same PR/branch cancels the old run)
- Uses `bun install --frozen-lockfile` for reproducible installs (matching existing `deploy.yml` pattern)
- Four checks: Biome lint → TypeScript typecheck → Vitest tests → Vite build

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "chore: add CI workflow"
```

---

### Task 5: Create Release workflow

**Files:**

- Create: `.github/workflows/release.yml`

- [ ] **Step 1: Write `.github/workflows/release.yml`**

```yaml
name: Release

on:
  push:
    branches: [master]

permissions:
  contents: write
  pull-requests: write
  packages: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          persist-credentials: false

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Lint
        run: bun run lint

      - name: Typecheck
        run: bun run typecheck

      - name: Test
        run: bun run test

      - name: Build
        run: bun run build

      - name: Semantic Release
        uses: cycjimmy/semantic-release-action@v4
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Key details:

- Triggers on push to `master` only (not on PRs)
- `permissions` block grants `contents: write`, `pull-requests: write`, `packages: write` — needed for semantic-release to create GitHub releases, push changelog commits, and publish packages
- `fetch-depth: 0` is required for semantic-release to scan all commits for changelog
- `persist-credentials: false` avoids token leakage
- Runs full CI checks before semantic-release (fail fast)
- `NPM_TOKEN: ${{ secrets.GITHUB_TOKEN }}` — using the built-in GitHub token which has permission to publish GitHub Packages to the same repository
- Uses `cycjimmy/semantic-release-action@v4` action which handles semantic-release execution cleanly

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/release.yml
git commit -m "chore: add release workflow with semantic-release"
```

---

### Task 6: Verify everything

- [ ] **Step 1: Verify file structure**

```bash
ls -la .github/workflows/
ls -la .releaserc.json .npmrc
```

Expected:

- `.github/workflows/ci.yml` exists
- `.github/workflows/release.yml` exists
- `.github/workflows/deploy.yml` exists (unchanged)
- `.releaserc.json` exists
- `.npmrc` exists

- [ ] **Step 2: Verify YAML syntax**

```bash
bunx --yes yaml-lint .github/workflows/ci.yml .github/workflows/release.yml
```

Expected: No errors.

- [ ] **Step 3: Verify JSON syntax of releaserc**

```bash
bunx --yes jsonlint .releaserc.json
```

Expected: No errors.

- [ ] **Step 4: Final commit if verification steps were added**

```bash
git add -A
git status
```
