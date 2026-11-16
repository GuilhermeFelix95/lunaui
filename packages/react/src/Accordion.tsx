import type { ReactNode } from 'react';

export function Accordion({ children }: { children: ReactNode }) {
  return <div className="lk-accordion">{children}</div>;
}

/** Usa <details>: abre e fecha por teclado sem JavaScript. */
export function AccordionItem({ title, defaultOpen, disabled, children }: { title: ReactNode; defaultOpen?: boolean; disabled?: boolean; children: ReactNode }) {
  return (
    <details open={defaultOpen} aria-disabled={disabled || undefined}>
      <summary>{title}</summary>
      <p>{children}</p>
    </details>
  );
}
