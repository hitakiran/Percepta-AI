import type { GoldenPrompt, ScoringMetric, ModelConfig } from '@/types/project';

export const DEFAULT_GOLDEN_PROMPTS: GoldenPrompt[] = [
  { id: '1', question: 'What is this product and what does it do?', theme: 'Core Positioning', enabled: true },
  { id: '2', question: 'Who is the primary target user for this product?', theme: 'Target Audience', enabled: true },
  { id: '3', question: 'What are the main use cases for this product?', theme: 'Use Cases', enabled: true },
  { id: '4', question: 'What constraints or limitations does this product have?', theme: 'Constraints', enabled: true },
  { id: '5', question: 'How does this product scale for different team sizes?', theme: 'Scalability', enabled: true },
  { id: '6', question: 'What makes this product different from competitors?', theme: 'Differentiation', enabled: true },
  { id: '7', question: 'What is the pricing model for this product?', theme: 'Pricing', enabled: true },
  { id: '8', question: 'When should someone NOT use this product?', theme: 'Anti-use Cases', enabled: true },
];

export const DEFAULT_SCORING_METRICS: ScoringMetric[] = [
  { id: '1', name: 'Accuracy', description: 'How factually correct is the response compared to official product information?', weight: 0.35 },
  { id: '2', name: 'Feature Coverage', description: 'Does the response mention key features and capabilities correctly?', weight: 0.30 },
  { id: '3', name: 'Differentiation Clarity', description: 'How clearly does the response distinguish this product from alternatives?', weight: 0.20 },
  { id: '4', name: 'Recency', description: 'Is the information current or does it reference outdated features/pricing?', weight: 0.15 },
];

export const AVAILABLE_MODELS: ModelConfig[] = [
  { id: 'gemini-flash', name: 'Gemini 3 Flash', provider: 'Google', enabled: true, temperature: 0.7 },
  { id: 'gemini-pro', name: 'Gemini 2.5 Pro', provider: 'Google', enabled: false, temperature: 0.7 },
  { id: 'gpt5-mini', name: 'GPT-5 Mini', provider: 'OpenAI', enabled: true, temperature: 0.7 },
  { id: 'gpt5', name: 'GPT-5', provider: 'OpenAI', enabled: false, temperature: 0.7 },
];
