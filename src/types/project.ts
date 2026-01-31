export interface Project {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  docsUrl?: string;
  pricingUrl?: string;
  competitors: string[];
  targetPersona: TargetPersona;
  createdAt: string;
  evaluationCount: number;
  lastScore?: number;
}

export interface TargetPersona {
  role: string;
  teamType: string;
  companySize: string;
  industry?: string;
}

export interface GoldenPrompt {
  id: string;
  question: string;
  theme: string;
  enabled: boolean;
}

export interface RubricCell {
  score: number;
  description: string;
}

export interface ScoringMetric {
  id: string;
  name: string;
  description: string;
  weight: number;
  rubric: RubricCell[];
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
  type: 'fetch' | 'extract' | 'prompt' | 'response' | 'score' | 'complete' | 'uncertainty';
  title: string;
  details: string;
  model?: string;
  duration?: number;
  source?: string;
}

export interface ExtractedInfo {
  category: string;
  content: string;
  source: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface SourceFetch {
  url: string;
  status: 'success' | 'failed' | 'partial';
  extractedInfo: ExtractedInfo[];
}

export interface DataUncertainty {
  field: string;
  issue: string;
  impact: 'high' | 'medium' | 'low';
}

export interface ModelResponse {
  modelId: string;
  modelName: string;
  response: string;
  score: number;
  metricScores: {
    metricId: string;
    metricName: string;
    score: number; // 0-3
    reasoning: string;
  }[];
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
  businessImpact: string;
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
  sourceFetches?: SourceFetch[];
  uncertainties?: DataUncertainty[];
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
