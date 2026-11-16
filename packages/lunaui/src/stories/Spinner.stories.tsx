import type { Meta, StoryObj } from '@storybook/react-native';
import { Spinner } from '../Spinner';

const meta: Meta<typeof Spinner> = {
  component: Spinner,
  args: { size: 'md' },
  argTypes: { size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] } },
};
export default meta;

type Story = StoryObj<typeof Spinner>;
export const Padrao: Story = {};
export const ComRotulo: Story = { args: { label: 'Carregando suas fases…' } };
export const Grande: Story = { args: { size: 'lg', label: 'Calendário lunar', color: '#10b981' } };
