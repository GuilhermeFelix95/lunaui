import {
  defineComponent,
  h,
  inject,
  nextTick,
  onMounted,
  provide,
  ref,
  shallowRef,
  watch,
  type InjectionKey,
  type PropType,
  type Ref,
  type VNode,
} from 'vue';

type Tone = 'primary' | 'success' | 'warning' | 'danger';
const flag = (v: unknown) => (v ? '' : undefined);

/* ---------- Button ---------- */
export const Button = defineComponent({
  name: 'LkButton',
  props: {
    variant: String as PropType<'solid' | 'soft' | 'outline' | 'ghost'>,
    size: String as PropType<'sm' | 'md' | 'lg'>,
    loading: Boolean,
    disabled: Boolean,
  },
  setup(props, { slots }) {
    return () =>
      h(
        'button',
        {
          class: 'lk-button',
          type: 'button',
          'data-variant': props.variant,
          'data-size': props.size,
          'aria-busy': props.loading ? 'true' : undefined,
          disabled: props.disabled || props.loading,
        },
        slots.default?.(),
      );
  },
});

/* ---------- Input ---------- */
export const Input = defineComponent({
  name: 'LkInput',
  inheritAttrs: false,
  props: { modelValue: [String, Number] as PropType<string | number>, label: String, error: String },
  emits: ['update:modelValue'],
  setup(props, { attrs, emit }) {
    return () =>
      h('div', { class: 'lk-field' }, [
        props.label ? h('label', { class: 'lk-label', for: attrs.id as string }, props.label) : null,
        h('input', {
          ...attrs,
          class: 'lk-input',
          value: props.modelValue,
          'aria-invalid': props.error ? 'true' : undefined,
          onInput: (e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value),
        }),
        props.error ? h('p', { class: 'lk-helper', 'data-error': '' }, props.error) : null,
      ]);
  },
});

/* ---------- Switch / Checkbox ---------- */
export const Switch = defineComponent({
  name: 'LkSwitch',
  props: { modelValue: Boolean, size: String as PropType<'sm' | 'md'> },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h('input', {
        type: 'checkbox',
        role: 'switch',
        class: 'lk-switch',
        'data-size': props.size,
        checked: props.modelValue,
        onChange: (e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).checked),
      });
  },
});
export const Checkbox = defineComponent({
  name: 'LkCheckbox',
  props: { modelValue: Boolean },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h('input', {
        type: 'checkbox',
        class: 'lk-checkbox',
        checked: props.modelValue,
        onChange: (e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).checked),
      });
  },
});

/* ---------- Badge / Card / Spinner / Divider / Skeleton / Progress ---------- */
export const Badge = defineComponent({
  name: 'LkBadge',
  props: {
    variant: String as PropType<'solid' | 'soft' | 'outline' | 'neutral'>,
    size: String as PropType<'sm' | 'md' | 'lg'>,
  },
  setup: (props, { slots }) => () =>
    h('span', { class: 'lk-badge', 'data-variant': props.variant, 'data-size': props.size }, slots.default?.()),
});
export const Card = defineComponent({
  name: 'LkCard',
  props: { variant: String as PropType<'solid' | 'soft' | 'outline'>, moon: Boolean },
  setup: (props, { slots }) => () =>
    h('div', { class: 'lk-card', 'data-variant': props.variant, 'data-moon': flag(props.moon) }, slots.default?.()),
});
export const Spinner = defineComponent({
  name: 'LkSpinner',
  props: { size: String as PropType<'sm' | 'md' | 'lg'> },
  setup: (props) => () => h('span', { class: 'lk-spinner', role: 'status', 'aria-label': 'Carregando', 'data-size': props.size }),
});
export const Divider = defineComponent({
  name: 'LkDivider',
  props: { orientation: String as PropType<'horizontal' | 'vertical'> },
  setup: (props) => () => h('hr', { class: 'lk-divider', 'data-orientation': props.orientation }),
});
export const Skeleton = defineComponent({
  name: 'LkSkeleton',
  props: { shape: String as PropType<'circle'> },
  setup: (props) => () => h('span', { class: 'lk-skeleton', 'aria-hidden': 'true', 'data-shape': props.shape }),
});
export const Progress = defineComponent({
  name: 'LkProgress',
  props: { value: Number },
  setup: (props) => () =>
    h('div', {
      class: 'lk-progress',
      role: 'progressbar',
      'aria-valuemin': 0,
      'aria-valuemax': 100,
      'aria-valuenow': props.value,
      'data-indeterminate': flag(props.value == null),
      style: props.value == null ? undefined : { '--lk-value': `${props.value}%` },
    }),
});

