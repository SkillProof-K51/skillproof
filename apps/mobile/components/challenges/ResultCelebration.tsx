import { colors, layout, radius, space } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { toPractisedLabel, type ChallengeResult } from "../../lib/challenges";
import { Button, SegmentedProgress, SkillBadge, Text, type SegmentFill } from "../ui";

const BADGE = 176; // the skill's badge, big: this beat is the moment
const LIFT = 32; // the group sits a little above the middle — the optical centre

type Props = {
  result: ChallengeResult;
  /** On to the details beat. */
  onContinue: () => void;
};

/**
 * Beat 1 of a passed Result: the celebration. The skill's badge is the moment (Azim, 25 Oct — it
 * replaced the mascot and the stamp): when this pass made the skill Practised, the badge pops open
 * from locked; otherwise it stays locked and the passes so far fill in under it. One button: on
 * to the details.
 */
export function ResultCelebration({ result, onContinue }: Props) {
  const insets = useSafeAreaInsets();
  const { progress, nowPractised } = result;
  const passes: SegmentFill[] = Array.from({ length: progress.of }, (_, i) => (i < progress.passed ? "strong" : "empty"));
  return (
    <View style={[styles.page, { paddingTop: insets.top + space.lg, paddingBottom: insets.bottom + space.xl }]}>
      <View style={styles.panel}>
        {nowPractised ? (
          <SkillBadge skill={progress.skill} status="practised" from="not_yet" size={BADGE} />
        ) : (
          <SkillBadge skill={progress.skill} status="not_yet" size={BADGE} />
        )}
        <View style={styles.caption}>
          <Text variant="headline" align="center">
            {nowPractised ? `${progress.skill}, Practised!` : "Passed!"}
          </Text>
          <Text variant="body" color="secondary" align="center">
            {nowPractised
              ? "Badge unlocked. A mentor-reviewed project makes it Verified."
              : `${progress.passed} of ${progress.of} ${progress.skill} challenges passed`}
          </Text>
        </View>
        {nowPractised ? null : (
          <View style={styles.passes}>
            <SegmentedProgress segments={passes} accessibilityLabel={`${progress.passed} of ${progress.of} challenges passed`} />
            <Text variant="label" color="secondary" align="center">
              {toPractisedLabel(progress)}
            </Text>
          </View>
        )}
      </View>
      <Button label="See your result" block onPress={onContinue} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, paddingHorizontal: layout.gutter, gap: space.lg, backgroundColor: colors.bg.app },
  panel: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: space.xl,
    paddingHorizontal: space.xl,
    paddingBottom: LIFT,
    borderRadius: radius.xl,
    backgroundColor: colors.bg.surface,
  },
  caption: { alignItems: "center", gap: space.sm },
  passes: { width: BADGE, gap: space.sm },
});
