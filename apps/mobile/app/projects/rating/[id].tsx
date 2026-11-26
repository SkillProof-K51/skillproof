import { colors, gap, layout, space } from "@skillproof/tokens";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { Button, Card, Chip, EmptyState, Hero, Icon, Screen, SkillLogo, Text, TopBar } from "../../../components/ui";
import { getProjectJourney } from "../../../lib/project-journey";

/** Sample mentor rating and skill-status summary. The demo does not write to the passport. */
export default function ProjectRatingScreen() {
  const router = useRouter();
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const journey = getProjectJourney(id);
  const back = () => router.dismissTo("/(tabs)/projects");

  if (!journey) return <Screen aboveTabBar={false}><Hero><TopBar title="Rating" onBack={back} /></Hero><View style={styles.content}><Card><EmptyState title="No sample rating" body="This preview is available for the café project in TEST MODE." action={{ label: "Back to Projects", onPress: back }} /></Card></View></Screen>;
  return (
    <Screen aboveTabBar={false}>
      <Hero><TopBar title="Rating" subtitle="Café landing page · sample" onBack={back} /></Hero>
      <View style={styles.content}>
        <Card style={styles.card}>
          <View style={styles.overall}>
            <View><Text variant="caption" color="secondary">Overall</Text><Text variant="display">{journey.verificationScore}<Text variant="bodyStrong" color="secondary"> / 5</Text></Text></View>
            <Chip label={journey.decision === "verified" ? "React Verified" : "Revise"} tone={journey.decision === "verified" ? "verified" : "neutral"} />
          </View>
          {journey.ratings.map((item) => (
            <View key={item.label} style={styles.ratingRow}>
              <Text variant="small" style={styles.flex}>{item.label}</Text>
              <View style={styles.stars} accessibilityLabel={`${item.score} out of 5 stars`}>
                {Array.from({ length: 5 }, (_, index) => <Icon key={index} name="star" size={space.md} weight="fill" color={index < item.score ? colors.accent.butter : colors.icon.muted} />)}
              </View>
            </View>
          ))}
        </Card>

        <Text variant="caption" color="secondary">From your mentor</Text>
        <Card style={styles.card}>
          <View style={styles.mentor}>
            <View style={styles.avatar}><Text variant="captionStrong">KA</Text></View>
            <View style={styles.flex}><Text variant="bodyStrong">{journey.mentor}</Text><Text variant="caption" color="secondary">Senior front-end developer · {journey.company}</Text></View>
          </View>
          <Text variant="small">“{journey.mentorComment}”</Text>
        </Card>

        <Card style={styles.card}>
          <View style={styles.row}><Icon name="check-circle" size={space.md} color={colors.status.verified.fg} /><SkillLogo skill="React" /><Text variant="small" style={styles.flex}>Practised → Verified</Text></View>
          <View style={styles.row}><Icon name="chart" size={space.md} color={colors.icon.default} /><Text variant="small" style={styles.flex}>Readiness for Web Developer</Text><Text variant="captionStrong">{journey.readinessBefore}% → {journey.readinessAfter}%</Text></View>
        </Card>
        <Chip label="TEST MODE · sample rating; passport unchanged" tone="butter" />
        <Button label="Back to Projects" block onPress={back} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: layout.gutter, gap: gap.loose },
  card: { gap: space.md },
  overall: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  ratingRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: space.sm, borderTopWidth: 1, borderColor: colors.border.default, paddingTop: space.sm },
  stars: { flexDirection: "row", gap: space.xxs },
  flex: { flex: 1 },
  mentor: { flexDirection: "row", alignItems: "center", gap: space.sm },
  avatar: { width: space.xl, height: space.xl, borderRadius: space.xl, backgroundColor: colors.accent.progress, alignItems: "center", justifyContent: "center" },
  row: { flexDirection: "row", alignItems: "center", gap: space.sm },
});
