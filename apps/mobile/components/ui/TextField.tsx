import { colors, type } from "@skillproof/tokens";
import { useState } from "react";
import { Pressable, StyleSheet, TextInput, type TextInputProps } from "react-native";

import { FieldFrame } from "./Field";
import { fontFamilyFor } from "./fonts";
import { Icon, type IconName } from "./Icon";

const ICON = 20;

type Props = Omit<TextInputProps, "style" | "secureTextEntry" | "placeholderTextColor"> & {
  label: string;
  /** A short hint under the field. */
  helper?: string;
  /** Replaces the helper and turns the field red. Say what to do, not just what's wrong. */
  error?: string;
  /** Password field: hidden by default, with an eye to show it. */
  secure?: boolean;
  /** Leading glyph inside the field. */
  icon?: IconName;
};

/**
 * The one text input (rule 3: shared form components). Label above, helper or error below;
 * brand-blue border while focused, red with an error. Pass any TextInput prop
 * (keyboardType, autoCapitalize, autoComplete…). For a choice from a list, use <Select>.
 */
export function TextField({ label, helper, error, secure, icon, editable = true, ...input }: Props) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secure);
  return (
    <FieldFrame label={label} helper={helper} error={error} focused={focused} disabled={!editable}>
      {icon ? <Icon name={icon} size={ICON} color={focused ? colors.accent.brand : colors.icon.default} /> : null}
      <TextInput
        {...input}
        editable={editable}
        secureTextEntry={hidden}
        placeholderTextColor={colors.text.secondary}
        accessibilityLabel={input.accessibilityLabel ?? label}
        onFocus={(e) => {
          setFocused(true);
          input.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          input.onBlur?.(e);
        }}
        style={styles.input}
      />
      {secure ? (
        <Pressable onPress={() => setHidden((h) => !h)} hitSlop={8} accessibilityRole="button" accessibilityLabel={hidden ? "Show password" : "Hide password"}>
          <Icon name={hidden ? "eye" : "eye-off"} size={ICON} />
        </Pressable>
      ) : null}
    </FieldFrame>
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    // the input sets its own font: it is not a <Text>
    fontFamily: fontFamilyFor(type.body.family, type.body.weight),
    fontSize: type.body.size,
    color: colors.text.primary,
    paddingVertical: 0,
    // web: the box draws the focus ring, not the browser (Android Chrome's is orange). RN's type
    // only lists solid/dotted/dashed; the web renderer passes "none" through as CSS.
    outlineStyle: "none" as unknown as "solid",
  },
});
