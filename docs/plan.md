This migration plan follows a "Stability-First" approach. We will stabilize the current logic with TypeScript and Unit Tests before introducing the Svelte 5 reactive framework. This ensures that the complex animation math remains consistent throughout the transition[cite: 1].

---

# NOTE: already completed, go to phase 2
## Phase 1: Environment Setup & Node.js Initialization
The first step is to transform this from a loose collection of files into a structured development environment.

*   **Initialize NPM:** Create a `package.json` to manage dependencies.
*   **Install Vite:** Set up Vite as the build tool for fast bundling and Hot Module Replacement (HMR).
*   **Install TypeScript & Vitest:** Set up the compiler and the testing framework.
*   **Directory Structure:** Create a `src/` folder for source code and a `tests/` folder for logic verification.

---

## Phase 2: TypeScript Migration (The "Bridge" Phase) - created in docs/typescript-migration-plan.md // COMPLETED
Before moving to Svelte, we must define the "shape" of your data to prevent runtime errors in the animation loop[cite: 1].

1.  **Rename Files:** Change `app.js` to `app.ts`.
2.  **Define Interfaces:** Create types for core entities.
    *   **ICoordinate:** For `xCoordinate` and `yCoordinate`[cite: 1].
    *   **IMatrixString:** For the properties of the `MatrixString` class (word, speed, fontSize)[cite: 1].
3.  **Encapsulate Globals:** Move global variables like `columns`, `rows`, and `ctx` into a typed `State` object to improve maintainability[cite: 1].
4.  **Strict Typing:** Resolve errors where `ctx` (Canvas context) is used before being checked for `null`[cite: 1].

---

## Phase 3: High-Value Unit Testing
We will target **100% coverage** on the "Pure Logic" functions—the parts of the code that do math without touching the DOM or Canvas[cite: 1].

### Test Strategy Table
| Function Category | Target Functions | Testing Goal |
| :--- | :--- | :--- |
| **Randomization** | `generateRandomNumber`, `onePercentChance`[cite: 1] | Ensure distributions match expectations. |
| **Word Logic** | `generateWord`, `getRandomChar`[cite: 1] | Verify correct alphabet usage and string lengths. |
| **Coordinate Math** | `generateYSouth`, `generateXWest`[cite: 1] | Ensure starting points are correctly calculated outside the viewport. |
| **State Logic** | `matchColorToIndex`, `switchColor`[cite: 1] | Validate that UI inputs map to the correct color arrays. |



---

## Phase 4: Svelte 5 Migration (The "Reactive" Phase)
Now that the logic is verified and typed, we move it into Svelte 5 components.

1.  **Componentization:**
    *   **`App.svelte`:** The main entry point.
    *   **`MatrixCanvas.svelte`:** Contains the `<canvas>` element and the `draw()` loop[cite: 1, 2].
    *   **`SettingsMenu.svelte`:** Contains the HTML controls for Disco, Colors, and Directions[cite: 2].
2.  **Implement Runes:**
    *   Replace `let discoOn` with `$state(false)` to make it reactive across components[cite: 1].
    *   Use `$derived` for values like `columns` that depend on the window size[cite: 1].
3.  **Manage Side Effects:**
    *   Wrap the `setInterval` or `requestAnimationFrame` logic inside a `$effect` rune to ensure it only runs when the canvas is mounted[cite: 1].
4.  **Styling:** Migrate `style.css` into Svelte's scoped `<style>` blocks to prevent global style leakage[cite: 3].

---

## Phase 5: Linting and Coverage Validation
To satisfy the "Senior Engineer Roast" requirements, we enforce strict code quality.

*   **Linter Integration:** Run ESLint with rules that forbid `var` and enforce the use of ES6 `const/let`[cite: 1].
*   **Final Coverage Report:** Run `npx vitest run --coverage` to ensure the refactored `utils.ts` still has 100% coverage after being integrated into Svelte.
*   **Static Build:** Use `vite build` to generate the final static assets for deployment.

### Final Command for Gemini CLI
Copy and paste this to start the process:
```text
/plan Initialize a Vite + Svelte 5 + TypeScript project. Use 'run_shell_command' to move logic from app.js into a typed 'src/lib/utils.ts'. Generate Vitest cases for generateRandomNumber and generateWord. Then, provide a Svelte 5 component structure for the Canvas loop.
```