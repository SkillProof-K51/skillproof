import { colors, radius } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

import { Icon, type IconName } from "./Icon";

type Tone = "blue" | "green" | "grey" | "butter" | "gold";

// Blue = in progress / projects · Green = verified / achievement · Grey = locked / neutral · Butter = energy / challenge ·
// Gold = the Skill Passport (on its navy cover)
const TONES: Record<Tone, { bg: string; fg: string }> = {
  blue: { bg: colors.status.practised.bg, fg: colors.status.practised.fg },
  green: { bg: colors.status.verified.bg, fg: colors.status.verified.fg },
  grey: { bg: colors.bg.subtle, fg: colors.icon.default },
  butter: { bg: colors.accent.butter, fg: colors.text.primary },
  gold: { bg: colors.passport.gold, fg: colors.passport.cover },
};

type Props = {
  icon: IconName;
  tone?: Tone;
  /** tile = rounded square with a Duotone glyph (list rows, feature grids); circle = Regular glyph. */
  shape?: "circle" | "tile";
};

export function IconBadge({ icon, tone = "blue", shape = "tile" }: Props) {
  const t = TONES[tone];
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }, shape === "circle" ? styles.circle : styles.tile]}>
      <Icon name={icon} size={24} weight={shape === "tile" ? "duotone" : "regular"} color={t.fg} />
    </View>
  );
}

const SIZE = 44; // Figma "Icon badge"

const styles = StyleSheet.create({
  badge: { width: SIZE, height: SIZE, alignItems: "center", justifyContent: "center" },
  circle: { borderRadius: radius.full },
  tile: { borderRadius: radius.tile },
});
