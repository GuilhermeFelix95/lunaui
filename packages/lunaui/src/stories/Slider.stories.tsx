import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Slider, type SliderProps } from '../Slider';

function Demo(props: Omit<SliderProps, 'value' | 'onValueChange' | 'label'>) {
  const [v, setV] = useState(40);
  return <Slider {...props} label="Volume" value={v} onValueChange={setV} />;
}

const meta: Meta<typeof Demo> = { component: Demo, args: { showValue: true } };
export default meta;

type Story = StoryObj<typeof Demo>;
export const Continuo: Story = {};
export const Passos: Story = { args: { min: 1, max: 5, step: 1 } };
export const Desabilitado: Story = { args: { disabled: true } };
