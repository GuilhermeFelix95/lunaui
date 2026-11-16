import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { Button } from '../Button';
import { ToastHost } from '../Toast';
import { toast, type ToastOptions } from '../toastStore';

function Demo({ position, ...options }: ToastOptions & { position?: 'top' | 'bottom' }) {
  return (
    <View style={{ minHeight: 320 }}>
      <Button onPress={() => toast.show(options)}>Disparar toast</Button>
      <ToastHost position={position} />
    </View>
  );
}

const meta: Meta<typeof Demo> = {
  component: Demo,
  args: { title: 'Calendário atualizado', description: 'Novas luas adicionadas até dezembro.', position: 'bottom' },
  argTypes: {
    tone: { control: 'select', options: ['info', 'success', 'error', 'warning'] },
    position: { control: 'select', options: ['top', 'bottom'] },
  },
};
export default meta;

type Story = StoryObj<typeof Demo>;
export const Informativo: Story = {};
export const Sucesso: Story = { args: { tone: 'success', title: 'Evento salvo', description: 'Os convidados foram avisados.' } };
export const Erro: Story = { args: { tone: 'error', title: 'Não foi possível salvar', description: 'Verifique a conexão e tente de novo.' } };
export const Atencao: Story = { args: { tone: 'warning', title: 'Bateria baixa', description: 'Os lembretes podem atrasar.' } };
export const ComAcao: Story = {
  args: { title: 'Evento removido', description: undefined, action: { label: 'Desfazer', onPress: () => {} } },
};
export const NoTopo: Story = { args: { position: 'top' } };