/* ---------- Tabs ---------- */
type TabsCtx = { value: Ref<string>; select: (v: string) => void; id: string };
const TABS: InjectionKey<TabsCtx> = Symbol('lk-tabs');
let uid = 0;
export const TabsRoot = defineComponent({
  name: 'LkTabsRoot',
  props: { modelValue: String, defaultValue: { type: String, default: '' } },
  emits: ['update:modelValue'],
  setup(props, { slots, emit }) {
    const inner = ref(props.defaultValue);
    const value = ref(props.modelValue ?? props.defaultValue);
    watch(() => props.modelValue, (v) => v != null && (value.value = v));
    provide(TABS, {
      value,
      id: `lk-tabs-${++uid}`,
      select: (v) => {
        inner.value = v;
        value.value = v;
        emit('update:modelValue', v);
      },
    });
    return () => h('div', slots.default?.());
  },
});
export const TabList = defineComponent({
  name: 'LkTabList',
  props: { variant: String as PropType<'line' | 'pill' | 'solid'> },
  setup(props, { slots }) {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
      const tabs = Array.from((e.currentTarget as HTMLElement).querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)'));
      const i = tabs.indexOf(document.activeElement as HTMLButtonElement);
      const n = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      e.preventDefault();
      tabs[n]?.focus();
      tabs[n]?.click();
    };
    return () => h('div', { role: 'tablist', class: 'lk-tabs', 'data-variant': props.variant, onKeydown: onKeyDown }, slots.default?.());
  },
});
export const Tab = defineComponent({
  name: 'LkTab',
  props: { value: { type: String, required: true }, disabled: Boolean },
  setup(props, { slots }) {
    const ctx = inject(TABS)!;
    return () => {
      const sel = ctx.value.value === props.value;
      return h(
        'button',
        {
          type: 'button',
          role: 'tab',
          id: `${ctx.id}-tab-${props.value}`,
          'aria-selected': sel ? 'true' : 'false',
          'aria-controls': `${ctx.id}-panel-${props.value}`,
          tabindex: sel ? 0 : -1,
          disabled: props.disabled,
          onClick: () => ctx.select(props.value),
        },
        slots.default?.(),
      );
    };
  },
});
export const TabPanel = defineComponent({
  name: 'LkTabPanel',
  props: { value: { type: String, required: true } },
  setup(props, { slots }) {
    const ctx = inject(TABS)!;
    return () =>
      h(
        'div',
        {
          role: 'tabpanel',
          id: `${ctx.id}-panel-${props.value}`,
          'aria-labelledby': `${ctx.id}-tab-${props.value}`,
          hidden: ctx.value.value !== props.value,
        },
        ctx.value.value === props.value ? slots.default?.() : undefined,
      );
  },
});

/* ---------- Dialog (Modal e BottomSheet) ---------- */
function dialogLogic(getOpen: () => boolean) {
  const el = ref<HTMLDialogElement | null>(null);
  const sync = () => {
    const d = el.value;
    if (!d) return;
    const open = getOpen();
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  };
  onMounted(sync);
  watch(getOpen, () => nextTick(sync));
  return el;
}
export const Modal = defineComponent({
  name: 'LkModal',
  props: { open: Boolean, title: String },
  emits: ['close'],
  setup(props, { slots, emit }) {
    const el = dialogLogic(() => props.open);
    return () =>
      h('dialog', { ref: el, class: 'lk-modal', 'aria-label': props.title, onClose: () => emit('close') }, [
        props.title ? h('h2', props.title) : null,
        slots.default?.(),
        slots.actions ? h('div', { class: 'lk-modal-actions' }, slots.actions()) : null,
      ]);
  },
});
export const BottomSheet = defineComponent({
  name: 'LkBottomSheet',
  props: { open: Boolean, title: String, subtitle: String },
  emits: ['close'],
  setup(props, { slots, emit }) {
    const el = dialogLogic(() => props.open);
    return () =>
      h('dialog', { ref: el, class: 'lk-sheet', 'aria-label': props.title, onClose: () => emit('close') }, [
        h('div', { class: 'lk-sheet-handle' }, h('i', { class: 'lk-moon', 'aria-hidden': 'true' })),
        props.title
          ? h('div', { class: 'lk-sheet-header' }, [h('b', props.title), props.subtitle ? h('span', props.subtitle) : null])
          : null,
        h('div', { class: 'lk-sheet-body' }, slots.default?.()),
      ]);
  },
});

