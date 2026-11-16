import type { Meta, StoryObj } from '@storybook/react-native';
import { Text } from '../Text';

const meta: Meta<typeof Text> = {
  component: Text,
  args: { children: 'Calendário lunar de abril', variant: 'body', tone: 'default' },
  argTypes: {
    variant: { control: 'select', options: ['display', 'title', 'heading', 'body', 'bodySm', 'label', 'caption', 'overline'] },
    tone: { control: 'select', options: ['default', 'muted', 'accent', 'danger', 'success'] },
  },
};
export default meta;

type Story = StoryObj<typeof Text>;
export const Display: Story = { args: { variant: 'display', children: 'Fases da lua' } };
export const Title: Story = { args: { variant: 'title' } };
export const Heading: Story = { args: { variant: 'heading' } };
export const Body: Story = {};
export const Caption: Story = { args: { variant: 'caption', children: 'Atualizado há 5 minutos' } };
export const Overline: Story = { args: { variant: 'overline', children: 'Aula 12 · Astronomia' } };
export const Destaque: Story = {
  render: () => (
    <Text>
      A próxima <Text highlight>lua cheia</Text> acontece na sexta-feira.
    </Text>
  ),
};
