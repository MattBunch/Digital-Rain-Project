# TypeScript Migration Plan

## Objective

Migrate the Digital Rain project from JavaScript to TypeScript to improve type safety, maintainability, and reduce runtime errors in the animation loop.

## Phase 1: Preparation & Configuration

- [ ] Initialize TypeScript configuration (`tsconfig.json`).
- [ ] Install necessary dev dependencies (e.g., `typescript`, `@types/node`, `@types/dom-view`).
- [ ] Configure build process to handle `.ts` files.

## Phase 2: Core Infrastructure (Types)

- [ ] Define shared interfaces in `src/types/`:
  - `ICoordinate` (x, y)
  - `IMatrixString` (word, speed, fontSize, etc.)
  - `IAppState` (columns, rows, context, animation state)

## Phase 3: Incremental Migration

1. **Constants**: Migrate `src/constants/*.js` to `.ts`.
2. **Utils**: Migrate `src/utils/*.js` to `.ts` (ensure existing tests pass).
3. **Models**: Migrate `src/models/*.js` to `.ts`.
4. **Engine**: Migrate `src/engine/*.js` to `.ts`.
5. **Controllers**: Migrate `src/controllers/*.js` to `.ts`.
6. **UI**: Migrate `src/ui/*.js` to `.ts`.

NOTE: after tests pass, migrate test files to typescript ts files as well.

## Phase 4: Application Entry

- [ ] Update `src/main.ts` as the new entry point.
- DO NOT update app.js, leave this as legacy reference file.

## Verification

- [ ] Run type checker (`tsc --noEmit`).
- [ ] Run existing tests for each module as it is migrated.
- [ ] Ensure application renders correctly in the browser.
