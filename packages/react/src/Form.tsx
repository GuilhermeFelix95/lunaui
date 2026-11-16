import { useState, type ButtonHTMLAttributes, type CSSProperties, type InputHTMLAttributes, type KeyboardEvent, type ReactNode, type SelectHTMLAttributes } from 'react';

export function Select({ error, className, ...rest }: SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }) {
  return <select {...rest} className={['lk-select', className].filter(Boolean).join(' ')} aria-invalid={error || undefined} />;
}

export type SliderProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onChange'> & {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  onValueChange?: (value: number) => void;
};
export function Slider({ value, defaultValue = 0, min = 0, max = 100, onValueChange, ...rest }: SliderProps) {
  const [inner, setInner] = useState(defaultValue);
  const v = value ?? inner;
  const p = max === min ? 0 : (v - min) / (max - min);
  return (
    <input
      {...rest}
      type="range"
      className="lk-slider"
      min={min}
      max={max}
      value={v}
      style={{ '--lk-p': p } as CSSProperties}
      onChange={(e) => {
        const n = Number(e.target.value);
        setInner(n);
        onValueChange?.(n);
      }}
    />
  );
}

export function Chip({ selected, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean }) {
  return <button type="button" {...rest} className="lk-chip" aria-pressed={selected ?? false} />;
}

export type SegmentedOption = { value: string; label: ReactNode; disabled?: boolean };
export function SegmentedControl({ options, value, defaultValue, onValueChange, ...rest }: {
  options: SegmentedOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  'aria-label'?: string;
}) {
  const [inner, setInner] = useState(defaultValue ?? options[0]?.value ?? '');
  const current = value ?? inner;
  const pick = (v: string) => {
    setInner(v);
    onValueChange?.(v);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const btns = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]:not(:disabled)'));
    const i = btns.indexOf(document.activeElement as HTMLButtonElement);
    const n = btns[(i + (e.key === 'ArrowRight' ? 1 : -1) + btns.length) % btns.length];
    e.preventDefault();
    n?.focus();
    n?.click();
  };
  return (
    <div {...rest} role="radiogroup" className="lk-segmented" onKeyDown={onKeyDown}>
      {options.map((o) => (
        <button key={o.value} type="button" role="radio" aria-checked={current === o.value} tabIndex={current === o.value ? 0 : -1} disabled={o.disabled} onClick={() => pick(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function RadioGroup({ variant, direction, children, ...rest }: { variant?: 'card'; direction?: 'row'; children: ReactNode; 'aria-label'?: string }) {
  return <div {...rest} role="radiogroup" className="lk-radio-group" data-variant={variant} data-direction={direction}>{children}</div>;
}
export function Radio({ label, description, ...rest }: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { label: ReactNode; description?: ReactNode }) {
  return (
    <label className="lk-choice">
      <input {...rest} type="radio" className="lk-radio" />
      <span>{label}{description && <small>{description}</small>}</span>
    </label>
  );
}

export function Rating({ value, defaultValue = 0, max = 5, readOnly, onValueChange }: {
  value?: number;
  defaultValue?: number;
  max?: number;
  readOnly?: boolean;
  onValueChange?: (v: number) => void;
}) {
  const [inner, setInner] = useState(defaultValue);
  const v = value ?? inner;
  return (
    <div className="lk-rating" role={readOnly ? 'img' : 'radiogroup'} aria-label={`Nota ${v} de ${max}`} data-readonly={readOnly ? '' : undefined}>
      {Array.from({ length: max }, (_, i) => {
        const f = Math.max(0, Math.min(1, v - i));
        return (
          <button
            key={i}
            type="button"
            role={readOnly ? undefined : 'radio'}
            aria-checked={readOnly ? undefined : v === i + 1}
            aria-label={`${i + 1}`}
            disabled={readOnly}
            className="lk-rating-moon"
            style={{ '--lk-f': f } as CSSProperties}
            onClick={() => {
              setInner(i + 1);
              onValueChange?.(i + 1);
            }}
          />
        );
      })}
    </div>
  );
}
