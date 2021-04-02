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
  let result = Math.random() < 0.01;
  return result;
}

function twentyfivePercentChance() {
  let result = Math.random() < 0.25;
  return result;
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
  show(inputColorArray) {
    // for changing the string to a different string with the same size every frame
    if (rapidWordChange) this.word = generateWord(this.word.length);

    if (discoOn) discoColorCounterCheck();

    for (let i = 0; i < this.word.length - 1; i++) {
      let letter = this.word.substring(i, i + 1);
      const xCoordinate = this.getXCoordinateFromDirection(i, false);
      const yCoordinate = this.getYCoordinateFromDirection(i, false);

      if (onePercentChance() && !rapidWordChange) letter = getRandomChar();

      if (!discoOn) this.setColors(i, inputColorArray);

      ctx.fillText(letter, xCoordinate, yCoordinate);

      this.XYCoordinates = this.generateXYCoordinates();
    }
  }

  showAlternative(inputColorArray) {
    if (rapidWordChange) this.word = generateWord(this.word.length);

    for (let i = 0; i < this.word.length; i++) {
      let letter = this.word.substring(i, i + 1);

      let xCoordinate = this.getXCoordinateFromDirection(i, true);
      let yCoordinate = this.getYCoordinateFromDirection(i, true);

      if (onePercentChance() && !rapidWordChange && i != 0)
        letter = getRandomChar();

      if (i == 0) letter = " ";

      this.drawSquare(xCoordinate, yCoordinate, inputColorArray);

      ctx.fillText(letter, xCoordinate, yCoordinate);

      this.XYCoordinates = this.generateXYCoordinates();
    }
  }

  drawSquare(xCoordinate, yCoordinate, inputColorArray) {
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
  }

  setColors(i, inputColorArray) {
    if (direction == "south" || direction == "west") {
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
    } else if (direction == "north" || direction == "east") {
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
    }
  }

  getYCoordinateFromDirection(i, alternative) {
    let defaultYCoordinate = this.y + i * this.fontSize;
    switch (direction) {
      case "south":
        return defaultYCoordinate;
      case "north":
        if (!alternative) return defaultYCoordinate;
        return this.y - i * this.fontSize;
      case "east":
        return this.y;
      case "west":
        return this.y;
    }
  }

  getXCoordinateFromDirection(i, alternative) {
    let defaultXCoordinate = this.x + i * this.fontSize;
    switch (direction) {
      case "south":
        return this.x;
      case "north":
        return this.x;
      case "east":
        return defaultXCoordinate;
      case "west":
        if (!alternative) return defaultXCoordinate;
        return this.x - i * this.fontSize;
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

  increaseStringSize() {
    this.word = this.word.concat(getRandomChar());
  }

  decreaseStringSize() {
    this.word = this.word.slice(0, -1);
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
  let rightCon =
    xCoordinate == xPos1 &&
    (!(yCoordinate < y1 || yCoordinate > y2) ||
      !(yCoordinate < y1 - coordinateNum || yCoordinate > y2 + coordinateNum));

  // left
  let leftCon =
    xCoordinate == x2 + coordinateNum &&
    (!(yCoordinate < y1 || yCoordinate > y2) ||
      !(yCoordinate < y1 - coordinateNum || yCoordinate > y2 + coordinateNum));

  // ###
  // Top & Bottom
  // ###
  let yPos1 = y1 - coordinateNum + alteredNum;

  let yCon3 = !(
    xCoordinate < x1 - coordinateNum || xCoordinate > x2 + coordinateNum
  );

  // top
  let topCon1 = yCoordinate == yPos1;
  let topCon2 = !(
    xCoordinate < x1 - alternativeFontSize ||
    xCoordinate > x2 + alternativeFontSize
  );

  if (direction === "north") {
    topCon1 = yCoordinate - 6 == yPos1;
  }

  let topCon = topCon1 && (topCon2 || yCon3);

  // bottom
  let bottomCon1 = yCoordinate == y2 + coordinateNum;
  let bottomCon2 = !(
    xCoordinate < x1 - alternativeFontSize ||
    xCoordinate > x2 + alternativeFontSize
  );

  if (direction === "north") {
    bottomCon1 = yCoordinate + 14 == y2 + coordinateNum;
  }

  let bottomCon = bottomCon1 && (bottomCon2 || yCon3);

  printTopBottomDebug(false);

  return rightCon || leftCon || topCon || bottomCon;

  function printTopBottomDebug(continueToDebug) {
    if (!continueToDebug) return;

    if (topCon) {
      console.log("---");
      console.log(inputNum);
      console.log("topCon: " + topCon);
      console.log("topCon1: " + topCon1);
      console.log("topCon2: " + topCon2);
      console.log("bottomCon: " + bottomCon);
      console.log("bottomCon1: " + bottomCon1);
      console.log("bottomCon2: " + bottomCon2);
      console.log("yCon3: " + yCon3);
      printSquarePositionInfo();
      console.log("xCoordinate: " + xCoordinate);
      console.log("yCoordinate: " + yCoordinate);
      console.log("xPos1: " + xPos1);
      console.log("yPos1: " + yPos1);

      console.log("---");
    }
  }
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
let all4DirectionsArray = new Array();

let xInput, yInput, xSpeedInput, ySpeedInput, newWord, newFontSize;

function createMatrixArray(inputDirectionMatrix) {
  // vertical
  // fill words array to number of columns
  if (inputDirectionMatrix === "south" || inputDirectionMatrix === "north") {
    for (let i = 0; i < columns; i++) {
      // matrixString xInput value
      xInput = fontSize * i;
      newWord = generateWord(generateWordSizeRand());
      newFontSize = generateFontSize();

      if (inputDirectionMatrix === "south") {
        yInput = generateYSouth(newWord, newFontSize);
        xSpeedInput = null;
        ySpeedInput = generateSpeed();
      } else if (inputDirectionMatrix === "north") {
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
  } else if (
    inputDirectionMatrix === "east" ||
    inputDirectionMatrix === "west"
  ) {
    for (let i = 0; i < rows; i++) {
      yInput = fontSize * i;
      newWord = generateWord(generateWordSizeRand());
      newFontSize = generateFontSize();
      if (inputDirectionMatrix === "east") {
        xInput = generateXEast(); // goal: negative / moving from left of the screen to right / need to generate this later
        xSpeedInput = generateSpeed(); // positive / updating position to the right
        ySpeedInput = null;
      } else if (inputDirectionMatrix === "west") {
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

function initializeAll4Directions() {
  words = [];
  let northWords, southWords, eastWords, westWords;
  let inputDirection = "";
  for (let i = 0; i < 4; i++) {
    switch (i) {
      case 0:
        inputDirection = "north";
        break;
      case 1:
        inputDirection = "south";
        break;
      case 2:
        inputDirection = "east";
        break;
      case 3:
        inputDirection = "west";
        break;
    }
    createMatrixArray(inputDirection);

    switch (i) {
      case 0:
        northWords = words;
        words = [];
        break;
      case 1:
        southWords = words;
        words = [];
        break;
      case 2:
        eastWords = words;
        words = [];
        break;
      case 3:
        westWords = words;
        words = [];
        break;
    }
  }

  all4DirectionsArray = [northWords, southWords, eastWords, westWords];
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

let drawBackgroundOn = true;

let drawBackgroundAll4DirectionsCounter = 0;
const drawBackgroundAll4DirectionsCounterMax = 3;

function draw(inputWords, passThroughToDraw) {
  if (discoOn) discoFrameCounter++;

  // draw all 4 directions
  let conditionToPass = all4Directions && !passThroughToDraw;
  if (conditionToPass) {
    drawAll4Directions();
    return;
  }

  // draw black background with 0.025 opacity to show the trail
  ctx.font = fontSize + "px 'Consolas', 'Lucida Console'";

  let normalDrawBackground = drawBackgroundOn && !all4Directions;

  let all4DirectionsDrawBackground;

  if (all4Directions && drawBackgroundOn) {
    // increment background counter
    drawBackgroundAll4DirectionsCounter++;

    // only returns true once every 4 calls  of draw()
    all4DirectionsDrawBackground =
      all4Directions && getAll4DirectionsDrawBackground();

    // if counter is over the max limit, reset
    checkBackgroundCounter();
  }

  if (normalDrawBackground || all4DirectionsDrawBackground) drawOpaqueRect();

  // draw strings
  for (let i = 0; i < inputWords.length; i++) {
    changeWordCheck(inputWords[i], inputWords[i].word.length);

    if (direction === "south") {
      destinationPoint = height; // destination point: below the screen
    } else if (direction === "north") {
      destinationPoint = 0;
    }

    if (direction === "south") {
      // reset to top of screen if drop off the canvas at bottom of the screen
      if (inputWords[i].y > height) {
        inputWords[i].ySpeed = generateSpeed(); // new speed
        inputWords[i].word = generateWord(generateWordSizeRand()); // generate new random word with random size
        inputWords[i].fontSize = generateFontSize(); // new font size
        inputWords[i].y = generateYSouth(
          inputWords[i].word,
          inputWords[i].fontSize
        );
      } else {
        inputWords[i].y = inputWords[i].y + fontSize + inputWords[i].ySpeed;
        ctx.font = inputWords[i].fontSize + "px 'Consolas', 'Lucida Console'";
      }
    } else if (direction === "north") {
      // reset to bottom of screen if move off top of the screen
      if (inputWords[i].y < 0 - height * 1.5) {
        inputWords[i].y = generateYNorth();
        inputWords[i].ySpeed = -Math.abs(generateSpeed()); // new speed
        inputWords[i].word = generateWord(generateWordSizeRand()); // generate new random word with random size
        inputWords[i].fontSize = generateFontSize(); // new font size
      } else {
        inputWords[i].y = inputWords[i].y - fontSize - inputWords[i].ySpeed;
        ctx.font = inputWords[i].fontSize + "px 'Consolas', 'Lucida Console'";
      }
    } else if (direction === "east") {
      if (inputWords[i].x < 0 - canvas.width) {
        inputWords[i].x = generateXEast();
        inputWords[i].xSpeed = generateSpeed(); // new speed
        inputWords[i].word = generateWord(generateWordSizeRand()); // generate new random word with random size
        inputWords[i].fontSize = generateFontSize(); // new font size
      } else {
        inputWords[i].x = inputWords[i].x - fontSize - inputWords[i].xSpeed;
        ctx.font = inputWords[i].fontSize + "px 'Consolas', 'Lucida Console'";
      }
    } else if (direction === "west") {
      if (inputWords[i].x > canvas.width) {
        inputWords[i].xSpeed = -Math.abs(generateSpeed()); // new speed
        inputWords[i].word = generateWord(generateWordSizeRand()); // generate new random word with random size
        inputWords[i].fontSize = generateFontSize(); // new font size
        inputWords[i].x = generateXWest(
          inputWords[i].word,
          inputWords[i].fontSize
        ); // new x placement
      } else {
        inputWords[i].x = inputWords[i].x + fontSize + inputWords[i].xSpeed;
        ctx.font = inputWords[i].fontSize + "px 'Consolas', 'Lucida Console'";
      }
    }
    // call display method and draw string
    let millisecondsToWait = inputWords[i].ySpeed * 100;
    // code for vertical movement methods

    setTimeout(
      inputWords[i].show(colorChoiceArray[chosenColor]),
      millisecondsToWait
    );
  }
}

/**  current direction order:

/1. East
 2. North
 3. West
 4. South 
*/

const eastDirection = 2;
const northDirection = 0;
const westDirection = 3;
const southDirection = 1;

function drawAll4Directions() {
  let inputDirection;
  for (let i = 0; i < 4; i++) {
    assignDirection(i);
    draw(all4DirectionsArray[inputDirection], true);
  }

  function assignDirection(input) {
    switch (input) {
      case 0:
        makeDirectionEast();
        break;
      case 1:
        makeDirectionNorth();
        break;
      case 2:
        makeDirectionWest();
        break;
      case 3:
        makeDirectionSouth();
        break;
    }

    function makeDirectionSouth() {
      direction = "south";
      inputDirection = southDirection;
    }

    function makeDirectionWest() {
      direction = "west";
      inputDirection = westDirection;
    }

    function makeDirectionNorth() {
      direction = "north";
      inputDirection = northDirection;
    }

    function makeDirectionEast() {
      direction = "east";
      inputDirection = eastDirection;
    }
  }
}

function checkBackgroundCounter() {
  if (getAll4DirectionsDrawBackground()) {
    drawBackgroundAll4DirectionsCounter = 0;
  }
}

function getAll4DirectionsDrawBackground() {
  return (
    drawBackgroundAll4DirectionsCounter > drawBackgroundAll4DirectionsCounterMax
  );
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

  if (drawBackgroundOn) drawOpaqueRect();
  ctx.fillStyle = colorWhite;

  ctx.font = alternativeFontSize + "px Arial";
  // ctx.font = fontSize + "px 'Consolas', 'Lucida Console'";

  createMatrixArray();

  if (squareCounter > squareCounterTurnoverPoint && rapidSquareOn) {
    squareCounter = 0;
    generateRandomSquarePositions();
  }

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

function resetAllWordsYPositions() {
  words.forEach(function (arrayItem) {
    switch (direction) {
      case "south":
        arrayItem.y = 0;
        break;
      case "north":
        arrayItem.y = canvas.height;
        break;
      case "east":
        arrayItem.x = 0;
        break;
      case "west":
        arrayItem.x = canvas.width;
        break;
    }
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

let squareCounter = 0;
const amountOfSquareCounterLevels = 21;
let squareCounterLevels = Array.from(Array(amountOfSquareCounterLevels).keys());
let middleSquareCounterLevels =
  squareCounterLevels[Math.round((squareCounterLevels.length - 1) / 2)];
let squareCounterTurnoverPoint = middleSquareCounterLevels;

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
  // console.log("rightEdge: " + rightEdge);
  // console.log("---");
  console.log("x2: " + x2);
  // console.log("leftEdge: " + leftEdge);
  // console.log("---");
  console.log("y1: " + y1);
  // console.log("topEdge: " + topEdge);
  // console.log("---");
  console.log("y2: " + y2);
  // console.log("bottomEdge: " + bottomEdge);
  console.log("---");
}

function resetSquarePosition() {
  x1 = 250;
  x2 = 500;
  y1 = 250;
  y2 = 500;
}

function generateRandomSquarePositions() {
  x1 = generateRandomX1Position();

  x2 = x1 + 250;

  y1 = generateRandomY1Position();

  y2 = y1 + 250;

  function generateRandomX1Position() {
    return generateRandomPosition(getMinX1Point(), getMaxX1Point());
  }

  function generateRandomY1Position() {
    return generateRandomPosition(getMinY1Point(), getMaxY1Point());
  }

  function generateRandomPosition(startingPoint, finishingPoint) {
    let availablePositions = new Array();
    let loopLength = Math.floor(finishingPoint / startingPoint);

    for (let i = 0; i < loopLength; i++) {
      availablePositions.push((startingPoint += 20));
    }

    return availablePositions[
      Math.floor(Math.random() * availablePositions.length)
    ];
  }

  function getMinX1Point() {
    return 50;
  }

  function getMaxX1Point() {
    return 1110;
  }

  function getMinY1Point() {
    return 50;
  }

  function getMaxY1Point() {
    return 710;
  }
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
  all4DirectionsArray = [];
  direction = null;
  discoOn = null;
  chosenColor = null;
  resetRandomColor();
  discoFrameCounter = 0;
  intervalSpeed = DEFAULT_SPEED;
  currentSpeedLevel = speedLevels[middleSpeedLevels];
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
let middleSpeedLevels = speedLevels[Math.round((speedLevels.length - 1) / 2)];
let currentSpeedLevel = speedLevels[middleSpeedLevels];

let rapidWordChange = false;
let hangingWords = true;
let all4Directions = false;

document.addEventListener("keydown", function (event) {
  iCounter = 0;

  switch (event.key) {
    case "Escape":
      resetToMenu();
      break;
    case "ArrowLeft":
      if (squareAnimationOn) {
        moveSquareLeft(false);
      } else {
        arrowDirectionControl("west", "east");
      }
      break;
    case "ArrowUp":
      if (squareAnimationOn) {
        moveSquareUp(false);
      } else {
        arrowDirectionControl("north", "south");
      }
      break;
    case "ArrowRight":
      if (squareAnimationOn) {
        moveSquareRight(false);
      } else {
        arrowDirectionControl("east", "west");
      }
      break;
    case "ArrowDown":
      if (squareAnimationOn) {
        moveSquareDown(false);
      } else {
        arrowDirectionControl("south", "north");
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
      controlFontSizeInput(true);
      break;
    case "s":
      controlFontSizeInput(false);
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
    case "i":
      if (!squareAnimationOn) all4DirectionsControl();
      break;
    case "o":
      drawBackgroundControl();
      break;
  }

  switch (event.key) {
    case "p":
      squareCounterControl(true);
      break;
    case ";":
      squareCounterControl(false);
      break;
  }

  printSquarePositionInfo();
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
      if (drawBackgroundOn) resetWordsArray();
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
  let pauseBool = !all4Directions;

  if (animationOn) {
    clearInterval(intervalValid);
    animationOn = false;
  } else {
    intervalValid = setInterval(function () {
      draw(words, pauseBool);
    }, intervalSpeed);
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
  checkBox.checked = !checkBox.checked;

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

  let speedControllerBool = !all4Directions;

  // restart the interval
  intervalValid = setInterval(function () {
    draw(words, speedControllerBool);
  }, intervalSpeed);
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

function controlFontSizeInput(increase) {
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

  let increaseOrDecrease = increase;

  if (all4Directions) {
    all4DirectionsArray.forEach(function (directionArray) {
      controlFontSize(directionArray, increaseOrDecrease);
    });
  } else controlFontSize(words, increaseOrDecrease);
}

function controlFontSize(inputWords, increase) {
  for (let i = 0; i < inputWords.length; i++) {
    let x = inputWords[i].fontSize;
    if (increase) {
      x++;
    } else {
      x--;
    }
    inputWords[i].fontSize = x;
  }

  if (squareAnimationOn) resetWordsArray();
}

function printFontSizeDebugInfo() {
  console.log("defaultFontSize: " + defaultFontSize);

  console.log("fontSize: " + fontSize);
}

function controlStringSize(increase) {
  let increaseOrDecreaseInput;
  if (increase & (stringSizeMax < 150)) {
    stringSizeMin++;
    stringSizeMax++;
    increaseOrDecreaseInput = true;
  } else if (!increase & (stringSizeMin > 1)) {
    stringSizeMin--;
    stringSizeMax--;
    increaseOrDecreaseInput = false;
  } else return;
  console.log(stringSizeMin);

  all4DirectionsToStringSize(increaseOrDecreaseInput);
}

function all4DirectionsToStringSize(increase) {
  if (all4Directions) {
    all4DirectionsArray.forEach(function (individualDirectionArray) {
      individualDirectionArray.forEach(function (matrixWordObj) {
        increaseOrDecreaseControl(matrixWordObj);
      });
    });
  } else {
    words.forEach(function (matrixWordObj) {
      increaseOrDecreaseControl(matrixWordObj);
    });
  }

  function increaseOrDecreaseControl(matrixWordObj) {
    if (increase) {
      matrixWordObj.increaseStringSize();
    } else {
      matrixWordObj.decreaseStringSize();
    }
  }
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
  rapidWordChange = !rapidWordChange;
}

function hangingWordsControl() {
  if (hangingWords) {
    hangingWords = false;
  } else {
    hangingWords = true;
  }

  giveEachWordNewWord();
}

function switchMode() {
  let original;
  if (squareAnimationOn) original = true;
  else original = false;

  resetToMenu();

  run(original);
}

function rapidSquareControl() {
  rapidSquareOn = !rapidSquareOn;
}

function drawBackgroundControl() {
  drawBackgroundOn = !drawBackgroundOn;
}

function squareCounterControl(increase) {
  if (returnMinCon()) return;

  if (returnMaxCon()) return;

  if (increase) squareCounterTurnoverPoint++;
  else squareCounterTurnoverPoint--;

  console.log(squareCounterTurnoverPoint);

  function returnMinCon() {
    return squareCounterTurnoverPoint === squareCounterLevels[0] && !increase;
  }

  function returnMaxCon() {
    return (
      squareCounterTurnoverPoint ===
        squareCounterLevels[squareCounterLevels.length - 1] && increase
    );
  }
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

  if (all4Directions) {
    words = [];
    initializeAll4Directions();
  }
}

function hangingWordsSetup() {
  giveEachWordNewWord();
  resetAllWordsYPositions();
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
}

function initializeSquareAnimationOn() {
  newWordSize = getNewWordSize();
  words.shift();
  giveEachWordNewWord();
  resetAllWordsYPositions();
}

function all4DirectionsControl() {
  if (all4Directions) {
    all4Directions = false;
  } else {
    all4Directions = true;
  }
  resetWordsArray();
  updateAll4DirectionButtonStyling();
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
    createMatrixArray(direction);
    initializeSquareAnimationOn();
  } else if (all4Directions) {
    initializeAll4Directions();
  } else {
    createMatrixArray(direction);
  }

  // run the animation
  intervalValid = setInterval(function () {
    if (original && all4Directions) {
      draw(words, false);
    } else if (original && !all4Directions) {
      draw(words, true);
    } else if (!original) {
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
const button3 = document.getElementById("button3");
const button4 = document.getElementById("button4");
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

    discoOn = false;

    updateAll4DirectionButtonStyling();

    clearInterval(menuInterval);
  } else {
    text.style.display = "none";
    select.style.display = "none";

    button3.style.color = colorBlack;

    // show frameCountElems
    frameCountElemsVisibilityFunction();

    discoIntervalFunction();

    discoOn = true;

    updateAll4DirectionButtonStyling();

    menuInterval = setInterval(discoIntervalFunction, 1000);
  }
}

function discoIntervalFunction() {
  recolorMenuRandom();
  buttonDiscoBackgroundChangeColor();
  updateAll4DirectionButtonStyling();
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
    buttonBackgroundBlack();
  }

  if (all4Directions) {
    button3.style.background = inputColor;
    button3.style.color = colorBlack;
  } else {
    button3.style.background = colorBlack;
    button3.style.color = inputColor;
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

  updateAll4DirectionButtonStyling();
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

button3.addEventListener("mouseover", function () {
  if (!all4Directions) buttonMouseOver(3);
});

button3.addEventListener("mouseout", function () {
  if (!all4Directions) buttonMouseOut(3);
});

button4.addEventListener("mouseover", function () {
  buttonMouseOver(4);
});

button4.addEventListener("mouseout", function () {
  buttonMouseOut(4);
});

function buttonMouseOver(input) {
  if (buttonDiscoChecked()) {
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].style.color = getRandomColor();
    }
    buttonDiscoBackgroundChangeColor();
    buttonBorderColorRandom();
  } else {
    intToButton(input).style.color = colorBlack;
    intToButton(input).style.background = selectColor;
  }
}

function buttonMouseOut(input) {
  if (buttonDiscoChecked()) {
    button.style.color = getRandomColor();
    buttonDiscoBackgroundChangeColor();
    buttonBorderColorRandom();
  } else {
    intToButton(input).style.color = selectColor;
    intToButton(input).style.background = colorBlack;
  }
}

function intToButton(input) {
  switch (input) {
    case 1:
      return button;
    case 2:
      return button2;
    case 3:
      return button3;
    case 4:
      return button4;
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

function buttonBackgroundSelectedColor(inputColor) {
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].style.background = inputColor;
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

function updateAll4DirectionButtonStyling() {
  let onText = "All 4 Directions:\nON";
  let offText = "All 4 Directions:\nOFF";

  if (all4Directions) {
    button3.style.background = selectColor;
    button3.style.color = colorBlack;
    button3.innerText = onText;
    button3.innerHTML = onText;
    button3.value = onText;
  } else {
    // button3.style.background = colorBlack;
    // button3.style.color = selectColor;
    button3.innerHTML = offText;
    button3.innerText = offText;
    button3.value = offText;
  }

  if (discoOn) {
    button3.style.background = getRandomColor();
    button3.style.color = getRandomColor();
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

const helpText = `
Keyboard Inputs
  
  Normal Mode:
  
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
  - P: Increase random square speed
  - ;: Decrease random square speed
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
  
  Move Square Mode:
  
  Same as Normal Mode except:
  
  - Arrowkeys: move box directions
  - Altering speed disabled
  - Altering string length disabled
  - Altering font size disabled.
  - G: Toggle fixed word length.
  `;
