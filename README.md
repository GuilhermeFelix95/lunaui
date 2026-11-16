# lunaui

Biblioteca de componentes para React Native (Expo), com tema de cor único e identidade lunar. Web e desktop virão em etapas futuras.

> Em desenvolvimento: ainda não publicada no npm.

## Componentes

Button, Input, Switch, Checkbox, Card, Badge, Avatar, Spinner e Text.

## Uso

```tsx
import { Button, LunaProvider, createTheme } from 'lunaui';

export default function App() {
  return (
    <LunaProvider theme={createTheme({ color: '#7c6cf0' })}>
      <Button>Continuar</Button>
      <Button color="#10b981">Pagar</Button>
    </LunaProvider>
  );
}
```

A cor não é fixa: você define uma cor-base no tema (ou por componente com a prop `color`) e a lib deriva bordas, estados e a cor do texto.

## Desenvolvimento

```sh
pnpm install
pnpm typecheck
pnpm --filter example start
```

Estrutura: `packages/lunaui` (a biblioteca) e `apps/example` (app Expo de exemplo).

## Licença

MIT
