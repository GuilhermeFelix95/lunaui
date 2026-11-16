import { Children, Fragment, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { blend, deriveColor } from './color';
import { useTheme } from './theme';

export type ListProps = {
  /** Título da seção, acima do cartão. */
  title?: string;
  children: ReactNode;
};

export type ListItemProps = {
  title: string;
  subtitle?: string;
  /** Elemento à esquerda (Avatar, ícone, fase da lua...). */
  start?: ReactNode;
  /** Elemento à direita (Switch, texto, Badge...). */
  end?: ReactNode;
  /** Seta à direita; só aparece em itens com `onPress`. */
  chevron?: boolean;
  onPress?: () => void;
  selected?: boolean;
  disabled?: boolean;
  destructive?: boolean;
  color?: string;
};

export type ListEmptyProps = {
  title: string;
  description?: string;
  /** Ação opcional, em geral um Button. */
  action?: ReactNode;
  color?: string;
};

const EDGE = 3;
const RADIUS = 20;

function Item({ title, subtitle, start, end, chevron, onPress, selected, disabled, destructive, color }: ListItemProps) {
  const theme = useTheme();
  const c = deriveColor(color ?? theme.color);
  const soft = blend(c.base, theme.cardBg, 0.15);
  const titleColor = destructive ? theme.error : theme.text;

  const row = (pressed: boolean) => (
    <View
      style={{
        minHeight: 64,
        paddingHorizontal: 16,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        backgroundColor: selected || pressed ? soft : 'transparent',
        opacity: disabled ? 0.45 : 1,
      }}
    >
      {start}
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text numberOfLines={1} style={{ color: titleColor, fontSize: 15.5, fontWeight: '600', fontFamily: theme.fontFamily }}>
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} style={{ color: theme.muted, fontSize: 13, marginTop: 1, fontFamily: theme.fontFamily }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {end}
      {chevron && onPress ? (
        <View
          style={{
            width: 9,
            height: 9,
            borderRightWidth: 2,
            borderBottomWidth: 2,
            borderColor: theme.muted,
            transform: [{ rotate: '-45deg' }],
          }}
        />
      ) : null}
    </View>
  );

  if (!onPress) return row(false);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
      accessibilityState={{ selected: !!selected, disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
    >
      {({ pressed }) => row(pressed)}
    </Pressable>
  );
}

function Empty({ title, description, action, color }: ListEmptyProps) {
  const theme = useTheme();
  const c = deriveColor(color ?? theme.color);
  return (
    <View style={{ alignItems: 'center', gap: 6, paddingVertical: 34, paddingHorizontal: 24 }}>
      <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: c.base, overflow: 'hidden', marginBottom: 6 }}>
        <View style={{ position: 'absolute', top: 0, left: -40, width: 56, height: 56, borderRadius: 28, backgroundColor: theme.cardBg }} />
      </View>
      <Text style={{ color: theme.text, fontSize: 17, fontWeight: '600', textAlign: 'center', fontFamily: theme.fontFamily }}>{title}</Text>
      {description ? (
        <Text style={{ color: theme.muted, fontSize: 14, lineHeight: 21, textAlign: 'center', maxWidth: 260, fontFamily: theme.fontFamily }}>
          {description}
        </Text>
      ) : null}
      {action ? <View style={{ marginTop: 12 }}>{action}</View> : null}
    </View>
  );
}

function ListRoot({ title, children }: ListProps) {
  const theme = useTheme();
  const items = Children.toArray(children);
  return (
    <View accessibilityRole="list" style={{ alignSelf: 'stretch' }}>
      {title ? (
        <Text
          accessibilityRole="header"
          style={{ color: theme.muted, fontSize: 12, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase', marginHorizontal: 6, marginBottom: 8, fontFamily: theme.fontFamily }}
        >
          {title}
        </Text>
      ) : null}
      <View style={{ borderRadius: RADIUS, backgroundColor: theme.cardEdge, paddingBottom: EDGE }}>
        <View style={{ borderRadius: RADIUS, borderWidth: 2, borderColor: theme.cardLine, backgroundColor: theme.cardBg, overflow: 'hidden' }}>
          {items.map((child, i) => (
            <Fragment key={i}>
              {i > 0 ? <View style={{ height: 2, backgroundColor: theme.cardLine }} /> : null}
              {child}
            </Fragment>
          ))}
        </View>
      </View>
    </View>
  );
}

export const List = Object.assign(ListRoot, { Item, Empty });
