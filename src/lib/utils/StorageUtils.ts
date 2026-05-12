import type { IPreset } from '../types';

const STORAGE_KEY = 'digital-rain-custom-presets';

export function saveCustomPreset(preset: IPreset): void {
  const presets = loadCustomPresets();
  const existingIndex = presets.findIndex((p) => p.name === preset.name);
  if (existingIndex > -1) {
    presets[existingIndex] = preset;
  } else {
    presets.push(preset);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
}

export function loadCustomPresets(): IPreset[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return [];
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to parse custom presets from localStorage', e);
    return [];
  }
}

export function deleteCustomPreset(name: string): void {
  const presets = loadCustomPresets();
  const filtered = presets.filter((p) => p.name !== name);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
