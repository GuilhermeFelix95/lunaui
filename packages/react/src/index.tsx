import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'solid' | 'soft' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
};
export function Button({ variant, size, loading, className, children, disabled, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={cx('lk-button', className)}
      data-variant={variant}
      data-size={size}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
    >
      {children}
    </button>
  );
}

export type InputProps = InputHTMLAttributes<HTMLInputElement> & { label?: ReactNode; error?: ReactNode };
export function Input({ label, error, id, className, ...rest }: InputProps) {
  return (
    <div className="lk-field">
      {label && <label className="lk-label" htmlFor={id}>{label}</label>}
      <input {...rest} id={id} className={cx('lk-input', className)} aria-invalid={error ? true : undefined} />
      {error && <p className="lk-helper" data-error>{error}</p>}
    </div>
  );
}

export type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> & { size?: 'sm' | 'md' };
export function Switch({ size, className, ...rest }: SwitchProps) {
  return <input {...rest} type="checkbox" role="switch" className={cx('lk-switch', className)} data-size={size} />;
}

export function Checkbox({ className, ...rest }: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) {
  return <input {...rest} type="checkbox" className={cx('lk-checkbox', className)} />;
}

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: 'solid' | 'soft' | 'outline' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
};
export function Badge({ variant, size, className, ...rest }: BadgeProps) {
  return <span {...rest} className={cx('lk-badge', className)} data-variant={variant} data-size={size} />;
}

export type CardProps = HTMLAttributes<HTMLDivElement> & { variant?: 'solid' | 'soft' | 'outline'; moon?: boolean };
export function Card({ variant, moon, className, ...rest }: CardProps) {
  return <div {...rest} className={cx('lk-card', className)} data-variant={variant} data-moon={moon ? '' : undefined} />;
}

export function Spinner({ size, ...rest }: HTMLAttributes<HTMLSpanElement> & { size?: 'sm' | 'md' | 'lg' }) {
  return <span role="status" aria-label="Carregando" {...rest} className="lk-spinner" data-size={size} />;
}

export function Divider({ orientation }: { orientation?: 'horizontal' | 'vertical' }) {
  return <hr className="lk-divider" data-orientation={orientation} />;
}

export function Skeleton({ shape, className, ...rest }: HTMLAttributes<HTMLSpanElement> & { shape?: 'circle' }) {
  return <span aria-hidden {...rest} className={cx('lk-skeleton', className)} data-shape={shape} />;
}

export function Progress({ value, ...rest }: HTMLAttributes<HTMLDivElement> & { value?: number }) {
  const style = value == null ? undefined : { '--lk-value': `${value}%` };
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      {...rest}
      className="lk-progress"
      data-indeterminate={value == null ? '' : undefined}
      style={style as React.CSSProperties}
    />
  );
}
