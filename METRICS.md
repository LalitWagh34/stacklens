# Metrics

## North Star Metric

**Audits completed per week**

This is the single number that drives everything else. An audit completed means
a user saw value — they filled in their stack and got a result. It is the top
of the funnel for every downstream outcome: email captures, consultation bookings,
credit purchases, and viral shares.

Why not "email captures" or "consultations booked"? Because those are downstream
of value delivery. If audits are growing, everything else follows. If audits
plateau, no amount of conversion optimization fixes the root problem.

Why not "DAU"? StackLens is not a daily-use product. A founder audits their
stack once, maybe once a quarter when they hire new engineers or add tools.
DAU would be a vanity metric here. Weekly audits completed is more honest
and more actionable.

---

## 3 Input Metrics That Drive the North Star

### 1. Audit Start Rate
**Definition:** % of homepage visitors who add at least one tool and click
"Run Free Audit"

**Why it matters:** If people land on the page and don't start the audit,
the problem is either the headline, the form UX, or the trust signal.
This metric tells us where in the top-of-funnel we're losing people.

**Target:** 40% of homepage visitors start an audit
**Current benchmark:** Unknown — instrument on day 1

---

### 2. Email Capture Rate
**Definition:** % of completed audits where the user submits their email

**Why it matters:** This is the monetization lever. No email = no lead =
no Credex consultation = no revenue. If this is low, either the audit
results aren't impressive enough, or the email ask is too early/too aggressive.

**Target:** 20% of completed audits → email submitted
**Red flag:** Below 10% means the value proposition isn't landing

---

### 3. Viral Share Rate
**Definition:** % of completed audits where the user copies or visits
their shareable audit URL

**Why it matters:** Organic sharing is the only growth channel that
scales to $0. One founder sharing their audit result on Twitter can
drive 10–50 new audits. This metric tells us if the product has
word-of-mouth potential.

**Target:** 15% of completed audits result in the URL being shared
**How to measure:** Track clicks on the "Copy link" button on the results page

---

## What to Instrument First

In priority order:

1. **Audit funnel events**
   - `audit_started` — user clicks "Run Free Audit"
   - `audit_completed` — results page loads with a real UUID
   - `audit_shared` — user clicks "Copy link" on results page
   - `email_submitted` — lead capture form submitted

2. **Results page engagement**
   - Time on results page
   - Scroll depth (did they read the per-tool breakdown?)
   - Credex CTA click rate (for >$500 savings audits)

3. **Email funnel**
   - Email open rate on confirmation email
   - Click rate on "View Full Report" link in email

**Tool recommendation:** Posthog (open source, free tier, easy Next.js integration).
Add `posthog-js` and instrument these 4 events in w