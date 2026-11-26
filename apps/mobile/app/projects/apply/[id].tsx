import { gap, layout, space } from "@skillproof/tokens";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { Button, Card, Checkbox, EmptyState, Hero, Screen, Text, TextField, TopBar, useToast } from "../../../components/ui";
import { applyToProject, getProject } from "../../../lib/projects";
import { wordCount } from "../../../lib/project-journey";

const MAX_NOTE_WORDS = 60;

/** Demo-only application form, following the supplied passport and consent design. */
export default function ApplyProjectScreen() {
  const router = useRouter();
  const toast = useToast();
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const project = getProject(id);
  const [note, setNote] = useState("I'd like to build a booking form that a real café could use, and get feedback on my React.");
  const [share, setShare] = useState(false);
  const noteWords = wordCount(note);
  const back = () => router.back();

  if (!project || project.lockedBy) return <Screen aboveTabBar={false}><Hero><TopBar title="Apply" onBack={back} /></Hero><View style={styles.content}><Card><EmptyState title="You can't apply yet" body="This project is unavailable or one of its skills still needs practice." action={{ label: "Back to Projects", onPress: () => router.dismissTo("/(tabs)/projects") }} /></Card></View></Screen>;

  const submit = () => {
    try {
      const result = applyToProject(project.id);
      if (!result.submitted) toast({ message: "TEST MODE: no application was sent or saved.", tone: "info" });
    } catch (error) {
      toast({ message: error instanceof Error ? error.message : "This demo application could not continue.", tone: "error" });
    }
  };

  return (
    <Screen aboveTabBar={false} footer={<View style={styles.footer}><Button label="Send application" block disabled={!share || noteWords > MAX_NOTE_WORDS} onPress={submit} /></View>}>
      <Hero><TopBar title="Apply" subtitle={project.title} onBack={back} /></Hero>
      <View style={styles.content}>
        <Text variant="small" color="secondary">Your passport goes with it</Text>
        <Card tone="passport" style={styles.passport}>
          <Text variant="subheading" color="inverse">Aina Sofea</Text>
          <Text variant="caption" color="gold">Web Developer path</Text>
          <Text variant="captionStrong" color="inverse">3 Verified · 2 Practised</Text>
          <Text variant="caption" color="gold">Public link · skillproof.test/p/aina-sofea</Text>
        </Card>
        <Card style={styles.card}>
          <Text variant="label">Skills shown</Text>
          <Text variant="small" color="secondary">4 of 5 on your public passport</Text>
        </Card>
        <Text variant="caption" color="secondary">A note for the mentor</Text>
        <Card style={styles.card}>
          <TextField label="Why this project? (optional)" value={note} onChangeText={setNote} multiline numberOfLines={4} helper={`${noteWords} of ${MAX_NOTE_WORDS} words · ${project.mentor} will read it`} />
        </Card>
        <Card>
          <Checkbox checked={share} onChange={setShare} label={`Share my passport with ${project.partner}`} description="Only for this application. You can withdraw it until the mentor accepts." />
        </Card>
        <Text variant="caption" color="secondary">TEST MODE: this sample application is not sent or saved.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: layout.gutter, gap: gap.loose },
  passport: { gap: space.sm },
  card: { gap: space.sm },
  footer: { gap: space.sm },
});
