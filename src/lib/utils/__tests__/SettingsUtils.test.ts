import { describe, it, expect } from 'vitest';
import { compareSettings } from '../SettingsUtils';
import { DEFAULT_SETTINGS } from '../../constants/presets';

describe('SettingsUtils', () => {
  it('should return true for identical settings', () => {
    const s1 = { ...DEFAULT_SETTINGS };
    const s2 = { ...DEFAULT_SETTINGS };
    expect(compareSettings(s1, s2)).toBe(true);
  });

  it('should return false for different settings', () => {
    const s1 = { ...DEFAULT_SETTINGS, chosenColor: 'green' };
    const s2 = { ...DEFAULT_SETTINGS, chosenColor: 'red' };
    expect(compareSettings(s1, s2)).toBe(false);

    expect(compareSettings({ ...s1, discoOn: true }, s1)).toBe(false);
    expect(compareSettings({ ...s1, all4Directions: true }, s1)).toBe(false);
    expect(compareSettings({ ...s1, frameCount: 20 }, s1)).toBe(false);
    expect(compareSettings({ ...s1, mode: 'square' }, s1)).toBe(false);
    expect(compareSettings({ ...s1, fontSize: 30 }, s1)).toBe(false);
    expect(compareSettings({ ...s1, speed: 10 }, s1)).toBe(false);
  });
});
