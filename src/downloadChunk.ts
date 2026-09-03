import fs from "node:fs/promises";
import path from "node:path";
import { HEADERS } from "./const.js";
import type { ChunkTarget } from "./const.js";

/**
 * Downloads and writes a single chunk to the destination directory.
 */
export async function downloadChunk(chunk: ChunkTarget, outDir: string): Promise<void> {
  const destination = path.join(outDir, chunk.fileName);

  try {
    const res = await fetch(chunk.url, { headers: HEADERS });
    if (!res.ok) {
      console.warn(`[!] Skipped ${chunk.fileName} (HTTP ${res.status})`);
      return;
    }

    const code = await res.text();
    await fs.writeFile(destination, code, "utf-8");
    console.log(`✓ Saved: ${chunk.fileName}`);
  } catch (err: any) {
    console.error(`✗ Error downloading ${chunk.fileName}:`, err.message);
  }
}