import { colors, radius, space } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

import { GroundedMascot, Stamp, Stat, Text } from "../ui";
import { KitLabel, KitSection } from "./KitSection";

const MASCOT = 110;

/** Results & reports: the Stamp for the Result screens, Stat tiles for the report screens. */
export function ResultsDemo() {
  return (
    <KitSection title="Results & reports" components="Stamp · Stat">
      <KitLabel>Stamp · the celebration beat of a Result: Module 3 stamps Practised, Module 4 stamps Verified</KitLabel>
      <View style={styles.sky}>
        <GroundedMascot pose="celebrate" width={MASCOT} />
        <Stamp status="practised" />
        <Text variant="small" color="secondary" align="center">
          Node.js · 3 of 3 passed
        </Text>
      </View>
      <View style={styles.sky}>
        <Stamp status="verified" />
        <Text variant="small" color="secondary" align="center">
          HTML and CSS · mentor rated 4/5
        </Text>
      </View>
      <KitLabel>Stat · report tiles, two or three in a row (M1 curriculum gap, M5 skill shortage)</KitLabel>
      <View style={styles.row}>
        <Stat value={9} label="Verified" tone="verified" />
        <Stat value={14} label="Practised" tone="practised" />
        <Stat value={38} label="Demand" caption="job ads, 30 days" />
      </View>
      <View style={styles.row}>
        <Stat value="24%" label="Curriculum gap" caption="6 of 25 skills uncovered" />
        <Stat value="RM 1,200" label="Avg. stipend" caption="12 projects" />
      </View>
    </KitSection>
  );
}

const styles = StyleSheet.create({
  sky: { backgroundColor: colors.sky.base, borderRadius: radius.lg, padding: space.lg, alignItems: "center", gap: space.md },
  row: { flexDirection: "row", gap: space.sm },
});
