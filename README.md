# Digital Rain Project

This program displays a digital rain animation within the window browser, as seen in the film The Matrix (1999) or Ghost in the Shell (1995). The user can customize the animation both through the menu and keyboard inputs.

## Local development setup

Install:

```bash
npm ci
```

Run locally:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Linting:

```bash
npm run lint
```

Tests:

```bash
npm run test
npm run test:e2e
```

## Keyboard inputs:

- Arrowkeys: Switch directions (Move box in Square Mode)
- Spacebar: Pause
- C: Clear screen
- D: Toggle disco
- W: Increase font size
- S: Decrease font size
- Q: Increase string length
- A: Decrease string length
- R: Toggle rapid word change
- M: Switch between modes
- PageUp: Speed up
- PageDown: Slow down
- 1-7: Change colors
- 8: Random color
- Escape: Quit to menu

## Possible extensions in further versions:

### features

- see docs/project_feature_ideas_and_improvements.md
- reorganize menu ui - look nicer
  - collapsable menu for the preset settings and complicated settings, nicer layout. - in progress
  - cyber button design - should be more square now that they are all side by side (add option)
  - bug - system color to refresh rate animation - it still doesn't load like the other effects
  - turn off all 4 directions - background matrix canvas disappears effect does not change, have to resize to trigger the matrix canvas animation
- alert for the saving preset - replace with custom component.
- Colour wheel selector.

### deployment

- deployment, cicd pipeline, personal website.
  - matt-bunch-dev.com - astro.js landing page, links (typical developer portfolio website, links to projects)
  - matt-bunch-dev.com/digital-rain - this application is at this url

### UI bugfixes, effects

- disco effect on menu -> needs to show in the background matrix canvas
- remove commented out console logging from button & settings menu
- slight component/screen shake on pressing button or input.
- cool cyberpunk television transition effect when switching from "menu" to "digital rain canvas" view - very quick, 200ms - 400 ms max
- adapt matrix string values to work with any size monitor for consistent views no matter the screen size

## Misc

The core of this program was written while I was learning JS, mostly completed on 18/08/20 and 19/08/20. Then on April 29 2026, I started the process of rewriting and modernizng this program in Node.js with TypeScript, with the help of Gemini AI to expediate the process.

I had completed another Digital Rain animation program in Java previously, which serves as a prototype of this current program.
