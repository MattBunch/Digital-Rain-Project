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
  discoOn: boolean;
  chosenColor: string;
  all4Directions: boolean;
  frameCount: number;
  mode: 'normal' | 'square';
  fontSize: number;
  speed: number;
}

export interface IPreset {
  name: string;
  settings: IEngineSettings;
}
