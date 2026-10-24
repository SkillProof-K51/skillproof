import { colors, radius, space } from "@skillproof/tokens";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { BarChart, Button, SkillBadge, Stat, Text } from "../ui";
import { KitLabel, KitSection } from "./KitSection";

const POP = 120; // a win's badge, smaller than on the Result so two fit side by side
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MINUTES = [7, 5, 17, 8, 4, 12, 9]; // practice minutes per day
const GOAL = 15; // minutes a day

/** Results & reports: SkillBadge for the Passport and a Result's win; BarChart and Stat tiles for the report screens. */
export function ResultsDemo() {
  const [run, setRun] = useState(0); // a new key replays the pop
  return (
    <KitSection title="Results & reports" components="SkillBadge · BarChart · Stat">
      <KitLabel>SkillBadge · one per skill on the Passport: Verified, Practised, locked</KitLabel>
      <View style={styles.badges}>
        <SkillBadge skill="HTML and CSS" status="verified" />
        <SkillBadge skill="React" status="practised" />
        <SkillBadge skill="Node.js" status="not_yet" />
      </View>
      <KitLabel>SkillBadge from · a Result’s win: Module 3 pops not_yet → practised, Module 4 practised → verified</KitLabel>
      <View style={styles.badges}>
        <SkillBadge key={`practised${run}`} skill="Node.js" status="practised" from="not_yet" size={POP} />
        <SkillBadge key={`verified${run}`} skill="JavaScript" status="verified" from="practised" size={POP} />
      </View>
      <Button label="Play again" icon="retry" variant="secondary" onPress={() => setRun((n) => n + 1)} />

      <KitLabel>BarChart · one series, one hue; the highlighted column is today; the track is the goal</KitLabel>
      <View style={styles.well}>
        <View style={styles.report}>
          <View>
            <Text variant="caption" color="secondary">
              Practice this week
            </Text>
            <View style={styles.hero}>
              <Text variant="title">62</Text>
              <Text variant="small" color="secondary">
                min
              </Text>
            </View>
          </View>
          <Text variant="caption" color="secondary">
            Goal {GOAL} min a day
          </Text>
        </View>
        <BarChart
          values={MINUTES}
          labels={DAYS}
          max={GOAL}
          highlight={2}
          format={(v) => `${Math.round((100 * v) / GOAL)}%`}
          accessibilityLabel="Practice minutes per day this week against a 15-minute goal"
        />
      </View>

      <KitLabel>Stat · a number, its icon and its unit; two in a row on the page</KitLabel>
      <View style={styles.page}>
        <View style={styles.row}>
          <Stat icon="check-circle" tone="verified" label="Verified" value={9} unit="skills" delta={{ text: "+2 this month", good: true }} />
          <Stat icon="zap" tone="practised" label="Practised" value={14} unit="skills" delta={{ text: "+5 this month", good: true }} />
        </View>
        <View style={styles.row}>
          <Stat icon="briefcase" label="Demand" value={38} unit="job ads" delta={{ text: "−4 vs last month", good: false }} />
          <Stat icon="alert" tone="butter" label="Curriculum gap" value="24%" unit="of skills" />
        </View>
        <Stat icon="briefcase" label="Average stipend" value="RM 1,200" unit="per project" />
      </View>
    </KitSection>
  );
}

const styles = StyleSheet.create({
  badges: { flexDirection: "row", justifyContent: "space-around", alignItems: "center" },
  well: { gap: space.lg, padding: space.md, borderRadius: radius.xl, backgroundColor: colors.bg.app },
  report: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" },
  hero: { flexDirection: "row", alignItems: "baseline", gap: space.xs },
  // the page colour behind white Stat tiles, as on a real report screen
  page: { gap: space.sm, padding: space.sm, borderRadius: radius.xl, backgroundColor: colors.bg.app },
  row: { flexDirection: "row", gap: space.sm },
});
