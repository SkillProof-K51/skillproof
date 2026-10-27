import { colors } from "@skillproof/tokens";
import makeQr from "qrcode-generator";
import { useMemo } from "react";
import Svg, { Path, Rect } from "react-native-svg";

const QUIET = 4; // the blank margin scanners need around a QR code, in modules (the QR standard's 4)

type Props = {
  /** What a scan opens, e.g. the public passport's URL. */
  value: string;
  /** Largest width and height in px, quiet zone included. ≥ 200 for scanning from another phone. */
  size: number;
  /** Read by screen readers, e.g. "QR code for skillproof.test/p/aina-sofea". */
  accessibilityLabel: string;
};

/**
 * A QR code (qrcode-generator, MIT, no dependencies), drawn as one SVG path: the passport's navy on
 * white, inside the quiet zone. Always dark on light — inverted codes don't scan on some phones.
 * Medium error correction (M) survives a scratched screen or a thumb over a corner. Each module
 * gets a whole number of px (the code may come out a little under `size`) and each row's dark runs
 * are single rectangles, so no hairline seams show between modules.
 */
export function QrCode({ value, size, accessibilityLabel }: Props) {
  const { path, span } = useMemo(() => {
    const qr = makeQr(0, "M"); // 0 = the smallest version that fits the value
    qr.addData(value);
    qr.make();
    const n = qr.getModuleCount();
    let d = "";
    for (let row = 0; row < n; row++) {
      for (let col = 0; col < n; col++) {
        if (!qr.isDark(row, col)) continue;
        const start = col;
        while (col + 1 < n && qr.isDark(row, col + 1)) col++;
        const run = col - start + 1;
        d += `M${start + QUIET} ${row + QUIET}h${run}v1h-${run}z`;
      }
    }
    return { path: d, span: n + 2 * QUIET };
  }, [value]);

  const px = Math.max(1, Math.floor(size / span)) * span; // whole px per module
  return (
    <Svg width={px} height={px} viewBox={`0 0 ${span} ${span}`} accessibilityRole="image" accessibilityLabel={accessibilityLabel}>
      <Rect x={0} y={0} width={span} height={span} fill={colors.bg.surface} />
      <Path d={path} fill={colors.passport.cover} />
    </Svg>
  );
}
