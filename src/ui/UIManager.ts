// src/ui/UIManager.ts
import { 
  colorBlack, 
  colorMatrixGreen, 
  colorRed, 
  colorYellow, 
  colorBlue, 
  colorOrange, 
  colorPink, 
  colorCyan 
} from '../constants/Assets.ts';
import { getRandomColor } from '../utils/MathUtils.ts';
import { CoreEngine } from '../engine/CoreEngine.ts';

export class UIManager {
  engine: CoreEngine;
  checkBox: HTMLInputElement | null = null;
  text: HTMLElement | null = null;
  select: HTMLSelectElement | null = null;
  directionsSelect: HTMLSelectElement | null = null;
  menuDivs: HTMLCollectionOf<HTMLElement> | null = null;
  button: HTMLElement | null = null;
  button2: HTMLElement | null = null;
  button3: HTMLElement | null = null;
  button4: HTMLElement | null = null;
  buttons: HTMLCollectionOf<HTMLElement> | null = null;
  elems: HTMLCollectionOf<HTMLElement> | null = null;
  frameCountElems: HTMLCollectionOf<HTMLElement> | null = null;
  discoFrameElement: HTMLInputElement | null = null;
  canvas: HTMLCanvasElement | null = null;
  borderPrefix: string;

  constructor(engine: CoreEngine) {
    this.engine = engine;
    this.cacheElements();
    this.borderPrefix = '1px solid ';
    this.menuOnLoad();
  }

  cacheElements(): void {
    this.checkBox = document.getElementById('disco') as HTMLInputElement;
    this.text = document.getElementById('colorsLabel');
    this.select = document.getElementById('colors') as HTMLSelectElement;
    this.directionsSelect = document.getElementById('directions') as HTMLSelectElement;
    this.menuDivs = document.getElementsByClassName('menu') as HTMLCollectionOf<HTMLElement>;
    this.button = document.getElementById('button');
    this.button2 = document.getElementById('button2');
    this.button3 = document.getElementById('button3');
    this.button4 = document.getElementById('button4');
    this.buttons = document.getElementsByClassName('button') as HTMLCollectionOf<HTMLElement>;
    this.elems = document.body.getElementsByTagName('*') as HTMLCollectionOf<HTMLElement>;
    this.frameCountElems = document.getElementsByClassName('frameCount') as HTMLCollectionOf<HTMLElement>;
    this.discoFrameElement = document.getElementById('frameCount') as HTMLInputElement;
    this.canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
  }

  showMenu(): void {
    if (this.menuDivs) {
      for (let i = 0; i < this.menuDivs.length; i++) {
        this.menuDivs[i].style.display = 'block';
      }
    }
    this.menuOnLoad();
    if (this.canvas) {
      this.canvas.style.display = 'none';
    }
  }

  hideMenu(): void {
    if (this.menuDivs) {
      for (let i = 0; i < this.menuDivs.length; i++) {
        this.menuDivs[i].style.display = 'none';
      }
    }
    if (this.canvas) {
      this.canvas.style.display = 'block';
    }
  }

  isMenuHidden(): boolean {
    let output = false;
    if (this.menuDivs) {
      for (let i = 0; i < this.menuDivs.length; i++) {
        if (this.menuDivs[i].style.display === 'none') {
          output = true;
        }
      }
    }
    return output;
  }

  isMenuShown(): boolean {
    return !this.isMenuHidden();
  }

  checkboxFunction(): void {
    if (!this.checkBox || !this.text || !this.select || !this.button3) return;

    if (!this.checkBox.checked) {
      this.text.style.display = 'inline-block';
      this.select.style.display = 'inline-block';
      this.frameCountElemsVisibilityFunction();
      this.recolorMenuOneColor(this.engine.selectColor);
      this.buttonBackgroundBlack();
      this.engine.discoOn = false;
      this.updateAll4DirectionButtonStyling();
      if ((this.engine as any).menuInterval) {
        clearInterval((this.engine as any).menuInterval);
        (this.engine as any).menuInterval = null;
      }
    } else {
      this.text.style.display = 'none';
      this.select.style.display = 'none';
      this.button3.style.color = colorBlack;
      this.frameCountElemsVisibilityFunction();
      this.discoIntervalFunction();
      this.engine.discoOn = true;
      this.updateAll4DirectionButtonStyling();
      (this.engine as any).menuInterval = setInterval(() => this.discoIntervalFunction(), 1000);
    }
  }

  discoIntervalFunction(): void {
    this.recolorMenuRandom();
    this.buttonDiscoBackgroundChangeColor();
    this.updateAll4DirectionButtonStyling();
  }

  frameCountElemsVisibilityFunction(): void {
    if (!this.frameCountElems || !this.checkBox) return;
    for (let i = 0; i < this.frameCountElems.length; i++) {
      if (this.checkBox.checked) {
        this.frameCountElems[i].style.display = 'inline-block';
      } else {
        this.frameCountElems[i].style.display = 'none';
      }
    }
  }

  selectFunction(): void {
    if (!this.select || !this.button) return;
    let userColor = this.select.value;
    this.engine.selectColor = this.matchColorToRGB(userColor.toLowerCase());
    if (this.checkBox && !this.checkBox.checked) {
      this.recolorMenuOneColor(this.engine.selectColor);
      this.button.style.border = '1px solid ' + this.engine.selectColor;
    }
    localStorage.setItem('key', this.engine.selectColor);
  }

