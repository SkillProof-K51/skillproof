import { colors } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

import { Text } from "./Text";

const STROKE_RATIO = 0.08; // ring thickness = 8 % of its size
const BIG = 96; // from this size up the percentage uses the title style
const HUGE = 200; // from this size up it uses the display style

// on white cards: a grey track, the fill in the role colour
const TRACK = colors.border.default;
const FILL = colors.accent.progress;

type Props = {
  /** 0–100 integer (rule 2: percentages are integers, computed elsewhere). */
  percent: number;
  /** Diameter. A half ring is this wide and about half as tall. */
  size?: number;
  /** "full" starts at 12 o'clock; "half" is a gauge that fills left → right over the top. */
  shape?: "full" | "half";
  /** Small line under the percentage inside a big ring, e.g. "ready". */
  caption?: string;
};

/** Progress ring or half-ring gauge. Big rings get a larger percentage + an optional caption. */
export function ProgressRing({ percent, size = 64, shape = "full", caption }: Props) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));
  const stroke = size * STROKE_RATIO;
  const r = (size - stroke) / 2;
  const mid = size / 2;
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
        {half ? (
          <>
            <Path d={arc} stroke={TRACK} strokeWidth={stroke} strokeLinecap="round" fill="none" />
            {clamped > 0 ? (
              <Path d={arc} stroke={FILL} strokeWidth={stroke} strokeLinecap="round" fill="none" strokeDasharray={dash} />
            ) : null}
          </>
        ) : (
          <>
            <Circle cx={mid} cy={mid} r={r} stroke={TRACK} strokeWidth={stroke} fill="none" />
            <Circle
              cx={mid}
              cy={mid}
              r={r}
              stroke={FILL}
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
