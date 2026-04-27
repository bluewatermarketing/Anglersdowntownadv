#!/usr/bin/env node
/* ──────────────────────────────────────────────────────────
   AI BLOG-POST DRAFTER for Angler Watersports — manual CLI

   Usage:  npm run draft "Your topic here"
   Output: src/content/blog/<slug>.mdx with `draft: true`

   Workflow:
     1. npm run draft "Best time of year to spot wild horses"
     2. Open the new MDX file, review/edit, add first-hand details
     3. Remove the `draft: true` line from frontmatter
     4. git add + commit + push  (Vercel deploys automatically)

   See scripts/lib/draft.ts for the system prompt and brand rules.
   See scripts/draft-from-queue.ts for the weekly auto-draft cron.

   Cost: ~$0.05–$0.10 per draft via Claude API (Opus 4.7).
   Requires ANTHROPIC_API_KEY in .env.local.
   ────────────────────────────────────────────────────────── */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local", quiet: true });
dotenv.config({ path: ".env", quiet: true });

import path from "path";
import Anthropic from "@anthropic-ai/sdk";
import { draftPost } from "./lib/draft";

async function main() {
  const topic = process.argv.slice(2).join(" ").trim();
  if (!topic) {
    console.error('Usage: npm run draft "<topic>"');
    console.error('Example: npm run draft "Best time of year to spot wild horses"');
    process.exit(1);
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("Error: ANTHROPIC_API_KEY is not set.");
    console.error("  Add it to .env.local at the project root:");
    console.error("    ANTHROPIC_API_KEY=sk-ant-...");
    console.error("  Get a key at https://console.anthropic.com/");
    process.exit(1);
  }

  console.error(`> Drafting on topic: "${topic}"`);
  console.error(`  Model: claude-opus-4-7  ·  Adaptive thinking on  ·  Streaming\n`);

  const result = await draftPost(topic, {
    onProgress: () => process.stderr.write("."),
  });
  console.error("\n");

  const cacheNote =
    result.cacheRead || result.cacheWrite
      ? `  (cache: ${result.cacheWrite} written, ${result.cacheRead} read)`
      : "";

  console.log(`✓ Drafted: ${path.relative(process.cwd(), result.filePath)}`);
  console.log(`  Title:  ${result.title}`);
  console.log(`  Tags:   ${result.tags.join(", ")}`);
  console.log(`  Words:  ~${result.wordCount}`);
  console.log(`  Tokens: ${result.tokensIn} in / ${result.tokensOut} out${cacheNote}`);
  console.log("");
  console.log("Next:");
  console.log("  1. Open the .mdx file and review");
  console.log("  2. Edit / add first-hand details where it improves authenticity");
  console.log('  3. Remove the "draft: true" line in frontmatter');
  console.log("  4. git add + commit + push");
}

main().catch((err: unknown) => {
  if (err instanceof Anthropic.APIError) {
    console.error(`API error ${err.status}: ${err.message}`);
  } else if (err instanceof Error) {
    console.error("Error:", err.message);
  } else {
    console.error("Unknown error:", err);
  }
  process.exit(1);
});
