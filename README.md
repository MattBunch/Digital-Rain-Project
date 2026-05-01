# Digital Rain Project

This program displays a digital rain animation within the window browser, as seen in the film The Matrix (1999) or Ghost in the Shell (1995). The user can customize the animation through the menu and through keyboard inputs.

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

- fix broken square mode movement - no left or down movement working
- all 4 directions - left & right aren't working 
- execute the plan in docs/plan.md
- Test coverage - v8 library (npm install -D vitest @vitest/coverage-v8)
- migrate to typescript - prompt outlined in docs/typescript-migration-plan.md
- migrate to svelte for components
- eslint - make sure gemini/ai agents follow it
- adapt values to work with any size monitor for consistent views no matter the screen size

- Colour wheel selector.
- Up and down arrows in menu.
- bugs in main menu - colours mismatching, highlight staying on.

## Misc

The core of this program was written while I was learning JS, mostly completed on 18/08/20 and 19/08/20.

I had completed another Digital Rain animation program in Java previously, which serves as a prototype of this current program.