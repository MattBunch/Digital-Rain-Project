import type { ResolvedTheme, ThemeMode } from '$lib/types';

export const THEME_STORAGE_KEY = 'digital-rain-theme-mode';

export function isThemeMode(value: string | null): value is ThemeMode {
  return value === 'system' || value === 'dark' || value === 'light';
}

export function loadThemeMode(): ThemeMode {
  if (typeof localStorage === 'undefined') {
    return 'system';
  }

  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  return isThemeMode(storedTheme) ? storedTheme : 'system';
}

export function saveThemeMode(themeMode: ThemeMode): void {
  if (typeof localStorage === 'undefined') {
    return;
  }

  localStorage.setItem(THEME_STORAGE_KEY, themeMode);
}

export function resolveTheme(themeMode: ThemeMode, osPrefersLight: boolean): ResolvedTheme {
  if (themeMode === 'light' || (themeMode === 'system' && osPrefersLight)) {
    return 'light';
  }

  return 'dark';
}
