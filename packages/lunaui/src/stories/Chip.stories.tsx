import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { Chip } from '../Chip';

const meta: Meta<typeof Chip> = { component: Chip };
export default meta;

type Story = StoryObj<typeof Chip>;

function Filtros() {
  const [sel, setSel] = useState<string[]>(['Todas']);
  const toggle = (n: string) => setSel((s) => (s.includes(n) ? s.filter((x) => x !== n) : [...s, n]));
  const itens: [string, number][] = [['Todas', 8], ['Nova', 2], ['Crescente', 3], ['Cheia', 2]];
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
      {itens.map(([n, c]) => (
        <Chip key={n} label={n} count={c} selected={sel.includes(n)} onPress={() => toggle(n)} />
      ))}
    </View>
  );
}
export const Filtro: Story = { render: () => <Filtros /> };
export const Removivel: Story = { args: { label: 'Lua cheia', onRemove: () => {} } };
export const Pequeno: Story = { args: { label: 'Pequeno', size: 'sm', selected: false, onPress: () => {} } };
export const Desabilitado: Story = { args: { label: 'Desabilitado', disabled: true, selected: false, onPress: () => {} } };
