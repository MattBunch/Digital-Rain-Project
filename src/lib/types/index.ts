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

export type Direction = 'north' | 'south' | 'east' | 'west';

export interface IEngineSettings {
  defaultFontSize: number;
  all4Directions: boolean;
  direction: Direction;
  isDisco: boolean;
  frameCount: number;
  color: string;
}
