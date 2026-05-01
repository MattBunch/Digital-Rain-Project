// src/engine/CoreEngine.ts
import { MatrixString, IMatrixStringConfig, ISquareConfig } from '../models/MatrixString.ts';
import { 
  generateWord, 
  generateWordSizeRand, 
  generateFontSize, 
  generateSpeed, 
  generateWordChangeTurnoverNumber, 
  getRandomColor, 
  generateRandomColorArray, 
  generateWordSizeRandHanging, 
  doubleInt 
} from '../utils/MathUtils.ts';
import { generateYSouth, generateYNorth, generateXEast, generateXWest } from '../utils/CoordinateUtils.ts';
import { 
  colorWhite, 
  greenArray, 
  redArray, 
  yellowArray, 
  blueArray, 
  orangeArray, 
  pinkArray, 
  cyanArray 
} from '../constants/Assets.ts';

export class CoreEngine {
  words: MatrixString[];
  all4DirectionsArray: MatrixString[][];
  direction: string;
  discoOn: boolean;
  chosenColor: number;
  intervalValid: any; // Using any for setInterval return which varies by env
  animationOn: boolean;
  discoFrameCounter: number;
  discoFrameCounterTurnoverPoint: number;
  savedColor: string;
  selectColor: string;
  intervalSpeed: number;
  defaultFontSize: number;
  fontSize: number;
  stringSizeMin: number;
  stringSizeMax: number;
  alternativeFontSize: number;
  rapidWordChange: boolean;
  hangingWords: boolean;
  all4Directions: boolean;
  drawBackgroundOn: boolean;
  drawBackgroundAll4DirectionsCounter: number;
  drawBackgroundAll4DirectionsCounterMax: number;
  squareAnimationOn: boolean;
  rapidSquareOn: boolean;
  squareCounter: number;
  squareCounterTurnoverPoint: number;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  SQUARE_SIZE: number;
  topEdge: number;
  rightEdge: number;
  bottomEdge: number;
  leftEdge: number;
  topEdgeDisco: number;
  rightEdgeDisco: number;
  bottomEdgeDisco: number;
  leftEdgeDisco: number;
  randomColorArray: string[];
  colorChoiceArray: string[][];
  canvas?: HTMLCanvasElement;
  ctx?: CanvasRenderingContext2D;

  constructor() {
    this.words = [];
    this.all4DirectionsArray = [];
    this.direction = 'south';
    this.discoOn = false;
    this.chosenColor = 0;
    this.intervalValid = null;
    this.animationOn = false;
    this.discoFrameCounter = 0;
    this.discoFrameCounterTurnoverPoint = 10;
    this.savedColor = '#00ff41';
    this.selectColor = '#00ff41';
    this.intervalSpeed = 50;
    this.defaultFontSize = 20;
    this.fontSize = 20;
    this.stringSizeMin = 20;
    this.stringSizeMax = 48;
    this.alternativeFontSize = 20;
    this.rapidWordChange = false;
    this.hangingWords = true;
    this.all4Directions = false;
    this.drawBackgroundOn = true;
    this.drawBackgroundAll4DirectionsCounter = 0;
    this.drawBackgroundAll4DirectionsCounterMax = 3;
    this.squareAnimationOn = false;
    this.rapidSquareOn = false;
    this.squareCounter = 0;
    this.squareCounterTurnoverPoint = 10;
    this.x1 = 250;
    this.x2 = 500;
    this.y1 = 250;
    this.y2 = 500;
    this.SQUARE_SIZE = 250;
    this.topEdge = 60;
    this.rightEdge = 60;
    this.bottomEdge = 0;
    this.leftEdge = 0;
    this.topEdgeDisco = 20;
    this.rightEdgeDisco = 20;
    this.bottomEdgeDisco = 0;
    this.leftEdgeDisco = 0;

    this.randomColorArray = generateRandomColorArray();
    this.colorChoiceArray = [
      greenArray, redArray, yellowArray, blueArray, orangeArray, pinkArray, cyanArray, this.randomColorArray
    ];
  }

