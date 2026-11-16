import type { Meta, StoryObj } from '@storybook/react-native';
import { Card } from '../Card';
import { Text } from '../Text';

const meta: Meta<typeof Card> = {
  component: Card,
  args: {
    variant: 'elevated',
    children: [
      <Text key="t" variant="heading">Fases da lua</Text>,
      <Text key="b" tone="muted">Do novilúnio ao plenilúnio em 29,5 dias.</Text>,
    ],
  },
  argTypes: { variant: { control: 'select', options: ['elevated', 'outline', 'soft', 'solid'] } },
};
export default meta;

type Story = StoryObj<typeof Card>;
export const Elevated: Story = {};
export const Outline: Story = { args: { variant: 'outline' } };
export const Soft: Story = { args: { variant: 'soft' } };
export const ComCrescente: Story = { args: { variant: 'soft', moon: true } };
export const Pressionavel: Story = { args: { onPress: () => {} } };
