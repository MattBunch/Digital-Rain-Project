# Digital Rain Project

This program displays a digital rain animation within the window browser, as seen in the film The Matrix (1999) or Ghost in the Shell (1995). The user can customize the animation both through the menu and keyboard inputs.

## Built With:

- JavaScript, HTML, CSS

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

## Plan

refer to docs/plan.md

## Possible extensions in further versions:

- **IMPORTANT**: Svelte component tests, e2e tests with cypress? - refer to file "docs/component_e2e_testing_prompt.md"
- adapt values to work with any size monitor for consistent views no matter the screen size
- bugs in main menu - colours mismatching, disco colours staying on
- rename square boundry left side right side names switched - fix this naming inconsistency

- Colour wheel selector.
- Up and down keys work in menu.

- more interesting dynamic menu - highlight effect where letters fall off the mouse/sides of buttons, canvas background showing the digital rain effect etc. be creative.
- modal window for button presses instead of just "alert" built in browser functionality.

## Misc

The core of this program was written while I was learning JS, mostly completed on 18/08/20 and 19/08/20. Then on April 29 2025, I started the process of rewriting and modernizng this program in Node.js with TypeScript, with the help of Gemini AI to expediate the process.

I had completed another Digital Rain animation program in Java previously, which serves as a prototype of this current program.