  setContext(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
    this.canvas = canvas;
    this.ctx = ctx;
    this.updateBoundaries();
  }

  updateBoundaries(): void {
    if (!this.canvas) return;
    this.topEdge = 60;
    this.rightEdge = 60;
    this.bottomEdge = this.canvas.height - 60;
    this.leftEdge = this.canvas.width - 60;

    this.topEdgeDisco = 20;
    this.rightEdgeDisco = 20;
    this.bottomEdgeDisco = this.canvas.height - 20;
    this.leftEdgeDisco = this.canvas.width - 20;
  }

  createMatrixArray(inputDirectionMatrix: string): void {
    if (!this.canvas) return;
    let xInput: number, yInput: number, xSpeedInput: number | null, ySpeedInput: number | null, newWord: string, newFontSize: number;
    const columns = Math.floor(this.canvas.width / this.fontSize);
    const rows = Math.floor(this.canvas.height / this.fontSize);

    if (inputDirectionMatrix === 'south' || inputDirectionMatrix === 'north') {
      for (let i = 0; i < columns; i++) {
        xInput = this.fontSize * i;
        newWord = generateWord(generateWordSizeRand(this.stringSizeMin, this.stringSizeMax));
        newFontSize = generateFontSize(this.fontSize);
        if (inputDirectionMatrix === 'south') {
          yInput = generateYSouth(newWord.length, newFontSize, this.canvas.height);
          xSpeedInput = null;
          ySpeedInput = generateSpeed();
        } else {
          yInput = generateYNorth(this.canvas.height);
          xSpeedInput = null;
          ySpeedInput = -Math.abs(generateSpeed());
        }
        this.words.push(new MatrixString(newWord, xInput, yInput, xSpeedInput || 0, ySpeedInput || 0, newFontSize));
      }
    } else if (inputDirectionMatrix === 'east' || inputDirectionMatrix === 'west') {
      for (let i = 0; i < rows; i++) {
        yInput = this.fontSize * i;
        newWord = generateWord(generateWordSizeRand(this.stringSizeMin, this.stringSizeMax));
        newFontSize = generateFontSize(this.fontSize);
        if (inputDirectionMatrix === 'east') {
          xInput = generateXEast(this.canvas.width, this.canvas.height);
          xSpeedInput = generateSpeed();
          ySpeedInput = null;
        } else {
          xInput = generateXWest(newWord.length, newFontSize, this.canvas.width, this.canvas.height);
          xSpeedInput = -Math.abs(generateSpeed());
          ySpeedInput = null;
        }
        this.words.push(new MatrixString(newWord, xInput, yInput, xSpeedInput || 0, ySpeedInput || 0, newFontSize));
      }
    }
  }

  initializeAll4Directions(): void {
    this.words = [];
    const directions = ['north', 'south', 'east', 'west'];
    this.all4DirectionsArray = directions.map(dir => {
      this.words = [];
      this.createMatrixArray(dir);
      return this.words;
    });
    this.words = []; // Clear for consistency
  }

