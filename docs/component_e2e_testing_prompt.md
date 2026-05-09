I have a Svelte 5 + Vite + TypeScript + Vitest project (Digital Rain animation).
The existing test setup uses Vitest with @vitest/coverage-v8. Tests currently cover pure logic in `src/lib/utils/` and `src/lib/engine/CoreEngine.ts`.

I want to add two new testing layers:

## 1. Svelte Component Tests (Vitest + @testing-library/svelte)

Install:

```
npm install -D @testing-library/svelte @testing-library/jest-dom jsdom
```

Update `vitest.config.ts` (create it if it doesn't exist, currently config may be inline in `vite.config.ts`) to add:

```
environment: 'jsdom'
setupFiles: ['./src/tests/setup.ts']
```

Create `src/tests/setup.ts` that imports `@testing-library/jest-dom`.

Write component tests for:

**`src/lib/components/__tests__/SettingsMenu.test.ts`**

- renders START and SQUARE buttons
- clicking START calls onStartNormal prop
- clicking SQUARE calls onStartSquare prop
- disco checkbox toggles discoOn binding
- color select is hidden when discoOn is true
- frameCount input is visible when discoOn is true
- all4Directions button text changes when toggled
- **COLOR REGRESSION TEST:** Change the color select to each of the 8 color options (green, red, yellow, blue, orange, pink, cyan, random) in sequence, cycling through all 20 times total. After each change, use `waitFor` to assert that the `style` attribute on `.menu-container` has updated to a new, non-empty color value. Assert that the color value matches the known hex constant for that color (import the hex values from `$lib/constants/Assets`). For the "random" option, assert only that the color is a valid hex string matching `/^#[0-9A-Fa-f]{6}$/`. This test is specifically designed to catch a Svelte 5 reactivity bug where `$derived` values depending on `$state` written inside a `$effect` lag one render behind — if colors stop updating after several changes, this test will fail and reveal the regression.

**`src/lib/components/__tests__/App.test.ts`**

- renders SettingsMenu on load (menuVisible starts true)
- after onStartNormal fires, MatrixCanvas is shown (menuVisible = false)
- after onStartSquare fires, MatrixCanvas is shown
- MatrixCanvas onReturn callback sets menuVisible back to true

For MatrixCanvas, mock the canvas `getContext` call and `engine.run`/`engine.setContext` since we cannot render real canvas animations in jsdom.

## 2. E2E Tests (Playwright)

Install:

```
npm install -D @playwright/test
npx playwright install chromium
```

Create `playwright.config.ts` at the project root:

- `webServer: { command: 'npm run dev', url: 'http://localhost:5173', reuseExistingServer: true }`
- `testDir: './e2e'`
- `use: { baseURL: 'http://localhost:5173' }`
- `projects: [{ name: 'chromium', use: devices['Desktop Chrome'] }]`

Create `e2e/` directory with:

**`e2e/menu.spec.ts`**

- page loads showing the menu (DIGITAL RAIN heading visible)
- START button is visible
- SQUARE button is visible
- clicking the disco checkbox hides the color select
- clicking the disco checkbox shows the frameCount input
- All 4 Directions button text changes on click

**`e2e/animation.spec.ts`**

- clicking START hides the menu and shows the canvas element
- pressing Escape returns to the menu
- clicking SQUARE hides the menu and shows the canvas element
- pressing Escape from square mode returns to the menu

Add to `package.json` scripts:

```
"test:e2e": "playwright test"
"test:e2e:ui": "playwright test --ui"
```

## Constraints

- Follow existing code style: `const` over `let`, curly braces always, no `var`
- Do not modify `src/app.js` (legacy reference file)
- After implementation run: `npx eslint . --fix && npx prettier --write . && npm test`
- The e2e tests should not try to assert on canvas pixel content, only DOM structure (canvas element presence, menu visibility, heading text)
- The color regression test in `SettingsMenu.test.ts` **must use `waitFor` after each color change** to allow Svelte's reactive system to flush before asserting. Do not assert synchronously immediately after firing the change event.
- If the color regression test fails, **do not adjust the test to make it pass** — instead fix the `currentColor` derivation in `SettingsMenu.svelte` so that it is a pure `$derived` with no dependency on state written by a `$effect`. The correct fix is to ensure color resolution is entirely synchronous and side-effect free.
