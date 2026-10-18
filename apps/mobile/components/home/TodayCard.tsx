import { colors, gap, radius, space } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

import type { TodaysChallenge } from "../../lib/home";
import { Card, Chip, Icon, Mascot, ProgressDots, Text } from "../ui";

const MASCOT_WIDTH = 132; // the one in-card mascot on Home
const MASCOT_DROP = 26; // it peeks up from the bottom edge: this much hangs below and is clipped
const GO = 24; // the navy arrow circle

type Props = {
  challenge: TodaysChallenge;
  /** Opens the challenge (to do) or the Challenges tab (done → practise more). */
  onPress: () => void;
};

/**
 * Today's challenge (Module 3), "whole card is the button" (Azim, 18 Oct): sits under a
 * "Today's challenge" section header. Butter = energy; the title, progress dots toward Practised,
 * a navy arrow as the tap cue, a time chip top-right, the mascot peeking up from the bottom-right
 * edge. Done → "Nice work!", a Done chip, happy mascot, "Practise more".
 */
export function TodayCard({ challenge, onPress }: Props) {
  const { done } = challenge;
  const action = done ? "Practise more" : "Start challenge";
  return (
    <Card
      tone="butter"
      onPress={onPress}
      accessibilityLabel={
        done ? `Today's challenge done. ${action}` : `Today's challenge, ${challenge.minutes} minutes: ${challenge.title}. ${action}`
      }
    >
      <Mascot pose={done ? "happy" : "idea"} width={MASCOT_WIDTH} style={styles.mascot} />
      <View style={styles.corner}>
        {done ? <Chip label="Done" icon="check" tone="surface" /> : <Chip label={`${challenge.minutes} min`} icon="clock" tone="surface" />}
      </View>
      <View style={styles.text}>
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
    </Card>
  );
}

const styles = StyleSheet.create({
  // behind the text, clipped by the card's rounded corners (Card has overflow: hidden)
  mascot: { position: "absolute", right: space.sm, bottom: -MASCOT_DROP, zIndex: -1 },
  corner: { position: "absolute", top: space.lg, right: space.lg },
  text: { gap: gap.tight, marginRight: MASCOT_WIDTH - space.lg },
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
