import { describe, expect, it } from 'vitest';
import { COLORS } from '../../constants/matrix';
import { ColorManager } from '../ColorManager';

describe('ColorManager', () => {
  it('maps color names and falls back to green', () => {
    const manager = new ColorManager();

    expect(manager.matchColorToIndex('green')).toBe(0);
    expect(manager.matchColorToIndex('RANDOM')).toBe(7);
    expect(manager.matchColorToIndex('unknown')).toBe(0);
  });

  it('switches and returns the current color array', () => {
    const manager = new ColorManager();

    manager.switchColor('cyan');

    expect(manager.chosenColor).toBe(6);
    expect(manager.getCurrentColorArray()).toBe(COLORS.CYAN_VARIANTS);
  });

  it('replaces the random color array', () => {
    const manager = new ColorManager();
    const initialRandomColors = manager.randomColorArray;

    manager.updateRandomColor();

    expect(manager.randomColorArray).not.toBe(initialRandomColors);
    expect(manager.colorChoiceArray[7]).toBe(manager.randomColorArray);
    expect(manager.randomColorArray).toHaveLength(3);
  });

  it('keeps saved disco color until the frame counter rolls over', () => {
    const manager = new ColorManager();
    manager.savedColor = '#123456';

    expect(manager.handleDiscoFrame(3, 10)).toEqual({
      color: '#123456',
      reset: false,
    });

    const result = manager.handleDiscoFrame(11, 10);

    expect(result.color).toMatch(/^#[0-9a-f]{6}$/i);
    expect(result.reset).toBe(true);
    expect(manager.savedColor).toBe(result.color);
  });

  it('uses an external disco color override when one is set', () => {
    const manager = new ColorManager();

    manager.setDiscoColorOverride('#abcdef');

    expect(manager.savedColor).toBe('#abcdef');
    expect(manager.handleDiscoFrame(11, 10)).toEqual({
      color: '#abcdef',
      reset: false,
    });

    manager.setDiscoColorOverride(null);

    const result = manager.handleDiscoFrame(11, 10);

    expect(result.color).toMatch(/^#[0-9a-f]{6}$/i);
    expect(result.reset).toBe(true);
  });
});
