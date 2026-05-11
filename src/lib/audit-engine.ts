import { AuditInput, AuditResult, ToolAuditResult, Recommendation, ToolName } from '@/types'
import { PRICING_DATA } from './pricing-data'

function getOfficialPricePerSeat(tool: ToolName, plan: string): number {
  const toolData = PRICING_DATA[tool] as Record<string, { pricePerSeat: number }>
  if (!toolData) return 0
  const planData = toolData[plan.toLowerCase().replace(/\s+/g, '-')]
  return planData?.pricePerSeat ?? 0
}

function auditTool(
  tool: ToolName,
  plan: string,
  monthlySpend: number,
  seats: number,
  teamSize: number,
  useCase: string
): Recommendation {
  plan = plan.toLowerCase().replace(/\s+/g, '-')
  const officialPrice = getOfficialPricePerSeat(tool, plan) * seats
  const overpaying = monthlySpend > officialPrice * 1.1
  

  // --- CURSOR ---
  if (tool === 'cursor') {
    if (plan === 'business' && seats <= 3) {
      const savings = (40 - 20) * seats
      return {
        action: 'downgrade',
        description: 'Downgrade to Cursor Pro',
        suggestedPlan: 'Pro',
        monthlySavings: savings,
        reason: `Cursor Business is designed for teams of 5+. With ${seats} seats, Pro gives you the same core features at $20/seat vs $40/seat.`,
      }
    }
    if (plan === 'enterprise' && seats <= 10) {
      const savings = (100 - 40) * seats
      return {
        action: 'downgrade',
        description: 'Downgrade to Cursor Business',
        suggestedPlan: 'Business',
        monthlySavings: savings,
        reason: `Cursor Enterprise is built for large orgs. With ${seats} seats, Business plan covers all essential team features at $40/seat.`,
      }
    }
    if (useCase === 'writing' || useCase === 'research') {
      return {
        action: 'switch',
        description: 'Consider Claude Pro for your use case',
        suggestedTool: 'claude',
        suggestedPlan: 'Pro',
        monthlySavings: Math.max(0, monthlySpend - 20 * seats),
        reason: `Cursor is optimized for coding. For ${useCase}, Claude Pro at $20/seat provides better value with superior language capabilities.`,
      }
    }
  }

  // --- GITHUB COPILOT ---
  if (tool === 'github-copilot') {
    if (plan === 'enterprise' && seats < 20) {
      const savings = (39 - 19) * seats
      return {
        action: 'downgrade',
        description: 'Downgrade to GitHub Copilot Business',
        suggestedPlan: 'Business',
        monthlySavings: savings,
        reason: `Copilot Enterprise is cost-effective at 20+ seats. At ${seats} seats, Business plan at $19/seat covers all core AI coding features.`,
      }
    }
    if (plan === 'business' && seats === 1) {
      return {
        action: 'downgrade',
        description: 'Switch to GitHub Copilot Individual',
        suggestedPlan: 'Individual',
        monthlySavings: 9,
        reason: `Copilot Business is for teams. As a solo user, Individual plan at $10/month gives identical coding assistance.`,
      }
    }
    if (useCase === 'coding' && seats >= 3) {
      const cursorCost = 20 * seats
      if (monthlySpend > cursorCost) {
        return {
          action: 'switch',
          description: 'Switch to Cursor Pro',
          suggestedTool: 'cursor',
          suggestedPlan: 'Pro',
          monthlySavings: monthlySpend - cursorCost,
          reason: `Cursor Pro at $20/seat offers a more capable coding agent with better context awareness than Copilot for teams of ${seats}.`,
        }
      }
    }
  }

  // --- CLAUDE ---
  if (tool === 'claude') {
    if (plan === 'team' && seats <= 2) {
      const savings = (30 - 20) * seats
      return {
        action: 'downgrade',
        description: 'Downgrade to Claude Pro',
        suggestedPlan: 'Pro',
        monthlySavings: savings,
        reason: `Claude Team adds collaboration features worthwhile at 5+ users. With ${seats} seats, Pro at $20/seat gives the same AI capability.`,
      }
    }
    if (plan === 'max' && useCase === 'coding') {
      return {
        action: 'switch',
        description: 'Switch to Cursor Pro for coding',
        suggestedTool: 'cursor',
        suggestedPlan: 'Pro',
        monthlySavings: Math.max(0, (100 - 20) * seats),
        reason: `Claude Max at $100/seat is powerful but Cursor Pro at $20/seat is purpose-built for coding with IDE integration.`,
      }
    }
    if (plan === 'pro' || plan === 'team') {
      if (overpaying) {
        return {
          action: 'optimize',
          description: 'You may be overpaying vs official pricing',
          monthlySavings: monthlySpend - officialPrice,
          reason: `Official Claude ${plan} pricing is $${officialPrice}/mo for ${seats} seats. You entered $${monthlySpend} — verify your billing.`,
        }
      }
    }
  }

  // --- CHATGPT ---
  if (tool === 'chatgpt') {
    if (plan === 'team' && seats <= 2) {
      const savings = (30 - 20) * seats
      return {
        action: 'downgrade',
        description: 'Downgrade to ChatGPT Plus',
        suggestedPlan: 'Plus',
        monthlySavings: savings,
        reason: `ChatGPT Team is designed for collaboration at 3+ users. With ${seats} seats, Plus at $20/seat gives full GPT-4o access.`,
      }
    }
    if (plan === 'enterprise' && seats < 10) {
      return {
        action: 'downgrade',
        description: 'Downgrade to ChatGPT Team',
        suggestedPlan: 'Team',
        monthlySavings: Math.max(0, monthlySpend - 30 * seats),
        reason: `ChatGPT Enterprise is designed for large orgs (10+ seats). Team plan covers all essential features at $30/seat.`,
      }
    }
    if ((useCase === 'coding') && seats >= 2) {
      const cursorCost = 20 * seats
      if (monthlySpend > cursorCost) {
        return {
          action: 'switch',
          description: 'Switch to Cursor Pro for coding',
          suggestedTool: 'cursor',
          suggestedPlan: 'Pro',
          monthlySavings: monthlySpend - cursorCost,
          reason: `For coding-focused teams, Cursor Pro at $20/seat provides purpose-built IDE integration vs ChatGPT's general interface.`,
        }
      }
    }
  }

  // --- GEMINI ---
  if (tool === 'gemini') {
    if (plan === 'ultra' && useCase !== 'data' && useCase !== 'research') {
      const savings = (249.99 - 19.99) * seats
      return {
        action: 'downgrade',
        description: 'Downgrade to Gemini Pro',
        suggestedPlan: 'Pro',
        monthlySavings: Math.round(savings),
        reason: `Gemini Ultra at $249.99/seat is optimized for complex data and research tasks. For ${useCase}, Pro at $19.99/seat is sufficient.`,
      }
    }
  }

  // --- WINDSURF ---
  if (tool === 'windsurf') {
    if (plan === 'team' && seats <= 2) {
      return {
        action: 'downgrade',
        description: 'Downgrade to Windsurf Pro',
        suggestedPlan: 'Pro',
        monthlySavings: (35 - 15) * seats,
        reason: `Windsurf Team features are valuable at 3+ seats. With ${seats} seats, Pro at $15/seat gives full AI coding capability.`,
      }
    }
  }

  // --- API tools ---
  if (tool === 'anthropic-api' || tool === 'openai-api') {
    if (monthlySpend > 100) {
      return {
        action: 'optimize',
        description: 'High API spend detected — credits could save you money',
        monthlySavings: Math.round(monthlySpend * 0.2),
        reason: `At $${monthlySpend}/mo in API costs, buying discounted credits through Credex could save ~20% or $${Math.round(monthlySpend * 0.2)}/mo.`,
      }
    }
  }
    if (officialPrice > 0 && monthlySpend > officialPrice * 1.15) {
    return {
      action: 'optimize',
      description: 'You may be overpaying vs official pricing',
      monthlySavings: Math.round(monthlySpend - officialPrice),
      reason: `Official ${tool} ${plan} pricing is $${officialPrice}/mo for ${seats} seat(s). You entered $${monthlySpend} — verify your billing or check for unused seats.`,
    }
  }

  // Default: already optimal
  return {
    action: 'keep',
    description: 'Your current plan looks well-optimized',
    monthlySavings: 0,
    reason:`Your current plan is appropriately sized for your team of ${teamSize} with a ${useCase} use case.`,
  }
}

export function runAudit(input: AuditInput): AuditResult {
  const results: ToolAuditResult[] = input.tools.map((t) => ({
    tool: t.tool,
    plan: t.plan,
    currentMonthlySpend: t.monthlySpend,
    recommendation: auditTool(
      t.tool,
      t.plan,
      t.monthlySpend,
      t.seats,
      input.teamSize,
      input.useCase
    ),
  }))

  const totalMonthlySavings = results.reduce(
    (sum, r) => sum + r.recommendation.monthlySavings,
    0
  )

  return {
    input,
    results,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
  }
}