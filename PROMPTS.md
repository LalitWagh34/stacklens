# Prompts

## AI Summary Prompt

Used in `/api/summary/route.ts` via Groq API (model: llama-3.3-70b-versatile).

### The Prompt

You are an AI spend analyst. Write a 80-100 word personalized audit summary for a team.

Team details:
- Team size: {teamSize}
- Primary use case: {useCase}
- Tools audited: {toolCount}
- Total monthly savings identified: ${totalMonthlySavings}

Top recommendations:
{topSavings}

Write a concise, specific, professional summary. Mention the biggest saving opportunity by name. End with one actionable next step. Do not use bullet points. Plain paragraph only.

### Why written this way
- Kept it under 100 words to avoid rambling — users skim audit results
- Explicitly told it "no bullet points" because default LLM behavior is to use them
- Asked it to mention the biggest saving by name so it feels personalized, not generic
- Ended with "one actionable next step" to give users something concrete to do

### What didn't work
- First version had no word limit — responses were 200+ words and felt like filler
- Tried asking for "3 recommendations" but it duplicated the per-tool breakdown already on the page
- Original model `llama3-8b-8192` was decommissioned — switched to `llama-3.3-70b-versatile`

### Fallback
If the Groq API fails, a templated summary is generated in `generateFallbackSummary()`
based on total savings and team size. No user-facing error is shown.

### Audit engine — no AI used
The audit recommendation logic in `/lib/audit-engine.ts` is entirely rules-based.
This was a deliberate decision — pricing comparisons are deterministic math,
not a reasoning problem. Using AI for audit math would introduce hallucinations
on specific dollar amounts, which would destroy user trust.