export interface AuditInput {
  productName: string;
  productUrl: string;
  competitors?: string;
  targetPersona: string;
}

export interface QuestionResponse {
  question: string;
  questionType: string;
  response: string;
  scores: {
    accuracy: number;
    featureCoverage: number;
    differentiationClarity: number;
  };
  risks: string[];
}

export interface AuditReport {
  runId: string;
  productName: string;
  summary: string;
  overallScore: number;
  questionResponses: QuestionResponse[];
  detectedGaps: string[];
  recommendations: {
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    category: 'faq' | 'homepage' | 'pricing' | 'comparison' | 'messaging';
  }[];
  timestamp: string;
}
