export const PRICING_DATA = {
  cursor: {
    hobby: { pricePerSeat: 0, name: 'Hobby' },
    pro: { pricePerSeat: 20, name: 'Pro' },
    business: { pricePerSeat: 40, name: 'Business' },
    enterprise: { pricePerSeat: 100, name: 'Enterprise' },
  },
  'github-copilot': {
    individual: { pricePerSeat: 10, name: 'Individual' },
    business: { pricePerSeat: 19, name: 'Business' },
    enterprise: { pricePerSeat: 39, name: 'Enterprise' },
  },
  claude: {
    free: { pricePerSeat: 0, name: 'Free' },
    pro: { pricePerSeat: 20, name: 'Pro' },
    max: { pricePerSeat: 100, name: 'Max' },
    team: { pricePerSeat: 30, name: 'Team' },
    enterprise: { pricePerSeat: 60, name: 'Enterprise' },
  },
  chatgpt: {
    free: { pricePerSeat: 0, name: 'Free' },
    plus: { pricePerSeat: 20, name: 'Plus' },
    team: { pricePerSeat: 30, name: 'Team' },
    enterprise: { pricePerSeat: 60, name: 'Enterprise' },
  },
  'anthropic-api': {
    'pay-as-you-go': { pricePerSeat: 0, name: 'Pay as you go' },
  },
  'openai-api': {
    'pay-as-you-go': { pricePerSeat: 0, name: 'Pay as you go' },
  },
  gemini: {
    free: { pricePerSeat: 0, name: 'Free' },
    pro: { pricePerSeat: 19.99, name: 'Pro' },
    ultra: { pricePerSeat: 249.99, name: 'Ultra' },
  },
  windsurf: {
    free: { pricePerSeat: 0, name: 'Free' },
    pro: { pricePerSeat: 15, name: 'Pro' },
    team: { pricePerSeat: 35, name: 'Team' },
    enterprise: { pricePerSeat: 60, name: 'Enterprise' },
  },
} as const

// Minimum team size recommendations per plan
export const PLAN_MIN_SEATS: Record<string, number> = {
  'github-copilot-business': 1,
  'github-copilot-enterprise': 20,
  'cursor-business': 5,
  'cursor-enterprise': 20,
  'claude-team': 5,
  'chatgpt-team': 2,
}

// Alternative tool suggestions by use case
export const ALTERNATIVES: Record<string, Record<string, string[]>> = {
  coding: {
    cursor: ['windsurf', 'github-copilot'],
    'github-copilot': ['cursor', 'windsurf'],
    windsurf: ['cursor', 'github-copilot'],
  },
  writing: {
    chatgpt: ['claude'],
    claude: ['chatgpt'],
  },
  research: {
    chatgpt: ['claude', 'gemini'],
    claude: ['chatgpt', 'gemini'],
    gemini: ['claude', 'chatgpt'],
  },
  data: {
    chatgpt: ['claude', 'gemini'],
    gemini: ['chatgpt', 'claude'],
  },
  mixed: {
    chatgpt: ['claude'],
    claude: ['chatgpt'],
  },
}