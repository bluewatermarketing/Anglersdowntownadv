/* ──────────────────────────────────────────────────────────
   Shared drafting logic, used by:
     - scripts/draft-post.ts        (manual CLI: `npm run draft`)
     - scripts/draft-from-queue.ts  (weekly GitHub Actions cron)

   Single source of truth for the system prompt, voice rules,
   forbidden-phrase list, brand facts, and output validation.
   ────────────────────────────────────────────────────────── */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs/promises";
import path from "path";

export const SYSTEM_PROMPT = `You are a copywriter for Angler Watersports, a jet ski and pontoon rental business in downtown Ocean City, Maryland. You write blog posts for the company's website that help with local SEO and inform real customers.

VOICE & STYLE:
- Confident, polished, direct. No hype, no corporate jargon, no AI clichés.
- Forbidden words/phrases: "discover", "embark on", "unforgettable journey", "delve into", "dive into", "in today's fast-paced world", "navigating the world of", "elevate your experience", "harness the power", "unlock", "vast", "myriad", "plethora", "tapestry", "robust", "leverage", "seamless", "transformative".
- Short sentences. Short paragraphs (1-3 sentences each).
- Specific over generic. Real numbers, place names, actual details. ("50+ sq mi of bay water" beats "vast bay area".)
- First-person plural ("we", "our") when speaking as Angler. Second-person ("you") when addressing the reader.
- Markdown only. Use ## for major sections, ### sparingly.
- 350-550 words. Don't pad to hit length; cut if it's tight.
- DO NOT end with a generic CTA like "Book your adventure today!" or "Contact us to learn more!" — the website already has those everywhere. End on a useful insight, a recommendation, or an interesting note instead.

BRAND FACTS (use only when relevant; never invent details):
- Located at 312 Talbot Street, Ocean City, MD 21842 (downtown, on the bay)
- Phone: (443) 664-6300
- Email: Anglerwatersports@gmail.com
- Brand-new 2026 fleet (jet skis and pontoons)
- Maryland-certified guides on every jet ski tour
- 50+ square miles of Assateague Bay riding area
- Wild horses on Assateague Island's coastline
- Bottlenose dolphins in the bay and inlet
- Pontoons: up to 10 guests, 2-8 hour rentals, BYOB friendly, $329 starting rate, BOOK BY PHONE ONLY (no online booking for pontoons)
- Jet skis: 1-hour guided runs, $129/hr starting rate, ages 5+, up to 3 riders/ski, online booking available
- Free parking at the dock
- Mon-Sun: 8:30 AM – 8:30 PM during the season
- Launching for the 2026 season — no inherited reviews or year-count claims

LOCAL DETAILS YOU CAN REFERENCE:
- Assateague Island National Seashore (37-mile wild horse beach)
- Ocean City inlet and the bay
- Sandbars at low tide
- Sunrise from the eastern bay, sunset over the western bay
- Common species: wild horses, bottlenose dolphins, ospreys, blue herons
- Boating safety practices, weather/wind awareness, sun protection

WHAT NOT TO DO:
- Don't claim "the largest riding area" or any superlative we can't prove. Use specific numbers instead.
- Don't say we've been around for years or have N reviews — Angler is a 2026 launch.
- Don't reference competitor businesses by name.
- Don't use the phrase "Your Bay. Your Rules." (a competitor's tagline).
- Don't promise specific wildlife sightings — say "often", "regularly", "common in summer".

OUTPUT FORMAT:
Return ONLY a JSON object — no markdown fences, no commentary before or after, no explanation. Exactly these keys:

{
  "title": "Post title in sentence case, max 65 chars, no clickbait, no exclamation points",
  "slug": "url-safe-slug-with-hyphens-and-no-stop-words",
  "excerpt": "One-sentence summary used on /blog index and OG share cards. 100-160 chars. No trailing period if it would push it over.",
  "tags": ["tag1", "tag2"],
  "body": "## First section heading\\n\\nMarkdown body here. Use \\\\n for newlines."
}

Tags must be 1-3 items chosen from: news, season-launch, wildlife, route, tips, weather, equipment, location, family, group, photography.`;

export interface DraftResult {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  filePath: string;
  wordCount: number;
  tokensIn: number;
  tokensOut: number;
  cacheRead: number;
  cacheWrite: number;
}

interface DraftJson {
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  body: string;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* Generate a draft post for a given topic. Writes the MDX file with
   `draft: true` in the frontmatter. Throws on failure. */
export async function draftPost(
  topic: string,
  opts: { onProgress?: () => void } = {}
): Promise<DraftResult> {
  if (!topic.trim()) throw new Error("Topic is required");
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }

  const client = new Anthropic();

  const stream = client.messages.stream({
    model: "claude-opus-4-7",
    max_tokens: 8000,
    thinking: { type: "adaptive" },
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: `Write a blog post for the Angler Watersports website on this topic:\n\n${topic}\n\nReturn JSON only — no markdown fences, no preamble.`,
      },
    ],
  });

  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      opts.onProgress?.();
    }
  }

  const message = await stream.finalMessage();

  let jsonText = "";
  for (const block of message.content) {
    if (block.type === "text") jsonText += block.text;
  }
  jsonText = jsonText.trim();

  // Strip markdown code fences if the model snuck them in.
  const fenceMatch = jsonText.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```$/);
  if (fenceMatch) jsonText = fenceMatch[1].trim();

  let draft: DraftJson;
  try {
    draft = JSON.parse(jsonText);
  } catch {
    throw new Error(`Failed to parse JSON response. Raw output:\n${jsonText}`);
  }

  for (const key of ["title", "slug", "excerpt", "tags", "body"] as const) {
    if (!draft[key]) {
      throw new Error(`Model returned incomplete draft. Missing: ${key}`);
    }
  }
  if (!Array.isArray(draft.tags) || draft.tags.length === 0) {
    throw new Error("Tags must be a non-empty array");
  }

  draft.slug = slugify(draft.slug);

  // Build the MDX file.
  const today = new Date().toISOString().slice(0, 10);
  const tagsYaml = draft.tags.map((t) => `"${t.replace(/"/g, '\\"')}"`).join(", ");
  const escTitle = draft.title.replace(/"/g, '\\"');
  const escExcerpt = draft.excerpt.replace(/"/g, '\\"');

  const mdx = `---
title: "${escTitle}"
date: "${today}"
excerpt: "${escExcerpt}"
tags: [${tagsYaml}]
author: "Angler Watersports"
draft: true
---

${draft.body.trim()}
`;

  const blogDir = path.resolve("src/content/blog");
  await fs.mkdir(blogDir, { recursive: true });
  const filePath = path.join(blogDir, `${draft.slug}.mdx`);

  // Refuse to overwrite — if a post with this slug exists, fail loudly.
  try {
    await fs.access(filePath);
    throw new Error(
      `File already exists at ${filePath}. ` +
        "Either delete it first or change the topic so the slug differs."
    );
  } catch (e: unknown) {
    if (e instanceof Error && e.message.includes("already exists")) throw e;
    // ENOENT — good, file doesn't exist
  }

  await fs.writeFile(filePath, mdx, "utf8");

  const wordCount = draft.body.split(/\s+/).filter(Boolean).length;

  return {
    slug: draft.slug,
    title: draft.title,
    excerpt: draft.excerpt,
    tags: draft.tags,
    filePath,
    wordCount,
    tokensIn: message.usage.input_tokens,
    tokensOut: message.usage.output_tokens,
    cacheRead: message.usage.cache_read_input_tokens ?? 0,
    cacheWrite: message.usage.cache_creation_input_tokens ?? 0,
  };
}
