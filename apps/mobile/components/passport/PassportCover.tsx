import { colors, gap, space } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

import type { PassportData } from "../../lib/passport";
import { Card, IconBadge, StatusBadge, Text } from "../ui";

type Props = {
  student: PassportData["student"];
  verified: number;
  practised: number;
  share: PassportData["share"];
};

/**
 * The open passport, on the sky at the top of the Passport tab (Home's PassportCard is the closed
 * one): navy cover, gold foil. Whose it is, the Verified / Practised counts, and whether the link
 * works — the link is selectable, so it can be copied by hand anywhere sharing isn't available.
 */
export function PassportCover({ student, verified, practised, share }: Props) {
  return (
    <Card tone="passport">
      <View style={styles.row}>
        <IconBadge icon="id-card" tone="gold" />
        <View style={styles.stack}>
          <Text variant="heading" color="inverse">
            {student.name}
          </Text>
          <Text variant="small" color="gold">
            {student.pathLabel}
          </Text>
        </View>
      </View>
      <View style={styles.badges}>
        <StatusBadge status="verified" label={`${verified} Verified`} />
        <StatusBadge status="practised" label={`${practised} Practised`} />
      </View>
      <View style={styles.divider} />
      <Text variant="caption" color="gold">
        {share.isPublic ? "Public link" : "Private"}
      </Text>
      <Text variant="bodyStrong" color="inverse" selectable={share.isPublic}>
        {share.isPublic ? share.link : "Only you can see your passport"}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: space.md },
  stack: { flex: 1, gap: space.xxs },
  badges: { flexDirection: "row", gap: gap.tight, marginTop: space.md },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.passport.goldLine, marginVertical: space.md },
});
