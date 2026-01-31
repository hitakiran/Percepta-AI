import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ArrowRight, ArrowLeft, ChevronDown, ChevronUp, MessageSquare, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { QuestionResult } from "@/types/project";
import { cn } from "@/lib/utils";
import { ScoreBar } from "@/components/ScoreGauge";

interface Step5Props {
  results: QuestionResult[];
  onNext: () => void;
  onBack: () => void;
}

export function Step5Results({ results, onNext, onBack }: Step5Props) {
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);

  const toggleQuestion = (id: string) => {
    setExpandedQuestions(prev => 
      prev.includes(id) ? prev.filter(q => q !== id) : [...prev, id]
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return "text-score-excellent";
    if (score >= 0.6) return "text-score-good";
    if (score >= 0.4) return "text-score-warning";
    return "text-score-danger";
  };

  const getAvgScore = (result: QuestionResult) => {
    if (result.modelResponses.length === 0) return 0;
    return result.modelResponses.reduce((sum, r) => sum + r.score, 0) / result.modelResponses.length;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Question-by-Question Results</h1>
        <p className="text-muted-foreground">
          Expand each question to see how different AI models responded and their scores.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {results.map((result, index) => {
          const isExpanded = expandedQuestions.includes(result.questionId);
          const avgScore = getAvgScore(result);
          
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
                          {avgScore >= 0.7 ? (
                            <CheckCircle2 className="w-4 h-4 text-score-good" />
                          ) : avgScore >= 0.5 ? (
                            <AlertTriangle className="w-4 h-4 text-score-warning" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-score-danger" />
                          )}
                        </div>
                        <CardTitle className="text-base font-medium">
                          {result.question}
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={cn("text-xl font-bold", getScoreColor(avgScore))}>
                          {Math.round(avgScore * 100)}
                        </span>
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
                              <span className={cn(
                                "ml-2 text-xs font-bold",
                                getScoreColor(response.score)
                              )}>
                                {Math.round(response.score * 100)}
                              </span>
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        
                        {result.modelResponses.map((response) => (
                          <TabsContent key={response.modelId} value={response.modelId}>
                            <ModelResponseCard response={response} />
                          </TabsContent>
                        ))}
                      </Tabs>
                    ) : result.modelResponses[0] ? (
                      <div className="mt-4">
                        <ModelResponseCard response={result.modelResponses[0]} />
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

function ModelResponseCard({ response }: { response: QuestionResult['modelResponses'][0] }) {
  const [showRubric, setShowRubric] = useState(false);

  return (
    <div className="space-y-4">
      <div className="p-4 bg-secondary/50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Response</span>
        </div>
        <p className="text-sm leading-relaxed">{response.response}</p>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <ScoreBar score={response.scores.accuracy} label="Accuracy" />
        <ScoreBar score={response.scores.featureCoverage} label="Coverage" />
        <ScoreBar score={response.scores.differentiationClarity} label="Clarity" />
      </div>

      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setShowRubric(!showRubric)}
        className="text-muted-foreground"
      >
        {showRubric ? 'Hide' : 'View'} Scoring Details
      </Button>
      
      {showRubric && response.rubricDetails && (
        <div className="p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
          {response.rubricDetails}
        </div>
      )}
    </div>
  );
}
