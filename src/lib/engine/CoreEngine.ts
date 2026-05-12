// src/engine/CoreEngine.ts
import { MatrixString, IMatrixStringConfig, ISquareConfig } from '../models/MatrixString.ts';
import { Direction } from '../types/index.ts';
import {
  generateWord,
  generateWordSizeRand,
  generateFontSize,
  generateSpeed,
  generateWordChangeTurnoverNumber,
  getRandomColor,
  generateWordSizeRandHanging,
  doubleInt,
} from '../utils/MathUtils.ts';
import {
  generateYSouth,
  generateYNorth,
  generateXEast,
  generateXWest,
} from '../utils/CoordinateUtils.ts';
import { COLORS, ENGINE_CONSTANTS, DEFAULT_CONFIG } from '../constants/matrix.ts';
import { ColorManager } from './ColorManager';
import { SquareController } from './SquareController';
import { AnimationManager } from './AnimationManager';

export class CoreEngine {
  words: MatrixString[] = [];
  all4DirectionsArray: MatrixString[][] = [];
  direction: Direction = 'south';

  // Managers
  private colorManager: ColorManager;
  private squareController: SquareController;
  private animationManager: AnimationManager;

  // State
  intervalValid: ReturnType<typeof setInterval> | null = null;
  menuInterval: ReturnType<typeof setInterval> | null = null;

  discoFrameCounter: number = 0;
  discoFrameCounterTurnoverPoint: number = 10;

  defaultFontSize: number = 20;
  fontSize: number = 20;
  stringSizeMin: number = 20;
  stringSizeMax: number = 48;
  alternativeFontSize: number = 20;

  rapidWordChange: boolean = false;
  hangingWords: boolean = true;
  all4Directions: boolean = false;
  drawBackgroundOn: boolean = true;
  drawBackgroundAll4DirectionsCounter: number = 0;
  drawBackgroundAll4DirectionsCounterMax: number = 3;

  squareAnimationOn: boolean = false;
  rapidSquareOn: boolean = false;
  squareCounter: number = 0;
  squareCounterTurnoverPoint: number = 10;

  canvas?: HTMLCanvasElement;
  ctx?: CanvasRenderingContext2D;
  private currentFont: string = '';

  constructor() {
    this.colorManager = new ColorManager();
    this.squareController = new SquareController();
    this.animationManager = new AnimationManager(this.loop.bind(this));
  }

  // Proxies for legacy property access
  get discoOn() {
    return this.colorManager.discoOn;
  }
  set discoOn(value: boolean) {
    this.colorManager.discoOn = value;
  }

  get chosenColor() {
    return this.colorManager.chosenColor;
  }
  set chosenColor(value: number) {
    this.colorManager.chosenColor = value;
  }

  get animationOn() {
    return this.animationManager.animationOn;
  }
  set animationOn(value: boolean) {
    this.animationManager.animationOn = value;
  }

  get intervalSpeed() {
    return this.animationManager.intervalSpeed;
  }
  set intervalSpeed(value: number) {
    this.animationManager.intervalSpeed = value;
  }

  get requestId() {
    return this.animationManager.requestId;
  }
  set requestId(value: number | null) {
    this.animationManager.requestId = value;
  }

  get lastTime() {
    return this.animationManager.lastTime;
  }
  set lastTime(value: number) {
    this.animationManager.lastTime = value;
  }

