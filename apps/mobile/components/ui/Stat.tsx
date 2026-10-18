import { colors, radius, space } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

import { Icon, type IconName } from "./Icon";
import { Text } from "./Text";

const ICON_CIRCLE = 32;
const ICON = 16;

type Tone = "default" | "verified" | "practised" | "butter";

// the icon circle's tint: colour = meaning (green = Verified, blue = Practised / progress, butter = challenges)
const TONES: Record<Tone, { bg: string; fg: string }> = {
  default: { bg: colors.bg.subtle, fg: colors.icon.default },
  verified: { bg: colors.status.verified.bg, fg: colors.status.verified.fg },
  practised: { bg: colors.status.practised.bg, fg: colors.status.practised.fg },
  butter: { bg: colors.accent.butter, fg: colors.text.primary },
};

type Props = {
  icon: IconName;
  tone?: Tone;
  /** Sentence case, no colon: "Challenges passed". */
  label: string;
  /** Already formatted (rule 2): "14", "1,250", "RM 1,200". */
  value: string | number;
  /** Shown small after the value: "skills", "min", "kcal". */
  unit?: string;
  /** Signed change against a named period: "+2 this month". `good` colours it. */
  delta?: { text: string; good: boolean };
};

/**
 * One number with its label and icon, for report screens. A white tile; put two in a row on the
 * page, or one full width. The number wears text ink — the tone lives in the icon circle, never
 * in the figure. A trend belongs in a <BarChart> beside it, not inside the tile (Azim, 18 Oct).
 */
export function Stat({ icon, tone = "default", label, value, unit, delta }: Props) {
  const t = TONES[tone];
  return (
    <View
      style={styles.tile}
      accessibilityLabel={`${label}: ${value}${unit ? ` ${unit}` : ""}${delta ? `, ${delta.text}` : ""}`}
      accessibilityRole="summary"
    >
      <View style={styles.head}>
        <View style={[styles.circle, { backgroundColor: t.bg }]}>
          <Icon name={icon} size={ICON} weight={tone === "default" ? "regular" : "fill"} color={t.fg} />
        </View>
        <Text variant="bodyStrong" style={styles.label} numberOfLines={2}>
          {label}
        </Text>
      </View>
      <View style={styles.value}>
        <Text variant="title">{String(value)}</Text>
        {unit ? (
          <Text variant="small" color="secondary">
            {unit}
          </Text>
        ) : null}
      </View>
      {delta ? (
        <Text variant="caption" color={delta.good ? colors.feedback.success.fg : colors.feedback.error.fg}>
          {delta.text}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { flex: 1, padding: space.lg, gap: space.sm, borderRadius: radius.xl, backgroundColor: colors.bg.surface },
  head: { flexDirection: "row", alignItems: "center", gap: space.sm },
  circle: { width: ICON_CIRCLE, height: ICON_CIRCLE, borderRadius: radius.full, alignItems: "center", justifyContent: "center" },
  label: { flex: 1 },
  value: { flexDirection: "row", alignItems: "baseline", gap: space.xs },
});
