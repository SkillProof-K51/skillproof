import { colors, radius } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

import { Text } from "./Text";

type Tone = "practised" | "verified" | "neutral" | "butter";

const TONES: Record<Tone, { bg: string; fg: string; weight: "captionStrong" | "caption" }> = {
  practised: { bg: colors.status.practised.bg, fg: colors.status.practised.fg, weight: "captionStrong" },
  verified: { bg: colors.status.verified.bg, fg: colors.status.verified.fg, weight: "captionStrong" },
  neutral: { bg: colors.bg.subtle, fg: colors.text.secondary, weight: "caption" },
  butter: { bg: colors.accent.butter, fg: colors.text.primary, weight: "captionStrong" },
};

type Props = { label: string; tone?: Tone };

/** Small info pill (skill names, "Fit 86%", "2 places left"). Colour = meaning, see tokens. */
export function Chip({ label, tone = "neutral" }: Props) {
  const t = TONES[tone];
  return (
    <View style={[styles.chip, { backgroundColor: t.bg }]}>
      <Text variant={t.weight} color={t.fg}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    alignSelf: "flex-start",
  },
});