/* ---------- Accordion ---------- */
export const Accordion = defineComponent({
  name: 'LkAccordion',
  setup: (_, { slots }) => () => h('div', { class: 'lk-accordion' }, slots.default?.()),
});
export const AccordionItem = defineComponent({
  name: 'LkAccordionItem',
  props: { title: { type: String, required: true }, defaultOpen: Boolean, disabled: Boolean },
  setup: (props, { slots }) => () =>
    h('details', { open: props.defaultOpen, 'aria-disabled': props.disabled ? 'true' : undefined }, [
      h('summary', props.title),
      h('p', slots.default?.()),
    ]),
});

/* ---------- Select / Slider / Chip / Segmented / Radio / Rating ---------- */
export const Select = defineComponent({
  name: 'LkSelect',
  props: { modelValue: String, error: Boolean },
  emits: ['update:modelValue'],
  setup: (props, { slots, emit }) => () =>
    h(
      'select',
      {
        class: 'lk-select',
        value: props.modelValue,
        'aria-invalid': props.error ? 'true' : undefined,
        onChange: (e: Event) => emit('update:modelValue', (e.target as HTMLSelectElement).value),
      },
      slots.default?.(),
    ),
});
export const Slider = defineComponent({
  name: 'LkSlider',
  props: { modelValue: { type: Number, default: 0 }, min: { type: Number, default: 0 }, max: { type: Number, default: 100 } },
  emits: ['update:modelValue'],
  setup: (props, { emit }) => () =>
    h('input', {
      type: 'range',
      class: 'lk-slider',
      min: props.min,
      max: props.max,
      value: props.modelValue,
      style: { '--lk-p': props.max === props.min ? 0 : (props.modelValue - props.min) / (props.max - props.min) },
      onInput: (e: Event) => emit('update:modelValue', Number((e.target as HTMLInputElement).value)),
    }),
});
export const Chip = defineComponent({
  name: 'LkChip',
  props: { selected: Boolean },
  setup: (props, { slots }) => () =>
    h('button', { type: 'button', class: 'lk-chip', 'aria-pressed': props.selected ? 'true' : 'false' }, slots.default?.()),
});
export const SegmentedControl = defineComponent({
  name: 'LkSegmentedControl',
  props: {
    options: { type: Array as PropType<{ value: string; label: string; disabled?: boolean }[]>, required: true },
    modelValue: String,
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const b = Array.from((e.currentTarget as HTMLElement).querySelectorAll<HTMLButtonElement>('[role="radio"]:not(:disabled)'));
      const i = b.indexOf(document.activeElement as HTMLButtonElement);
      const n = b[(i + (e.key === 'ArrowRight' ? 1 : -1) + b.length) % b.length];
      e.preventDefault();
      n?.focus();
      n?.click();
    };
    return () => {
      const cur = props.modelValue ?? props.options[0]?.value;
      return h(
        'div',
        { role: 'radiogroup', class: 'lk-segmented', onKeydown: onKeyDown },
        props.options.map((o) =>
          h(
            'button',
            {
              type: 'button',
              role: 'radio',
              'aria-checked': cur === o.value ? 'true' : 'false',
              tabindex: cur === o.value ? 0 : -1,
              disabled: o.disabled,
              onClick: () => emit('update:modelValue', o.value),
            },
            o.label,
          ),
        ),
      );
    };
  },
});
export const RadioGroup = defineComponent({
  name: 'LkRadioGroup',
  props: { variant: String as PropType<'card'>, direction: String as PropType<'row'> },
  setup: (props, { slots }) => () =>
    h('div', { role: 'radiogroup', class: 'lk-radio-group', 'data-variant': props.variant, 'data-direction': props.direction }, slots.default?.()),
});
export const Radio = defineComponent({
  name: 'LkRadio',
  props: { label: { type: String, required: true }, description: String, name: String, value: String, checked: Boolean },
  emits: ['change'],
  setup: (props, { emit }) => () =>
    h('label', { class: 'lk-choice' }, [
      h('input', { type: 'radio', class: 'lk-radio', name: props.name, value: props.value, checked: props.checked, onChange: () => emit('change', props.value) }),
      h('span', [props.label, props.description ? h('small', props.description) : null]),
    ]),
});
export const Rating = defineComponent({
  name: 'LkRating',
  props: { modelValue: { type: Number, default: 0 }, max: { type: Number, default: 5 }, readOnly: Boolean },
  emits: ['update:modelValue'],
  setup: (props, { emit }) => () =>
    h(
      'div',
      {
        class: 'lk-rating',
        role: props.readOnly ? 'img' : 'radiogroup',
        'aria-label': `Nota ${props.modelValue} de ${props.max}`,
        'data-readonly': flag(props.readOnly),
      },
      Array.from({ length: props.max }, (_, i) =>
        h('button', {
          type: 'button',
          role: props.readOnly ? undefined : 'radio',
          'aria-checked': props.readOnly ? undefined : props.modelValue === i + 1 ? 'true' : 'false',
          'aria-label': String(i + 1),
          disabled: props.readOnly,
          class: 'lk-rating-moon',
          style: { '--lk-f': Math.max(0, Math.min(1, props.modelValue - i)) },
          onClick: () => emit('update:modelValue', i + 1),
        }),
      ),
    ),
});

