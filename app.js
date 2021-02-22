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

function canvasSetup() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas = document.getElementById("myCanvas"); // canvas object
  ctx = canvas.getContext("2d"); // context object
  fontSize = 20;
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
let colorWhite = "#ffffff"; // white, yes I know white is a shade not a color
let colorBlack = "#000000"; // black

// Green:
let colorMatrixGreen = "#00ff41"; // matrix green
let color95White5Green = "#e6ffec"; // color 95% white, 5% matrix green
let color70White30Green = "#66ff8c"; // color 70% white, 30% matrix green
let greenArray = [color95White5Green, color70White30Green, colorMatrixGreen];

// Red:
let color95White5Red = "#ffe6e6"; // color 95% white, 5% red
let color70White30Red = "#ff6666"; // color 70% white, 30% red
let colorRed = "#e60000"; // red
let redArray = [color95White5Red, color70White30Red, colorRed];

// Yellow:
let color95White5Yellow = "#ffffe6"; // color 95% white, 5% yellow
let color70White30Yellow = "#ffff66"; // color 70% white, 30% yellow
let colorYellow = "#ffff00"; // yellow
let yellowArray = [color95White5Yellow, color70White30Yellow, colorYellow];

// Blue:
let color95White5Blue = "#e6e6ff"; // color 95% white, 5% blue
let color70White30Blue = "#6666ff"; // color 70% white, 30% blue
let colorBlue = "#0000ff"; // blue
let blueArray = [color95White5Blue, color70White30Blue, colorBlue];

// Orange:
let color95White5Orange = "#fff5e6"; // color 95% white, 5% orange
let color70White30Orange = "#ffc266"; // color 70% white, 30% orange
let colorOrange = "#ff9900"; // orange
let orangeArray = [color95White5Orange, color70White30Orange, colorOrange];

// Pink
let color95White5Pink = "#ffe6ff"; // color 95% white, 5% pink
let color70White30Pink = "#ff66ff"; // color 70% white, 30% pink
let colorPink = "#ff00ff"; // pink
let pinkArray = [color95White5Pink, color70White30Pink, colorPink];

// Cyan
let color95White5Cyan = "#e6ffff"; // color 95% white, 5% cyan
let color70White30Cyan = "#66ffff"; // color 70% white, 30% cyan
let colorCyan = "#00ffff"; // cyan
let cyanArray = [color95White5Cyan, color70White30Cyan, colorCyan];

// random colors
let randomColorArray = generateRandomColorArray();

