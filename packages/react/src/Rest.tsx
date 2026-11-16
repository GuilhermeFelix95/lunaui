import { useEffect, useRef, useSyncExternalStore, type ElementType, type HTMLAttributes, type ReactNode } from 'react';

type Tone = 'primary' | 'success' | 'warning' | 'danger';

/* ---------- Text ---------- */
export type TextProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  variant?: 'display' | 'title' | 'heading' | 'body' | 'bodySm' | 'label' | 'caption' | 'overline';
  tone?: 'muted' | 'primary' | 'success' | 'danger';
};
export function Text({ as: Tag = 'p', variant, tone, className, ...rest }: TextProps) {
  return <Tag {...rest} className={['lk-text', className].filter(Boolean).join(' ')} data-variant={variant} data-tone={tone} />;
}

/* ---------- Avatar ---------- */
export type AvatarProps = HTMLAttributes<HTMLSpanElement> & {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'solid' | 'soft';
  status?: 'online' | 'away' | 'offline';
};
const initials = (n = '') =>
  n
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('');
export function Avatar({ src, name, size, variant, status, ...rest }: AvatarProps) {
  return (
    <span {...rest} className="lk-avatar" data-size={size} data-variant={variant} role="img" aria-label={name}>
      {src ? <img src={src} alt="" /> : initials(name)}
      {status && (
        <i
          className="lk-moon"
          data-status={status}
          data-phase={status === 'online' ? 'full' : status === 'away' ? 'half' : 'new'}
          aria-label={status}
        />
      )}
    </span>
  );
}
export function AvatarGroup({ children }: { children: ReactNode }) {
  return <span className="lk-avatar-group">{children}</span>;
}

/* ---------- List ---------- */
export function List({ title, children }: { title?: ReactNode; children: ReactNode }) {
  return (
    <>
      {title && <p className="lk-list-title">{title}</p>}
      <ul className="lk-list">{children}</ul>
    </>
  );
}
export type ListItemProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  href?: string;
  onClick?: () => void;
  chevron?: boolean;
  destructive?: boolean;
  disabled?: boolean;
};
export function ListItem({ title, subtitle, leading, trailing, href, onClick, chevron, destructive, disabled }: ListItemProps) {
  const inner = (
    <>
      {leading}
      <span className="lk-list-item-text">
        <span className="lk-list-item-title">{title}</span>
        {subtitle && <span className="lk-list-item-subtitle">{subtitle}</span>}
      </span>
      {trailing}
    </>
  );
  const common = {
    className: 'lk-list-item',
    'data-chevron': chevron ? '' : undefined,
    'data-destructive': destructive ? '' : undefined,
  };
  return (
    <li>
      {href ? (
        <a {...common} href={href} aria-disabled={disabled || undefined}>
          {inner}
        </a>
      ) : onClick ? (
        <button {...common} type="button" onClick={onClick} disabled={disabled}>
          {inner}
        </button>
      ) : (
        <div {...common}>{inner}</div>
      )}
    </li>
  );
}
export function ListEmpty({ title, description }: { title: ReactNode; description?: ReactNode }) {
  return (
    <div className="lk-list-empty">
      <i className="lk-moon" data-phase="new" />
      <b>{title}</b>
      {description && <p>{description}</p>}
    </div>
  );
}

/* ---------- Header ---------- */
export function Header({
  title,
  large,
  subtitle,
  left,
  right,
  scrolled,
}: {
  title?: ReactNode;
  large?: ReactNode;
  subtitle?: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
  scrolled?: boolean;
}) {
  return (
    <header className="lk-header" data-scrolled={scrolled ? '' : undefined}>
      <div className="lk-header-bar">
        {left}
        <h1 className="lk-header-title">{title}</h1>
        {right}
      </div>
      {large && (
        <div className="lk-header-large">
          <h1>{large}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      )}
    </header>
  );
}

/* ---------- Navigation ---------- */
export function Navigation({
  variant,
  children,
  ...rest
}: {
  variant?: 'attached' | 'floating';
  children: ReactNode;
  'aria-label'?: string;
}) {
  return (
    <nav {...rest} className="lk-nav" data-variant={variant}>
      {children}
    </nav>
  );
}
export function NavItem({
  icon,
  label,
  href,
  active,
  badge,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  href?: string;
  active?: boolean;
  badge?: number;
  onClick?: () => void;
}) {
  const inner = (
    <>
      <span className="lk-nav-item-icon">
        {icon}
        {badge ? <span className="lk-counter">{badge}</span> : null}
      </span>
      <span className="lk-nav-item-label">{label}</span>
    </>
  );
  const common = { className: 'lk-nav-item', 'aria-current': active ? ('page' as const) : undefined };
  return href ? (
    <a {...common} href={href} onClick={onClick}>
      {inner}
    </a>
  ) : (
    <button {...common} type="button" onClick={onClick}>
      {inner}
    </button>
  );
}

/* ---------- Alert ---------- */
export function Alert({
  tone,
  title,
  children,
  action,
  onClose,
}: {
  tone?: Tone;
  title: ReactNode;
  children?: ReactNode;
  action?: { label: string; onClick: () => void };
  onClose?: () => void;
}) {
  return (
    <div className="lk-alert" data-tone={tone} role={tone === 'danger' ? 'alert' : 'status'}>
      <i className="lk-moon" aria-hidden />
      <div className="lk-alert-body">
        <b>{title}</b>
        {children && <p>{children}</p>}
        {action && (
          <button type="button" className="lk-alert-action" onClick={action.onClick}>
            {action.label}
          </button>
        )}
      </div>
      {onClose && (
        <button type="button" className="lk-alert-close" aria-label="Fechar" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
}

/* ---------- Toast ---------- */
export type ToastItem = {
  id: number;
  title: string;
  description?: string;
  tone?: Tone;
  action?: { label: string; onClick: () => void };
};
let items: ToastItem[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function dismissToast(id: number) {
  items = items.filter((t) => t.id !== id);
  emit();
}
/** Mostra um aviso; some sozinho após `duration` ms (0 deixa fixo). */
export function toast(t: Omit<ToastItem, 'id'> & { duration?: number }): number {
  const id = nextId++;
  const { duration = 4000, ...rest } = t;
  items = [...items, { id, ...rest }];
  emit();
  if (duration > 0) setTimeout(() => dismissToast(id), duration);
  return id;
}
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};
const snapshot = () => items;

export function ToastHost({ position }: { position?: 'top' | 'bottom' }) {
  const list = useSyncExternalStore(subscribe, snapshot, snapshot);
  return (
    <div className="lk-toast-stack" data-position={position} aria-live="polite">
      {list.map((t) => (
        <div key={t.id} className="lk-toast" data-tone={t.tone} role="status">
          <div className="lk-toast-body">
            <b>{t.title}</b>
            {t.description && <span>{t.description}</span>}
          </div>
          {t.action && (
            <button
              type="button"
              className="lk-toast-action"
              onClick={() => {
                t.action!.onClick();
                dismissToast(t.id);
              }}
            >
              {t.action.label}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

/* ---------- BottomSheet ---------- */
export function BottomSheet({
  open,
  onClose,
  title,
  subtitle,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} className="lk-sheet" aria-label={typeof title === 'string' ? title : undefined} onClose={onClose}>
      <div className="lk-sheet-handle">
        <i className="lk-moon" aria-hidden />
      </div>
      {title && (
        <div className="lk-sheet-header">
          <b>{title}</b>
          {subtitle && <span>{subtitle}</span>}
        </div>
      )}
      <div className="lk-sheet-body">{children}</div>
    </dialog>
  );
}
