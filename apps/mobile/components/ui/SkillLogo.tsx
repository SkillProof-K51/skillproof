import { colors, space } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { Icon, type IconName } from "./Icon";
import { SKILL_LOGOS, type SkillLogoKey } from "./skillLogos";

// Skill name (lower-case) → its logo, two logos for a combined skill, or an icon for skills that
// aren't a product (Testing, SQL…).
// TODO (shared core, weeks 6–7): move this onto the skills table as a `logo` column so Module 1
// sets it when a skill is added, instead of a list in code.
const BY_SKILL: Record<string, SkillLogoKey | SkillLogoKey[] | { icon: IconName }> = {
  "node.js": "nodedotjs",
  nodejs: "nodedotjs",
  javascript: "javascript",
  typescript: "typescript",
  react: "react",
  html: "html5",
  "html and css": ["html5", "css"],
  css: "css",
  python: "python",
  postgresql: "postgresql",
  mysql: "mysql",
  git: "git",
  sql: { icon: "database" },
  testing: { icon: "test" },
  "data visualisation": { icon: "chart" },
};
const FALLBACK: IconName = "seedling";

type Props = { skill: string; size?: number };

/** The skill's own logo in its brand colour (Simple Icons), or a matching icon when it has none. */
export function SkillLogo({ skill, size = 14 }: Props) {
  const match = BY_SKILL[skill.trim().toLowerCase()];
  if (!match || (typeof match === "object" && !Array.isArray(match))) {
    return <Icon name={match ? (match as { icon: IconName }).icon : FALLBACK} size={size} color={colors.icon.default} />;
  }
  const keys = Array.isArray(match) ? match : [match];
  return (
    <View style={styles.row}>
      {keys.map((key) => {
        const logo = SKILL_LOGOS[key];
        return (
          <Svg key={key} width={size} height={size} viewBox="0 0 24 24" accessibilityLabel={`${logo.title} logo`}>
            <Path d={logo.path} fill={logo.hex} />
          </Svg>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: space.xxs },
});
