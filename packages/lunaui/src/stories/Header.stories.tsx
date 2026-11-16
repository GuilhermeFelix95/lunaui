import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Animated, Text, View } from 'react-native';
import { Header, type HeaderProps } from '../Header';
import { Input } from '../Input';
import { useTheme } from '../theme';

const fases = ['Lua nova', 'Quarto crescente', 'Lua cheia', 'Quarto minguante', 'Eclipse parcial', 'Lua nova', 'Quarto crescente', 'Lua cheia', 'Quarto minguante', 'Lua nova'];

const Sino = () => <View style={{ width: 16, height: 18, borderRadius: 8, borderWidth: 2, borderColor: '#888' }} />;
function Busca() {
  const [q, setQ] = useState('');
  return <Input label="Buscar" placeholder="Buscar eventos" value={q} onChangeText={setQ} />;
}
const Mais = () => <Text style={{ fontSize: 24, color: '#888' }}>+</Text>;

function Palco(props: Omit<HeaderProps, 'scrollY'> & { rolar?: boolean }) {
  const { rolar = true, ...rest } = props;
  const theme = useTheme();
  const y = useRef(new Animated.Value(0)).current;
  return (
    <View style={{ height: 520, backgroundColor: theme.fieldBg }}>
      <Header {...rest} scrollY={rolar ? y : undefined} />
      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y } } }], { useNativeDriver: false })}
        contentContainerStyle={{ padding: 12, gap: 10 }}
      >
        {fases.map((f, i) => (
          <View key={i} style={{ height: 60, borderRadius: 16, borderWidth: 2, borderColor: theme.cardLine, backgroundColor: theme.cardBg, justifyContent: 'center', paddingHorizontal: 14 }}>
            <Text style={{ color: theme.text, fontWeight: '600' }}>{f}</Text>
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
}

const meta: Meta<typeof Palco> = { component: Palco };
export default meta;

type Story = StoryObj<typeof Palco>;
const actions = [
  { icon: <Sino />, label: 'Notificações', onPress: () => {}, badge: 3 },
  { icon: <Mais />, label: 'Novo evento', onPress: () => {} },
];

export const TituloGrande: Story = { args: { title: 'Calendário', subtitle: 'Dezembro de 2026', large: true, actions } };
export const ComVoltar: Story = { args: { title: 'Evento', large: true, onBack: () => {}, actions } };
export const ComBusca: Story = {
  args: { title: 'Calendário', large: true, actions, search: <Busca /> },
};
export const Simples: Story = { args: { title: 'Calendário', actions, onBack: () => {} } };
