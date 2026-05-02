# Phase 2: Core Engine Refactor - Detailed Implementation Plan

This document outlines the architectural shift from a `setInterval`-based procedural loop to a modern, high-performance `requestAnimationFrame` (RAF) engine.

## 1. Architectural Overview: The Game Loop Pattern

We are moving away from the "fire and forget" nature of `setInterval`. The new engine will follow the **Update-Draw-Loop** pattern used in professional game engines.

### Key Components:

- **`Clock`:** A utility to track "Delta Time" ($\Delta t$).
- **`StateManager`:** A central hub for application state.
- **`Renderer`:** The orchestrator of the RAF loop.
- **`Scene`:** A collection of `MatrixString` entities.

---

## 2. Delta Timing & Frame Independence

The current implementation relies on the frequency of `setInterval` to determine speed. This causes variations on different hardware.

**New Approach:**
We will calculate the time elapsed since the last frame:

```javascript
const deltaTime = currentTimestamp - lastTimestamp;
```

Movement will then be calculated as:

```javascript
position += speed * (deltaTime / 16.67); // Normalized to 60FPS
```

This ensures that the "Digital Rain" falls at the exact same physical speed on a 60Hz, 120Hz, or 144Hz monitor.

---

## 3. The `Renderer` Class (`src/engine/Renderer.js`)

This class replaces the legacy `draw()` function. It is responsible for the canvas lifecycle.

### Responsibilities:

- **Canvas Management:** Handling DPI scaling and resizing.
- **The Loop:** Managing the `requestAnimationFrame` lifecycle.
- **Clearing:** Applying the "Opaque Rectangle" (trail effect) before each frame.
- **Orchestration:** Calling `update()` then `draw()` on all active entities.

### Logic Flow:

1. **Clear Phase:** `ctx.fillStyle = 'rgba(0,0,0,0.35)'` then `fillRect`.
2. **Update Phase:** Loop through all `MatrixString` objects and update their `y` or `x` based on $\Delta t$.
3. **Draw Phase:** Loop through all `MatrixString` objects and call their `render(ctx)` method.
4. **Recycle Phase:** Check if any entity has moved off-screen and trigger its reset logic.

---

## 4. Decoupling the `MatrixString` Class

Currently, `MatrixString` reaches into the global scope. We will refactor it to be a "Pure Model."

### Changes:

- **Dependency Injection:** The `show()` method (to be renamed `render()`) will accept `ctx` and `state` as arguments.
- **Self-Contained Logic:** It will calculate its own boundaries using the `state.dimensions` provided by the `Renderer`.
- **Stateless Rendering:** The class will not decide _when_ to draw; it will only provide the logic for _how_ to draw itself at a given coordinate.

---

## 5. State Management Transition

We will move the following legacy globals into a central `StateManager.js`:

- `discoOn`
- `rapidWordChange`
- `direction`
- `currentMode` (Normal vs Square)
- `speed`

This allows the Engine to query the state once per frame and pass it down to the entities, ensuring all strings are perfectly synced.

---

## 6. Performance Optimization Goals

- **Eliminate Jitter:** RAF aligns with the vertical sync (V-Sync) of the monitor.
- **Battery Efficiency:** Browsers automatically pause RAF when the tab is inactive.
- **Zero Latency Input:** By decoupling input from the draw timer, keyboard shortcuts will feel instantaneous.

---

## 7. Implementation Roadmap

1. **Step 2.1:** Create `src/engine/Clock.js` for delta timing.
2. **Step 2.2:** Implement `src/engine/Renderer.js` with the RAF loop.
3. **Step 2.3:** Refactor `MatrixString.js` to accept `ctx` and `state`.
4. **Step 2.4:** Migration: Connect the UI buttons to the new `Renderer.start()` and `Renderer.stop()`.
