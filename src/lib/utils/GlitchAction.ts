/**
 * Svelte action that triggers a one-off glitch animation on click.
 */
export function glitchClick(node: HTMLElement, params: { color?: string; duration?: number } = {}) {
  let { duration = 300 } = params;

  function triggerGlitch() {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      if (progress >= 1) {
        node.style.textShadow = 'none';
        node.style.transform = 'none';
        node.style.filter = 'none';
        node.style.opacity = '1';
        return;
      }

      // Reverse progress for the "tick" logic if needed,
      // but here we just want a momentary glitch and back.
      // Let's use a bell-like curve for the glitch intensity.
      const intensity = 1 - Math.abs(progress - 0.5) * 2; // peaks at 0.5

      const jitter = (Math.random() - 0.5) * 6 * intensity;
      const blur = intensity * 3;
      const shadowDist = intensity * 8;

      node.style.transform = `translateX(${jitter}px)`;
      node.style.filter = `blur(${blur}px) brightness(${1 + intensity * 0.5})`;
      node.style.textShadow = ` ${shadowDist}px 0 rgba(255,0,0,0.7), -${shadowDist}px 0 rgba(0,255,255,0.7) `;

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }

  node.addEventListener('mousedown', triggerGlitch);

  return {
    update(newParams: { color?: string; duration?: number } = {}) {
      duration = newParams.duration || 300;
    },
    destroy() {
      node.removeEventListener('mousedown', triggerGlitch);
    },
  };
}
