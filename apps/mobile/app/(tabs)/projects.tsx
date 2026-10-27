import { gap, layout, space } from "@skillproof/tokens";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { Button, Card, Hero, Screen, Text } from "../../components/ui";

/** Module 4 warm-up landing screen, composed from the shared UI kit. */
export default function ProjectsScreen() {
  const router = useRouter();

  return (
    <Screen>
      <Hero>
        <View style={styles.heading}>
          <Text variant="title">Projects</Text>
          <Text variant="small" color="secondary">Module 4 - Fiona</Text>
        </View>
      </Hero>

      <View style={styles.content}>
        <Card>
          <Text variant="heading">Micro-projects</Text>
          <Text variant="small" color="secondary" style={styles.body}>
            Mentor-led projects let students show their skills and receive feedback. This is the Module 4 warm-up screen.
          </Text>
          {__DEV__ ? (
            <Button label="Open the UI kit" variant="secondary" block onPress={() => router.push("/kit")} style={styles.kit} />
          ) : null}
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
