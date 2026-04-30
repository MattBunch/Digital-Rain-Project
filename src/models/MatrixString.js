// src/models/MatrixString.js
import { generateWord, getRandomChar, onePercentChance, generateWordChangeTurnoverNumber } from '../utils/MathUtils.js';
import { colorWhite } from '../constants/Assets.js';

export class CoordinateObject {
  constructor(xCoordinate, yCoordinate) {
    this.xCoordinate = xCoordinate;
    this.yCoordinate = yCoordinate;
  }
}

export class MatrixString {
  constructor(word, x, y, xSpeed, ySpeed, inputFontSize) {
    this.word = word;
    this.x = x;
    this.y = y;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
    this.fontSize = inputFontSize;
    this.wordChangeCounter = 0;
    this.wordChangeCounterTurnoverPoint = generateWordChangeTurnoverNumber();
    this.XYCoordinates = this.generateXYCoordinates();
  }

  show(ctx, inputColorArray, config, discoColorCounterCheck) {
    const { rapidWordChange, discoOn } = config;

    if (rapidWordChange) this.word = generateWord(this.word.length);

    if (discoOn) discoColorCounterCheck(ctx);

    for (let i = 0; i < this.word.length - 1; i++) {
      let letter = this.word.substring(i, i + 1);
      const xCoordinate = this.getXCoordinateFromDirection(i, config.direction, false);
      const yCoordinate = this.getYCoordinateFromDirection(i, config.direction, false);

      if (onePercentChance() && !rapidWordChange) letter = getRandomChar();

      if (!discoOn) this.setColors(ctx, i, inputColorArray, config.direction);

      ctx.fillText(letter, xCoordinate, yCoordinate);

      this.XYCoordinates = this.generateXYCoordinates();
    }
  }

  showAlternative(ctx, inputColorArray, config, squareConfig) {
    const { rapidWordChange } = config;

    if (rapidWordChange) this.word = generateWord(this.word.length);

    for (let i = 0; i < this.word.length; i++) {
      let letter = this.word.substring(i, i + 1);

      let xCoordinate = this.getXCoordinateFromDirection(i, config.direction, true);
      let yCoordinate = this.getYCoordinateFromDirection(i, config.direction, true);

      if (onePercentChance() && !rapidWordChange && i != 0)
        letter = getRandomChar();

      if (i == 0) letter = ' ';

      this.drawSquare(ctx, xCoordinate, yCoordinate, inputColorArray, config, squareConfig);

      ctx.fillText(letter, xCoordinate, yCoordinate);

      this.XYCoordinates = this.generateXYCoordinates();
    }
  }

  drawSquare(ctx, xCoordinate, yCoordinate, inputColorArray, config, squareConfig) {
    const { x1, x2, y1, y2, alternativeFontSize } = squareConfig;
    const { discoOn } = config;

    let primaryColorCondition =
      xCoordinate < x1 ||
      xCoordinate > x2 ||
      yCoordinate < y1 ||
      yCoordinate > y2;

    // This part requires returnAlternativeFadeCondition which I will move to utils or keep in CoreEngine
    // For now I'll pass a callback or the logic
    // Actually, I'll pass the callback 'returnAlternativeFadeCondition'
    const { returnAlternativeFadeCondition, discoColorCounterCheck, getRandomColor } = squareConfig;

    let alternativeFade1Condition = returnAlternativeFadeCondition(
      0,
      xCoordinate,
      yCoordinate,
      squareConfig,
      config.direction
    );

    let alternativeFade2Condition = returnAlternativeFadeCondition(
      1,
      xCoordinate,
      yCoordinate,
      squareConfig,
      config.direction
    );

    if (primaryColorCondition) {
      if (discoOn) {
        discoColorCounterCheck(ctx);
      } else if (alternativeFade1Condition) {
        ctx.fillStyle = inputColorArray[0];
      } else if (alternativeFade2Condition) {
        ctx.fillStyle = inputColorArray[1];
      } else {
        ctx.fillStyle = inputColorArray[2];
      }
    } else {
      if (discoOn) {
        ctx.fillStyle = getRandomColor();
      } else {
        ctx.fillStyle = colorWhite;
      }
    }
  }

  setColors(ctx, i, inputColorArray, direction) {
    if (direction == 'south' || direction == 'west') {
      if (i == this.word.length - 2) {
        ctx.fillStyle = colorWhite;
      } else if (i == this.word.length - 3) {
        ctx.fillStyle = inputColorArray[0];
      } else if (i == this.word.length - 4) {
        ctx.fillStyle = inputColorArray[1];
      } else {
        ctx.fillStyle = inputColorArray[2];
      }
    } else if (direction == 'north' || direction == 'east') {
      if (i == 0) {
        ctx.fillStyle = colorWhite;
      } else if (i == 1) {
        ctx.fillStyle = inputColorArray[0];
      } else if (i == 2) {
        ctx.fillStyle = inputColorArray[1];
      } else {
        ctx.fillStyle = inputColorArray[2];
      }
    }
  }

  getYCoordinateFromDirection(i, direction, alternative) {
    let defaultYCoordinate = this.y + i * this.fontSize;
    switch (direction) {
      case 'south':
        return defaultYCoordinate;
      case 'north':
        if (!alternative) return defaultYCoordinate;
        return this.y - i * this.fontSize;
      case 'east':
        return this.y;
      case 'west':
        return this.y;
    }
  }

  getXCoordinateFromDirection(i, direction, alternative) {
    let defaultXCoordinate = this.x + i * this.fontSize;
    switch (direction) {
      case 'south':
        return this.x;
      case 'north':
        return this.x;
      case 'east':
        return defaultXCoordinate;
      case 'west':
        if (!alternative) return defaultXCoordinate;
        return this.x - i * this.fontSize;
    }
  }

  generateXYCoordinates() {
    let output = new Array();
    for (let i = 0; i < this.word.length; i++) {
      let xCoordinate = this.x;
      let yCoordinate = this.y + i * this.fontSize;
      output.push(new CoordinateObject(xCoordinate, yCoordinate));
    }
    return output;
  }

  increaseStringSize() {
    this.word = this.word.concat(getRandomChar());
  }

  decreaseStringSize() {
    this.word = this.word.slice(0, -1);
  }
}
