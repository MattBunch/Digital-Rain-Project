# Phase 2: Core Engine Refactor - Implementation Details (Completed)

This document records the architectural shift from a `setInterval`-based procedural loop to a modern, high-performance `requestAnimationFrame` (RAF) engine in the TypeScript codebase.

## 1. Architectural Overview: The Game Loop Pattern

We have moved away from the "fire and forget" nature of `setInterval`. The engine now follows the **Update-Draw-Loop** pattern.

### Key Components:

- **`deltaTime`:** Tracks time elapsed between frames for smooth animation across different refresh rates.
- **`CoreEngine`:** The orchestrator of the RAF loop using `requestAnimationFrame`.
- **`MatrixString`:** Movement is now calculated using a `speedFactor` derived from `deltaTime`.

---

## 2. Delta Timing & Frame Independence

The implementation no longer relies on the frequency of `setInterval`. Instead, it calculates the time elapsed since the last frame.

**Approach:**
We calculate the time elapsed since the last frame and normalize it against the target `intervalSpeed`.

```typescript
const now = performance.now();
const deltaTime = now - this.lastTime;
this.lastTime = now;
const speedFactor = deltaTime / this.intervalSpeed;
```

Movement is then calculated as:

```typescript
const movement = (this.fontSize + Math.abs(inputWords[i].ySpeed)) * speedFactor;
inputWords[i].y += movement;
```

---

## 3. The `CoreEngine` Refactor (`src/lib/engine/CoreEngine.ts`)

### Responsibilities:

- **The Loop:** `loop(timestamp: number)` manages the `requestAnimationFrame` lifecycle.
- **Updating:** Calculates `speedFactor` and passes it to `draw()`.
- **Drawing:** Coordinates the rendering of all `MatrixString` objects with normalized movement.

---

## 4. Animation Control

- **`pause()`**: Correctly cancels the active `requestId` and resets it.
- **`run()`**: Initializes `lastTime` to the current `performance.now()` to avoid massive jumps on startup.
- **`speedController()`**: Updates `intervalSpeed` which is immediately used by the `loop` to calculate a new `speedFactor`.

---

## 5. Performance Optimization Benefits

- **Eliminate Jitter:** RAF aligns with the vertical sync (V-Sync) of the monitor.
- **Battery Efficiency:** Browsers automatically pause RAF when the tab is inactive.
- **Consistent Speed:** Digital Rain falls at the same speed regardless of monitor refresh rate (60Hz vs 144Hz).
