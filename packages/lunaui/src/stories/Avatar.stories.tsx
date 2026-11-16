import type { Meta, StoryObj } from '@storybook/react-native';
import { Avatar, AvatarGroup } from '../Avatar';

const meta: Meta<typeof Avatar> = {
  component: Avatar,
  args: { name: 'Marina Alves', size: 'md', variant: 'solid' },
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    variant: { control: 'select', options: ['solid', 'soft'] },
    status: { control: 'select', options: [undefined, 'online', 'away', 'offline'] },
  },
};
export default meta;

type Story = StoryObj<typeof Avatar>;
export const Iniciais: Story = {};
export const Soft: Story = { args: { variant: 'soft' } };
export const Online: Story = { args: { status: 'online', size: 'lg' } };
export const Ausente: Story = { args: { status: 'away', size: 'lg' } };
export const Offline: Story = { args: { status: 'offline', size: 'lg' } };
export const Grupo: Story = {
  render: () => (
    <AvatarGroup max={3}>
      <Avatar name="Marina Alves" />
      <Avatar name="João Pedro" variant="soft" />
      <Avatar name="Rita Castro" />
      <Avatar name="Caio Lima" />
      <Avatar name="Ana Souza" />
    </AvatarGroup>
  ),
};
