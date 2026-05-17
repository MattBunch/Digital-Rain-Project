export interface ICoordinate {
  x: number;
  y: number;
}

export interface IMatrixStringOptions {
  word: string;
  speed: number;
  fontSize: number;
  canvasHeight: number;
  x: number;
  y: number;
  color: string;
  isAll4Directions?: boolean;
}

export type Direction =
  | 'north'
  | 'south'
  | 'east'
  | 'west'
  | 'northeast'
  | 'northwest'
  | 'southeast'
  | 'southwest';

export type MouseInteractionMode = 'off' | 'repel' | 'attract';

export interface IMouseInteractionState {
  x: number;
  y: number;
  active: boolean;
  mode: MouseInteractionMode;
}

export interface IMatrixStringConfig {
  rapidWordChange: boolean;
  discoOn: boolean;
  direction: string;
  alphabet?: string;
  waveDistortion?: boolean;
  mouseInteraction?: IMouseInteractionState;
}

export interface ISquareConfig {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  alternativeFontSize: number;
  returnAlternativeFadeCondition: (
    index: number,
    x: number,
    y: number,
    config: ISquareConfig,
    direction: string,
  ) => boolean;
  discoColorCounterCheck: (ctx: CanvasRenderingContext2D) => void;
  getRandomColor: () => string;
}

export interface IEngineSettings {
  discoOn: boolean;
  chosenColor: string;
  all4Directions: boolean;
  all8Directions: boolean;
  frameCount: number;
  mode: 'normal' | 'square';
  fontSize: number;
  speed: number;
  intensity: number;
  charSet: 'katakana' | 'latin' | 'binary' | 'hex' | 'braille' | 'custom';
  customCharSet: string;
  perStringColor: boolean;
  waveDistortion: boolean;
  mouseInteractionMode: MouseInteractionMode;
}

export interface IPreset {
  name: string;
  settings: IEngineSettings;
}
