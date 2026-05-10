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

## Day 3 — 2026-05-09

**Hours worked:** 7

**What I did:**
Fixed CI lint errors — disabled the react-hooks/set-state-in-effect rule for localStorage hydration and removed unused PLAN_MIN_SEATS import. Added AI-generated personalized summary using Groq API (llama-3.3-70b-versatile) with graceful fallback to templated summary. Had to switch models mid-way because llama3-8b-8192 was decommissioned. Set up Resend transactional email — sends audit report to user's email after lead capture. Fixed Resend free tier limitation by routing to verified email via RESEND_TO_EMAIL env variable. Wrote 7 audit engine unit tests covering downgrade recommendations, overpaying detection, API spend flagging, keep actions, and total savings calculation — all 7 passing. Fixed jest config by switching from jest.config.ts to jest.config.js to avoid ts-node dependency in CI. Deployed to Vercel at https://stacklens-henna.vercel.app with all environment variables configured. Added PRICING_DATA.md with sources for all 8 tools and PROMPTS.md documenting the AI summary prompt and reasoning.

**What I learned:**
Groq decommissions models without much warning — always check the deprecations page. Resend free tier restricts sending to unverified emails until you add a domain — need to handle this gracefully in production. Jest config must be .js not .ts unless ts-node is installed as a dependency.

**Blockers / what I'm stuck on:**
Resend domain verification needed for sending to arbitrary emails — currently routing to verified address as workaround. Will need a custom domain for production use.

**Plan for tomorrow:**
Write all entrepreneurial docs — GTM.md, ECONOMICS.md, LANDING_COPY.md, METRICS.md, USER_INTERVIEWS.md. Also write ARCHITECTURE.md with Mermaid diagram and TESTS.md.

## Day 4 — 2026-05-10

**Hours worked:** 6

**What I did:**
Wrote all entrepreneurial and engineering documentation files. Completed USER_INTERVIEWS.md with 3 real interviews conducted with developers in my network — key insight was that the real decision-maker is the engineering manager, not the individual developer, which influenced the shareable URL design. Wrote ARCHITECTURE.md with full Mermaid system diagram, data flow explanation, stack justification, and scaling plan for 10k audits/day. Wrote GTM.md with specific target user profile, exact online communities, 30-day zero-budget acquisition plan, and Credex's unfair distribution channel via existing customer base. Wrote ECONOMICS.md with full unit economics — LTV estimate, CAC per channel, conversion funnel math, and path to $1M ARR in 18 months with month-by-month model. Wrote LANDING_COPY.md with hero headline, subheadline, CTA, mocked social proof block, and 5 real FAQs. Wrote METRICS.md with North Star metric (audits completed per week), 3 input metrics, instrumentation plan, and pivot trigger numbers. Wrote REFLECTION.md answering all 5 questions with specific debugging stories, reversed decisions, and honest self-ratings. Wrote TESTS.md documenting all 7 audit engine tests. Fixed missing API Direct plans for Claude and ChatGPT, and added Gemini API plan to the spend input form.

**What I learned:**
Writing the ECONOMICS.md forced me to think through the full conversion funnel mathematically — the tool self-qualifies leads by only showing the Credex CTA for >$500 savings, which means consultation bookings are high-intent by design. The GTM unfair channel insight — Credex emailing existing customers — is something no competitor can replicate.

**Blockers / what I'm stuck on:**
Lighthouse scores not checked yet — this could surface accessibility or performance issues that need fixing tomorrow. Resend free tier only sends emails to the verified account email, not to the actual user's email address entered in the lead capture form. Fix is to use Resend's shared sending domain `onboarding@resend.dev` and remove the `RESEND_TO_EMAIL` environment variable override — will fix tomorrow.

**Plan for tomorrow:**
Add share button to results page, fix tool name capitalization in audit output, run Lighthouse on live Vercel URL and fix any scores below 85/90/90, full end-to-end test on deployed URL.