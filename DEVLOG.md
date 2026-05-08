# DEVLOG

## Day 1 — 2026-05-07

**Hours worked:** 4

**What I did:**
Set up the Next.js 14 project with TypeScript, Tailwind, and shadcn/ui. Created the GitHub repo, configured CI with GitHub Actions (had to debug Node.js version and working directory issues). Built the core TypeScript types, pricing data constants for all 8 tools, and the audit engine with defensible recommendation logic. Structured the full folder layout for the project.

**What I learned:**
GitHub Actions is sensitive to working directory configuration when the repo has nested folders. Also learned that Next.js 16 dropped the `--dir` flag from `next lint`, so had to switch to direct eslint command in CI.

**Blockers / what I'm stuck on:**
CI took several attempts to go green due to Node.js version mismatch and working directory path issues. Resolved by setting Node 20 and removing the working-directory override since files are at repo root on GitHub.

**Plan for tomorrow:**
Set up Supabase, build the spend input form with localStorage persistence, build the audit results page, and get the full form → audit → results flow working end to end.

---

## Day 2 — 2026-05-08

**Hours worked:** 6

**What I did:**
Set up Supabase with audits and leads tables with RLS enabled. Had to add explicit RLS policies to allow inserts and selects — without this, all inserts were silently failing and returning a `local` fallback ID. Built the spend input form with localStorage persistence so form state survives page reloads. Built the audit results page showing per-tool breakdown, hero savings number, and Credex CTA for audits showing over $500/mo savings. Created the LeadCaptureForm component with honeypot field for basic abuse protection. Built `/api/audit` and `/api/leads` API routes. Got the full flow working end to end — form submission → audit engine → Supabase save → redirect to results page with real UUID. Fixed audit engine to catch overpaying vs official pricing across all tools, and lowered Anthropic API threshold to $100 for optimization flag. Added Open Graph and Twitter card meta tags for shareable previews.

**What I learned:**
Supabase RLS blocks all operations by default even with the anon key — you must explicitly create policies for each operation. Debugging this took time because the error was silent — the API route was catching the Supabase error and falling back to `local` instead of surfacing it. Also learned that the audit engine needs a general overpaying check as a catch-all beyond tool-specific rules.

**Blockers / what I'm stuck on:**
API route was returning 404 intermittently — turned out the dev server was running from the wrong directory. Fixed by always running `npm run dev` from inside the inner stacklens folder.

**Plan for tomorrow:**
Add AI-generated personalized summary using Groq API with graceful fallback, set up transactional email with Resend, write 5+ audit engine tests, and deploy to Vercel.