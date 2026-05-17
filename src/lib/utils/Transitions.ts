/**
 * Svelte transition that adds a visual "signal morph" glitch effect.
 * Ported from SettingsMenu for reusability.
 */
interface SignalMorphParams {
  duration?: number;
  jitterX?: number;
  jitterY?: number;
  blur?: number;
  brightness?: number;
  shadowDistance?: number;
}

export function signalMorph(
  node: HTMLElement,
  {
    duration = 400,
    jitterX = 8,
    jitterY = 2,
    blur = 4,
    brightness = 0.5,
    shadowDistance = 8,
  }: SignalMorphParams = {},
) {
  const isTest = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
  const activeDuration = isTest ? 0 : duration;

  return {
    duration: activeDuration,
    tick: (t: number) => {
      // Create a more aggressive "jitter" effect during the transition
      // We use a non-linear jitter that peaks in the middle
      const strength = Math.sin(t * Math.PI);
      const jitterOffsetX = strength * (Math.random() - 0.5) * jitterX;
      const jitterOffsetY = strength * (Math.random() - 0.5) * jitterY;

      const blurAmount = (1 - t) * blur * strength;
      const brightnessAmount = 1 + strength * (Math.random() * brightness);

      node.style.transform = `translate(${jitterOffsetX}px, ${jitterOffsetY}px)`;
      node.style.filter = `blur(${blurAmount}px) brightness(${brightnessAmount})`;
      node.style.opacity = `${t}`;

      // Enhanced Chromatic Aberration effect via text-shadow
      if (t < 1) {
        const shadowDist = strength * shadowDistance;
        node.style.textShadow = `
          ${shadowDist}px 0 rgba(255,0,60,0.8),
          -${shadowDist}px 0 rgba(0,229,255,0.8)
        `;
      } else {
        node.style.textShadow = 'none';
        node.style.transform = 'none';
        node.style.filter = 'none';
      }
    },
  };
}
