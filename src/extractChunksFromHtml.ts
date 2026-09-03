import path from "node:path";
import type { ChunkTarget } from "./const.js";

/**
 * Parses all script URLs from HTML while preserving query parameters (?dpl=...)
 */
export default function extractChunks(baseUrl: string, htmlText: string): ChunkTarget[] {
  const origin = new URL(baseUrl).origin;
  const scriptRegex = /(?:src|href)=["'](\/_next\/static\/chunks\/[^"']+\.js(?:\?[^"']*)?)["']/g;

  const matches: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = scriptRegex.exec(htmlText)) !== null) {
    const scriptPath = match[1];
    if (typeof scriptPath === "string") {
      matches.push(scriptPath);
    }
  }

  const uniquePaths = [...new Set(matches)];

  return uniquePaths.map((fullRelativePath) => {
    const [cleanPath] = fullRelativePath.split("?");
    const fileName = path.basename(cleanPath ?? fullRelativePath);

    return {
      fileName,
      url: `${origin}${fullRelativePath}`,
    };
  });
}