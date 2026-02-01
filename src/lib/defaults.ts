import type { GoldenPrompt, ScoringMetric, ModelConfig, RubricCell } from '@/types/project';

// These are GENERATED based on product/competitor inputs, not static defaults
export const DEFAULT_GOLDEN_PROMPTS: GoldenPrompt[] = [];

export const DEFAULT_SCORING_METRICS: ScoringMetric[] = [
  { 
    id: '1', 
    name: 'Attribution', 
    description: 'Does the AI mention and recommend your product?', 
    weight: 0.35,
    rubric: [
      { score: 0, description: 'Mentions no brand.' },
      { score: 1, description: 'Mentions others only.' },
      { score: 2, description: 'Mentions your product + others.' },
      { score: 3, description: 'Your product is the primary recommendation.' },
    ]
  },
  { 
    id: '2', 
    name: 'Accuracy', 
    description: 'How factually correct is the information provided?', 
    weight: 0.30,
    rubric: [
      { score: 0, description: 'Factually wrong.' },
      { score: 1, description: 'Generic/Outdated info.' },
      { score: 2, description: 'Correct but missing nuance.' },
      { score: 3, description: 'Includes latest "Golden Set" specs.' },
    ]
  },
  { 
    id: '3', 
    name: 'Differentiation', 
    description: 'How clearly does it distinguish your product from alternatives?', 
    weight: 0.35,
    rubric: [
      { score: 0, description: 'Says everyone is the same.' },
      { score: 1, description: 'Lists your product features.' },
      { score: 2, description: 'Explains an advantage of your product.' },
      { score: 3, description: 'Explains why your product is better than others.' },
    ]
  },
];

export const AVAILABLE_MODELS: ModelConfig[] = [
  { id: 'gpt-5-mini', name: 'GPT-5 Mini', provider: 'OpenAI', enabled: true, temperature: 0.7 },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', enabled: false, temperature: 0.7 },
];

// Helper to generate questions based on product info
export function generateGoldenPrompts(
  productName: string, 
  competitors: string[], 
  persona: { role: string; teamType: string; companySize: string }
): GoldenPrompt[] {
  const prompts: GoldenPrompt[] = [];
  let id = 1;
  
  // Core positioning questions
  prompts.push({
    id: String(id++),
    question: `What is ${productName} and what core problem does it solve?`,
    theme: 'Core Positioning',
    enabled: true,
  });
  
  // Competitor comparison questions
  if (competitors.length > 0) {
    competitors.forEach(competitor => {
      prompts.push({
        id: String(id++),
        question: `How does ${productName} compare to ${competitor}?`,
        theme: 'Competitor Comparison',
        enabled: true,
      });
    });
  }
  
  // Persona-specific questions
  prompts.push({
    id: String(id++),
    question: `Why would a ${persona.role} at a ${persona.companySize} ${persona.teamType} team choose ${productName}?`,
    theme: 'Target Persona Fit',
    enabled: true,
  });
  
  // Feature value questions
  prompts.push({
    id: String(id++),
    question: `What are the most valuable features of ${productName} and why do they matter?`,
    theme: 'Feature Value',
    enabled: true,
  });
  
  // Use case questions
  prompts.push({
    id: String(id++),
    question: `What are the best use cases for ${productName}?`,
    theme: 'Use Cases',
    enabled: true,
  });
  
  // Limitations
  prompts.push({
    id: String(id++),
    question: `What are the limitations or constraints of ${productName}?`,
    theme: 'Constraints',
    enabled: true,
  });
  
  // Pricing
  prompts.push({
    id: String(id++),
    question: `What is the pricing model for ${productName} and is it good value?`,
    theme: 'Pricing',
    enabled: true,
  });
  
  // Anti-use case
  prompts.push({
    id: String(id++),
    question: `When should someone NOT use ${productName}?`,
    theme: 'Anti-use Cases',
    enabled: true,
  });
  
  return prompts;
}
