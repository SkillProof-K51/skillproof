import { colors, gap, radius, space } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

import type { TodaysChallenge } from "../../lib/home";
import { Card, Icon, Mascot, ProgressDots, Text } from "../ui";

const MASCOT_WIDTH = 110; // the one in-card mascot on Home
const GO = 24; // the navy arrow circle

type Props = {
  challenge: TodaysChallenge;
  /** Opens the challenge (to do) or the Challenges tab (done → practise more). */
  onPress: () => void;
};

/**
 * Today's challenge (Module 3), "whole card is the button" (Azim, 18 Oct): butter = energy, a
 * small-caps "Today · 3 min", the title, progress dots toward Practised, and a navy arrow as the
 * tap cue. Done → "Nice work!", happy mascot, "Practise more".
 */
export function TodayCard({ challenge, onPress }: Props) {
  const { done } = challenge;
  const action = done ? "Practise more" : "Start challenge";
  return (
    <Card
      tone="butter"
      onPress={onPress}
      accessibilityLabel={done ? `Today's challenge done. ${action}` : `Today's challenge: ${challenge.title}. ${action}`}
    >
      <View style={styles.row}>
        <View style={styles.text}>
          <Text variant="sectionLabel" color="secondary">
            {done ? "Today · done" : `Today · ${challenge.minutes} min`}
          </Text>
          <Text variant="heading">{done ? "Nice work!" : challenge.title}</Text>
          <View style={styles.meta}>
            <ProgressDots done={challenge.passed} of={challenge.of} tone="butter" />
            <Text variant="caption" color="secondary">
              {challenge.skill}
            </Text>
          </View>
          <View style={styles.go}>
            <Text variant="bodyStrong">{action}</Text>
            <View style={styles.goCircle}>
              <Icon name="chevron-right" size={16} color={colors.action.onPrimaryStrong} />
            </View>
          </View>
        </View>
        <Mascot pose={done ? "happy" : "idea"} width={MASCOT_WIDTH} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: space.md },
  text: { flex: 1, gap: gap.tight },
  meta: { flexDirection: "row", alignItems: "center", gap: space.sm },
  go: { flexDirection: "row", alignItems: "center", gap: space.sm, marginTop: space.xs },
  goCircle: {
    width: GO,
    height: GO,
    borderRadius: radius.full,
    backgroundColor: colors.action.primaryStrong,
    alignItems: "center",
    justifyContent: "center",
  },
});
