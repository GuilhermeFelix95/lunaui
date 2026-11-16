import { describe, expect, it } from 'vitest';
import { blend, deriveColor, lunaStyle, lunaVars } from './index';

describe('deriveColor', () => {
  it('deriva a borda escura, o fundo suave e o texto da cor-base', () => {
    const c = deriveColor('#7c6cf0');
    expect(c.base).toBe('#7c6cf0');
    expect(c.dark).toBe('#594ead');
    expect(c.soft).toBe('rgba(124,108,240,0.15)');
    expect(c.on).toBe('#ffffff');
  });

  it('usa texto escuro em cores claras', () => {
    expect(deriveColor('#f59e0b').on).toBe('#17142b');
    expect(deriveColor('#10b981').on).toBe('#17142b');
    expect(deriveColor('#0ea5e9').on).toBe('#17142b');
  });

  it('aceita hex curto', () => {
    expect(deriveColor('#fff').base).toBe('#ffffff');
  });
});

describe('blend', () => {
  it('mistura a cor com o fundo pela opacidade', () => {
    expect(blend('#000000', '#ffffff', 0.5)).toBe('#808080');
    expect(blend('#7c6cf0', '#ffffff', 0)).toBe('#ffffff');
  });
});

describe('variáveis CSS', () => {
  it('lunaVars devolve as três variáveis usadas pelo CSS', () => {
    expect(lunaVars('#10b981')).toEqual({
      '--lk-color': '#10b981',
      '--lk-color-dark': '#0c855d',
      '--lk-color-on': '#17142b',
    });
  });

  it('lunaStyle gera o texto do atributo style', () => {
    expect(lunaStyle('#7c6cf0')).toBe('--lk-color:#7c6cf0;--lk-color-dark:#594ead;--lk-color-on:#ffffff');
  });
});
