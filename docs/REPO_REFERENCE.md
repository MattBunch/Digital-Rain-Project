# Digital Rain Project — Repository Reference

A Matrix-style digital rain animation for the browser, originally written in vanilla JS (2020), modernized in 2025 into a **Svelte 5 + TypeScript + Vite** stack.

---

## Tech Stack

| Tool                  | Purpose              |
| --------------------- | -------------------- |
| Svelte 5 (Runes mode) | UI framework         |
| TypeScript 6          | Type safety          |
| Vite 8                | Build tool & HMR     |
| Vitest 4              | Unit testing         |
| Playwright            | E2E testing          |
| ESLint + Prettier     | Linting & formatting |

---

## Project Structure

```
src/
├── app.js                        # Legacy reference only — DO NOT DELETE (see GEMINI.md)
├── main.ts                       # Entry point — mounts App.svelte
├── App.svelte                    # Root component; owns all reactive state
├── style.css                     # Global styles
│
└── lib/
    ├── components/               # Svelte UI components
    │   ├── MatrixCanvas.svelte   # <canvas> element + animation loop wiring
    │   ├── SettingsMenu.svelte   # Main menu (color, disco, direction, etc.)
    │   ├── CRTOverlay.svelte     # Scanlines / vignette / flicker effects
    │   ├── CyberButton.svelte    # Styled button with glitch effect
    │   ├── CyberCheckbox.svelte  # Custom accessible checkbox
    │   ├── CyberSelect.svelte    # Custom dropdown selector
    │   ├── CyberNumericInput.svelte # Stepper input
    │   ├── HelpModal.svelte      # Keyboard shortcut reference modal
    │   ├── KeyCap.svelte         # Keyboard key display widget
    │   └── __tests__/            # Component unit tests (Testing Library)
    │
    ├── engine/
    │   ├── CoreEngine.ts         # All animation state + draw loop logic
    │   └── __tests__/            # Engine unit tests
    │
    ├── models/
    │   └── MatrixString.ts       # MatrixString class — one falling string
    │
    ├── utils/
    │   ├── MathUtils.ts          # Pure math: RNG, word gen, color gen
    │   ├── CoordinateUtils.ts    # Starting position generators, canvas setup
    │   ├── ScrambleAction.ts     # Svelte action: text scramble on hover
    │   ├── FallingLettersAction.ts # Svelte action: Matrix letters on state change
    │   └── __tests__/            # Utils unit tests
    │
    ├── constants/
    │   ├── Assets.ts             # Color constants, alphabet, direction strings
    │   ├── HelpData.ts           # Keyboard shortcut data for HelpModal
    │   └── matrix.ts             # Alternative constants (ALPHABET, COLORS, DEFAULT_CONFIG)
    │
    └── types/
        └── index.ts              # Shared interfaces: ICoordinate, IMatrixStringOptions, Direction, IEngineSettings

e2e/                              # Playwright E2E tests
├── animation.spec.ts
├── color-regression.spec.ts
├── cyber-ui.spec.ts
└── menu.spec.ts
```

---

## Architecture Overview

### State Flow

```
App.svelte  ($state)
  ├── discoOn, chosenColor, all4Directions, frameCount, mode, menuVisible
  ├── synced to CoreEngine via $effect
  │
  ├── SettingsMenu.svelte  (bind: props)
  │     Controls color/disco/directions from menu UI
  │
  └── MatrixCanvas.svelte  (engine prop + bind: props)
        Owns canvas lifecycle via $effect
        Handles keyboard input directly
        Calls engine.run() / engine.resetWordsArray() etc.
```

### Animation Loop

`CoreEngine` uses `requestAnimationFrame` (not `setInterval`) with delta-time speed normalization:

```
CoreEngine.run()
  → requestAnimationFrame(loop)
    → loop(timestamp)
      → speedFactor = deltaTime / intervalSpeed
      → draw(words, ..., speedFactor)   or   drawAlternative()
      → requestAnimationFrame(loop)
```

### Canvas Mirroring (Important Gotcha)

The canvas is horizontally mirrored using:

