# lunakit

Biblioteca de componentes para **React Native (Expo)** com uma cor-base configurável e identidade lunar: estilo fosco, cantos suaves e fases da lua como assinatura.

![versão](https://img.shields.io/badge/vers%C3%A3o-0.1.0-7c6cf0) ![licença](https://img.shields.io/badge/licen%C3%A7a-MIT-7c6cf0) ![componentes](https://img.shields.io/badge/componentes-27-7c6cf0) ![TypeScript](https://img.shields.io/badge/TypeScript-sim-7c6cf0)

> Versão 0.1.0, em desenvolvimento ativo. Foco em mobile; web e desktop virão em etapas futuras.

## Por que lunakit

- **Uma cor, tudo derivado.** Você define a cor-base e a biblioteca calcula bordas, estados e a cor do texto com contraste adequado.
- **Visual próprio.** Estilo fosco, sem brilhos nem degradês, com uma borda inferior que afunda ao toque.
- **Assinatura lunar.** Spinner, contadores, status, sliders e avaliações usam fases da lua em vez de ícones genéricos.
- **Claro e escuro.** Segue o tema do sistema, sem configuração.
- **Acessível.** Papéis e estados de acessibilidade, alvos de toque amplos e respeito à opção "reduzir movimento".
- **Sem dependências pesadas.** Animações com o `Animated` nativo, estilos com `StyleSheet`, nada de Reanimated.

## Instalação

```sh
npm install lunakit react-native-safe-area-context
```

Testada com React 19 e React Native 0.88 (Expo 58).

## Primeiros passos

Envolva o app com o `LunaProvider` e escolha a cor-base:

```tsx
import { Button, LunaProvider, createTheme } from 'lunakit';

export default function App() {
  return (
    <LunaProvider theme={createTheme({ color: '#7c6cf0' })}>
      <Button onPress={() => {}}>Continuar</Button>
      <Button color="#10b981" variant="outline">Pagar</Button>
    </LunaProvider>
  );
}
```

A cor não é fixa: mude no tema inteiro ou só em um componente com a prop `color`. Para trocar a fonte, use `createTheme({ color, fontFamily })`.

### Mais exemplos

```tsx
import { Tabs, List, Switch, toast, ToastHost } from 'lunakit';

// Abas com painéis
<Tabs value={tab} onValueChange={setTab} variant="pill">
  <Tabs.Tab value="hoje" label="Hoje" />
  <Tabs.Tab value="semana" label="Semana" count={3} />
  <Tabs.Panel value="hoje">...</Tabs.Panel>
</Tabs>

// Lista de ajustes
<List title="Ajustes">
  <List.Item
    title="Modo noturno"
    end={<Switch value={on} onValueChange={setOn} accessibilityLabel="Modo noturno" />}
  />
</List>

// Avisos: coloque o ToastHost uma vez na raiz e chame toast() de qualquer lugar
<ToastHost />
toast('Evento salvo');
```

## Componentes

As imagens abaixo são **prévias do design** feitas a partir dos mockups de referência. O visual no app segue o mesmo desenho, em React Native.

### Formulário e escolhas

<table>
<tr>
<td width="50%"><b>Button</b><br>Sólido, suave, contorno e fantasma, em três tamanhos, com estado de carregamento em lua.<br><img src="https://raw.githubusercontent.com/GuilhermeFelix95/lunaui/main/docs/images/button.png" alt="Button"></td>
<td width="50%"><b>Input</b><br>Campo de texto com rótulo, ajuda, erro e contador em lua para o limite de caracteres.<br><img src="https://raw.githubusercontent.com/GuilhermeFelix95/lunaui/main/docs/images/input.png" alt="Input"></td>
</tr>
<tr>
<td><b>Switch</b><br>Interruptor com três tamanhos.<br><img src="https://raw.githubusercontent.com/GuilhermeFelix95/lunaui/main/docs/images/switch.png" alt="Switch"></td>
<td><b>Checkbox</b><br>Marcado, vazio e parcial (meia-lua).<br><img src="https://raw.githubusercontent.com/GuilhermeFelix95/lunaui/main/docs/images/checkbox.png" alt="Checkbox"></td>
</tr>
<tr>
<td><b>RadioGroup</b><br>Escolha única, em lista ou cartões.<br><img src="https://raw.githubusercontent.com/GuilhermeFelix95/lunaui/main/docs/images/radio.png" alt="RadioGroup"></td>
<td><b>Slider</b><br>Botão em lua que muda de fase com o valor.<br><img src="https://raw.githubusercontent.com/GuilhermeFelix95/lunaui/main/docs/images/slider.png" alt="Slider"></td>
</tr>
<tr>
<td><b>Select</b><br>Seleção simples ou múltipla, com busca.<br><img src="https://raw.githubusercontent.com/GuilhermeFelix95/lunaui/main/docs/images/select.png" alt="Select"></td>
<td><b>SegmentedControl</b><br>De 2 a 4 opções com destaque deslizante.<br><img src="https://raw.githubusercontent.com/GuilhermeFelix95/lunaui/main/docs/images/segmented.png" alt="SegmentedControl"></td>
</tr>
<tr>
<td><b>Chip</b><br>Filtros selecionáveis, com contador e remover.<br><img src="https://raw.githubusercontent.com/GuilhermeFelix95/lunaui/main/docs/images/chip.png" alt="Chip"></td>
<td><b>Rating</b><br>Avaliação por luas, com meia nota.<br><img src="https://raw.githubusercontent.com/GuilhermeFelix95/lunaui/main/docs/images/rating.png" alt="Rating"></td>
</tr>
</table>

### Exibição de conteúdo

<table>
<tr>
<td width="50%"><b>Card</b><br>Elevado, contorno, suave e sólido, com crescente opcional.<br><img src="https://raw.githubusercontent.com/GuilhermeFelix95/lunaui/main/docs/images/card.png" alt="Card"></td>
<td width="50%"><b>Badge</b><br>Selos, contador e status em fases da lua.<br><img src="https://raw.githubusercontent.com/GuilhermeFelix95/lunaui/main/docs/images/badge.png" alt="Badge"></td>
</tr>
<tr>
<td><b>Avatar</b><br>Foto ou iniciais, status em lua e grupo empilhado.<br><img src="https://raw.githubusercontent.com/GuilhermeFelix95/lunaui/main/docs/images/avatar.png" alt="Avatar"></td>
<td><b>Text</b><br>Oito variantes tipográficas, tons e destaque.<br><img src="https://raw.githubusercontent.com/GuilhermeFelix95/lunaui/main/docs/images/text.png" alt="Text"></td>
</tr>
<tr>
<td><b>List</b><br>Itens com início e fim, seções, seleção e estado vazio.<br><img src="https://raw.githubusercontent.com/GuilhermeFelix95/lunaui/main/docs/images/list.png" alt="List"></td>
<td><b>Accordion</b><br>Seções que abrem e fecham, uma por vez ou várias.<br><img src="https://raw.githubusercontent.com/GuilhermeFelix95/lunaui/main/docs/images/accordion.png" alt="Accordion"></td>
</tr>
<tr>
<td><b>Divider</b><br>Simples, com texto, vertical ou com lua.<br><img src="https://raw.githubusercontent.com/GuilhermeFelix95/lunaui/main/docs/images/divider.png" alt="Divider"></td>
<td><b>Skeleton</b><br>Espaço reservado que pulsa, sem brilho deslizante.<br><img src="https://raw.githubusercontent.com/GuilhermeFelix95/lunaui/main/docs/images/skeleton.png" alt="Skeleton"></td>
</tr>
<tr>
<td><b>Progress</b><br>Barra fosca ou lua que enche, com versão indeterminada.<br><img src="https://raw.githubusercontent.com/GuilhermeFelix95/lunaui/main/docs/images/progress.png" alt="Progress"></td>
<td><b>Spinner</b><br>Indicador de carregamento com as fases da lua.<br><img src="https://raw.githubusercontent.com/GuilhermeFelix95/lunaui/main/docs/images/spinner.png" alt="Spinner"></td>
</tr>
</table>

### Feedback e sobreposições

<table>
<tr>
<td width="50%"><b>Modal</b><br>Confirmação, ação destrutiva e informativo.<br><img src="https://raw.githubusercontent.com/GuilhermeFelix95/lunaui/main/docs/images/modal.png" alt="Modal"></td>
<td width="50%"><b>Toast</b><br>Avisos com fila, ação de desfazer e gesto para dispensar.<br><img src="https://raw.githubusercontent.com/GuilhermeFelix95/lunaui/main/docs/images/toast.png" alt="Toast"></td>
</tr>
<tr>
<td><b>BottomSheet</b><br>Folha inferior com pontos de parada e alça em fases da lua.<br><img src="https://raw.githubusercontent.com/GuilhermeFelix95/lunaui/main/docs/images/bottomsheet.png" alt="BottomSheet"></td>
<td><b>Alert</b><br>Aviso fixo em quatro tons, com ação e botão de fechar.<br><img src="https://raw.githubusercontent.com/GuilhermeFelix95/lunaui/main/docs/images/alert.png" alt="Alert"></td>
</tr>
</table>

### Navegação

<table>
<tr>
<td width="50%"><b>Tabs</b><br>Linha, pílula e cheia, com indicador deslizante.<br><img src="https://raw.githubusercontent.com/GuilhermeFelix95/lunaui/main/docs/images/tabs.png" alt="Tabs"></td>
<td width="50%"><b>Header</b><br>Título grande que recolhe ao rolar, voltar, ações e busca.<br><img src="https://raw.githubusercontent.com/GuilhermeFelix95/lunaui/main/docs/images/header.png" alt="Header"></td>
</tr>
<tr>
<td><b>Navigation</b><br>Barra inferior colada ou flutuante, com lua no item ativo.<br><img src="https://raw.githubusercontent.com/GuilhermeFelix95/lunaui/main/docs/images/navigation.png" alt="Navigation"></td>
<td></td>
</tr>
</table>

## Web

Os mesmos componentes existem para a web em `@lunakit/css`, `@lunakit/react` e `@lunakit/vue`. Veja [docs/web.md](docs/web.md).

## Estado do projeto

- Tipagem completa em TypeScript e testes com Jest e Testing Library.
- Catálogo no Storybook para React Native (`pnpm --filter example storybook`).
- **Ainda não validado em aparelhos reais.** Os pontos que mais merecem atenção são o arrasto do `Slider` e do `BottomSheet`, a rolagem do `Header` e a animação do `Accordion`.
- Web e desktop estão nos planos, em etapas futuras.

## Desenvolvimento

O repositório usa pnpm e Turborepo.

```sh
pnpm install
pnpm typecheck
pnpm test
pnpm --filter example start        # app de exemplo
pnpm --filter example storybook    # catálogo dos componentes no celular
```

Estrutura: `packages/lunaui` (a biblioteca), `apps/example` (app Expo de exemplo) e `docs/images` (imagens deste README).

## Licença

[MIT](LICENSE)
