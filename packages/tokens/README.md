# @lunakit/tokens

Deriva a borda escura, o fundo suave e a cor do texto a partir de uma única cor-base e gera as variáveis CSS do `@lunakit/css`.

```ts
import { lunaStyle, applyColor } from '@lunakit/tokens';

lunaStyle('#10b981'); // "--lk-color:#10b981;--lk-color-dark:#0c855d;--lk-color-on:#17142b"
applyColor(document.documentElement, '#10b981');
```
