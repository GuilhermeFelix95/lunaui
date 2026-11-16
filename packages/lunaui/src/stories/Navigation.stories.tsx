import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { Navigation, type NavigationProps } from '../Navigation';
import { Text } from '../Text';
import { useTheme } from '../theme';

const Icone = ({ forma }: { forma: 'casa' | 'cal' | 'sino' | 'user' }) => {
  const theme = useTheme();
  const cor = theme.muted;
  const base = { borderWidth: 2, borderColor: cor };
  if (forma === 'casa') return <View style={{ ...base, width: 18, height: 16, borderRadius: 4 }} />;
  if (forma === 'cal') return <View style={{ ...base, width: 18, height: 18, borderRadius: 5 }} />;
  if (forma === 'sino') return <View style={{ ...base, width: 16, height: 18, borderRadius: 8 }} />;
  return <View style={{ ...base, width: 18, height: 18, borderRadius: 9 }} />;
};

const items: NavigationProps['items'] = [
  { value: 'home', label: 'Início', icon: <Icone forma="casa" /> },
  { value: 'cal', label: 'Calendário', icon: <Icone forma="cal" /> },
  { value: 'bell', label: 'Avisos', icon: <Icone forma="sino" />, badge: 3 },
  { value: 'me', label: 'Perfil', icon: <Icone forma="user" />, badge: 0 },
];

function Palco(props: Omit<NavigationProps, 'items' | 'value' | 'onValueChange'>) {
  const [tab, setTab] = useState('home');
  const theme = useTheme();
  const nome = items.find((i) => i.value === tab)!.label;
  return (
    <View style={{ height: 420, backgroundColor: theme.fieldBg, justifyContent: 'space-between' }}>
      <View style={{ padding: 24 }}>
        <Text variant="title">{nome}</Text>
      </View>
      <Navigation {...props} items={items} value={tab} onValueChange={setTab} />
    </View>
  );
}

const meta: Meta<typeof Palco> = { component: Palco };
export default meta;

type Story = StoryObj<typeof Palco>;
export const Colada: Story = { args: { variant: 'bar' } };
export const Flutuante: Story = { args: { variant: 'floating' } };
export const RotuloSoNoAtivo: Story = { args: { variant: 'floating', activeLabelOnly: true } };
