import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Input, type InputProps } from '../Input';

function Controlled(props: Omit<InputProps, 'value' | 'onChangeText'> & { initial?: string }) {
  const { initial, ...rest } = props;
  const [value, setValue] = useState(initial ?? '');
  return <Input {...rest} value={value} onChangeText={setValue} />;
}

const meta: Meta<typeof Controlled> = {
  component: Controlled,
  args: { label: 'Nome', placeholder: 'Como devemos te chamar?' },
};
export default meta;

type Story = StoryObj<typeof Controlled>;
export const Padrao: Story = {};
export const ComAjuda: Story = { args: { helper: 'Aparece no seu perfil.' } };
export const ComErro: Story = { args: { label: 'E-mail', initial: 'marina@exemplo', error: 'Informe um e-mail completo.' } };
export const Desabilitado: Story = { args: { label: 'Plano', initial: 'Gratuito', disabled: true } };
export const ContadorLua: Story = { args: { label: 'Bio', maxLength: 40, helper: 'Digite para a lua encher.' } };