  // SquareController proxies
  get x1() {
    return this.squareController.x1;
  }
  set x1(v) {
    this.squareController.x1 = v;
  }
  get x2() {
    return this.squareController.x2;
  }
  set x2(v) {
    this.squareController.x2 = v;
  }
  get y1() {
    return this.squareController.y1;
  }
  set y1(v) {
    this.squareController.y1 = v;
  }
  get y2() {
    return this.squareController.y2;
  }
  set y2(v) {
    this.squareController.y2 = v;
  }
  get SQUARE_SIZE() {
    return this.squareController.SQUARE_SIZE;
  }
  get topEdge() {
    return this.squareController.topEdge;
  }
  get rightEdge() {
    return this.squareController.rightEdge;
  }
  get bottomEdge() {
    return this.squareController.bottomEdge;
  }
  get leftEdge() {
    return this.squareController.leftEdge;
  }
  get topEdgeDisco() {
    return this.squareController.topEdgeDisco;
  }
  get rightEdgeDisco() {
    return this.squareController.rightEdgeDisco;
  }
  get bottomEdgeDisco() {
    return this.squareController.bottomEdgeDisco;
  }
  get leftEdgeDisco() {
    return this.squareController.leftEdgeDisco;
  }

  get colorChoiceArray() {
    return this.colorManager.colorChoiceArray;
  }
  get randomColorArray() {
    return this.colorManager.randomColorArray;
  }
  get savedColor() {
    return this.colorManager.savedColor;
  }
  set savedColor(v) {
    this.colorManager.savedColor = v;
  }

  setContext(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
    this.canvas = canvas;
    this.ctx = ctx;
    this.updateBoundaries();
  }

  updateBoundaries(): void {
    if (!this.canvas) {
      return;
    }
    this.squareController.updateBoundaries(this.canvas.width, this.canvas.height);
  }

  createMatrixArray(inputDirectionMatrix: string): void {
    if (!this.canvas) {
      return;
    }

    const columns = Math.floor(this.canvas.width / this.fontSize);
    const rows = Math.floor(this.canvas.height / this.fontSize);

    if (inputDirectionMatrix === 'south' || inputDirectionMatrix === 'north') {
      for (let i = 0; i < columns; i++) {
        const xInput = this.fontSize * i;
        const newWord = generateWord(generateWordSizeRand(this.stringSizeMin, this.stringSizeMax));
        const newFontSize = generateFontSize(this.fontSize);
        let yInput: number;
        let ySpeedInput: number;
        const xSpeedInput = 0;

        if (inputDirectionMatrix === 'south') {
          yInput = generateYSouth(newWord.length, newFontSize, this.canvas.height);
          ySpeedInput = generateSpeed();
        } else {
          yInput = generateYNorth(this.canvas.height);
          ySpeedInput = -Math.abs(generateSpeed());
        }

        this.words.push(
          new MatrixString(
            newWord,
            xInput,
            yInput,
            xSpeedInput || 0,
            ySpeedInput || 0,
            newFontSize,
          ),
        );
      }
    } else if (inputDirectionMatrix === 'east' || inputDirectionMatrix === 'west') {
      for (let i = 0; i < rows; i++) {
        const yInput = this.fontSize * i;
        const newWord = generateWord(generateWordSizeRand(this.stringSizeMin, this.stringSizeMax));
        const newFontSize = generateFontSize(this.fontSize);
        let xInput: number;
        let xSpeedInput: number;
        const ySpeedInput = 0;

        if (inputDirectionMatrix === 'east') {
          xInput = generateXEast(this.canvas.width, this.canvas.height);
          xSpeedInput = generateSpeed();
        } else {
          xInput = generateXWest(
            newWord.length,
            newFontSize,
            this.canvas.width,
            this.canvas.height,
          );
          xSpeedInput = -Math.abs(generateSpeed());
        }

        this.words.push(
          new MatrixString(
            newWord,
            xInput,
            yInput,
            xSpeedInput || 0,
            ySpeedInput || 0,
            newFontSize,
          ),
        );
      }
    }
  }

  initializeAll4Directions(): void {
    const directions = ['north', 'south', 'east', 'west'];
    this.all4DirectionsArray = directions.map((dir) => {
      this.words = [];
      this.createMatrixArray(dir);
      return this.words;
    });
    this.words = [];
  }

