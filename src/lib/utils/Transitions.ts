/**
 * Svelte transition that adds a visual "signal morph" glitch effect.
 * Ported from SettingsMenu for reusability.
 */
export function signalMorph(node: HTMLElement, { duration = 400 }) {
  const isTest = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
  const activeDuration = isTest ? 0 : duration;

  return {
    duration: activeDuration,
    tick: (t: number) => {
      // Create a more aggressive "jitter" effect during the transition
      // We use a non-linear jitter that peaks in the middle
      const strength = Math.sin(t * Math.PI);
      const jitterX = strength * (Math.random() - 0.5) * 8;
      const jitterY = strength * (Math.random() - 0.5) * 2;

      const blur = (1 - t) * 4 * strength;
      const brightness = 1 + strength * (Math.random() * 0.5);

      node.style.transform = `translate(${jitterX}px, ${jitterY}px)`;
      node.style.filter = `blur(${blur}px) brightness(${brightness})`;
      node.style.opacity = `${t}`;

      // Enhanced Chromatic Aberration effect via text-shadow
      if (t < 1) {
        const shadowDist = strength * 8;
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
