import { useContext, useEffect, useRef, useSyncExternalStore } from 'react';
import { AccessibilityInfo, Animated, Easing, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { deriveColor } from './color';
import { useTheme } from './theme';
import { getToasts, subscribeToasts, toast, type ToastItem } from './toastStore';

const MAX_VISIBLE = 3;
const MOON = 22;
const SWIPE = 60;

function ToastView({ item }: { item: ToastItem }) {
  const theme = useTheme();
  const c = deriveColor(item.color ?? theme.color);
  const tone = { info: c.base, success: theme.online, error: theme.error, warning: theme.away }[item.tone ?? 'info'];
  const base = item.duration ?? (item.tone === 'error' ? 6000 : 4000);
  const total = item.action ? Math.max(base, 6000) : base;

  const enter = useRef(new Animated.Value(0)).current;
  const wane = useRef(new Animated.Value(0)).current;
  const dragX = useRef(new Animated.Value(0)).current;
  const remaining = useRef(total);
  const startedAt = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const closing = useRef(false);

  const dismiss = () => {
    if (closing.current) return;
    closing.current = true;
    clearTimeout(timer.current);
    Animated.timing(enter, { toValue: 0, duration: 180, easing: Easing.in(Easing.ease), useNativeDriver: true }).start(() =>
      toast.dismiss(item.id),
    );
  };

  const run = () => {
    startedAt.current = Date.now();
    Animated.timing(wane, { toValue: 1, duration: remaining.current, easing: Easing.linear, useNativeDriver: true }).start();
    timer.current = setTimeout(dismiss, remaining.current);
  };
  const pause = () => {
    if (closing.current) return;
    clearTimeout(timer.current);
    remaining.current = Math.max(0, remaining.current - (Date.now() - startedAt.current));
    wane.stopAnimation();
  };

  useEffect(() => {
    Animated.timing(enter, { toValue: 1, duration: 250, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    AccessibilityInfo.announceForAccessibility(item.description ? `${item.title}. ${item.description}` : item.title);
    run();
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderGrant: pause,
      onPanResponderMove: Animated.event([null, { dx: dragX }], { useNativeDriver: false }),
      onPanResponderRelease: (_, g) => {
        if (Math.abs(g.dx) > SWIPE) {
          Animated.timing(dragX, { toValue: g.dx > 0 ? 400 : -400, duration: 160, useNativeDriver: true }).start(() =>
            toast.dismiss(item.id),
          );
          closing.current = true;
        } else {
          Animated.spring(dragX, { toValue: 0, useNativeDriver: true }).start();
          run();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(dragX, { toValue: 0, useNativeDriver: true }).start();
        run();
      },
    }),
  ).current;

  return (
    <Animated.View
      {...pan.panHandlers}
      accessibilityLiveRegion="polite"
      style={{
        opacity: enter,
        transform: [
          { translateX: dragX },
          { translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) },
          { scale: enter.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) },
        ],
        borderRadius: 18,
        backgroundColor: theme.cardEdge,
        paddingBottom: 4,
      }}
    >
      <Pressable
        onPressIn={pause}
        onPressOut={run}
        style={[styles.card, { borderColor: theme.cardLine, backgroundColor: theme.cardBg }]}
      >
        <View style={{ width: MOON, height: MOON, borderRadius: MOON / 2, backgroundColor: tone, overflow: 'hidden' }}>
          <Animated.View
            style={{
              width: MOON,
              height: MOON,
              borderRadius: MOON / 2,
              backgroundColor: theme.cardBg,
              transform: [{ translateX: wane.interpolate({ inputRange: [0, 1], outputRange: [-MOON, 0] }) }],
            }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text maxFontSizeMultiplier={1.6} style={{ color: theme.text, fontSize: 14.5, lineHeight: 19, fontWeight: '600' }}>
            {item.title}
          </Text>
          {item.description ? (
            <Text maxFontSizeMultiplier={1.6} style={{ color: theme.muted, fontSize: 13, lineHeight: 18 }}>
              {item.description}
            </Text>
          ) : null}
        </View>
        {item.action && (
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              item.action!.onPress();
              dismiss();
            }}
            style={[styles.action, { backgroundColor: item.tone && item.tone !== 'info' ? 'transparent' : c.soft }]}
          >
            <Text style={{ color: tone, fontSize: 13, fontWeight: '600' }}>{item.action.label}</Text>
          </Pressable>
        )}
        <Pressable accessibilityRole="button" accessibilityLabel="Dispensar" onPress={dismiss} hitSlop={8} style={styles.x}>
          <Text style={{ color: theme.muted, fontSize: 20, lineHeight: 22 }}>×</Text>
        </Pressable>
      </Pressable>
    </Animated.View>
  );
}

export type ToastHostProps = {
  position?: 'top' | 'bottom';
};

/** Renderiza os toasts disparados por `useToast().show(...)`. Coloque uma vez, no topo do app. */
export function ToastHost({ position = 'bottom' }: ToastHostProps) {
  const items = useSyncExternalStore(subscribeToasts, getToasts, getToasts);
  const insets = useContext(SafeAreaInsetsContext);
  const visible = items.slice(0, MAX_VISIBLE);
  const top = position === 'top';

  return (
    <View
      pointerEvents="box-none"
      style={[
        StyleSheet.absoluteFill,
        {
          justifyContent: top ? 'flex-start' : 'flex-end',
          paddingHorizontal: 14,
          paddingTop: (insets?.top ?? 0) + 12,
          paddingBottom: (insets?.bottom ?? 0) + 12,
        },
      ]}
    >
      <View pointerEvents="box-none" style={{ gap: 10, flexDirection: top ? 'column' : 'column-reverse' }}>
        {visible.map((t) => (
          <ToastView key={t.id} item={t} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingLeft: 14, paddingRight: 12, borderRadius: 18, borderWidth: 2 },
  action: { height: 34, paddingHorizontal: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  x: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
});
