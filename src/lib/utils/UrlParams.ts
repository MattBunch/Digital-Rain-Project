import type { IEngineSettings } from '../types';

const KEY_MAP: Record<string, keyof IEngineSettings> = {
  d: 'discoOn',
  c: 'chosenColor',
  a: 'all4Directions',
  f: 'frameCount',
  m: 'mode',
  s: 'fontSize',
  v: 'speed',
  i: 'intensity',
  cs: 'charSet',
  ccs: 'customCharSet',
  p: 'perStringColor',
  wd: 'waveDistortion',
};

const REVERSE_KEY_MAP = Object.fromEntries(
  Object.entries(KEY_MAP).map(([k, v]) => [v, k]),
) as Record<keyof IEngineSettings, string>;

export function serializeSettings(settings: IEngineSettings): string {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(settings)) {
    const shortKey = REVERSE_KEY_MAP[key as keyof IEngineSettings];
    if (shortKey) {
      let val: string;
      if (typeof value === 'boolean') {
        val = value ? '1' : '0';
      } else {
        val = String(value);
      }
      parts.push(`${shortKey}=${encodeURIComponent(val)}`);
    }
  }
  return parts.join('&');
}

export function deserializeSettings(hash: string): Partial<IEngineSettings> {
  const settings: Partial<IEngineSettings> = {};
  const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!cleanHash) {
    return settings;
  }

  const params = new URLSearchParams(cleanHash);
  for (const [shortKey, value] of params.entries()) {
    const fullKey = KEY_MAP[shortKey];
    if (fullKey) {
      if (
        fullKey === 'discoOn' ||
        fullKey === 'all4Directions' ||
        fullKey === 'perStringColor' ||
        fullKey === 'waveDistortion'
      ) {
        settings[fullKey] = value === '1';
      } else if (
        fullKey === 'frameCount' ||
        fullKey === 'fontSize' ||
        fullKey === 'speed' ||
        fullKey === 'intensity'
      ) {
        const num = parseInt(value, 10);
        if (!isNaN(num)) {
          settings[fullKey] = num;
        }
      } else if (fullKey === 'mode') {
        if (value === 'normal' || value === 'square') {
          settings[fullKey] = value;
        }
      } else if (fullKey === 'charSet') {
        if (
          value === 'katakana' ||
          value === 'latin' ||
          value === 'binary' ||
          value === 'hex' ||
          value === 'braille' ||
          value === 'custom'
        ) {
          settings[fullKey] = value;
        }
      } else if (fullKey === 'chosenColor' || fullKey === 'customCharSet') {
        settings[fullKey] = value;
      }
    }
  }
  return settings;
}
