import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRight, ArrowLeft, Settings2, Plus, X, Edit2, Check } from "lucide-react";
import type { ScoringMetric, RubricCell } from "@/types/project";
import { cn } from "@/lib/utils";

interface Step4Props {
  metrics: ScoringMetric[];
  onMetricsChange: (metrics: ScoringMetric[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step4ScoringRubric({ 
  metrics, 
  onMetricsChange, 
  onNext, 
  onBack 
}: Step4Props) {
  const [editingCell, setEditingCell] = useState<{metricId: string, score: number} | null>(null);
  const [editingMetricName, setEditingMetricName] = useState<string | null>(null);

  const updateRubricCell = (metricId: string, score: number, description: string) => {
    onMetricsChange(metrics.map(m => 
      m.id === metricId 
        ? { 
            ...m, 
            rubric: m.rubric.map(r => 
              r.score === score ? { ...r, description } : r
            )
          }
        : m
    ));
    setEditingCell(null);
  };

  const updateMetricName = (metricId: string, name: string) => {
    onMetricsChange(metrics.map(m => 
      m.id === metricId ? { ...m, name } : m
    ));
    setEditingMetricName(null);
  };

  const addMetric = () => {
    const newId = (Math.max(0, ...metrics.map(m => parseInt(m.id))) + 1).toString();
    const newMetric: ScoringMetric = {
      id: newId,
      name: "New Metric",
      description: "Description of what this metric measures",
      weight: 0.25,
      rubric: [
        { score: 0, description: "Worst case" },
        { score: 1, description: "Below expectations" },
        { score: 2, description: "Meets expectations" },
        { score: 3, description: "Exceeds expectations" },
      ]
    };
    onMetricsChange([...metrics, newMetric]);
    setEditingMetricName(newId);
  };

  const removeMetric = (metricId: string) => {
    if (metrics.length <= 1) return;
    onMetricsChange(metrics.filter(m => m.id !== metricId));
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Scoring Rubric</h1>
        <p className="text-muted-foreground">
          Define how AI responses are scored. Each metric is rated 0-3 points based on the criteria you set.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings2 className="w-5 h-5 text-primary" />
            <div>
              <CardTitle className="text-lg">Scoring Matrix</CardTitle>
              <CardDescription>Click any cell to edit the scoring criteria</CardDescription>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={addMetric} className="gap-1.5">
            <Plus className="w-4 h-4" />
            Add Metric
          </Button>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-48">Metric</TableHead>
                <TableHead className="text-center">0 Points</TableHead>
                <TableHead className="text-center">1 Point</TableHead>
                <TableHead className="text-center">2 Points</TableHead>
                <TableHead className="text-center">3 Points</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.map((metric) => (
                <TableRow key={metric.id}>
                  <TableCell className="font-medium">
                    {editingMetricName === metric.id ? (
                      <div className="flex items-center gap-1">
                        <Input
                          autoFocus
                          defaultValue={metric.name}
                          className="h-8"
                          onBlur={(e) => updateMetricName(metric.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              updateMetricName(metric.id, e.currentTarget.value);
                            } else if (e.key === 'Escape') {
                              setEditingMetricName(null);
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <button 
                        className="text-left hover:text-primary transition-colors flex items-center gap-2 group"
                        onClick={() => setEditingMetricName(metric.id)}
                      >
                        {metric.name}
                        <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-50" />
                      </button>
                    )}
                  </TableCell>
                  
                  {metric.rubric.map((cell) => (
                    <TableCell key={cell.score} className="text-center">
                      {editingCell?.metricId === metric.id && editingCell?.score === cell.score ? (
                        <Input
                          autoFocus
                          defaultValue={cell.description}
                          className="h-8 text-xs text-center"
                          onBlur={(e) => updateRubricCell(metric.id, cell.score, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              updateRubricCell(metric.id, cell.score, e.currentTarget.value);
                            } else if (e.key === 'Escape') {
                              setEditingCell(null);
                            }
                          }}
                        />
                      ) : (
                        <button 
                          className={cn(
                            "w-full p-2 rounded text-xs hover:bg-primary/5 transition-colors text-left",
                            cell.score === 0 && "text-score-danger",
                            cell.score === 1 && "text-score-warning",
                            cell.score === 2 && "text-muted-foreground",
                            cell.score === 3 && "text-score-good"
                          )}
                          onClick={() => setEditingCell({ metricId: metric.id, score: cell.score })}
                        >
                          {cell.description}
                        </button>
                      )}
                    </TableCell>
                  ))}
                  
                  <TableCell>
                    {metrics.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeMetric(metric.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Scoring Info */}
      <Card className="mb-8 bg-secondary/30">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Settings2 className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="font-medium mb-1">How Scoring Works</h4>
              <p className="text-sm text-muted-foreground">
                Each AI response is evaluated against these metrics. The model receives 0-3 points per metric, 
                and the overall score is a weighted average. Click any cell to customize the criteria.
              </p>
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
          Continue to Model Selection
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
