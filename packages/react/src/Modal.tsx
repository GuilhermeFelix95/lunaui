import { useEffect, useRef, type ReactNode } from 'react';

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
};

/** Usa o <dialog> nativo: Esc, foco preso e fundo inerte vêm do navegador. */
export function Modal({ open, onClose, title, children, actions }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} className="lk-modal" aria-label={typeof title === 'string' ? title : undefined} onClose={onClose}>
      {title && <h2>{title}</h2>}
      {children}
      {actions && <div className="lk-modal-actions">{actions}</div>}
    </dialog>
  );
}
