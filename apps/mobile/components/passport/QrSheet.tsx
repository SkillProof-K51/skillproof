import { space } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

import { BottomSheet, Button, QrCode, Text } from "../ui";

const QR = 240; // big enough to scan from another phone at arm's length

type Props = {
  visible: boolean;
  onClose: () => void;
  name: string;
  /** The public link, without https:// (the code itself opens the full URL). */
  link: string;
};

/**
 * The passport's QR code, for showing face to face — a career fair, an interview (Azim's
 * addition, 19 Oct). A scan opens the public passport: only reachable while it is public.
 */
export function QrSheet({ visible, onClose, name, link }: Props) {
  return (
    <BottomSheet visible={visible} onClose={onClose} title="Your passport QR code">
      <Text variant="small" color="secondary">
        Anyone who scans it opens your public passport, with the skills you show.
      </Text>
      <View style={styles.card} accessibilityLabel={`QR code for ${name}'s passport, ${link}`}>
        <QrCode value={`https://${link}`} size={QR} accessibilityLabel={`QR code for ${link}`} />
        <Text variant="heading" align="center">
          {name}
        </Text>
        <Text variant="small" color="secondary" align="center" selectable>
          {link}
        </Text>
      </View>
      <Button label="Done" variant="secondary" block onPress={onClose} />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: "center", gap: space.xs, paddingVertical: space.lg },
});
