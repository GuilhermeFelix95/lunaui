export type ToastTone = 'info' | 'success' | 'error' | 'warning';

export type ToastOptions = {
  title: string;
  description?: string;
  tone?: ToastTone;
  /** Em ms. Padrão: 4000 (6000 para erro). Com ação, o mínimo é 6000. */
  duration?: number;
  action?: { label: string; onPress: () => void };
  color?: string;
};

export type ToastItem = ToastOptions & { id: number };

let items: ToastItem[] = [];
let nextId = 1;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

export const toast = {
  show(options: ToastOptions): number {
    const id = nextId++;
    items = [...items, { ...options, id }];
    emit();
    return id;
  },
  dismiss(id: number) {
    items = items.filter((t) => t.id !== id);
    emit();
  },
  clear() {
    items = [];
    emit();
  },
};

export function subscribeToasts(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getToasts(): ToastItem[] {
  return items;
}

export function useToast() {
  return toast;
}
