import { gap, layout, space } from "@skillproof/tokens";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { ModulePlaceholder } from "../../components/ModulePlaceholder";
import { ProjectCard } from "../../components/home/ProjectCard";
import { Button, Card, Chip, Hero, Screen, SegmentedControl, Text } from "../../components/ui";
import { getProjects } from "../../lib/projects";

/** Module 4's TEST MODE project list, with filters for matches, applications and completed work. */
export default function ProjectsScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<"for-you" | "applied" | "done">("for-you");
  const projects = getProjects();

  if (!projects) return <ModulePlaceholder title="Projects" module="Module 4" owner="Fiona" />;

  const openProjects = projects.filter((project) => !project.lockedBy);
  const lockedProjects = projects.filter((project) => project.lockedBy);
  const openProject = (id: string) => router.push({ pathname: "/projects/[id]", params: { id } });
  const practise = () => router.navigate("/(tabs)/challenges");

  return (
    <Screen>
      <Hero>
        <View style={styles.heading}>
          <Text variant="title">Projects</Text>
          <Text variant="small" color="secondary">Real briefs from companies. A mentor&apos;s rating makes a skill Verified.</Text>
        </View>
      </Hero>
      <View style={styles.content}>
        <SegmentedControl
          options={[{ value: "for-you", label: "For you" }, { value: "applied", label: "Applied" }, { value: "done", label: "Done" }]}
          value={filter}
          onChange={setFilter}
          accessibilityLabel="Filter projects"
        />
        {filter === "for-you" ? (
          <>
            {openProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} eyebrow={index === 0 ? "Best match" : "Good fit"} onView={() => openProject(project.id)} onPractise={practise} />
            ))}
            {lockedProjects.length ? (
              <>
                <Text variant="sectionLabel" color="secondary">Locked</Text>
                {lockedProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} eyebrow="Locked" onView={() => openProject(project.id)} onPractise={practise} />
                ))}
              </>
            ) : null}
          </>
        ) : filter === "applied" ? (
          <Card style={styles.applicationCard}>
            <View style={styles.row}>
              <View style={styles.grow}>
                <Text variant="sectionLabel" color="practised">Accepted · Sample application</Text>
                <Text variant="heading">Café landing page</Text>
                <Text variant="caption" color="secondary">Contoh Tech · HTML and CSS, React · 2 places left</Text>
              </View>
              <Chip label="Accepted" tone="practised" />
            </View>
            <Button label="View project" variant="secondary" block onPress={() => router.push({ pathname: "/projects/status/[id]", params: { id: "cafe" } })} />
          </Card>
        ) : (
          <Card style={styles.applicationCard}>
            <Text variant="sectionLabel" color="verified">Verified · Sample project</Text>
            <Text variant="heading">Café landing page</Text>
            <Text variant="caption" color="secondary">React · Mentor rating 4 out of 5</Text>
            <Button label="View rating" variant="secondary" block onPress={() => router.push({ pathname: "/projects/rating/[id]", params: { id: "cafe" } })} />
          </Card>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: space.xxs },
  content: { paddingHorizontal: layout.gutter, gap: gap.loose },
  applicationCard: { gap: space.md },
  row: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: space.sm },
  grow: { flex: 1, gap: space.xs },
});
