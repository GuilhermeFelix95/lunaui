import type { Meta, StoryObj } from '@storybook/react-native';
import { Accordion, type AccordionProps } from '../Accordion';
import { Text } from '../Text';

function Demo(props: Omit<AccordionProps, 'children'>) {
  return (
    <Accordion {...props}>
      <Accordion.Item value="fases" title="O que são as fases da lua?">
        <Text variant="bodySm" tone="muted">É a parte iluminada da lua que vemos da Terra, e muda ao longo do mês.</Text>
      </Accordion.Item>
      <Accordion.Item value="ciclo" title="Quanto dura um ciclo?">
        <Text variant="bodySm" tone="muted">Cerca de 29,5 dias entre duas luas novas.</Text>
      </Accordion.Item>
      <Accordion.Item value="pro" title="Plano avançado" disabled />
    </Accordion>
  );
}

const meta: Meta<typeof Demo> = { component: Demo };
export default meta;

type Story = StoryObj<typeof Demo>;
export const UmaPorVez: Story = { args: { type: 'single', defaultValue: 'fases' } };
export const Varias: Story = { args: { type: 'multiple', defaultValue: ['fases', 'ciclo'] } };
