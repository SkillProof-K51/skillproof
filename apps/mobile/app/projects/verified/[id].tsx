import { gap, layout, space } from "@skillproof/tokens";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { Button, Card, EmptyState, Screen, SkillBadge, Text } from "../../../components/ui";
import { getProjectJourney } from "../../../lib/project-journey";

const BADGE_SIZE = 120;

/** TEST MODE celebration preview for a mentor verification; it never changes a real skill status. */
export default function ProjectVerifiedScreen() {
  const router = useRouter();
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const journey = getProjectJourney(id);
  if (!journey) return <Screen aboveTabBar={false}><View style={styles.content}><Card><EmptyState title="No sample verification" body="This preview is available for the café project in TEST MODE." action={{ label: "Back to Projects", onPress: () => router.dismissTo("/(tabs)/projects") }} /></Card></View></Screen>;

  return (
    <Screen aboveTabBar={false} footer={<View style={styles.footer}><Button label="See sample rating" block onPress={() => router.push({ pathname: "/projects/rating/[id]", params: { id } })} /></View>}>
      <View style={styles.content}>
        <Card style={styles.celebration}>
          <SkillBadge skill="React" status="verified" from="practised" size={BADGE_SIZE} />
          <Text variant="title" align="center">React, verified!</Text>
          <Text variant="small" color="secondary" align="center">{journey.mentor} rated your café project 4 out of 5. This is a sample result and did not update your passport.</Text>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: layout.gutter, paddingVertical: gap.loose, justifyContent: "center" },
  celebration: { minHeight: space.xl * 12, alignItems: "center", justifyContent: "center", gap: space.xl },
  footer: { gap: space.sm },
});
