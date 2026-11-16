import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { BottomSheet, type BottomSheetProps } from '../BottomSheet';
import { Button } from '../Button';
import { Card } from '../Card';
import { Text } from '../Text';

const fases = ['Lua nova', 'Quarto crescente', 'Lua cheia', 'Quarto minguante', 'Lua nova', 'Quarto crescente', 'Lua cheia', 'Quarto minguante'];

function Demo(props: Omit<BottomSheetProps, 'visible' | 'onClose' | 'children'> & { itens?: number }) {
  const { itens = fases.length, ...rest } = props;
  const [open, setOpen] = useState(false);
  return (
    <View>
      <Button onPress={() => setOpen(true)}>Abrir folha</Button>
      <BottomSheet {...rest} visible={open} onClose={() => setOpen(false)}>
        <View style={{ gap: 8 }}>
          {fases.slice(0, itens).map((f, i) => (
            <Card key={i} variant="outline">
              <Text variant="label">{f}</Text>
              <Text variant="caption">{3 + i * 7} de dezembro · 21h{10 + i}</Text>
            </Card>
          ))}
        </View>
      </BottomSheet>
    </View>
  );
}

const meta: Meta<typeof Demo> = {
  component: Demo,
  args: { title: 'Próximas luas', subtitle: 'Arraste para ver mais' },
};
export default meta;

type Story = StoryObj<typeof Demo>;
export const DoisPontos: Story = { args: { snapPoints: ['35%', '90%'] } };
export const PontoUnico: Story = { args: { snapPoints: ['55%'] } };
export const AlturaDoConteudo: Story = { args: { itens: 3 } };
export const NaoDispensavel: Story = { args: { snapPoints: ['50%'], dismissable: false } };
