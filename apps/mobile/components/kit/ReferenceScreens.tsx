import { space } from "@skillproof/tokens";
import { useRouter, type Href } from "expo-router";
import { Fragment } from "react";
import { StyleSheet, View } from "react-native";

import { Card, Divider, ICON_BADGE_SIZE, IconBadge, ListRow, SectionHeader, Text, type IconName } from "../ui";

const INSET = ICON_BADGE_SIZE + space.md; // dividers line up with the text after the badge

type Reference = { title: string; subtitle: string; icon: IconName; href: Href };

// One screen per pattern a module copies (docs/ui.md). Open one, read its file, build yours the same way.
const SCREENS: Reference[] = [
  { title: "Challenges", subtitle: "Module home: today’s card, progress, a filtered list", icon: "zap", href: "/challenges" },
  {
    title: "Result: passed, now Practised",
    subtitle: "Celebration with the stamp, then the details",
    icon: "check-circle",
    href: "/challenges/result?id=node-reduce-total&fresh=1",
  },
  { title: "Result: not passed yet", subtitle: "What was missed, a hint, try again", icon: "x-circle", href: "/challenges/result?id=sql-no-orders" },
  { title: "Result: graded by AI", subtitle: "Rubric and AI feedback, labelled as AI", icon: "ai", href: "/challenges/result?id=node-middleware" },
  { title: "Skill Passport", subtitle: "Credential, sharing with consent, QR code, evidence", icon: "id-card", href: "/passport" },
];

/** The top of /kit: the finished reference screens, each one tap away (TEST MODE data). */
export function ReferenceScreens() {
  const router = useRouter();
  return (
    <View style={styles.section}>
      <SectionHeader title="Reference screens" />
      <Text variant="code" color="secondary">
        app/(tabs)/challenges.tsx · app/challenges/result.tsx · app/(tabs)/passport.tsx
      </Text>
      <Card style={styles.list}>
        {SCREENS.map((s, i) => (
          <Fragment key={s.title}>
            {i ? <Divider inset={INSET} /> : null}
            <ListRow title={s.title} subtitle={s.subtitle} leading={<IconBadge icon={s.icon} tone="grey" />} onPress={() => router.push(s.href)} />
          </Fragment>
        ))}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: space.sm },
  list: { paddingVertical: space.xs },
});
