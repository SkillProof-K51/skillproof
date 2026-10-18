import { colors } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

type Props = {
  /** Start this far from the left, e.g. to line up with the text after a ListRow's leading badge. */
  inset?: number;
};

/** A hairline between rows or blocks inside a card. */
export function Divider({ inset = 0 }: Props) {
  return <View style={[styles.line, { marginLeft: inset }]} accessible={false} />;
}

const styles = StyleSheet.create({
  line: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border.default, alignSelf: "stretch" },
});
