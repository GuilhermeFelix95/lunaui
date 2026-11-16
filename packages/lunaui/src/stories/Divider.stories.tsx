import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { Divider } from '../Divider';
import { Text } from '../Text';

const meta: Meta<typeof Divider> = { component: Divider };
export default meta;

type Story = StoryObj<typeof Divider>;
export const Simples: Story = {};
export const ComTexto: Story = { args: { label: 'ou' } };
export const ComLua: Story = { args: { moon: true } };
export const Recuado: Story = { args: { inset: 56 } };
export const Vertical: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, height: 32 }}>
      <Text variant="label">Início</Text>
      <Divider orientation="vertical" />
      <Text variant="label">Agenda</Text>
    </View>
  ),
};
