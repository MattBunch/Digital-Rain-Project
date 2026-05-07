/**
 * Svelte action that scrambles text on hover.
 */
export function scramble(
  node: HTMLElement,
  params: { text?: string; duration?: number } | string | number = {},
) {
  let textParam: string | undefined;
  let duration = 300;

  if (typeof params === 'string') {
    textParam = params;
  } else if (typeof params === 'number') {
    duration = params;
  } else if (typeof params === 'object') {
    textParam = params.text;
    duration = params.duration || 300;
  }

  let originalText = textParam || node.textContent || '';
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
    update(newParams: { text?: string; duration?: number } | string | number = {}) {
      if (typeof newParams === 'string') {
        textParam = newParams;
      } else if (typeof newParams === 'number') {
        duration = newParams;
      } else if (typeof newParams === 'object') {
        textParam = newParams.text;
        duration = newParams.duration || 300;
      }

      if (textParam !== undefined && textParam !== originalText) {
        originalText = textParam;
        if (!interval) {
          node.textContent = originalText;
        }
      }
    },
    destroy() {
      node.removeEventListener('mouseenter', startScrambling);
      node.removeEventListener('mouseleave', stopScrambling);
      if (interval) {
        clearInterval(interval);
      }
    },
  };
}
