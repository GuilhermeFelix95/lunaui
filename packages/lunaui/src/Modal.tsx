import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Easing, Modal as RNModal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, type ButtonProps } from './Button';
import { deriveColor } from './color';
import { useTheme } from './theme';

export type ModalAction = {
  label: string;
  onPress: () => void;
  variant?: ButtonProps['variant'];
  color?: string;
};

export type ModalProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  /** Texto ou elementos do corpo. */
  children?: ReactNode;
  actions?: ModalAction[];
  /** Fecha ao tocar fora, no X e no botão voltar do Android. Padrão: true. */
  dismissable?: boolean;
  /** Crescente decorativo no canto superior esquerdo. */
  moon?: boolean;
  /** Ações em coluna, uma por linha. */
  stackActions?: boolean;
  color?: string;
};

const EDGE = 4;
const RADIUS = 24;
const MOON = 84;

export function Modal({
  visible,
  onClose,
  title,
  children,
  actions = [],
  dismissable = true,
  moon = false,
  stackActions = false,
  color,
}: ModalProps) {
  const theme = useTheme();
  const c = deriveColor(color ?? theme.color);
  const [mounted, setMounted] = useState(visible);
  const t = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    if (visible) setMounted(true);
    Animated.timing(t, {
      toValue: visible ? 1 : 0,
      duration: visible ? 220 : 160,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && !visible) setMounted(false);
    });
  }, [visible, t]);

  const close = dismissable ? onClose : undefined;

  return (
    <RNModal visible={mounted} transparent animationType="none" statusBarTranslucent onRequestClose={close}>
      <Animated.View style={[styles.scrim, { backgroundColor: theme.scrim, opacity: t }]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          accessibilityLabel="Fechar"
          accessibilityRole="button"
          disabled={!dismissable}
          onPress={close}
        />
        <Animated.View
          accessibilityViewIsModal
          style={{
            width: '100%',
            maxWidth: 340,
            borderRadius: RADIUS,
            backgroundColor: theme.cardEdge,
            paddingBottom: EDGE,
            opacity: t,
            transform: [
              { scale: t.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1] }) },
              { translateY: t.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) },
            ],
          }}
        >
          <View
            style={{
              borderRadius: RADIUS,
              borderWidth: 2,
              borderColor: theme.cardLine,
              backgroundColor: theme.cardBg,
              paddingTop: 24,
              paddingHorizontal: 22,
              paddingBottom: 20,
              gap: 10,
              overflow: 'hidden',
            }}
          >
            {moon && (
              <>
                <View style={{ position: 'absolute', top: -30, left: -30, width: MOON, height: MOON, borderRadius: MOON / 2, backgroundColor: c.base }} />
                <View style={{ position: 'absolute', top: -22, left: -15, width: MOON + 4, height: MOON + 4, borderRadius: (MOON + 4) / 2, backgroundColor: theme.cardBg }} />
              </>
            )}
            {dismissable && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Fechar"
                onPress={onClose}
                hitSlop={8}
                style={styles.x}
              >
                <Text style={{ color: theme.muted, fontSize: 22, lineHeight: 24 }}>×</Text>
              </Pressable>
            )}
            <Text
              accessibilityRole="header"
              maxFontSizeMultiplier={1.6}
              style={{ color: theme.text, fontSize: 19, lineHeight: 24, fontWeight: '600', paddingRight: 28, paddingLeft: moon ? 34 : 0 }}
            >
              {title}
            </Text>
            {typeof children === 'string' ? (
              <Text maxFontSizeMultiplier={1.6} style={{ color: theme.muted, fontSize: 14.5, lineHeight: 22 }}>
                {children}
              </Text>
            ) : (
              children
            )}
            {actions.length > 0 && (
              <View style={[styles.actions, stackActions ? styles.stack : styles.row]}>
                {actions.map((a) => (
                  <Button
                    key={a.label}
                    variant={a.variant ?? 'solid'}
                    color={a.color ?? color}
                    fullWidth={stackActions}
                    onPress={a.onPress}
                  >
                    {a.label}
                  </Button>
                ))}
              </View>
            )}
          </View>
        </Animated.View>
      </Animated.View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  scrim: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  x: { position: 'absolute', top: 8, right: 10, width: 32, height: 32, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  actions: { marginTop: 10, gap: 10 },
  row: { flexDirection: 'row', justifyContent: 'flex-end' },
  stack: { flexDirection: 'column' },
});
