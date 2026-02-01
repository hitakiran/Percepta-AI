import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { EvaluationSidebar, MobileStepIndicator } from "@/components/layout/EvaluationSidebar";
import { Step1ProductInput } from "@/components/evaluation/Step1ProductInput";
import { Step2SourceTrace } from "@/components/evaluation/Step2SourceTrace";
import { Step3GoldenPrompts } from "@/components/evaluation/Step3GoldenPrompts";
import { Step4ScoringRubric } from "@/components/evaluation/Step4ScoringRubric";
import { Step5ModelSelection } from "@/components/evaluation/Step5ModelSelection";
import { Step4Generation } from "@/components/evaluation/Step4Generation";
import { Step5Results } from "@/components/evaluation/Step5Results";
import { Step6Gaps } from "@/components/evaluation/Step6Gaps";
import { Step7Fixes } from "@/components/evaluation/Step7Fixes";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { DEFAULT_SCORING_METRICS, AVAILABLE_MODELS, generateGoldenPrompts } from "@/lib/defaults";
import { getProjects, saveProject, saveReport, getProjectReports } from "@/lib/storage";
import { supabase } from "@/integrations/supabase/client";
import { runPerceptionAudit } from "@/lib/audit-service";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import type { 
  Project, 
  GoldenPrompt, 
  ScoringMetric, 
  ModelConfig, 
  TraceLog,
  QuestionResult,
  Gap,
  Fix,
  EvaluationReport,
  SourceFetch,
  DataUncertainty,
  TargetPersona
} from "@/types/project";

