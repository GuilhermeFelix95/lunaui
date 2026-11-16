import { Children, cloneElement, isValidElement, useState, type ReactElement } from 'react';
import { Image, Text, View, type ImageSourcePropType } from 'react-native';
import { deriveColor } from './color';
import { useTheme } from './theme';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type AvatarProps = {
  name: string;
  source?: ImageSourcePropType;
  size?: Size;
  variant?: 'solid' | 'soft';
  /** Presença em fases da lua: cheia = online, meia = ausente, vazia = offline. */
  status?: 'online' | 'away' | 'offline';
  color?: string;
};

const SIZES: Record<Size, number> = { xs: 28, sm: 36, md: 48, lg: 64, xl: 88 };
const STATUS_LABEL = { online: 'online', away: 'ausente', offline: 'offline' } as const;

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0]![0]!;
  const last = parts.length > 1 ? parts[parts.length - 1]![0]! : '';
  return (first + last).toUpperCase();
}

function StatusMoon({ status, size, ring }: { status: NonNullable<AvatarProps['status']>; size: number; ring: string }) {
  const theme = useTheme();
  const d = Math.max(16, Math.round(size * 0.36));
  const color = status === 'online' ? theme.online : status === 'away' ? theme.away : theme.offline;
  return (
    <View
      style={{
        position: 'absolute',
        right: -5,
        bottom: -5,
        width: d,
        height: d,
        borderRadius: d / 2,
        borderWidth: 3,
        borderColor: color,
        backgroundColor: status === 'online' ? color : ring,
        overflow: 'hidden',
        // anel externo que separa a lua do avatar
        shadowColor: ring,
        shadowOpacity: 1,
        shadowRadius: 0,
        shadowOffset: { width: 0, height: 0 },
      }}
    >
      {status === 'away' && <View style={{ width: d / 2 - 3, height: d, backgroundColor: color }} />}
    </View>
  );
}

export function Avatar({ name, source, size = 'md', variant = 'solid', status, color }: AvatarProps) {
  const theme = useTheme();
  const c = deriveColor(color ?? theme.color);
  const s = SIZES[size];
  const radius = Math.round(s * 0.34);
  const [failed, setFailed] = useState(false);
  const showImage = source !== undefined && !failed;
  const solid = variant === 'solid';
  const edge = showImage ? 0 : solid ? 3 : 2;
  const edgeColor = solid ? c.dark : c.soft;

  return (
    <View
      accessible
      accessibilityRole={showImage ? 'image' : undefined}
      accessibilityLabel={status ? `${name}, ${STATUS_LABEL[status]}` : name}
      style={{ width: s, height: s + edge, alignSelf: 'flex-start' }}
    >
      <View style={{ width: s, height: s + edge, borderRadius: radius, backgroundColor: edge ? edgeColor : 'transparent' }}>
        <View
          style={{
            width: s,
            height: s,
            borderRadius: radius,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: solid ? c.base : c.soft,
          }}
        >
          {showImage ? (
            <Image source={source} onError={() => setFailed(true)} style={{ width: s, height: s }} />
          ) : (
            <Text style={{ color: solid ? c.on : c.base, fontSize: Math.round(s * 0.38), fontWeight: '600' }}>{initials(name)}</Text>
          )}
        </View>
      </View>
      {status && <StatusMoon status={status} size={s} ring={theme.cardBg} />}
    </View>
  );
}

export type AvatarGroupProps = {
  children: ReactElement<AvatarProps> | ReactElement<AvatarProps>[];
  max?: number;
  size?: Size;
};

const OVERLAP = 16;
const BITE = 4;

/** Cada avatar é "mordido" pelo seguinte, como um eclipse. */
export function AvatarGroup({ children, max = 3, size = 'md' }: AvatarGroupProps) {
  const theme = useTheme();
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<AvatarProps>[];
  const shown = items.slice(0, max);
  const extra = items.length - shown.length;
  const s = SIZES[size];
  const radius = Math.round(s * 0.34);

  const wrap = (node: ReactElement, i: number) => (
    <View
      key={i}
      style={{
        marginLeft: i === 0 ? 0 : -OVERLAP,
        zIndex: i + 1,
        padding: BITE,
        borderRadius: radius + BITE,
        backgroundColor: theme.cardBg,
      }}
    >
      {node}
    </View>
  );

  const nodes: ReactElement[] = shown.map((el, i) => cloneElement(el, { size }));
  if (extra > 0) {
    nodes.push(
      <View key="more" style={{ width: s, height: s, borderRadius: radius, backgroundColor: theme.cardLine, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: theme.muted, fontSize: 13, fontWeight: '600' }}>{`+${extra}`}</Text>
      </View>,
    );
  }

  return (
    <View
      accessible
      accessibilityLabel={`${items.length} participantes`}
      style={{ flexDirection: 'row', alignSelf: 'flex-start', marginLeft: -BITE }}
    >
      {nodes.map((n, i) => wrap(n, i))}
    </View>
  );
}
