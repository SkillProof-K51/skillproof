import { colors } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { Text } from "./Text";

const STROKE_RATIO = 0.08; // ring thickness = 8 % of its size
const BIG = 96; // from this size up the percentage uses the title style

const TONES = {
  card: { track: colors.border.default, fill: colors.accent.progress }, // on white cards
  sky: { track: colors.glass.veil, fill: colors.accent.brand }, // on the hero's sky
} as const;

type Props = {
  /** 0–100 integer (rule 2: percentages are integers, computed elsewhere). */
  percent: number;
  size?: number;
  tone?: keyof typeof TONES;
  /** Small line under the percentage inside a big ring, e.g. "ready". */
  caption?: string;
};

/** Progress ring, starts at 12 o'clock. Big rings get a title-size percentage + an optional caption. */
export function ProgressRing({ percent, size = 64, tone = "card", caption }: Props) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));
  const stroke = size * STROKE_RATIO;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const t = TONES[tone];
  const big = size >= BIG;
  return (
    <View style={{ width: size, height: size }} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: clamped }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={t.track} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={t.fill}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${(c * clamped) / 100} ${c}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={[StyleSheet.absoluteFill, styles.center]} pointerEvents="none">
        <Text variant={big ? "title" : "bodyStrong"}>{`${clamped}%`}</Text>
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
});
