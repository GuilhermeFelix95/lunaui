import { useContext, type ReactNode } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { deriveColor } from './color';
import { useTheme } from './theme';

export type HeaderAction = {
  /** Ícone (qualquer elemento); a lib não traz conjunto de ícones. */
  icon: ReactNode;
  label: string;
  onPress: () => void;
  /** Número no canto do ícone; 0 mostra só o ponto. */
  badge?: number;
};

export type HeaderProps = {
  title: string;
  subtitle?: string;
  /** Título grande que recolhe quando `scrollY` avança. Sem `scrollY`, fica fixo. */
  large?: boolean;
  onBack?: () => void;
  /** Até 3 ações à direita. */
  actions?: HeaderAction[];
  /** Elemento abaixo do título (ex.: Input de busca). */
  search?: ReactNode;
  /** Valor animado da rolagem (`onScroll` da lista). */
  scrollY?: Animated.Value;
  /** Fundo da barra; use a cor da tela para o título grande se fundir ao conteúdo. */
  backgroundColor?: string;
  color?: string;
};

const RANGE = 52;
const BAR = 48;

export function Header({ title, subtitle, large = false, onBack, actions = [], search, scrollY, backgroundColor, color }: HeaderProps) {
  const theme = useTheme();
  const c = deriveColor(color ?? theme.color);
  const insets = useContext(SafeAreaInsetsContext);
  const bg = backgroundColor ?? theme.cardBg;
  const collapsing = large && !!scrollY;

  const smallOpacity: Animated.AnimatedInterpolation<number> | number = !large
    ? 1
    : scrollY
      ? scrollY.interpolate({ inputRange: [RANGE * 0.6, RANGE], outputRange: [0, 1], extrapolate: 'clamp' })
      : 0;
  const bigHeight = collapsing ? scrollY!.interpolate({ inputRange: [0, RANGE], outputRange: [RANGE, 0], extrapolate: 'clamp' }) : RANGE;
  const bigOpacity = collapsing ? scrollY!.interpolate({ inputRange: [0, RANGE * 0.7], outputRange: [1, 0], extrapolate: 'clamp' }) : 1;
  const line = scrollY
    ? scrollY.interpolate({ inputRange: [large ? RANGE - 4 : 0, large ? RANGE : 4], outputRange: ['rgba(0,0,0,0)', theme.cardLine], extrapolate: 'clamp' })
    : 'transparent';

  const iconBtn = (key: string, label: string, onPress: () => void, child: ReactNode, badge?: number) => (
    <Pressable
      key={key}
      accessibilityRole="button"
      accessibilityLabel={badge !== undefined && badge > 0 ? `${label}, ${badge} novos` : label}
      onPress={onPress}
      style={({ pressed }) => ({
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: pressed ? `${c.base}26` : 'transparent',
      })}
    >
      {child}
      {badge !== undefined ? (
        <View
          style={{
            position: 'absolute',
            top: badge > 0 ? 4 : 8,
            right: badge > 0 ? 2 : 8,
            minWidth: badge > 0 ? 18 : 10,
            height: badge > 0 ? 18 : 10,
            paddingHorizontal: badge > 0 ? 5 : 0,
            borderRadius: 9,
            borderWidth: 2,
            borderColor: bg,
            backgroundColor: c.base,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {badge > 0 ? <Text style={{ color: c.on, fontSize: 10, fontWeight: '600' }}>{badge > 99 ? '99+' : badge}</Text> : null}
        </View>
      ) : null}
    </Pressable>
  );

  return (
    <Animated.View style={{ backgroundColor: bg, paddingTop: insets?.top ?? 0, borderBottomWidth: 2, borderBottomColor: line }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: BAR, paddingHorizontal: 8 }}>
        {onBack ? (
          iconBtn(
            'back',
            'Voltar',
            onBack,
            <View
              style={{
                width: 12,
                height: 12,
                borderLeftWidth: 2.5,
                borderBottomWidth: 2.5,
                borderColor: theme.text,
                borderRadius: 1,
                transform: [{ rotate: '45deg' }, { translateX: 2 }],
              }}
            />,
          )
        ) : (
          <View style={{ width: 8 }} />
        )}
        <Animated.Text
          accessibilityRole="header"
          numberOfLines={1}
          style={{
            flex: 1,
            textAlign: 'center',
            color: theme.text,
            fontSize: 17,
            fontWeight: '600',
            fontFamily: theme.fontFamily,
            opacity: smallOpacity,
          }}
        >
          {title}
        </Animated.Text>
        <View style={{ flexDirection: 'row', minWidth: onBack ? 44 : 8 }}>
          {actions.slice(0, 3).map((a, i) => iconBtn(String(i), a.label, a.onPress, a.icon, a.badge))}
        </View>
      </View>
      {large ? (
        <Animated.View style={{ height: bigHeight, opacity: bigOpacity, overflow: 'hidden', paddingHorizontal: 20, justifyContent: 'center' }}>
          <Text numberOfLines={1} style={{ color: theme.text, fontSize: 30, fontWeight: '700', letterSpacing: -0.5, fontFamily: theme.fontFamily }}>
            {title}
          </Text>
          {subtitle ? <Text style={{ color: theme.muted, fontSize: 13, fontFamily: theme.fontFamily }}>{subtitle}</Text> : null}
        </Animated.View>
      ) : null}
      {search ? <View style={{ paddingHorizontal: 12, paddingBottom: 12 }}>{search}</View> : null}
    </Animated.View>
  );
}