  draw(inputWords: MatrixString[], passThroughToDraw: boolean): void {
    if (!this.ctx || !this.canvas) return;
    if (this.discoOn) this.discoFrameCounter++;
    if (this.all4Directions && !passThroughToDraw) {
      this.drawAll4Directions();
      return;
    }
    this.ctx.font = this.fontSize + "px 'Consolas', 'Lucida Console'";
    let normalDrawBackground = this.drawBackgroundOn && !this.all4Directions;
    let all4DirectionsDrawBackground = false;
    if (this.all4Directions && this.drawBackgroundOn) {
      this.drawBackgroundAll4DirectionsCounter++;
      all4DirectionsDrawBackground = this.getAll4DirectionsDrawBackground();
      if (all4DirectionsDrawBackground) this.drawBackgroundAll4DirectionsCounter = 0;
    }
    if (normalDrawBackground || all4DirectionsDrawBackground) this.drawOpaqueRect();

    for (let i = 0; i < inputWords.length; i++) {
      this.changeWordCheck(inputWords[i], inputWords[i].word.length);
      if (this.direction === 'south') {
        if (inputWords[i].y > this.canvas.height) {
          inputWords[i].ySpeed = generateSpeed();
          inputWords[i].word = generateWord(generateWordSizeRand(this.stringSizeMin, this.stringSizeMax));
          inputWords[i].fontSize = generateFontSize(this.fontSize);
          inputWords[i].y = generateYSouth(inputWords[i].word.length, inputWords[i].fontSize, this.canvas.height);
        } else {
          inputWords[i].y = inputWords[i].y + (this.fontSize + Math.abs(inputWords[i].ySpeed));
        }
      } else if (this.direction === 'north') {
        if (inputWords[i].y < 0 - this.canvas.height * 1.5) {
          inputWords[i].y = generateYNorth(this.canvas.height);
          inputWords[i].ySpeed = -Math.abs(generateSpeed());
          inputWords[i].word = generateWord(generateWordSizeRand(this.stringSizeMin, this.stringSizeMax));
          inputWords[i].fontSize = generateFontSize(this.fontSize);
        } else {
          inputWords[i].y = inputWords[i].y - (this.fontSize + Math.abs(inputWords[i].ySpeed));
        }
      } else if (this.direction === 'east') {
        if (inputWords[i].x < 0 - this.canvas.width) {
          inputWords[i].x = generateXEast(this.canvas.width, this.canvas.height);
          inputWords[i].xSpeed = generateSpeed();
          inputWords[i].word = generateWord(generateWordSizeRand(this.stringSizeMin, this.stringSizeMax));
          inputWords[i].fontSize = generateFontSize(this.fontSize);
        } else {
          inputWords[i].x = inputWords[i].x - (this.fontSize + Math.abs(inputWords[i].xSpeed));
        }
      } else if (this.direction === 'west') {
        if (inputWords[i].x > this.canvas.width) {
          inputWords[i].xSpeed = -Math.abs(generateSpeed());
          inputWords[i].word = generateWord(generateWordSizeRand(this.stringSizeMin, this.stringSizeMax));
          inputWords[i].fontSize = generateFontSize(this.fontSize);
          inputWords[i].x = generateXWest(inputWords[i].word.length, inputWords[i].fontSize, this.canvas.width, this.canvas.height);
        } else {
          inputWords[i].x = inputWords[i].x + (this.fontSize + Math.abs(inputWords[i].xSpeed));
        }
      }
      this.ctx.font = inputWords[i].fontSize + "px 'Consolas', 'Lucida Console'";
      const config: IMatrixStringConfig = { rapidWordChange: this.rapidWordChange, discoOn: this.discoOn, direction: this.direction };
      const discoCallback = (ctx: CanvasRenderingContext2D) => {
        if (this.discoFrameCounter > this.discoFrameCounterTurnoverPoint) {
          ctx.fillStyle = getRandomColor();
          this.savedColor = ctx.fillStyle as string;
          this.discoFrameCounter = 0;
        } else {
          ctx.fillStyle = this.savedColor;
        }
      };
      inputWords[i].show(this.ctx, this.colorChoiceArray[this.chosenColor], config, discoCallback);
    }
  }

  drawAll4Directions(): void {
    const directions = ['north', 'south', 'east', 'west'];
    directions.forEach((dir, i) => {
      this.direction = dir;
      this.draw(this.all4DirectionsArray[i], true);
    });
  }

  getAll4DirectionsDrawBackground(): boolean {
    return this.drawBackgroundAll4DirectionsCounter > this.drawBackgroundAll4DirectionsCounterMax;
  }

  changeWordCheck(inputWordObject: MatrixString, inputSize: number): void {
    inputWordObject.wordChangeCounter++;
    if (inputWordObject.wordChangeCounter > inputWordObject.wordChangeCounterTurnoverPoint) {
      inputWordObject.word = generateWord(inputSize);
      inputWordObject.wordChangeCounter = 0;
      inputWordObject.wordChangeCounterTurnoverPoint = generateWordChangeTurnoverNumber();
    }
  }

