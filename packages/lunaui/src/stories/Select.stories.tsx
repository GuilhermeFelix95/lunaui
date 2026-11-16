import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Select, type SelectOption } from '../Select';

const fases: SelectOption[] = [
  { value: 'nova', label: 'Lua nova' },
  { value: 'crescente', label: 'Crescente' },
  { value: 'quarto', label: 'Quarto crescente' },
  { value: 'cheia', label: 'Lua cheia' },
  { value: 'minguante', label: 'Minguante' },
  { value: 'eclipse', label: 'Eclipse total', hint: 'em breve', disabled: true },
];

const observatorios: SelectOption[] = [
  { value: 'pico', label: 'Pico dos Dias' },
  { value: 'on', label: 'Observatório Nacional' },
  { value: 'valongo', label: 'Observatório do Valongo' },
  { value: 'abraao', label: 'Abrahão de Moraes' },
  { value: 'sonear', label: 'SONEAR' },
];

function Single(props: { error?: string; disabled?: boolean; searchable?: boolean; initial?: string }) {
  const [v, setV] = useState<string | undefined>(props.initial);
  return <Select label="Fase da lua" placeholder="Escolha uma fase" options={fases} value={v} onValueChange={setV} {...props} />;
}

function Multiple() {
  const [v, setV] = useState<string[]>([]);
  return <Select multiple searchable label="Observatórios" placeholder="Escolha um ou mais" options={observatorios} value={v} onValueChange={setV} />;
}

const meta: Meta<typeof Single> = { component: Single };
export default meta;

type Story = StoryObj<typeof Single>;
export const Unica: Story = {};
export const Preenchido: Story = { args: { initial: 'cheia' } };
export const ComErro: Story = { args: { error: 'Selecione uma fase para continuar.' } };
export const Desabilitado: Story = { args: { disabled: true, initial: 'cheia' } };
export const ComBusca: Story = { args: { searchable: true } };
export const Multipla: Story = { render: () => <Multiple /> };
