/**
 * Svelte action that scrambles text on hover.
 */
export function scramble(node: HTMLElement, duration = 300) {
  let originalText = node.textContent || '';
  const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  let interval: ReturnType<typeof setInterval> | null = null;

  // MutationObserver to watch for text changes
  const observer = new MutationObserver(() => {
    // Only update originalText if we're not currently scrambling
    // to avoid infinite loops or capturing intermediate scrambled text
    if (!interval) {
      originalText = node.textContent || '';
    }
  });

  observer.observe(node, { characterData: true, childList: true, subtree: true });

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

      // Temporarily disconnect observer during scramble to prevent self-triggering
      observer.disconnect();
      node.textContent = scrambled;
      observer.observe(node, { characterData: true, childList: true, subtree: true });
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
      observer.disconnect();
      node.removeEventListener('mouseenter', startScrambling);
      node.removeEventListener('mouseleave', stopScrambling);
      if (interval) {
        clearInterval(interval);
      }
    },
  };
}
