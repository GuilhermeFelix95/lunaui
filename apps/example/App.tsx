import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { Avatar, AvatarGroup, Badge, Button, Card, Checkbox, Input, LunaProvider, Spinner, Switch, createTheme } from 'lunaui';

export default function App() {
  const [items, setItems] = useState([true, false]);
  const all = items.every(Boolean);
  const some = items.some(Boolean);
  const [bio, setBio] = useState('');
  const [night, setNight] = useState(true);
  return (
    <LunaProvider theme={createTheme({ color: '#7c6cf0' })}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.row}>
          <Button>Continuar</Button>
          <Button variant="soft">Continuar</Button>
          <Button variant="outline">Continuar</Button>
          <Button variant="ghost">Continuar</Button>
        </View>
        <View style={styles.row}>
          <Button size="sm">Pequeno</Button>
          <Button size="lg" color="#10b981">Pagar</Button>
          <Button loading>Enviando</Button>
          <Button disabled>Enviar</Button>
        </View>
        <Input label="Bio" value={bio} onChangeText={setBio} placeholder="Fale um pouco sobre você" helper="Aparece no seu perfil público." maxLength={40} />
        <Input label="E-mail" value="marina@exemplo" onChangeText={() => {}} error="Informe um e-mail completo." />
        <Input label="Plano" value="Gratuito" onChangeText={() => {}} disabled />
        <View style={styles.row}>
          <Switch value={night} onValueChange={setNight} accessibilityLabel="Modo noturno" />
          <Switch size="sm" value={false} onValueChange={() => {}} accessibilityLabel="Pequeno" />
          <Switch size="lg" value onValueChange={() => {}} accessibilityLabel="Grande" color="#10b981" />
          <Switch disabled value onValueChange={() => {}} accessibilityLabel="Desabilitado" />
        </View>
        <View>
          <Checkbox label="Selecionar todos" checked={all} indeterminate={some && !all} onCheckedChange={(v) => setItems([v, v])} />
          <Checkbox label="Notas de aula" checked={items[0]} onCheckedChange={(v) => setItems([v, items[1]])} />
          <Checkbox label="Gravações" checked={items[1]} onCheckedChange={(v) => setItems([items[0], v])} />
          <Checkbox label="Desabilitado" checked disabled onCheckedChange={() => {}} />
        </View>
        <Card>
          <Text style={styles.title}>Fases da lua</Text>
          <Text>Do novilúnio ao plenilúnio em 29,5 dias.</Text>
        </Card>
        <Card variant="soft" moon>
          <Text style={styles.title}>Maré de abril</Text>
          <Text>Sizígia: a maré mais alta do mês.</Text>
        </Card>
        <Card variant="solid" moon onPress={() => {}}>
          <Text style={[styles.title, { color: '#fff' }]}>Teste 14 dias</Text>
          <Text style={{ color: '#fff' }}>Toque para abrir.</Text>
        </Card>
        <View style={styles.row}>
          <Badge variant="solid">Novo</Badge>
          <Badge status="active">Ativo</Badge>
          <Badge status="pending">Pendente</Badge>
          <Badge variant="neutral" status="inactive">Inativo</Badge>
          <Badge variant="outline" size="lg">Beta</Badge>
          <Badge count={3}>
            <View style={{ width: 48, height: 48, borderRadius: 16, borderWidth: 2, borderColor: '#ccc' }} />
          </Badge>
        </View>
        <View style={styles.row}>
          <Avatar name="Marina Alves" status="online" />
          <Avatar name="João Pedro" variant="soft" status="away" size="lg" />
          <Avatar name="Rita Castro" status="offline" size="sm" />
        </View>
        <AvatarGroup max={3}>
          <Avatar name="Marina Alves" />
          <Avatar name="João Pedro" variant="soft" />
          <Avatar name="Rita Castro" />
          <Avatar name="Caio Lima" />
          <Avatar name="Ana Souza" />
        </AvatarGroup>
        <View style={styles.row}>
          <Spinner size="xs" />
          <Spinner size="sm" />
          <Spinner label="Carregando suas fases…" />
          <Spinner size="lg" color="#10b981" label="Calendário lunar" />
        </View>
        <Button fullWidth size="lg" color="#f43f5e">Criar conta</Button>
        <StatusBar style="auto" />
      </ScrollView>
    </LunaProvider>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 80, gap: 20 },
  title: { fontSize: 17, fontWeight: '600' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, alignItems: 'center' },
});
