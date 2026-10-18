import { colors } from "@skillproof/tokens";
import { useId } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from "react-native-svg";

import { Text } from "./Text";

const STROKE_RATIO = 0.08; // ring thickness = 8 % of its size
const BIG = 96; // from this size up the percentage uses the title style
const HUGE = 200; // from this size up it uses the display style

type Tone = { track: string; fill: string; fillTo?: string };

const TONES = {
  card: { track: colors.border.default, fill: colors.accent.progress }, // on white cards
  sky: { track: colors.glass.veil, fill: colors.accent.progress, fillTo: colors.accent.brand }, // on the hero's sky: light → brand along the arc (Azim, 18 Oct)
} as const satisfies Record<string, Tone>;

type Props = {
  /** 0–100 integer (rule 2: percentages are integers, computed elsewhere). */
  percent: number;
  /** Diameter. A half ring is this wide and about half as tall. */
  size?: number;
  tone?: keyof typeof TONES;
  /** "full" starts at 12 o'clock; "half" is a gauge that fills left → right over the top. */
  shape?: "full" | "half";
  /** Small line under the percentage inside a big ring, e.g. "ready". */
  caption?: string;
};

/** Progress ring or half-ring gauge. Big rings get a larger percentage + an optional caption. */
export function ProgressRing({ percent, size = 64, tone = "card", shape = "full", caption }: Props) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));
  const stroke = size * STROKE_RATIO;
  const r = (size - stroke) / 2;
  const mid = size / 2;
  const t: Tone = TONES[tone];
  const gradientId = `ring${useId().replace(/[^a-zA-Z0-9]/g, "")}`; // unique per ring; url() rejects ":"
  const big = size >= BIG;
  const half = shape === "half";
  // A half ring's round end caps reach stroke / 2 below its centre line.
  const height = half ? mid + stroke / 2 : size;
  const length = half ? Math.PI * r : 2 * Math.PI * r;
  const dash = `${(length * clamped) / 100} ${length}`;
  const arc = `M ${stroke / 2} ${mid} A ${r} ${r} 0 0 1 ${size - stroke / 2} ${mid}`;
  return (
    <View style={{ width: size, height }} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: clamped }}>
      <Svg width={size} height={height} viewBox={`0 0 ${size} ${height}`}>
        {t.fillTo ? (
          <Defs>
            <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor={t.fill} />
              <Stop offset="1" stopColor={t.fillTo} />
            </LinearGradient>
          </Defs>
        ) : null}
        {half ? (
          <>
            <Path d={arc} stroke={t.track} strokeWidth={stroke} strokeLinecap="round" fill="none" />
            {clamped > 0 ? (
              <Path d={arc} stroke={t.fillTo ? `url(#${gradientId})` : t.fill} strokeWidth={stroke} strokeLinecap="round" fill="none" strokeDasharray={dash} />
            ) : null}
          </>
        ) : (
          <>
            <Circle cx={mid} cy={mid} r={r} stroke={t.track} strokeWidth={stroke} fill="none" />
            <Circle
              cx={mid}
              cy={mid}
              r={r}
              stroke={t.fillTo ? `url(#${gradientId})` : t.fill}
              strokeWidth={stroke}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={dash}
              transform={`rotate(-90 ${mid} ${mid})`}
            />
          </>
        )}
      </Svg>
      <View style={[StyleSheet.absoluteFill, half ? styles.bottom : styles.center]} pointerEvents="none">
        <Text variant={size >= HUGE ? "display" : big ? "title" : "bodyStrong"}>{`${clamped}%`}</Text>
        {big && caption ? (
          <Text variant="caption" color="secondary">
            {caption}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: "center", justifyContent: "center" },
  bottom: { alignItems: "center", justifyContent: "flex-end" },
});