/* ---------- Text / Avatar ---------- */
export const Text = defineComponent({
  name: 'LkText',
  props: {
    as: { type: String, default: 'p' },
    variant: String as PropType<'display' | 'title' | 'heading' | 'body' | 'bodySm' | 'label' | 'caption' | 'overline'>,
    tone: String as PropType<'muted' | 'primary' | 'success' | 'danger'>,
  },
  setup: (props, { slots }) => () => h(props.as, { class: 'lk-text', 'data-variant': props.variant, 'data-tone': props.tone }, slots.default?.()),
});
const initials = (n = '') =>
  n.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]!.toUpperCase()).join('');
export const Avatar = defineComponent({
  name: 'LkAvatar',
  props: {
    src: String,
    name: String,
    size: String as PropType<'sm' | 'md' | 'lg' | 'xl'>,
    variant: String as PropType<'solid' | 'soft'>,
    status: String as PropType<'online' | 'away' | 'offline'>,
  },
  setup: (props) => () =>
    h('span', { class: 'lk-avatar', role: 'img', 'aria-label': props.name, 'data-size': props.size, 'data-variant': props.variant }, [
      props.src ? h('img', { src: props.src, alt: '' }) : initials(props.name),
      props.status
        ? h('i', {
            class: 'lk-moon',
            'aria-label': props.status,
            'data-status': props.status,
            'data-phase': props.status === 'online' ? 'full' : props.status === 'away' ? 'half' : 'new',
          })
        : null,
    ]),
});
export const AvatarGroup = defineComponent({
  name: 'LkAvatarGroup',
  setup: (_, { slots }) => () => h('span', { class: 'lk-avatar-group' }, slots.default?.()),
});

/* ---------- List ---------- */
export const List = defineComponent({
  name: 'LkList',
  props: { title: String },
  setup: (props, { slots }) => () => [
    props.title ? h('p', { class: 'lk-list-title' }, props.title) : null,
    h('ul', { class: 'lk-list' }, slots.default?.()),
  ],
});
export const ListItem = defineComponent({
  name: 'LkListItem',
  props: { title: { type: String, required: true }, subtitle: String, href: String, chevron: Boolean, destructive: Boolean, disabled: Boolean },
  emits: ['click'],
  setup(props, { slots, emit }) {
    return () => {
      const inner = [
        slots.leading?.(),
        h('span', { class: 'lk-list-item-text' }, [
          h('span', { class: 'lk-list-item-title' }, props.title),
          props.subtitle ? h('span', { class: 'lk-list-item-subtitle' }, props.subtitle) : null,
        ]),
        slots.trailing?.(),
      ];
      const common = { class: 'lk-list-item', 'data-chevron': flag(props.chevron), 'data-destructive': flag(props.destructive) };
      const node: VNode = props.href
        ? h('a', { ...common, href: props.href, 'aria-disabled': props.disabled ? 'true' : undefined }, inner)
        : h('button', { ...common, type: 'button', disabled: props.disabled, onClick: () => emit('click') }, inner);
      return h('li', node);
    };
  },
});
export const ListEmpty = defineComponent({
  name: 'LkListEmpty',
  props: { title: { type: String, required: true }, description: String },
  setup: (props) => () =>
    h('div', { class: 'lk-list-empty' }, [
      h('i', { class: 'lk-moon', 'data-phase': 'new' }),
      h('b', props.title),
      props.description ? h('p', props.description) : null,
    ]),
});

