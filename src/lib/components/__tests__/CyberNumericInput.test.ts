import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import CyberNumericInput from '../CyberNumericInput.svelte';

describe('CyberNumericInput', () => {
  it('renders with initial value and label', () => {
    render(CyberNumericInput, {
      props: {
        value: 10,
        label: 'REFRESH_RATE',
        id: 'test-input',
      },
    });

    const input = screen.getByLabelText(/REFRESH_RATE/i) as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('10');
  });

  it('increments value when [+] button is clicked', async () => {
    render(CyberNumericInput, {
      props: {
        value: 10,
        max: 100,
      },
    });

    const incrementBtn = screen.getByLabelText(/Increase/i);
    await fireEvent.click(incrementBtn);

    expect(screen.getByRole('spinbutton')).toHaveValue(11);
  });

  it('decrements value when [-] button is clicked', async () => {
    render(CyberNumericInput, {
      props: {
        value: 10,
        min: 1,
      },
    });

    const decrementBtn = screen.getByLabelText(/Decrease/i);
    await fireEvent.click(decrementBtn);

    expect(screen.getByRole('spinbutton')).toHaveValue(9);
  });

  it('enforces max boundary on increment', async () => {
    render(CyberNumericInput, {
      props: {
        value: 100,
        max: 100,
      },
    });

    const incrementBtn = screen.getByLabelText(/Increase/i);
    await fireEvent.click(incrementBtn);

    expect(screen.getByRole('spinbutton')).toHaveValue(100);
  });

  it('enforces min boundary on decrement', async () => {
    render(CyberNumericInput, {
      props: {
        value: 1,
        min: 1,
      },
    });

    const decrementBtn = screen.getByLabelText(/Decrease/i);
    await fireEvent.click(decrementBtn);

    expect(screen.getByRole('spinbutton')).toHaveValue(1);
  });

  it('handles manual input and clamps value', async () => {
    render(CyberNumericInput, {
      props: {
        value: 10,
        min: 1,
        max: 100,
      },
    });

    const input = screen.getByRole('spinbutton') as HTMLInputElement;

    // Test valid input
    await fireEvent.input(input, { target: { value: '25' } });
    expect(input.value).toBe('25');

    // Test above max
    await fireEvent.input(input, { target: { value: '150' } });
    expect(input.value).toBe('100');

    // Test below min
    await fireEvent.input(input, { target: { value: '0' } });
    expect(input.value).toBe('1');
  });
});
