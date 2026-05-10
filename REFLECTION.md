# Reflection

## 1. The Hardest Bug I Hit This Week

The hardest bug was Supabase inserts silently failing and returning `local`
as the audit ID instead of a real UUID.

The symptom was clear — the URL after submitting the form was `/audit/local`
instead of `/audit/some-real-uuid`. But the cause was not obvious at all.

**Hypotheses I formed:**
- First I thought the API route wasn't being hit at all — checked with
  console.log and confirmed it was running
- Then I thought the Supabase client wasn't initialized correctly —
  checked the environment variables, they were correct
- Then I thought the table schema was wrong — checked the column names,
  they matched
- Finally I suspected RLS (Row Level Security) — I had clicked
  "Run and enable RLS" when creating the tables, which locks down all
  operations by default

**What I tried:**
- Added `console.error` to log the full Supabase error object
- Saw the error was a Postgres RLS policy violation — inserts were
  being blocked because no policy existed to allow them
- Ran three SQL statements in Supabase SQL editor to create explicit
  allow policies for insert and select on both tables

**What worked:**
Creating RLS policies:
```sql
create policy "Allow insert audits" on audits for insert with check (true);
create policy "Allow select audits" on audits for select using (true);
create policy "Allow insert leads" on leads for insert with check (true);
```

After this, inserts worked immediately and real UUIDs started appearing
in the URL. The lesson: Supabase RLS is silent by default — it doesn't
throw a loud error, it just blocks the operation and returns nothing.
Always check RLS policies first when Supabase inserts fail silently.

---

## 2. A Decision I Reversed Mid-Week

I initially used `llama3-8b-8192` as the Groq model for AI summary generation.
I chose it because it was the most commonly referenced model in Groq's
documentation examples and I assumed it was their current default.

Mid-week when testing the AI summary feature on the live deployment,
the API returned a 400 error:

```
The model llama3-8b-8192 has been decommissioned and is no longer supported.
```

I reversed the decision immediately and switched to `llama-3.3-70b-versatile`
after checking Groq's deprecations page. The new model is actually better —
70B parameters vs 8B means more nuanced summaries — so the forced switch
was an improvement.

**What made me reverse it:**
A hard API error in production. There was no choice — the old model
simply no longer existed. But it taught me to always check the
deprecations page before choosing a model, not just the examples page.
AI infrastructure moves fast — models get deprecated faster than
documentation gets updated.

**The broader lesson:**
Don't assume the model in the tutorial is the current best choice.
Always verify against the official deprecations and recommendations page
before shipping. Add a comment in the code noting when the model was
chosen and where to check for updates.

---

## 3. What I Would Build in Week 2

**Priority 1 — PDF export of the full audit report**
The most requested feature in my user interviews was a downloadable report.
Engineers want to send something to their manager that looks official —
a PDF with the StackLens logo, per-tool breakdown, and savings summary
would be significantly more shareable than a URL in many corporate contexts.

**Priority 2 — Benchmark mode**
"Your AI spend per developer is $X — companies your size average $Y."
This adds competitive context to the audit. Right now we tell you if
you're overpaying vs official pricing. Benchmark mode would tell you
if you're overpaying vs your peers. This requires collecting anonymized
aggregate data from completed audits — which we have in Supabase.

**Priority 3 — Posthog analytics integration**
Right now I have zero visibility into the funnel. I don't know:
- What % of visitors start an audit
- Where they drop off in the form
- What % share their result URL
Adding Posthog with 4 key events would give me the data to make
every other decision in week 2.

**Priority 4 — Domain verification for Resend**
Currently emails only go to my verified address due to Resend's free
tier restriction. Week 2 would include buying a domain (stacklens.app
or similar) and verifying it with Resend so transactional emails
go to actual users.

**Priority 5 — Embeddable widget**
A `<script>` tag a blogger or newsletter writer could drop in to show
a mini spend calculator. This is a distribution play — every embed
is a new acquisition channel.

---

## 4. How I Used AI Tools

**Tools used:** Claude (primary), ChatGPT (secondary)

**What I used Claude for:**
- Generating the initial boilerplate for Next.js components
- Writing the audit engine logic structure — I gave it the pricing data
  and asked for a skeleton, then rewrote the actual rules myself
- Debugging the CI workflow — pasted the error logs and asked for diagnosis
- Writing the documentation files — GTM, ECONOMICS, REFLECTION
- Explaining Supabase RLS concepts when I didn't understand why inserts failed

**What I used ChatGPT for:**
- Cross-checking Groq model names when llama3-8b-8192 was deprecated
- Quick syntax lookups for TypeScript generics

**What I didn't trust AI with:**
- The actual pricing numbers — I verified every single price against
  official vendor pricing pages myself. AI confidently gives wrong
  prices and I would not risk the core trust mechanism of the product
  on AI-generated pricing data.
- The audit logic rules — I wrote the specific thresholds myself
  (e.g. "Business plan is overkill for under 3 seats") because these
  need to be defensible to a finance person. AI gave me structure,
  I filled in the reasoning.
- Git commits — every commit message was written by me to reflect
  what actually changed, not generated.

**One specific time the AI was wrong and I caught it:**
Claude suggested using `llama3-8b-8192` as the Groq model in the summary
API route. It presented this confidently as the current recommended model.
It was wrong — the model had been decommissioned. I only caught it
because the API threw a hard error in production. If I had used AI-suggested
pricing data the same way, I would have shipped wrong numbers that
users would have trusted. This is why I never let AI touch the pricing data.

---

## 5. Self-Rating

**Discipline: 7/10**
I started the day after my exam which cost me one day. Once started,
I worked consistently across all 6 days with meaningful commits each day.
Could have started earlier and spread the work more evenly across the week.

**Code quality: 7/10**
The TypeScript types are well-structured and the audit engine is readable
with clear function separation. The API routes are clean. Weak points:
the AuditSummary component uses `any` type for the audit data prop which
is a shortcut I'd fix in a real codebase. Test coverage is good for the
audit engine but zero for UI components and API routes.

**Design sense: 6/10**
The dark theme with emerald green accents is clean and consistent.
The results page hierarchy is clear — big savings number at the top,
breakdown below, lead capture at the bottom. Weak points: mobile
responsiveness wasn't fully tested, and the form could use better
empty states and validation feedback.

**Problem solving: 8/10**
Debugged the Supabase RLS issue systematically by forming hypotheses
and eliminating them one by one. Fixed the CI workflow through multiple
iterations without giving up. Handled the Groq model deprecation quickly.
The audit engine logic is defensible and covers edge cases like
overpaying vs official price across all tools.

**Entrepreneurial thinking: 7/10**
I understand the user (engineering manager at a seed-stage startup),
the distribution channel (HN, Reddit, Credex existing customers),
and the unit economics (LTV, CAC, conversion funnel). The user interviews
were real and changed concrete design decisions. Weak point: I didn't
talk to any actual CTOs or engineering managers at funded startups —
my interviewees were developers and students, which is a level below
the actual buyer. Week 2 would fix this.