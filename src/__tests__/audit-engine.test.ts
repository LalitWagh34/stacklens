import { runAudit } from '@/lib/audit-engine'
import { AuditInput } from '@/types'

// Test 1: Cursor Business with small team should recommend downgrade
test('Cursor Business with 2 seats recommends downgrade to Pro', () => {
  const input: AuditInput = {
    tools: [{ tool: 'cursor', plan: 'business', monthlySpend: 80, seats: 2 }],
    teamSize: 2,
    useCase: 'coding',
  }
  const result = runAudit(input)
  expect(result.results[0].recommendation.action).toBe('downgrade')
  expect(result.results[0].recommendation.monthlySavings).toBe(40)
})

// Test 2: ChatGPT Team with 1 seat should recommend downgrade to Plus
test('ChatGPT Team with 1 seat recommends downgrade to Plus', () => {
  const input: AuditInput = {
    tools: [{ tool: 'chatgpt', plan: 'team', monthlySpend: 30, seats: 1 }],
    teamSize: 1,
    useCase: 'writing',
  }
  const result = runAudit(input)
  expect(result.results[0].recommendation.action).toBe('downgrade')
  expect(result.results[0].recommendation.monthlySavings).toBe(10)
})

// Test 3: Overpaying vs official price triggers optimize
test('Cursor Pro at $500 for 1 seat triggers optimize recommendation', () => {
  const input: AuditInput = {
    tools: [{ tool: 'cursor', plan: 'pro', monthlySpend: 500, seats: 1 }],
    teamSize: 1,
    useCase: 'coding',
  }
  const result = runAudit(input)
  expect(result.results[0].recommendation.action).toBe('optimize')
  expect(result.results[0].recommendation.monthlySavings).toBeGreaterThan(0)
})

// Test 4: Anthropic API over $100 triggers credits recommendation
test('Anthropic API over $100/mo triggers credits optimization', () => {
  const input: AuditInput = {
    tools: [{ tool: 'anthropic-api', plan: 'pay-as-you-go', monthlySpend: 200, seats: 1 }],
    teamSize: 2,
    useCase: 'mixed',
  }
  const result = runAudit(input)
  expect(result.results[0].recommendation.action).toBe('optimize')
  expect(result.results[0].recommendation.monthlySavings).toBe(40)
})

// Test 5: Well-optimized stack returns keep action
test('Cursor Pro at correct price for small team returns keep', () => {
  const input: AuditInput = {
    tools: [{ tool: 'cursor', plan: 'pro', monthlySpend: 20, seats: 1 }],
    teamSize: 1,
    useCase: 'coding',
  }
  const result = runAudit(input)
  expect(result.results[0].recommendation.action).toBe('keep')
  expect(result.results[0].recommendation.monthlySavings).toBe(0)
})

// Test 6: Total savings calculation is correct
test('Total monthly savings sums all tool savings correctly', () => {
  const input: AuditInput = {
    tools: [
      { tool: 'cursor', plan: 'business', monthlySpend: 80, seats: 2 },
      { tool: 'chatgpt', plan: 'team', monthlySpend: 30, seats: 1 },
    ],
    teamSize: 2,
    useCase: 'coding',
  }
  const result = runAudit(input)
  expect(result.totalMonthlySavings).toBe(result.results.reduce((sum, r) => sum + r.recommendation.monthlySavings, 0))
  expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12)
})

// Test 7: GitHub Copilot Enterprise with small team recommends downgrade
test('GitHub Copilot Enterprise with 5 seats recommends downgrade to Business', () => {
  const input: AuditInput = {
    tools: [{ tool: 'github-copilot', plan: 'enterprise', monthlySpend: 195, seats: 5 }],
    teamSize: 5,
    useCase: 'coding',
  }
  const result = runAudit(input)
  expect(result.results[0].recommendation.action).toBe('downgrade')
  expect(result.results[0].recommendation.monthlySavings).toBe(100)
})