/**
  _____  _       _ _        _   _____       _       
 |  __ \(_)     (_) |      | | |  __ \     (_)      
 | |  | |_  __ _ _| |_ __ _| | | |__) |__ _ _ _ __  
 | |  | | |/ _` | | __/ _` | | |  _  // _` | | '_ \ 
 | |__| | | (_| | | || (_| | | | | \ \ (_| | | | | |
 |_____/|_|\__, |_|\__\__,_|_| |_|  \_\__,_|_|_| |_|
            __/ |                                   
           |___/ 
 * This program displays digital rain animation within the window browser, 
 * as seen in the film The Matrix (1999) or Ghost in the Shell (1995).
<p>
 * @author      Matt Bunch
 * @version     1.0
 * @since       2020-08-18
<p>

#############################################################################################
   _____                             _____      _                
  / ____|                           / ____|    | |              
 | |     __ _ _ ____   ____ _ ___  | (___   ___| |_ _   _ _ __  
 | |    / _` | '_ \ \ / / _` / __|  \___ \ / _ \ __| | | | '_ \ 
 | |___| (_| | | | \ V / (_| \__ \  ____) |  __/ |_| |_| | |_) |
  \_____\__,_|_| |_|\_/ \__,_|___/ |_____/ \___|\__|\__,_| .__/ 
                                                         | |    
                                                         |_|                                 
                                                         
#############################################################################################
 */

let columns, rows, fontSize, width, height, canvas, ctx;
let defaultFontSize = 20;

function canvasSetup() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas = document.getElementById("myCanvas"); // canvas object
  ctx = canvas.getContext("2d"); // context object
  fontSize = defaultFontSize;
  resetStringSizes();
  ctx.font = fontSize + "px 'Consolas', 'Lucida Console'";
  ctx.fillStyle = "#00FF41";

  ctx.canvas.width = width;
  ctx.canvas.height = height;
  columns = canvas.width / fontSize;
  rows = canvas.height / fontSize;

  // mirror the screen
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);

  leftEdge = canvas.width - alternativeFontSize * 3;
  bottomEdge = canvas.height - alternativeFontSize * 3;

  leftEdgeDisco = canvas.width - alternativeFontSize;
  bottomEdgeDisco = canvas.height - alternativeFontSize;
}

/*
#############################################################################################

   _____      _                      
  / ____|    | |                     
 | |     ___ | | ___  _   _ _ __ ___ 
 | |    / _ \| |/ _ \| | | | '__/ __|
 | |___| (_) | | (_) | |_| | |  \__ \
  \_____\___/|_|\___/ \__,_|_|  |___/
                                                            
#############################################################################################

colors ordered in array from brightest to darkest.
*/

// white:
const colorWhite = "#ffffff"; // white, yes I know white is a shade not a color
const colorBlack = "#000000"; // black

// Green:
const colorMatrixGreen = "#00ff41"; // matrix green
const color90White10Green = "#ccffd9"; // color 95% white, 5% matrix green
const color70White30Green = "#80ff9f"; // color 70% white, 30% matrix green
const greenArray = [color90White10Green, color70White30Green, colorMatrixGreen];

// Red:
const color90White10Red = "#ffcccc"; // color 95% white, 5% red
const color70White30Red = "#ff6666"; // color 70% white, 30% red
const colorRed = "#e60000"; // red
const redArray = [color90White10Red, color70White30Red, colorRed];

// Yellow:
const color95White5Yellow = "#ffffe6"; // color 95% white, 5% yellow
const color70White30Yellow = "#ffff66"; // color 70% white, 30% yellow
const colorYellow = "#ffff00"; // yellow
const yellowArray = [color95White5Yellow, color70White30Yellow, colorYellow];

// Blue:
const color95White5Blue = "#e6e6ff"; // color 95% white, 5% blue
const color70White30Blue = "#6666ff"; // color 70% white, 30% blue
const colorBlue = "#0000ff"; // blue
const blueArray = [color95White5Blue, color70White30Blue, colorBlue];

// Orange:
const color95White5Orange = "#fff5e6"; // color 95% white, 5% orange
const color70White30Orange = "#ffc266"; // color 70% white, 30% orange
const colorOrange = "#ff9900"; // orange
const orangeArray = [color95White5Orange, color70White30Orange, colorOrange];

// Pink
const color95White5Pink = "#ffe6ff"; // color 95% white, 5% pink
const color70White30Pink = "#ff66ff"; // color 70% white, 30% pink
const colorPink = "#ff00ff"; // pink
const pinkArray = [color95White5Pink, color70White30Pink, colorPink];

// Cyan
const color95White5Cyan = "#e6ffff"; // color 95% white, 5% cyan
const color70White30Cyan = "#66ffff"; // color 70% white, 30% cyan
const colorCyan = "#00ffff"; // cyan
const cyanArray = [color95White5Cyan, color70White30Cyan, colorCyan];

// random colors
let randomColorArray = generateRandomColorArray();

// array of color array
const colorChoiceArray = [
  greenArray,
  redArray,
  yellowArray,
  blueArray,
  orangeArray,
  pinkArray,
  cyanArray,
  randomColorArray,
];

