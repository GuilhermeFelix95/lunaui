import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { Avatar } from '../Avatar';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { List } from '../List';
import { Switch } from '../Switch';

const meta: Meta<typeof List> = { component: List };
export default meta;

type Story = StoryObj<typeof List>;

export const Contatos: Story = {
  render: () => (
    <List title="Eventos">
      <List.Item title="Marina Alves" subtitle="Observação em grupo · amanhã às 20h" start={<Avatar name="Marina Alves" />} end={<Badge variant="soft" size="sm">Novo</Badge>} chevron onPress={() => {}} />
      <List.Item title="João Pedro" subtitle="Lembrete de lua cheia" start={<Avatar name="João Pedro" />} chevron onPress={() => {}} />
    </List>
  ),
};

function Ajustes() {
  const [noturno, setNoturno] = useState(true);
  const [avisos, setAvisos] = useState(false);
  return (
    <List title="Ajustes">
      <List.Item title="Modo noturno" subtitle="Segue o pôr do sol" end={<Switch size="sm" value={noturno} onValueChange={setNoturno} accessibilityLabel="Modo noturno" />} />
      <List.Item title="Notificações" end={<Switch size="sm" value={avisos} onValueChange={setAvisos} accessibilityLabel="Notificações" />} />
      <List.Item title="Sincronizar" subtitle="Disponível no plano Pro" disabled onPress={() => {}} />
      <List.Item title="Sair da conta" destructive onPress={() => {}} />
    </List>
  );
}
export const Configuracoes: Story = { render: () => <Ajustes /> };

function Selecao() {
  const [fase, setFase] = useState('cheia');
  return (
    <List title="Escolha a fase">
      {['Lua nova', 'Crescente', 'Lua cheia', 'Minguante'].map((f) => {
        const id = f.toLowerCase().split(' ').pop()!;
        return <List.Item key={f} title={f} selected={fase === id} onPress={() => setFase(id)} />;
      })}
    </List>
  );
}
export const Selecionavel: Story = { render: () => <Selecao /> };

export const Vazia: Story = {
  render: () => (
    <View>
      <List>
        <List.Empty title="Nenhum evento ainda" description="Crie o primeiro para ver as fases da lua no seu calendário." action={<Button onPress={() => {}}>Criar evento</Button>} />
      </List>
    </View>
  ),
};
