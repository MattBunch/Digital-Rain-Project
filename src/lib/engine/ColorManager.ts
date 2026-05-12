import { COLORS } from '../constants/matrix';
import { generateRandomColorArray, getRandomColor } from '../utils/MathUtils';

export class ColorManager {
  colorChoiceArray: string[][];
  chosenColor: number = 0;
  discoOn: boolean = false;
  randomColorArray: string[];
  savedColor: string = COLORS.MATRIX_GREEN;

  constructor() {
    this.randomColorArray = generateRandomColorArray();
    this.colorChoiceArray = [
      COLORS.GREEN_VARIANTS,
      COLORS.RED_VARIANTS,
      COLORS.YELLOW_VARIANTS,
      COLORS.BLUE_VARIANTS,
      COLORS.ORANGE_VARIANTS,
      COLORS.PINK_VARIANTS,
      COLORS.CYAN_VARIANTS,
      this.randomColorArray,
    ];
  }

  updateRandomColor(): void {
    this.randomColorArray = generateRandomColorArray();
    this.colorChoiceArray[7] = this.randomColorArray;
  }

  matchColorToIndex(input: string): number {
    const map: Record<string, number> = {
      green: 0,
      red: 1,
      yellow: 2,
      blue: 3,
      orange: 4,
      pink: 5,
      cyan: 6,
      random: 7,
    };
    return map[input.toLowerCase()] ?? 0;
  }

  switchColor(input: string): void {
    this.chosenColor = this.matchColorToIndex(input);
  }

  getCurrentColorArray(): string[] {
    return this.colorChoiceArray[this.chosenColor];
  }

  handleDiscoFrame(
    discoFrameCounter: number,
    turnoverPoint: number,
  ): { color: string; reset: boolean } {
    if (discoFrameCounter > turnoverPoint) {
      const newColor = getRandomColor();
      this.savedColor = newColor;
      return { color: newColor, reset: true };
    }
    return { color: this.savedColor, reset: false };
  }
}
