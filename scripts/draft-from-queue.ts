#!/usr/bin/env node
/* ──────────────────────────────────────────────────────────
   AUTOMATED BLOG-POST DRAFTER — runs from a topic queue

   Used by .github/workflows/draft-weekly.yml. Reads
   scripts/blog-topics.txt, picks the first non-comment line,
   drafts a post, then prepends "# " to that line so it isn't
   picked again on the next run.

   For local testing: npm run draft:queue
   For manual run on CI: workflow_dispatch in GitHub Actions
   ────────────────────────────────────────────────────────── */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local", quiet: true });
dotenv.config({ path: ".env", quiet: true });

import fs from "fs/promises";
import path from "path";
import Anthropic from "@anthropic-ai/sdk";
import { draftPost } from "./lib/draft";

const QUEUE_PATH = path.resolve("scripts/blog-topics.txt");

/* GitHub Actions output helpers — write to GITHUB_OUTPUT if running on CI,
   otherwise just log so local runs are debuggable. */
async function setOutput(key: string, value: string): Promise<void> {
  const output = process.env.GITHUB_OUTPUT;
  if (output) {
    await fs.appendFile(output, `${key}=${value}\n`, "utf8");
  } else {
    console.error(`[output] ${key}=${value}`);
  }
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("Error: ANTHROPIC_API_KEY is not set.");
    console.error("  In GitHub Actions, add it as a repository secret.");
    console.error("  Locally, add it to .env.local.");
    process.exit(1);
  }

  // Read the queue.
  const raw = await fs.readFile(QUEUE_PATH, "utf8");
  const lines = raw.split("\n");

  // Find the first non-blank, non-comment line.
  let pickedIndex = -1;
  let pickedTopic = "";
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("#")) continue;
    pickedIndex = i;
    pickedTopic = trimmed;
    break;
  }

  if (pickedIndex === -1) {
    console.log("Queue is empty — no topics to draft.");
    console.log("Add new topics to scripts/blog-topics.txt to keep the cadence going.");
    await setOutput("created", "false");
    return;
  }

  console.log(`> Picked topic: "${pickedTopic}"`);
  console.log(`  Line ${pickedIndex + 1} of scripts/blog-topics.txt\n`);

  // Draft the post.
  const result = await draftPost(pickedTopic, {
    onProgress: () => process.stdout.write("."),
  });
  console.log("\n");

  // Mark the topic as used by prepending "# " and a date stamp.
  const today = new Date().toISOString().slice(0, 10);
  lines[pickedIndex] = `# ${pickedTopic}  [drafted ${today}]`;
  await fs.writeFile(QUEUE_PATH, lines.join("\n"), "utf8");

  console.log(`✓ Drafted: ${path.relative(process.cwd(), result.filePath)}`);
  console.log(`  Title:    ${result.title}`);
  console.log(`  Slug:     ${result.slug}`);
  console.log(`  Tags:     ${result.tags.join(", ")}`);
  console.log(`  Words:    ~${result.wordCount}`);
  console.log(
    `  Tokens:   ${result.tokensIn} in / ${result.tokensOut} out` +
      (result.cacheRead || result.cacheWrite
        ? `  (cache: ${result.cacheWrite}w / ${result.cacheRead}r)`
        : "")
  );
  console.log(`  Queue:    line ${pickedIndex + 1} marked as used`);

  // Pass metadata to GitHub Actions for the PR-creation step.
  await setOutput("created", "true");
  await setOutput("slug", result.slug);
  await setOutput("title", result.title);
  await setOutput("excerpt", result.excerpt);
  await setOutput("file_path", path.relative(process.cwd(), result.filePath));
  await setOutput("topic", pickedTopic);
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
