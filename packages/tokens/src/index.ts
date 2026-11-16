type RGB = [number, number, number];

function toRgb(hex: string): RGB {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as RGB;
}

const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
const toHex = (c: RGB) => '#' + c.map((v) => clamp(v).toString(16).padStart(2, '0')).join('');
const mix = (a: RGB, b: RGB, t: number): RGB => a.map((v, i) => v + (b[i]! - v) * t) as RGB;

function luminance([r, g, b]: RGB): number {
  const [R, G, B] = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  }) as RGB;
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/** Cor sólida resultante de `hex` com opacidade `alpha` sobre `bgHex`. */
export function blend(hex: string, bgHex: string, alpha: number): string {
  return toHex(mix(toRgb(bgHex), toRgb(hex), alpha));
}

export type DerivedColor = { base: string; dark: string; soft: string; on: string };

/** Deriva borda, fundo suave e cor do texto a partir de uma única cor-base. */
export function deriveColor(hex: string): DerivedColor {
  const c = toRgb(hex);
  return {
    base: toHex(c),
    dark: toHex(mix(c, [0, 0, 0], 0.28)),
    soft: `rgba(${c.map(Math.round).join(',')},0.15)`,
    on: luminance(c) > 0.3 ? '#17142b' : '#ffffff',
  };
}

/**
 * Variáveis CSS que o @lunakit/css usa para a cor-base.
 * Aplique em qualquer elemento (ou em `:root`) para trocar a cor de toda a subárvore.
 */
export function lunaVars(color: string): Record<'--lk-color' | '--lk-color-dark' | '--lk-color-on', string> {
  const c = deriveColor(color);
  return { '--lk-color': c.base, '--lk-color-dark': c.dark, '--lk-color-on': c.on };
}

/** Mesma coisa de `lunaVars`, como texto para o atributo `style` (útil em SSR e HTML puro). */
export function lunaStyle(color: string): string {
  return Object.entries(lunaVars(color))
    .map(([k, v]) => `${k}:${v}`)
    .join(';');
}

/** Aplica a cor-base a um elemento do DOM. */
export function applyColor(el: { style: { setProperty(name: string, value: string): void } }, color: string): void {
  for (const [k, v] of Object.entries(lunaVars(color))) el.style.setProperty(k, v);
}
