import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Accordion, Alert, BottomSheet, Button, Checkbox, Chip, Divider, Header, Input, List, LunaProvider, Modal, Navigation, Progress, RadioGroup, Rating, SegmentedControl, Select, Skeleton, Slider, Switch, Tabs, Text, ToastHost, toast } from '..';

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

describe('BottomSheet', () => {
  it('mostra título e conteúdo e expõe o controle de altura', async () => {
    await render(
      <BottomSheet visible onClose={() => {}} title="Próximas luas" snapPoints={['40%', '90%']}>
        <Text>Lua cheia</Text>
      </BottomSheet>,
    );
    expect(screen.getByRole('header', { name: 'Próximas luas' })).toBeOnTheScreen();
    expect(screen.getByText('Lua cheia')).toBeOnTheScreen();
    expect(screen.getByRole('adjustable', { name: 'Ajustar altura' })).toBeOnTheScreen();
  });

  it('não oferece fechar pelo fundo quando dismissable=false', async () => {
    await render(<BottomSheet visible onClose={() => {}} title="Aviso" dismissable={false} />);
    // o fundo começa transparente (animação de entrada), então é "oculto" para o Testing Library
    expect(screen.getByRole('button', { name: 'Fechar', hidden: true })).toBeDisabled();
  });

  it('não renderiza quando invisível', async () => {
    await render(<BottomSheet visible={false} onClose={() => {}} title="Oculta" />);
    expect(screen.queryByText('Oculta')).toBeNull();
  });
});

describe('Tabs', () => {
  const setup = (onValueChange = jest.fn(), value = 'a') =>
    render(
      <Tabs value={value} onValueChange={onValueChange}>
        <Tabs.Tab value="a" label="Hoje" />
        <Tabs.Tab value="b" label="Semana" count={3} />
        <Tabs.Tab value="c" label="Ano" disabled />
        <Tabs.Panel value="a"><Text>Painel A</Text></Tabs.Panel>
        <Tabs.Panel value="b"><Text>Painel B</Text></Tabs.Panel>
      </Tabs>,
    );

  it('marca a aba ativa e mostra só o painel dela', async () => {
    await setup();
    expect(screen.getByRole('tab', { name: 'Hoje' })).toBeSelected();
    expect(screen.getByRole('tab', { name: 'Semana, 3' })).not.toBeSelected();
    expect(screen.getByText('Painel A')).toBeOnTheScreen();
    expect(screen.queryByText('Painel B')).toBeNull();
  });

  it('chama onValueChange ao tocar e ignora aba desabilitada', async () => {
    const onValueChange = jest.fn();
    await setup(onValueChange);
    await fireEvent.press(screen.getByRole('tab', { name: 'Semana, 3' }));
    expect(onValueChange).toHaveBeenCalledWith('b');
    await fireEvent.press(screen.getByRole('tab', { name: 'Ano' }));
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });
});

describe('List', () => {
  it('toca em item e ignora item desabilitado', async () => {
    const abrir = jest.fn();
    const bloqueado = jest.fn();
    await render(
      <List title="Contatos">
        <List.Item title="Marina" subtitle="Amanhã" onPress={abrir} />
        <List.Item title="Sync" onPress={bloqueado} disabled />
      </List>,
    );
    expect(screen.getByText('Contatos')).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Marina, Amanhã' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Sync' }));
    expect(abrir).toHaveBeenCalledTimes(1);
    expect(bloqueado).not.toHaveBeenCalled();
  });

  it('mostra o estado vazio com a ação', async () => {
    await render(
      <List>
        <List.Empty title="Nada ainda" description="Crie um" action={<Button onPress={() => {}}>Criar</Button>} />
      </List>,
    );
    expect(screen.getByText('Nada ainda')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Criar' })).toBeOnTheScreen();
  });
});

describe('Header', () => {
  it('mostra título, voltar e ações com badge', async () => {
    const voltar = jest.fn();
    const abrir = jest.fn();
    await render(
      <Header title="Calendário" onBack={voltar} actions={[{ icon: <Text>S</Text>, label: 'Avisos', onPress: abrir, badge: 3 }]} />,
    );
    expect(screen.getByRole('header', { name: 'Calendário' })).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Voltar' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Avisos, 3 novos' }));
    expect(voltar).toHaveBeenCalledTimes(1);
    expect(abrir).toHaveBeenCalledTimes(1);
  });
});

describe('Navigation', () => {
  const items = [
    { value: 'a', label: 'Início', icon: <Text>i</Text> },
    { value: 'b', label: 'Avisos', icon: <Text>b</Text>, badge: 3 },
  ];

  it('marca o item ativo e anuncia o contador', async () => {
    await render(<Navigation items={items} value="a" onValueChange={() => {}} />);
    expect(screen.getByRole('tab', { name: 'Início' })).toBeSelected();
    expect(screen.getByRole('tab', { name: 'Avisos, 3 novos' })).not.toBeSelected();
  });

  it('troca de item ao tocar e mantém o rótulo acessível quando escondido', async () => {
    const onValueChange = jest.fn();
    await render(<Navigation items={items} value="a" onValueChange={onValueChange} activeLabelOnly />);
    expect(screen.queryByText('Avisos')).toBeNull();
    await fireEvent.press(screen.getByRole('tab', { name: 'Avisos, 3 novos' }));
    expect(onValueChange).toHaveBeenCalledWith('b');
  });
});

