import { layout, space } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { ChallengeResult } from "../../lib/challenges";
import { Button, GroundedMascot, SkillLogo, SkyPanel, Stamp, Text } from "../ui";

const MASCOT = 220; // the celebrate pose, big: this beat is the moment (sharp up to ~240 on a 3× phone)
const LIFT = 48; // the group sits a little above the middle — the optical centre
const LOGO = 22; // the skill's logo beside its name under the stamp

type Props = {
  result: ChallengeResult;
  /** On to the details beat. */
  onContinue: () => void;
};

/**
 * Beat 1 of a passed Result: the celebration. A full-height sky panel (sky → soft sky, so it keeps
 * its whole shape — Azim's pick, 19 Oct) with the celebrating mascot, then the stamp slams down —
 * PRACTISED when this pass made the skill Practised, PASSED otherwise (both blue: a pass counts
 * toward Practised) — and the skill's count. One button: on to the details.
 */
export function ResultCelebration({ result, onContinue }: Props) {
  const insets = useSafeAreaInsets();
  const { progress, nowPractised } = result;
  return (
    <View style={[styles.page, { paddingTop: insets.top + space.lg, paddingBottom: insets.bottom + space.xl }]}>
      <SkyPanel fadeTo="soft" style={styles.panel}>
        <GroundedMascot pose="celebrate" width={MASCOT} />
        <Stamp status="practised" label={nowPractised ? undefined : "Passed"} slam />
        <View style={styles.caption}>
          <View style={styles.skill}>
            <SkillLogo skill={progress.skill} size={LOGO} />
            <Text variant="heading">{nowPractised ? `${progress.skill} is Practised` : progress.skill}</Text>
          </View>
          <Text variant="body" color="secondary" align="center">
            {progress.passed} of {progress.of} challenges passed
          </Text>
        </View>
      </SkyPanel>
      <Button label="See your result" block onPress={onContinue} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, paddingHorizontal: layout.gutter, gap: space.lg },
  panel: { flex: 1, justifyContent: "center", gap: space.xl, paddingBottom: LIFT },
  caption: { alignItems: "center", gap: space.xxs },
  skill: { flexDirection: "row", alignItems: "center", gap: space.sm },
});
