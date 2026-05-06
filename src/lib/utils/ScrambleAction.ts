/**
 * Svelte action that scrambles text on hover.
 */
export function scramble(node: HTMLElement, duration = 300) {
  const originalText = node.textContent || '';
  const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  let interval: ReturnType<typeof setInterval> | null = null;

  function startScrambling() {
    if (interval) {
      return;
    }

    const startTime = Date.now();

    interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      if (progress >= 1) {
        node.textContent = originalText;
        if (interval) {
          clearInterval(interval);
        }
        interval = null;
        return;
      }

      const scrambled = originalText
        .split('')
        .map((char, i) => {
          if (char === ' ' || char === '\n') {
            return char;
          }
          // Slowly reveal the original text
          if (i / originalText.length < progress * 0.8) {
            return char;
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      node.textContent = scrambled;
    }, 40);
  }

  function stopScrambling() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    node.textContent = originalText;
  }

  node.addEventListener('mouseenter', startScrambling);
  node.addEventListener('mouseleave', stopScrambling);

  return {
    destroy() {
      node.removeEventListener('mouseenter', startScrambling);
      node.removeEventListener('mouseleave', stopScrambling);
      if (interval) {
        clearInterval(interval);
      }
    },
  };
}
