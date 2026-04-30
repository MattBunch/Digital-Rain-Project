// src/models/MatrixString.js
import { ALPHABET, COLORS } from '../constants/matrix.js';
import { generateRandomNumber, onePercentChance, getRandomChar } from '../utils/math.js';

export class CoordinateObject {
  constructor(xCoordinate, yCoordinate) {
    this.xCoordinate = xCoordinate;
    this.yCoordinate = yCoordinate;
  }
}

export class MatrixString {
  constructor(word, x, y, xSpeed, ySpeed, fontSize) {
    this.word = word;
    this.x = x;
    this.y = y;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
    this.fontSize = fontSize;
    this.wordChangeCounter = 0;
    this.wordChangeCounterTurnoverPoint = Math.floor(generateRandomNumber(1, 10));
    this.XYCoordinates = this.generateXYCoordinates();
  }

  generateXYCoordinates() {
    let output = [];
    for (let i = 0; i < this.word.length; i++) {
      let xCoordinate = this.x;
      let yCoordinate = this.y + i * this.fontSize;
      output.push(new CoordinateObject(xCoordinate, yCoordinate));
    }
    return output;
  }

  // Note: ctx, discoOn, rapidWordChange, etc. will need to be passed or accessed via state
  // For now, I'll keep the logic but it needs refinement to be truly modular.
  show(ctx, inputColorArray, state) {
    if (state.rapidWordChange) {
      this.word = this.generateWord(this.word.length);
    }

    for (let i = 0; i < this.word.length - 1; i++) {
      let letter = this.word.substring(i, i + 1);
      const xCoordinate = this.getXCoordinateFromDirection(i, state.direction, false);
      const yCoordinate = this.getYCoordinateFromDirection(i, state.direction, false);

      if (onePercentChance() && !state.rapidWordChange) {
        letter = getRandomChar(ALPHABET);
      }

      if (!state.discoOn) {
        this.setColors(ctx, i, inputColorArray, state.direction);
      } else {
        // Disco logic should be handled by a central controller or passed in
      }

      ctx.fillText(letter, xCoordinate, yCoordinate);
    }
  }

  generateWord(length) {
    let word = '';
    for (let i = 0; i < length; i++) {
      word += getRandomChar(ALPHABET);
    }
    return word;
  }

  setColors(ctx, i, inputColorArray, direction) {
    if (direction === 'south' || direction === 'west') {
      if (i === this.word.length - 2) ctx.fillStyle = COLORS.WHITE;
      else if (i === this.word.length - 3) ctx.fillStyle = inputColorArray[0];
      else if (i === this.word.length - 4) ctx.fillStyle = inputColorArray[1];
      else ctx.fillStyle = inputColorArray[2];
    } else {
      if (i === 0) ctx.fillStyle = COLORS.WHITE;
      else if (i === 1) ctx.fillStyle = inputColorArray[0];
      else if (i === 2) ctx.fillStyle = inputColorArray[1];
      else ctx.fillStyle = inputColorArray[2];
    }
  }

  getXCoordinateFromDirection(i, direction, alternative) {
    let defaultXCoordinate = this.x + i * this.fontSize;
    switch (direction) {
      case 'east': return defaultXCoordinate;
      case 'west': return alternative ? this.x - i * this.fontSize : defaultXCoordinate;
      default: return this.x;
    }
  }

  getYCoordinateFromDirection(i, direction, alternative) {
    let defaultYCoordinate = this.y + i * this.fontSize;
    switch (direction) {
      case 'south': return defaultYCoordinate;
      case 'north': return alternative ? this.y - i * this.fontSize : defaultYCoordinate;
      default: return this.y;
    }
  }

  increaseStringSize() {
    this.word = this.word.concat(getRandomChar(ALPHABET));
  }

  decreaseStringSize() {
    this.word = this.word.slice(0, -1);
  }
}
