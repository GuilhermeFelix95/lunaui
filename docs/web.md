# lunakit na web

Três pacotes, todos com os mesmos 27 componentes e a mesma identidade lunar.

| Pacote | Para quê |
| --- | --- |
| `@lunakit/css` | Estilos em CSS puro. Funciona em HTML, Astro, ou qualquer framework. |
| `@lunakit/react` | Componentes React (também serve Next.js). |
| `@lunakit/vue` | Componentes Vue 3. |
| `@lunakit/tokens` | Deriva a cor-base em variáveis CSS (`lunaStyle`, `applyColor`). |

## Cor-base e tema

```ts
import { applyColor } from '@lunakit/tokens';
applyColor(document.documentElement, '#10b981');
```

O tema escuro segue `prefers-color-scheme`. Force com `<html data-theme="dark">` ou `"light"`.

## React

```tsx
import '@lunakit/css';
import { Button, Card } from '@lunakit/react';

export default () => (
  <Card moon>
    <Button variant="soft">Salvar</Button>
  </Card>
);
```

## Vue

```vue
<script setup>
import '@lunakit/css';
import { Button } from '@lunakit/vue';
</script>
<template><Button variant="soft">Salvar</Button></template>
```

## Next.js

Importe o CSS uma vez em `app/layout.tsx` (`import '@lunakit/css';`). Os componentes que usam estado (Tabs, Modal, Toast...) precisam de `'use client'` no arquivo que os importa.

Para evitar o flash da cor-base no servidor, aplique `style={{...lunaVars('#10b981')}}` no `<html>` com `@lunakit/tokens`.

## Astro

Sem framework: importe o CSS no layout (`import '@lunakit/css';`) e use as classes (`<button class="lk-button">`). Com ilhas React ou Vue, use os pacotes normalmente com `client:load`. Veja `packages/css/demo.html` para o HTML de cada componente.

## HTML puro

```html
<link rel="stylesheet" href="node_modules/@lunakit/css/src/lunakit.css">
<button class="lk-button" data-variant="soft">Salvar</button>
```

## Acessibilidade e movimento

Modal e BottomSheet usam `<dialog>` (Esc e foco preso vêm do navegador); Accordion usa `<details>`. Animações respeitam `prefers-reduced-motion`.
