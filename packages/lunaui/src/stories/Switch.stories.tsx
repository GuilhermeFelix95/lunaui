import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Switch, type SwitchProps } from '../Switch';

function Controlled(props: Omit<SwitchProps, 'value' | 'onValueChange'> & { initial?: boolean }) {
  const { initial, ...rest } = props;
  const [value, setValue] = useState(initial ?? false);
  return <Switch {...rest} value={value} onValueChange={setValue} />;
}

const meta: Meta<typeof Controlled> = {
  component: Controlled,
  args: { accessibilityLabel: 'Modo noturno', size: 'md' },
  argTypes: { size: { control: 'select', options: ['sm', 'md', 'lg'] } },
};
export default meta;

type Story = StoryObj<typeof Controlled>;
export const Desligado: Story = {};
export const Ligado: Story = { args: { initial: true } };
export const Desabilitado: Story = { args: { disabled: true, initial: true } };
