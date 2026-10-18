import { colors, radius, space } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

import type { TodaysChallenge } from "../../lib/home";
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
 * (navy ticks), today's (butter), the rest, then the locked micro-project at the end. The path
 * itself says how many are left; screen readers hear it in the label.
 */
export function UnlockCard({ challenge, projectTitle, remaining, onPress }: Props) {
  const steps = Array.from({ length: challenge.of }, (_, i) => i);
  const more = remaining === 1 ? "1 more to go" : `${remaining} more to go`;
  return (
    <Card onPress={onPress} accessibilityLabel={`${projectTitle} unlocks when ${challenge.skill} is Practised. ${more}.`}>
      <View style={styles.head}>
        <Icon name="lock" size={18} weight="fill" color={colors.action.primaryStrong} />
        <Text variant="bodyStrong" style={styles.flex}>
          Unlocks {projectTitle}
        </Text>
      </View>
      <View style={styles.path}>
        <View style={styles.track} />
        {steps.map((i) => (
          <View key={i} style={styles.step}>
            <View style={[styles.dot, i < challenge.passed ? styles.done : i === challenge.passed ? styles.today : styles.todo]}>
              {i < challenge.passed ? <Icon name="check" size={TICK} color={colors.action.onPrimaryStrong} /> : null}
            </View>
            <Text variant="caption" color="secondary">
              {i === challenge.passed ? "Today" : `#${i + 1}`}
            </Text>
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
  path: { flexDirection: "row", justifyContent: "space-between", marginTop: space.md },
  // runs behind the circles, through their centres
  track: { position: "absolute", left: STEP / 2, right: STEP / 2, top: (STEP - TRACK) / 2, height: TRACK, backgroundColor: colors.bg.subtle },
  step: { alignItems: "center", gap: space.xs },
  dot: { width: STEP, height: STEP, borderRadius: radius.full, alignItems: "center", justifyContent: "center" },
  done: { backgroundColor: colors.action.primaryStrong },
  today: { backgroundColor: colors.accent.butterSoft, borderWidth: TRACK, borderColor: colors.accent.butter },
  todo: { backgroundColor: colors.bg.subtle },
});
