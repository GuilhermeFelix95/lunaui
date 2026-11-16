import type { Meta, StoryObj } from '@storybook/react-native';
import { Button } from '../Button';

const meta: Meta<typeof Button> = {
  component: Button,
  args: { children: 'Continuar', variant: 'solid', size: 'md' },
  argTypes: {
    variant: { control: 'select', options: ['solid', 'soft', 'outline', 'ghost'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;
export const Solid: Story = {};
export const Soft: Story = { args: { variant: 'soft' } };
export const Outline: Story = { args: { variant: 'outline' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Loading: Story = { args: { loading: true, children: 'Enviando' } };
export const Disabled: Story = { args: { disabled: true } };
export const CorPersonalizada: Story = { args: { color: '#10b981', size: 'lg', children: 'Pagar' } };
