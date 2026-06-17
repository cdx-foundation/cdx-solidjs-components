# GitHub Actions CI/CD for cdx-solidjs-components

**Date:** 2026-06-15
**Status:** Draft

## Overview

Set up GitHub Actions workflows to run CI checks on PRs and automatically publish releases to GitHub Packages using semantic-release.

## Workflows

### 1. CI — `ci.yml`

Triggers: `pull_request` and `push` to `main`.

Steps:

1. **Checkout** — `actions/checkout@v4`
2. **Setup Bun** — `oven-sh/setup-bun@v2`
3. **Install** — `bun install --frozen-lockfile`
4. **Lint** — `bun run lint` (Biome)
5. **Typecheck** — `bun run typecheck` (tsc)
6. **Test** — `bun run test` (Vitest)
7. **Build** — `bun run build` (Vite + tsc)

### 2. Release — `release.yml`

Triggers: `push` to `main`.

Steps:

1. Same checkout + setup + install as CI
2. Run full CI checks (lint, typecheck, test, build)
3. **semantic-release** — analyzes commits, bumps version, creates release, publishes

## Config Files

### `.releaserc.json`

Plugins:

- `@semantic-release/commit-analyzer` — parses conventional commits
- `@semantic-release/release-notes-generator` — generates changelog
- `@semantic-release/npm` — publishes to GitHub Packages
- `@semantic-release/github` — creates GitHub release

Publish target: `@semantic-release/npm` configured with `.npmrc` pointing to GitHub Packages.

### `.npmrc`

```
@cdx-foundation:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

## Secrets / Tokens

The release workflow uses two tokens:

| Token                     | Scope                                                                            | Purpose                                           |
| ------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------- |
| `GITHUB_TOKEN` (built-in) | `contents: write`, `pull-requests: write`                                        | Create GitHub release, push version commits       |
| `NPM_TOKEN` (secret)      | `packages: write` (on the GITHUB_TOKEN, or a PAT with `packages:write` + `repo`) | Publish to GitHub Packages (`npm.pkg.github.com`) |

`NPM_TOKEN` can be set to `${{ secrets.GITHUB_TOKEN }}` if the default token has sufficient permission for GitHub Packages in this repo. Otherwise, create a PAT with `packages:write` scope and store it as a repository secret.

## Developer Workflow

1. Developer creates a branch, makes changes, commits with conventional commit messages (`feat:`, `fix:`, `BREAKING CHANGE`, etc.)
2. Opens PR — CI runs lint, typecheck, test, build
3. PR merges to `main` — Release workflow runs semantic-release
4. semantic-release determines new version, publishes to GitHub Packages, creates GitHub Release

## Conventions

- Commits must follow [Conventional Commits](https://www.conventionalcommits.org/) for automatic versioning
- PR titles should follow the same convention (squash merge uses the PR title as commit message)
- `BREAKING CHANGE` in commit footer triggers major version bump
- `feat:` triggers minor, `fix:` triggers patch
- Other prefixes (`chore:`, `docs:`, `refactor:`) do not trigger a release

## Dependencies Added

- `@semantic-release/changelog` — writes CHANGELOG.md
- `@semantic-release/git` — commits package.json and CHANGELOG.md changes back to repo
- `@semantic-release/npm` — publishes to npm registry (GitHub Packages)
- `@semantic-release/github` — creates GitHub release
- `semantic-release` — main orchestrator

All added as devDependencies.