// array of color array
let colorChoiceArray = [
  greenArray,
  redArray,
  yellowArray,
  blueArray,
  orangeArray,
  pinkArray,
  cyanArray,
  randomColorArray,
  // generateRandomColorArray(),
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

// generate random number between a range, used in multiple functions
function generateRandomNumber(min, max) {
  let rangeMin = min;
  let rangeMax = max;
  let number = Math.random() * (rangeMax - rangeMin) + rangeMin; // generate random size between min and max
  return number;
}

// generate random size of word between 20 and 48
function generateWordSizeRand() {
  return Math.floor(generateRandomNumber(20, 48));
}

// generate font size number between 15 and 25
function generateFontSize() {
  return Math.floor(generateRandomNumber(15, 25));
}

// generate both xSpeed and ySpeed between 0.001 and 9.999
function generateSpeed() {
  return generateRandomNumber(0.001, 9.999);
}

// function to generate a random word based on this string.
function generateWord(wordSize) {
  // string of the alphabet
  let alphabet =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ";

  // word declaration as empty
  let word = "";

  // get random letter from the alphabet and add it to the word
  for (let i = 0; i < wordSize; i++) {
    word += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return word;
}

// TODO: change these coordinates to be relative to
// canvas.width for east and west
// canvas.height for north and south

// get new x coordinates for east and west
function generateXEast() {
  return generateRandomNumber(canvas.width, canvas.width + 1200);
  // return generateRandomNumber(canvas.width, canvas.width + 1500);
}

function generateXWest() {
  return generateRandomNumber(800, 2000) * -1;
}

function generateYInput(min, max) {
  // calculate height deductor range
  let heightDeductor = generateRandomNumber(min, max);
  yInput = Math.floor(Math.random() * height - heightDeductor);
  return yInput;
}

function generateYNorth() {
  return generateYInput(400, 0) + canvas.height * 2;
}

function generateYSouth() {
  return generateYInput(canvas.height + 1000, canvas.height + 1800);
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
  constructor(x, y, xSpeed, ySpeed) {
    this.word = generateWord(generateWordSizeRand()); // word
    this.x = x; // random x float coordinates
    this.y = y; // random y float coordinates
    this.xSpeed = xSpeed; // random x float speed
    this.ySpeed = ySpeed; // random y float speed
    this.fontSize = generateFontSize(); //  random font size
  }

  // method for displaying text to the screen, default method
  showVertical(inputArray) {
    // for changing the string to a different string with the same size every frame
    this.word = generateWord(this.word.length);

    if (direction === "south") {
      for (let i = 0; i < this.word.length - 1; i++) {
        if (i == this.word.length - 2) {
          // set first letter color to white
          ctx.fillStyle = colorWhite;
        } else if (i == this.word.length - 3) {
          // set second letter color to 95% white, 5% matrix color
          ctx.fillStyle = inputArray[0];
        } else if (i == this.word.length - 4) {
          // set third letter color to 90% white, 10% matrix color
          ctx.fillStyle = inputArray[1];
        } else {
          // set rest of the string to color
          // extension? fade out of darker colors
          ctx.fillStyle = inputArray[2];
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
          ctx.fillStyle = inputArray[0];
        } else if (i == 2) {
          // set third letter color to 90% white, 10% matrix color
          ctx.fillStyle = inputArray[1];
        } else {
          // set rest of the string to color
          // extension? fade out of darker colors
          ctx.fillStyle = inputArray[2];
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
  showHorizontal(inputArray) {
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
          ctx.fillStyle = inputArray[0];
        } else if (i == 2) {
          // set third letter color to 90% white, 10% matrix color
          ctx.fillStyle = inputArray[1];
        } else {
          // set rest of the string to color
          ctx.fillStyle = inputArray[2];
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
          ctx.fillStyle = inputArray[0];
        } else if (i == this.word.length - 4) {
          // set third letter color to 90% white, 10% matrix color
          ctx.fillStyle = inputArray[1];
        } else {
          // set rest of the string to color
          ctx.fillStyle = inputArray[2];
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

let xInput;
let yInput;
let xSpeedInput;
let ySpeedInput;

function createMatrixArray(directionMatrix) {
  // vertical
  // fill words array to number of columns
  if (directionMatrix === "south" || directionMatrix === "north") {
    for (let i = 0; i < columns; i++) {
      // matrixString xInput value
      xInput = fontSize * i;
      if (directionMatrix === "south") {
        yInput = generateYSouth();
        xSpeedInput = null;
        ySpeedInput = generateSpeed();
      } else if (directionMatrix === "north") {
        yInput = generateYNorth();
        xSpeedInput = null;
        ySpeedInput = -Math.abs(generateSpeed());
      }
      // create new MatrixString object for vertical
      words.push(new MatrixString(xInput, yInput, xSpeedInput, ySpeedInput));
    }
    // horizontal
  } else if (directionMatrix === "east" || directionMatrix === "west") {
    for (let i = 0; i < rows; i++) {
      yInput = fontSize * i;
      if (directionMatrix === "east") {
        xInput = generateXEast(); // goal: negative / moving from left of the screen to right / need to generate this later
        xSpeedInput = generateSpeed(); // positive / updating position to the right
        ySpeedInput = null;
      } else if (directionMatrix === "west") {
        xInput = generateXWest(); // goal: positive / moving from the right of the screen to the left
        xSpeedInput = -Math.abs(generateSpeed()); // negative / updating position to the left
        ySpeedInput = null;
      }
      // create new object for horizontal
      words.push(new MatrixString(xInput, yInput, xSpeedInput, ySpeedInput));
    }
  }
}

/*###########################################################################################

   _____ _                    ____    ______                _   _             
  / ____| |                  / /\ \  |  ____|              | | (_)            
 | (___ | |__   _____      _| |  | | | |__ _   _ _ __   ___| |_ _  ___  _ __  
  \___ \| '_ \ / _ \ \ /\ / / |  | | |  __| | | | '_ \ / __| __| |/ _ \| '_ \ 
  ____) | | | | (_) \ V  V /| |  | | | |  | |_| | | | | (__| |_| | (_) | | | |
 |_____/|_| |_|\___/ \_/\_/ | |  | | |_|   \__,_|_| |_|\___|\__|_|\___/|_| |_|
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
  discoFrameCounter++;

  // draw black background with 0.025 opacity to show the trail
  ctx.font = fontSize + "px 'Consolas', 'Lucida Console'";
  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.fillRect(0, 0, width, height);

  // draw strings falling from top to bottom
  for (let i = 0; i < words.length; i++) {
    if (direction === "south") {
      destinationPoint = height; // destination point: below the screen
    } else if (direction === "north") {
      destinationPoint = 0;
    }

    // disco boolean check, random generates color for every frame
    if (discoOn) {
      let newColor = generateRandomColorArray();
      colorChoiceArray[chosenColor] = newColor;
    }

    if (direction === "south") {
      // reset to top of screen if drop off the canvas at bottom of the screen
      if (words[i].y > height) {
        words[i].y = generateYSouth(); //generateYInput(canvas.height + 1000, canvas.height + 1500); // resets height 1440 1550
        words[i].ySpeed = generateSpeed(); // new speed
        words[i].word = generateWord(generateWordSizeRand()); // generate new random word with random size
        words[i].fontSize = generateFontSize(); // new font size
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
        words[i].x = generateXEast(); // generateRandomNumber(canvas.width, canvas.width + 500); new x placement
        words[i].xSpeed = generateSpeed(); // new speed
        words[i].word = generateWord(generateWordSizeRand()); // generate new random word with random size
        words[i].fontSize = generateFontSize(); // new font size
      } else {
        words[i].x = words[i].x - fontSize - words[i].xSpeed;
        ctx.font = words[i].fontSize + "px 'Consolas', 'Lucida Console'";
      }
    } else if (direction === "west") {
      if (words[i].x > canvas.width) {
        words[i].x = generateXWest(); // new x placement
        words[i].xSpeed = -Math.abs(generateSpeed()); // new speed
        words[i].word = generateWord(generateWordSizeRand()); // generate new random word with random size
        words[i].fontSize = generateFontSize(); // new font size
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
  randomColorArray = generateRandomColorArray();
  colorChoiceArray[7] = randomColorArray;
  updateRandomColor();
  discoFrameCounter = 0;
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

document.addEventListener("keydown", function (event) {
  if (event.keyCode == 27) {
    resetToMenu();
  } else if (event.keyCode == 37) {
    // left arrowkey
    // check direction is not going west ("left")
    if (direction != "west") {
      direction = "west";
    }
  } else if (event.keyCode == 38) {
    // up arrowkey
    // check direction is not going north ("up")
    if (direction != "north") {
      direction = "north";
    }
  } else if (event.keyCode == 39) {
    // right arrowkey
    // check direction is not going east ("right")
    if (direction != "east") {
      direction = "east";
    }
  } else if (event.keyCode == 40) {
    // down arrowkey
    // check direction is not going south ("down")
    if (direction != "south") {
      direction = "south";
    }
  } else if (event.keyCode == 32) {
    // space key
    if (ctx != null) {
      pause();
    }
  } else if (event.keyCode == 67) {
    // c key
    clearScreen();
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

function clearScreen() {
  for (let i = 0; i < words.length; i++) {
    switch (direction) {
      // if south
      case "south":
        words[i].y = generateYSouth();
        break;

      // if north
      case "north":
        words[i].y = generateYNorth();
        break;

      // if east
      case "east":
        words[i].x = generateXEast(); //generateRandomNumber(canvas.width, canvas.width + 500); // generateXEast(); // new x placement
        break;

      // if west
      case "west":
        words[i].x = generateXWest();
        break;
    }
  }
}

function pause() {
  if (animationOn === true) {
    clearInterval(intervalValid);
    animationOn = false;
  } else {
    intervalValid = setInterval(draw, 50);
    animationOn = true;
  }
}

window.addEventListener("resize", windowResized);

function windowResized() {
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
  if (discoOn === false)
    chosenColor = matchColorToIndex(userColor.toLowerCase());

  // direction
  direction = document.getElementById("directions").value;

  createMatrixArray(direction);
}

// like a main method in java, this function gets executed upon runtime
function run() {
  // set up canvas
  canvasSetup();

  // read html values
  loadMenuOptions();

  // hideMenu();
  hideMenu();

  // run the animation
  intervalValid = setInterval(function () {
    draw();
  }, 50);
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

  if (checkBox.checked) {
    checkboxFunction();
  } else {
    selectFunction();
  }
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

function directionFunction() {}
