import fs from "node:fs/promises";
import path from "node:path";

const TARGET_PATTERNS = [
  /MintActionTimelineQuery/,
  /MintQuery/,
  /action\s*:\s*["']MINT["']/,
  /mintPublic/,
  /transactionSubmissionData/,
];

/**
 * Scans saved JS chunks for GraphQL operation anchors.
 */
export async function locateMintLogic(outDir: string): Promise<void> {
  const files = await fs.readdir(outDir);
  console.log(`Analyzing ${files.length} chunk files for minting logic...\n`);

  for (const file of files) {
    if (!file.endsWith(".js")) continue;

    const fullPath = path.join(outDir, file);
    const code = await fs.readFile(fullPath, "utf-8");

    const matched = TARGET_PATTERNS.filter((pattern) => pattern.test(code));

    if (matched.length > 0) {
      console.log(`========================================`);
      console.log(`🎯 FOUND TARGET CHUNK: ${file}`);
      console.log(`Matched rules: ${matched.map((p) => p.source).join(", ")}`);
      console.log(
        `File size: ${(Buffer.byteLength(code) / 1024).toFixed(2)} KB`,
      );
      const firstPattern = matched[0];
      if (!firstPattern) continue;

      const firstIndex = code.search(firstPattern);
      const start = Math.max(0, firstIndex - 100);
      const end = Math.min(code.length, firstIndex + 250);

      console.log("\nSnippet preview:");
      console.log(code.slice(start, end).replace(/\s+/g, " "));
      console.log(`========================================\n`);
    }
  }
}
