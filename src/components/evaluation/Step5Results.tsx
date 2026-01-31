import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowRight, ArrowLeft, ChevronDown, ChevronUp, MessageSquare, AlertTriangle, CheckCircle2, Eye } from "lucide-react";
import type { QuestionResult, ScoringMetric } from "@/types/project";
import { cn } from "@/lib/utils";
import { ScoreGauge } from "@/components/ScoreGauge";

interface Step5Props {
  results: QuestionResult[];
  metrics: ScoringMetric[];
  overallScore: number;
  onNext: () => void;
  onBack: () => void;
}

export function Step5Results({ results, metrics, overallScore, onNext, onBack }: Step5Props) {
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);

  const toggleQuestion = (id: string) => {
    setExpandedQuestions(prev => 
      prev.includes(id) ? prev.filter(q => q !== id) : [...prev, id]
    );
  };

  const getScoreLevel = (score: number) => {
    if (score >= 2.5) return 'excellent';
    if (score >= 1.5) return 'good';
    if (score >= 0.5) return 'warning';
    return 'danger';
  };

  const getScoreColor = (score: number) => {
    const level = getScoreLevel(score);
    switch (level) {
      case 'excellent': return 'text-score-excellent';
      case 'good': return 'text-score-good';
      case 'warning': return 'text-score-warning';
      default: return 'text-score-danger';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Question-by-Question Results</h1>
        <p className="text-muted-foreground">
          Expand each question to see AI responses and scoring details.
        </p>
      </div>

      {/* Overall Score Card */}
      <Card className="mb-8 overflow-hidden">
        <div className="bg-gradient-primary p-6 text-primary-foreground text-center">
          <h2 className="text-lg font-medium mb-2">Overall Perception Score</h2>
          <div className="text-5xl font-bold">{Math.round(overallScore * 100)}%</div>
        </div>
      </Card>

      <div className="space-y-4 mb-8">
        {results.map((result, index) => {
          const isExpanded = expandedQuestions.includes(result.questionId);
          
          return (
            <Card key={result.questionId} className="overflow-hidden">
              <Collapsible open={isExpanded} onOpenChange={() => toggleQuestion(result.questionId)}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-secondary/30 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-sm font-bold text-primary">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="text-xs shrink-0">
                            {result.theme}
                          </Badge>
                        </div>
                        <CardTitle className="text-base font-medium">
                          {result.question}
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="pt-0 border-t">
                    {result.modelResponses.length > 1 ? (
                      <Tabs defaultValue={result.modelResponses[0]?.modelId} className="mt-4">
                        <TabsList>
                          {result.modelResponses.map((response) => (
                            <TabsTrigger key={response.modelId} value={response.modelId}>
                              {response.modelName}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        
                        {result.modelResponses.map((response) => (
                          <TabsContent key={response.modelId} value={response.modelId}>
                            <ModelResponseCard response={response} metrics={metrics} />
                          </TabsContent>
                        ))}
                      </Tabs>
                    ) : result.modelResponses[0] ? (
                      <div className="mt-4">
                        <ModelResponseCard response={result.modelResponses[0]} metrics={metrics} />
                      </div>
                    ) : (
                      <p className="text-muted-foreground py-4">No responses available</p>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button 
          onClick={onNext}
          className="flex-1 h-11 gap-2 bg-gradient-primary hover:opacity-90"
        >
          View Gaps & Failures
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function ModelResponseCard({ response, metrics }: { response: QuestionResult['modelResponses'][0], metrics: ScoringMetric[] }) {
  const [showRubric, setShowRubric] = useState(false);

  const getScoreLabel = (score: number) => {
    switch (score) {
      case 0: return '0 Points';
      case 1: return '1 Point';
      case 2: return '2 Points';
      case 3: return '3 Points';
      default: return `${score} Points`;
    }
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 3) return 'bg-score-excellent/10 border-score-excellent/30';
    if (score >= 2) return 'bg-score-good/10 border-score-good/30';
    if (score >= 1) return 'bg-score-warning/10 border-score-warning/30';
    return 'bg-score-danger/10 border-score-danger/30';
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-secondary/50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Response</span>
        </div>
        <p className="text-sm leading-relaxed">{response.response}</p>
      </div>
      
      <Dialog open={showRubric} onOpenChange={setShowRubric}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            View Scoring Details
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Scoring Rubric Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {response.metricScores.map((metricScore) => {
              const metric = metrics.find(m => m.id === metricScore.metricId);
              if (!metric) return null;
              
              return (
                <div key={metricScore.metricId} className="border rounded-lg overflow-hidden">
                  <div className="bg-secondary/50 p-3 flex items-center justify-between">
                    <span className="font-medium">{metricScore.metricName}</span>
                    <Badge className={cn(
                      "text-xs",
                      metricScore.score >= 2.5 ? "bg-score-excellent" :
                      metricScore.score >= 1.5 ? "bg-score-good" :
                      metricScore.score >= 0.5 ? "bg-score-warning" :
                      "bg-score-danger"
                    )}>
                      {getScoreLabel(metricScore.score)}
                    </Badge>
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="grid grid-cols-4 gap-2">
                      {metric.rubric.map((cell) => (
                        <div 
                          key={cell.score}
                          className={cn(
                            "p-2 rounded text-xs border text-center",
                            metricScore.score === cell.score 
                              ? getScoreBgColor(cell.score) + " border-2 font-medium"
                              : "bg-muted/30 border-transparent"
                          )}
                        >
                          <div className="font-semibold mb-1">{cell.score} pts</div>
                          <div className="text-muted-foreground">{cell.description}</div>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      <strong>Reasoning:</strong> {metricScore.reasoning}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
