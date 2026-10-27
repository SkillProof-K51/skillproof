import { useState } from "react";

import { Checkbox, OptionList, Switch, TextField } from "../ui";
import { KitLabel, KitSection } from "./KitSection";

/** Forms: every state of TextField, Checkbox and Switch, live. */
export function FormsDemo() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(true);
  const [remind, setRemind] = useState(false);
  const [visible, setVisible] = useState(true);
  const [aim, setAim] = useState("internship");
  const [used, setUsed] = useState(["HTML and CSS"]);
  return (
    <KitSection title="Forms" components="TextField · Checkbox · Switch · OptionList">
      <TextField
        label="Student email"
        icon="mail"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        helper="Your UTeM student address"
      />
      <TextField label="Password" icon="lock" secure placeholder="At least 8 characters" value={password} onChangeText={setPassword} />
      <TextField label="Matric number" value="B0325" editable={false} error="Enter all 10 characters, e.g. B032510042" onChangeText={() => {}} />
      <TextField label="Faculty" value="FTMK" editable={false} helper="From your student record — can't be edited" onChangeText={() => {}} />
      <KitLabel>Checkbox</KitLabel>
      <Checkbox checked={agree} onChange={setAgree} label="I agree to the student terms" description="Your passport is private until you share it" />
      <Checkbox checked={remind} onChange={setRemind} label="Remind me about today's challenge" />
      <Checkbox checked onChange={() => {}} label="Can't change this one" disabled />
      <KitLabel>Switch</KitLabel>
      <Switch value={visible} onValueChange={setVisible} label="Show Node.js on my public passport" description="Employers with your link can see it" />
      <Switch value={false} onValueChange={() => {}} label="Off and disabled" disabled />
      <KitLabel>OptionList · one question per screen (onboarding): one choice, or several with multiple</KitLabel>
      <OptionList
        accessibilityLabel="Aim"
        options={[
          { value: "internship", label: "An internship", description: "For my industrial training" },
          { value: "first_job", label: "My first job", description: "After I graduate" },
        ]}
        value={aim}
        onChange={setAim}
      />
      <OptionList
        multiple
        accessibilityLabel="Skills used"
        options={[
          { value: "HTML and CSS", label: "HTML and CSS" },
          { value: "Git", label: "Git" },
        ]}
        value={used}
        onChange={setUsed}
      />
    </KitSection>
  );
}
