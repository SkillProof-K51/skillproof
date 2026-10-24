import { colors, radius, space } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

import type { TodaysChallenge } from "../../lib/challenges";
import { Card, Icon, Text } from "../ui";

const STEP = 30; // one step circle
const TICK = 14;
const TRACK = 2; // the line joining the steps

type Props = {
  challenge: TodaysChallenge;
  projectTitle: string;
  /** Challenges still to pass before the skill is Practised (from nextUnlock in lib/home). */
  remaining: number;
  onPress: () => void;
};

/**
 * Under today's challenge (Azim, 18 Oct): what it unlocks. A path of steps — passed challenges
 * (purple ticks), today's (the role tint, numbered), the rest, then the locked micro-project at the end,
 * plus one line on what unlocking means (you can apply — a place isn't promised).
 */
export function UnlockCard({ challenge, projectTitle, remaining, onPress }: Props) {
  const steps = Array.from({ length: challenge.of }, (_, i) => i);
  // equal columns (challenges + the project); the track runs from the first centre to the last
  const inset = `${50 / (challenge.of + 1)}%` as const;
  const more = remaining === 1 ? "1 more to go" : `${remaining} more to go`;
  return (
    <Card onPress={onPress} accessibilityLabel={`${projectTitle} unlocks when ${challenge.skill} is Practised. ${more}.`}>
      <View style={styles.head}>
        <Icon name="lock" size={18} weight="fill" color={colors.action.primaryStrong} />
        <Text variant="bodyStrong" style={styles.flex}>
          Unlocks {projectTitle}
        </Text>
      </View>
      {/* Links the two progress systems: Practised raises readiness (Module 2 counts it as half) and
          lets you apply — it doesn't promise a place (spec, Module 4). No number: that's the fit engine's. */}
      <Text variant="small" color="secondary" style={styles.sub}>
        {remaining === 1 ? "Pass today's" : `Pass ${remaining} more`} to make {challenge.skill} Practised: your readiness goes up and you can apply.
      </Text>
      <View style={styles.path}>
        <View style={[styles.track, { left: inset, right: inset }]} />
        {steps.map((i) => (
          <View key={i} style={styles.step}>
            <View style={[styles.dot, i < challenge.passed ? styles.done : i === challenge.passed ? styles.today : styles.todo]}>
              {i < challenge.passed ? (
                <Icon name="check" size={TICK} color={colors.text.inverse} />
              ) : (
                <Text variant="captionStrong">{i + 1}</Text>
              )}
            </View>
            {i === challenge.passed ? (
              <Text variant="captionStrong">Today</Text>
            ) : (
              <Text variant="caption" color="secondary">
                Challenge {i + 1}
              </Text>
            )}
          </View>
        ))}
        <View style={styles.step}>
          <View style={[styles.dot, styles.todo]}>
            <Icon name="lock" size={TICK} color={colors.icon.default} />
          </View>
          <Text variant="caption" color="secondary">
            Project
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: "row", alignItems: "center", gap: space.sm },
  flex: { flex: 1 },
  sub: { marginTop: space.xs },
  path: { flexDirection: "row", marginTop: space.md },
  // runs behind the circles, through their centres
  track: { position: "absolute", top: (STEP - TRACK) / 2, height: TRACK, backgroundColor: colors.bg.subtle },
  step: { flex: 1, alignItems: "center", gap: space.xs },
  dot: { width: STEP, height: STEP, borderRadius: radius.full, alignItems: "center", justifyContent: "center" },
  // progress wears the role colour, like the dots and segments (Azim, 25 Oct; butter was the old theme)
  done: { backgroundColor: colors.accent.progress },
  today: { backgroundColor: colors.accent.skySoft, borderWidth: TRACK, borderColor: colors.accent.brand },
  todo: { backgroundColor: colors.bg.subtle },
});
