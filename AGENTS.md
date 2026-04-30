# Angler Watersports — Agent Instructions

## What this is
Marketing + booking site for Angler Watersports, a jet ski / pontoon
rental business operating from 312 Talbot Street, Ocean City, MD.

- Production: https://www.anglerwatersports.com
- Repo: github.com/bluewatermarketing/Anglersdowntownadv
- Deploy: Vercel auto-push to `main` (treat every push as a deploy).
- Operator: solo (Malek). Client-facing site for a client.
  Anthropic API costs come out of whoever's local `.env.local` is
  in use — don't wire up automated recurring API calls without
  asking first.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Stack
- Next.js 16.2.2 (App Router). See block above — this is not the
  Next.js in your training data. `params` is `Promise<...>` in route
  handlers. Read `node_modules/next/dist/docs/` before route work.
- React 19.2.4, Tailwind v4 (semantic tokens — never raw colors).
- MDX blog via `next-mdx-remote` + `gray-matter`.
- Anthropic SDK powers the blog drafter (`scripts/draft.ts`).
  Default model: `claude-opus-4-7` with adaptive thinking + streaming.

## Brand
- **Name:** "Angler Watersports" — singular Angler, one-word Watersports.
- **Palette:** dark navy + gold accent (#D4A017). Dark-first, fintech /
  high-tech feel — deliberately not beachy.
- **Tokens (always use these, never raw colors):**
  `bg-bg`, `bg-bg-deep`, `bg-surface`,
  `text-ink`, `text-ink-dim`, `text-ink-mute`,
  `text-accent`, `text-accent-hi`, `border-border`.
- **Type:** Geist Sans for UI, Geist Mono for tabular figures and
  uppercase labels. Use the `mono-num` class anywhere numbers benefit
  from tabular figures (prices, distances, times).
- **Tracking:** big display = `tracking-tight` (negative).
  Uppercase mono labels = `tracking-[0.16em]` to `tracking-[0.18em]`.

## Voice
Calm, factual, slightly understated. Quantitative when possible.
No tourism cliches.

**Forbidden phrases — do not use:**
- "Your Bay. Your Rules." — owned by OC Downtown Adventures (sister
  site). Keep distinct.
- "discover", "embark", "unleash", "experience the magic"
- "thrill of a lifetime", "memories that last forever"
- "the largest [anything]" — unprovable superlatives
- Implied competitor knocks without naming them
- Made-up review counts. Real numbers go back in once Google Business
  is collecting them.

## SEO independence — non-negotiable
Two adjacent sites Google must treat as fully separate businesses:

1. **OC Downtown Adventures** — client's other business, same physical
   operation, same dock. Never cross-link. No "sister company" copy.
   Don't reuse signature lines across both sites. Different photos per
   site (Google reverse-image-searches). Same hero video is fine
   (no reverse-search for MP4s).

2. **OCA Watersports** — unrelated competitor at 12817 Harbor Rd.
   Don't echo their wording.

## Design primitives — use these, don't reinvent
- `GradientMesh` — subtle backdrop glows. **Default `grid={false}`.**
  The grid renders as faint white lines on photo backgrounds — only
  enable on dark non-photo dashboard strips (WeatherBar, StatStrip,
  decorative mockups).
- `TerminalKicker` — `> SECTION / LABEL` mono kickers above headlines.
- `StatStrip`, `MetricCard`, `AnimatedCounter` — quantitative
  confidence blocks.
- `ScrollReveal` — fade + 8px slide on scroll.
- `WeatherBar` — live Assateague Bay conditions (38.3318°N, 75.0897°W).

## Blog
- Posts: `src/content/blog/<slug>.mdx`.
- Frontmatter `draft: true` → visible on Vercel preview deploys,
  hidden in production. Gating lives in `src/lib/blog.ts`
  (`VERCEL_ENV === "production"`).
- Drafter: `npm run draft "<topic>"` writes a new MDX file with
  `draft: true`. Topic queue: `scripts/blog-topics.txt` — prepend `#`
  to a line after using it.
- No cron, no auto-posting. Manual workflow only.
- Cost: ~$0.05–$0.10 per draft.

## Schema.org JSON-LD
Keep parity when adding pages:
- `LocalBusiness` — home, contact, find-us
- `BlogPosting` + `BreadcrumbList` — individual posts
- `FAQPage` — /faq
- `Service` — /jet-ski, /pontoon

## Git / deploy
- `main` auto-deploys to production. Treat pushes as deploys.
- Never force-push to main.
- Never amend commits — create new ones if a hook fails.
- Don't skip hooks (`--no-verify`) unless explicitly asked.
- Commit messages: imperative, explain *why*, no emoji.
- Don't commit `.env*` files (except `.env.example`).

## Keeping this file updated
This file is meant to drift forward with the project. Update it when
a durable rule is set, not just when working on the immediate task.

**Agent:** when the user does any of the following mid-task, flag it
as an AGENTS.md candidate before the conversation ends:
- Bans a phrase or wording pattern
- Locks in a brand, design, or palette decision
- Sets a rule that should outlive this session ("never do X",
  "always use Y component for Z")
- Confirms a fact that was previously ambiguous
- Fixes a regression that should be prevented from coming back

Don't bloat: per-feature scope, in-progress TODOs, and one-off
conversational context don't belong here.
