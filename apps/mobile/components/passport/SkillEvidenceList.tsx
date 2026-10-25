import { space } from "@skillproof/tokens";
import { Fragment } from "react";
import { StyleSheet, View } from "react-native";

import { evidenceLabel, type PassportSkill } from "../../lib/passport";
import { Card, Chip, Divider, ListRow, SkillLogo } from "../ui";

const LOGO = 24;
const SLOT = LOGO * 2 + space.xxs; // room for a combined skill's two logos, so every row's text lines up
const INSET = SLOT + space.md; // dividers line up with the text

type Props = { skills: PassportSkill[] };

/**
 * Skills on the passport with the evidence behind each (the section header says Verified or
 * Practised). A skill the student hides from the public passport carries a "Hidden" chip.
 */
export function SkillEvidenceList({ skills }: Props) {
  return (
    <Card style={styles.list}>
      {skills.map((s, i) => {
        const evidence = evidenceLabel(s.evidence);
        return (
          <Fragment key={s.skill}>
            {i ? <Divider inset={INSET} /> : null}
            <ListRow
              title={s.skill}
              subtitle={evidence}
              leading={
                <View style={styles.slot}>
                  <SkillLogo skill={s.skill} size={LOGO} />
                </View>
              }
              trailing={s.shown ? undefined : <Chip label="Hidden" icon="eye-off" />}
              accessibilityLabel={`${s.skill}, ${s.status === "verified" ? "Verified" : "Practised"}. ${evidence}.${s.shown ? "" : " Hidden from your public passport."}`}
            />
          </Fragment>
        );
      })}
    </Card>
  );
}

const styles = StyleSheet.create({
  list: { paddingVertical: space.xs },
  slot: { width: SLOT, alignItems: "center" },
});
