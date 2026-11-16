import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { SegmentedControl, type SegmentedControlProps } from '../SegmentedControl';

function Demo(props: Omit<SegmentedControlProps, 'value' | 'onValueChange' | 'options'>) {
  const [v, setV] = useState('dia');
  return (
    <SegmentedControl
      {...props}
      value={v}
      onValueChange={setV}
      options={[
        { value: 'dia', label: 'Dia' },
        { value: 'semana', label: 'Semana' },
        { value: 'mes', label: 'Mês' },
      ]}
    />
  );
}

const meta: Meta<typeof Demo> = { component: Demo, args: { accessibilityLabel: 'Período' } };
export default meta;

type Story = StoryObj<typeof Demo>;
export const LarguraTotal: Story = {};
export const Pequeno: Story = { args: { size: 'sm', fullWidth: false } };
