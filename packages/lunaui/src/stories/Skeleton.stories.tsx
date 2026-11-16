import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { Skeleton } from '../Skeleton';

const meta: Meta<typeof Skeleton> = { component: Skeleton };
export default meta;

type Story = StoryObj<typeof Skeleton>;
export const Bloco: Story = { args: { width: '60%', height: 16 } };
export const Circulo: Story = { args: { shape: 'circle', size: 48 } };
export const Texto: Story = { render: () => <Skeleton.Text lines={3} /> };
export const Cartao: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
      <Skeleton width={48} height={48} radius={16} />
      <View style={{ flex: 1, gap: 10 }}>
        <Skeleton width="55%" height={14} />
        <Skeleton width="80%" height={12} />
      </View>
    </View>
  ),
};
