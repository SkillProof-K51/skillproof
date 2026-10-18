import { colors, radius, space } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

import { BarChart, GroundedMascot, SkillLogo, SkyPanel, Stamp, Stat, Text } from "../ui";
import { KitLabel, KitSection } from "./KitSection";

const MASCOT = 110;
const LOGO = 22; // the skill's logo beside its name under the stamp
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MINUTES = [7, 5, 17, 8, 4, 12, 9]; // practice minutes per day
const GOAL = 15; // minutes a day

/** Results & reports: the Stamp for the Result screens; BarChart and Stat tiles for the report screens. */
export function ResultsDemo() {
  return (
    <KitSection title="Results & reports" components="Stamp · SkyPanel · BarChart · Stat">
      <KitLabel>Stamp on a SkyPanel · the celebration beat of a Result: Module 3 stamps Practised, Module 4 stamps Verified</KitLabel>
      <SkyPanel>
        <GroundedMascot pose="celebrate" width={MASCOT} />
        <Stamp status="practised" />
        <View style={styles.caption}>
          <View style={styles.skill}>
            <SkillLogo skill="Node.js" size={LOGO} />
            <Text variant="heading">Node.js</Text>
          </View>
          <Text variant="body" color="secondary" align="center">
            3 of 3 challenges passed
          </Text>
        </View>
      </SkyPanel>
      <SkyPanel>
        <Stamp status="verified" />
        <View style={styles.caption}>
          <View style={styles.skill}>
            <SkillLogo skill="HTML and CSS" size={LOGO} />
            <Text variant="heading">HTML and CSS</Text>
          </View>
          <Text variant="body" color="secondary" align="center">
            Mentor rated 4 of 5
          </Text>
        </View>
      </SkyPanel>

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
  caption: { alignItems: "center", gap: space.xxs, marginTop: space.xs },
  skill: { flexDirection: "row", alignItems: "center", gap: space.sm },
  well: { gap: space.lg, padding: space.md, borderRadius: radius.xl, backgroundColor: colors.bg.app },
  report: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" },
  hero: { flexDirection: "row", alignItems: "baseline", gap: space.xs },
  // the page colour behind white Stat tiles, as on a real report screen
  page: { gap: space.sm, padding: space.sm, borderRadius: radius.xl, backgroundColor: colors.bg.app },
  row: { flexDirection: "row", gap: space.sm },
});
