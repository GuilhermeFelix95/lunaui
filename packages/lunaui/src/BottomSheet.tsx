import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  Animated,
  Easing,
  Modal as RNModal,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { deriveColor } from './color';
import { useTheme } from './theme';

export type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  children?: ReactNode;
  title?: string;
  subtitle?: string;
  /** Alturas de parada, em px ou "40%". Sem isso, a folha ajusta à altura do conteúdo. */
  snapPoints?: (number | `${number}%`)[];
  /** Fecha ao arrastar para baixo, tocar no fundo e no botão voltar do Android. Padrão: true. */
  dismissable?: boolean;
  color?: string;
};

const RADIUS = 28;
const MOON = 26;
const MAX_RATIO = 0.9;

export function BottomSheet({
  visible,
  onClose,
  children,
  title,
  subtitle,
  snapPoints,
  dismissable = true,
  color,
}: BottomSheetProps) {
  const theme = useTheme();
  const c = deriveColor(color ?? theme.color);
  const { height: screenH } = useWindowDimensions();
  const [mounted, setMounted] = useState(visible);
  const [contentH, setContentH] = useState(0);
  const [headerH, setHeaderH] = useState(0);
  const [index, setIndex] = useState(0);

  const snaps = useMemo(() => {
    const cap = screenH * MAX_RATIO;
    const resolved = snapPoints?.length
      ? snapPoints.map((p) => (typeof p === 'number' ? p : (parseFloat(p) / 100) * screenH))
      : [contentH > 0 ? contentH + headerH : screenH * 0.5];
    return [...new Set(resolved.map((h) => Math.min(Math.round(h), cap)))].sort((a, b) => a - b);
  }, [snapPoints, contentH, headerH, screenH]);

  const maxH = snaps[snaps.length - 1]!;
  const h = useRef(new Animated.Value(0)).current;
  const current = useRef(0);
  useEffect(() => {
    const id = h.addListener(({ value }) => {
      current.current = value;
    });
    return () => h.removeListener(id);
  }, [h]);

  const goTo = (target: number, after?: () => void) => {
    Animated.timing(h, {
      toValue: target,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) after?.();
    });
  };

  const snapsRef = useRef(snaps);
  snapsRef.current = snaps;
  const dismissRef = useRef(dismissable);
  dismissRef.current = dismissable;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      setIndex(0);
      goTo(snaps[0]!);
    } else if (mounted) {
      goTo(0, () => setMounted(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, snaps[0]]);

  const settle = (target: number) => {
    const points = snapsRef.current;
    const i = points.indexOf(target);
    if (target === 0) {
      if (dismissRef.current) {
        goTo(0, () => onCloseRef.current());
      } else {
        goTo(points[0]!);
        setIndex(0);
      }
    } else {
      setIndex(i < 0 ? 0 : i);
      goTo(target);
    }
  };

  const start = useRef(0);
  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        h.stopAnimation();
        start.current = current.current;
      },
      onPanResponderMove: (_, g) => {
        const top = snapsRef.current[snapsRef.current.length - 1]!;
        h.setValue(Math.max(0, Math.min(top, start.current - g.dy)));
      },
      onPanResponderRelease: (_, g) => {
        const points = [0, ...snapsRef.current];
        const now = current.current;
        let best = points[0]!;
        let dist = Infinity;
        points.forEach((p) => {
          const d = Math.abs(p - now);
          if (d < dist) {
            dist = d;
            best = p;
          }
        });
        if (Math.abs(g.vy) > 1.2) {
          const idx = points.indexOf(best);
          best = points[Math.max(0, Math.min(points.length - 1, idx + (g.vy > 0 ? -1 : 1)))]!;
        }
        settle(best);
      },
    }),
  ).current;

  const step = (dir: 1 | -1) => {
    const points = [0, ...snaps];
    const cur = index + 1;
    const next = Math.max(0, Math.min(points.length - 1, cur + dir));
    settle(points[next]!);
  };

  const atMax = index === snaps.length - 1;
  const requestClose = dismissable ? () => settle(0) : undefined;

  return (
    <RNModal visible={mounted} transparent animationType="none" statusBarTranslucent onRequestClose={requestClose}>
      <View style={StyleSheet.absoluteFill}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: theme.scrim, opacity: h.interpolate({ inputRange: [0, maxH], outputRange: [0, 1], extrapolate: 'clamp' }) },
          ]}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            accessibilityLabel="Fechar"
            accessibilityRole="button"
            disabled={!dismissable}
            onPress={requestClose}
          />
        </Animated.View>
        <Animated.View
          accessibilityViewIsModal
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: maxH,
            borderTopLeftRadius: RADIUS,
            borderTopRightRadius: RADIUS,
            borderWidth: 2,
            borderBottomWidth: 0,
            borderColor: theme.cardLine,
            backgroundColor: theme.cardBg,
            overflow: 'hidden',
            transform: [{ translateY: h.interpolate({ inputRange: [0, maxH], outputRange: [maxH, 0], extrapolate: 'clamp' }) }],
          }}
        >
          <View onLayout={(e) => setHeaderH(e.nativeEvent.layout.height)}>
            <View
              {...pan.panHandlers}
              accessible
              accessibilityRole="adjustable"
              accessibilityLabel="Ajustar altura"
              accessibilityValue={{ min: 0, max: 100, now: Math.round(((index + 1) / (snaps.length + 1)) * 100) }}
              accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
              onAccessibilityAction={(e) => step(e.nativeEvent.actionName === 'increment' ? 1 : -1)}
              style={styles.grab}
            >
              <View style={{ width: MOON, height: MOON, borderRadius: MOON / 2, backgroundColor: theme.boxLine, overflow: 'hidden' }}>
                <Animated.View
                  style={{
                    width: MOON,
                    height: MOON,
                    borderRadius: MOON / 2,
                    backgroundColor: c.base,
                    transform: [{ translateX: h.interpolate({ inputRange: [0, maxH], outputRange: [-MOON, 0], extrapolate: 'clamp' }) }],
                  }}
                />
              </View>
            </View>
            {title ? (
              <Text accessibilityRole="header" style={{ color: theme.text, fontSize: 18, fontWeight: '600', marginHorizontal: 20, marginTop: 4 }}>
                {title}
              </Text>
            ) : null}
            {subtitle ? (
              <Text style={{ color: theme.muted, fontSize: 13.5, marginHorizontal: 20, marginTop: 2 }}>{subtitle}</Text>
            ) : null}
            <View style={{ height: 10 }} />
          </View>
          <ScrollView scrollEnabled={atMax} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}>
            <View onLayout={(e) => setContentH(e.nativeEvent.layout.height + 20)}>{children}</View>
          </ScrollView>
        </Animated.View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  grab: { alignItems: 'center', paddingTop: 10, paddingBottom: 6 },
});
