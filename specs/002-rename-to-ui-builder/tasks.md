# Tasks: Rename to 'UI Builder'

Parent issue: #165

**Input**: Design documents from `/Users/ghost/dev/repos/OpenZeppelin/contracts-ui-builder/specs/002-rename-to-ui-builder/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Phase 3.1: Setup

- [x] T001 Confirm working branch `002-rename-to-ui-builder` and sync main
- [x] T002 Ensure CI green on main and Changesets configured (`/.changeset/` exists)
- [x] T003 [P] Add tracking issue referencing spec and plan in `/specs/002-rename-to-ui-builder/`

## Phase 3.2: Tests First (TDD) – Validation Scans

- [x] T004 [P] Create grep script `/scripts/rename/scan-user-facing.sh` to find "Contracts UI Builder" and "OpenZeppelin Contracts UI Builder" in user-facing paths (builder UI, docs, exports)
- [x] T005 [P] Create grep script `/scripts/rename/scan-internal.sh` to find legacy terms and `contracts-ui-builder` in comments/docs
- [x] T006 [P] Create CI check step draft `/scripts/rename/ci-assert-no-legacy.sh` that fails on matches (to be integrated in PRs)

## PR A: User-Facing Rename Sweep

Tracking: Issue #169, PR #168

- [x] T007 Update builder app title and visible strings in `packages/builder/index.html` and `packages/builder/src/App.tsx`
- [x] T008 [P] Replace UI strings across builder components under `packages/builder/src/components/` referencing legacy name
- [x] T009 [P] Update export templates text in `packages/builder/src/export/templates/typescript-react-vite/README.md` and `index.html`
- [x] T010 [P] Update docs visible titles and badges in `docs/modules/ROOT/pages/*.adoc` and root `README.md`
- [x] T011 [P] Update adapter READMEs (evm/solana/stellar/midnight) under `packages/adapter-*/README.md`
- [x] T012 Run T004 to validate zero legacy strings in user-facing surfaces; fix residuals
- [x] T013 Build and test: `pnpm -r build && pnpm -r test`
- [x] T014 Prepare PR A summary and screenshots; do not touch package names

## PR B: Codebase & Docs Rename

Tracking: Issue #170

- [x] T015 Update repository description/title; prepare slug rename in `README.md`, `docs/antora.yml`, badges
- [x] T016 [P] Update internal docs headings and section titles across `/docs/**` and `/packages/**/README.md`
- [x] T017 [P] Update comments/JSDoc references to use "UI Builder" [P]
- [x] T018 [P] Update links and image alt text in READMEs [P]
- [ ] T018a [P] Rename code identifiers (components/classes/functions) containing `ContractsUI*` to `UI*`; update all exports and imports
- [ ] T018b [P] Rename file and directory paths containing `ContractsUIBuilder` to `UIBuilder`; update import paths
- [ ] T018c Update Storybook stories, docs, and test snapshots to use new identifiers
- [x] T019 Update `package.json` `homepage`, `repository`, `bugs` URLs across packages
- [x] T020 Run T005 to validate no unintended legacy strings remain in codebase/docs
- [x] T021 Build and test across monorepo; update any test snapshots referencing legacy strings
- [x] T022 Submit PR B

## PR C: Packages & Imports + Migration

Tracking: Issue #171

- [x] T023 Finalize mapping in `/specs/002-rename-to-ui-builder/data-model.md` `PackageMapping` table
- [x] T024 Update package names in package manifests across workspace (e.g., `packages/types/package.json`, `packages/utils/package.json`, `packages/ui/package.json`, others per mapping)
- [x] T025 Update internal workspace dependencies to new names
- [x] T026 Update import paths in source files referencing `@openzeppelin/contracts-ui-builder-*` (grep list from analysis) [P]
- [x] T027 Update CI publish workflows and Changesets to publish new names and deprecate legacy packages
- [x] T028 Author deprecation messages per `/specs/002-rename-to-ui-builder/contracts/package-migration-contracts.md` and link new packages
- [x] T029 Full typecheck/build/test: `pnpm -r build && pnpm -r test`
- [x] T030 Post-publish verification script `/scripts/rename/post-publish-verify.sh` to `npm info` new and old packages
- [x] T031 Submit PR C (README migration notes omitted; mapping lives in `specs/002-rename-to-ui-builder/data-model.md`)

## Dependencies

- Setup (T001–T003) before PR tasks
- Scans (T004–T006) before and after each PR to validate
- PR A before PR B; PR B before PR C
- Package name updates (T024–T025) before import updates (T026)
- CI workflow updates (T027) before publish verification (T030)

## Parallel Execution Examples

```
# Parallel user-facing replacements (different files):
Task: T008 Replace UI strings in builder components
Task: T009 Update export template texts
Task: T010 Update docs visible titles/badges
Task: T011 Update adapter READMEs

# Parallel internal documentation updates:
Task: T016 Update internal docs headings
Task: T017 Update comments/JSDoc mentions
Task: T018 Update links and alt text
```
