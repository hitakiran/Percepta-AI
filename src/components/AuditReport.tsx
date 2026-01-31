import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ScoreGauge } from "@/components/ScoreGauge";
import { QuestionCard } from "@/components/QuestionCard";
import { RecommendationCard } from "@/components/RecommendationCard";
import { 
  BarChart3, 
  AlertTriangle, 
  Lightbulb, 
  ArrowLeft,
  Clock,
  FileText
} from "lucide-react";
import type { AuditReport as AuditReportType } from "@/types/audit";
import { cn } from "@/lib/utils";

interface AuditReportProps {
  report: AuditReportType;
  onReset: () => void;
}

export function AuditReport({ report, onReset }: AuditReportProps) {
  const avgScores = {
    accuracy: report.questionResponses.reduce((sum, q) => sum + q.scores.accuracy, 0) / report.questionResponses.length,
    featureCoverage: report.questionResponses.reduce((sum, q) => sum + q.scores.featureCoverage, 0) / report.questionResponses.length,
    differentiationClarity: report.questionResponses.reduce((sum, q) => sum + q.scores.differentiationClarity, 0) / report.questionResponses.length,
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={onReset}
          className="gap-2 hover:bg-secondary"
        >
          <ArrowLeft className="w-4 h-4" />
          New Audit
        </Button>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          {new Date(report.timestamp).toLocaleString()}
        </div>
      </div>

      {/* Summary Card */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="bg-gradient-primary p-6 text-primary-foreground">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-6 h-6" />
            <span className="text-sm font-medium opacity-90">Perception Audit Report</span>
          </div>
          <h1 className="text-3xl font-bold mb-1">{report.productName}</h1>
          <p className="text-sm opacity-80">Run ID: {report.runId}</p>
        </div>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-[1fr_auto] gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Executive Summary
              </h3>
              <p className="text-muted-foreground leading-relaxed">{report.summary}</p>
            </div>
            <div className="flex justify-center md:justify-end">
              <ScoreGauge score={report.overallScore} label="Overall Score" size="lg" />
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-3 gap-8">
            <ScoreGauge score={avgScores.accuracy} label="Accuracy" size="md" />
            <ScoreGauge score={avgScores.featureCoverage} label="Feature Coverage" size="md" />
            <ScoreGauge score={avgScores.differentiationClarity} label="Differentiation" size="md" />
          </div>
        </CardContent>
      </Card>

      {/* Detected Gaps */}
      {report.detectedGaps.length > 0 && (
        <Card className="border-0 shadow-md border-l-4 border-l-score-warning">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-score-warning" />
              Detected Gaps
            </CardTitle>
            <CardDescription>
              Key issues identified across AI responses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {report.detectedGaps.map((gap, index) => (
                <Badge 
                  key={index}
                  variant="outline"
                  className="text-sm py-1.5 px-3 bg-score-warning/5 border-score-warning/30 text-foreground"
                >
                  {gap}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Per-Question Results */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Question-by-Question Analysis
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {report.questionResponses.map((response, index) => (
            <QuestionCard key={index} response={response} index={index} />
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          Top Recommendations
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {report.recommendations.slice(0, 5).map((rec, index) => (
            <RecommendationCard key={index} recommendation={rec} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
