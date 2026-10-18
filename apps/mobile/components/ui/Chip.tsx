import { colors, radius, space, type } from "@skillproof/tokens";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { Icon, type IconName } from "./Icon";
import { Text } from "./Text";

type Tone = "practised" | "verified" | "neutral" | "butter" | "surface";

const TONES: Record<Tone, { bg: string; fg: string; icon: string; weight: "captionStrong" | "caption" }> = {
  practised: { bg: colors.status.practised.bg, fg: colors.status.practised.fg, icon: colors.status.practised.fg, weight: "captionStrong" },
  verified: { bg: colors.status.verified.bg, fg: colors.status.verified.fg, icon: colors.status.verified.fg, weight: "captionStrong" },
  neutral: { bg: colors.bg.subtle, fg: colors.text.secondary, icon: colors.icon.default, weight: "caption" },
  butter: { bg: colors.accent.butter, fg: colors.text.primary, icon: colors.text.primary, weight: "captionStrong" },
  surface: { bg: colors.bg.surface, fg: colors.text.primary, icon: colors.icon.default, weight: "caption" }, // on tinted cards: "3 min", "Done"
};

const PAD_X = 10; // Figma chip / tag / timer pill
const ICON = 14;

/** A chip's height — rows that sit next to chips use it so they line up. */
export const CHIP_HEIGHT = type.captionStrong.lineHeight + 2 * space.xs;

type Props = {
  label: string;
  tone?: Tone;
  icon?: IconName;
  /** Anything else in front of the label, e.g. a <SkillLogo>. Wins over `icon`. */
  leading?: ReactNode;
};

/** Small info pill (skill names, "Fit 86%", "3 min"). Colour = meaning, see tokens. */
export function Chip({ label, tone = "neutral", icon, leading }: Props) {
  const t = TONES[tone];
  return (
    <View style={[styles.chip, { backgroundColor: t.bg }]}>
      {leading ?? (icon ? <Icon name={icon} size={ICON} color={t.icon} /> : null)}
      <Text variant={t.weight} color={t.fg}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.xs,
    paddingHorizontal: PAD_X,
    paddingVertical: space.xs,
    borderRadius: radius.full,
    alignSelf: "flex-start",
  },
});
