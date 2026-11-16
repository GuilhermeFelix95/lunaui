import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { Badge } from '../Badge';

const meta: Meta<typeof Badge> = {
  component: Badge,
  args: { children: 'Novo', variant: 'soft', size: 'md' },
  argTypes: {
    variant: { control: 'select', options: ['solid', 'soft', 'outline', 'neutral'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};
export default meta;

type Story = StoryObj<typeof Badge>;
export const Soft: Story = {};
export const Solid: Story = { args: { variant: 'solid' } };
export const Outline: Story = { args: { variant: 'outline' } };
export const Ativo: Story = { args: { status: 'active', children: 'Ativo' } };
export const Pendente: Story = { args: { status: 'pending', children: 'Pendente' } };
export const Inativo: Story = { args: { status: 'inactive', variant: 'neutral', children: 'Inativo' } };
export const Contador: Story = {
  args: {
    count: 3,
    children: <View style={{ width: 48, height: 48, borderRadius: 16, borderWidth: 2, borderColor: '#ccc' }} />,
  },
};
