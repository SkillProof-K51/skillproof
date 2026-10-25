import { space } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

import { Button, Card, Divider, IconBadge, ListRow, Switch } from "../ui";

type Props = {
  isPublic: boolean;
  shownCount: number;
  total: number;
  /** The switch was flipped. Turning it on should ask for consent first (the screen's Dialog). */
  onTogglePublic: (on: boolean) => void;
  onChooseSkills: () => void;
  onShare: () => void;
  /** Opens the QR code sheet (Azim's addition, 19 Oct). */
  onShowQr: () => void;
};

/**
 * Who can see the passport: the public switch; when public, which skills are shown, the screen's
 * one strong button (Share link) and the QR code for face to face. Private = just the switch — it
 * is the way forward.
 */
export function SharingCard({ isPublic, shownCount, total, onTogglePublic, onChooseSkills, onShare, onShowQr }: Props) {
  return (
    <Card style={styles.card}>
      <Switch
        value={isPublic}
        onValueChange={onTogglePublic}
        label="Public passport"
        description={isPublic ? "Anyone with your link sees the skills you show" : "Only you can see it. Turn it on to get a link for employers."}
      />
      {isPublic ? (
        <>
          <Divider />
          <ListRow
            title="Skills shown"
            subtitle={`${shownCount} of ${total} on your public passport`}
            leading={<IconBadge icon="eye" tone="grey" />}
            onPress={onChooseSkills}
          />
          <View style={styles.actions}>
            <Button label="Share link" icon="share" block onPress={onShare} />
            <Button label="Show QR code" icon="qr" variant="secondary" block onPress={onShowQr} />
          </View>
        </>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: space.md },
  actions: { gap: space.sm },
});
