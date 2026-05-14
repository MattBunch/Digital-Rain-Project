import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import CyberSquareButton from '../CyberSquareButton.svelte';
import { createRawSnippet } from 'svelte';

describe('CyberSquareButton', () => {
  it('renders with children', () => {
    const children = createRawSnippet(() => ({
      render: () => '<span>S</span>',
    }));

    render(CyberSquareButton, { props: { children } });
    expect(screen.getAllByText('S')).toHaveLength(3);
  });

  it('calls onclick when clicked', async () => {
    const onclick = vi.fn();
    const children = createRawSnippet(() => ({
      render: () => '<span>S</span>',
    }));

    render(CyberSquareButton, { props: { onclick, children } });
    await fireEvent.click(screen.getAllByText('S')[0]);
    expect(onclick).toHaveBeenCalled();
  });

  it('applies color prop to style', () => {
    const children = createRawSnippet(() => ({
      render: () => '<span>S</span>',
    }));
    const color = '#ff0000';
    const { container } = render(CyberSquareButton, { props: { color, children } });
    const button = container.querySelector('button');
    expect(button?.getAttribute('style')).toContain('--theme-color: #ff0000');
  });
});
