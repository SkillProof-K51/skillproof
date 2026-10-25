import { colors, opacity, radius, space } from "@skillproof/tokens";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Icon } from "./Icon";
import { Text } from "./Text";

const BORDER = 2; // always there (white when idle), so picking a row never shifts the layout
const MARK = 22; // the radio circle / tick box at the end of a row
const TICK = 14;

export type Option = {
  value: string;
  label: string;
  description?: string;
  /** In front of the label: an <IconBadge> or a <SkillLogo>. */
  leading?: ReactNode;
};

type Props = { options: Option[]; accessibilityLabel: string } & (
  | { multiple?: false; value?: string; onChange: (value: string) => void }
  | { multiple: true; value: string[]; onChange: (value: string[]) => void }
);

/**
 * Answers as big white rows, one tap each (onboarding questions, Azim's theme mockup 24 Oct).
 * A picked row wears the role tint with a purple edge and a filled mark. One choice by default;
 * `multiple` turns the marks into tick boxes. For a choice inside a longer form, use <Select>.
 */
export function OptionList(props: Props) {
  const { options, accessibilityLabel } = props;
  const isOn = (v: string) => (props.multiple ? props.value.includes(v) : props.value === v);
  const toggle = (v: string) => {
    if (props.multiple) props.onChange(isOn(v) ? props.value.filter((x) => x !== v) : [...props.value, v]);
    else props.onChange(v);
  };
  return (
    <View style={styles.list} accessibilityRole={props.multiple ? undefined : "radiogroup"} accessibilityLabel={accessibilityLabel}>
      {options.map((o) => {
        const on = isOn(o.value);
        return (
          <Pressable
            key={o.value}
            onPress={() => toggle(o.value)}
            accessibilityRole={props.multiple ? "checkbox" : "radio"}
            accessibilityState={{ checked: on }}
            accessibilityLabel={o.description ? `${o.label}. ${o.description}` : o.label}
            style={({ pressed }) => [styles.row, on && styles.on, pressed && styles.pressed]}
          >
            {o.leading}
            <View style={styles.text}>
              <Text variant="subheading">{o.label}</Text>
              {o.description ? (
                <Text variant="small" color="secondary">
                  {o.description}
                </Text>
              ) : null}
            </View>
            <View style={[styles.mark, props.multiple ? styles.box : styles.circle, on && styles.markOn]}>
              {on ? <Icon name="check" weight="bold" size={TICK} color={colors.text.inverse} /> : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: space.sm },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: BORDER,
    borderColor: colors.bg.surface,
    backgroundColor: colors.bg.surface,
  },
  on: { backgroundColor: colors.accent.skySoft, borderColor: colors.accent.brand },
  pressed: { opacity: opacity.pressed },
  text: { flex: 1, gap: space.xxs },
  mark: { width: MARK, height: MARK, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg.subtle },
  circle: { borderRadius: radius.full },
  box: { borderRadius: radius.control },
  markOn: { backgroundColor: colors.accent.brand },
});
