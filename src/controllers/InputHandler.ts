// src/controllers/InputHandler.ts
import { CoreEngine } from '../engine/CoreEngine.ts';
import { UIManager } from '../ui/UIManager.ts';

export class InputHandler {
  engine: CoreEngine;
  ui: UIManager;

  constructor(engine: CoreEngine, ui: UIManager) {
    this.engine = engine;
    this.ui = ui;
    this.init();
  }

  init(): void {
    document.addEventListener('keydown', (event) => this.handleKeyDown(event));
    if (this.ui.canvas) {
      this.ui.canvas.addEventListener('click', () => this.resetToMenu());
    }
  }

  handleKeyDown(event: KeyboardEvent): void {
    // this.engine.iCounter = 0; // Legacy reset - removed as it's not in CoreEngine.ts

    switch (event.key) {
      case 'Escape':
        this.resetToMenu();
        break;
      case 'ArrowLeft':
        if (this.engine.squareAnimationOn) {
          this.engine.moveSquareLeft(false);
        } else {
          this.arrowDirectionControl('west', 'east');
        }
        break;
      case 'ArrowUp':
        if (this.engine.squareAnimationOn) {
          this.engine.moveSquareUp(false);
        } else {
          this.arrowDirectionControl('north', 'south');
        }
        break;
      case 'ArrowRight':
        if (this.engine.squareAnimationOn) {
          this.engine.moveSquareRight(false);
        } else {
          this.arrowDirectionControl('east', 'west');
        }
        break;
      case 'ArrowDown':
        if (this.engine.squareAnimationOn) {
          this.engine.moveSquareDown(false);
        } else {
          this.arrowDirectionControl('south', 'north');
        }
        break;
      case ' ':
        if (this.engine.ctx != null) {
          this.engine.pause();
        }
        break;
      case 'c':
        this.engine.clearScreen();
        break;
      case 'd':
        this.discoControl();
        break;
      case 'PageUp':
        if (this.engine.ctx != null || !this.engine.squareAnimationOn) {
          this.engine.speedController(true);
        }
        break;
      case 'PageDown':
        if (this.engine.ctx != null || !this.engine.squareAnimationOn) {
          this.engine.speedController(false);
        }
        break;
      case '1': this.numkeyFunction('green'); break;
      case '2': this.numkeyFunction('red'); break;
      case '3': this.numkeyFunction('yellow'); break;
      case '4': this.numkeyFunction('blue'); break;
      case '5': this.numkeyFunction('orange'); break;
      case '6': this.numkeyFunction('pink'); break;
      case '7': this.numkeyFunction('cyan'); break;
      case '8': 
        this.engine.updateRandomColor();
        this.numkeyFunction('random'); 
        break;
      case 'w': this.engine.controlFontSize(true); break;
      case 's': this.engine.controlFontSize(false); break;
      case 'q': this.engine.controlStringSize(true); break;
      case 'a': this.engine.controlStringSize(false); break;
      case 'r': this.engine.rapidWordChangeControl(); break;
      case 'm': if (this.engine.ctx) this.engine.switchMode(); break;
    }
  }

  arrowDirectionControl(newDirection: string, oppositeDirection: string): void {
    if (this.engine.direction != newDirection) {
      if (this.engine.direction === oppositeDirection) this.engine.direction = newDirection;
      else {
        this.engine.direction = newDirection;
        this.engine.resetWordsArray();
      }
    }
  }

  discoControl(): void {
    if (this.ui.isMenuHidden()) this.toggleDisco();
    else this.toggleDiscoMenu();
  }

  toggleDisco(): void {
    if (this.engine.discoOn) {
      this.engine.discoOn = false;
      if (this.ui.checkBox) this.ui.checkBox.checked = false;
    } else {
      this.engine.discoOn = true;
      if (this.ui.checkBox) this.ui.checkBox.checked = true;
    }
    this.ui.checkboxFunction();
  }

  toggleDiscoMenu(): void {
    if (this.ui.checkBox) {
      this.ui.checkBox.checked = !this.ui.checkBox.checked;
      this.ui.checkboxFunction();
    }
  }

  numkeyFunction(input: string): void {
    this.ui.updateSelectBox(input);
    this.engine.switchColor(input);
  }

  resetToMenu(): void {
    clearInterval(this.engine.intervalValid);
    // if (this.engine.menuInterval) clearInterval(this.engine.menuInterval); // menuInterval is in UIManager, but CoreEngine handles it too? 
    // Actually UIManager seems to have engine.menuInterval. Let's check CoreEngine.ts.
    // CoreEngine.ts doesn't have menuInterval. UIManager.js sets it ON the engine.
    // I should add menuInterval to CoreEngine.ts or keep it in UIManager.
    // I'll add it to CoreEngine.ts to be safe as it's being used there in legacy JS.
    
    // I will go back and add menuInterval to CoreEngine.ts in a bit if needed.
    // For now I'll cast to any or just check if it exists.
    if ((this.engine as any).menuInterval) clearInterval((this.engine as any).menuInterval);

    if (this.engine.ctx && this.engine.canvas) {
      this.engine.ctx.fillStyle = '#000000';
      this.engine.ctx.fillRect(0, 0, this.engine.canvas.width, this.engine.canvas.height);
    }
    this.ui.showMenu();
    this.engine.reset();
  }
}
