import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Lightbulb, FileText, Eye, Target, Map, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Fix, EvaluationReport } from "@/types/project";
import { cn } from "@/lib/utils";
import { ScoreGauge } from "@/components/ScoreGauge";

interface Step7Props {
  fixes: Fix[];
  report: EvaluationReport;
  onBack: () => void;
  onFinish: () => void;
}

const categoryConfig: Record<Fix['category'], { icon: typeof Lightbulb; label: string; description: string }> = {
  context: { 
    icon: FileText, 
    label: 'Product Context', 
    description: 'Improve how your product is understood at a fundamental level'
  },
  explainability: { 
    icon: Eye, 
    label: 'Explainability Assets', 
    description: 'Add or improve documentation, FAQs, and public content'
  },
  positioning: { 
    icon: Target, 
    label: 'Positioning Clarity', 
    description: 'Sharpen your differentiation and market position'
  },
  roadmap: { 
    icon: Map, 
    label: 'Roadmap Communication', 
    description: 'Better communicate product direction and upcoming features'
  },
};

export function Step7Fixes({ fixes, report, onBack, onFinish }: Step7Props) {
  const navigate = useNavigate();
  
  const groupedFixes = {
    context: fixes.filter(f => f.category === 'context'),
    explainability: fixes.filter(f => f.category === 'explainability'),
    positioning: fixes.filter(f => f.category === 'positioning'),
    roadmap: fixes.filter(f => f.category === 'roadmap'),
  };

  const getPriorityColor = (priority: Fix['priority']) => {
    switch (priority) {
      case 'high': return 'bg-score-danger text-primary-foreground';
      case 'medium': return 'bg-score-warning text-primary-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Recommended Fixes</h1>
        <p className="text-muted-foreground">
          Actionable recommendations to improve how AI describes your product.
        </p>
      </div>

      {/* Summary Card */}
      <Card className="mb-8 overflow-hidden">
        <div className="bg-gradient-primary p-6 text-primary-foreground">
          <h2 className="text-xl font-bold mb-1">Evaluation Complete</h2>
          <p className="text-sm opacity-80">{report.projectName} • Iteration #{report.iteration}</p>
        </div>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-[1fr_auto] gap-6">
            <div>
              <h3 className="font-semibold mb-2">Summary</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{report.summary}</p>
            </div>
            <div className="flex justify-center">
              <ScoreGauge score={report.overallScore} label="Overall Score" size="lg" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fixes by Category */}
      <div className="space-y-6 mb-8">
        {Object.entries(groupedFixes).map(([category, categoryFixes]) => {
          if (categoryFixes.length === 0) return null;
          const config = categoryConfig[category as Fix['category']];
          const Icon = config.icon;
          
          return (
            <Card key={category}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Adjust: {config.label}</CardTitle>
                    <CardDescription>{config.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categoryFixes.map((fix) => (
                    <div 
                      key={fix.id}
                      className="p-4 rounded-lg border bg-card hover:bg-secondary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h4 className="font-medium">{fix.title}</h4>
                        <Badge 
                          className={cn("shrink-0 capitalize text-xs", getPriorityColor(fix.priority))}
                        >
                          {fix.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{fix.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button 
          variant="outline"
          onClick={() => navigate('/dashboard')}
          className="gap-2"
        >
          Go to Dashboard
        </Button>
        <Button 
          onClick={onFinish}
          className="flex-1 h-11 gap-2 bg-gradient-primary hover:opacity-90"
        >
          <Check className="w-4 h-4" />
          Complete & Save Report
        </Button>
      </div>
    </div>
  );
}
