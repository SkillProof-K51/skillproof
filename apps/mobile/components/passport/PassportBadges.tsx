import { colors, space } from "@skillproof/tokens";
import { Pressable, StyleSheet, View, type DimensionValue } from "react-native";

import type { PassportBadge } from "../../lib/passport";
import { Card, Chip, Divider, Icon, SkillBadge, Text } from "../ui";

const COLUMNS = 3;
const CELL: DimensionValue = `${100 / COLUMNS}%`;
const LOCK = 18;

type Props = {
  badges: PassportBadge[];
  /** Badges unlock in Challenges. */
  onUnlockMore: () => void;
};

/**
 * The passport's badges (Azim's "Awards & highlights" reference, 24 Oct): one hexagon per roadmap
 * skill, the number earned (Verified) beside the title, and the way to unlock the locked ones.
 */
export function PassportBadges({ badges, onUnlockMore }: Props) {
  const earned = badges.filter((b) => b.status === "verified").length;
  const locked = badges.some((b) => b.status === "not_yet");
  return (
    <Card>
      <View style={styles.header} accessibilityLabel={`Badges, ${earned} earned`}>
        <Text variant="heading" accessibilityRole="header">
          Badges
        </Text>
        <Chip label={String(earned)} />
      </View>
      <View style={styles.grid}>
        {badges.map((b) => (
          <View key={b.skill} style={styles.cell}>
            <SkillBadge skill={b.skill} status={b.status} />
            <Text variant="label" align="center" color={b.status === "not_yet" ? "secondary" : "primary"} numberOfLines={2}>
              {b.skill}
            </Text>
          </View>
        ))}
      </View>
      {locked ? (
        <>
          <Divider />
          <Pressable onPress={onUnlockMore} accessibilityRole="link" hitSlop={8} style={styles.unlock}>
            <Icon name="lock" weight="fill" size={LOCK} color={colors.text.primary} />
            <Text variant="bodyStrong">Unlock more badges</Text>
          </Pressable>
        </>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: space.sm, marginBottom: space.lg },
  grid: { flexDirection: "row", flexWrap: "wrap", rowGap: space.lg, marginBottom: space.lg },
  cell: { width: CELL, alignItems: "center", gap: space.sm },
  unlock: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: space.sm, paddingTop: space.lg },
});
