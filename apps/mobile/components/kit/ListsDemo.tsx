import { colors, radius, space } from "@skillproof/tokens";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { Divider, ICON_BADGE_SIZE, IconBadge, IconButton, ListRow, SegmentedControl, SkillLogo, StatusBadge, Text, TopBar } from "../ui";
import { KitLabel, KitSection } from "./KitSection";

const LEADING_INSET = ICON_BADGE_SIZE + space.md; // badge + the row gap: the divider lines up with the text

type Filter = "all" | "practised" | "verified";

/** Lists & navigation: ListRow + Divider, SegmentedControl, IconButton, TopBar. */
export function ListsDemo() {
  const [filter, setFilter] = useState<Filter>("all");
  return (
    <KitSection title="Lists & navigation" components="ListRow · Divider · SegmentedControl · IconButton · TopBar">
      <KitLabel>SegmentedControl</KitLabel>
      <SegmentedControl
        accessibilityLabel="Filter skills"
        value={filter}
        onChange={setFilter}
        options={[
          { value: "all", label: "All" },
          { value: "practised", label: "Practised" },
          { value: "verified", label: "Verified" },
        ]}
      />
      <KitLabel>ListRow · with a status, then tappable rows</KitLabel>
      <View>
        <ListRow title="Node.js" subtitle="2 of 3 challenges passed" leading={<SkillLogo skill="Node.js" size={24} />} trailing={<StatusBadge status="practised" />} />
        <Divider />
        <ListRow title="HTML and CSS" subtitle="Café landing page · mentor-approved" leading={<SkillLogo skill="HTML and CSS" size={24} />} trailing={<StatusBadge status="verified" />} />
        <Divider />
        <ListRow title="Edit my profile" subtitle="Name, faculty, target role" leading={<IconBadge icon="user" tone="grey" />} onPress={() => {}} />
        <Divider inset={LEADING_INSET} />
        <ListRow title="Share my passport" leading={<IconBadge icon="share" tone="blue" />} onPress={() => {}} />
      </View>
      <KitLabel>IconButton · surface (on the sky) and subtle (on white)</KitLabel>
      <View style={styles.buttons}>
        <IconButton icon="share" tone="subtle" accessibilityLabel="Share" onPress={() => {}} />
        <IconButton icon="x" tone="subtle" accessibilityLabel="Close" onPress={() => {}} />
        <IconButton icon="share" tone="subtle" accessibilityLabel="Share (disabled)" onPress={() => {}} disabled />
      </View>
      <KitLabel>TopBar · first thing in a Hero; a subtitle is optional</KitLabel>
      <View style={styles.bar}>
        <TopBar title="Fix the bug" subtitle="Node.js · about 3 min" onBack={() => {}} action={<IconButton icon="share" accessibilityLabel="Share" onPress={() => {}} />} />
      </View>
      <Text variant="caption" color="secondary">
        Back goes to the previous screen, or Home when there is none.
      </Text>
    </KitSection>
  );
}

const styles = StyleSheet.create({
  buttons: { flexDirection: "row", gap: space.md },
  // the page colour behind it, as on a real screen
  bar: { padding: space.md, borderRadius: radius.xl, backgroundColor: colors.bg.app },
});
