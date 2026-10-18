import { colors } from "@skillproof/tokens";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { BottomSheet } from "./BottomSheet";
import { Divider } from "./Divider";
import { FieldFrame } from "./Field";
import { Icon } from "./Icon";
import { ListRow } from "./ListRow";
import { Text } from "./Text";

const ICON = 20;

export type SelectOption<T extends string> = { value: T; label: string; description?: string };

type Props<T extends string> = {
  label: string;
  placeholder?: string;
  options: SelectOption<T>[];
  value?: T;
  onChange: (value: T) => void;
  helper?: string;
  error?: string;
  disabled?: boolean;
};

/**
 * One choice from a fixed list (target role, faculty, a project's level): looks like a TextField,
 * opens a BottomSheet of options. For several choices, put <Checkbox> rows in a <BottomSheet>.
 */
export function Select<T extends string>({ label, placeholder = "Choose…", options, value, onChange, helper, error, disabled }: Props<T>) {
  const [open, setOpen] = useState(false);
  const chosen = options.find((o) => o.value === value);
  return (
    <>
      <FieldFrame
        label={label}
        helper={helper}
        error={error}
        focused={open}
        disabled={disabled}
        onPress={() => setOpen(true)}
        accessibilityLabel={`${label}: ${chosen?.label ?? "not chosen"}`}
        accessibilityHint="Opens the choices"
      >
        <Text variant="body" color={chosen ? "primary" : "secondary"} numberOfLines={1} style={styles.value}>
          {chosen?.label ?? placeholder}
        </Text>
        <Icon name="chevron-down" size={ICON} color={open ? colors.accent.brand : colors.icon.default} />
      </FieldFrame>
      <BottomSheet visible={open} onClose={() => setOpen(false)} title={label}>
        {options.map((o, i) => (
          <View key={o.value}>
            {i > 0 ? <Divider /> : null}
            <ListRow
              title={o.label}
              subtitle={o.description}
              onPress={() => {
                onChange(o.value);
                setOpen(false);
              }}
              accessibilityLabel={o.value === value ? `${o.label}, chosen` : o.label}
              trailing={o.value === value ? <Icon name="check" size={ICON} weight="bold" color={colors.accent.brand} /> : <View style={styles.spacer} />}
            />
          </View>
        ))}
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  value: { flex: 1 },
  spacer: { width: ICON },
});
