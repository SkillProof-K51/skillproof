import { colors, gap, space } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

import type { HomeData } from "../../lib/home";
import { Card, Icon, IconBadge, StatusBadge, Text } from "../ui";

type Props = {
  passport: HomeData["passport"];
  onPress: () => void;
};

/**
 * Skill Passport on Home (Module 5, Azim 18 Oct): styled like a real passport — navy cover, gold
 * foil. What it is, the Verified / Practised counts, and the most recent Verified skill — or,
 * before the first one, how to earn it. The full passport (evidence, mentor details, share link)
 * lives on the Passport tab.
 */
export function PassportCard({ passport, onPress }: Props) {
  const { verified, practised, latestVerified } = passport;
  return (
    <Card tone="passport" onPress={onPress} accessibilityLabel={`Skill Passport: ${verified} Verified, ${practised} Practised. Open`}>
      <View style={styles.row}>
        <IconBadge icon="id-card" tone="gold" />
        <View style={styles.stack}>
          <Text variant="heading" color="inverse">
            Skill Passport
          </Text>
          <Text variant="small" color="gold">
            Your verified skill portfolio
          </Text>
        </View>
        <Icon name="chevron-right" size={20} color={colors.passport.gold} />
      </View>
      {verified || practised ? (
        <View style={styles.badges}>
          {verified ? <StatusBadge status="verified" label={`${verified} Verified`} /> : null}
          {practised ? <StatusBadge status="practised" label={`${practised} Practised`} /> : null}
        </View>
      ) : null}
      <View style={styles.divider} />
      {latestVerified ? (
        <View style={styles.row}>
          <View style={styles.stack}>
            <Text variant="caption" color="gold">
              Recently verified
            </Text>
            <Text variant="bodyStrong" color="inverse">
              {latestVerified}
            </Text>
          </View>
          {/* verified green, in its light shade so it reads on the navy cover */}
          <View style={styles.approved}>
            <Icon name="check-circle" size={16} color={colors.status.verified.bg} />
            <Text variant="captionStrong" color={colors.status.verified.bg}>
              Mentor-approved
            </Text>
          </View>
        </View>
      ) : (
        <Text variant="small" color="inverse">
          Complete a mentor-reviewed project to earn your first Verified skill.
        </Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: space.md },
  stack: { flex: 1, gap: space.xxs },
  badges: { flexDirection: "row", gap: gap.tight, marginTop: space.md },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.passport.goldLine, marginVertical: space.md },
  approved: { flexDirection: "row", alignItems: "center", gap: space.xs },
});
