// src/controllers/InputHandler.js

export class InputHandler {
  constructor(engine, ui) {
    this.engine = engine;
    this.ui = ui;
    this.init();
  }

  init() {
    document.addEventListener('keydown', (event) => this.handleKeyDown(event));
    if (this.ui.canvas) {
      this.ui.canvas.addEventListener('click', () => this.resetToMenu());
    }
  }

  handleKeyDown(event) {
    this.engine.iCounter = 0; // Legacy reset

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

  arrowDirectionControl(newDirection, oppositeDirection) {
    if (this.engine.direction != newDirection) {
      if (this.engine.direction === oppositeDirection) this.engine.direction = newDirection;
      else {
        this.engine.direction = newDirection;
        this.engine.resetWordsArray();
      }
    }
  }

  discoControl() {
    if (this.ui.isMenuHidden()) this.toggleDisco();
    else this.toggleDiscoMenu();
  }

  toggleDisco() {
    if (this.engine.discoOn) {
      this.engine.discoOn = false;
      this.ui.checkBox.checked = false;
    } else {
      this.engine.discoOn = true;
      this.ui.checkBox.checked = true;
    }
    this.ui.checkboxFunction();
  }

  toggleDiscoMenu() {
    this.ui.checkBox.checked = !this.ui.checkBox.checked;
    this.ui.checkboxFunction();
  }

  numkeyFunction(input) {
    this.ui.updateSelectBox(input);
    this.engine.switchColor(input);
  }

  resetToMenu() {
    clearInterval(this.engine.intervalValid);
    if (this.engine.menuInterval) clearInterval(this.engine.menuInterval);
    this.engine.ctx.fillStyle = '#000000';
    this.engine.ctx.fillRect(0, 0, this.engine.canvas.width, this.engine.canvas.height);
    this.ui.showMenu();
    this.engine.reset();
  }
}
