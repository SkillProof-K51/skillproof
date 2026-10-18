import { gap, space } from "@skillproof/tokens";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { Card, SectionHeader, Text } from "../ui";

type Props = {
  title: string;
  /** The components shown, e.g. "TextField · Checkbox · Switch". */
  components: string;
  children: ReactNode;
};

/** One section of the /kit screen: a header naming the components, then a card of live examples. */
export function KitSection({ title, components, children }: Props) {
  return (
    <View style={styles.section}>
      <SectionHeader title={title} />
      <Text variant="code" color="secondary">
        {components}
      </Text>
      <Card style={styles.card}>{children}</Card>
    </View>
  );
}

/** A caption above one example inside a section card. */
export function KitLabel({ children }: { children: string }) {
  return (
    <Text variant="captionStrong" color="secondary" style={styles.label}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  section: { gap: space.sm },
  card: { gap: gap.loose },
  label: { marginTop: space.xs },
});
