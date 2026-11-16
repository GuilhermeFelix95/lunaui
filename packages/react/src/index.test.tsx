import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Button, Input, Progress, Switch } from './index';

describe('@lunakit/react', () => {
  it('Button aplica classe, variante e estado de carregamento', () => {
    const html = renderToStaticMarkup(<Button variant="soft" loading>Salvar</Button>);
    expect(html).toContain('class="lk-button"');
    expect(html).toContain('data-variant="soft"');
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('disabled');
  });
  it('Input liga o rótulo e marca erro', () => {
    const html = renderToStaticMarkup(<Input id="n" label="Nome" error="Obrigatório" />);
    expect(html).toContain('for="n"');
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('Obrigatório');
  });
  it('Switch tem role switch', () => {
    expect(renderToStaticMarkup(<Switch />)).toContain('role="switch"');
  });
  it('Progress expõe o valor', () => {
    const html = renderToStaticMarkup(<Progress value={40} />);
    expect(html).toContain('aria-valuenow="40"');
    expect(html).toContain('--lk-value:40%');
  });
});
