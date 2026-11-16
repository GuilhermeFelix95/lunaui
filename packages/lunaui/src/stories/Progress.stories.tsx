import type { Meta, StoryObj } from '@storybook/react-native';
import { Progress } from '../Progress';

const meta: Meta<typeof Progress> = { component: Progress, args: { value: 60 } };
export default meta;

type Story = StoryObj<typeof Progress>;
export const Barra: Story = { args: { label: 'Enviando arquivo', showValue: true } };
export const Indeterminada: Story = { args: { indeterminate: true } };
export const Lua: Story = { args: { variant: 'moon', showValue: true } };
export const LuaIndeterminada: Story = { args: { variant: 'moon', indeterminate: true, size: 40 } };
