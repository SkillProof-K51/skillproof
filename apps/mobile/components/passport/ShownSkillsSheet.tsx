import { space } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

import type { PassportSkill } from "../../lib/passport";
import { BottomSheet, Button, Checkbox, Text } from "../ui";

type Props = {
  visible: boolean;
  skills: PassportSkill[];
  /** The skills ticked right now — a draft the screen keeps until Save. */
  value: string[];
  onChange: (shown: string[]) => void;
  onSave: () => void;
  onClose: () => void;
};

/** Pick the skills on the public passport: one tick box per skill, then Save. A controlled sheet. */
export function ShownSkillsSheet({ visible, skills, value, onChange, onSave, onClose }: Props) {
  const toggle = (skill: string) => onChange(value.includes(skill) ? value.filter((s) => s !== skill) : [...value, skill]);
  return (
    <BottomSheet visible={visible} onClose={onClose} title="Skills on your public passport">
      <Text variant="small" color="secondary">
        Employers with your link see these skills and the evidence behind them.
      </Text>
      <View style={styles.list}>
        {skills.map((s) => (
          <Checkbox
            key={s.skill}
            checked={value.includes(s.skill)}
            onChange={() => toggle(s.skill)}
            label={s.skill}
            description={s.status === "verified" ? "Verified by a mentor" : "Practised in challenges"}
          />
        ))}
      </View>
      <View style={styles.actions}>
        <Button label="Save" block onPress={onSave} />
        <Button label="Cancel" variant="secondary" block onPress={onClose} />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  list: { gap: space.lg, marginTop: space.sm },
  actions: { gap: space.sm, marginTop: space.lg },
});