  draw(inputWords: MatrixString[], passThroughToDraw: boolean, speedFactor: number = 1): void {
    if (!this.ctx || !this.canvas) {
      return;
    }

    if (this.colorManager.discoOn) {
      this.discoFrameCounter++;
    }

    if (this.all4Directions && !passThroughToDraw) {
      this.drawAll4Directions(speedFactor);
      return;
    }

    const mainFont = `${this.fontSize}px 'Consolas', 'Lucida Console'`;
    if (this.currentFont !== mainFont) {
      this.ctx.font = mainFont;
      this.currentFont = mainFont;
    }

    if (
      (this.drawBackgroundOn && !this.all4Directions) ||
      this.shouldDrawBackgroundAll4Directions()
    ) {
      this.drawOpaqueRect();
    }

    for (let i = 0; i < inputWords.length; i++) {
      this.changeWordCheck(inputWords[i], inputWords[i].word.length);
      this.moveWord(inputWords[i], speedFactor);

      const wordFont = `${inputWords[i].fontSize}px 'Consolas', 'Lucida Console'`;
      if (this.ctx.font !== wordFont) {
        this.ctx.font = wordFont;
        this.currentFont = wordFont;
      }

      const config: IMatrixStringConfig = {
        rapidWordChange: this.rapidWordChange,
        discoOn: this.colorManager.discoOn,
        direction: this.direction,
      };

      const discoCallback = (ctx: CanvasRenderingContext2D) => {
        const { color, reset } = this.colorManager.handleDiscoFrame(
          this.discoFrameCounter,
          this.discoFrameCounterTurnoverPoint,
        );
        ctx.fillStyle = color;
        if (reset) {
          this.discoFrameCounter = 0;
        }
      };

      inputWords[i].show(this.ctx, this.colorManager.getCurrentColorArray(), config, discoCallback);
    }
  }

  private shouldDrawBackgroundAll4Directions(): boolean {
    if (!this.all4Directions || !this.drawBackgroundOn) {
      return false;
    }
    this.drawBackgroundAll4DirectionsCounter++;
    if (this.drawBackgroundAll4DirectionsCounter > this.drawBackgroundAll4DirectionsCounterMax) {
      this.drawBackgroundAll4DirectionsCounter = 0;
      return true;
    }
    return false;
  }

  private moveWord(word: MatrixString, speedFactor: number): void {
    if (!this.canvas) {
      return;
    }
    const movement = (this.fontSize + Math.abs(word.ySpeed || word.xSpeed)) * speedFactor;

    switch (this.direction) {
      case 'south':
        if (word.y > this.canvas.height) {
          word.ySpeed = generateSpeed();
          word.word = generateWord(generateWordSizeRand(this.stringSizeMin, this.stringSizeMax));
          word.fontSize = generateFontSize(this.fontSize);
          word.y = generateYSouth(word.word.length, word.fontSize, this.canvas.height);
        } else {
          word.y += movement;
        }
        break;
      case 'north':
        if (word.y < 0 - this.canvas.height * ENGINE_CONSTANTS.Y_NORTH_BOUNDARY_MULTIPLIER) {
          word.y = generateYNorth(this.canvas.height);
          word.ySpeed = -Math.abs(generateSpeed());
          word.word = generateWord(generateWordSizeRand(this.stringSizeMin, this.stringSizeMax));
          word.fontSize = generateFontSize(this.fontSize);
        } else {
          word.y -= movement;
        }
        break;
      case 'east':
        if (word.x < 0 - this.canvas.width) {
          word.x = generateXEast(this.canvas.width, this.canvas.height);
          word.xSpeed = generateSpeed();
          word.word = generateWord(generateWordSizeRand(this.stringSizeMin, this.stringSizeMax));
          word.fontSize = generateFontSize(this.fontSize);
        } else {
          word.x -= movement;
        }
        break;
      case 'west':
        if (word.x > this.canvas.width) {
          word.xSpeed = -Math.abs(generateSpeed());
          word.word = generateWord(generateWordSizeRand(this.stringSizeMin, this.stringSizeMax));
          word.fontSize = generateFontSize(this.fontSize);
          word.x = generateXWest(
            word.word.length,
            word.fontSize,
            this.canvas.width,
            this.canvas.height,
          );
        } else {
          word.x += movement;
        }
        break;
    }
  }

