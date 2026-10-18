import { gap, layout, space } from "@skillproof/tokens";
import { useRouter } from "expo-router";
import { Fragment } from "react";
import { StyleSheet, View } from "react-native";

import { Button, Card, Divider, Hero, ICON_BADGE_SIZE, IconBadge, ListRow, Screen, Text, type IconName } from "../../components/ui";

const SKY = 340; // taller than a module's sky: on Welcome the mascot is the whole hero
const MASCOT = 170;
const INSET = ICON_BADGE_SIZE + space.md; // dividers line up with the text after the badge

// How SkillProof works, in the order a student lives it — each step in the colour it wears
// everywhere else: blue = Practised (Module 3), green = Verified (Module 4), gold = the passport (Module 5).
const STEPS: { icon: IconName; tone: "blue" | "green" | "gold"; title: string; body: string }[] = [
  { icon: "zap", tone: "blue", title: "Practise", body: "Pass short challenges to make a skill Practised" },
  { icon: "check-circle", tone: "green", title: "Get verified", body: "A mentor reviews your project and verifies the skill" },
  { icon: "id-card", tone: "gold", title: "Share your passport", body: "One link or QR code for employers" },
];

/**
 * Welcome (shared core, reference screen): the first screen a signed-out student sees. The mascot
 * waving in a tall sky, one line on what SkillProof does, the three steps, then one strong button
 * (Get started → sign up) and the way back in (log in).
 */
export default function WelcomeScreen() {
  const router = useRouter();
  return (
    <Screen aboveTabBar={false}>
      <Hero height={SKY} mascot="wave" mascotWidth={MASCOT} mascotAlign="center">
        <Text variant="heading" align="center">
          SkillProof
        </Text>
      </Hero>

      <View style={styles.content}>
        <Text variant="title" accessibilityRole="header">
          Turn practice into proof
        </Text>
        <Card style={styles.list}>
          {STEPS.map((s, i) => (
            <Fragment key={s.title}>
              {i ? <Divider inset={INSET} /> : null}
              <ListRow title={s.title} subtitle={s.body} leading={<IconBadge icon={s.icon} tone={s.tone} />} />
            </Fragment>
          ))}
        </Card>
        <View style={styles.actions}>
          <Button label="Get started" block onPress={() => router.push("/sign-up")} />
          <Button label="I have an account" variant="secondary" block onPress={() => router.push("/log-in")} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: layout.gutter, gap: gap.loose },
  list: { paddingVertical: space.xs },
  actions: { gap: space.sm, marginTop: space.xs },
});
