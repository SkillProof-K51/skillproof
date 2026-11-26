import { colors, gap, layout, space } from "@skillproof/tokens";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { Button, Card, Chip, EmptyState, Hero, Icon, Screen, Text, TopBar } from "../../../components/ui";
import { getProject } from "../../../lib/projects";
import { getProjectJourney } from "../../../lib/project-journey";

/** AI-style first-review visual, using clearly labelled static demo checks only. */
export default function ProjectReviewScreen() {
  const router = useRouter();
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const project = getProject(id);
  const journey = getProjectJourney(id);
  const back = () => router.dismissTo("/(tabs)/projects");

  if (!project || !journey) return <Screen aboveTabBar={false}><Hero><TopBar title="In review" onBack={back} /></Hero><View style={styles.content}><Card><EmptyState title="No sample review" body="Review details are only available for the café project in TEST MODE." action={{ label: "Back to Projects", onPress: back }} /></Card></View></Screen>;

  return (
    <Screen aboveTabBar={false}>
      <Hero><TopBar title="Your project" subtitle={`${project.title} · ${project.partner}`} onBack={back} /></Hero>
      <View style={styles.content}>
        <Card style={styles.card}>
          {journey.stages.map((stage, index) => (
            <View key={stage.label} style={styles.stage}>
              <Icon name={index < 4 ? "check-circle" : "clock"} size={space.lg} color={index < 4 ? colors.status.verified.fg : colors.icon.default} />
              <Text variant="small" style={styles.flex}>{stage.label}</Text>
              <Text variant="caption" color="secondary">{stage.date}</Text>
            </View>
          ))}
        </Card>
        <View style={styles.header}><Text variant="subheading">AI first review</Text><Chip label="Demo AI review" tone="butter" /></View>
        <Card style={styles.card}>
          {journey.review.map((item) => (
            <View key={item.label} style={styles.checkRow}>
              <Icon name={item.passed ? "check-circle" : "x-circle"} size={space.md} color={item.passed ? colors.status.verified.fg : colors.feedback.error.fg} />
              <View style={styles.flex}>
                <Text variant="small">{item.label}</Text>
                {"note" in item ? <Text variant="caption" color="secondary">{item.note}</Text> : null}
              </View>
            </View>
          ))}
          <Text variant="caption" color="secondary">This example uses static rubric feedback. No AI model was called. The mentor decides the rating.</Text>
        </Card>
        <Button label="See sample verification result" block onPress={() => router.push({ pathname: "/projects/verified/[id]", params: { id } })} />
        <Button label="Update my hand-in" variant="secondary" block onPress={() => router.push({ pathname: "/projects/hand-in/[id]", params: { id } })} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: layout.gutter, gap: gap.loose },
  card: { gap: space.md },
  stage: { flexDirection: "row", alignItems: "center", gap: space.sm },
  checkRow: { flexDirection: "row", alignItems: "flex-start", gap: space.sm },
  flex: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: space.sm },
});
