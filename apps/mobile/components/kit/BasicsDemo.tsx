import * as tokens from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

import { Button, Card, Text } from "../ui";
import { KitLabel, KitSection } from "./KitSection";

const VARIANTS = Object.keys(tokens.type) as (keyof typeof tokens.type)[];

/** Text, Button and Card — every variant. */
export function BasicsDemo() {
  return (
    <KitSection title="Basics" components="Text · Button · Card">
      <KitLabel>Text · one variant per role; never set a font or size yourself</KitLabel>
      {VARIANTS.map((v) => (
        <View key={v} style={styles.type}>
          <Text variant="code" color="secondary" style={styles.name}>
            {v}
          </Text>
          <Text variant={v} numberOfLines={1} style={styles.sample}>
            {v === "code" ? "const ready = 72;" : tokens.type[v].size >= tokens.type.title.size ? "72% ready" : "Skill verified, not just claimed"}
          </Text>
        </View>
      ))}
      <KitLabel>Button · one primary per screen; secondary for the rest; danger = can’t be undone</KitLabel>
      <View style={styles.row}>
        <Button label="Start challenge" icon="play" onPress={() => {}} />
        <Button label="View project" variant="secondary" onPress={() => {}} />
      </View>
      <View style={styles.row}>
        <Button label="Remove" variant="danger" onPress={() => {}} />
        <Button label="Disabled" onPress={() => {}} disabled />
        <Button label="Disabled" variant="secondary" onPress={() => {}} disabled />
      </View>
      <Button label="Block · full width (cards, sheets)" block onPress={() => {}} />
      <KitLabel>Card · flat, no decoration; tone = meaning</KitLabel>
      <Card tone="surface" style={styles.card}>
        <Text variant="heading">surface</Text>
        <Text variant="small" color="secondary">
          The default: lists, settings, anything neutral.
        </Text>
      </Card>
      <Card tone="butter" style={styles.card}>
        <Text variant="heading">butter</Text>
        <Text variant="small" color="secondary">
          Energy: today’s challenge only.
        </Text>
      </Card>
      <Card tone="blue" style={styles.card}>
        <Text variant="heading">blue</Text>
        <Text variant="small" color="secondary">
          A featured project (blue = in progress).
        </Text>
      </Card>
      <Card tone="passport" style={styles.card}>
        <Text variant="heading" color="inverse">
          passport
        </Text>
        <Text variant="small" color="gold">
          Your credential. Gold goes nowhere else.
        </Text>
      </Card>
    </KitSection>
  );
}

const NAME_WIDTH = 104; // the variant-name column

const styles = StyleSheet.create({
  type: { flexDirection: "row", alignItems: "baseline", gap: tokens.space.md },
  name: { width: NAME_WIDTH },
  sample: { flex: 1 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: tokens.space.sm },
  card: { gap: tokens.space.xxs },
});
