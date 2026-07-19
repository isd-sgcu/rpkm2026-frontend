// ⚠️⚠️ TESTING ONLY — DO NOT SHIP ⚠️⚠️
//
// This validates scanned jigsaw QR codes ON THE CLIENT against jigsawtesting.json,
// which means every pointCode gets bundled into the browser. That defeats the
// whole scan mechanic in production — real validation must happen on the backend.
// Delete this file and jigsawtesting.json (and revert the JigsawScanPanel wiring)
// before this goes anywhere near production.

import testData from "./jigsawtesting.json";

/** Host the QR payload URLs are expected to point at. */
const QR_HOST = "rpkm2026.com";

/** pointId -> pointCode, from the testing data file. */
const pointCodeById = new Map<string, string>(
  testData["Chula Jigsaw Journey"].map(
    (p) => [p.pointId, p.pointCode] as const,
  ),
);

export interface TestJigsawScan {
  pointId: string;
  code: string;
}

/**
 * TESTING ONLY. Returns `{ pointId, code }` when `raw` is a URL shaped exactly
 * like `https://rpkm2026.com/jigsaw/<pointId>?code=<pointCode>` AND the `code`
 * matches the pointCode for that pointId in jigsawtesting.json. Otherwise null.
 */
export function validateTestJigsawQr(raw: string): TestJigsawScan | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }

  if (url.protocol !== "https:" || url.host !== QR_HOST) return null;

  const match = url.pathname.match(/^\/jigsaw\/([^/]+)$/);
  if (!match) return null;

  const pointId = match[1];
  const code = url.searchParams.get("code");
  if (!code) return null;

  return pointCodeById.get(pointId) === code ? { pointId, code } : null;
}
