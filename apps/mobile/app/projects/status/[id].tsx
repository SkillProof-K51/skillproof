import { colors, gap, layout, space } from "@skillproof/tokens";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { Button, Card, Chip, EmptyState, Hero, Icon, Screen, Text, TopBar } from "../../../components/ui";
import { getProject } from "../../../lib/projects";
import { getProjectJourney } from "../../../lib/project-journey";

/** Demo application status timeline for the supplied project journey. */
export default function ProjectStatusScreen() {
  const router = useRouter();
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const project = getProject(id);
  const journey = getProjectJourney(id);
  const back = () => router.dismissTo("/(tabs)/projects");

  if (!project || !journey) return <Screen aboveTabBar={false}><Hero><TopBar title="Your project" onBack={back} /></Hero><View style={styles.content}><Card><EmptyState title="No sample application" body="The application timeline is only available for the café project in TEST MODE." action={{ label: "Back to Projects", onPress: back }} /></Card></View></Screen>;

  return (
    <Screen aboveTabBar={false}>
      <Hero><TopBar title="Your project" subtitle={`${project.title} · ${project.partner}`} onBack={back} /></Hero>
      <View style={styles.content}>
        <Card style={styles.card}>
          {journey.stages.slice(0, 2).map((stage, index) => (
            <View key={stage.label} style={styles.stage}>
              <View style={[styles.marker, index < 4 && styles.completed]}>
                <Icon name={index < 4 ? "check" : "clock"} size={space.md} color={index < 4 ? colors.status.verified.fg : colors.icon.default} />
              </View>
              <View style={styles.stageText}>
                <Text variant="bodyStrong">{stage.label}</Text>
                <Text variant="caption" color="secondary">{stage.date}</Text>
              </View>
            </View>
          ))}
        </Card>
        <Chip label="TEST MODE · sample status only" tone="butter" />
        <Button label="Hand in your work" block onPress={() => router.push({ pathname: "/projects/hand-in/[id]", params: { id } })} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: layout.gutter, gap: gap.loose },
  card: { gap: space.lg },
  stage: { flexDirection: "row", alignItems: "center", gap: space.md },
  marker: { width: space.xl, height: space.xl, borderRadius: space.xl, backgroundColor: colors.bg.subtle, alignItems: "center", justifyContent: "center" },
  completed: { backgroundColor: colors.status.verified.bg },
  stageText: { flex: 1, flexDirection: "row", justifyContent: "space-between", gap: space.sm },
});
