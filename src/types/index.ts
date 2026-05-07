export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed'

export type ToolName =
  | 'cursor'
  | 'github-copilot'
  | 'claude'
  | 'chatgpt'
  | 'anthropic-api'
  | 'openai-api'
  | 'gemini'
  | 'windsurf'

export interface ToolInput {
  tool: ToolName
  plan: string
  monthlySpend: number
  seats: number
}

export interface AuditInput {
  tools: ToolInput[]
  teamSize: number
  useCase: UseCase
}

export interface Recommendation {
  action: 'downgrade' | 'switch' | 'optimize' | 'keep'
  description: string
  suggestedTool?: string
  suggestedPlan?: string
  monthlySavings: number
  reason: string
}

export interface ToolAuditResult {
  tool: ToolName
  plan: string
  currentMonthlySpend: number
  recommendation: Recommendation
}

export interface AuditResult {
  id?: string
  input: AuditInput
  results: ToolAuditResult[]
  totalMonthlySavings: number
  totalAnnualSavings: number
  summary?: string
  createdAt?: string
}