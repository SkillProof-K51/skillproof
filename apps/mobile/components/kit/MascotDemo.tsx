import { space } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

import { GroundedMascot, Mascot, SkyPanel, SpeechBubble, Text, type MascotPose } from "../ui";
import { KitLabel, KitSection } from "./KitSection";

const POSES: MascotPose[] = ["wave", "happy", "question", "idea", "checklist", "celebrate", "graduate", "laptop", "reading", "sleep"];
const POSE_WIDTH = 72;
const HERO_WIDTH = 120;

/** The mascot: ten poses, the grounded version with its shadow, and the speech bubble. */
export function MascotDemo() {
  return (
    <KitSection title="Mascot" components="Mascot · GroundedMascot · SpeechBubble">
      <KitLabel>Poses · one mascot per module home, at most one more in a card; none on task screens</KitLabel>
      <View style={styles.grid}>
        {POSES.map((pose) => (
          <View key={pose} style={styles.cell}>
            <Mascot pose={pose} width={POSE_WIDTH} />
            <Text variant="caption" color="secondary">
              {pose}
            </Text>
          </View>
        ))}
      </View>
      <KitLabel>GroundedMascot + SpeechBubble · how it stands in a Hero (with its ground shadow and idle bob)</KitLabel>
      <SkyPanel style={styles.stage}>
        <SpeechBubble text="Ready for today’s challenge?" />
        <GroundedMascot pose="wave" width={HERO_WIDTH} />
      </SkyPanel>
    </KitSection>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: space.md, justifyContent: "center" },
  cell: { alignItems: "center", gap: space.xs, width: POSE_WIDTH + space.lg },
  stage: { flexDirection: "row", justifyContent: "center" },
});