  recolorMenuOneColor(inputColor: string): void {
    if (!this.elems || !this.button3 || !this.select || !this.directionsSelect) return;
    for (let i = 0; i < this.elems.length; i++) {
      this.elems[i].style.color = inputColor;
      this.buttonBackgroundBlack();
    }
    if (this.engine.all4Directions) {
      this.button3.style.background = inputColor;
      this.button3.style.color = colorBlack;
    } else {
      this.button3.style.background = colorBlack;
      this.button3.style.color = inputColor;
    }
    this.buttonBorderColorSelectedColor();
    this.select.style.border = this.borderPrefix + inputColor;
    this.directionsSelect.style.border = this.borderPrefix + inputColor;
    this.directionsSelect.style.backgroundColor = colorBlack;
    this.selectBackgroundColorFunction();
  }

  recolorMenuRandom(): void {
    if (!this.elems || !this.directionsSelect || !this.discoFrameElement) return;
    for (let i = 0; i < this.elems.length; i++) {
      this.elems[i].style.color = getRandomColor();
    }
    this.buttonBorderColorRandom();
    this.directionsSelect.style.border = this.borderPrefix + getRandomColor();
    this.directionsSelect.style.backgroundColor = getRandomColor();
    this.discoFrameElement.style.backgroundColor = getRandomColor();
    this.selectBackgroundColorFunction();
  }

  selectBackgroundColorFunction(): void {
    if (!this.directionsSelect || !this.checkBox) return;
    Array.from(this.directionsSelect.options).forEach((optionElement) => {
      if (this.checkBox!.checked) {
        optionElement.style.backgroundColor = getRandomColor();
      } else {
        optionElement.style.backgroundColor = colorBlack;
      }
    });
  }

  menuOnLoad(): void {
    this.engine.selectColor = localStorage.getItem('key') || colorMatrixGreen;
    this.checkboxFunction();
    this.selectFunction();
    this.updateAll4DirectionButtonStyling();
  }

  matchColorToRGB(entryColor: string): string {
    switch (entryColor) {
      case 'green': return colorMatrixGreen;
      case 'red': return colorRed;
      case 'yellow': return colorYellow;
      case 'blue': return colorBlue;
      case 'orange': return colorOrange;
      case 'pink': return colorPink;
      case 'cyan': return colorCyan;
      case 'random': return this.engine.randomColorArray[2];
      default: return colorMatrixGreen;
    }
  }

  buttonMouseOver(input: number): void {
    if (this.buttonDiscoChecked()) {
      if (this.buttons) {
        for (let i = 0; i < this.buttons.length; i++) {
          this.buttons[i].style.color = getRandomColor();
        }
      }
      this.buttonDiscoBackgroundChangeColor();
      this.buttonBorderColorRandom();
    } else {
      const btn = this.intToButton(input);
      if (btn) {
        btn.style.color = colorBlack;
        btn.style.background = this.engine.selectColor;
      }
    }
  }

  buttonMouseOut(input: number): void {
    if (this.buttonDiscoChecked()) {
      if (this.button) this.button.style.color = getRandomColor();
      this.buttonDiscoBackgroundChangeColor();
      this.buttonBorderColorRandom();
    } else {
      const btn = this.intToButton(input);
      if (btn) {
        btn.style.color = this.engine.selectColor;
        btn.style.background = colorBlack;
      }
    }
  }

  intToButton(input: number): HTMLElement | null {
    switch (input) {
      case 1: return this.button;
      case 2: return this.button2;
      case 3: return this.button3;
      case 4: return this.button4;
      default: return null;
    }
  }

  buttonDiscoChecked(): boolean {
    return this.checkBox ? this.checkBox.checked : false;
  }

  buttonBackgroundBlack(): void {
    if (!this.buttons) return;
    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].style.background = colorBlack;
    }
  }

  buttonBackgroundSelectedColor(inputColor: string): void {
    if (!this.buttons) return;
    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].style.background = inputColor;
    }
  }

  buttonDiscoBackgroundChangeColor(): void {
    if (!this.buttons) return;
    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].style.background = getRandomColor();
    }
  }

  buttonBorderColorRandom(): void {
    if (!this.buttons) return;
    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].style.border = this.borderPrefix + getRandomColor();
    }
  }

  buttonBorderColorSelectedColor(): void {
    if (!this.buttons) return;
    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].style.border = this.borderPrefix + this.engine.selectColor;
    }
  }

  updateAll4DirectionButtonStyling(): void {
    if (!this.button3) return;
    let onText = 'All 4 Directions:\nON';
    let offText = 'All 4 Directions:\nOFF';
    if (this.engine.all4Directions) {
      this.button3.style.background = this.engine.selectColor;
      this.button3.style.color = colorBlack;
      this.button3.innerText = onText;
    } else {
      this.button3.innerText = offText;
    }
    if (this.engine.discoOn) {
      this.button3.style.background = getRandomColor();
      this.button3.style.color = getRandomColor();
    }
  }

  updateRandomColorForTheMenu(): void {
    this.engine.selectColor = this.engine.randomColorArray[2];
    this.selectFunction();
  }

  frameCountFunctionOnChange(): void {
    if (!this.discoFrameElement) return;
    let currentDiscoFrameMax = this.discoFrameElement.value;
    localStorage.setItem('frameCountKey', currentDiscoFrameMax);
    this.engine.discoFrameCounterTurnoverPoint = parseInt(currentDiscoFrameMax);
  }

  frameCountFunctionOnLoad(): void {
    if (!this.discoFrameElement) return;
    this.discoFrameElement.value = localStorage.getItem('frameCountKey') || '10';
  }

  updateSelectBox(input: string): void {
    if (!this.select) return;
    this.select.value = input;
    this.selectFunction();
  }
}
