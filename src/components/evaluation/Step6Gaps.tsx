import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, AlertTriangle, XCircle, Search, Ghost } from "lucide-react";
import type { Gap } from "@/types/project";
import { cn } from "@/lib/utils";

interface Step6Props {
  gaps: Gap[];
  onNext: () => void;
  onBack: () => void;
}

const gapTypeConfig: Record<Gap['type'], { icon: typeof AlertTriangle; label: string; color: string }> = {
  missing: { icon: Search, label: 'Missing Information', color: 'text-blue-500 bg-blue-500/10' },
  incorrect: { icon: XCircle, label: 'Incorrect Description', color: 'text-score-danger bg-score-danger/10' },
  weak: { icon: AlertTriangle, label: 'Weak Differentiator', color: 'text-score-warning bg-score-warning/10' },
  hallucinated: { icon: Ghost, label: 'Hallucinated Content', color: 'text-purple-500 bg-purple-500/10' },
};

export function Step6Gaps({ gaps, onNext, onBack }: Step6Props) {
  const groupedGaps = {
    missing: gaps.filter(g => g.type === 'missing'),
    incorrect: gaps.filter(g => g.type === 'incorrect'),
    weak: gaps.filter(g => g.type === 'weak'),
    hallucinated: gaps.filter(g => g.type === 'hallucinated'),
  };

  const getSeverityColor = (severity: Gap['severity']) => {
    switch (severity) {
      case 'high': return 'bg-score-danger/10 text-score-danger border-score-danger/30';
      case 'medium': return 'bg-score-warning/10 text-score-warning border-score-warning/30';
      case 'low': return 'bg-muted text-muted-foreground border-muted';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Gaps & Failures</h1>
        <p className="text-muted-foreground">
          These issues were identified in how AI models describe your product.
        </p>
      </div>

      {gaps.length === 0 ? (
        <Card className="mb-8">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-score-good/10 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-score-good" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No major gaps detected</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              AI models seem to have a reasonably accurate understanding of your product. 
              Review the recommendations for further improvements.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6 mb-8">
          {Object.entries(groupedGaps).map(([type, typeGaps]) => {
            if (typeGaps.length === 0) return null;
            const config = gapTypeConfig[type as Gap['type']];
            const Icon = config.icon;
            
            return (
              <Card key={type}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg", config.color)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{config.label}</CardTitle>
                      <CardDescription>{typeGaps.length} issue{typeGaps.length !== 1 ? 's' : ''} found</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {typeGaps.map((gap) => (
                      <div 
                        key={gap.id}
                        className={cn(
                          "p-4 rounded-lg border",
                          getSeverityColor(gap.severity)
                        )}
                      >
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h4 className="font-medium">{gap.title}</h4>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "shrink-0 capitalize text-xs",
                              getSeverityColor(gap.severity)
                            )}
                          >
                            {gap.severity}
                          </Badge>
                        </div>
                        <p className="text-sm opacity-80">{gap.description}</p>
                        {gap.affectedQuestions.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {gap.affectedQuestions.map((q, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                Q{i + 1}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Summary Stats */}
      <Card className="mb-8 bg-secondary/30">
        <CardContent className="py-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-score-danger">
                {gaps.filter(g => g.severity === 'high').length}
              </div>
              <div className="text-xs text-muted-foreground">High Severity</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-score-warning">
                {gaps.filter(g => g.severity === 'medium').length}
              </div>
              <div className="text-xs text-muted-foreground">Medium</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-muted-foreground">
                {gaps.filter(g => g.severity === 'low').length}
              </div>
              <div className="text-xs text-muted-foreground">Low</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{gaps.length}</div>
              <div className="text-xs text-muted-foreground">Total Issues</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button 
          onClick={onNext}
          className="flex-1 h-11 gap-2 bg-gradient-primary hover:opacity-90"
        >
          View Recommended Fixes
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