function getRandomColor() {
  let letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function generateRandomColorArray() {
  return [getRandomColor(), getRandomColor(), getRandomColor()];
}

/*
##################################################################################################
  _____                               _              ______                _   _                 
 |  __ \                             | |            |  ____|              | | (_)                
 | |__) |_ _ _ __ __ _ _ __ ___   ___| |_ ___ _ __  | |__ _   _ _ __   ___| |_ _  ___  _ __  ___ 
 |  ___/ _` | '__/ _` | '_ ` _ \ / _ \ __/ _ \ '__| |  __| | | | '_ \ / __| __| |/ _ \| '_ \/ __|
 | |  | (_| | | | (_| | | | | | |  __/ ||  __/ |    | |  | |_| | | | | (__| |_| | (_) | | | \__ \
 |_|   \__,_|_|  \__,_|_| |_| |_|\___|\__\___|_|    |_|   \__,_|_| |_|\___|\__|_|\___/|_| |_|___/
                                                                                                                                                                                                                                                  
##################################################################################################
*/

let iCounter = 0;

// generate random number between a range, used in multiple functions
function generateRandomNumber(min, max) {
  let rangeMin = min;
  let rangeMax = max;
  let number = Math.random() * (rangeMax - rangeMin) + rangeMin; // generate random size between min and max
  return number;
}

function onePercentChance() {
  return Math.random() < 0.01;
}

const DEFAULT_STRING_SIZE_MIN = 20;
const DEFAULT_STRING_SIZE_MAX = 48;
let stringSizeMin = DEFAULT_STRING_SIZE_MIN;
let stringSizeMax = DEFAULT_STRING_SIZE_MAX;

function resetStringSizes() {
  stringSizeMin = DEFAULT_STRING_SIZE_MIN;
  stringSizeMax = DEFAULT_STRING_SIZE_MAX;
}

// generate random size of word between 20 and 48
function generateWordSizeRand() {
  return Math.floor(generateRandomNumber(stringSizeMin, stringSizeMax));
}

function generateWordSizeRandHanging() {
  return Math.floor(
    generateRandomNumber(stringSizeMin - 10, stringSizeMax + 3)
  );
}

// generate font size number between 15 and 25
function generateFontSize() {
  return Math.floor(generateRandomNumber(fontSize - 5, fontSize + 5));
}

// generate both xSpeed and ySpeed between 0.001 and 9.999
function generateSpeed() {
  return generateRandomNumber(0.001, 9.999);
}

// string of the alphabet
const alphabet =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ";

// function to generate a random word based on this string.
function generateWord(wordSize) {
  // word declaration as empty
  let word = "";

  // get random letter from the alphabet and add it to the word
  for (let i = 0; i < wordSize; i++) {
    word += getRandomChar();
  }
  return word;
}

function getRandomChar() {
  return alphabet.charAt(Math.floor(Math.random() * alphabet.length));
}

function generateWordChangeTurnoverNumber() {
  return Math.floor(generateRandomNumber(1, 10));
}

function generateStartingPointInput(inputMin, inputMax) {
  if (isCanvasLarge()) {
    inputMax = doubleInt(inputMax);
  }

  let output = generateRandomNumber(inputMin, inputMax);

  // debugStartingPosition(inputMin, inputMax, output);

  return output;
}

function generateXEast() {
  let minNum = canvas.width;
  let maxNum = canvas.width + 1200;

  return generateStartingPointInput(minNum, maxNum);
}

function generateXWest(word, inputFontSize) {
  let minNum = 0 - (word.length * inputFontSize + 20);
  let maxNum = canvas.width * -1 * 1.5;

  return generateStartingPointInput(minNum, maxNum);
}

function generateYNorth() {
  let minNum = canvas.height + 2;
  let maxNum = Math.round(
    canvas.height + canvas.height * 2 + canvas.height * 0.7021
  );

  return generateStartingPointInput(minNum, maxNum);
}

function generateYSouth(word, inputFontSize) {
  let minNum = 0 - word.length * inputFontSize;
  let maxNum = canvas.height * -1 * 4;

  return generateStartingPointInput(minNum, maxNum);
}

function isCanvasLarge() {
  return canvas.height > 1000;
}

function doubleInt(input) {
  return input * 2;
}

const vertical = "vertical";
const horizontal = "horizontal";

function debugStartingPosition(minNum, maxNum, output) {
  if (iCounter < 1) {
    iCounter++;
    console.log("min: " + minNum);
    console.log("max: " + maxNum);
    let difference = maxNum - minNum;
    console.log("difference: " + difference);
    console.log("canvas.height: " + canvas.height);
    console.log("canvas.width: " + canvas.width);
    console.log("starting position: " + output);
  } else {
    // printAverage();
  }
}

function printAverage() {
  let average = calculateAverageStartingPosition(words, horizontal);
  console.log("average starting position: " + average);
}

function calculateAverageStartingPosition(inputArray, inputDirection) {
  let total = 0;
  let counter = 0;
  for (let i = 0; i < inputArray.length; i++) {
    if (inputDirection === vertical) total += inputArray[i].y;
    else if (inputDirection === horizontal) total += inputArray[i].x;
    counter++;
  }

  return total / counter;
}

/* 
##################################################################################################
   __  __       _        _         _____ _        _                _____ _               
  |  \/  |     | |      (_)       / ____| |      (_)              / ____| |              
  | \  / | __ _| |_ _ __ ___  __ | (___ | |_ _ __ _ _ __   __ _  | |    | | __ _ ___ ___ 
  | |\/| |/ _` | __| '__| \ \/ /  \___ \| __| '__| | '_ \ / _` | | |    | |/ _` / __/ __|
  | |  | | (_| | |_| |  | |>  <   ____) | |_| |  | | | | | (_| | | |____| | (_| \__ \__ \
  |_|  |_|\__,_|\__|_|  |_/_/\_\ |_____/ \__|_|  |_|_| |_|\__, |  \_____|_|\__,_|___/___/
                                                           __/ |                         
                                                          |___/                          
#################################################################################################
*/

// disco frame counters
const discoFrameElement = document.getElementById("frameCount");
let discoFrameCounter = 0; // counter for determining frame which colors change

let discoFrameCounterTurnoverPoint = discoFrameElement.value; // counter maximum for when counter goes back to 0
if (discoFrameElement.value < 0 || discoFrameElement == null) {
  discoFrameCounterTurnoverPoint = 10;
}

let savedColor = getRandomColor();

class CoordinateObject {
  constructor(xCoordinate, yCoordinate) {
    this.xCoordinate = xCoordinate;
    this.yCoordinate = yCoordinate;
  }
}

class MatrixString {
  constructor(word, x, y, xSpeed, ySpeed, inputFontSize) {
    this.word = word; // word
    this.x = x; // random x float coordinates
    this.y = y; // random y float coordinates
    this.xSpeed = xSpeed; // random x float speed
    this.ySpeed = ySpeed; // random y float speed
    this.fontSize = inputFontSize; //  random font size
    this.wordChangeCounter = 0;
    this.wordChangeCounterTurnoverPoint = generateWordChangeTurnoverNumber();
    this.XYCoordinates = this.generateXYCoordinates();
  }

  // method for displaying text to the screen, default method
  showVertical(inputColorArray) {
    // for changing the string to a different string with the same size every frame
    if (rapidWordChange) this.word = generateWord(this.word.length);

    if (direction === "south") {
      for (let i = 0; i < this.word.length - 1; i++) {
        let letter = this.word.substring(i, i + 1);
        if (onePercentChance() && !rapidWordChange) letter = getRandomChar();

        if (i == this.word.length - 2) {
          // set first letter color to white
          ctx.fillStyle = colorWhite;
        } else if (i == this.word.length - 3) {
          // set second letter color to 95% white, 5% matrix color
          ctx.fillStyle = inputColorArray[0];
        } else if (i == this.word.length - 4) {
          // set third letter color to 90% white, 10% matrix color
          ctx.fillStyle = inputColorArray[1];
        } else {
          // set rest of the string to color
          // extension? fade out of darker colors
          ctx.fillStyle = inputColorArray[2];
        }
        ctx.fillText(letter, this.x, this.y + i * this.fontSize);
      }
    } else if (direction === "north") {
      for (let i = 0; i < this.word.length; i++) {
        let letter = this.word.substring(i, i + 1);

        if (onePercentChance() && !rapidWordChange) letter = getRandomChar();

        if (i == 0) {
          // set first letter color to white
          ctx.fillStyle = colorWhite;
        } else if (i == 1) {
          // set second letter color to 95% white, 5% matrix color
          ctx.fillStyle = inputColorArray[0];
        } else if (i == 2) {
          // set third letter color to 90% white, 10% matrix color
          ctx.fillStyle = inputColorArray[1];
        } else {
          // set rest of the string to color
          // extension? fade out of darker colors
          ctx.fillStyle = inputColorArray[2];
        }
        ctx.fillText(letter, this.x, this.y + i * this.fontSize);
      }
    }
    this.XYCoordinates = this.generateXYCoordinates();
  }

  // disco mode vertical, each letter will be a different color on each frame
  showDiscoVertical() {
    if (rapidWordChange) this.word = generateWord(this.word.length);

    discoColorCounterCheck();

    for (let i = 0; i < this.word.length - 1; i++) {
      let letter = this.word.substring(i, i + 1);
      if (onePercentChance() && !rapidWordChange) letter = getRandomChar();

      ctx.fillText(letter, this.x, this.y + i * this.fontSize);
    }

    this.XYCoordinates = this.generateXYCoordinates();
  }

  // for horizontal movements (east and west)
  showHorizontal(inputColorArray) {
    // for changing the string to a different string with the same size every frame
    if (rapidWordChange) this.word = generateWord(this.word.length);
    // east
    if (direction === "east") {
      for (let i = 0; i < this.word.length - 1; i++) {
        let letter = this.word.substring(i, i + 1);
        if (onePercentChance() && !rapidWordChange) {
          letter = getRandomChar();
        }

        if (i == 0) {
          // set first letter color to white
          ctx.fillStyle = colorWhite;
        } else if (i == 1) {
          // set second letter color to 95% white, 5% matrix color
          ctx.fillStyle = inputColorArray[0];
        } else if (i == 2) {
          // set third letter color to 90% white, 10% matrix color
          ctx.fillStyle = inputColorArray[1];
        } else {
          // set rest of the string to color
          ctx.fillStyle = inputColorArray[2];
        }

        ctx.fillText(
          // reversal of above text for moving horizontal
          letter,
          this.x + i * this.fontSize,
          this.y
        );
      }
    } else if (direction === "west") {
      for (let i = 0; i < this.word.length - 1; i++) {
        let letter = this.word.substring(i, i + 1);
        if (onePercentChance() && !rapidWordChange) {
          letter = getRandomChar();
        }

        if (i == this.word.length - 2) {
          // set first letter color to white
          ctx.fillStyle = colorWhite;
        } else if (i == this.word.length - 3) {
          // set second letter color to 95% white, 5% matrix color
          ctx.fillStyle = inputColorArray[0];
        } else if (i == this.word.length - 4) {
          // set third letter color to 90% white, 10% matrix color
          ctx.fillStyle = inputColorArray[1];
        } else {
          // set rest of the string to color
          ctx.fillStyle = inputColorArray[2];
        }
        ctx.fillText(
          // reversal of above text for moving horizontal
          letter,
          this.x + i * this.fontSize,
          this.y
        );
      }
    }
  }

  // disco mode horizontal, each letter will be a different color on each frame
  showDiscoHorizontal() {
    if (rapidWordChange) this.word = generateWord(this.word.length);

    discoColorCounterCheck();

    for (let i = 0; i < this.word.length - 1; i++) {
      let letter = this.word.substring(i, i + 1);
      if (onePercentChance() && !rapidWordChange) {
        letter = getRandomChar();
      }
      ctx.fillText(letter, this.x + i * this.fontSize, this.y);
    }
  }

  showAlternative(inputColorArray) {
    if (rapidWordChange) this.word = generateWord(this.word.length);

    for (let i = 0; i < this.word.length; i++) {
      let letter = this.word.substring(i, i + 1);
      let xCoordinate = this.x;
      let yCoordinate = this.y + i * this.fontSize;

      if (onePercentChance() && !rapidWordChange && i != 0)
        letter = getRandomChar();

      if (i == 0) letter = " ";

      let primaryColorCondition =
        xCoordinate < x1 ||
        xCoordinate > x2 ||
        yCoordinate < y1 ||
        yCoordinate > y2;

      let alternativeFade1Condition = returnAlternativeFadeCondition(
        0,
        xCoordinate,
        yCoordinate
      );

      let alternativeFade2Condition = returnAlternativeFadeCondition(
        1,
        xCoordinate,
        yCoordinate
      );

      if (primaryColorCondition) {
        if (discoOn) {
          discoColorCounterCheck();
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

      ctx.fillText(letter, xCoordinate, yCoordinate);

      this.XYCoordinates = this.generateXYCoordinates();
    }
  }

  // only returns for vertical
  generateXYCoordinates() {
    let output = new Array();

    for (let i = 0; i < this.word.length; i++) {
      let xCoordinate = this.x;
      let yCoordinate = this.y + i * this.fontSize;
      output.push(new CoordinateObject(xCoordinate, yCoordinate));
    }

    return output;
  }
}

let testWord = new MatrixString("1234567890", 50, 50, 50, 50, 25);

function discoColorCounterCheck() {
  if (discoFrameCounter > discoFrameCounterTurnoverPoint) {
    ctx.fillStyle = getRandomColor();
    savedColor = ctx.fillStyle;
    discoFrameCounter = 0;
  } else {
    ctx.fillStyle = savedColor;
  }
}

function returnAlternativeFadeCondition(inputNum, xCoordinate, yCoordinate) {
  let coordinateNum = 0;
  let alteredNum;
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

  let xPos1 = x1 - coordinateNum + alteredNum;

  // right
  let con1 =
    xCoordinate == xPos1 &&
    (!(yCoordinate < y1 || yCoordinate > y2) ||
      !(yCoordinate < y1 - coordinateNum || yCoordinate > y2 + coordinateNum));

  // left
  let con2 =
    xCoordinate == x2 + coordinateNum &&
    (!(yCoordinate < y1 || yCoordinate > y2) ||
      !(yCoordinate < y1 - coordinateNum || yCoordinate > y2 + coordinateNum));

  let yPos1 = y1 - coordinateNum + 10;

  // top
  let con3 =
    yCoordinate == yPos1 &&
    (!(
      xCoordinate < x1 - alternativeFontSize ||
      xCoordinate > x2 + alternativeFontSize
    ) ||
      !(xCoordinate < x1 - coordinateNum || xCoordinate > x2 + coordinateNum));

  // bottom
  let con4 =
    yCoordinate == y2 + coordinateNum &&
    (!(
      xCoordinate < x1 - alternativeFontSize ||
      xCoordinate > x2 + alternativeFontSize
    ) ||
      !(xCoordinate < x1 - coordinateNum || xCoordinate > x2 + coordinateNum));

  return con1 || con2 || con3 || con4;
}

// FIXME: entire function does not work
function returnAlternativeFadeCondition2(
  currentXCoordinate,
  currentYCoordinate,
  topXCoordinate,
  topYCoordinate,
  bottomXCoordinate,
  bottomYCoordinate,
  previousObj,
  followingObj
) {
  if (
    topXCoordinate == null ||
    topYCoordinate == null ||
    bottomXCoordinate == null ||
    bottomYCoordinate == null
  ) {
    console.log("null object");
    return false;
  }

  // get XYCoordinates
  // let currentXYCoordinatesArray = currentObj.XYCoordinates;
  // let previousXYCoordinatesArray = previousObj.XYCoordinates;
  // let followingXYCoordinatesArray = followingObj.XYCoordinates;

  // declare conditions
  let con1 = false;
  let con2 = false;
  let con3 = false;
  let con4 = false;

  let notOutsideBoxX = !(currentXCoordinate < x1 || currentXCoordinate > x2);
  let notOutsideBoxY = !(currentYCoordinate < y1 || currentYCoordinate > y2);

  // right
  // compare currentobject to previous Obj (mirrored screen)
  previousXYCoordinatesArray.forEach(function (prevXYObj) {
    if (currentXCoordinate == prevXYObj.xCoordinate && notOutsideBoxY) {
      console.log("con1 true");
      con1 = true;
    }
  });

  // left
  // compare currentobject to following Obj (mirrored screen)
  followingXYCoordinatesArray.forEach(function (followingXYObj) {
    if (currentXCoordinate == followingXYObj.xCoordinate && notOutsideBoxY) {
      console.log("con2 true");
      con2 = true;
    }
  });

  // top
  // compare currentobject to current Obj's previous letter coordinate (mirrored screen)
  if (
    currentXCoordinate == topXCoordinate &&
    currentYCoordinate == topYCoordinate &&
    notOutsideBoxX
  ) {
    console.log("con3 true");
    con3 = true;
  }
  // currentXYCoordinatesArray.forEach(function (currXYObj) {
  //   if (currentYCoordinate == currXYObj.yCoordinate) {
  //     con3 = true;
  //   }
  // });

  // bottom
  // compare to current obj following coordinate
  if (
    currentXCoordinate == bottomXCoordinate &&
    currentYCoordinate == bottomYCoordinate &&
    notOutsideBoxX
  ) {
    console.log("con4 true");
    con4 = true;
  }
  // currentXYCoordinatesArray.forEach(function (currXYObj) {
  //   if (currentYCoordinate == currXYObj.yCoordinate) {
  //     con4 = true;
  //   }
  // });

  // corners

  return con1 || con2 || con3 || con4;
}

/*
##################################################################################################
                                   _____                _   _             
     /\                           / ____|              | | (_)            
    /  \   _ __ _ __ __ _ _   _  | |     _ __ ___  __ _| |_ _  ___  _ __  
   / /\ \ | '__| '__/ _` | | | | | |    | '__/ _ \/ _` | __| |/ _ \| '_ \ 
  / ____ \| |  | | | (_| | |_| | | |____| | |  __/ (_| | |_| | (_) | | | |
 /_/    \_\_|  |_|  \__,_|\__, |  \_____|_|  \___|\__,_|\__|_|\___/|_| |_|
                           __/ |                                          
                          |___/                                                                                                                                                                                                                                                                                                           
##################################################################################################
*/

// declare array of words to hold
let words = new Array();

let xInput, yInput, xSpeedInput, ySpeedInput, newWord, newFontSize;

function createMatrixArray(directionMatrix) {
  // vertical
  // fill words array to number of columns
  if (directionMatrix === "south" || directionMatrix === "north") {
    for (let i = 0; i < columns; i++) {
      // matrixString xInput value
      xInput = fontSize * i;
      newWord = generateWord(generateWordSizeRand());
      newFontSize = generateFontSize();

      if (directionMatrix === "south") {
        yInput = generateYSouth(newWord, newFontSize);
        xSpeedInput = null;
        ySpeedInput = generateSpeed();
      } else if (directionMatrix === "north") {
        yInput = generateYNorth();
        xSpeedInput = null;
        ySpeedInput = -Math.abs(generateSpeed());
      }
      // create new MatrixString object for vertical
      words.push(
        new MatrixString(
          newWord,
          xInput,
          yInput,
          xSpeedInput,
          ySpeedInput,
          newFontSize
        )
      );
    }
    // horizontal
  } else if (directionMatrix === "east" || directionMatrix === "west") {
    for (let i = 0; i < rows; i++) {
      yInput = fontSize * i;
      newWord = generateWord(generateWordSizeRand());
      newFontSize = generateFontSize();
      if (directionMatrix === "east") {
        xInput = generateXEast(); // goal: negative / moving from left of the screen to right / need to generate this later
        xSpeedInput = generateSpeed(); // positive / updating position to the right
        ySpeedInput = null;
      } else if (directionMatrix === "west") {
        xInput = generateXWest(newWord, newFontSize); // goal: positive / moving from the right of the screen to the left
        xSpeedInput = -Math.abs(generateSpeed()); // negative / updating position to the left
        ySpeedInput = null;
      }
      // create new object for horizontal
      words.push(
        new MatrixString(
          newWord,
          xInput,
          yInput,
          xSpeedInput,
          ySpeedInput,
          newFontSize
        )
      );
    }
  }
}

/*###########################################################################################
  _____                      ____    ______                _   _             
 |  __ \                    / /\ \  |  ____|              | | (_)            
 | |  | |_ __ __ ___      _| |  | | | |__ _   _ _ __   ___| |_ _  ___  _ __  
 | |  | | '__/ _` \ \ /\ / / |  | | |  __| | | | '_ \ / __| __| |/ _ \| '_ \ 
 | |__| | | | (_| |\ V  V /| |  | | | |  | |_| | | | | (__| |_| | (_) | | | |
 |_____/|_|  \__,_| \_/\_/ | |  | | |_|   \__,_|_| |_|\___|\__|_|\___/|_| |_|
                            \_\/_/                                           
                                                                                                                                 
############################################################################################# 

*/
// variables for draw() method
let destinationPoint;
let yDirection; // direction of y points (north and south)
let xDirection; // direction of x points (west and east)
let fromHorizontalDirection; // boolean value for setting horizontal  direction
let fromVerticalDirection; // boolean value for setting vertical direction

// draw direction going south
// show the characters in animation.
function draw() {
  if (discoOn) discoFrameCounter++;

  // draw black background with 0.025 opacity to show the trail
  ctx.font = fontSize + "px 'Consolas', 'Lucida Console'";
  drawOpaqueRect();

  // draw strings
  for (let i = 0; i < words.length; i++) {
    changeWordCheck(words[i], words[i].word.length);

    if (direction === "south") {
      destinationPoint = height; // destination point: below the screen
    } else if (direction === "north") {
      destinationPoint = 0;
    }

    if (direction === "south") {
      // reset to top of screen if drop off the canvas at bottom of the screen
      if (words[i].y > height) {
        words[i].ySpeed = generateSpeed(); // new speed
        words[i].word = generateWord(generateWordSizeRand()); // generate new random word with random size
        words[i].fontSize = generateFontSize(); // new font size
        words[i].y = generateYSouth(words[i].word, words[i].fontSize);
      } else {
        words[i].y = words[i].y + fontSize + words[i].ySpeed;
        ctx.font = words[i].fontSize + "px 'Consolas', 'Lucida Console'";
      }
    } else if (direction === "north") {
      // reset to bottom of screen if move off top of the screen
      if (words[i].y < 0 - height * 1.5) {
        words[i].y = generateYNorth();
        words[i].ySpeed = -Math.abs(generateSpeed()); // new speed
        words[i].word = generateWord(generateWordSizeRand()); // generate new random word with random size
        words[i].fontSize = generateFontSize(); // new font size
      } else {
        words[i].y = words[i].y - fontSize - words[i].ySpeed;
        ctx.font = words[i].fontSize + "px 'Consolas', 'Lucida Console'";
      }
    } else if (direction === "east") {
      if (words[i].x < 0 - canvas.width) {
        words[i].x = generateXEast();
        words[i].xSpeed = generateSpeed(); // new speed
        words[i].word = generateWord(generateWordSizeRand()); // generate new random word with random size
        words[i].fontSize = generateFontSize(); // new font size
      } else {
        words[i].x = words[i].x - fontSize - words[i].xSpeed;
        ctx.font = words[i].fontSize + "px 'Consolas', 'Lucida Console'";
      }
    } else if (direction === "west") {
      if (words[i].x > canvas.width) {
        words[i].xSpeed = -Math.abs(generateSpeed()); // new speed
        words[i].word = generateWord(generateWordSizeRand()); // generate new random word with random size
        words[i].fontSize = generateFontSize(); // new font size
        words[i].x = generateXWest(words[i].word, words[i].fontSize); // new x placement
      } else {
        words[i].x = words[i].x + fontSize + words[i].xSpeed;
        ctx.font = words[i].fontSize + "px 'Consolas', 'Lucida Console'";
      }
    }
    // call display method and draw string
    let millisecondsToWait = words[i].ySpeed * 100;
    // code for vertical movement methods
    if (direction === "north" || direction === "south") {
      if (discoOn) {
        setTimeout(words[i].showDiscoVertical(), millisecondsToWait);
      } else {
        setTimeout(
          words[i].showVertical(colorChoiceArray[chosenColor]),
          millisecondsToWait
        );
      }
      // code for horizontal movement methods
    } else if (direction === "east" || direction === "west") {
      if (discoOn) {
        setTimeout(words[i].showDiscoHorizontal(), millisecondsToWait);
      } else {
        setTimeout(
          words[i].showHorizontal(colorChoiceArray[chosenColor]),
          millisecondsToWait
        );
      }
    }
  }
}

function changeWordCheck(inputWordObject, inputSize) {
  inputWordObject.wordChangeCounter++;
  let changeOverCondition =
    inputWordObject.wordChangeCounter >
    inputWordObject.wordChangeCounterTurnoverPoint;

  if (changeOverCondition) {
    let replacementWord = generateWord(inputSize);
    inputWordObject.word = replacementWord;
    inputWordObject.wordChangeCounter = 0;
    inputWordObject.wordChangeCounterTurnoverPoint = generateWordChangeTurnoverNumber();
  }
}

function drawOpaqueRect() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.fillRect(0, 0, width, height);
}

function drawSolidRect() {
  ctx.fillStyle = "rgba(0, 0, 0, 1)";
  ctx.fillRect(0, 0, width, height);
}

/**###########################################################################################
 * 

           _ _                        _   _             _____                      ____  
     /\   | | |                      | | (_)           |  __ \                    / /\ \ 
    /  \  | | |_ ___ _ __ _ __   __ _| |_ ___   _____  | |  | |_ __ __ ___      _| |  | |
   / /\ \ | | __/ _ \ '__| '_ \ / _` | __| \ \ / / _ \ | |  | | '__/ _` \ \ /\ / / |  | |
  / ____ \| | ||  __/ |  | | | | (_| | |_| |\ V /  __/ | |__| | | | (_| |\ V  V /| |  | |
 /_/    \_\_|\__\___|_|  |_| |_|\__,_|\__|_| \_/ \___| |_____/|_|  \__,_| \_/\_/ | |  | |
                                                                                  \_\/_/ 
                                                                                         

 ###########################################################################################
 */

const whiteColorArray = [colorWhite, colorWhite, colorWhite];
let alternativeFontSize = 20;

let newWordSize;

function drawAlternative() {
  if (discoOn) discoFrameCounter++;

  squareCounter++;

  drawOpaqueRect();
  ctx.fillStyle = colorWhite;

  ctx.font = alternativeFontSize + "px Arial";
  // ctx.font = fontSize + "px 'Consolas', 'Lucida Console'";

  // no direction input, very important
  // alternative method: input "south" as direction and empty array after forEach loop
  createMatrixArray();

  if (squareCounter > 50) {
    randomSquareCoordinates = returnRandomSquareCoordinates();
    squareCounter = 0;
  }

  if (rapidSquareOn) generateRandomSquarePositions();

  newWordSize = getNewWordSize();

  words.forEach(function (arrayItem) {
    arrayItem.fontSize = alternativeFontSize;

    // true
    // true
    if (hangingWords && rapidWordChange) {
      arrayItem.word = generateWord(arrayItem.word.length);
    }

    // true
    // false
    else if (hangingWords && !rapidWordChange) {
      changeWordCheck(arrayItem, arrayItem.word.length);
    }

    // false
    // true
    else if (!hangingWords && rapidWordChange) {
      arrayItem.word = generateWord(newWordSize);
    }

    // false
    // false
    else if (!hangingWords && !rapidWordChange) {
      changeWordCheck(arrayItem, newWordSize);
    }

    arrayItem.showAlternative(colorChoiceArray[chosenColor]);
  });
}

function isReallyTallScreen() {
  return canvas.height > 2000;
}

function isSmallFontSize() {
  return alternativeFontSize < 14;
}

function isBigFontSize() {
  return alternativeFontSize > 40;
}

function getNewWordSize() {
  let output = 80;

  if (isReallyTallScreen() || isSmallFontSize())
    output = doubleInt(output) * 1.5;

  if (isBigFontSize()) output = output / 2;

  return output;
}

function giveEachWordNewWord() {
  words.forEach(function (arrayWord) {
    if (hangingWords) {
      let hangingWordSize = generateWordSizeRandHanging();

      if (isScreenSmall()) hangingWordSize = Math.round(hangingWordSize * 0.6);

      arrayWord.word = generateWord(hangingWordSize);
    } else arrayWord.word = generateWord(newWordSize);

    arrayWord.XYCoordinates = arrayWord.generateXYCoordinates();
  });
}

function isScreenSmall() {
  return window.innerHeight < 1000;
}

function resetAllWordsYPositionTo0() {
  words.forEach(function (arrayItem) {
    arrayItem.y = 0;
  });
}

/**
 * 
  ###########################################################################################
  

   _____                              __  __                                     _       
  / ____|                            |  \/  |                                   | |      
 | (___   __ _ _   _  __ _ _ __ ___  | \  / | _____   _____ _ __ ___   ___ _ __ | |_ ___ 
  \___ \ / _` | | | |/ _` | '__/ _ \ | |\/| |/ _ \ \ / / _ \ '_ ` _ \ / _ \ '_ \| __/ __|
  ____) | (_| | |_| | (_| | | |  __/ | |  | | (_) \ V /  __/ | | | | |  __/ | | | |_\__ \
 |_____/ \__, |\__,_|\__,_|_|  \___| |_|  |_|\___/ \_/ \___|_| |_| |_|\___|_| |_|\__|___/
            | |                                                                          
            |_|                                                                          

  ###########################################################################################
  
 */

// TODO: not being used, can be deleted
function returnRandomSquareCoordinates() {
  let num = Math.floor(generateRandomNumber(0, 4));
  switch (num) {
    case 0:
      return [250, 500, 250, 500];
    case 1:
      return [500, 750, 500, 750];
    case 2:
      return [750, 1000, 750, 1000];
    case 3:
      return [1000, 1250, 1000, 1250];
  }
}

let squareCounter = 0;
let randomSquareCoordinates = returnRandomSquareCoordinates();

let squareAnimationOn;
let x1 = 250;
let x2 = 500;
let y1 = 250;
let y2 = 500;
const SQUARE_SIZE = 250;

let topEdge = 0 + alternativeFontSize * 3;
let rightEdge = 0 + alternativeFontSize * 3;
let bottomEdge;
let leftEdge;

let topEdgeDisco = 0 + alternativeFontSize;
let rightEdgeDisco = 0 + alternativeFontSize;
let bottomEdgeDisco;
let leftEdgeDisco;

function moveSquareLeft(forceMove) {
  let inputLeftEdge = leftEdge;

  if (discoForceMoveCheck(forceMove)) inputLeftEdge = leftEdgeDisco;

  if (x2 < inputLeftEdge) {
    x1 = x1 + alternativeFontSize;
    x2 = x2 + alternativeFontSize;
  }
}

function moveSquareUp(forceMove) {
  let inputTopEdge = topEdge;

  if (discoForceMoveCheck(forceMove)) inputTopEdge = topEdgeDisco;

  if (y1 > inputTopEdge) {
    y1 = y1 - alternativeFontSize;
    y2 = y2 - alternativeFontSize;
  }
}

function moveSquareRight(forceMove) {
  let inputRightEdge = rightEdge;

  if (discoForceMoveCheck(forceMove)) inputRightEdge = rightEdgeDisco;

  if (x1 > inputRightEdge) {
    x1 = x1 - alternativeFontSize;
    x2 = x2 - alternativeFontSize;
  }
}

function moveSquareDown(forceMove) {
  let inputBottomEdge = bottomEdge;

  if (discoForceMoveCheck(forceMove)) inputBottomEdge = bottomEdgeDisco;

  if (y2 < inputBottomEdge) {
    y1 = y1 + alternativeFontSize;
    y2 = y2 + alternativeFontSize;
  }
}

function discoForceMoveCheck(forceMove) {
  return discoOn || forceMove;
}

function forceSquare(inputNum) {
  for (let i = 0; i < 2; i++) {
    switch (inputNum) {
      case 0:
        moveSquareLeft(true);
        break;
      case 1:
        moveSquareRight(true);
        break;
      case 2:
        moveSquareDown(true);
        break;
      case 3:
        moveSquareUp(true);
        break;
      case 4:
        moveSquareLeft(true);
        moveSquareDown(true);
        break;
      case 5:
        moveSquareRight(true);
        moveSquareDown(true);
        break;
      case 6:
        moveSquareUp(true);
        moveSquareLeft(true);
        break;
      case 7:
        moveSquareUp(true);
        moveSquareRight(true);
        break;
    }
  }
}

function repositionSquareToNormal() {
  // check corners first:
  if (returnTopRightCollision()) {
    forceSquare(4);
  } else if (returnTopLeftCollision()) {
    forceSquare(5);
  } else if (returnBottomRightCollision()) {
    forceSquare(6);
  } else if (returnBottomLeftCollision()) {
    forceSquare(7);
  } else if (returnRightCollision()) {
    forceSquare(0);
  } else if (returnLeftCollision()) {
    forceSquare(1);
  } else if (returnTopCollision()) {
    forceSquare(2);
  } else if (returnBottomCollision()) {
    forceSquare(3);
  }
}
function returnRightCollision() {
  return x1 < rightEdge;
}

function returnLeftCollision() {
  return x2 > leftEdge;
}

function returnTopCollision() {
  return y1 < topEdge;
}

function returnBottomCollision() {
  return y2 > bottomEdge;
}

function returnTopLeftCollision() {
  return returnTopCollision() && returnLeftCollision();
}

function returnTopRightCollision() {
  return returnTopCollision() && returnRightCollision();
}

function returnBottomLeftCollision() {
  return returnBottomCollision() && returnLeftCollision();
}

function returnBottomRightCollision() {
  return returnBottomCollision() && returnRightCollision();
}

// for debugging
function printSquarePositionInfo() {
  console.log("---");
  console.log("x1: " + x1);
  console.log("rightEdge: " + rightEdge);
  console.log("---");
  console.log("x2: " + x2);
  console.log("leftEdge: " + leftEdge);
  console.log("---");
  console.log("y1: " + y1);
  console.log("topEdge: " + topEdge);
  console.log("---");
  console.log("y2: " + y2);
  console.log("bottomEdge: " + bottomEdge);
  console.log("---");
}

function resetSquarePosition() {
  x1 = 250;
  x2 = 500;
  y1 = 250;
  y2 = 500;
}

function generateRandomSquarePositions() {
  x1 = generateRandomNumber(0, canvas.width - SQUARE_SIZE);

  x2 = x1 + 250;

  y1 = generateRandomNumber(0, canvas.height - SQUARE_SIZE);

  y2 = y1 + 250;
}

/*###########################################################################################
  __  __                     _____           _   _             
 |  \/  |                   / ____|         | | (_)            
 | \  / | ___ _ __  _   _  | (___   ___  ___| |_ _  ___  _ __  
 | |\/| |/ _ \ '_ \| | | |  \___ \ / _ \/ __| __| |/ _ \| '_ \ 
 | |  | |  __/ | | | |_| |  ____) |  __/ (__| |_| | (_) | | | |
 |_|  |_|\___|_| |_|\__,_| |_____/ \___|\___|\__|_|\___/|_| |_|
                                                               
############################################################################################# */

/*
  COLOR ARRAY PLACEMENT TO PASS AS PARAMETER AS FOLLOWS:
  0 for green
  1 for red
  2 for yellow
  3 for blue
  4 for orange
  5 for pink
  6 for cyan
  7 for random
*/

let direction = null;
let discoOn = null;
let chosenColor = null;

function matchColorToIndex(input) {
  switch (input) {
    case "green":
      return 0;
    case "red":
      return 1;
    case "yellow":
      return 2;
    case "blue":
      return 3;
    case "orange":
      return 4;
    case "pink":
      return 5;
    case "cyan":
      return 6;
    case "random":
      return 7;
    default:
      return null;
  }
}

// reset values to null so the program can be ran again
function reset() {
  words = [];
  direction = null;
  discoOn = null;
  chosenColor = null;
  resetRandomColor();
  discoFrameCounter = 0;
  intervalSpeed = DEFAULT_SPEED;
  currentSpeedLevel = speedLevels[middle];
  iCounter = 0;
  defaultFontSize = 20;
  resetStringSizes();
  alternativeFontSize = 20;
  frameCountFunctionOnChange();
}

function resetRandomColor() {
  randomColorArray = generateRandomColorArray();
  colorChoiceArray[7] = randomColorArray;
  updateRandomColorForTheMenu();
}

/*######################################################################################################
   _____      _ _   ______                _   _                 
  / ____|    | | | |  ____|              | | (_)                
 | |     __ _| | | | |__ _   _ _ __   ___| |_ _  ___  _ __  ___ 
 | |    / _` | | | |  __| | | | '_ \ / __| __| |/ _ \| '_ \/ __|
 | |___| (_| | | | | |  | |_| | | | | (__| |_| | (_) | | | \__ \
  \_____\__,_|_|_| |_|   \__,_|_| |_|\___|\__|_|\___/|_| |_|___/

########################################################################################################
*/

let intervalValid, animationOn;
let savedDirection = direction;
let rapidSquareOn;

const DEFAULT_SPEED = 50;
const amountOfSpeedLevels = 7;
let intervalSpeed = DEFAULT_SPEED;
let speedLevels = Array.from(Array(amountOfSpeedLevels).keys());
let middle = speedLevels[Math.round((speedLevels.length - 1) / 2)];
let currentSpeedLevel = speedLevels[middle];

let rapidWordChange = false;
let hangingWords = true;

document.addEventListener("keydown", function (event) {
  iCounter = 0;

  switch (event.key) {
    case "Escape":
      resetToMenu();
      break;
    case "ArrowLeft":
      if (!squareAnimationOn) {
        arrowDirectionControl("west", "east");
      } else {
        moveSquareLeft(false);
      }
      break;
    case "ArrowUp":
      if (!squareAnimationOn) {
        arrowDirectionControl("north", "south");
      } else {
        moveSquareUp(false);
      }
      break;
    case "ArrowRight":
      if (!squareAnimationOn) {
        arrowDirectionControl("east", "west");
      } else {
        moveSquareRight(false);
      }
      break;
    case "ArrowDown":
      if (!squareAnimationOn) {
        arrowDirectionControl("south", "north");
      } else {
        moveSquareDown(false);
      }
      break;
    case " ":
      if (ctx != null) {
        pause();
      }
      break;
    case "c":
      clearScreen();
      break;
    case "d":
      discoControl();
      break;
    case "PageUp":
      if (ctx != null && !squareAnimationOn) {
        speedController(true);
      }
      break;
    case "PageDown":
      if (ctx != null && !squareAnimationOn) {
        speedController(false);
      }
      break;
    case "1":
      numkeyFunction("green");
      break;
    case "2":
      numkeyFunction("red");
      break;
    case "3":
      numkeyFunction("yellow");
      break;
    case "4":
      numkeyFunction("blue");
      break;
    case "5":
      numkeyFunction("orange");
      break;
    case "6":
      numkeyFunction("pink");
      break;
    case "7":
      numkeyFunction("cyan");
      break;
    case "8":
      resetRandomColor();
      numkeyFunction("random");
      break;
    case "w":
      controlFontSize(true);
      break;
    case "s":
      controlFontSize(false);
      break;
    case "q":
      controlStringSize(true);
      break;
    case "a":
      controlStringSize(false);
      break;
    case "t":
      discoIntervalSpeedControl(true);
      break;
    case "g":
      discoIntervalSpeedControl(false);
      break;
    case "r":
      rapidWordChangeControl();
      break;
    case "h":
      if (squareAnimationOn) {
        hangingWordsControl();
      }
      break;
    case "m":
      if (ctx != undefined) switchMode();
      break;
    case "u":
      rapidSquareControl();
      break;
  }
});

// on mouse click
document.getElementById("myCanvas").addEventListener("click", resetToMenu);

function resetToMenu() {
  clearInterval(intervalValid); // stop draw from running in interval
  clearInterval(menuInterval); // stop menu disco animation if running
  ctx.fillStyle = colorBlack;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height); // set background to black
  showMenu();
  reset(); // reset variables and array to create
}

function arrowDirectionControl(newDirection, oppositeDirection) {
  if (direction != newDirection) {
    if (direction === oppositeDirection) direction = newDirection;
    else {
      direction = newDirection;
      resetWordsArray();
    }
  }
}

function clearScreen() {
  for (let i = 0; i < words.length; i++) {
    switch (direction) {
      // if south
      case "south":
        words[i].y = generateYSouth(words[i].word, words[i].fontSize);
        break;

      // if north
      case "north":
        words[i].y = generateYNorth();
        break;

      // if east
      case "east":
        words[i].x = generateXEast();
        break;

      // if west
      case "west":
        words[i].x = generateXWest(words[i].word, words[i].fontSize);
        break;
    }
  }
}

function pause() {
  if (animationOn) {
    clearInterval(intervalValid);
    animationOn = false;
  } else {
    intervalValid = setInterval(draw, intervalSpeed);
    animationOn = true;
  }
}

function discoControl() {
  if (isMenuHidden()) toggleDisco();
  else toggleDiscoMenu();
}

function toggleDisco() {
  if (discoOn) {
    discoOn = false;
    checkBox.checked = false;
    if (squareAnimationOn) {
      repositionSquareToNormal();
    }
  } else {
    discoOn = true;
    checkBox.checked = true;
  }
}

function toggleDiscoMenu() {
  if (checkBox.checked == true) {
    checkBox.checked = false;
  } else {
    checkBox.checked = true;
  }

  checkboxFunction();
}

function speedController(increase) {
  // check if current speed level is at 0 or 7
  if (currentSpeedLevel === speedLevels[0] && !increase) return;
  if (currentSpeedLevel === speedLevels[speedLevels.length - 1] && increase)
    return;

  // increase or decrease speed level
  if (increase) {
    currentSpeedLevel++;
  } else if (!increase) {
    currentSpeedLevel--;
  }

  // clear the interval
  clearInterval(intervalValid);

  // increase or decrease interval speed
  if (increase) {
    intervalSpeed = getIncreasedIntervalSpeed(intervalSpeed);
  } else if (!increase) {
    intervalSpeed = getDecreasedIntervalSpeed(intervalSpeed);
  }

  // restart the interval
  intervalValid = setInterval(draw, intervalSpeed);
}

function getIncreasedIntervalSpeed(input) {
  return input / 2;
}

function getDecreasedIntervalSpeed(input) {
  return input * 2;
}

function numkeyFunction(input) {
  updateSelectBox(input);
  switchColor(input);
}

function switchColor(input) {
  chosenColor = matchColorToIndex(input.toLowerCase());
}

function controlFontSize(increase) {
  // disables ability to adjust font size in square animation mode
  if (squareAnimationOn) return;

  if (increase & (defaultFontSize < 65)) {
    defaultFontSize++;
    alternativeFontSize++;
  } else if (!increase & (defaultFontSize > 1)) {
    defaultFontSize--;
    if (alternativeFontSize > 12) {
      alternativeFontSize--;
    }
  } else return;

  fontSize = defaultFontSize;

  for (let i = 0; i < words.length; i++) {
    let x = words[i].fontSize;
    if (increase) {
      x++;
    } else {
      x--;
    }
    words[i].fontSize = x;
  }

  if (squareAnimationOn) resetWordsArray();
}

function printFontSizeDebugInfo() {
  console.log("defaultFontSize: " + defaultFontSize);

  console.log("fontSize: " + fontSize);
}

function controlStringSize(increase) {
  if (increase & (stringSizeMax < 150)) {
    stringSizeMin++;
    stringSizeMax++;

    // increase the length of each word in array.
    for (let i = 0; i < words.length; i++) {
      let randomChar = getRandomChar();
      words[i].word = words[i].word.concat(randomChar);
    }
  } else if (!increase & (stringSizeMin > 1)) {
    stringSizeMin--;
    stringSizeMax--;

    // decrease the length of each word in array.
    for (let i = 0; i < words.length; i++) {
      words[i].word = words[i].word.slice(0, -1);
    }
  } else return;
}

function printStringSizeDebugInfo() {
  console.log("stringSizeMin: " + stringSizeMin);
  console.log("stringSizeMax: " + stringSizeMax);
}

const DISCO_FRAME_COUNTER_DEFAULT_MAX = 100;
const DISCO_FRAME_COUNTER_DEFAULT_MIN = 1;

function discoIntervalSpeedControl(increase) {
  if (discoOn) {
    let canIncrease =
      increase &&
      discoFrameCounterTurnoverPoint < DISCO_FRAME_COUNTER_DEFAULT_MAX;
    let canDecrease =
      !increase &&
      discoFrameCounterTurnoverPoint > DISCO_FRAME_COUNTER_DEFAULT_MIN;

    if (canIncrease) discoFrameCounterTurnoverPoint++;
    else if (canDecrease) discoFrameCounterTurnoverPoint--;
  }
}

function rapidWordChangeControl() {
  if (rapidWordChange) rapidWordChange = false;
  else rapidWordChange = true;
}

function hangingWordsControl() {
  if (hangingWords) {
    hangingWords = false;
    giveEachWordNewWord();
  } else {
    hangingWords = true;
    giveEachWordNewWord();
  }
}

function switchMode() {
  let original;
  if (squareAnimationOn) original = true;
  else original = false;

  resetToMenu();

  run(original);
}

function rapidSquareControl() {
  if (rapidSquareOn) rapidSquareOn = false;
  else rapidSquareOn = true;
  console.log(rapidSquareOn);
}

window.addEventListener("resize", resetWordsArray);

function resetWordsArray() {
  clearScreen();

  words = [];

  canvasSetup();

  createMatrixArray(direction);

  if (squareAnimationOn) {
    words.shift();
    repositionSquareToNormal();
    if (hangingWords) hangingWordsSetup();
  }
}

function hangingWordsSetup() {
  giveEachWordNewWord();
  resetAllWordsYPositionTo0();
}

// get menu information
function loadMenuOptions() {
  // disco
  discoOn = document.getElementById("disco").checked;

  let userColor = document.getElementById("colors").value;

  // color
  chosenColor = matchColorToIndex(userColor.toLowerCase());

  // direction
  direction = document.getElementById("directions").value;

  createMatrixArray(direction);
}

// this function gets executed upon clicking the start button
function run(original) {
  // set up canvas
  canvasSetup();

  // read html values
  loadMenuOptions();

  // hide the main html menu
  hideMenu();

  squareAnimationOn = !original;

  if (squareAnimationOn) {
    newWordSize = getNewWordSize();
    words.shift();
    giveEachWordNewWord();
    resetAllWordsYPositionTo0();
  }

  // run the animation
  intervalValid = setInterval(function () {
    if (original) {
      draw();
    } else {
      drawAlternative();
    }
  }, intervalSpeed);
  animationOn = true;
}

/* ***********************************************************************
// 

  _    _ _______ __  __ _        ______ ____  _____  __  __       _______ _______ _____ _   _  _____ 
 | |  | |__   __|  \/  | |      |  ____/ __ \|  __ \|  \/  |   /\|__   __|__   __|_   _| \ | |/ ____|
 | |__| |  | |  | \  / | |      | |__ | |  | | |__) | \  / |  /  \  | |     | |    | | |  \| | |  __ 
 |  __  |  | |  | |\/| | |      |  __|| |  | |  _  /| |\/| | / /\ \ | |     | |    | | | . ` | | |_ |
 | |  | |  | |  | |  | | |____  | |   | |__| | | \ \| |  | |/ ____ \| |     | |   _| |_| |\  | |__| |
 |_|  |_|  |_|  |_|  |_|______| |_|    \____/|_|  \_\_|  |_/_/    \_\_|     |_|  |_____|_| \_|\_____|

// ***********************************************************************
*/

// list of html elements here
const checkBox = document.getElementById("disco");
const text = document.getElementById("colorsLabel");
const select = document.getElementById("colors");
const directionsSelect = document.getElementById("directions");
const menuDivs = document.getElementsByClassName("menu");
const button = document.getElementById("button");
const button2 = document.getElementById("button2");
const buttons = document.getElementsByClassName("button");
const elems = document.body.getElementsByTagName("*");
const frameCountElems = document.getElementsByClassName("frameCount");

let menuInterval;
let selectColor;

// show and hide menu
function showMenu() {
  for (let i = 0; i < menuDivs.length; i++) {
    menuDivs[i].style.display = "block";
  }

  menuOnLoad();

  // canvas functionality
  if ((canvas = document.getElementById("canvas") != null)) {
    canvas.style.display = "none";
  }
}

function hideMenu() {
  for (let i = 0; i < menuDivs.length; i++) {
    menuDivs[i].style.display = "none";
  }

  canvas.style.display = "block";

  clearInterval(menuInterval);
}

function isMenuHidden() {
  let output = false;
  for (let i = 0; i < menuDivs.length; i++) {
    if (menuDivs[i].style.display === "none") {
      output = true;
    }
  }
  return output;
}

// for checkbox hiding
function checkboxFunction() {
  // hide color selectbox
  // show disco frame input

  if (!checkBox.checked) {
    text.style.display = "inline-block";
    select.style.display = "inline-block";

    // hide frameCountElems
    frameCountElemsVisibilityFunction();

    recolorMenuOneColor(selectColor);

    buttonBackgroundBlack();

    clearInterval(menuInterval);
  } else {
    text.style.display = "none";
    select.style.display = "none";

    // show frameCountElems
    frameCountElemsVisibilityFunction();

    discoIntervalFunction();

    menuInterval = setInterval(discoIntervalFunction, 1000);
  }
}

function discoIntervalFunction() {
  recolorMenuRandom();
  buttonDiscoBackgroundChangeColor();
}

function frameCountElemsVisibilityFunction() {
  for (let i = 0; i < frameCountElems.length; i++) {
    if (checkBox.checked) {
      frameCountElems[i].style.display = "inline-block";
    } else {
      frameCountElems[i].style.display = "none";
    }
  }
}

// for selectbox coloring
function selectFunction() {
  let userColor = select.value;
  selectColor = matchColorToRGB(userColor.toLowerCase());

  if (!checkBox.checked) {
    recolorMenuOneColor(selectColor);
    button.style.border = "1px solid " + selectColor;
  }

  // Store
  localStorage.setItem("key", selectColor);
}

// dropdown menu
// FIXME: consider doing something when hovering over selectbox dropdown menu, do it this way:
// https://stackoverflow.com/questions/31910038/do-something-when-mouse-hovers-over-each-select-option-in-the-list-javascript
// below method only works when hovering over the main opton, will have to create own select option
// if you want to have a dropdown recolor itself
document
  .getElementById("directions")
  .addEventListener("mouseover", function () {
    // do nothing
  });

// call selectionFunction on page loading

let borderPrefix = "1px solid ";

function recolorMenuOneColor(inputColor) {
  for (let i = 0; i < elems.length; i++) {
    elems[i].style.color = inputColor;
  }

  // button border color
  buttonBorderColorSelectedColor();

  // for border select boxes
  select.style.border = borderPrefix + inputColor;
  directionsSelect.style.border = borderPrefix + inputColor;
  directionsSelect.style.backgroundColor = colorBlack;

  selectBackgroundColorFunction();
}

function recolorMenuRandom() {
  for (let i = 0; i < elems.length; i++) {
    elems[i].style.color = getRandomColor();
  }

  // button border color
  buttonBorderColorRandom();

  // for directions select boxes
  directionsSelect.style.border = borderPrefix + getRandomColor();
  directionsSelect.style.backgroundColor = getRandomColor();
  discoFrameElement.style.backgroundColor = getRandomColor();

  selectBackgroundColorFunction();
}

function selectBackgroundColorFunction() {
  Array.from(directionsSelect.options).forEach(function (optionElement) {
    if (checkBox.checked) {
      optionElement.style.backgroundColor = getRandomColor();
    } else {
      optionElement.style.backgroundColor = colorBlack;
    }
  });
}

selectBackgroundColorFunction();

function menuOnLoad() {
  // Retrieve
  selectColor = localStorage.getItem("key");

  checkboxFunction();

  selectFunction();
}

function matchColorToRGB(entryColor) {
  switch (entryColor) {
    case "green":
      return colorMatrixGreen;
    case "red":
      return colorRed;
    case "yellow":
      return colorYellow;
    case "blue":
      return colorBlue;
    case "orange":
      return colorOrange;
    case "pink":
      return colorPink;
    case "cyan":
      return colorCyan;
    case "random":
      return randomColorArray[2];
    default:
      return null;
  }
}

// hover over button color change
button.addEventListener("mouseover", function () {
  buttonMouseOver(1);
});

button.addEventListener("mouseout", function () {
  buttonMouseOut(1);
});

button2.addEventListener("mouseover", function () {
  buttonMouseOver(2);
});

button2.addEventListener("mouseout", function () {
  buttonMouseOut(2);
});

function buttonMouseOver(input) {
  if (buttonDiscoChecked()) {
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].style.color = getRandomColor();
    }
    buttonDiscoBackgroundChangeColor();
    buttonBorderColorRandom();
  } else {
    if (input == 1) {
      button.style.color = colorBlack;
      button.style.background = selectColor;
    } else if (input == 2) {
      button2.style.color = colorBlack;
      button2.style.background = selectColor;
    }
  }
}

