export interface Project {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  docsUrl?: string;
  pricingUrl?: string;
  createdAt: string;
  evaluationCount: number;
  lastScore?: number;
}

export interface GoldenPrompt {
  id: string;
  question: string;
  theme: string;
  enabled: boolean;
}

export interface ScoringMetric {
  id: string;
  name: string;
  description: string;
  weight: number;
}

export interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  enabled: boolean;
  temperature: number;
}

export interface TraceLog {
  id: string;
  timestamp: string;
  type: 'fetch' | 'prompt' | 'response' | 'score' | 'complete';
  title: string;
  details: string;
  model?: string;
  duration?: number;
}

export interface ModelResponse {
  modelId: string;
  modelName: string;
  response: string;
  score: number;
  scores: {
    accuracy: number;
    featureCoverage: number;
    differentiationClarity: number;
  };
  rubricDetails?: string;
}

export interface QuestionResult {
  questionId: string;
  question: string;
  theme: string;
  modelResponses: ModelResponse[];
}

export interface Gap {
  id: string;
  type: 'missing' | 'incorrect' | 'weak' | 'hallucinated';
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  affectedQuestions: string[];
}

export interface Fix {
  id: string;
  category: 'context' | 'explainability' | 'positioning' | 'roadmap';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  relatedGaps: string[];
}

export interface EvaluationReport {
  id: string;
  projectId: string;
  projectName: string;
  iteration: number;
  timestamp: string;
  overallScore: number;
  modelScores: { modelId: string; modelName: string; score: number }[];
  questionResults: QuestionResult[];
  gaps: Gap[];
  fixes: Fix[];
  summary: string;
  traceLogs: TraceLog[];
}

export interface EvaluationState {
  currentStep: number;
  project: Partial<Project>;
  prompts: GoldenPrompt[];
  metrics: ScoringMetric[];
  selectedModels: ModelConfig[];
  traceLogs: TraceLog[];
  results: QuestionResult[];
  gaps: Gap[];
  fixes: Fix[];
  report?: EvaluationReport;
}
