import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Button } from '../Button';
import { Modal, type ModalProps } from '../Modal';

function Demo(props: Omit<ModalProps, 'visible' | 'onClose'>) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <>
      <Button onPress={() => setOpen(true)}>Abrir modal</Button>
      <Modal
        {...props}
        visible={open}
        onClose={close}
        actions={props.actions?.map((a) => ({ ...a, onPress: close }))}
      />
    </>
  );
}

const meta: Meta<typeof Demo> = {
  component: Demo,
  args: {
    title: 'Salvar alterações?',
    children: 'Você editou 3 eventos. As mudanças ficam visíveis para os convidados.',
    actions: [
      { label: 'Descartar', variant: 'ghost', onPress: () => {} },
      { label: 'Salvar', onPress: () => {} },
    ],
  },
};
export default meta;

type Story = StoryObj<typeof Demo>;
export const Confirmacao: Story = {};
export const Destrutivo: Story = {
  args: {
    title: 'Cancelar o evento?',
    children: 'Os 12 convidados serão avisados e esta ação não pode ser desfeita.',
    actions: [
      { label: 'Voltar', variant: 'ghost', onPress: () => {} },
      { label: 'Cancelar evento', color: '#c92a55', onPress: () => {} },
    ],
  },
};
export const ComCrescente: Story = {
  args: {
    moon: true,
    title: 'Lua cheia em 3 dias',
    children: 'Quer receber um lembrete na noite anterior para observar?',
    actions: [
      { label: 'Agora não', variant: 'ghost', onPress: () => {} },
      { label: 'Lembrar', onPress: () => {} },
    ],
  },
};
export const AcoesEmpilhadas: Story = {
  args: {
    stackActions: true,
    title: 'Como deseja continuar?',
    children: 'Escolha uma das opções para finalizar o cadastro.',
    actions: [
      { label: 'Entrar com e-mail', onPress: () => {} },
      { label: 'Criar conta nova', variant: 'soft', onPress: () => {} },
      { label: 'Voltar', variant: 'ghost', onPress: () => {} },
    ],
  },
};
export const NaoDispensavel: Story = {
  args: { dismissable: false, title: 'Atualização obrigatória', children: 'Atualize o app para continuar.' },
};
