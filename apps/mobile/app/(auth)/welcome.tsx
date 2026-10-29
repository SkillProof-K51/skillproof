import { gap, layout, space } from "@skillproof/tokens";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { Button, Hero, Logo, Screen, Text } from "../../components/ui";

const SCENE = require("../../assets/scenes/campus-garden.jpg");

/**
 * Welcome (shared core, reference screen): screen 1 of 12 — the first thing a signed-out student
 * sees. Home's garden scene with the logo on it, what SkillProof does in one line, then one strong
 * button into onboarding and the way back in (log in). The redesign's onboarding tells the rest.
 */
export default function WelcomeScreen() {
  const router = useRouter();
  return (
    <Screen aboveTabBar={false}>
      <Hero scene={SCENE}>
        <Logo />
      </Hero>

      <View style={styles.content}>
        <View style={styles.words}>
          <Text variant="headline" align="center" accessibilityRole="header">
            Turn practice into proof
          </Text>
          <Text variant="body" color="secondary" align="center">
            Short challenges and real projects make your tech skills Verified, in a passport you can share with employers.
          </Text>
        </View>
        <View style={styles.actions}>
          <Button label="Get started" block onPress={() => router.push("/onboarding")} />
          <Button label="I have an account" variant="secondary" block onPress={() => router.push("/log-in")} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  // the scene's overlap pulls this up over the ground; the panel starts on the page colour
  content: { paddingHorizontal: layout.gutter, paddingTop: layout.sceneOverlap + space.lg, gap: gap.loose },
  words: { gap: space.sm, paddingHorizontal: space.sm, marginBottom: space.lg },
  actions: { gap: space.sm },
});
