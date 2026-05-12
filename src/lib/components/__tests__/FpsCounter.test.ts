import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import FpsCounter from '../FpsCounter.svelte';

describe('FpsCounter', () => {
  it('renders nothing when not visible', () => {
    render(FpsCounter, { props: { fps: 60, visible: false } });
    expect(screen.queryByText('FPS:')).not.toBeInTheDocument();
  });

  it('renders fps value when visible', () => {
    render(FpsCounter, { props: { fps: 123, visible: true } });
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('FPS:')).toBeInTheDocument();
  });

  it('updates when fps prop changes', async () => {
    const { rerender } = render(FpsCounter, { props: { fps: 60, visible: true } });
    expect(screen.getByText('60')).toBeInTheDocument();

    await rerender({ fps: 144, visible: true });
    expect(screen.getByText('144')).toBeInTheDocument();
  });
});
