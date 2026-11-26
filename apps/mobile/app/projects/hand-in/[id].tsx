import { gap, layout, space } from "@skillproof/tokens";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { Button, Card, Checkbox, EmptyState, Hero, Screen, Text, TextField, TopBar, useToast } from "../../../components/ui";
import { getProject } from "../../../lib/projects";
import { getProjectJourney, recordDemoProjectStep, wordCount } from "../../../lib/project-journey";

const CHECK_ITEMS = ["Works on a phone and a laptop", "Clean, readable components", "The booking form checks its fields", "This is my own work"];
const MAX_REFLECTION_WORDS = 150;

/** Demo-only hand-in form; no artifact is uploaded or stored. */
export default function ProjectHandInScreen() {
  const router = useRouter();
  const toast = useToast();
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const project = getProject(id);
  const journey = getProjectJourney(id);
  const [link, setLink] = useState("https://aina-sofea.github.io/cafe-sinar");
  const [reflection, setReflection] = useState("I built the café's page in React with a menu, opening hours and a booking form. The hardest part was the form: it now checks the date, time and number of people before it sends. I tested it on my phone and laptop.");
  const [checks, setChecks] = useState(CHECK_ITEMS.map(() => true));
  const reflectionWords = wordCount(reflection);
  const back = () => router.back();

  if (!project || !journey) return <Screen aboveTabBar={false}><Hero><TopBar title="Hand in" onBack={back} /></Hero><View style={styles.content}><Card><EmptyState title="No sample hand-in" body="This hand-in preview is only available for the café project in TEST MODE." action={{ label: "Back to Projects", onPress: () => router.dismissTo("/(tabs)/projects") }} /></Card></View></Screen>;

  const submit = () => {
    try {
      recordDemoProjectStep(id);
      router.push({ pathname: "/projects/review/[id]", params: { id } });
    } catch (error) {
      toast({ message: error instanceof Error ? error.message : "This demo hand-in could not continue.", tone: "error" });
    }
  };

  return (
    <Screen aboveTabBar={false} footer={<View style={styles.footer}><Button label="Hand in for review" block onPress={submit} /></View>}>
      <Hero><TopBar title="Hand in" subtitle={`${project.title} · due Fri 13 Nov`} onBack={back} /></Hero>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Text variant="label">Link to your work</Text>
          <TextField label="Live link or repository" value={link} onChangeText={setLink} autoCapitalize="none" keyboardType="url" helper="A live site or a public GitHub repo" />
          <TextField label="Reflection" value={reflection} onChangeText={setReflection} multiline numberOfLines={6} helper={`${reflectionWords} of ${MAX_REFLECTION_WORDS} words · what you built, what was hard, what you&apos;d change`} />
        </Card>
        <Card style={styles.card}>
          <Text variant="label">Before you hand in</Text>
          {CHECK_ITEMS.map((label, index) => <Checkbox key={label} checked={checks[index]} onChange={(checked) => setChecks((current) => current.map((item, itemIndex) => itemIndex === index ? checked : item))} label={label} />)}
        </Card>
        <Text variant="caption" color="secondary">TEST MODE: this hand-in is not uploaded, saved, or reviewed by AI.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: layout.gutter, gap: gap.loose },
  card: { gap: space.md },
  footer: { gap: space.sm },
});
