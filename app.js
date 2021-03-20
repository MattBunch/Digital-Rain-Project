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
const color95White5Green = "#e6ffec"; // color 95% white, 5% matrix green
const color70White30Green = "#66ff8c"; // color 70% white, 30% matrix green
const greenArray = [color95White5Green, color70White30Green, colorMatrixGreen];

// Red:
const color95White5Red = "#ffe6e6"; // color 95% white, 5% red
const color70White30Red = "#ff6666"; // color 70% white, 30% red
const colorRed = "#e60000"; // red
const redArray = [color95White5Red, color70White30Red, colorRed];

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

// TODO: word size and font size should scale to size of screen

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
    word += getRandomChar(); //alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return word;
}

function getRandomChar() {
  return alphabet.charAt(Math.floor(Math.random() * alphabet.length));
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

// TODO: fix the output
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

const discoFrameElement = document.getElementById("frameCount");
let discoFrameCounter = 0; // counter for determining frame which colors change

let discoFrameCounterMax = discoFrameElement.value; // counter maximum for when counter goes back to 0
if (discoFrameElement.value < 0 || discoFrameElement == null) {
  discoFrameCounterMax = 10;
}

let savedColor = getRandomColor();

class MatrixString {
  constructor(word, x, y, xSpeed, ySpeed, inputFontSize) {
    this.word = word; // word
    this.x = x; // random x float coordinates
    this.y = y; // random y float coordinates
    this.xSpeed = xSpeed; // random x float speed
    this.ySpeed = ySpeed; // random y float speed
    this.fontSize = inputFontSize; //  random font size
  }

  // method for displaying text to the screen, default method
  showVertical(inputColorArray) {
    // for changing the string to a different string with the same size every frame
    this.word = generateWord(this.word.length);

    if (direction === "south") {
      for (let i = 0; i < this.word.length - 1; i++) {
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
        ctx.fillText(
          this.word.substring(i, i + 1),
          this.x,
          this.y + i * this.fontSize
        );
      }
    } else if (direction === "north") {
      for (let i = 0; i < this.word.length; i++) {
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
        ctx.fillText(
          this.word.substring(i, i + 1),
          this.x,
          this.y + i * this.fontSize
        );
      }
    }
  }

  // disco mode vertical, each letter will be a different color on each frame
  showDiscoVertical() {
    this.word = generateWord(this.word.length);

    discoColorCounterCheck();

    for (let i = 0; i < this.word.length - 1; i++) {
      ctx.fillText(
        this.word.substring(i, i + 1),
        this.x,
        this.y + i * this.fontSize
      );
    }
  }

  // for horizontal movements (east and west)
  showHorizontal(inputColorArray) {
    // for changing the string to a different string with the same size every frame
    this.word = generateWord(this.word.length);
    // east
    if (direction === "east") {
      for (let i = 0; i < this.word.length - 1; i++) {
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
          this.word.substring(i, i + 1),
          this.x + i * this.fontSize,
          this.y
        );
      }
    } else if (direction === "west") {
      for (let i = 0; i < this.word.length - 1; i++) {
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
          this.word.substring(i, i + 1),
          this.x + i * this.fontSize,
          this.y
        );
      }
    }
  }

  // disco mode horizontal, each letter will be a different color on each frame
  showDiscoHorizontal() {
    this.word = generateWord(this.word.length);

    discoColorCounterCheck();

    for (let i = 0; i < this.word.length - 1; i++) {
      ctx.fillText(
        this.word.substring(i, i + 1),
        this.x + i * this.fontSize,
        this.y
      );
    }
  }

  showAlternative(x1, x2, y1, y2) {
    this.word = generateWord(this.word.length);
    for (let i = 0; i < this.word.length - 1; i++) {
      let letter = this.word.substring(i, i + 1);
      let xCoordinate = this.x;
      let yCoordinate = this.y + i * this.fontSize;

      // let x1 = 250;
      // let x2 = 500;
      // let y1 = 250;
      // let y2 = 500;

      let alternativeColorCondition =
        xCoordinate < x1 ||
        xCoordinate > x2 ||
        yCoordinate < y1 ||
        yCoordinate > y2;

      if (alternativeColorCondition) {
        ctx.fillStyle = colorWhite;
      } else {
        ctx.fillStyle = colorMatrixGreen;
      }

      ctx.fillText(letter, xCoordinate, yCoordinate);
    }
  }
}

function discoColorCounterCheck() {
  if (discoFrameCounter > discoFrameCounterMax) {
    ctx.fillStyle = getRandomColor();
    savedColor = ctx.fillStyle;
    discoFrameCounter = 0;
  } else {
    ctx.fillStyle = savedColor;
  }
}

class IndividualLetterCoordinates {
  constructor(originalWordArray, xCoordinates, yCoordinates) {
    this.originalWordArray = originalWordArray;
    this.xCoordinates = xCoordinates;
    this.yCoordinates = yCoordinates;
  }
}