```ts
ctx.translate(canvas.width, 0);
ctx.scale(-1, 1);
```

This means **visual left = positive X** and **visual right = negative X**. The `moveSquareLeft` method increments X (moves visually left), and `moveSquareRight` decrements X. The unit tests document this with comments like `// mirrored: +X`.

---

## Core Classes

### `CoreEngine` (`src/lib/engine/CoreEngine.ts`)

The central state machine and draw coordinator.

**Key properties:**

- `words: MatrixString[]` — active strings for current direction
- `all4DirectionsArray: MatrixString[][]` — [north, south, east, west] arrays
- `direction: string` — `'north' | 'south' | 'east' | 'west'`
- `discoOn, chosenColor, all4Directions, rapidWordChange` — animation flags
- `x1, x2, y1, y2` — square animation bounding box
- `colorChoiceArray: string[][]` — indexed color arrays (0=green … 7=random)

**Key methods:**

- `setContext(canvas, ctx)` — wires up the canvas after mount
- `run(original)` — starts RAF loop; `original=true` → normal mode, `false` → square mode
- `draw(inputWords, passThroughToDraw, speedFactor)` — main draw call
- `drawAlternative()` — square animation mode draw call
- `pause()` — toggles RAF loop on/off
- `reset()` — clears state back to defaults
- `matchColorToIndex(input)` — maps color name string → `colorChoiceArray` index
- `switchColor(input)` — sets `chosenColor`

### `MatrixString` (`src/lib/models/MatrixString.ts`)

Represents one falling string of characters.

**Key properties:** `word, x, y, xSpeed, ySpeed, fontSize, XYCoordinates`

**Key methods:**

- `show(ctx, colorArray, config, discoCallback)` — normal mode render
- `showAlternative(ctx, colorArray, config, squareConfig)` — square mode render
- `setColors(ctx, i, colorArray, direction)` — applies color gradient (white tip → full color)
- `getXCoordinateFromDirection / getYCoordinateFromDirection` — layout per direction

---

## Utility Functions

### `MathUtils.ts`

| Function                         | Description                                            |
| -------------------------------- | ------------------------------------------------------ |
| `generateRandomNumber(min, max)` | Uniform random float in range                          |
| `onePercentChance()`             | Returns true ~1% of the time                           |
| `twentyfivePercentChance()`      | Returns true ~25% of the time                          |
| `generateWord(size)`             | Random string of `size` chars from alphabet            |
| `getRandomChar()`                | Single random char from alphabet                       |
| `generateFontSize(base)`         | `base ± 5`, floored                                    |
| `generateSpeed()`                | Random float `0.001–9.999`                             |
| `generateWordSizeRand(min, max)` | Floored random int in range                            |
| `getRandomColor()`               | Random `#RRGGBB` hex string                            |
| `generateRandomColorArray()`     | Array of 3 random hex colors                           |
| `hexToRgb(hex)`                  | Converts `#RRGGBB` → `"r, g, b"` string (for CSS vars) |
| `doubleInt(n)`                   | `n * 2`                                                |

### `CoordinateUtils.ts`

| Function                                              | Description                                                       |
| ----------------------------------------------------- | ----------------------------------------------------------------- |
| `canvasSetup(w, h, canvas, ctx, fontSize)`            | Sets canvas dimensions, mirrors canvas, returns `{columns, rows}` |
| `generateYSouth(wordLen, fontSize, height)`           | Starting Y above viewport (for southward strings)                 |
| `generateYNorth(height)`                              | Starting Y below viewport (for northward strings)                 |
| `generateXEast(width, height)`                        | Starting X right of viewport                                      |
| `generateXWest(wordLen, fontSize, width, height)`     | Starting X left of viewport                                       |
| `isCanvasLarge(height)`                               | `height > 1000`                                                   |
| `calculateAverageStartingPosition(coords, direction)` | Debug/utility: average X or Y of coord array                      |

---

## Color System

Colors are stored in `Assets.ts` as named constants and arrays. Each color has 3 shades: `90% white blend → 70% white blend → pure color`. This creates the fading trail effect (white tip → full color).

