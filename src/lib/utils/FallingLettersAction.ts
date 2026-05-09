import { alphabet } from '$lib/constants/Assets';

/**
 * Svelte action that spawns falling Matrix characters on state changes.
 */
export function fallingLetters(node: HTMLElement, params: { value: unknown; color: string }) {
  const { value } = params;
  let { color } = params;
  let lastValue = value;

  function spawnLetters() {
    const rect = node.getBoundingClientRect();
    const count = 5 + Math.floor(Math.random() * 5);

    for (let i = 0; i < count; i++) {
      const span = document.createElement('span');
      span.textContent = alphabet[Math.floor(Math.random() * alphabet.length)];
      span.style.position = 'fixed';
      span.style.left = `${rect.left + Math.random() * rect.width}px`;
      span.style.top = `${rect.top + Math.random() * rect.height}px`;
      span.style.color = color;
      span.style.fontFamily = 'var(--font-mono)';
      span.style.fontSize = '1.2rem';
      span.style.pointerEvents = 'none';
      span.style.zIndex = '20000';
      span.style.opacity = '1';
      span.style.textShadow = `0 0 8px ${color}`;

      document.body.appendChild(span);

      const duration = 600 + Math.random() * 600;
      const xOffset = (Math.random() - 0.5) * 120;
      const yOffset = 150 + Math.random() * 150;
      const rotation = (Math.random() - 0.5) * 720;

      span.animate(
        [
          { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
          {
            transform: `translate(${xOffset}px, ${yOffset}px) rotate(${rotation}deg)`,
            opacity: 0,
          },
        ],
        {
          duration,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          fill: 'forwards',
        },
      ).onfinish = () => span.remove();
    }
  }

  return {
    update(newParams: { value: unknown; color: string }) {
      if (newParams.value !== lastValue) {
        spawnLetters();
        lastValue = newParams.value;
      }
      color = newParams.color;
    },
  };
}
