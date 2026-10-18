import { colors, radius, space } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

import { Text } from "./Text";

type Tone = "default" | "verified" | "practised";

// default = a plain count · verified / practised = a count of skills in that status (colour = meaning)
const TONES: Record<Tone, { bg: string; fg: string }> = {
  default: { bg: colors.bg.subtle, fg: colors.text.primary },
  verified: { bg: colors.status.verified.bg, fg: colors.status.verified.fg },
  practised: { bg: colors.status.practised.bg, fg: colors.status.practised.fg },
};

type Props = {
  /** Already formatted (rule 2: computed elsewhere) — "9", "72%", "RM 1,200". */
  value: string | number;
  label: string;
  /** A quieter third line: "of 25 skills", "last 30 days". */
  caption?: string;
  tone?: Tone;
};

/** One number with its label, for report screens. Put two or three in a row; each takes equal width. */
export function Stat({ value, label, caption, tone = "default" }: Props) {
  const t = TONES[tone];
  return (
    <View style={[styles.tile, { backgroundColor: t.bg }]} accessibilityLabel={`${label}: ${value}${caption ? `, ${caption}` : ""}`}>
      <Text variant="title" color={t.fg}>
        {String(value)}
      </Text>
      <Text variant="captionStrong" color={tone === "default" ? "secondary" : t.fg}>
        {label}
      </Text>
      {caption ? (
        <Text variant="caption" color="secondary">
          {caption}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { flex: 1, padding: space.md, borderRadius: radius.tile, gap: space.xxs },
});
