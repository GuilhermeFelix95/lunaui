# @lunakit/css

Estilos do lunakit para a web, sem JavaScript. Funciona em HTML puro, Astro, Next, Vue, React ou qualquer framework.

```html
<link rel="stylesheet" href="node_modules/@lunakit/css/src/lunakit.css">
<button class="lk-button" data-variant="soft">Salvar</button>
```

## Cor-base

Defina `--lk-color`, `--lk-color-dark` e `--lk-color-on` em qualquer elemento. Use `lunaStyle('#10b981')` de `@lunakit/tokens` para gerar os três valores.

## Tema escuro

Automático por `prefers-color-scheme`. Force com `<html data-theme="dark">` ou `"light"`.

## Componentes

Classes `lk-*` com variações em `data-variant`, `data-size` e `data-tone`. Veja `demo.html` para o HTML de cada componente. Modal e BottomSheet usam `<dialog>`, Accordion usa `<details>`, Slider usa `<input type="range">`.