/* ---------- Header / Navigation ---------- */
export const Header = defineComponent({
  name: 'LkHeader',
  props: { title: String, large: String, subtitle: String, scrolled: Boolean },
  setup: (props, { slots }) => () =>
    h('header', { class: 'lk-header', 'data-scrolled': flag(props.scrolled) }, [
      h('div', { class: 'lk-header-bar' }, [slots.left?.(), h('h1', { class: 'lk-header-title' }, props.title), slots.right?.()]),
      props.large
        ? h('div', { class: 'lk-header-large' }, [h('h1', props.large), props.subtitle ? h('p', props.subtitle) : null])
        : null,
    ]),
});
export const Navigation = defineComponent({
  name: 'LkNavigation',
  props: { variant: String as PropType<'attached' | 'floating'> },
  setup: (props, { slots }) => () => h('nav', { class: 'lk-nav', 'data-variant': props.variant }, slots.default?.()),
});
export const NavItem = defineComponent({
  name: 'LkNavItem',
  props: { label: { type: String, required: true }, href: String, active: Boolean, badge: Number },
  emits: ['click'],
  setup: (props, { slots, emit }) => () => {
    const inner = [
      h('span', { class: 'lk-nav-item-icon' }, [slots.icon?.(), props.badge ? h('span', { class: 'lk-counter' }, props.badge) : null]),
      h('span', { class: 'lk-nav-item-label' }, props.label),
    ];
    const common = { class: 'lk-nav-item', 'aria-current': props.active ? 'page' : undefined, onClick: () => emit('click') };
    return props.href ? h('a', { ...common, href: props.href }, inner) : h('button', { ...common, type: 'button' }, inner);
  },
});

/* ---------- Alert ---------- */
export const Alert = defineComponent({
  name: 'LkAlert',
  props: { tone: String as PropType<Tone>, title: { type: String, required: true }, closable: Boolean, actionLabel: String },
  emits: ['close', 'action'],
  setup: (props, { slots, emit }) => () =>
    h('div', { class: 'lk-alert', 'data-tone': props.tone, role: props.tone === 'danger' ? 'alert' : 'status' }, [
      h('i', { class: 'lk-moon', 'aria-hidden': 'true' }),
      h('div', { class: 'lk-alert-body' }, [
        h('b', props.title),
        slots.default ? h('p', slots.default()) : null,
        props.actionLabel ? h('button', { type: 'button', class: 'lk-alert-action', onClick: () => emit('action') }, props.actionLabel) : null,
      ]),
      props.closable ? h('button', { type: 'button', class: 'lk-alert-close', 'aria-label': 'Fechar', onClick: () => emit('close') }, '×') : null,
    ]),
});

/* ---------- Toast ---------- */
export type ToastItem = { id: number; title: string; description?: string; tone?: Tone; action?: { label: string; onClick: () => void } };
const toasts = shallowRef<ToastItem[]>([]);
let nextId = 1;
export function dismissToast(id: number) {
  toasts.value = toasts.value.filter((t) => t.id !== id);
}
/** Mostra um aviso; some sozinho após `duration` ms (0 deixa fixo). */
export function toast(t: Omit<ToastItem, 'id'> & { duration?: number }): number {
  const id = nextId++;
  const { duration = 4000, ...rest } = t;
  toasts.value = [...toasts.value, { id, ...rest }];
  if (duration > 0) setTimeout(() => dismissToast(id), duration);
  return id;
}
export const ToastHost = defineComponent({
  name: 'LkToastHost',
  props: { position: String as PropType<'top' | 'bottom'> },
  setup: (props) => () =>
    h(
      'div',
      { class: 'lk-toast-stack', 'data-position': props.position, 'aria-live': 'polite' },
      toasts.value.map((t) =>
        h('div', { key: t.id, class: 'lk-toast', 'data-tone': t.tone, role: 'status' }, [
          h('div', { class: 'lk-toast-body' }, [h('b', t.title), t.description ? h('span', t.description) : null]),
          t.action
            ? h(
                'button',
                {
                  type: 'button',
                  class: 'lk-toast-action',
                  onClick: () => {
                    t.action!.onClick();
                    dismissToast(t.id);
                  },
                },
                t.action.label,
              )
            : null,
        ]),
      ),
    ),
});
