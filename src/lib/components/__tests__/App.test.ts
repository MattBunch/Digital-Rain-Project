import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import App from '../../../App.svelte';
vi.mock('$lib/components/MatrixCanvas.svelte', async () => {
  const Mock = await import('./MockMatrixCanvas.svelte');
  return { default: Mock.default };
});

describe('App', () => {
  it('renders SettingsMenu on load', () => {
    render(App);
    expect(screen.getByText('DIGITAL RAIN')).toBeInTheDocument();
    expect(screen.getAllByText('START')[0]).toBeInTheDocument();
  });

  it('shows MatrixCanvas and hides menu after onStartNormal', async () => {
    render(App);
    const startBtn = screen.getAllByText('START')[0];
    await fireEvent.click(startBtn);

    expect(screen.queryByText('DIGITAL RAIN')).not.toBeInTheDocument();
    expect(screen.getByText('MOCK_RETURN')).toBeInTheDocument();
  });

  it('shows MatrixCanvas and hides menu after onStartSquare', async () => {
    render(App);
    const squareBtn = screen.getAllByText('SQUARE')[0];
    await fireEvent.click(squareBtn);

    expect(screen.queryByText('DIGITAL RAIN')).not.toBeInTheDocument();
    expect(screen.getByText('MOCK_RETURN')).toBeInTheDocument();
  });

  it('returns to SettingsMenu when MatrixCanvas onReturn is called', async () => {
    render(App);
    await fireEvent.click(screen.getAllByText('START')[0]);

    const returnBtn = screen.getByText('MOCK_RETURN');
    await fireEvent.click(returnBtn);

    expect(screen.getByText('DIGITAL RAIN')).toBeInTheDocument();
  });
});
