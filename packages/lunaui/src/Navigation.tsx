import { useContext, useEffect, useRef, type ReactNode } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { blend, deriveColor } from './color';
import { useTheme } from './theme';

export type NavigationItem = {
  value: string;
  label: string;
  icon: ReactNode;
  /** Número no canto do ícone; 0 mostra só o ponto. */
  badge?: number;
};

export type NavigationProps = {
  /** De 2 a 5 itens. */
  items: NavigationItem[];
  value: string;
  onValueChange: (value: string) => void;
  /** `bar`: colada na base; `floating`: cartão flutuante. */
  variant?: 'bar' | 'floating';
  /** Mostra o rótulo só no item ativo (continua acessível nos outros). */
  activeLabelOnly?: boolean;
  color?: string;
};

const EDGE = 3;

function NavButton({
  item,
  active,
  activeLabelOnly,
  onPress,
  color,
}: {
  item: NavigationItem;
  active: boolean;
  activeLabelOnly: boolean;
  onPress: () => void;
  color?: string;
}) {
  const theme = useTheme();
  const c = deriveColor(color ?? theme.color);
  const t = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(t, { toValue: active ? 1 : 0, duration: 250, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [active, t]);

  const { badge } = item;
  const showLabel = !activeLabelOnly || active;
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={badge !== undefined && badge > 0 ? `${item.label}, ${badge} novos` : item.label}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={{ flex: 1, minHeight: 56, alignItems: 'center', justifyContent: 'center', gap: 3 }}
    >
      <View style={{ width: 34, height: 34, alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            width: 34,
            height: 34,
            borderRadius: 17,
            backgroundColor: blend(c.base, theme.cardBg, 0.15),
            opacity: t,
            transform: [{ scale: t.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }) }],
          }}
        />
        {item.icon}
        {badge !== undefined ? (
          <View
            style={{
              position: 'absolute',
              top: badge > 0 ? -2 : 2,
              right: badge > 0 ? -8 : 0,
              minWidth: badge > 0 ? 18 : 10,
              height: badge > 0 ? 18 : 10,
              paddingHorizontal: badge > 0 ? 5 : 0,
              borderRadius: 9,
              borderWidth: 2,
              borderColor: theme.cardBg,
              backgroundColor: c.base,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {badge > 0 ? <Text style={{ color: c.on, fontSize: 10, fontWeight: '600' }}>{badge > 99 ? '99+' : badge}</Text> : null}
          </View>
        ) : null}
      </View>
      {showLabel ? (
        <Text
          numberOfLines={1}
          style={{ color: active ? c.base : theme.muted, fontSize: 11.5, fontWeight: '600', fontFamily: theme.fontFamily }}
        >
          {item.label}
        </Text>
      ) : null}
    </Pressable>
  );
}

export function Navigation({ items, value, onValueChange, variant = 'bar', activeLabelOnly = false, color }: NavigationProps) {
  const theme = useTheme();
  const insets = useContext(SafeAreaInsetsContext);
  const bottom = insets?.bottom ?? 0;
  const floating = variant === 'floating';

  const buttons = items.slice(0, 5).map((item) => (
    <NavButton key={item.value} item={item} active={item.value === value} activeLabelOnly={activeLabelOnly} onPress={() => onValueChange(item.value)} color={color} />
  ));

  const content = (
    <View accessibilityRole="tablist" style={{ flexDirection: 'row' }}>
      {buttons}
    </View>
  );

  if (floating) {
    return (
      <View style={{ marginHorizontal: 14, marginBottom: bottom + 8, alignSelf: 'stretch' }}>
        <View style={{ borderRadius: 26, backgroundColor: theme.cardEdge, paddingBottom: EDGE }}>
          <View style={{ borderRadius: 26, borderWidth: 2, borderColor: theme.cardLine, backgroundColor: theme.cardBg, padding: 6 }}>{content}</View>
        </View>
      </View>
    );
  }
  return (
    <View
      style={{
        alignSelf: 'stretch',
        backgroundColor: theme.cardBg,
        borderTopWidth: 2,
        borderTopColor: theme.cardLine,
        paddingHorizontal: 8,
        paddingTop: 8,
        paddingBottom: bottom + 8,
      }}
    >
      {content}
    </View>
  );
}
