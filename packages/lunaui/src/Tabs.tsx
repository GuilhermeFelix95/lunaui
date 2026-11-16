import { Children, createContext, isValidElement, useContext, useEffect, useRef, useState, type ReactElement, type ReactNode } from 'react';
import { AccessibilityInfo, Animated, Pressable, ScrollView, Text, View } from 'react-native';
import { blend, deriveColor } from './color';
import { useTheme } from './theme';

export type TabsProps = {
  value: string;
  onValueChange: (value: string) => void;
  /** `line`: traço sob a aba; `pill`: trilho com a aba em relevo; `solid`: aba ativa na cor-base. */
  variant?: 'line' | 'pill' | 'solid';
  /** Rola na horizontal e centraliza a aba ativa. */
  scrollable?: boolean;
  color?: string;
  accessibilityLabel?: string;
  children: ReactNode;
};

export type TabProps = {
  value: string;
  label: string;
  count?: number;
  disabled?: boolean;
};

export type TabsPanelProps = { value: string; children: ReactNode };

const ValueContext = createContext<string | null>(null);

/** Marcador: o `Tabs` lê as props, esta função não desenha nada. */
function Tab(_props: TabProps): null {
  return null;
}

function Panel({ value, children }: TabsPanelProps) {
  const active = useContext(ValueContext);
  if (active !== value) return null;
  return <View accessibilityRole="none">{children}</View>;
}

type ScrollViewRef = { scrollTo: (o: { x: number; animated?: boolean }) => void };
type Box = { x: number; w: number };

function TabsRoot({ value, onValueChange, variant = 'line', scrollable = false, color, accessibilityLabel, children }: TabsProps) {
  const theme = useTheme();
  const c = deriveColor(color ?? theme.color);
  const tabs = Children.toArray(children).filter(
    (ch): ch is ReactElement<TabProps> => isValidElement(ch) && ch.type === Tab,
  );
  const panels = Children.toArray(children).filter((ch) => isValidElement(ch) && ch.type === Panel);

  const boxes = useRef<Record<string, Box>>({});
  const scroller = useRef<ScrollViewRef>(null);
  const [viewW, setViewW] = useState(0);
  const x = useRef(new Animated.Value(0)).current;
  const w = useRef(new Animated.Value(0)).current;
  const placed = useRef(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [, setReady] = useState(0);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => {});
  }, []);

  const moveTo = (b: Box) => {
    if (!placed.current || reduceMotion) {
      x.setValue(b.x);
      w.setValue(b.w);
      placed.current = true;
    } else {
      Animated.parallel([
        Animated.timing(x, { toValue: b.x, duration: 280, useNativeDriver: false }),
        Animated.timing(w, { toValue: b.w, duration: 280, useNativeDriver: false }),
      ]).start();
    }
    if (scrollable && viewW > 0) scroller.current?.scrollTo({ x: Math.max(0, b.x + b.w / 2 - viewW / 2), animated: !reduceMotion });
  };

  useEffect(() => {
    const b = boxes.current[value];
    if (b) moveTo(b);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, viewW]);

  const list = (
    <View
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
      style={[
        { flexDirection: 'row', alignItems: 'center' },
        variant === 'line' && { borderBottomWidth: 2, borderBottomColor: theme.cardLine },
        variant === 'pill' && { backgroundColor: theme.trackOff, borderRadius: 18, padding: 4, alignSelf: 'flex-start' },
        variant === 'solid' && { gap: 4 },
      ]}
    >
      {variant === 'line' && (
        <Animated.View
          pointerEvents="none"
          style={{ position: 'absolute', left: 0, bottom: -2, height: 4, borderRadius: 4, backgroundColor: c.base, width: w, transform: [{ translateX: x }] }}
        />
      )}
      {variant === 'pill' && (
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 0,
            top: 4,
            bottom: 4,
            borderRadius: 14,
            borderWidth: 2,
            borderColor: theme.cardLine,
            backgroundColor: theme.cardBg,
            width: w,
            transform: [{ translateX: x }],
          }}
        />
      )}
      {tabs.map((t) => {
        const { value: v, label, count, disabled } = t.props;
        const selected = v === value;
        const textColor = variant === 'solid' && selected ? c.on : selected ? c.base : theme.muted;
        const badgeBg = variant === 'solid' && selected ? blend(c.on, c.base, 0.25) : blend(c.base, theme.cardBg, 0.15);
        return (
          <Pressable
            key={v}
            accessibilityRole="tab"
            accessibilityState={{ selected, disabled: !!disabled }}
            accessibilityLabel={count !== undefined ? `${label}, ${count}` : label}
            disabled={disabled}
            onPress={() => onValueChange(v)}
            onLayout={(e) => {
              const { x: lx, width } = e.nativeEvent.layout;
              boxes.current[v] = { x: lx, w: width };
              if (v === value) moveTo({ x: lx, w: width });
              setReady((n) => n + 1);
            }}
            style={[
              {
                minHeight: variant === 'pill' ? 42 : 48,
                paddingHorizontal: 16,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                borderRadius: variant === 'line' ? 0 : 14,
                opacity: disabled ? 0.4 : 1,
              },
              variant === 'solid' && {
                backgroundColor: selected ? c.base : theme.trackOff,
                borderBottomWidth: 3,
                borderBottomColor: selected ? c.dark : theme.trackOffEdge,
              },
            ]}
          >
            <Text style={{ color: textColor, fontSize: 15, fontWeight: '600', fontFamily: theme.fontFamily }}>{label}</Text>
            {count !== undefined && (
              <View style={{ minWidth: 20, height: 20, paddingHorizontal: 6, borderRadius: 8, backgroundColor: badgeBg, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: textColor, fontSize: 11, fontWeight: '600', fontFamily: theme.fontFamily }}>{count}</Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <ValueContext.Provider value={value}>
      {scrollable ? (
        <ScrollView ref={(r) => { scroller.current = r as unknown as ScrollViewRef | null; }} horizontal showsHorizontalScrollIndicator={false} onLayout={(e) => setViewW(e.nativeEvent.layout.width)}>
          {list}
        </ScrollView>
      ) : (
        list
      )}
      {panels}
    </ValueContext.Provider>
  );
}

export const Tabs = Object.assign(TabsRoot, { Tab, Panel });