```
colorChoiceArray index:
  0 = green    (#ccffd9, #80ff9f, #00ff41)
  1 = red      (#ffcccc, #ff6666, #e60000)
  2 = yellow   (#ffffe6, #ffff66, #ffff00)
  3 = blue     (#e6e6ff, #6666ff, #0000ff)
  4 = orange   (#fff5e6, #ffc266, #ff9900)
  5 = pink     (#ffe6ff, #ff66ff, #ff00ff)
  6 = cyan     (#e6ffff, #66ffff, #00ffff)
  7 = random   (3 random hex colors, regenerated on demand)
```

---

## Animation Modes

### Normal Mode (`original = true`)

- Strings fall/rise/travel in one direction
- Direction: `north | south | east | west` or all 4 simultaneously
- Strings reset to off-screen when they leave the viewport

### Square Mode (`original = false`)

- Same strings but constrained to fill the screen
- A white square (bounding box `x1,y1 → x2,y2`) is drawn
- Strings inside the box render white; outside render in chosen color
- Square can be moved with arrow keys; can animate randomly

---

## Keyboard Controls

### Normal Mode

| Key               | Action                                                       |
| ----------------- | ------------------------------------------------------------ |
| Arrow keys        | Change direction                                             |
| Space             | Pause                                                        |
| C                 | Clear (reset string positions)                               |
| D                 | Toggle disco mode                                            |
| W / S             | Increase / decrease font size                                |
| Q / A             | Increase / decrease string length                            |
| R                 | Toggle rapid word change                                     |
| M                 | Switch between Normal and Square mode                        |
| I                 | Toggle all 4 directions simultaneously                       |
| O                 | Toggle background fade                                       |
| PageUp / PageDown | Speed up / slow down                                         |
| 1–8               | Change color (green/red/yellow/blue/orange/pink/cyan/random) |
| Escape            | Return to menu                                               |

### Square Mode (additions / overrides)

| Key        | Action                                  |
| ---------- | --------------------------------------- |
| Arrow keys | Move the square                         |
| G          | Toggle fixed word length                |
| P / ;      | Increase / decrease random square speed |

---

## Testing

```bash
npm test              # Vitest unit tests (watch mode)
npm run test:coverage # Vitest with v8 coverage report
npm run test:e2e      # Playwright E2E (requires dev server)
npm run test:e2e:ui   # Playwright with interactive UI
```

**Unit test targets (100% coverage goal):**

- `MathUtils.ts` — all pure math functions
- `CoordinateUtils.ts` — all coordinate generators
- `CoreEngine.ts` — animation lifecycle, color logic, square movement
- Svelte components — via `@testing-library/svelte`

---

## Development Commands

```bash
npm run dev        # Start Vite dev server (http://localhost:5173)
npm run build      # Production build → dist/
npm run preview    # Preview production build
npm run lint       # ESLint + Prettier + svelte-check
npm run format     # Prettier write-in-place
```

---

## Code Style Rules (from `GEMINI.md` + `eslint.config.mjs`)

- Always use `const`; only `let` when reassignment is required; never `var`
- Always use curly braces `{}` on control structures, even single-line bodies
- `1tbs` brace style enforced by ESLint
- Prettier: single quotes, semicolons, 100-char print width, trailing commas
- `@typescript-eslint/no-explicit-any` is a **warning** (not error) — minimise use

---

## Known Quirks & Notes

- **`getMiddleLevel`** in `CoordinateUtils.ts` preserves a quirk from the original JS: it indexes an array using the _value_ of the middle element (works because the array contains sequential integers). This is intentional for bug-compatibility.
- **`src/lib/constants/matrix.ts`** duplicates some content from `Assets.ts`. `Assets.ts` is the canonical source used throughout the app.
- The `ScrambleAction` and `FallingLettersAction` are cosmetic Svelte actions and have no effect on animation logic.
- Google Fonts (Rubik Glitch Pop, Orbitron, Kode Mono) are loaded via `index.html` — no local font files.
