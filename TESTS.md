# Tests

## Test Suite Overview

All tests are in `src/__tests__/audit-engine.test.ts` and cover the core
audit engine logic. The audit engine is the most critical part of the product —
wrong recommendations destroy user trust, so this is where automated testing
matters most.

## Running Tests

```bash
npx jest
```

Or with verbose output:

```bash
npx jest --verbose
```

Expected output:
```
PASS  src/__tests__/audit-engine.test.ts
  ✓ Cursor Business with 2 seats recommends downgrade to Pro
  ✓ ChatGPT Team with 1 seat recommends downgrade to Plus
  ✓ Cursor Pro at $500 for 1 seat triggers optimize recommendation
  ✓ Anthropic API over $100/mo triggers credits optimization
  ✓ Cursor Pro at correct price for small team returns keep
  ✓ Total monthly savings sums all tool savings correctly
  ✓ GitHub Copilot Enterprise with 5 seats recommends downgrade to Business

Tests: 7 passed, 7 total
```

---

## Test Coverage

### Test 1 — Cursor Business small team downgrade
**File:** `src/__tests__/audit-engine.test.ts`
**What it covers:** Cursor Business plan with 2 seats should recommend
downgrade to Pro. Business plan is designed for 5+ seats — 2 seats is
overkill and wastes $40/month.
**How to run:** `npx jest -t "Cursor Business"`

---

### Test 2 — ChatGPT Team solo user downgrade
**File:** `src/__tests__/audit-engine.test.ts`
**What it covers:** ChatGPT Team plan with 1 seat should recommend downgrade
to Plus. Team plan collaboration features are irrelevant for a single user
paying $10/month extra unnecessarily.
**How to run:** `npx jest -t "ChatGPT Team"`

---

### Test 3 — Overpaying vs official price detection
**File:** `src/__tests__/audit-engine.test.ts`
**What it covers:** Cursor Pro at $500/month for 1 seat should trigger
an optimize recommendation. Official price is $20/seat — $500 is 25x
the official price, clearly a billing error or wrong seat count.
**How to run:** `npx jest -t "Cursor Pro at"`

---

### Test 4 — Anthropic API credits recommendation
**File:** `src/__tests__/audit-engine.test.ts`
**What it covers:** Anthropic API spend over $100/month should trigger
the credits optimization recommendation pointing to Credex. This is the
core monetization trigger for the product.
**How to run:** `npx jest -t "Anthropic API"`

---

### Test 5 — Well-optimized stack returns keep
**File:** `src/__tests__/audit-engine.test.ts`
**What it covers:** Cursor Pro at $20/month for 1 seat (official price)
should return a keep action with zero savings. The engine must not
manufacture fake savings for already-optimal spend.
**How to run:** `npx jest -t "correct price"`

---

### Test 6 — Total savings calculation accuracy
**File:** `src/__tests__/audit-engine.test.ts`
**What it covers:** Total monthly savings must equal the sum of all
individual tool savings. Annual savings must equal monthly × 12.
Tests the aggregation math in runAudit().
**How to run:** `npx jest -t "Total monthly savings"`

---

### Test 7 — GitHub Copilot Enterprise downgrade
**File:** `src/__tests__/audit-engine.test.ts`
**What it covers:** GitHub Copilot Enterprise with 5 seats should recommend
downgrade to Business. Enterprise is cost-effective only at 20+ seats —
5 seats wastes $100/month on features the team cannot fully utilize.
**How to run:** `npx jest -t "GitHub Copilot"`

---

## What Is Not Tested

- **API routes** — not tested because they require a live Supabase connection.
  Would use MSW (Mock Service Worker) to mock Supabase in a future test suite.
- **UI components** — not tested with React Testing Library yet.
  Priority was audit engine correctness over component tests.
- **Groq API integration** — not tested because it requires a live API key.
  The fallback function `generateFallbackSummary()` is tested implicitly
  through the API failure path.

## Future Tests to Add

1. `should recommend switch to Cursor for coding-focused ChatGPT users`
2. `should surface Credex for OpenAI API spend over $500`
3. `should handle empty tools array without crashing`
4. `should handle zero monthly spend correctly`
5. `should recommend Windsurf Pro downgrade for small teams on Team plan`