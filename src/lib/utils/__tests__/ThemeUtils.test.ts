import { beforeEach, describe, expect, it } from 'vitest';
import {
  isThemeMode,
  loadThemeMode,
  resolveTheme,
  saveThemeMode,
  THEME_STORAGE_KEY,
} from '../ThemeUtils';

describe('ThemeUtils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('validates supported theme modes', () => {
    expect(isThemeMode('system')).toBe(true);
    expect(isThemeMode('dark')).toBe(true);
    expect(isThemeMode('light')).toBe(true);
    expect(isThemeMode('sepia')).toBe(false);
    expect(isThemeMode(null)).toBe(false);
  });

  it('loads system mode by default and ignores invalid storage', () => {
    expect(loadThemeMode()).toBe('system');

    localStorage.setItem(THEME_STORAGE_KEY, 'sepia');
    expect(loadThemeMode()).toBe('system');
  });

  it('saves and loads theme mode', () => {
    saveThemeMode('light');
    expect(loadThemeMode()).toBe('light');
  });

  it('resolves system mode from OS preference with dark fallback', () => {
    expect(resolveTheme('system', false)).toBe('dark');
    expect(resolveTheme('system', true)).toBe('light');
    expect(resolveTheme('dark', true)).toBe('dark');
    expect(resolveTheme('light', false)).toBe('light');
  });
});
