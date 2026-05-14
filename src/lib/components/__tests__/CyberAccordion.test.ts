import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import CyberAccordion from '../CyberAccordion.svelte';
import { createRawSnippet } from 'svelte';

describe('CyberAccordion', () => {
  it('renders title', () => {
    render(CyberAccordion, { props: { title: 'TEST_TITLE' } });
    expect(screen.getByText('TEST_TITLE')).toBeInTheDocument();
  });

  it('is closed by default and does not render content', () => {
    const children = createRawSnippet(() => ({
      render: () => '<div>HIDDEN_CONTENT</div>',
    }));
    render(CyberAccordion, { props: { title: 'TITLE', children } });
    expect(screen.queryByText('HIDDEN_CONTENT')).not.toBeInTheDocument();
  });

  it('opens when header is clicked', async () => {
    const children = createRawSnippet(() => ({
      render: () => '<div>VISIBLE_CONTENT</div>',
    }));
    render(CyberAccordion, { props: { title: 'TITLE', children } });

    const header = screen.getByRole('button');
    await fireEvent.click(header);

    expect(screen.getByText('VISIBLE_CONTENT')).toBeInTheDocument();
  });

  it('can be controlled via isOpen prop', () => {
    const children = createRawSnippet(() => ({
      render: () => '<div>PROPPED_CONTENT</div>',
    }));
    render(CyberAccordion, { props: { title: 'TITLE', isOpen: true, children } });
    expect(screen.getByText('PROPPED_CONTENT')).toBeInTheDocument();
  });
});
