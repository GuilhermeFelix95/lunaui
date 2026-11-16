import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { RadioGroup, type RadioGroupProps } from '../Radio';

function Demo(props: Omit<RadioGroupProps, 'value' | 'onValueChange' | 'children'>) {
  const [v, setV] = useState('free');
  return (
    <RadioGroup {...props} value={v} onValueChange={setV}>
      <RadioGroup.Radio value="free" label="Gratuito" description="Até 3 projetos" />
      <RadioGroup.Radio value="pro" label="Pro" description="Projetos ilimitados" />
      <RadioGroup.Radio value="biz" label="Empresa" description="Indisponível na sua região" disabled />
    </RadioGroup>
  );
}

const meta: Meta<typeof Demo> = { component: Demo, args: { label: 'Plano' } };
export default meta;

type Story = StoryObj<typeof Demo>;
export const Lista: Story = {};
export const Cartoes: Story = { args: { variant: 'card' } };
export const Horizontal: Story = { args: { direction: 'row' } };
