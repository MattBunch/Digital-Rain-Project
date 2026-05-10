/**
 * Svelte transition that adds a visual "signal morph" glitch effect.
 * Ported from SettingsMenu for reusability.
 */
export function signalMorph(node: HTMLElement, { duration = 300 }) {
  const isTest = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
  const activeDuration = isTest ? 0 : duration;

  return {
    duration: activeDuration,
    tick: (t: number) => {
      // Create a "jitter" effect during the mid-transition
      const jitter = t > 0.1 && t < 0.9 ? (Math.random() - 0.5) * 4 : 0;
      const blur = (1 - t) * 2;
      node.style.transform = `translateX(${jitter}px)`;
      node.style.filter = `blur(${blur}px) brightness(${t < 0.5 ? 1.5 : 1})`;
      node.style.opacity = `${t}`;

      // Chromatic Aberration effect via text-shadow
      if (t < 1) {
        const shadowDist = (1 - t) * 5;
        node.style.textShadow = ` ${shadowDist}px 0 rgba(255,0,0,0.7), -${shadowDist}px 0 rgba(0,255,255,0.7) `;
      } else {
        node.style.textShadow = 'none';
        node.style.transform = 'none';
        node.style.filter = 'none';
      }
    },
  };
}
