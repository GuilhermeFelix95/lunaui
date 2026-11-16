import { createContext, useContext, useId, useState, type KeyboardEvent, type ReactNode } from 'react';

type Ctx = { value: string; select: (v: string) => void; id: string };
const TabsCtx = createContext<Ctx | null>(null);
const useTabs = () => {
  const c = useContext(TabsCtx);
  if (!c) throw new Error('Tab e TabPanel precisam estar dentro de <Tabs>');
  return c;
};

export type TabsProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: 'line' | 'pill' | 'solid';
  children: ReactNode;
};

/** Lista de abas; os painéis ficam em <TabPanel> dentro de <TabsRoot>. */
export function TabsRoot({ value, defaultValue = '', onValueChange, children }: Omit<TabsProps, 'variant'>) {
  const [inner, setInner] = useState(defaultValue);
  const id = useId();
  const current = value ?? inner;
  const select = (v: string) => {
    setInner(v);
    onValueChange?.(v);
  };
  return <TabsCtx.Provider value={{ value: current, select, id }}>{children}</TabsCtx.Provider>;
}

export function TabList({ variant, children, ...rest }: { variant?: TabsProps['variant']; children: ReactNode; 'aria-label'?: string }) {
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
    if (!keys.includes(e.key)) return;
    const tabs = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)'));
    const i = tabs.indexOf(document.activeElement as HTMLButtonElement);
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    e.preventDefault();
    tabs[next]?.focus();
    tabs[next]?.click();
  };
  return (
    <div {...rest} role="tablist" className="lk-tabs" data-variant={variant} onKeyDown={onKeyDown}>
      {children}
    </div>
  );
}

export function Tab({ value, disabled, children }: { value: string; disabled?: boolean; children: ReactNode }) {
  const { value: current, select, id } = useTabs();
  const selected = current === value;
  return (
    <button
      type="button"
      role="tab"
      id={`${id}-tab-${value}`}
      aria-selected={selected}
      aria-controls={`${id}-panel-${value}`}
      tabIndex={selected ? 0 : -1}
      disabled={disabled}
      onClick={() => select(value)}
    >
      {children}
    </button>
  );
}

export function TabPanel({ value, children }: { value: string; children: ReactNode }) {
  const { value: current, id } = useTabs();
  return (
    <div role="tabpanel" id={`${id}-panel-${value}`} aria-labelledby={`${id}-tab-${value}`} hidden={current !== value}>
      {current === value ? children : null}
    </div>
  );
}
