import { gap, layout, space } from "@skillproof/tokens";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { Button, Card, Hero, Screen, Text } from "./ui";
import type { MascotPose } from "./ui";

type Props = {
  title: string;
  module: string;
  owner: string;
  pose: MascotPose;
};

/** Stand-in first screen for a module tab until its owner builds it (weeks 7–11). */
export function ModulePlaceholder({ title, module, owner, pose }: Props) {
  const router = useRouter();
  return (
    <Screen>
      <Hero mascot={pose}>
        <View style={styles.heading}>
          <Text variant="title">{title}</Text>
          <Text variant="small" color="secondary">
            {module} · {owner}
          </Text>
        </View>
      </Hero>
      <View style={styles.content}>
        <Card>
          <Text variant="heading">Coming in weeks 7–11</Text>
          <Text variant="small" color="secondary" style={styles.body}>
            {owner} builds the screens for this module with the components in components/ui (see docs/ui.md).
          </Text>
          {/* dev builds only: the live kit, so a phone can open it without typing a URL */}
          {__DEV__ ? <Button label="Open the UI kit" variant="secondary" block onPress={() => router.push("/kit")} style={styles.kit} /> : null}
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: space.xxs },
  content: { paddingHorizontal: layout.gutter, gap: gap.loose },
  body: { marginTop: space.xs },
  kit: { marginTop: space.lg },
});
