// src/constants/Assets.js

export const alphabet =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';

export const colorMatrixGreen = '#00ff41';
export const color90White10Green = '#ccffd9';
export const color70White30Green = '#80ff9f';
export const greenArray = [color90White10Green, color70White30Green, colorMatrixGreen];

export const color90White10Red = '#ffcccc';
export const color70White30Red = '#ff6666';
export const colorRed = '#e60000';
export const redArray = [color90White10Red, color70White30Red, colorRed];

export const color95White5Yellow = '#ffffe6';
export const color70White30Yellow = '#ffff66';
export const colorYellow = '#ffff00';
export const yellowArray = [color95White5Yellow, color70White30Yellow, colorYellow];

export const color95White5Blue = '#e6e6ff';
export const color70White30Blue = '#6666ff';
export const colorBlue = '#0000ff';
export const blueArray = [color95White5Blue, color70White30Blue, colorBlue];

export const color95White5Orange = '#fff5e6';
export const color70White30Orange = '#ffc266';
export const colorOrange = '#ff9900';
export const orangeArray = [color95White5Orange, color70White30Orange, colorOrange];

export const color95White5Pink = '#ffe6ff';
export const color70White30Pink = '#ff66ff';
export const colorPink = '#ff00ff';
export const pinkArray = [color95White5Pink, color70White30Pink, colorPink];

export const color95White5Cyan = '#e6ffff';
export const color70White30Cyan = '#66ffff';
export const colorCyan = '#00ffff';
export const cyanArray = [color95White5Cyan, color70White30Cyan, colorCyan];

export const colorWhite = '#ffffff';
export const colorBlack = '#000000';

export const vertical = 'vertical';
export const horizontal = 'horizontal';

export const helpText = `
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
  - P: Increase random square speed
  - ;: Decrease random square speed
  `;
