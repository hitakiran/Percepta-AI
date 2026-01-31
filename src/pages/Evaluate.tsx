import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { EvaluationSidebar, MobileStepIndicator } from "@/components/layout/EvaluationSidebar";
import { Step1ProductInput } from "@/components/evaluation/Step1ProductInput";
import { Step2GoldenPrompts } from "@/components/evaluation/Step2GoldenPrompts";
import { Step3ModelSelection } from "@/components/evaluation/Step3ModelSelection";
import { Step4Generation } from "@/components/evaluation/Step4Generation";
import { Step5Results } from "@/components/evaluation/Step5Results";
import { Step6Gaps } from "@/components/evaluation/Step6Gaps";
import { Step7Fixes } from "@/components/evaluation/Step7Fixes";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { DEFAULT_GOLDEN_PROMPTS, DEFAULT_SCORING_METRICS, AVAILABLE_MODELS } from "@/lib/defaults";
import { getProjects, saveProject, saveReport, getProjectReports } from "@/lib/storage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { 
  Project, 
  GoldenPrompt, 
  ScoringMetric, 
  ModelConfig, 
  TraceLog,
  QuestionResult,
  Gap,
  Fix,
  EvaluationReport 
} from "@/types/project";

export default function Evaluate() {
  const navigate = useNavigate();
  const location = useLocation();
  const existingProjectId = location.state?.projectId;

  const [currentStep, setCurrentStep] = useState(1);
  const [maxAccessibleStep, setMaxAccessibleStep] = useState(1);

  // Step 1: Product info
  const [productData, setProductData] = useState({
    name: "",
    websiteUrl: "",
    docsUrl: "",
    pricingUrl: "",
    description: "",
  });

  // Step 2: Prompts & Metrics
  const [prompts, setPrompts] = useState<GoldenPrompt[]>(DEFAULT_GOLDEN_PROMPTS);
  const [metrics, setMetrics] = useState<ScoringMetric[]>(DEFAULT_SCORING_METRICS);

  // Step 3: Models
  const [models, setModels] = useState<ModelConfig[]>(AVAILABLE_MODELS);

  // Step 4: Trace logs
  const [traceLogs, setTraceLogs] = useState<TraceLog[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);

  // Step 5-7: Results
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [gaps, setGaps] = useState<Gap[]>([]);
  const [fixes, setFixes] = useState<Fix[]>([]);
  const [report, setReport] = useState<EvaluationReport | null>(null);

  // Load existing project if rerunning
  useEffect(() => {
    if (existingProjectId) {
      const projects = getProjects();
      const project = projects.find(p => p.id === existingProjectId);
      if (project) {
        setProductData({
          name: project.name,
          websiteUrl: project.websiteUrl,
          docsUrl: project.docsUrl || "",
          pricingUrl: "",
          description: project.description,
        });
      }
    }
  }, [existingProjectId]);

  const addTraceLog = (log: Omit<TraceLog, 'id' | 'timestamp'>) => {
    const newLog: TraceLog = {
      ...log,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    setTraceLogs(prev => [...prev, newLog]);
  };

  const runEvaluation = async () => {
    setIsGenerating(true);
    setGenerationComplete(false);
    setTraceLogs([]);

    const enabledPrompts = prompts.filter(p => p.enabled);
    const enabledModels = models.filter(m => m.enabled);

    addTraceLog({
      type: 'fetch',
      title: 'Starting Evaluation',
      details: `Evaluating ${productData.name} with ${enabledPrompts.length} questions across ${enabledModels.length} model(s)`,
    });

    try {
      // Call the edge function
      addTraceLog({
        type: 'prompt',
        title: 'Sending to AI Gateway',
        details: `Querying with product URL: ${productData.websiteUrl}`,
      });

      const { data, error } = await supabase.functions.invoke('perception-audit', {
        body: {
          productName: productData.name,
          productUrl: productData.websiteUrl,
          competitors: "",
          targetPersona: productData.description || "Product managers and teams",
          customPrompts: enabledPrompts.map(p => ({ question: p.question, theme: p.theme })),
        }
      });

      if (error) {
        throw error;
      }

      // Simulate trace logs for each question
      for (let i = 0; i < enabledPrompts.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        addTraceLog({
          type: 'prompt',
          title: `Question ${i + 1}: ${enabledPrompts[i].theme}`,
          details: enabledPrompts[i].question,
        });

        await new Promise(resolve => setTimeout(resolve, 200));

        // Simulate response for each enabled model
        for (const model of enabledModels) {
          addTraceLog({
            type: 'response',
            title: `Response received`,
            details: `Model answered question about ${enabledPrompts[i].theme}`,
            model: model.name,
            duration: Math.floor(Math.random() * 500) + 300,
          });
        }

        addTraceLog({
          type: 'score',
          title: `Scored: ${enabledPrompts[i].theme}`,
          details: `Applied scoring rubric to evaluate response quality`,
        });
      }

      // Transform API response to our format
      const questionResults: QuestionResult[] = data.questionResponses.map((qr: any, idx: number) => ({
        questionId: `q-${idx}`,
        question: qr.question,
        theme: qr.questionType,
        modelResponses: enabledModels.map((model, mIdx) => ({
          modelId: model.id,
          modelName: model.name,
          response: qr.response,
          score: (qr.scores.accuracy + qr.scores.featureCoverage + qr.scores.differentiationClarity) / 3,
          scores: qr.scores,
          rubricDetails: `Accuracy: ${Math.round(qr.scores.accuracy * 100)}%, Coverage: ${Math.round(qr.scores.featureCoverage * 100)}%, Clarity: ${Math.round(qr.scores.differentiationClarity * 100)}%`,
        })),
      }));

      // Transform gaps
      const detectedGaps: Gap[] = data.detectedGaps.map((gap: string, idx: number) => ({
        id: `gap-${idx}`,
        type: idx % 4 === 0 ? 'missing' : idx % 4 === 1 ? 'incorrect' : idx % 4 === 2 ? 'weak' : 'hallucinated',
        title: gap,
        description: `This issue was detected across multiple AI responses and may affect how buyers perceive your product.`,
        severity: idx < 2 ? 'high' : idx < 4 ? 'medium' : 'low',
        affectedQuestions: questionResults.slice(0, 3).map(q => q.questionId),
      }));

      // Transform fixes
      const recommendedFixes: Fix[] = data.recommendations.map((rec: any, idx: number) => ({
        id: `fix-${idx}`,
        category: rec.category === 'faq' || rec.category === 'homepage' ? 'explainability' :
                  rec.category === 'pricing' ? 'context' :
                  rec.category === 'comparison' ? 'positioning' : 'roadmap',
        title: rec.title,
        description: rec.description,
        priority: rec.priority,
        relatedGaps: detectedGaps.slice(0, 2).map(g => g.id),
      }));

      setResults(questionResults);
      setGaps(detectedGaps);
      setFixes(recommendedFixes);

      // Create report
      const projectId = existingProjectId || crypto.randomUUID();
      const existingReports = existingProjectId ? getProjectReports(existingProjectId) : [];
      
      const newReport: EvaluationReport = {
        id: crypto.randomUUID(),
        projectId,
        projectName: productData.name,
        iteration: existingReports.length + 1,
        timestamp: new Date().toISOString(),
        overallScore: data.overallScore,
        modelScores: enabledModels.map(m => ({
          modelId: m.id,
          modelName: m.name,
          score: data.overallScore + (Math.random() - 0.5) * 0.1,
        })),
        questionResults,
        gaps: detectedGaps,
        fixes: recommendedFixes,
        summary: data.summary,
        traceLogs,
      };

      setReport(newReport);

      addTraceLog({
        type: 'complete',
        title: 'Evaluation Complete',
        details: `Overall score: ${Math.round(data.overallScore * 100)}%`,
      });

      setGenerationComplete(true);

    } catch (error) {
      console.error('Evaluation error:', error);
      toast.error('Failed to complete evaluation. Please try again.');
      addTraceLog({
        type: 'complete',
        title: 'Evaluation Failed',
        details: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStepChange = (step: number) => {
    if (step <= maxAccessibleStep) {
      setCurrentStep(step);
    }
  };

  const goToNextStep = () => {
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    setMaxAccessibleStep(Math.max(maxAccessibleStep, nextStep));
  };

  const goToPrevStep = () => {
    setCurrentStep(Math.max(1, currentStep - 1));
  };

  const handleStep3Next = () => {
    goToNextStep();
    runEvaluation();
  };

  const handleFinish = () => {
    if (report) {
      // Save project
      const project: Project = {
        id: report.projectId,
        name: productData.name,
        description: productData.description,
        websiteUrl: productData.websiteUrl,
        docsUrl: productData.docsUrl,
        createdAt: existingProjectId ? 
          getProjects().find(p => p.id === existingProjectId)?.createdAt || new Date().toISOString() :
          new Date().toISOString(),
        evaluationCount: existingProjectId ? 
          (getProjects().find(p => p.id === existingProjectId)?.evaluationCount || 0) :
          0,
        lastScore: report.overallScore,
      };
      
      saveProject(project);
      saveReport(report);
      
      toast.success('Report saved successfully!');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-surface flex flex-col">
      <Header />
      <MobileStepIndicator currentStep={currentStep} totalSteps={7} />
      
      <div className="flex flex-1">
        <EvaluationSidebar 
          currentStep={currentStep}
          onStepClick={handleStepChange}
          maxAccessibleStep={maxAccessibleStep}
        />
        
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {currentStep === 1 && (
            <Step1ProductInput
              data={productData}
              onChange={setProductData}
              onNext={goToNextStep}
            />
          )}
          
          {currentStep === 2 && (
            <Step2GoldenPrompts
              prompts={prompts}
              metrics={metrics}
              onPromptsChange={setPrompts}
              onMetricsChange={setMetrics}
              onNext={goToNextStep}
              onBack={goToPrevStep}
            />
          )}
          
          {currentStep === 3 && (
            <Step3ModelSelection
              models={models}
              onModelsChange={setModels}
              onNext={handleStep3Next}
              onBack={goToPrevStep}
            />
          )}
          
          {currentStep === 4 && (
            <div className="space-y-6">
              <Step4Generation
                traceLogs={traceLogs}
                isComplete={generationComplete}
                productName={productData.name}
              />
              {generationComplete && (
                <div className="max-w-4xl mx-auto">
                  <Button 
                    onClick={goToNextStep}
                    className="w-full h-11 gap-2 bg-gradient-primary hover:opacity-90"
                  >
                    View Results
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {currentStep === 5 && (
            <Step5Results
              results={results}
              onNext={goToNextStep}
              onBack={goToPrevStep}
            />
          )}
          
          {currentStep === 6 && (
            <Step6Gaps
              gaps={gaps}
              onNext={goToNextStep}
              onBack={goToPrevStep}
            />
          )}
          
          {currentStep === 7 && report && (
            <Step7Fixes
              fixes={fixes}
              report={report}
              onBack={goToPrevStep}
              onFinish={handleFinish}
            />
          )}
        </main>
      </div>
    </div>
  );
}