describe('Fase 4', () => {
  it('RadioGroup troca a opção e ignora a desabilitada', async () => {
    const onValueChange = jest.fn();
    await render(
      <RadioGroup value="a" onValueChange={onValueChange} label="Plano">
        <RadioGroup.Radio value="a" label="Gratuito" />
        <RadioGroup.Radio value="b" label="Pro" />
        <RadioGroup.Radio value="c" label="Empresa" disabled />
      </RadioGroup>,
    );
    expect(screen.getByRole('radio', { name: 'Gratuito' })).toBeChecked();
    await fireEvent.press(screen.getByRole('radio', { name: 'Pro' }));
    await fireEvent.press(screen.getByRole('radio', { name: 'Empresa' }));
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith('b');
  });

  it('Slider expõe o valor e responde às ações de acessibilidade', async () => {
    const onValueChange = jest.fn();
    await render(<Slider value={40} onValueChange={onValueChange} label="Volume" step={5} />);
    const s = screen.getByRole('adjustable', { name: 'Volume' });
    expect(s).toHaveAccessibilityValue({ min: 0, max: 100, now: 40 });
    await fireEvent(s, 'accessibilityAction', { nativeEvent: { actionName: 'increment' } });
    expect(onValueChange).toHaveBeenCalledWith(45);
  });

  it('Progress informa o valor, limitado de 0 a 100', async () => {
    await render(<Progress value={140} label="Envio" />);
    expect(screen.getByRole('progressbar', { name: 'Envio' })).toHaveAccessibilityValue({ min: 0, max: 100, now: 100 });
  });

  it('Skeleton.Text mostra um único estado de carregamento', async () => {
    await render(<Skeleton.Text lines={3} />);
    expect(screen.getByRole('progressbar', { name: 'Carregando' })).toBeOnTheScreen();
  });

  it('Divider com rótulo mostra o texto', async () => {
    await render(<Divider label="ou" />);
    expect(screen.getByText('ou')).toBeOnTheScreen();
  });

  it('Chip alterna, mostra o contador e remove', async () => {
    const onPress = jest.fn();
    const onRemove = jest.fn();
    await render(
      <>
        <Chip label="Cheia" count={2} selected={false} onPress={onPress} />
        <Chip label="Eclipse" onRemove={onRemove} />
      </>,
    );
    await fireEvent.press(screen.getByRole('togglebutton', { name: 'Cheia, 2' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Remover Eclipse' }));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('SegmentedControl marca a opção e ignora a desabilitada', async () => {
    const onValueChange = jest.fn();
    await render(
      <SegmentedControl
        value="a"
        onValueChange={onValueChange}
        options={[
          { value: 'a', label: 'Dia' },
          { value: 'b', label: 'Semana' },
          { value: 'c', label: 'Auto', disabled: true },
        ]}
      />,
    );
    expect(screen.getByRole('radio', { name: 'Dia' })).toBeChecked();
    await fireEvent.press(screen.getByRole('radio', { name: 'Semana' }));
    await fireEvent.press(screen.getByRole('radio', { name: 'Auto' }));
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith('b');
  });

  it('Accordion abre um por vez no modo single', async () => {
    await render(
      <Accordion type="single" defaultValue="a">
        <Accordion.Item value="a" title="Primeiro"><Text>Corpo A</Text></Accordion.Item>
        <Accordion.Item value="b" title="Segundo"><Text>Corpo B</Text></Accordion.Item>
      </Accordion>,
    );
    expect(screen.getByText('Corpo A')).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Segundo' }));
    expect(screen.getByText('Corpo B')).toBeOnTheScreen();
    expect(screen.queryByText('Corpo A')).toBeNull();
  });

  it('Alert mostra título, aciona a ação e fecha', async () => {
    const onClose = jest.fn();
    const onAction = jest.fn();
    await render(
      <Alert tone="warning" title="Quase sem espaço" action={{ label: 'Gerenciar', onPress: onAction }} onClose={onClose}>
        Você usou 90%.
      </Alert>,
    );
    expect(screen.getByText('Quase sem espaço')).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Gerenciar' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Fechar aviso' }));
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Rating avalia ao tocar e lê a nota quando somente leitura', async () => {
    const onValueChange = jest.fn();
    const { rerender } = await render(<Rating value={2} onValueChange={onValueChange} />);
    await fireEvent.press(screen.getByRole('radio', { name: '4 de 5' }));
    expect(onValueChange).toHaveBeenCalledWith(4);
    await rerender(<Rating value={3.5} readOnly />);
    expect(screen.getByRole('image', { name: 'Nota 3,5 de 5' })).toBeOnTheScreen();
  });
});
