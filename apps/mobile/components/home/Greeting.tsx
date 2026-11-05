import { space } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

import { Avatar, Mascot, SpeechBubble, Text } from "../ui";

type Props = {
  /** "Good afternoon, Aina!" */
  hello: string;
  /** What Gem adds — `mascotLine()` in lib/home.ts. */
  line: string;
  initials: string;
};

/**
 * Home's header (Azim, 29 Oct: "one voice"): Gem says the hello and one line about where the
 * student stands, in a bubble pointing back at it, so the screen greets once. The avatar sits right.
 */
export function Greeting({ hello, line, initials }: Props) {
  return (
    <View style={styles.row}>
      <Mascot />
      <SpeechBubble style={styles.bubble}>
        <Text variant="heading" accessibilityRole="header">
          {hello}
        </Text>
        <Text variant="small" color="secondary">
          {line}
        </Text>
      </SpeechBubble>
      <View style={styles.avatar}>
        <Avatar initials={initials} tone="surface" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: space.sm },
  bubble: { flex: 1 },
  avatar: { alignSelf: "flex-start" },
});
