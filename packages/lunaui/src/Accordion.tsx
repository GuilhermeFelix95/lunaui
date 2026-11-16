import { createContext, useContext, useState, type ReactNode } from 'react';
import { LayoutAnimation, Pressable, Text, View } from 'react-native';
import { deriveColor } from './color';
import { useTheme } from './theme';
import { useReduceMotion } from './useReduceMotion';

export type AccordionProps = {
  type?: 'single' | 'multiple';
  /** Controlado: item aberto (`single`) ou lista de itens abertos (`multiple`). */
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string[]) => void;
  color?: string;
  children: ReactNode;
};

export type AccordionItemProps = {
  value: string;
  title: string;
  disabled?: boolean;
  children?: ReactNode;
};

type Ctx = { open: string[]; toggle: (v: string) => void; color?: string };
const AccordionContext = createContext<Ctx | null>(null);

const toList = (v?: string | string[]) => (v === undefined ? [] : Array.isArray(v) ? v : [v]);

function Item({ value, title, disabled = false, children }: AccordionItemProps) {
  const theme = useTheme();
  const g = useContext(AccordionContext);
  const c = deriveColor(g?.color ?? theme.color);
  const expanded = !!g?.open.includes(value);

  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded, disabled }}
        disabled={disabled}
        onPress={() => g?.toggle(value)}
        style={({ pressed }) => ({
          minHeight: 56,
          paddingHorizontal: 16,
          paddingVertical: 10,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          backgroundColor: pressed ? `${c.base}26` : 'transparent',
          opacity: disabled ? 0.45 : 1,
        })}
      >
        <Text style={{ flex: 1, color: expanded ? c.base : theme.text, fontSize: 15.5, fontWeight: '600', fontFamily: theme.fontFamily }}>{title}</Text>
        <View
          style={{
            width: 9,
            height: 9,
            marginRight: 4,
            borderRightWidth: 2,
            borderBottomWidth: 2,
            borderColor: expanded ? c.base : theme.muted,
            transform: [{ rotate: expanded ? '-135deg' : '45deg' }],
          }}
        />
      </Pressable>
      {expanded && children ? <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>{children}</View> : null}
    </View>
  );
}

function AccordionRoot({ type = 'single', value, defaultValue, onValueChange, color, children }: AccordionProps) {
  const theme = useTheme();
  const reduce = useReduceMotion();
  const [inner, setInner] = useState<string[]>(toList(defaultValue));
  const open = value !== undefined ? toList(value) : inner;

  const toggle = (v: string) => {
    const isOpen = open.includes(v);
    const next = type === 'single' ? (isOpen ? [] : [v]) : isOpen ? open.filter((x) => x !== v) : [...open, v];
    if (!reduce) LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  };

  const items = Array.isArray(children) ? children : [children];
  return (
    <AccordionContext.Provider value={{ open, toggle, color }}>
      <View style={{ borderRadius: 20, backgroundColor: theme.cardEdge, paddingBottom: 3 }}>
        <View style={{ borderRadius: 20, borderWidth: 2, borderColor: theme.cardLine, backgroundColor: theme.cardBg, overflow: 'hidden' }}>
          {items.map((child, i) => (
            <View key={i} style={i > 0 ? { borderTopWidth: 2, borderTopColor: theme.cardLine } : undefined}>
              {child}
            </View>
          ))}
        </View>
      </View>
    </AccordionContext.Provider>
  );
}

export const Accordion = Object.assign(AccordionRoot, { Item });
