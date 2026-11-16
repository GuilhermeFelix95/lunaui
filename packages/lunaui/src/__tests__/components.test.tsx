import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Button, Checkbox, Input, LunaProvider, Modal, Select, Switch, Text, ToastHost, toast } from '..';

describe('Button', () => {
  it('chama onPress ao tocar', async () => {
    const onPress = jest.fn();
    await render(<Button onPress={onPress}>Continuar</Button>);
    await fireEvent.press(screen.getByRole('button', { name: 'Continuar' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('não dispara quando desabilitado ou carregando', async () => {
    const onPress = jest.fn();
    const { rerender } = await render(<Button onPress={onPress} disabled>Enviar</Button>);
    await fireEvent.press(screen.getByRole('button', { name: 'Enviar' }));
    await rerender(<Button onPress={onPress} loading>Enviar</Button>);
    await fireEvent.press(screen.getByRole('button', { name: 'Enviar' }));
    expect(onPress).not.toHaveBeenCalled();
  });
});

describe('Switch', () => {
  it('alterna o valor e expõe o estado de acessibilidade', async () => {
    const onValueChange = jest.fn();
    await render(<Switch value={false} onValueChange={onValueChange} accessibilityLabel="Modo noturno" />);
    const sw = screen.getByRole('switch', { name: 'Modo noturno' });
    expect(sw).not.toBeChecked();
    await fireEvent.press(sw);
    expect(onValueChange).toHaveBeenCalledWith(true);
  });
});

describe('Checkbox', () => {
  it('inverte o valor e anuncia estado misto no parcial', async () => {
    const onCheckedChange = jest.fn();
    const { rerender } = await render(<Checkbox label="Aceito" checked={false} onCheckedChange={onCheckedChange} />);
    await fireEvent.press(screen.getByRole('checkbox', { name: 'Aceito' }));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    await rerender(<Checkbox label="Aceito" checked={false} indeterminate onCheckedChange={onCheckedChange} />);
    expect(screen.getByRole('checkbox', { name: 'Aceito' })).toBePartiallyChecked();
  });
});

describe('Input', () => {
  it('propaga o texto digitado e mostra o erro', async () => {
    const onChangeText = jest.fn();
    await render(<Input label="E-mail" value="" onChangeText={onChangeText} error="Informe um e-mail completo." />);
    await fireEvent.changeText(screen.getByLabelText('E-mail'), 'a@b.com');
    expect(onChangeText).toHaveBeenCalledWith('a@b.com');
    expect(screen.getByText('Informe um e-mail completo.')).toBeOnTheScreen();
  });

  it('mostra o contador com maxLength', async () => {
    await render(<Input label="Bio" value="oi" onChangeText={() => {}} maxLength={40} />);
    expect(screen.getByText('2/40')).toBeOnTheScreen();
  });
});

describe('Text', () => {
  it('usa role header em title e aceita o tema', async () => {
    await render(
      <LunaProvider>
        <Text variant="title">Calendário lunar</Text>
      </LunaProvider>,
    );
    expect(screen.getByRole('header', { name: 'Calendário lunar' })).toBeOnTheScreen();
  });
});

describe('Modal', () => {
  it('mostra título e corpo e dispara as ações', async () => {
    const onClose = jest.fn();
    const onConfirm = jest.fn();
    await render(
      <Modal
        visible
        onClose={onClose}
        title="Salvar alterações?"
        actions={[{ label: 'Salvar', onPress: onConfirm }]}
      >
        Você editou 3 eventos.
      </Modal>,
    );
    expect(screen.getByRole('header', { name: 'Salvar alterações?' })).toBeOnTheScreen();
    expect(screen.getByText('Você editou 3 eventos.')).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Salvar' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('fecha pelo X e não oferece fechar quando dismissable=false', async () => {
    const onClose = jest.fn();
    const { rerender } = await render(<Modal visible onClose={onClose} title="Aviso" />);
    await fireEvent.press(screen.getAllByRole('button', { name: 'Fechar' })[0]!);
    expect(onClose).toHaveBeenCalledTimes(1);
    await rerender(<Modal visible onClose={onClose} title="Aviso" dismissable={false} />);
    expect(screen.queryByRole('button', { name: 'Fechar' })).toBeNull();
  });

  it('não renderiza o conteúdo quando invisível', async () => {
    await render(<Modal visible={false} onClose={() => {}} title="Oculto" />);
    expect(screen.queryByText('Oculto')).toBeNull();
  });
});

describe('Toast', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    toast.clear();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('mostra o toast e remove sozinho depois da duração', async () => {
    await render(<ToastHost />);
    await act(async () => {
      toast.show({ title: 'Evento salvo', duration: 1000 });
    });
    expect(screen.getByText('Evento salvo')).toBeOnTheScreen();
    await act(async () => {
      jest.advanceTimersByTime(1000);
      jest.advanceTimersByTime(400);
    });
    expect(screen.queryByText('Evento salvo')).toBeNull();
  });

  it('chama a ação e dispensa o toast', async () => {
    const undo = jest.fn();
    await render(<ToastHost />);
    await act(async () => {
      toast.show({ title: 'Evento removido', action: { label: 'Desfazer', onPress: undo } });
    });
    await fireEvent.press(screen.getByRole('button', { name: 'Desfazer' }));
    expect(undo).toHaveBeenCalledTimes(1);
  });

  it('mostra no máximo 3 por vez, os outros esperam', async () => {
    await render(<ToastHost />);
    await act(async () => {
      ['a', 'b', 'c', 'd'].forEach((t) => toast.show({ title: t }));
    });
    expect(screen.queryByText('d')).toBeNull();
    expect(screen.getByText('a')).toBeOnTheScreen();
  });
});

describe('Select', () => {
  const options = [
    { value: 'a', label: 'Lua nova' },
    { value: 'b', label: 'Lua cheia' },
    { value: 'c', label: 'Eclipse', disabled: true },
  ];

  it('abre a lista, escolhe uma opção e fecha (seleção única)', async () => {
    const onValueChange = jest.fn();
    await render(<Select label="Fase" placeholder="Escolha" options={options} value={undefined} onValueChange={onValueChange} />);
    expect(screen.getByText('Escolha')).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('combobox', { name: 'Fase' }));
    await fireEvent.press(screen.getByRole('radio', { name: 'Lua cheia' }));
    expect(onValueChange).toHaveBeenCalledWith('b');
  });

  it('ignora opção desabilitada', async () => {
    const onValueChange = jest.fn();
    await render(<Select label="Fase" options={options} onValueChange={onValueChange} />);
    await fireEvent.press(screen.getByRole('combobox', { name: 'Fase' }));
    await fireEvent.press(screen.getByRole('radio', { name: 'Eclipse' }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('seleção múltipla acumula valores e resume o campo', async () => {
    const onValueChange = jest.fn();
    await render(<Select multiple label="Fases" options={options} value={['a', 'b']} onValueChange={onValueChange} />);
    expect(screen.getByText('2 selecionados')).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('combobox', { name: 'Fases' }));
    await fireEvent.press(screen.getByRole('checkbox', { name: 'Lua nova' }));
    expect(onValueChange).toHaveBeenCalledWith(['b']);
  });
});
