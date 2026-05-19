import { afterEach, describe, expect, it, vi } from 'vitest';
import { signalMorph } from '../Transitions';

describe('signalMorph', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('uses zero duration in test mode', () => {
    vi.stubEnv('NODE_ENV', 'test');
    const node = document.createElement('div');
    const transition = signalMorph(node, { duration: 750 });

    expect(transition.duration).toBe(0);
  });

  it('applies jitter styles during transition and resets at completion', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.spyOn(Math, 'random').mockReturnValue(1);
    const node = document.createElement('div');
    const transition = signalMorph(node, {
      duration: 750,
      jitterX: 10,
      jitterY: 4,
      blur: 5,
      brightness: 0.25,
      shadowDistance: 9,
    });

    expect(transition.duration).toBe(750);

    transition.tick(0.5);
    expect(node.style.transform).toBe('translate(5px, 2px)');
    expect(node.style.filter).toContain('blur(2.5px)');
    expect(node.style.filter).toContain('brightness(1.25)');
    expect(node.style.opacity).toBe('0.5');
    expect(node.style.textShadow).toContain('rgba(255,0,60,0.8)');

    transition.tick(1);
    expect(node.style.textShadow).toBe('none');
    expect(node.style.transform).toBe('none');
    expect(node.style.filter).toBe('none');
  });
});
