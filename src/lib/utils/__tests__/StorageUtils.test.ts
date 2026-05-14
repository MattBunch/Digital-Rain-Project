import { describe, it, expect, beforeEach, vi } from 'vitest';
import { saveCustomPreset, loadCustomPresets, deleteCustomPreset } from '../StorageUtils';
import { DEFAULT_SETTINGS } from '../../constants/presets';

describe('StorageUtils', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should save and load custom presets', () => {
    const preset = {
      name: 'My Custom',
      settings: { ...DEFAULT_SETTINGS, chosenColor: 'blue' },
    };
    saveCustomPreset(preset);

    const loaded = loadCustomPresets();
    expect(loaded).toHaveLength(1);
    expect(loaded[0]).toEqual(preset);
  });

  it('should update existing preset with same name', () => {
    const preset1 = {
      name: 'Same Name',
      settings: { ...DEFAULT_SETTINGS, chosenColor: 'blue' },
    };
    const preset2 = {
      name: 'Same Name',
      settings: { ...DEFAULT_SETTINGS, chosenColor: 'red' },
    };

    saveCustomPreset(preset1);
    saveCustomPreset(preset2);

    const loaded = loadCustomPresets();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].settings.chosenColor).toBe('red');
  });

  it('should delete presets', () => {
    const preset1 = {
      name: 'P1',
      settings: DEFAULT_SETTINGS,
    };
    const preset2 = {
      name: 'P2',
      settings: DEFAULT_SETTINGS,
    };

    saveCustomPreset(preset1);
    saveCustomPreset(preset2);
    expect(loadCustomPresets()).toHaveLength(2);

    deleteCustomPreset('P1');
    const loaded = loadCustomPresets();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].name).toBe('P2');
  });

  it('should handle corrupted localStorage gracefully', () => {
    localStorage.setItem('digital-rain-custom-presets', 'invalid-json');
    const loaded = loadCustomPresets();
    expect(loaded).toEqual([]);
  });
});
