import { space } from "@skillproof/tokens";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { BottomSheet, Button, Checkbox, Dialog, Divider, EmptyState, ListRow, Select, useToast } from "../ui";
import { KitLabel, KitSection } from "./KitSection";

type Role = "web" | "data" | "mobile" | "qa";
const ROLES = [
  { value: "web", label: "Web Developer", description: "Front end, back end, or both" },
  { value: "data", label: "Data Analyst" },
  { value: "mobile", label: "Mobile Developer" },
  { value: "qa", label: "QA Engineer" },
] satisfies { value: Role; label: string; description?: string }[];
const SKILLS = ["HTML and CSS", "JavaScript", "Node.js", "SQL", "Testing"];

/** Feedback & overlays: Toast, Dialog, BottomSheet, Select, EmptyState — all live. */
export function FeedbackDemo() {
  const toast = useToast();
  const [dialog, setDialog] = useState<"none" | "submit" | "remove">("none");
  const [sheet, setSheet] = useState(false);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [role, setRole] = useState<Role>();
  const [skills, setSkills] = useState<string[]>(["HTML and CSS"]);
  const toggle = (s: string) => setSkills((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));

  return (
    <KitSection title="Feedback & overlays" components="Toast · Dialog · BottomSheet · Select · EmptyState">
      <KitLabel>Toast · success and info leave by themselves; error stays until tapped</KitLabel>
      <View style={styles.row}>
        <Button label="Saved" variant="secondary" onPress={() => toast({ message: "Profile saved", tone: "success" })} />
        <Button label="Error" variant="secondary" onPress={() => toast({ message: "Couldn't save — check your connection and try again", tone: "error" })} />
        <Button label="Info" variant="secondary" onPress={() => toast({ message: "Mentor review usually takes 2 days" })} />
      </View>

      <KitLabel>Dialog · a question, then one or two buttons; danger = can’t be undone</KitLabel>
      <View style={styles.row}>
        <Button label="Submit for review" variant="secondary" onPress={() => setDialog("submit")} />
        <Button label="Remove a skill" variant="secondary" onPress={() => setDialog("remove")} />
      </View>
      <Dialog
        visible={dialog === "submit"}
        title="Submit for mentor review?"
        body="You can resubmit once if the mentor asks for changes."
        confirm={{ label: "Submit", onPress: () => setDialog("none") }}
        cancel={{ label: "Not yet", onPress: () => setDialog("none") }}
        onClose={() => setDialog("none")}
      />
      <Dialog
        visible={dialog === "remove"}
        title="Remove SQL from your profile?"
        body="Its challenge progress stays, but it leaves your passport and roadmap."
        confirm={{ label: "Remove", variant: "danger", onPress: () => setDialog("none") }}
        cancel={{ label: "Keep it", onPress: () => setDialog("none") }}
        onClose={() => setDialog("none")}
      />

      <KitLabel>BottomSheet · options, filters, a short form</KitLabel>
      <Button label="Sort projects" variant="secondary" onPress={() => setSheet(true)} />
      <BottomSheet visible={sheet} onClose={() => setSheet(false)} title="Sort projects by">
        <ListRow title="Best fit first" subtitle="Highest Fit % at the top" onPress={() => setSheet(false)} />
        <Divider />
        <ListRow title="Newest first" onPress={() => setSheet(false)} />
        <Divider />
        <ListRow title="Fewest places left" subtitle="Apply before they fill up" onPress={() => setSheet(false)} />
      </BottomSheet>

      <KitLabel>Select · one choice from a list (opens a sheet)</KitLabel>
      <Select label="Target role" placeholder="Choose a role" options={ROLES} value={role} onChange={setRole} helper="From Module 1's roles — sets your readiness" />
      <Select label="Faculty" options={[{ value: "ftmk", label: "FTMK" }]} value="ftmk" onChange={() => {}} disabled helper="From your student record" />

      <KitLabel>Several choices · Checkbox rows in a BottomSheet (no extra component)</KitLabel>
      <Button label={`Skills you have · ${skills.length}`} variant="secondary" onPress={() => setSkillsOpen(true)} />
      <BottomSheet visible={skillsOpen} onClose={() => setSkillsOpen(false)} title="Skills you have">
        {SKILLS.map((s) => (
          <Checkbox key={s} checked={skills.includes(s)} onChange={() => toggle(s)} label={s} />
        ))}
        <Button label="Done" block onPress={() => setSkillsOpen(false)} style={styles.done} />
      </BottomSheet>

      <KitLabel>EmptyState · nothing yet, and the way forward</KitLabel>
      <EmptyState
        icon="briefcase"
        title="No micro-projects match yet"
        body="Projects unlock when the skills they need are Practised. Pass a few challenges and check back."
        action={{ label: "Practise a skill", onPress: () => {} }}
      />
    </KitSection>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap", gap: space.sm },
  done: { marginTop: space.md },
});
