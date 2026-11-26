import { colors, gap, layout, space } from "@skillproof/tokens";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Fragment } from "react";
import { StyleSheet, View } from "react-native";

import { Button, Card, Chip, Divider, EmptyState, Hero, Icon, ListRow, Screen, SkillLogo, StatusBadge, Text, TopBar } from "../../components/ui";
import { getProject } from "../../lib/projects";

const DIVIDER_INSET = space.xl;
const PROJECT_ICON_SIZE = space.xl * 3;

/** M4 project detail: fit, skills, mentor, deliverables and rubric, with Apply pinned below. */
export default function ProjectDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const project = id ? getProject(id) : null;
  const back = () => router.dismissTo("/(tabs)/projects");

  if (!project) return <MissingProject onBack={back} />;

  const locked = !!project.lockedBy;
  const apply = () => router.push({ pathname: "/projects/apply/[id]", params: { id: project.id } });
  const practise = () => router.navigate("/(tabs)/challenges");

  return (
    <Screen
      aboveTabBar={false}
      tint={colors.status.practised.bg}
      footer={<View style={styles.footer}>
        {locked ? <Text variant="small" color="secondary" align="center">Practise {project.requiredSkills.filter((skill) => skill.status === "not_yet").map((skill) => skill.name).join(", ")} to unlock Apply.</Text> : null}
        <Button label={locked ? "Practise required skills" : "Apply with my passport"} disabled={locked} block onPress={locked ? practise : apply} />
      </View>}
    >
      <Hero>
        <TopBar title="Micro-project" subtitle={`${project.partner} · ${project.duration}`} onBack={back} />
      </Hero>
      <View style={styles.content}>
        <Card style={styles.projectCard}>
          <View style={styles.projectIcon}><Icon name="briefcase" size={28} color={colors.accent.brand} /></View>
          <Text variant="heading">{project.title}</Text>
          <Text variant="body" color="secondary">{project.summary}</Text>
          <View style={styles.meta}>
            <Chip label={`${project.placesLeft ?? 2} places left`} tone="practised" />
            <Chip label={project.duration} tone="neutral" icon="clock" />
          </View>
        </Card>

        <Card style={styles.card}>
          <View style={styles.row}>
            <Text variant="subheading" style={styles.flex}>Why it fits you</Text>
            <Chip label={`Fit ${project.fitPercent}%`} tone="verified" />
          </View>
          <Text variant="small" color="secondary">It checks the skills you&apos;re strongest in on your roadmap, and it&apos;s short enough for a semester.</Text>
          <Text variant="caption" color="secondary">Fit comes from your skills, role and aim.</Text>
        </Card>

        <Card style={styles.card}>
          <Text variant="label" color="secondary">Skills it verifies</Text>
          {project.requiredSkills.map((skill, index) => (
            <Fragment key={skill.id}>
              {index ? <Divider inset={DIVIDER_INSET} /> : null}
              <ListRow title={skill.name} subtitle={skill.status === "verified" ? "Already verified · more evidence" : skill.status === "practised" ? "Practised when you pass" : "Practise this skill to unlock Apply"} leading={<SkillLogo skill={skill.name} />} trailing={<StatusBadge status={skill.status} />} onPress={skill.status === "not_yet" ? practise : undefined} />
            </Fragment>
          ))}
        </Card>

        <Card style={styles.card}>
          <Text variant="label" color="secondary">Your mentor</Text>
          <View style={styles.row}>
            <View style={styles.avatar}><Text variant="captionStrong">KA</Text></View>
            <View style={styles.flex}>
              <Text variant="bodyStrong">{project.mentor}</Text>
              <Text variant="caption" color="secondary">Senior front-end developer · {project.partner}</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.card}>
          <Text variant="label" color="secondary">What you hand in</Text>
          {project.deliverables.map((item, index) => <Text key={item} variant="small">✓  {item}</Text>)}
        </Card>

        <Card style={styles.card}>
          <Text variant="label" color="secondary">How it&apos;s rated</Text>
          {project.rubric.map((item, index) => (
            <View key={item} style={styles.rubricRow}>
              <Text variant="caption" color="secondary">{index + 1}</Text>
              <Text variant="small" style={styles.flex}>{item}</Text>
            </View>
          ))}
          <Text variant="caption" color="secondary">Your mentor rates each of 5 items. A score of 3 or more verifies the skill.</Text>
        </Card>
      </View>
    </Screen>
  );
}

function MissingProject({ onBack }: { onBack: () => void }) {
  return <Screen aboveTabBar={false}><Hero><TopBar title="Project" onBack={onBack} /></Hero><View style={styles.content}><Card><EmptyState title="This project isn't available" body="It may have closed. Return to Projects to see the current list." action={{ label: "Back to Projects", onPress: onBack }} /></Card></View></Screen>;
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: layout.gutter, gap: gap.loose },
  projectCard: { alignItems: "flex-start", gap: space.md },
  projectIcon: { alignItems: "center", justifyContent: "center", width: PROJECT_ICON_SIZE, height: PROJECT_ICON_SIZE, borderRadius: PROJECT_ICON_SIZE, backgroundColor: colors.bg.surface, alignSelf: "center" },
  card: { gap: space.md },
  meta: { flexDirection: "row", flexWrap: "wrap", gap: space.sm },
  row: { flexDirection: "row", alignItems: "center", gap: space.sm },
  flex: { flex: 1 },
  avatar: { width: space.xl, height: space.xl, borderRadius: space.xl, backgroundColor: colors.accent.progress, alignItems: "center", justifyContent: "center" },
  rubricRow: { flexDirection: "row", gap: space.sm },
  footer: { gap: space.sm },
});
