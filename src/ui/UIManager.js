// src/ui/UIManager.js
import { colorBlack, colorWhite, colorMatrixGreen, colorRed, colorYellow, colorBlue, colorOrange, colorPink, colorCyan } from '../constants/Assets.js';
import { getRandomColor } from '../utils/MathUtils.js';

export class UIManager {
  constructor(engine) {
    this.engine = engine;
    this.cacheElements();
    this.borderPrefix = '1px solid ';
  }

  cacheElements() {
    this.checkBox = document.getElementById('disco');
    this.text = document.getElementById('colorsLabel');
    this.select = document.getElementById('colors');
    this.directionsSelect = document.getElementById('directions');
    this.menuDivs = document.getElementsByClassName('menu');
    this.button = document.getElementById('button');
    this.button2 = document.getElementById('button2');
    this.button3 = document.getElementById('button3');
    this.button4 = document.getElementById('button4');
    this.buttons = document.getElementsByClassName('button');
    this.elems = document.body.getElementsByTagName('*');
    this.frameCountElems = document.getElementsByClassName('frameCount');
    this.discoFrameElement = document.getElementById('frameCount');
    this.canvas = document.getElementById('myCanvas');
  }

  showMenu() {
    for (let i = 0; i < this.menuDivs.length; i++) {
      this.menuDivs[i].style.display = 'block';
    }
    this.menuOnLoad();
    if (this.canvas) {
      this.canvas.style.display = 'none';
    }
  }

  hideMenu() {
    for (let i = 0; i < this.menuDivs.length; i++) {
      this.menuDivs[i].style.display = 'none';
    }
    this.canvas.style.display = 'block';
  }

  isMenuHidden() {
    let output = false;
    for (let i = 0; i < this.menuDivs.length; i++) {
      if (this.menuDivs[i].style.display === 'none') {
        output = true;
      }
    }
    return output;
  }

  isMenuShown() {
    return !this.isMenuHidden();
  }

  checkboxFunction() {
    if (!this.checkBox.checked) {
      this.text.style.display = 'inline-block';
      this.select.style.display = 'inline-block';
      this.frameCountElemsVisibilityFunction();
      this.recolorMenuOneColor(this.engine.selectColor);
      this.buttonBackgroundBlack();
      this.engine.discoOn = false;
      this.updateAll4DirectionButtonStyling();
      if (this.engine.menuInterval) clearInterval(this.engine.menuInterval);
    } else {
      this.text.style.display = 'none';
      this.select.style.display = 'none';
      this.button3.style.color = colorBlack;
      this.frameCountElemsVisibilityFunction();
      this.discoIntervalFunction();
      this.engine.discoOn = true;
      this.updateAll4DirectionButtonStyling();
      this.engine.menuInterval = setInterval(() => this.discoIntervalFunction(), 1000);
    }
  }

  discoIntervalFunction() {
    this.recolorMenuRandom();
    this.buttonDiscoBackgroundChangeColor();
    this.updateAll4DirectionButtonStyling();
  }

  frameCountElemsVisibilityFunction() {
    for (let i = 0; i < this.frameCountElems.length; i++) {
      if (this.checkBox.checked) {
        this.frameCountElems[i].style.display = 'inline-block';
      } else {
        this.frameCountElems[i].style.display = 'none';
      }
    }
  }

  selectFunction() {
    let userColor = this.select.value;
    this.engine.selectColor = this.matchColorToRGB(userColor.toLowerCase());
    if (!this.checkBox.checked) {
      this.recolorMenuOneColor(this.engine.selectColor);
      this.button.style.border = '1px solid ' + this.engine.selectColor;
    }
    localStorage.setItem('key', this.engine.selectColor);
  }

  recolorMenuOneColor(inputColor) {
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

  recolorMenuRandom() {
    for (let i = 0; i < this.elems.length; i++) {
      this.elems[i].style.color = getRandomColor();
    }
    this.buttonBorderColorRandom();
    this.directionsSelect.style.border = this.borderPrefix + getRandomColor();
    this.directionsSelect.style.backgroundColor = getRandomColor();
    this.discoFrameElement.style.backgroundColor = getRandomColor();
    this.selectBackgroundColorFunction();
  }

  selectBackgroundColorFunction() {
    Array.from(this.directionsSelect.options).forEach((optionElement) => {
      if (this.checkBox.checked) {
        optionElement.style.backgroundColor = getRandomColor();
      } else {
        optionElement.style.backgroundColor = colorBlack;
      }
    });
  }

  menuOnLoad() {
    this.engine.selectColor = localStorage.getItem('key') || colorMatrixGreen;
    this.checkboxFunction();
    this.selectFunction();
    this.updateAll4DirectionButtonStyling();
  }

  matchColorToRGB(entryColor) {
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

  buttonMouseOver(input) {
    if (this.buttonDiscoChecked()) {
      for (let i = 0; i < this.buttons.length; i++) {
        this.buttons[i].style.color = getRandomColor();
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

  buttonMouseOut(input) {
    if (this.buttonDiscoChecked()) {
      this.button.style.color = getRandomColor();
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

  intToButton(input) {
    switch (input) {
      case 1: return this.button;
      case 2: return this.button2;
      case 3: return this.button3;
      case 4: return this.button4;
      default: return null;
    }
  }

  buttonDiscoChecked() {
    return this.checkBox.checked;
  }

  buttonBackgroundBlack() {
    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].style.background = colorBlack;
    }
  }

  buttonBackgroundSelectedColor(inputColor) {
    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].style.background = inputColor;
    }
  }

  buttonDiscoBackgroundChangeColor() {
    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].style.background = getRandomColor();
    }
  }

  buttonBorderColorRandom() {
    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].style.border = this.borderPrefix + getRandomColor();
    }
  }

  buttonBorderColorSelectedColor() {
    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].style.border = this.borderPrefix + this.engine.selectColor;
    }
  }

  updateAll4DirectionButtonStyling() {
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

  updateRandomColorForTheMenu() {
    this.engine.selectColor = this.engine.randomColorArray[2];
    this.selectFunction();
  }

  frameCountFunctionOnChange() {
    let currentDiscoFrameMax = this.discoFrameElement.value;
    localStorage.setItem('frameCountKey', currentDiscoFrameMax);
    this.engine.discoFrameCounterTurnoverPoint = currentDiscoFrameMax;
  }

  frameCountFunctionOnLoad() {
    this.discoFrameElement.value = localStorage.getItem('frameCountKey') || '10';
  }

  updateSelectBox(input) {
    this.select.value = input;
    this.selectFunction();
  }
}
