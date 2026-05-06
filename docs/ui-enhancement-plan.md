# UI Enhancement Plan: Cyberpunk & Matrix Aesthetic

This document outlines the strategy for upgrading the Digital Rain menu system with high-impact visual effects and a modern cyberpunk aesthetic.

## 1. Typography (The "Cyberpunk" Look)
*   **Google Fonts Integration:**
    *   **Title:** `Rubik Glitch` or `Rubik Glitch Pop` for a "hacked system" feel.
    *   **Buttons:** `Orbitron` or `Oxanium` for a sleek, futuristic HUD look.
    *   **Settings:** `Space Mono` or `Kode Mono` for a precise, technical terminal aesthetic.
*   **Visual Styling:**
    *   **Chromatic Aberration:** Use red/cyan offset `text-shadow` to simulate digital distortion on the title and buttons.
    *   **Neon Glow:** Apply `box-shadow` and `text-shadow` using the current theme color to create a pulsing neon effect.

## 2. Interactive Button Effects
*   **Letter Scrambling (Decryption):** On hover, letters rapidly cycle through random symbols (`!@#$%^&*`) before "deciphering" back into the actual label.
*   **Glitch Hover:** A CSS `clip-path` animation that "slices" the button horizontally and jitters the segments.
*   **Techy Shapes:** Move away from rectangles using `clip-path: polygon()` to create angled, futuristic button shapes.

## 3. Global Atmospheric Effects
*   **Scanline Overlay:** A semi-transparent, repeating linear gradient over the entire menu to simulate an old CRT monitor.
*   **CRT Vignette:** A dark, rounded fade at the corners of the screen to give the illusion of a curved tube display.
*   **Background Integration:** Add a faint, blurred version of the Matrix rain (10-20% opacity) behind the menu components.

---

## Implementation Roadmap

### Phase 1: Foundation & Typography
- [ ] Add Google Font imports to `index.html`.
- [ ] Update `SettingsMenu.svelte` to use new font families.
- [ ] Implement global CSS variables for neon colors and shadows.

### Phase 2: Advanced Button Interactions
- [ ] Create a `CyberButton.svelte` component.
- [ ] Implement the "Letter Scramble" logic as a Svelte action.
- [ ] Add the "Glitch" CSS animation for hover states.

### Phase 3: Screen Overlays & Background
- [ ] Create a `CRTOverlay.svelte` component for scanlines and vignette.
- [ ] Wrap the main application in the CRT overlay.
- [ ] Integrate a low-opacity `MatrixCanvas` into the menu background.
