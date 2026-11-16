import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Checkbox, type CheckboxProps } from '../Checkbox';

function Controlled(props: Omit<CheckboxProps, 'checked' | 'onCheckedChange'> & { initial?: boolean }) {
  const { initial, ...rest } = props;
  const [checked, setChecked] = useState(initial ?? false);
  return <Checkbox {...rest} checked={checked} onCheckedChange={setChecked} />;
}

const meta: Meta<typeof Controlled> = {
  component: Controlled,
  args: { label: 'Li e aceito os termos', size: 'md' },
  argTypes: { size: { control: 'select', options: ['sm', 'md', 'lg'] } },
};
export default meta;

type Story = StoryObj<typeof Controlled>;
export const Desmarcado: Story = {};
export const Marcado: Story = { args: { initial: true } };
export const Parcial: Story = { args: { indeterminate: true } };
export const ComErro: Story = { args: { error: true } };
export const Desabilitado: Story = { args: { disabled: true, initial: true } };
