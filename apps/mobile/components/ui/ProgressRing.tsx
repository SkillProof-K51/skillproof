import { colors } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { fontFamilyFor } from "./fonts";
import { Text } from "./Text";

type Props = {
  /** 0–100 integer (rule 2: percentages are integers, computed elsewhere). */
  percent: number;
  size?: number;
  /** Text inside the ring; defaults to "72%". */
  label?: string;
};

/** Readiness ring: track in border/default, fill in accent/progress, starts at 12 o'clock. */
export function ProgressRing({ percent, size = 64, label }: Props) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));
  const stroke = size * 0.08; // Figma: 5.12 on 64
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <View style={{ width: size, height: size }} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: clamped }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.border.default} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colors.accent.progress}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${(c * clamped) / 100} ${c}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={[StyleSheet.absoluteFill, styles.center]} pointerEvents="none">
        <Text variant="bodyStrong" style={styles.label}>
          {label ?? `${clamped}%`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: "center", justifyContent: "center" },
  label: { fontFamily: fontFamilyFor("sans", 600) }, // Figma: the ring value is SemiBold
});
