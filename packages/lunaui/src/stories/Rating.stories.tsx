import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Rating } from '../Rating';

function Editavel() {
  const [v, setV] = useState(3);
  return <Rating value={v} onValueChange={setV} />;
}

const meta: Meta<typeof Rating> = { component: Rating, args: { value: 3.5 } };
export default meta;

type Story = StoryObj<typeof Rating>;
export const Avaliar: Story = { render: () => <Editavel /> };
export const SomenteLeitura: Story = { args: { readOnly: true } };
export const Compacto: Story = { args: { value: 4, readOnly: true, size: 'sm' } };
