# Implementation Plan: Phosphor Glow Effect

Add a phosphor glow effect to the Matrix rain animation using canvas `shadowBlur` and `shadowColor` to simulate CRT phosphor screens.

## Objective
Enable a "PHOSPHOR_GLOW" setting that adds a soft glow around the characters, matching their current color.

## Key Files & Context
- `src/lib/types/index.ts`: Defines settings and configuration interfaces.
- `src/lib/constants/presets.ts`: Default settings and preset definitions.
- `src/lib/engine/CoreEngine.ts`: Main animation logic and configuration propagation.
- `src/lib/models/MatrixString.ts`: Individual character rendering.
- `src/lib/utils/SettingsUtils.ts`: Settings comparison for preset detection.
- `src/lib/utils/UrlParams.ts`: URL serialization and deserialization.
- `src/lib/components/SettingsMenu.svelte`: User interface for toggling the effect.
- `src/App.svelte`: Syncing settings between the UI and the engine.

## Proposed Changes

### 1. Type Definitions (`src/lib/types/index.ts`)
- Add `phosphorGlow?: boolean` to `IMatrixStringConfig`.
- Add `phosphorGlow: boolean` to `IEngineSettings`.

### 2. Default Settings (`src/lib/constants/presets.ts`)
- Add `phosphorGlow: true` to `DEFAULT_SETTINGS`.

### 3. Core Engine (`src/lib/engine/CoreEngine.ts`)
- Add `private _phosphorGlow: boolean = true`.
- Add `phosphorGlow` getter and setter (with `resetWordsArray` call on change).
- Update `draw()` and `drawAlternative()` to pass `phosphorGlow: this._phosphorGlow` in the config object.
- Update `reset()` to include `this._phosphorGlow = true`.

### 4. Matrix String Rendering (`src/lib/models/MatrixString.ts`)
- In `show()`: Apply `shadowBlur = 8` and `shadowColor = ctx.fillStyle` before `ctx.fillText()`.
- In `showAlternative()`: Apply the same glow effect.
- Ensure `shadowBlur` is reset to `0` at the end of both methods.

### 5. Utility Functions
- **`src/lib/utils/SettingsUtils.ts`**: Add `phosphorGlow` to `compareSettings()`.
- **`src/lib/utils/UrlParams.ts`**: Map `pg` to `phosphorGlow` in `KEY_MAP` and handle its deserialization.

### 6. User Interface (`src/lib/components/SettingsMenu.svelte`)
- Add a `CyberCheckbox` for "PHOSPHOR_GLOW:" in the settings grid.

### 7. Application Sync (`src/App.svelte`)
- Sync `settings.phosphorGlow` to both `engine` and `backgroundEngine`.

## Verification & Testing

### Automated Tests
- Run `npm test` to verify all unit tests pass.
- Update any snapshots or specific tests if they rely on exact `IEngineSettings` structure.

### Manual Verification
1. Open the application and verify the glow is active by default.
2. Toggle "PHOSPHOR_GLOW" off in settings and verify the rain becomes "flat".
3. Verify the glow color changes when "SYSTEM_COLOR" or "DISCO_MODE" is changed.
4. Verify the glow is correctly applied in both "Normal" and "Square" modes.
5. Check URL persistence by toggling the setting and refreshing.
