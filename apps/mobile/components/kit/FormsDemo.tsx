import { useState } from "react";

import { Checkbox, Switch, TextField } from "../ui";
import { KitLabel, KitSection } from "./KitSection";

/** Forms: every state of TextField, Checkbox and Switch, live. */
export function FormsDemo() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(true);
  const [remind, setRemind] = useState(false);
  const [visible, setVisible] = useState(true);
  return (
    <KitSection title="Forms" components="TextField · Checkbox · Switch">
      <TextField
        label="Student email"
        icon="mail"
        placeholder="you@student.utem.edu.my"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        helper="Your UTeM student address"
      />
      <TextField label="Password" icon="lock" secure placeholder="At least 8 characters" value={password} onChangeText={setPassword} />
      <TextField label="Matric number" value="B0325" editable={false} error="Enter all 10 characters, e.g. B032520033" onChangeText={() => {}} />
      <TextField label="Faculty" value="FTMK" editable={false} helper="From your student record — can't be edited" onChangeText={() => {}} />
      <KitLabel>Checkbox</KitLabel>
      <Checkbox checked={agree} onChange={setAgree} label="I agree to the student terms" description="Your passport is private until you share it" />
      <Checkbox checked={remind} onChange={setRemind} label="Remind me about today's challenge" />
      <Checkbox checked onChange={() => {}} label="Can't change this one" disabled />
      <KitLabel>Switch</KitLabel>
      <Switch value={visible} onValueChange={setVisible} label="Show Node.js on my public passport" description="Employers with your link can see it" />
      <Switch value={false} onValueChange={() => {}} label="Off and disabled" disabled />
    </KitSection>
  );
}
