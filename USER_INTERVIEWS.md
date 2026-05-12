# User Interviews

Three interviews conducted on 2026-05-09 with developers and engineers in my network.
Each interview was 10–15 minutes via chat/call.

---

## Interview 1 — Sanchet Atkari, Student Developer, College Project Stage

**Date:** 2026-05-09
**Duration:** 12 minutes
**Background:** CS student working in college project groups of 2-3 people,
uses AI tools informally with no budget.

**Key quotes:**
- "I just assume free is enough. I don't even understand what 'right plan' means sometimes."
- "If it shows real pricing sources, official links, and clear reasoning instead of
  random suggestions — transparency matters a lot."
- "If it feels like it's guessing or exaggerating savings, I won't trust it."

**Most surprising thing they said:**
He compared AI tool overspending to Netflix and Spotify subscriptions —
"this happens a lot even with subscriptions like Netflix, Spotify, or AI tools.
But I don't have enough knowledge to optimize it." I didn't expect the comparison
to consumer subscriptions. It made me realize the tool needs to feel as simple
as cancelling a streaming plan, not as complex as an enterprise procurement decision.

**What it changed about my design:**
Added the "You're spending well" state with honest messaging instead of
manufacturing fake savings. Sanchet said he'd distrust a tool that exaggerates —
so being honest when spend is optimal actually builds more trust than always
showing savings numbers.

---

## Interview 2 — Nitesh Mourya, Software Engineer, Early-Stage Company (25-30 person dev team)

**Date:** 2026-05-09
**Duration:** 13 minutes
**Background:** Engineer at a startup where AI tool decisions are made
by managers, not individual devs. Team of 8–10 engineers all using AI tools daily.

**Key quotes:**
- "In company also we don't track properly AI spend."
- "Copilot + ChatGPT both used but overlap is there. Nobody clearly knows if both needed."
- "Manager likes saving money." 
- "If it gives wrong pricing or outdated info — whole tool useless for engineer."

**Most surprising thing they said:**
He said "Usually manager decide. We just use what is given." — meaning the
actual decision-maker for this tool is NOT the engineer using it, but the
engineering manager or CTO. This flipped my thinking on the target user.
The tool needs to produce output that an engineer can forward to their manager,
not just something an individual uses for themselves.

**What it changed about my design:**
This is why the results page is designed to be shareable — the engineer runs
the audit, then shares the URL with their manager. The per-tool breakdown with
clear reasoning ("Copilot Business is designed for 20+ seats") is written
for a manager reading it, not just the person who ran the audit.

---

## Interview 3 — Muiz Zatam, Senior Developer / System Design Enthusiast, Project Teams

**Date:** 2026-05-09
**Duration:** 15 minutes
**Background:** Experienced developer who thinks in systems. Uses multiple AI
tools with a structured mental model for which tool does what. Active in
10–15 person dev circles.

**Key quotes:**
- "It's like redundant services with unclear separation of responsibility."
- "Nobody does a proper evaluation. It's always anecdotal comparison, not data-driven."
- "Managers don't care about tools, they care about justification and impact."
- "It must correctly model real usage patterns vs cost efficiency tradeoffs.
  Not just pricing — but system-level understanding of how tools are actually
  used in workflow pipelines."

**Most surprising thing they said:**
He said the tool would fail if it "oversimplifies decisions like replace X with Y
without considering workflow impact, latency, context switching cost, or team behavior."
I hadn't thought about context switching cost as a real factor in tool switching.
Switching from Copilot to Cursor isn't free — there's learning curve and muscle memory.
This is a legitimate reason NOT to switch even if the math says you should.

**What it changed about my design:**
Added the 1-sentence reason field to every recommendation in the audit engine —
not just "switch to Cursor" but "Cursor Pro at $20/seat provides purpose-built
IDE integration vs ChatGPT's general interface for coding-focused teams."
The reasoning has to justify the workflow change, not just the price difference.
This directly came from Muiz's feedback.

---

## Key Themes Across All 3 Interviews

1. **Accuracy is non-negotiable** — all 3 said wrong pricing = instant distrust
2. **The real user is the manager, not the engineer** — engineers run the audit,
   managers make the decision
3. **Transparency over cleverness** — show official sources, show the math,
   don't just show a savings number
4. **Overlap between tools is the biggest pain** — everyone mentioned
   Copilot + ChatGPT redundancy specifically
5. **Honest "you're spending well" matters** — manufacturing fake savings
   destroys credibility faster than showing no savings