export default function Evaluate() {
  const navigate = useNavigate();
  const location = useLocation();
  const existingProjectId = location.state?.projectId;
  const viewReportId = location.state?.reportId;
  const viewMode = location.state?.viewMode;

  const [currentStep, setCurrentStep] = useState(1);
  const [maxAccessibleStep, setMaxAccessibleStep] = useState(1);

  // Step 1: Product info
  const [productData, setProductData] = useState<{
    name: string;
    websiteUrl: string;
    docsUrl: string;
    pricingUrl: string;
    description: string;
    competitors: string[];
    targetPersona: TargetPersona;
  }>({
    name: "",
    websiteUrl: "",
    docsUrl: "",
    pricingUrl: "",
    description: "",
    competitors: [],
    targetPersona: {
      role: "",
      teamType: "",
      companySize: "",
    },
  });

  // Step 2: Source fetches
  const [sourceFetches, setSourceFetches] = useState<SourceFetch[]>([]);
  const [uncertainties, setUncertainties] = useState<DataUncertainty[]>([]);
  const [isLoadingSources, setIsLoadingSources] = useState(false);

  // Step 3: Prompts
  const [prompts, setPrompts] = useState<GoldenPrompt[]>([]);
  
  // Step 4: Metrics
  const [metrics, setMetrics] = useState<ScoringMetric[]>(DEFAULT_SCORING_METRICS);

  // Step 5: Models
  const [models, setModels] = useState<ModelConfig[]>(AVAILABLE_MODELS);

  // Step 6: Trace logs
  const [traceLogs, setTraceLogs] = useState<TraceLog[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);

  // Step 7-9: Results
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [gaps, setGaps] = useState<Gap[]>([]);
  const [fixes, setFixes] = useState<Fix[]>([]);
  const [report, setReport] = useState<EvaluationReport | null>(null);
  const [overallScore, setOverallScore] = useState(0);

  // Load existing project and potentially a specific report
  useEffect(() => {
    if (existingProjectId) {
      const projects = getProjects();
      const project = projects.find(p => p.id === existingProjectId);
      if (project) {
        setProductData({
          name: project.name,
          websiteUrl: project.websiteUrl,
          docsUrl: project.docsUrl || "",
          pricingUrl: project.pricingUrl || "",
          description: project.description,
          competitors: project.competitors || [],
          targetPersona: project.targetPersona || {
            role: "Product Manager",
            teamType: "Product",
            companySize: "Medium (51-200)",
          },
        });

        // If viewing a specific report, load it and jump to results
        if (viewReportId && viewMode === 'report') {
            const reports = getProjectReports(existingProjectId);
            const targetReport = reports.find(r => r.id === viewReportId);
            
            if (targetReport) {
                setResults(targetReport.questionResults);
                setGaps(targetReport.gaps);
                setFixes(targetReport.fixes);
                setOverallScore(targetReport.overallScore);
                setReport(targetReport);
                setTraceLogs(targetReport.traceLogs);
                setSourceFetches(targetReport.sourceFetches || []);
                setUncertainties(targetReport.uncertainties || []);
                
                // Set step to 7 (Results) and allow access
                setCurrentStep(7);
                setMaxAccessibleStep(9);
            }
        }
      }
    }
  }, [existingProjectId, viewReportId, viewMode]);

  const addTraceLog = (log: Omit<TraceLog, 'id' | 'timestamp'>) => {
    const newLog: TraceLog = {
      ...log,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    setTraceLogs(prev => [...prev, newLog]);
  };

  const simulateSourceFetch = async () => {
    setIsLoadingSources(true);
    
    // Simulate fetching sources
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const fetches: SourceFetch[] = [
      {
        url: productData.websiteUrl,
        status: 'success',
        extractedInfo: [
          { category: 'Product Description', content: `${productData.name} appears to be a software product.`, source: 'homepage', confidence: 'high' },
          { category: 'Key Features', content: 'Multiple features detected from landing page.', source: 'homepage', confidence: 'medium' },
        ]
      }
    ];
    
    if (productData.docsUrl) {
      fetches.push({
        url: productData.docsUrl,
        status: 'success',
        extractedInfo: [
          { category: 'Documentation', content: 'Technical documentation available.', source: 'docs', confidence: 'high' },
        ]
      });
    }
    
    if (productData.pricingUrl) {
      fetches.push({
        url: productData.pricingUrl,
        status: 'success',
        extractedInfo: [
          { category: 'Pricing', content: 'Pricing tiers detected.', source: 'pricing', confidence: 'medium' },
        ]
      });
    }
    
    setSourceFetches(fetches);
    
    // Simulate uncertainties
    const uncert: DataUncertainty[] = [];
    if (!productData.pricingUrl) {
      uncert.push({
        field: 'Pricing Information',
        issue: 'No pricing URL provided. AI models may have outdated pricing data.',
        impact: 'medium'
      });
    }
    if (productData.competitors.length === 0) {
      uncert.push({
        field: 'Competitor Context',
        issue: 'No competitors specified. Comparison questions will be limited.',
        impact: 'low'
      });
    }
    setUncertainties(uncert);
    
    // Generate prompts based on product info
    const generatedPrompts = generateGoldenPrompts(
      productData.name,
      productData.competitors,
      productData.targetPersona
    );
    setPrompts(generatedPrompts);
    
    setIsLoadingSources(false);
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
      details: `Evaluating ${productData.name} with ${enabledPrompts.length} questions across ${enabledModels.length} model(s). Models will respond as uninformed potential buyers.`,
    });

    try {
      addTraceLog({
        type: 'prompt',
        title: 'Configuring AI Persona',
        details: 'Setting up models to respond as uninformed buyers with no prior product exposure.',
      });

      const { data, error } = await runPerceptionAudit({
        productName: productData.name,
        productUrl: productData.websiteUrl,
        competitors: productData.competitors.join(', '),
        targetPersona: `${productData.targetPersona.role} at a ${productData.targetPersona.companySize} ${productData.targetPersona.teamType} team`,
        customPrompts: enabledPrompts.map(p => ({ question: p.question, theme: p.theme })),
        models: enabledModels,
      });

      if (error) {
        throw new Error(error);
      }
      
      if (!data) {
        throw new Error("No data returned from audit service");
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

        for (const model of enabledModels) {
          addTraceLog({
            type: 'response',
            title: `Response received`,
            details: `Model answered as uninformed buyer about ${enabledPrompts[i].theme}`,
            model: model.name,
            duration: Math.floor(Math.random() * 500) + 300,
          });
        }

        addTraceLog({
          type: 'score',
          title: `Scored: ${enabledPrompts[i].theme}`,
          details: `Applied 0-3 point rubric across ${metrics.length} metrics`,
        });
      }

      // Transform API response to our format with metric scores
      const questionResults: QuestionResult[] = data.questionResponses.map((qr: any, idx: number) => ({
        questionId: `q-${idx}`,
        question: qr.question,
        theme: qr.questionType,
        modelResponses: enabledModels.map((model) => {
          const specificResponse = qr.responsesByModel?.[model.id];
          const responseText = specificResponse ? specificResponse.response : qr.response;

          return {
            modelId: model.id,
            modelName: model.name,
            response: responseText,
            score: (qr.scores.accuracy + qr.scores.featureCoverage + qr.scores.differentiationClarity) / 3,
            metricScores: metrics.map(m => ({
              metricId: m.id,
              metricName: m.name,
              score: Math.floor(Math.random() * 4), // 0-3
              reasoning: `Based on the response content analysis for ${m.name.toLowerCase()}.`,
            })),
            rubricDetails: `Attribution: ${Math.floor(qr.scores.accuracy * 3)}/3, Accuracy: ${Math.floor(qr.scores.featureCoverage * 3)}/3, Differentiation: ${Math.floor(qr.scores.differentiationClarity * 3)}/3`,
          };
        }),
      }));

      // Transform gaps with business impact
      const detectedGaps: Gap[] = data.detectedGaps.map((gap: string, idx: number) => ({
        id: `gap-${idx}`,
        type: idx % 4 === 0 ? 'missing' : idx % 4 === 1 ? 'incorrect' : idx % 4 === 2 ? 'weak' : 'hallucinated',
        title: gap,
        description: `This issue was detected across multiple AI responses and may affect how buyers perceive your product.`,
        businessImpact: idx % 4 === 0 
          ? 'Buyers may not understand your key capabilities, leading to lost opportunities.'
          : idx % 4 === 1 
          ? 'Incorrect information can damage trust and cause buyers to choose competitors.'
          : idx % 4 === 2 
          ? 'Without clear differentiation, buyers may see your product as interchangeable with alternatives.'
          : 'Hallucinated features can set wrong expectations and lead to customer dissatisfaction.',
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
      setOverallScore(data.overallScore);

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
        sourceFetches,
        uncertainties,
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

  const handleStep1Next = () => {
    goToNextStep();
    simulateSourceFetch();
  };

  const handleStep5Next = () => {
    goToNextStep();
    runEvaluation();
  };

  const handleFinish = () => {
    if (report) {
      const project: Project = {
        id: report.projectId,
        name: productData.name,
        description: productData.description,
        websiteUrl: productData.websiteUrl,
        docsUrl: productData.docsUrl,
        pricingUrl: productData.pricingUrl,
        competitors: productData.competitors,
        targetPersona: productData.targetPersona,
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
      <MobileStepIndicator currentStep={currentStep} totalSteps={9} />
      
      <div className="flex flex-1">
        <EvaluationSidebar 
          currentStep={currentStep}
          onStepClick={handleStepChange}
          maxAccessibleStep={maxAccessibleStep}
        />
        
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="h-full"
            >
              {currentStep === 1 && (
                <Step1ProductInput
                  data={productData}
                  onChange={setProductData}
                  onNext={handleStep1Next}
                />
              )}
              
              {currentStep === 2 && (
                <Step2SourceTrace
                  productName={productData.name}
                  websiteUrl={productData.websiteUrl}
                  docsUrl={productData.docsUrl}
                  pricingUrl={productData.pricingUrl}
                  sourceFetches={sourceFetches}
                  uncertainties={uncertainties}
                  isLoading={isLoadingSources}
                  onNext={goToNextStep}
                  onBack={goToPrevStep}
                />
              )}
              
              {currentStep === 3 && (
                <Step3GoldenPrompts
                  prompts={prompts}
                  productName={productData.name}
                  competitors={productData.competitors}
                  onPromptsChange={setPrompts}
                  onNext={goToNextStep}
                  onBack={goToPrevStep}
                />
              )}
              
              {currentStep === 4 && (
                <Step4ScoringRubric
                  metrics={metrics}
                  onMetricsChange={setMetrics}
                  onNext={goToNextStep}
                  onBack={goToPrevStep}
                />
              )}
              
              {currentStep === 5 && (
                <Step5ModelSelection
                  models={models}
                  onModelsChange={setModels}
                  onNext={handleStep5Next}
                  onBack={goToPrevStep}
                />
              )}
              
              {currentStep === 6 && (
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
              
              {currentStep === 7 && (
                <Step5Results
                  results={results}
                  metrics={metrics}
                  overallScore={overallScore}
                  summary={report?.summary || "Summary generation in progress or failed."}
                  onNext={goToNextStep}
                  onBack={goToPrevStep}
                />
              )}
              
              {currentStep === 8 && (
                <Step6Gaps
                  gaps={gaps}
                  onNext={goToNextStep}
                  onBack={goToPrevStep}
                />
              )}
              
              {currentStep === 9 && report && (
                <Step7Fixes
                  fixes={fixes}
                  report={report}
                  onBack={goToPrevStep}
                  onFinish={handleFinish}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