  drawOpaqueRect(): void {
    if (!this.ctx || !this.canvas) return;
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawSolidRect(): void {
    if (!this.ctx || !this.canvas) return;
    this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawAlternative(): void {
    if (!this.ctx) return;
    if (this.discoOn) this.discoFrameCounter++;
    this.squareCounter++;
    if (this.drawBackgroundOn) this.drawOpaqueRect();
    this.ctx.fillStyle = colorWhite;
    this.ctx.font = this.alternativeFontSize + 'px Arial';

    if (this.squareCounter > this.squareCounterTurnoverPoint && this.rapidSquareOn) {
      this.squareCounter = 0;
      this.generateRandomSquarePositions();
    }

    const newWordSize = this.getNewWordSize();
    const config: IMatrixStringConfig = { rapidWordChange: this.rapidWordChange, discoOn: this.discoOn, direction: this.direction };
    const squareConfig: ISquareConfig = { 
      x1: this.x1, x2: this.x2, y1: this.y1, y2: this.y2, alternativeFontSize: this.alternativeFontSize,
      returnAlternativeFadeCondition: this.returnAlternativeFadeCondition.bind(this),
      discoColorCounterCheck: (ctx: CanvasRenderingContext2D) => {
        if (this.discoFrameCounter > this.discoFrameCounterTurnoverPoint) {
          ctx.fillStyle = getRandomColor();
          this.savedColor = ctx.fillStyle as string;
          this.discoFrameCounter = 0;
        } else {
          ctx.fillStyle = this.savedColor;
        }
      },
      getRandomColor: getRandomColor
    };

    this.words.forEach(arrayItem => {
      arrayItem.fontSize = this.alternativeFontSize;
      if (this.hangingWords && this.rapidWordChange) {
        arrayItem.word = generateWord(arrayItem.word.length);
      } else if (this.hangingWords && !this.rapidWordChange) {
        this.changeWordCheck(arrayItem, arrayItem.word.length);
      } else if (!this.hangingWords && this.rapidWordChange) {
        arrayItem.word = generateWord(newWordSize);
      } else if (!this.hangingWords && !this.rapidWordChange) {
        this.changeWordCheck(arrayItem, newWordSize);
      }
      arrayItem.showAlternative(this.ctx!, this.colorChoiceArray[this.chosenColor], config, squareConfig);
    });
  }

  getNewWordSize(): number {
    if (!this.canvas) return 80;
    let output = 80;
    if (this.canvas.height > 2000 || this.alternativeFontSize < 14) output = doubleInt(output) * 1.5;
    if (this.alternativeFontSize > 40) output = output / 2;
    return output;
  }

  giveEachWordNewWord(): void {
    if (!this.canvas) return;
    const newWordSize = this.getNewWordSize();
    this.words.forEach(arrayWord => {
      if (this.hangingWords) {
        let hangingWordSize = generateWordSizeRandHanging(this.stringSizeMin, this.stringSizeMax);
        if (this.canvas!.height < 1000) hangingWordSize = Math.round(hangingWordSize * 0.6);
        arrayWord.word = generateWord(hangingWordSize);
      } else arrayWord.word = generateWord(newWordSize);
      arrayWord.XYCoordinates = arrayWord.generateXYCoordinates();
    });
  }

  resetAllWordsYPositions(): void {
    if (!this.canvas) return;
    this.words.forEach(arrayItem => {
      switch (this.direction) {
        case 'south': arrayItem.y = 0; break;
        case 'north': arrayItem.y = this.canvas!.height; break;
        case 'east': arrayItem.x = 0; break;
        case 'west': arrayItem.x = this.canvas!.width; break;
      }
    });
  }

  moveSquareLeft(forceMove: boolean): void {
    let inputLeftEdge = this.leftEdge;
    if (this.discoOn || forceMove) inputLeftEdge = this.leftEdgeDisco;
    if (this.x2 < inputLeftEdge) {
      this.x1 += this.alternativeFontSize;
      this.x2 += this.alternativeFontSize;
    }
  }

  moveSquareUp(forceMove: boolean): void {
    let inputTopEdge = this.topEdge;
    if (this.discoOn || forceMove) inputTopEdge = this.topEdgeDisco;
    if (this.y1 > inputTopEdge) {
      this.y1 -= this.alternativeFontSize;
      this.y2 -= this.alternativeFontSize;
    }
  }
  moveSquareRight(forceMove: boolean): void {
    let inputRightEdge = this.rightEdge;
    if (this.discoOn || forceMove) inputRightEdge = this.rightEdgeDisco;
    if (this.x1 > inputRightEdge) {
      this.x1 -= this.alternativeFontSize;
      this.x2 -= this.alternativeFontSize;
    }
  }
  moveSquareDown(forceMove: boolean): void {
    let inputBottomEdge = this.bottomEdge;
    if (this.discoOn || forceMove) inputBottomEdge = this.bottomEdgeDisco;
    if (this.y2 < inputBottomEdge) {
      this.y1 += this.alternativeFontSize;
      this.y2 += this.alternativeFontSize;
    }
  }

  returnAlternativeFadeCondition(inputNum: number, xCoordinate: number, yCoordinate: number, squareConfig: ISquareConfig, direction: string): boolean {
    const { x1, x2, y1, y2, alternativeFontSize } = squareConfig;
    let coordinateNum = 0, alteredNum = 0;
    switch (inputNum) {
      case 0: coordinateNum = alternativeFontSize; alteredNum = coordinateNum / 2; break;
      case 1: coordinateNum = alternativeFontSize * 2; alteredNum = coordinateNum / 4; break;
    }
    let xPos1 = x1 - coordinateNum + alteredNum;
    let rightCon = xCoordinate == xPos1 && (!(yCoordinate < y1 || yCoordinate > y2) || !(yCoordinate < y1 - coordinateNum || yCoordinate > y2 + coordinateNum));
    let leftCon = xCoordinate == x2 + coordinateNum && (!(yCoordinate < y1 || yCoordinate > y2) || !(yCoordinate < y1 - coordinateNum || yCoordinate > y2 + coordinateNum));
    let yPos1 = y1 - coordinateNum + alteredNum;
    let yCon3 = !(xCoordinate < x1 - coordinateNum || xCoordinate > x2 + coordinateNum);
    let topCon1 = yCoordinate == yPos1;
    let topCon2 = !(xCoordinate < x1 - alternativeFontSize || xCoordinate > x2 + alternativeFontSize);
    if (direction === 'north') topCon1 = yCoordinate - 6 == yPos1;
    let topCon = topCon1 && (topCon2 || yCon3);
    let bottomCon1 = yCoordinate == y2 + coordinateNum;
    let bottomCon2 = !(xCoordinate < x1 - alternativeFontSize || xCoordinate > x2 + alternativeFontSize);
    if (direction === 'north') bottomCon1 = yCoordinate + 14 == y2 + coordinateNum;
    let bottomCon = bottomCon1 && (bottomCon2 || yCon3);
    return rightCon || leftCon || topCon || bottomCon;
  }

  generateRandomSquarePositions(): void {
    this.x1 = this.generateRandomPosition(50, this.getMaxPoint(true));
    this.x2 = this.x1 + 250;
    this.y1 = this.generateRandomPosition(50, this.getMaxPoint(false));
    this.y2 = this.y1 + 250;
  }

  generateRandomPosition(startingPoint: number, finishingPoint: number): number {
    let availablePositions: number[] = [];
    let current = startingPoint;
    while (current < finishingPoint) {
      availablePositions.push(current);
      current += 20;
    }
    return availablePositions[Math.floor(Math.random() * availablePositions.length)];
  }

  getMaxPoint(maxX1: boolean): number {
    if (!this.canvas) return 0;
    let heightOrWidth = maxX1 ? this.canvas.width : this.canvas.height;
    let maxRange = heightOrWidth - this.SQUARE_SIZE - 60;
    if (!maxX1) maxRange += 10;
    return Math.round(maxRange / 10) * 10;
  }

  matchColorToIndex(input: string): number {
    const map: Record<string, number> = { green: 0, red: 1, yellow: 2, blue: 3, orange: 4, pink: 5, cyan: 6, random: 7 };
    return map[input.toLowerCase()] ?? 0;
  }

  switchColor(input: string): void {
    this.chosenColor = this.matchColorToIndex(input);
  }

  updateRandomColor(): void {
    this.randomColorArray = generateRandomColorArray();
    this.colorChoiceArray[7] = this.randomColorArray;
  }

  reset(): void {
    this.words = [];
    this.all4DirectionsArray = [];
    this.direction = 'south';
    this.discoOn = false;
    this.chosenColor = 0;
    this.discoFrameCounter = 0;
    this.intervalSpeed = 50;
    this.fontSize = 20;
    this.stringSizeMin = 20;
    this.stringSizeMax = 48;
    this.alternativeFontSize = 20;
  }

  pause(): void {
    if (this.animationOn) {
      clearInterval(this.intervalValid);
      this.animationOn = false;
    } else {
      this.intervalValid = setInterval(() => {
        if (this.squareAnimationOn) this.drawAlternative();
        else this.draw(this.words, !this.all4Directions);
      }, this.intervalSpeed);
      this.animationOn = true;
    }
  }

  clearScreen(): void {
    if (!this.canvas) return;
    this.words.forEach(word => {
      switch (this.direction) {
        case 'south': word.y = generateYSouth(word.word.length, word.fontSize, this.canvas!.height); break;
        case 'north': word.y = generateYNorth(this.canvas!.height); break;
        case 'east': word.x = generateXEast(this.canvas!.width, this.canvas!.height); break;
        case 'west': word.x = generateXWest(word.word.length, word.fontSize, this.canvas!.width, this.canvas!.height); break;
      }
    });
  }

  speedController(increase: boolean): void {
    if (increase) this.intervalSpeed /= 2;
    else this.intervalSpeed *= 2;
    clearInterval(this.intervalValid);
    this.intervalValid = setInterval(() => {
      if (this.squareAnimationOn) this.drawAlternative();
      else this.draw(this.words, !this.all4Directions);
    }, this.intervalSpeed);
  }

  controlFontSize(increase: boolean): void {
    if (this.squareAnimationOn) return;
    if (increase) {
      this.defaultFontSize++;
      this.alternativeFontSize++;
    } else {
      this.defaultFontSize--;
      this.alternativeFontSize--;
    }
    this.fontSize = this.defaultFontSize;
    this.words.forEach(word => {
      word.fontSize += increase ? 1 : -1;
    });
  }

  controlStringSize(increase: boolean): void {
    if (increase) {
      this.stringSizeMin++;
      this.stringSizeMax++;
    } else {
      this.stringSizeMin--;
      this.stringSizeMax--;
    }
    this.words.forEach(word => {
      if (increase) word.increaseStringSize();
      else word.decreaseStringSize();
    });
  }

  rapidWordChangeControl(): void {
    this.rapidWordChange = !this.rapidWordChange;
  }

  switchMode(): void {
    const original = this.squareAnimationOn;
    this.reset();
    this.run(original);
  }

  resetWordsArray(): void {
    this.words = [];
    if (this.all4Directions) {
      this.initializeAll4Directions();
    } else {
      this.createMatrixArray(this.direction);
    }
    if (this.squareAnimationOn) {
      this.words.shift();
      this.giveEachWordNewWord();
      this.resetAllWordsYPositions();
    }
  }

  run(original: boolean): void {
    this.squareAnimationOn = !original;
    this.resetWordsArray();

    this.intervalValid = setInterval(() => {
      if (original) {
        this.draw(this.words, !this.all4Directions);
      } else {
        this.drawAlternative();
      }
    }, this.intervalSpeed);
    this.animationOn = true;
  }
}
