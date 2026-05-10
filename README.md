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

### Normal Mode:

- Arrowkeys: Switch directions
- Spacebar: Pause
- C: Clear screen
- D: Toggle disco
- W: Increase font size
- S: Decrease font size
- Q: Increase string length
- A: Decrease string length
- T: Increase disco speed
- G: Decrease disco speed
- R: Toggle rapid word change
- M: Switch between modes
- U: Toggle rapid square change
- I: Toggle all 4 directions at once
- O: Toggle drawing background
- PageUp: Speed up
- PageDown: Slow down
- 1: Change colour to green
- 2: Change colour to red
- 3: Change colour to yellow
- 4: Change colour to blue
- 5: Change colour to orange
- 6: Change colour to pink
- 7: Change colour to cyan
- 8: Change colour to random
- Escape: Quit to menu

### Move Square Mode:

Same as Normal Mode except:

- Arrowkeys: move box directions
- Altering speed disabled
- Altering string length disabled
- Altering font size disabled.
- G: Toggle fixed word length.
- P: Increase random square speed
- ;: Decrease random square speed

## Possible extensions in further versions:

### features

- Colour wheel selector.
- Up and down keys work in menu.

### deployment

- deployment, cicd pipeline, personal website.
  - matt-bunch-dev.com - astro.js landing page, links (typical developer portfolio website, links to projects)
  - matt-bunch-dev.com/digital-rain - this application is at this url

### UI bugfixes, effects

- remove commented out console logging from button & settings menu
- slight component/screen shake on pressing button or input.
- cool cyberpunk television transition effect when switching from "menu" to "digital rain canvas" view - very quick, 200ms - 400 ms max
- adapt matrix string values to work with any size monitor for consistent views no matter the screen size

## Misc

The core of this program was written while I was learning JS, mostly completed on 18/08/20 and 19/08/20. Then on April 29 2026, I started the process of rewriting and modernizng this program in Node.js with TypeScript, with the help of Gemini AI to expediate the process.

I had completed another Digital Rain animation program in Java previously, which serves as a prototype of this current program.
