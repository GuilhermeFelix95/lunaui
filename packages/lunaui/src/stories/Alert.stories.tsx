import type { Meta, StoryObj } from '@storybook/react-native';
import { Alert } from '../Alert';

const meta: Meta<typeof Alert> = { component: Alert };
export default meta;

type Story = StoryObj<typeof Alert>;
export const Info: Story = { args: { tone: 'info', title: 'Informação', children: 'Novos recursos chegaram ao calendário.', action: { label: 'Ver novidades', onPress: () => {} } } };
export const Sucesso: Story = { args: { tone: 'success', title: 'Salvo com sucesso', children: 'Suas preferências foram atualizadas.', onClose: () => {} } };
export const Aviso: Story = { args: { tone: 'warning', title: 'Quase sem espaço', children: 'Você usou 90% do armazenamento.', action: { label: 'Gerenciar', onPress: () => {} } } };
export const Erro: Story = { args: { tone: 'danger', title: 'Falha ao sincronizar', children: 'Verifique sua conexão e tente de novo.', onClose: () => {} } };
