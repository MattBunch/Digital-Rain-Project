import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import CRTOverlay from '../CRTOverlay.svelte';
import { createRawSnippet } from 'svelte';

describe('CRTOverlay', () => {
  it('renders children and overlay elements', () => {
    const children = createRawSnippet(() => ({
      render: () => '<div id="test-child">CONTENT</div>',
    }));

    const { container } = render(CRTOverlay, { props: { children } });

    expect(container.querySelector('#test-child')).toBeInTheDocument();
    expect(container.querySelector('.scanlines')).toBeInTheDocument();
    expect(container.querySelector('.vignette')).toBeInTheDocument();
    expect(container.querySelector('.flicker')).toBeInTheDocument();
  });
});
