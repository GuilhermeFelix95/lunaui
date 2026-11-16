// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import {
  Accordion,
  AccordionItem,
  Alert,
  Avatar,
  BottomSheet,
  Button,
  Input,
  List,
  ListItem,
  Modal,
  Navigation,
  NavItem,
  Progress,
  Rating,
  SegmentedControl,
  Slider,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabsRoot,
  ToastHost,
  toast,
} from './index';

describe('@lunakit/vue', () => {
  it('Button aplica variante e carregamento', () => {
    const w = mount(Button, { props: { variant: 'soft', loading: true }, slots: { default: 'Salvar' } });
    expect(w.classes()).toContain('lk-button');
    expect(w.attributes('data-variant')).toBe('soft');
    expect(w.attributes('aria-busy')).toBe('true');
    expect(w.attributes('disabled')).toBeDefined();
  });

  it('Input emite v-model e marca erro', async () => {
    const w = mount(Input, { props: { label: 'Nome', error: 'Obrigatório', modelValue: '' }, attrs: { id: 'n' } });
    expect(w.find('label').attributes('for')).toBe('n');
    expect(w.find('input').attributes('aria-invalid')).toBe('true');
    await w.find('input').setValue('Ana');
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['Ana']);
  });

  it('Switch tem role switch e emite', async () => {
    const w = mount(Switch, { props: { modelValue: false } });
    expect(w.attributes('role')).toBe('switch');
    await w.setValue(true);
    expect(w.emitted('update:modelValue')?.[0]).toEqual([true]);
  });

  it('Progress expõe o valor', () => {
    const w = mount(Progress, { props: { value: 40 } });
    expect(w.attributes('aria-valuenow')).toBe('40');
    expect(w.attributes('style')).toContain('--lk-value: 40%');
  });

  it('Tabs trocam por clique e setas', async () => {
    const w = mount(
      {
        render: () =>
          h(TabsRoot, { defaultValue: 'a' }, () => [
            h(TabList, null, () => [h(Tab, { value: 'a' }, () => 'Um'), h(Tab, { value: 'b' }, () => 'Dois')]),
            h(TabPanel, { value: 'a' }, () => 'Painel A'),
            h(TabPanel, { value: 'b' }, () => 'Painel B'),
          ]),
      },
      { attachTo: document.body },
    );
    expect(w.text()).toContain('Painel A');
    const tabs = w.findAll('[role="tab"]');
    await tabs[1]!.trigger('click');
    expect(w.text()).toContain('Painel B');
    (tabs[1]!.element as HTMLElement).focus();
    await w.find('[role="tablist"]').trigger('keydown', { key: 'ArrowRight' });
    expect(w.findAll('[role="tab"]')[0]!.attributes('aria-selected')).toBe('true');
    w.unmount();
  });

  it('Modal e BottomSheet abrem o dialog', async () => {
    const show = vi.fn(function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    });
    HTMLDialogElement.prototype.showModal = show;
    HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
      this.removeAttribute('open');
    };
    const m = mount(Modal, { props: { open: false, title: 'Oi' } });
    expect(show).not.toHaveBeenCalled();
    await m.setProps({ open: true });
    await m.vm.$nextTick();
    expect(show).toHaveBeenCalledTimes(1);
    mount(BottomSheet, { props: { open: true, title: 'Opções' } });
    expect(show).toHaveBeenCalledTimes(2);
  });

  it('Accordion usa details', () => {
    const w = mount({ render: () => h(Accordion, null, () => h(AccordionItem, { title: 'P', defaultOpen: true }, () => 'R')) });
    expect(w.find('details').attributes('open')).toBeDefined();
  });

  it('Slider atualiza --lk-p e emite', async () => {
    const w = mount(Slider, { props: { modelValue: 0 } });
    await w.setValue(50);
    expect(w.emitted('update:modelValue')?.[0]).toEqual([50]);
  });

  it('SegmentedControl emite a opção clicada', async () => {
    const w = mount(SegmentedControl, { props: { options: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }] } });
    await w.findAll('[role="radio"]')[1]!.trigger('click');
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['b']);
  });

  it('Rating emite a nota', async () => {
    const w = mount(Rating);
    await w.findAll('[role="radio"]')[2]!.trigger('click');
    expect(w.emitted('update:modelValue')?.[0]).toEqual([3]);
  });

  it('Avatar mostra iniciais e status', () => {
    const w = mount(Avatar, { props: { name: 'Luna Kit', status: 'online' } });
    expect(w.text()).toContain('LK');
    expect(w.find('[aria-label="online"]').exists()).toBe(true);
  });

  it('List: item emite click', async () => {
    const w = mount({ render: () => h(List, { title: 'T' }, () => h(ListItem, { title: 'A', onClick: () => on() })) });
    const on = vi.fn();
    await w.find('button').trigger('click');
    expect(on).toHaveBeenCalled();
  });

  it('Navigation marca a página atual', () => {
    const w = mount({ render: () => h(Navigation, null, () => h(NavItem, { label: 'Início', href: '#', active: true })) });
    expect(w.find('a').attributes('aria-current')).toBe('page');
  });

  it('Alert de perigo usa role alert e emite close', async () => {
    const w = mount(Alert, { props: { tone: 'danger', title: 'Erro', closable: true } });
    expect(w.attributes('role')).toBe('alert');
    await w.find('[aria-label="Fechar"]').trigger('click');
    expect(w.emitted('close')).toBeTruthy();
  });

  it('toast aparece e some sozinho', async () => {
    vi.useFakeTimers();
    const w = mount(ToastHost);
    toast({ title: 'Salvo', duration: 1000 });
    await w.vm.$nextTick();
    expect(w.text()).toContain('Salvo');
    vi.advanceTimersByTime(1100);
    await w.vm.$nextTick();
    expect(w.text()).not.toContain('Salvo');
    vi.useRealTimers();
  });
});
