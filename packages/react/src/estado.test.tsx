// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(cleanup);
import { Accordion, AccordionItem, Modal, Tab, TabList, TabPanel, TabsRoot } from './index';

describe('Tabs', () => {
  const ui = (
    <TabsRoot defaultValue="a">
      <TabList>
        <Tab value="a">Um</Tab>
        <Tab value="b">Dois</Tab>
      </TabList>
      <TabPanel value="a">Painel A</TabPanel>
      <TabPanel value="b">Painel B</TabPanel>
    </TabsRoot>
  );
  it('troca de painel ao clicar', async () => {
    render(ui);
    expect(screen.getByText('Painel A')).toBeTruthy();
    await userEvent.click(screen.getByRole('tab', { name: 'Dois' }));
    expect(screen.getByText('Painel B')).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Dois' }).getAttribute('aria-selected')).toBe('true');
  });
  it('navega pelas setas do teclado', async () => {
    render(ui);
    screen.getByRole('tab', { name: 'Um' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Dois' }).getAttribute('aria-selected')).toBe('true');
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Um' }).getAttribute('aria-selected')).toBe('true');
  });
});

describe('Modal', () => {
  it('abre e fecha o <dialog> conforme open', () => {
    const show = vi.fn(function (this: HTMLDialogElement) { this.setAttribute('open', ''); });
    const close = vi.fn(function (this: HTMLDialogElement) { this.removeAttribute('open'); });
    HTMLDialogElement.prototype.showModal = show;
    HTMLDialogElement.prototype.close = close;
    const { rerender } = render(<Modal open={false} onClose={() => {}} title="Oi" />);
    expect(show).not.toHaveBeenCalled();
    rerender(<Modal open onClose={() => {}} title="Oi" />);
    expect(show).toHaveBeenCalledTimes(1);
    rerender(<Modal open={false} onClose={() => {}} title="Oi" />);
    expect(close).toHaveBeenCalledTimes(1);
  });
});

describe('Accordion', () => {
  it('renderiza itens com <details>', () => {
    const { container } = render(<Accordion><AccordionItem title="P" defaultOpen>R</AccordionItem></Accordion>);
    expect(container.querySelector('details')?.hasAttribute('open')).toBe(true);
  });
});
