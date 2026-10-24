import { colors, radius, space } from "@skillproof/tokens";
import { Pressable, StyleSheet, View, type ViewStyle } from "react-native";

import { Text } from "./Text";

const LINE_NUMBER = 18; // width of the line-number column

export type CodeLanguage = "javascript" | "sql";

type TokenKind = "keyword" | "control" | "fn" | "variable" | "string" | "number" | "comment" | "text";

const TOKEN_COLOURS: Record<TokenKind, string> = {
  keyword: colors.code.keyword,
  control: colors.code.control,
  fn: colors.code.fn,
  variable: colors.code.variable,
  string: colors.code.string,
  number: colors.code.number,
  comment: colors.code.comment,
  text: colors.code.text,
};

// Dark+ splits JavaScript keywords in two: declarations and values blue, control flow purple.
const JS_KEYWORDS = new Set([
  "const", "let", "var", "function", "class", "new", "async", "typeof", "instanceof", "this",
  "null", "undefined", "true", "false", "extends", "of", "in",
]);
const JS_CONTROL = new Set([
  "return", "if", "else", "for", "while", "do", "await", "try", "catch", "finally", "throw",
  "switch", "case", "break", "continue", "import", "export", "from", "default",
]);
const SQL_KEYWORDS = new Set([
  "SELECT", "FROM", "WHERE", "JOIN", "LEFT", "RIGHT", "INNER", "OUTER", "ON", "GROUP", "BY", "ORDER",
  "LIMIT", "AS", "AND", "OR", "NOT", "NULL", "IS", "IN", "COUNT", "SUM", "AVG", "MIN", "MAX",
  "DISTINCT", "HAVING", "DESC", "ASC", "INSERT", "INTO", "VALUES", "UPDATE", "SET", "DELETE",
]);

const PATTERNS: Record<CodeLanguage, RegExp> = {
  // comment · string · number · word · space · anything else
  javascript: /(\/\/.*$)|("(?:[^"\\]|\\.)*"?|'(?:[^'\\]|\\.)*'?|`(?:[^`\\]|\\.)*`?)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|(\s+)|(.)/g,
  sql: /(--.*$)|('(?:[^'\\]|\\.)*'?)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][\w]*)|(\s+)|(.)/g,
};

/** One line of code → coloured pieces. Good enough for short teasers; not a full parser. */
function tokenize(line: string, language: CodeLanguage): { text: string; kind: TokenKind }[] {
  const out: { text: string; kind: TokenKind }[] = [];
  const re = new RegExp(PATTERNS[language].source, "g");
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    const [text, comment, str, num, word] = m;
    let kind: TokenKind = "text";
    if (comment) kind = "comment";
    else if (str) kind = "string";
    else if (num) kind = "number";
    else if (word && language === "sql") kind = SQL_KEYWORDS.has(word.toUpperCase()) ? "keyword" : "text";
    else if (word) {
      if (JS_CONTROL.has(word)) kind = "control";
      else if (JS_KEYWORDS.has(word)) kind = "keyword";
      else if (/^\s*\(/.test(line.slice(re.lastIndex))) kind = "fn";
      else kind = "variable";
    }
    out.push({ text, kind });
  }
  return out;
}

type Props = {
  lines: string[];
  language?: CodeLanguage;
  /** Line numbers down the left, like an editor. */
  numbered?: boolean;
  /** What the code is, for screen readers, e.g. "Preview of today's code". */
  accessibilityLabel?: string;
  style?: ViewStyle;
  /** Makes every line tappable — "tap the line with the bug" (onboarding's warm-up). */
  onPressLine?: (index: number) => void;
  /** Lights lines up after a tap: right = the answer, wrong = not it. Keyed by line index. */
  marks?: Record<number, "right" | "wrong">;
};

/**
 * Code as it looks in VS Code (Dark+ colours, Azim 25 Oct): dark block, grey line numbers,
 * keywords, names and strings coloured. Long lines are cut with "…", never wrapped.
 */
export function CodeBlock({ lines, language = "javascript", numbered = true, accessibilityLabel, style, onPressLine, marks }: Props) {
  return (
    <View style={[styles.block, style]} accessibilityLabel={accessibilityLabel}>
      {lines.map((line, i) => (
        <Pressable
          key={i}
          disabled={!onPressLine}
          onPress={() => onPressLine?.(i)}
          accessibilityRole={onPressLine ? "button" : undefined}
          accessibilityLabel={onPressLine ? `Line ${i + 1}: ${line.trim()}${marks?.[i] ? `, ${marks[i]}` : ""}` : undefined}
          style={[styles.line, onPressLine && styles.tappable, marks?.[i] && { backgroundColor: MARK[marks[i]] }]}
        >
          {numbered ? (
            <Text variant="code" color={colors.code.lineNumber} style={styles.lineNumber}>
              {i + 1}
            </Text>
          ) : null}
          {/* leading spaces → no-break spaces, or the web collapses the indent */}
          <Text variant="code" color={colors.code.text} numberOfLines={1} style={styles.flex}>
            {tokenize(line.replace(/^ +/, (s) => " ".repeat(s.length)), language).map((t, j) => (
              <Text key={j} variant="code" color={TOKEN_COLOURS[t.kind]}>
                {t.text}
              </Text>
            ))}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const MARK = { right: colors.code.lineRight, wrong: colors.code.lineWrong } as const;

const styles = StyleSheet.create({
  block: { backgroundColor: colors.code.bg, borderRadius: radius.tile, padding: space.md },
  line: { flexDirection: "row", gap: space.sm },
  // a taller line is easier to hit; it bleeds into the padding so the code doesn't move
  tappable: { paddingVertical: space.xs, marginHorizontal: -space.xs, paddingHorizontal: space.xs, borderRadius: radius.control },
  lineNumber: { width: LINE_NUMBER, textAlign: "right" },
  flex: { flex: 1 },
});
