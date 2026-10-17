import { colors, radius, space } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

import type { TodaysChallenge } from "../../lib/home";
import { Button, Card, Chip, Icon, Mascot, Text } from "../ui";

type Props = {
  challenge: TodaysChallenge;
  /** Opens the challenge (to do) or the Challenges tab (done → practise more). */
  onPress: () => void;
};

/**
 * Today's challenge (Module 3): one per day, butter = energy.
 * To do → the screen's one strong CTA. Done → same card, happy mascot, a quiet "Practise more"
 * so finishing feels like a win instead of the card disappearing.
 */
export function TodaysChallengeCard({ challenge, onPress }: Props) {
  const { done } = challenge;
  return (
    <Card tone="butter" style={styles.card}>
      <View style={styles.top}>
        <Chip label="Today's challenge" tone="butter" />
        <View style={styles.pill}>
          {done ? (
            <>
              <Icon name="check" size={14} color={colors.text.primary} />
              <Text variant="caption">Done</Text>
            </>
          ) : (
            <>
              <Icon name="clock" size={14} />
              <Text variant="caption">{challenge.minutes} min</Text>
            </>
          )}
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.text}>
          <Text variant="heading">{done ? "Done for today" : challenge.title}</Text>
          <Text variant="caption">
            {challenge.skill} · {challenge.passed} of {challenge.of} passed
          </Text>
          {done ? (
            <Text variant="caption" color="secondary">
              A new challenge arrives tomorrow.
            </Text>
          ) : null}
        </View>
        <Mascot pose={done ? "happy" : "idea"} width={103} />
      </View>

      {done ? (
        <Button label="Practise more" variant="secondary" block onPress={onPress} />
      ) : (
        <Button label="Start challenge" block onPress={onPress} />
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: space.md },
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.xs,
    paddingHorizontal: 10,
    paddingVertical: space.xs,
    borderRadius: radius.full,
    backgroundColor: colors.bg.surface,
  },
  body: { flexDirection: "row", alignItems: "center", gap: space.md },
  text: { flex: 1, gap: 6 },
});
