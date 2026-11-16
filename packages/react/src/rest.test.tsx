// @vitest-environment jsdom
import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  Alert,
  Avatar,
  BottomSheet,
  Header,
  List,
  ListEmpty,
  ListItem,
  NavItem,
  Navigation,
  Text,
  ToastHost,
  toast,
} from './index';

afterEach(cleanup);

describe('estrutura', () => {
  it('Text usa a tag e a variante', () => {
    render(<Text as="h2" variant="title">Oi</Text>);
    expect(screen.getByRole('heading').getAttribute('data-variant')).toBe('title');
  });
  it('Avatar mostra iniciais e status', () => {
    render(<Avatar name="Luna Kit" status="online" />);
    expect(screen.getByRole('img', { name: 'Luna Kit' }).textContent).toBe('LK');
    expect(screen.getByLabelText('online')).toBeTruthy();
  });
  it('List: item clicável vira botão e vazio aparece', async () => {
    const on = vi.fn();
    render(
      <List title="T">
        <ListItem title="A" onClick={on} />
        <ListEmpty title="Nada" />
      </List>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'A' }));
    expect(on).toHaveBeenCalled();
    expect(screen.getByText('Nada')).toBeTruthy();
  });
  it('Header mostra o título grande', () => {
    render(<Header title="Pequeno" large="Grande" />);
    expect(screen.getByText('Grande')).toBeTruthy();
  });
  it('Navigation marca a página atual', () => {
    render(
      <Navigation>
        <NavItem icon="●" label="Início" href="#" active badge={2} />
        <NavItem icon="○" label="Busca" href="#" />
      </Navigation>,
    );
    expect(screen.getByRole('link', { name: /Início/ }).getAttribute('aria-current')).toBe('page');
  });
  it('Alert de perigo usa role alert e fecha', async () => {
    const on = vi.fn();
    render(<Alert tone="danger" title="Erro" onClose={on} />);
    expect(screen.getByRole('alert')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(on).toHaveBeenCalled();
  });
});

describe('Toast e BottomSheet', () => {
  it('toast aparece e some sozinho', () => {
    vi.useFakeTimers();
    render(<ToastHost />);
    act(() => {
      toast({ title: 'Salvo', duration: 1000 });
    });
    expect(screen.getByText('Salvo')).toBeTruthy();
    act(() => {
      vi.advanceTimersByTime(1100);
    });
    expect(screen.queryByText('Salvo')).toBeNull();
    vi.useRealTimers();
  });
  it('BottomSheet abre o dialog', () => {
    const show = vi.fn(function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    });
    HTMLDialogElement.prototype.showModal = show;
    render(<BottomSheet open onClose={() => {}} title="Opções" />);
    expect(show).toHaveBeenCalledTimes(1);
  });
});
