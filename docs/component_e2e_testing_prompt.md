I have a Svelte 5 + Vite + TypeScript + Vitest project (Digital Rain animation).
The existing test setup uses Vitest with @vitest/coverage-v8. Tests currently cover
pure logic in src/lib/utils/ and src/lib/engine/CoreEngine.ts.

I want to add two new testing layers:

## 1. Svelte Component Tests (Vitest + @testing-library/svelte)

Install:
npm install -D @testing-library/svelte @testing-library/jest-dom jsdom

Update vitest.config.ts (create it if it doesn't exist, currently config may be
inline in vite.config.ts) to add:
environment: 'jsdom'
setupFiles: ['./src/tests/setup.ts']

Create src/tests/setup.ts that imports @testing-library/jest-dom.

Write component tests for:

src/lib/components/**tests**/SettingsMenu.test.ts - renders START and SQUARE buttons - clicking START calls onStartNormal prop - clicking SQUARE calls onStartSquare prop - disco checkbox toggles discoOn binding - color select is hidden when discoOn is true - frameCount input is visible when discoOn is true - all4Directions button text changes when toggled

src/lib/components/**tests**/App.test.ts - renders SettingsMenu on load (menuVisible starts true) - after onStartNormal fires, MatrixCanvas is shown (menuVisible = false) - after onStartSquare fires, MatrixCanvas is shown - MatrixCanvas onReturn callback sets menuVisible back to true

For MatrixCanvas, mock the canvas getContext call and engine.run/engine.setContext
since we cannot render real canvas animations in jsdom.

## 2. E2E Tests (Playwright)

Install:
npm install -D @playwright/test
npx playwright install chromium

Create playwright.config.ts at the project root:

- webServer: { command: 'npm run dev', url: 'http://localhost:5173', reuseExistingServer: true }
- testDir: './e2e'
- use: { baseURL: 'http://localhost:5173' }
- projects: [{ name: 'chromium', use: devices['Desktop Chrome'] }]

Create e2e/ directory with:

e2e/menu.spec.ts - page loads showing the menu (DIGITAL RAIN heading visible) - START button is visible - SQUARE button is visible - clicking the disco checkbox hides the color select - clicking the disco checkbox shows the frameCount input - All 4 Directions button text changes on click

e2e/animation.spec.ts - clicking START hides the menu and shows the canvas element - pressing Escape returns to the menu - clicking SQUARE hides the menu and shows the canvas element - pressing Escape from square mode returns to the menu

Add to package.json scripts:
"test:e2e": "playwright test"
"test:e2e:ui": "playwright test --ui"

## Constraints

- Follow existing code style: const over let, curly braces always, no var
- Do not modify src/app.js (legacy reference file)
- After implementation run: npx eslint . --fix && npx prettier --write . && npm test
- The e2e tests should not try to assert on canvas pixel content, only DOM structure
  (canvas element presence, menu visibility, heading text)
