// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Chip, Radio, RadioGroup, Rating, SegmentedControl, Select, Slider } from './index';

afterEach(cleanup);

describe('formulário', () => {
  it('Slider atualiza --lk-p e avisa a mudança', () => {
    const on = vi.fn();
    render(<Slider defaultValue={0} onValueChange={on} aria-label="vol" />);
    const el = screen.getByRole('slider') as HTMLInputElement;
    fireEvent.change(el, { target: { value: '50' } });
    expect(on).toHaveBeenCalledWith(50);
    expect(el.style.getPropertyValue('--lk-p')).toBe('0.5');
  });
  it('Chip expõe aria-pressed', async () => {
    render(<Chip selected>x</Chip>);
    expect(screen.getByRole('button').getAttribute('aria-pressed')).toBe('true');
  });
  it('SegmentedControl troca pelas setas', async () => {
    render(<SegmentedControl aria-label="p" options={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]} />);
    screen.getByRole('radio', { name: 'A' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'B' }).getAttribute('aria-checked')).toBe('true');
  });
  it('RadioGroup seleciona uma opção', async () => {
    render(<RadioGroup><Radio name="r" label="Mensal" /><Radio name="r" label="Anual" /></RadioGroup>);
    await userEvent.click(screen.getByLabelText('Anual'));
    expect((screen.getByLabelText('Anual') as HTMLInputElement).checked).toBe(true);
  });
  it('Rating chama onValueChange', async () => {
    const on = vi.fn();
    render(<Rating onValueChange={on} />);
    await userEvent.click(screen.getByRole('radio', { name: '3' }));
    expect(on).toHaveBeenCalledWith(3);
  });
  it('Select marca erro', () => {
    render(<Select error><option>a</option></Select>);
    expect(screen.getByRole('combobox').getAttribute('aria-invalid')).toBe('true');
  });
});
