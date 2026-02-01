import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreBar } from "@/components/ScoreGauge";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { QuestionResponse } from "@/types/audit";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  response: QuestionResponse;
  index: number;
}

export function QuestionCard({ response, index }: QuestionCardProps) {
  const averageScore = (response.scores.accuracy + response.scores.featureCoverage + response.scores.differentiationClarity) / 3;
  const hasRisks = response.risks.length > 0;

  return (
    <Card 
      className={cn(
        "border-0 shadow-md transition-all duration-300 hover:shadow-lg",
        "animate-slide-up bg-card"
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <Badge variant="secondary" className="mb-2 text-xs font-medium">
              {response.questionType}
            </Badge>
            <CardTitle className="text-base font-semibold leading-tight">
              {response.question}
            </CardTitle>
          </div>
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
            averageScore >= 0.7 ? "bg-score-good/10 text-score-good" : 
            averageScore >= 0.5 ? "bg-score-warning/10 text-score-warning" : 
            "bg-score-danger/10 text-score-danger"
          )}>
            {averageScore >= 0.7 ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
            {Math.round(averageScore * 100)}%
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 bg-secondary/50 rounded-lg">
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{response.response}</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <ScoreBar score={response.scores.accuracy} label="Accuracy" />
          <ScoreBar score={response.scores.featureCoverage} label="Coverage" />
          <ScoreBar score={response.scores.differentiationClarity} label="Clarity" />
        </div>

        {hasRisks && (
          <div className="space-y-2">
            <span className="text-xs font-medium text-score-danger flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Detected Risks
            </span>
            <div className="flex flex-wrap gap-1.5">
              {response.risks.map((risk, i) => (
                <Badge 
                  key={i} 
                  variant="outline" 
                  className="text-xs border-score-danger/30 text-score-danger bg-score-danger/5"
                >
                  {risk}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