function buttonMouseOut(input) {
  if (buttonDiscoChecked()) {
    button.style.color = getRandomColor();
    buttonDiscoBackgroundChangeColor();
    buttonBorderColorRandom();
  } else {
    if (input === 1) {
      button.style.color = selectColor;
      button.style.background = colorBlack;
    } else if (input === 2) {
      button2.style.background = colorBlack;
      button2.style.color = selectColor;
    }
  }
}

function buttonDiscoChecked() {
  return document.getElementById("disco").checked;
}

function buttonBackgroundBlack() {
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].style.background = colorBlack;
  }
}

function buttonDiscoBackgroundChangeColor() {
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].style.background = getRandomColor();
  }
}

function buttonBorderColorRandom() {
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].style.border = borderPrefix + getRandomColor();
  }
}

function buttonBorderColorSelectedColor() {
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].style.border = borderPrefix + selectColor;
  }
}

function updateRandomColorForTheMenu() {
  selectColor = randomColorArray[2];
  selectFunction();
}

function frameCountFunctionOnChange() {
  let currentDiscoFrameMax = discoFrameElement.value;
  localStorage.setItem("frameCountKey", currentDiscoFrameMax);
  discoFrameCounterTurnoverPoint = currentDiscoFrameMax;
}

function frameCountFunctionOnLoad() {
  discoFrameElement.value = localStorage.getItem("frameCountKey");
}

function updateSelectBox(input) {
  select.value = input;
  selectFunction();
}

function directionFunction() {}
