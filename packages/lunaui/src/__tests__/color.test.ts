import { blend, deriveColor } from '../color';

describe('deriveColor', () => {
  it('mantém a cor-base e escurece a borda', () => {
    const c = deriveColor('#7c6cf0');
    expect(c.base).toBe('#7c6cf0');
    expect(c.dark).toBe('#594ead');
  });

  it('escolhe texto branco em cor escura e escuro em cor clara', () => {
    expect(deriveColor('#5a49d0').on).toBe('#ffffff');
    expect(deriveColor('#f59e0b').on).toBe('#17142b');
  });

  it('aceita hex curto', () => {
    expect(deriveColor('#fff').base).toBe('#ffffff');
  });

  it('gera fundo suave com 15% de opacidade', () => {
    expect(deriveColor('#10b981').soft).toBe('rgba(16,185,129,0.15)');
  });
});

describe('blend', () => {
  it('mistura a cor sobre o fundo na opacidade dada', () => {
    expect(blend('#000000', '#ffffff', 0.5)).toBe('#808080');
    expect(blend('#7c6cf0', '#ffffff', 0)).toBe('#ffffff');
  });
});
