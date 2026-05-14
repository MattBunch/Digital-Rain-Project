import type { IPreset, IEngineSettings } from '../types';

export const DEFAULT_SETTINGS: IEngineSettings = {
  discoOn: false,
  chosenColor: 'green',
  all4Directions: false,
  frameCount: 10,
  mode: 'normal',
  fontSize: 20,
  speed: 50,
};

export const PRESETS: IPreset[] = [
  {
    name: 'Classic Matrix',
    settings: {
      ...DEFAULT_SETTINGS,
      chosenColor: 'green',
    },
  },
  {
    name: 'Cyberpunk Pink',
    settings: {
      ...DEFAULT_SETTINGS,
      chosenColor: 'pink',
      all4Directions: true,
    },
  },
  {
    name: 'Fast Disco',
    settings: {
      ...DEFAULT_SETTINGS,
      discoOn: true,
      speed: 20,
      frameCount: 5,
    },
  },
  {
    name: 'Blue Square',
    settings: {
      ...DEFAULT_SETTINGS,
      chosenColor: 'blue',
      mode: 'square',
    },
  },
];