let letterCoordinates = new Array();

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

  // draw strings falling from top to bottom
  for (let i = 0; i < words.length; i++) {
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
const alternativeFontSize = 20;

let squareCounter = 0;
let randomSquareCoordinates = returnRandomSquareCoordinates();

function drawAlternative() {
  squareCounter++;
  drawSolidRect();
  ctx.font = alternativeFontSize + "px Arial";
  ctx.fillStyle = colorWhite;

  // ctx.font = fontSize + "px 'Consolas', 'Lucida Console'";

  // no direction input, very important
  // alternative method: input "south" as direction and empty array after forEach loop
  createMatrixArray();

  let newWordSize = getNewWordSize();
  if (squareCounter > 50) {
    randomSquareCoordinates = returnRandomSquareCoordinates();
    squareCounter = 0;
  }
  let x1 = randomSquareCoordinates[0];
  let x2 = randomSquareCoordinates[1];
  let y1 = randomSquareCoordinates[2];
  let y2 = randomSquareCoordinates[3];

  words.forEach(function (arrayWord) {
    arrayWord.y = 0;
    arrayWord.fontSize = alternativeFontSize;
    arrayWord.word = generateWord(newWordSize);
    arrayWord.showAlternative(x1, x2, y1, y2);
  });
}
function reallyTallScreen() {
  return canvas.height > 2000;
}

function getNewWordSize() {
  let output = 80;

  if (reallyTallScreen()) output = doubleInt(output);

  return output;
}

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
  words = []; // empty array
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
}

function resetRandomColor() {
  randomColorArray = generateRandomColorArray();
  colorChoiceArray[7] = randomColorArray;
  updateRandomColor();
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

const DEFAULT_SPEED = 50;
const amountOfSpeedLevels = 7;
let intervalSpeed = DEFAULT_SPEED;
let speedLevels = Array.from(Array(amountOfSpeedLevels).keys());
let middle = speedLevels[Math.round((speedLevels.length - 1) / 2)];
let currentSpeedLevel = speedLevels[middle];

document.addEventListener("keydown", function (event) {
  iCounter = 0;

  // TODO: convert to switch case for more efficient speeds
  switch (event.key) {
    case "Escape":
      resetToMenu();
      break;
    case "ArrowLeft":
      arrowDirectionControl("west", "east");
      break;
    case "ArrowUp":
      arrowDirectionControl("north", "south");
      break;
    case "ArrowRight":
      arrowDirectionControl("east", "west");
      break;
    case "ArrowDown":
      arrowDirectionControl("south", "north");
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
      if (ctx != null) {
        speedController(true);
      }
      break;
    case "PageDown":
      if (ctx != null) {
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
    case "r":
      discoIntervalSpeedControl(true);
      break;
    case "f":
      discoIntervalSpeedControl(false);
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
  if (increase & (defaultFontSize < 65)) defaultFontSize++;
  else if (!increase & (defaultFontSize > 1)) defaultFontSize--;
  else return;

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
      increase && discoFrameCounterMax < DISCO_FRAME_COUNTER_DEFAULT_MAX;
    let canDecrease =
      !increase && discoFrameCounterMax > DISCO_FRAME_COUNTER_DEFAULT_MIN;

    if (canIncrease) discoFrameCounterMax++;
    else if (canDecrease) discoFrameCounterMax--;
  }
}

window.addEventListener("resize", resetWordsArray);

function resetWordsArray() {
  clearScreen();

  words = [];

  canvasSetup();

  createMatrixArray(direction);
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

// like a main method in java, this function gets executed upon runtime
function run(original) {
  // set up canvas
  canvasSetup();

  // read html values
  loadMenuOptions();

  // hide the main html menu
  hideMenu();

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
const elems = document.body.getElementsByTagName("*");
const frameCountElems = document.getElementsByClassName("frameCount");

let menuInterval;
let selectColor;

// TODO: loop through and recolor each button for the inclusion of a new button

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
  button.style.border = borderPrefix + selectColor;

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

function buttonBorderColorRandom() {
  button.style.border = borderPrefix + getRandomColor();
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

  // if (checkBox.checked) {
  //   checkboxFunction();
  // } else {
  //   selectFunction();
  // }

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
    // return getRandomColor(); // create random color each time this is called.
    default:
      return null;
  }
}

// hover over button color change
/**
 * for multiple buttons, loop through html collection and change each item:
 * 
    Array.from(buttons.forEach(function(button) {
    button.addEventListener("mouseover", function(button) {
      buttonMouseOver(button); // TODO: edit buttonMouseOver and buttonMouseOut to take button as a parameter
    });
 */
button.addEventListener("mouseover", buttonMouseOver);
button.addEventListener("mouseout", buttonMouseOut);

function buttonMouseOver() {
  if (buttonDiscoChecked()) {
    // button.style.background = getRandomColor();
    button.style.color = getRandomColor();
    buttonDiscoBackgroundChangeColor();
    buttonBorderColorRandom();
  } else {
    button.style.background = selectColor;
    button.style.color = colorBlack;
  }
}

function buttonMouseOut() {
  if (buttonDiscoChecked()) {
    button.style.color = getRandomColor();
    buttonDiscoBackgroundChangeColor();
    buttonBorderColorRandom();
  } else {
    button.style.background = colorBlack;
    button.style.color = selectColor;
  }
}

function buttonDiscoChecked() {
  return document.getElementById("disco").checked;
}

function buttonBackgroundBlack() {
  button.style.background = colorBlack;
}

function buttonDiscoBackgroundChangeColor() {
  button.style.background = getRandomColor();
}

function updateRandomColor() {
  selectColor = randomColorArray[2];
  selectFunction();
}

function frameCountFunctionOnChange() {
  let currentDiscoFrameMax = discoFrameElement.value;
  localStorage.setItem("frameCountKey", currentDiscoFrameMax);
  discoFrameCounterMax = currentDiscoFrameMax;
}

function frameCountFunctionOnLoad() {
  discoFrameElement.value = localStorage.getItem("frameCountKey");
}

function updateSelectBox(input) {
  select.value = input;
  selectFunction();
}

function directionFunction() {}
