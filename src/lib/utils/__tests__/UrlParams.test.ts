import { describe, it, expect } from 'vitest';
import { serializeSettings, deserializeSettings } from '../UrlParams';
import { DEFAULT_SETTINGS } from '../../constants/presets';

describe('UrlParams', () => {
  it('should serialize settings correctly', () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      chosenColor: 'red',
      discoOn: true,
      fontSize: 30,
    };
    const hash = serializeSettings(settings);
    expect(hash).toContain('c=red');
    expect(hash).toContain('d=1');
    expect(hash).toContain('s=30');
    expect(hash).toContain('a=0'); // default
    expect(hash).toContain('i=100');
    expect(hash).toContain('cs=katakana');
    expect(hash).toContain('ccs=');
  });

  it('should deserialize settings correctly', () => {
    const hash = '#c=blue&d=0&s=25&v=60&m=square&a=1&f=15&i=150&cs=binary&ccs=101010';
    const settings = deserializeSettings(hash);
    expect(settings.chosenColor).toBe('blue');
    expect(settings.discoOn).toBe(false);
    expect(settings.fontSize).toBe(25);
    expect(settings.speed).toBe(60);
    expect(settings.mode).toBe('square');
    expect(settings.all4Directions).toBe(true);
    expect(settings.frameCount).toBe(15);
    expect(settings.intensity).toBe(150);
    expect(settings.charSet).toBe('binary');
    expect(settings.customCharSet).toBe('101010');
  });

  it('should handle malformed hashes gracefully', () => {
    const hash = '#c=invalid&d=not-a-boolean&s=NaN';
    const settings = deserializeSettings(hash);
    expect(settings.chosenColor).toBe('invalid'); // it just takes it
    expect(settings.discoOn).toBe(false); // value === '1' is false
    expect(settings.fontSize).toBeUndefined(); // NaN check
  });

  it('should return empty object for empty hash', () => {
    expect(deserializeSettings('')).toEqual({});
    expect(deserializeSettings('#')).toEqual({});
  });

  it('should handle missing keys', () => {
    const hash = '#c=green';
    const settings = deserializeSettings(hash);
    expect(settings.chosenColor).toBe('green');
    expect(Object.keys(settings)).toHaveLength(1);
  });
});