  drawAll4Directions(speedFactor: number = 1): void {
    const directions: Direction[] = ['north', 'south', 'east', 'west'];
    directions.forEach((dir, i) => {
      this.direction = dir;
      this.draw(this.all4DirectionsArray[i], true, speedFactor);
    });
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
    if (!this.ctx || !this.canvas) {
      return;
    }
    this.ctx.fillStyle = `rgba(0, 0, 0, ${ENGINE_CONSTANTS.OPACITY_NORMAL})`;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawSolidRect(): void {
    if (!this.ctx || !this.canvas) {
      return;
    }
    this.ctx.fillStyle = `rgba(0, 0, 0, ${ENGINE_CONSTANTS.OPACITY_SOLID})`;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawAlternative(): void {
    if (!this.ctx) {
      return;
    }
    if (this.colorManager.discoOn) {
      this.discoFrameCounter++;
    }
    this.squareCounter++;
    if (this.drawBackgroundOn) {
      this.drawOpaqueRect();
    }

    this.ctx.fillStyle = COLORS.WHITE;
    const altFont = `${this.alternativeFontSize}px Arial`;
    if (this.currentFont !== altFont) {
      this.ctx.font = altFont;
      this.currentFont = altFont;
    }

    if (this.squareCounter > this.squareCounterTurnoverPoint && this.rapidSquareOn) {
      this.squareCounter = 0;
      if (this.canvas) {
        this.squareController.generateRandomSquarePositions(this.canvas.width, this.canvas.height);
      }
    }

    const newWordSize = this.getNewWordSize();
    const config: IMatrixStringConfig = {
      rapidWordChange: this.rapidWordChange,
      discoOn: this.colorManager.discoOn,
      direction: this.direction,
    };

    const squareConfig: ISquareConfig = {
      x1: this.squareController.x1,
      x2: this.squareController.x2,
      y1: this.squareController.y1,
      y2: this.squareController.y2,
      alternativeFontSize: this.alternativeFontSize,
      returnAlternativeFadeCondition: this.returnAlternativeFadeCondition.bind(this),
      discoColorCounterCheck: (ctx: CanvasRenderingContext2D) => {
        const { color, reset } = this.colorManager.handleDiscoFrame(
          this.discoFrameCounter,
          this.discoFrameCounterTurnoverPoint,
        );
        ctx.fillStyle = color;
        if (reset) {
          this.discoFrameCounter = 0;
        }
      },
      getRandomColor: getRandomColor,
    };

    this.words.forEach((arrayItem) => {
      arrayItem.fontSize = this.alternativeFontSize;
      this.updateWordWord(arrayItem, newWordSize);
      arrayItem.showAlternative(
        this.ctx!,
        this.colorManager.getCurrentColorArray(),
        config,
        squareConfig,
      );
    });
  }

  private updateWordWord(word: MatrixString, newWordSize: number): void {
    if (this.hangingWords) {
      if (this.rapidWordChange) {
        word.word = generateWord(word.word.length);
      } else {
        this.changeWordCheck(word, word.word.length);
      }
    } else {
      if (this.rapidWordChange) {
        word.word = generateWord(newWordSize);
      } else {
        this.changeWordCheck(word, newWordSize);
      }
    }
  }

  getNewWordSize(): number {
    if (!this.canvas) {
      return ENGINE_CONSTANTS.DEFAULT_WORD_SIZE_ALT;
    }
    let output = ENGINE_CONSTANTS.DEFAULT_WORD_SIZE_ALT;
    if (
      this.canvas.height > ENGINE_CONSTANTS.CANVAS_HEIGHT_THRESHOLD_ALT ||
      this.alternativeFontSize < 14
    ) {
      output = doubleInt(output) * 1.5;
    }
    if (this.alternativeFontSize > ENGINE_CONSTANTS.FONT_SIZE_THRESHOLD_ALT) {
      output /= 2;
    }
    return output;
  }

  giveEachWordNewWord(): void {
    if (!this.canvas) {
      return;
    }
    const newWordSize = this.getNewWordSize();
    this.words.forEach((arrayWord) => {
      if (this.hangingWords) {
        let hangingWordSize = generateWordSizeRandHanging(this.stringSizeMin, this.stringSizeMax);
        if (this.canvas!.height < ENGINE_CONSTANTS.CANVAS_LARGE_THRESHOLD) {
          hangingWordSize = Math.round(
            hangingWordSize * ENGINE_CONSTANTS.HANGING_WORD_SIZE_MULTIPLIER,
          );
        }
        arrayWord.word = generateWord(hangingWordSize);
      } else {
        arrayWord.word = generateWord(newWordSize);
      }
      arrayWord.XYCoordinates = arrayWord.generateXYCoordinates();
    });
  }

  resetAllWordsYPositions(): void {
    if (!this.canvas) {
      return;
    }
    this.words.forEach((word) => {
      switch (this.direction) {
        case 'south':
          word.y = 0;
          break;
        case 'north':
          word.y = this.canvas!.height;
          break;
        case 'east':
          word.x = 0;
          break;
        case 'west':
          word.x = this.canvas!.width;
          break;
      }
    });
  }

  moveSquareLeft(forceMove: boolean): void {
    this.squareController.moveLeft(
      this.alternativeFontSize,
      this.colorManager.discoOn || forceMove,
    );
  }

  moveSquareUp(forceMove: boolean): void {
    this.squareController.moveUp(this.alternativeFontSize, this.colorManager.discoOn || forceMove);
  }

  moveSquareRight(forceMove: boolean): void {
    this.squareController.moveRight(
      this.alternativeFontSize,
      this.colorManager.discoOn || forceMove,
    );
  }

  moveSquareDown(forceMove: boolean): void {
    this.squareController.moveDown(
      this.alternativeFontSize,
      this.colorManager.discoOn || forceMove,
    );
  }

  returnAlternativeFadeCondition(
    inputNum: number,
    xCoordinate: number,
    yCoordinate: number,
    squareConfig: ISquareConfig,
    direction: string,
  ): boolean {
    const { x1, x2, y1, y2, alternativeFontSize } = squareConfig;
    let coordinateNum = 0,
      alteredNum = 0;
    switch (inputNum) {
      case 0:
        coordinateNum = alternativeFontSize;
        alteredNum = coordinateNum / 2;
        break;
      case 1:
        coordinateNum = alternativeFontSize * 2;
        alteredNum = coordinateNum / 4;
        break;
    }
    const xPos1 = x1 - coordinateNum + alteredNum;
    const rightCon =
      xCoordinate == xPos1 &&
      (!(yCoordinate < y1 || yCoordinate > y2) ||
        !(yCoordinate < y1 - coordinateNum || yCoordinate > y2 + coordinateNum));
    const leftCon =
      xCoordinate == x2 + coordinateNum &&
      (!(yCoordinate < y1 || yCoordinate > y2) ||
        !(yCoordinate < y1 - coordinateNum || yCoordinate > y2 + coordinateNum));
    const yPos1 = y1 - coordinateNum + alteredNum;
    const yCon3 = !(xCoordinate < x1 - coordinateNum || xCoordinate > x2 + coordinateNum);
    let topCon1 = yCoordinate == yPos1;
    const topCon2 = !(
      xCoordinate < x1 - alternativeFontSize || xCoordinate > x2 + alternativeFontSize
    );
    if (direction === 'north') {
      topCon1 = yCoordinate - ENGINE_CONSTANTS.ALT_FADE_OFFSET_NORTH == yPos1;
    }
    const topCon = topCon1 && (topCon2 || yCon3);
    let bottomCon1 = yCoordinate == y2 + coordinateNum;
    const bottomCon2 = !(
      xCoordinate < x1 - alternativeFontSize || xCoordinate > x2 + alternativeFontSize
    );
    if (direction === 'north') {
      bottomCon1 =
        yCoordinate + ENGINE_CONSTANTS.ALT_FADE_OFFSET_NORTH_BOTTOM == y2 + coordinateNum;
    }
    const bottomCon = bottomCon1 && (bottomCon2 || yCon3);
    return rightCon || leftCon || topCon || bottomCon;
  }

  generateRandomSquarePositions(): void {
    if (this.canvas) {
      this.squareController.generateRandomSquarePositions(this.canvas.width, this.canvas.height);
    }
  }

  matchColorToIndex(input: string): number {
    return this.colorManager.matchColorToIndex(input);
  }

  switchColor(input: string): void {
    this.colorManager.switchColor(input);
  }

  updateRandomColor(): void {
    this.colorManager.updateRandomColor();
  }

  reset(): void {
    this.words = [];
    this.all4DirectionsArray = [];
    this.direction = 'south';
    this.discoFrameCounter = 0;
    this.animationManager.intervalSpeed = DEFAULT_CONFIG.SPEED;
    this.fontSize = DEFAULT_CONFIG.FONT_SIZE;
    this.stringSizeMin = DEFAULT_CONFIG.STRING_SIZE_MIN;
    this.stringSizeMax = DEFAULT_CONFIG.STRING_SIZE_MAX;
    this.alternativeFontSize = DEFAULT_CONFIG.FONT_SIZE;
  }

  pause(): void {
    this.animationManager.pause();
  }

  loop(timestamp: number): void {
    if (!this.animationManager.animationOn) {
      return;
    }

    const deltaTime = this.animationManager.getDeltaTime(timestamp);
    const speedFactor = this.animationManager.getSpeedFactor(deltaTime);

    if (this.squareAnimationOn) {
      this.drawAlternative();
    } else {
      this.draw(this.words, !this.all4Directions, speedFactor);
    }

    this.animationManager.requestId = requestAnimationFrame(this.loop.bind(this));
  }

  clearScreen(): void {
    if (!this.canvas) {
      return;
    }
    this.words.forEach((word) => {
      switch (this.direction) {
        case 'south':
          word.y = generateYSouth(word.word.length, word.fontSize, this.canvas!.height);
          break;
        case 'north':
          word.y = generateYNorth(this.canvas!.height);
          break;
        case 'east':
          word.x = generateXEast(this.canvas!.width, this.canvas!.height);
          break;
        case 'west':
          word.x = generateXWest(
            word.word.length,
            word.fontSize,
            this.canvas!.width,
            this.canvas!.height,
          );
          break;
      }
    });
  }

  speedController(increase: boolean): void {
    if (increase) {
      this.animationManager.intervalSpeed /= 2;
    } else {
      this.animationManager.intervalSpeed *= 2;
    }
  }

  controlFontSize(increase: boolean): void {
    if (this.squareAnimationOn) {
      return;
    }
    const diff = increase ? 1 : -1;
    this.defaultFontSize += diff;
    this.alternativeFontSize += diff;
    this.fontSize = this.defaultFontSize;
    this.words.forEach((word) => {
      word.fontSize += diff;
    });
  }

  controlStringSize(increase: boolean): void {
    const diff = increase ? 1 : -1;
    this.stringSizeMin += diff;
    this.stringSizeMax += diff;
    this.words.forEach((word) => {
      if (increase) {
        word.increaseStringSize();
      } else {
        word.decreaseStringSize();
      }
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

  stop(): void {
    this.animationManager.stop();
    if (this.intervalValid) {
      clearInterval(this.intervalValid);
      this.intervalValid = null;
    }
    if (this.menuInterval) {
      clearInterval(this.menuInterval);
      this.menuInterval = null;
    }
  }

  run(original: boolean): void {
    this.animationManager.stop();
    this.squareAnimationOn = !original;
    this.resetWordsArray();
    this.animationManager.start();
  }
}
