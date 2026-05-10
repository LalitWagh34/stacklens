# Economics

## What a Converted Lead is Worth to Credex

Credex sells discounted AI infrastructure credits. Based on publicly available
information about AI tool pricing and typical discount margins:

- Average AI tool spend per startup: $500–$2,000/month
- Credex discount offered: ~20–30% off retail
- Average credit purchase size: $1,000–$5,000 upfront
- Credex margin on credits: estimated 15–25%

**Estimated revenue per converted customer:**
- Small team (5–10 people): $1,000 credit purchase → $150–$250 margin
- Mid-size team (10–30 people): $3,000 credit purchase → $450–$750 margin
- Repeat purchase rate: assume 60% repurchase within 6 months

**Lifetime Value (LTV) estimate:**
- Average LTV per customer: $400–$800 (2 purchases, 20% margin)
- Conservative estimate used in model below: **$500 LTV per customer**

---

## CAC at Each Channel

| Channel | Est. Users/Month | Est. Leads | Est. Consultations | CAC |
|---|---|---|---|---|
| Hacker News Show HN | 300 | 60 | 6 | $0 |
| Reddit (r/SaaS, r/startups) | 150 | 30 | 3 | $0 |
| Indie Hackers post | 100 | 20 | 2 | $0 |
| Twitter cold DM outreach | 50 | 10 | 1 | $0 |
| Credex existing customer email | 500 | 100 | 15 | $0 |
| dev.to / Hashnode blog post | 200 | 40 | 4 | $0 |

**Total Month 1 (organic only):** ~1,300 visitors, ~260 leads, ~31 consultations

All channels above are $0 paid budget. CAC is effectively $0 in cash —
only time cost (estimated 10–15 hours/week of content and outreach).

If time is valued at $50/hour:
- Time cost: ~$2,500/month
- Consultations booked: 31
- **Effective CAC: ~$80 per consultation**

At $500 LTV, this is a **6.25x return on time investment**.

---

## Conversion Funnel Math

```
Audit completed:        1,000  (100%)
↓
Email captured:           200  (20% — value shown before ask)
↓
Consultation booked:       20  (10% of email captures, shown only for >$500 savings)
↓
Credit purchase:            8  (40% close rate on consultations)
↓
Revenue to Credex:     $4,000  (8 customers × $500 avg margin)
```

**Key conversion rates to hit:**
- Audit → Email: 20% (industry benchmark for free tools: 15–25%)
- Email → Consultation: 10% (only high-savings cases are shown the CTA)
- Consultation → Purchase: 40% (warm lead, already knows their savings number)

**The leverage point:** The tool self-qualifies leads. Only users with >$500/month
in savings see the Credex CTA. These are the highest-intent leads possible —
they already know exactly how much they could save and Credex is presented as
the solution at the moment of maximum motivation.

---

## Path to $1M ARR in 18 Months

**Target:** $1,000,000 ARR = ~$83,333/month in revenue to Credex

Working backwards:
- Average revenue per customer per year: $500 LTV × 2 purchases = $1,000
- Customers needed: 1,000 customers in 18 months = ~56 new customers/month

**Month-by-month model:**

| Period | Monthly Audits | Email Captures | Consultations | New Customers | Cumulative Customers |
|---|---|---|---|---|---|
| Month 1–3 | 500 | 100 | 10 | 4 | 12 |
| Month 4–6 | 1,500 | 300 | 30 | 12 | 48 |
| Month 7–9 | 3,000 | 600 | 60 | 24 | 120 |
| Month 10–12 | 6,000 | 1,200 | 120 | 48 | 336 |
| Month 13–15 | 10,000 | 2,000 | 200 | 80 | 576 |
| Month 16–18 | 15,000 | 3,000 | 300 | 120 | 936 |

**What has to be true for this to work:**

1. **Viral coefficient > 0.3** — At least 30% of users share their audit result URL.
   The shareable URL with Open Graph preview is built for this. If a founder tweets
   "StackLens found $600/month in savings in my AI stack" that drives 10–50 new audits.

2. **Credex customer email converts at 3%** — Credex emails 500 existing customers,
   15 book consultations, 6 purchase. This alone drives $3,000 in month 1 revenue.

3. **HN traction in month 1** — One successful Show HN post drives 500–2,000 visitors.
   At 20% email capture that's 100–400 leads from a single post.

4. **Retention on credits** — Customers repurchase credits every 4–6 months as they
   run out. 60% repurchase rate assumed. Without this the LTV math breaks.

5. **Pricing data stays accurate** — If our audit engine gives wrong recommendations
   due to stale pricing, trust collapses. Need a monthly pricing audit process.

---

## What Breaks the Model

- Email capture rate drops below 10% → funnel economics collapse
- Consultation → purchase rate below 20% → CAC exceeds LTV
- Viral sharing doesn't happen → growth stays linear, not exponential
- Credex can't fulfill discounted credits at scale → product-market fit breaks

**The single biggest risk:** Trust. If one user tweets that our savings numbers
are wrong, it poisons the well. Pricing accuracy is not a nice-to-have —
it is the business model.