import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import CyberButton from '../CyberButton.svelte';
import { createRawSnippet } from 'svelte';

describe('CyberButton', () => {
  it('renders with children', () => {
    const children = createRawSnippet(() => ({
      render: () => '<span>CLICK ME</span>',
    }));

    render(CyberButton, { props: { children } });
    // Should have 3 occurrences because of glitch layers
    expect(screen.getAllByText('CLICK ME')).toHaveLength(3);
  });

  it('calls onclick when clicked', async () => {
    const onclick = vi.fn();
    const children = createRawSnippet(() => ({
      render: () => '<span>CLICK ME</span>',
    }));

    render(CyberButton, { props: { onclick, children } });
    await fireEvent.click(screen.getAllByText('CLICK ME')[0]);
    expect(onclick).toHaveBeenCalled();
  });

  it('applies color prop to style', () => {
    const children = createRawSnippet(() => ({
      render: () => '<span>CLICK ME</span>',
    }));
    const color = '#ff0000';
    const { container } = render(CyberButton, { props: { color, children } });
    const button = container.querySelector('button');
    expect(button?.getAttribute('style')).toContain('--glow-color: #ff0000');
  });

  it('applies variant class', () => {
    const children = createRawSnippet(() => ({
      render: () => '<span>CLICK ME</span>',
    }));
    const { container: primaryContainer } = render(CyberButton, {
      props: { variant: 'primary', children },
    });
    expect(primaryContainer.querySelector('.primary')).toBeInTheDocument();

    const { container: secondaryContainer } = render(CyberButton, {
      props: { variant: 'secondary', children },
    });
    expect(secondaryContainer.querySelector('.secondary')).toBeInTheDocument();
  });
});
