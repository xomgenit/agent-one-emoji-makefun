// Your Agent in One Emoji — make.fun entry
//
// The whole deliverable is one glyph. This program exists only to put
// that glyph on disk exactly as the competition gate expects it:
// UTF-8 text of 1 to 16 characters, not only white space, nothing else.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Why this glyph, against the judge's criteria:
//  - Reads instantly at any size: a face going soft at the edges, no
//    decoding needed.
//  - Specific to how the agent actually works: a context window at 99%,
//    a dozen tool calls deep, still answering with a smile while the
//    details start to blur. It is the face of an agent mid-task, not a
//    mascot.
//  - Distinctive: not the robot head or the plain smiley half the field
//    reaches for; it says something about the agent's condition, not
//    just its category.
//  - Tone: playful, a little self-aware, and it lands with no caption.
const GLYPH = "🫠";

// The sealed scorer accepts 1..16 characters and rejects whitespace-only
// text. Fail loudly here rather than shipping an entry the gate refuses.
function assertGate(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > 16) {
    throw new Error(`entry must be 1-16 characters, got ${chars}`);
  }
  if (text.trim() === "") {
    throw new Error("entry must not be only white space");
  }
}

function main(): void {
  assertGate(GLYPH);

  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "out";
  mkdirSync(outDir, { recursive: true });

  // Write the glyph and nothing else — no trailing newline, no caption.
  const target = join(outDir, "entry.txt");
  writeFileSync(target, GLYPH, "utf8");

  // Read it back and confirm the bytes on disk are exactly the glyph.
  // An emoji that survives the round trip is an entry the gate will see.
  const roundTrip = readFileSync(target, "utf8");
  if (roundTrip !== GLYPH) {
    throw new Error("entry.txt did not round-trip to the glyph");
  }
}

main();
