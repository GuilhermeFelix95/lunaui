import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Text } from '../Text';
import { Tabs, type TabsProps } from '../Tabs';

function Demo(props: Omit<TabsProps, 'value' | 'onValueChange' | 'children'>) {
  const [tab, setTab] = useState('hoje');
  return (
    <Tabs {...props} value={tab} onValueChange={setTab}>
      <Tabs.Tab value="hoje" label="Hoje" />
      <Tabs.Tab value="semana" label="Semana" count={3} />
      <Tabs.Tab value="mes" label="Mês" />
      <Tabs.Tab value="ano" label="Ano" disabled />
      <Tabs.Panel value="hoje"><Text variant="body">Lua crescente, nasce às 14h20.</Text></Tabs.Panel>
      <Tabs.Panel value="semana"><Text variant="body">A lua cheia chega na sexta.</Text></Tabs.Panel>
      <Tabs.Panel value="mes"><Text variant="body">4 fases e 1 eclipse parcial.</Text></Tabs.Panel>
    </Tabs>
  );
}

const meta: Meta<typeof Demo> = { component: Demo };
export default meta;

type Story = StoryObj<typeof Demo>;
export const Linha: Story = { args: { variant: 'line' } };
export const Pilula: Story = { args: { variant: 'pill' } };
export const Cheia: Story = { args: { variant: 'solid' } };
export const Rolavel: Story = { args: { variant: 'solid', scrollable: true } };
