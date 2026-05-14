import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import CyberTextInput from '../CyberTextInput.svelte';

describe('CyberTextInput', () => {
  it('renders with label and placeholder', () => {
    render(CyberTextInput, {
      props: {
        label: 'TEST_LABEL',
        placeholder: 'TEST_PLACEHOLDER',
        value: '',
      },
    });

    expect(screen.getByText('TEST_LABEL')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('TEST_PLACEHOLDER')).toBeInTheDocument();
  });

  it('updates value on input', async () => {
    let value = '';
    render(CyberTextInput, {
      props: {
        value,
        'onupdate:value': (v: string) => (value = v),
      },
    });

    const input = screen.getByRole('textbox');
    await fireEvent.input(input, { target: { value: 'New Value' } });

    expect(input).toHaveValue('New Value');
  });

  it('calls onkeypress handler', async () => {
    const onkeypress = vi.fn();
    render(CyberTextInput, {
      props: {
        value: '',
        onkeypress,
      },
    });

    const input = screen.getByRole('textbox');
    await fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(onkeypress).toHaveBeenCalled();
  });
});
