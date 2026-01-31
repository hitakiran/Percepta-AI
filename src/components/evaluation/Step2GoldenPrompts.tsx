import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, ArrowLeft, Plus, X, MessageSquare, Settings2 } from "lucide-react";
import type { GoldenPrompt, ScoringMetric } from "@/types/project";
import { cn } from "@/lib/utils";

interface Step2Props {
  prompts: GoldenPrompt[];
  metrics: ScoringMetric[];
  onPromptsChange: (prompts: GoldenPrompt[]) => void;
  onMetricsChange: (metrics: ScoringMetric[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step2GoldenPrompts({ 
  prompts, 
  metrics, 
  onPromptsChange, 
  onMetricsChange, 
  onNext, 
  onBack 
}: Step2Props) {
  const enabledPrompts = prompts.filter(p => p.enabled).length;

  const togglePrompt = (id: string) => {
    onPromptsChange(prompts.map(p => 
      p.id === id ? { ...p, enabled: !p.enabled } : p
    ));
  };

  const updatePromptQuestion = (id: string, question: string) => {
    onPromptsChange(prompts.map(p => 
      p.id === id ? { ...p, question } : p
    ));
  };

  const addPrompt = () => {
    const newId = (Math.max(...prompts.map(p => parseInt(p.id))) + 1).toString();
    onPromptsChange([...prompts, { 
      id: newId, 
      question: "", 
      theme: "Custom", 
      enabled: true 
    }]);
  };

  const removePrompt = (id: string) => {
    onPromptsChange(prompts.filter(p => p.id !== id));
  };

  const updateMetricWeight = (id: string, weight: number) => {
    onMetricsChange(metrics.map(m => 
      m.id === id ? { ...m, weight } : m
    ));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Golden Questions</h1>
        <p className="text-muted-foreground">
          These questions will be asked to AI models. Customize them to focus on what matters most.
        </p>
      </div>

      <div className="space-y-6">
        {/* Prompts Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-primary" />
              <div>
                <CardTitle className="text-lg">Evaluation Questions</CardTitle>
                <p className="text-sm text-muted-foreground">{enabledPrompts} questions enabled</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={addPrompt} className="gap-1.5">
              <Plus className="w-4 h-4" />
              Add Question
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {prompts.map((prompt) => (
              <div 
                key={prompt.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border transition-colors",
                  prompt.enabled ? "bg-card border-border" : "bg-muted/50 border-transparent"
                )}
              >
                <Switch
                  checked={prompt.enabled}
                  onCheckedChange={() => togglePrompt(prompt.id)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {prompt.theme}
                    </Badge>
                  </div>
                  <Textarea
                    value={prompt.question}
                    onChange={(e) => updatePromptQuestion(prompt.id, e.target.value)}
                    placeholder="Enter your question..."
                    className={cn(
                      "min-h-[60px] resize-none",
                      !prompt.enabled && "opacity-50"
                    )}
                    disabled={!prompt.enabled}
                  />
                </div>
                {prompt.theme === "Custom" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removePrompt(prompt.id)}
                    className="text-muted-foreground hover:text-destructive shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Scoring Rubric */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Settings2 className="w-5 h-5 text-primary" />
              <div>
                <CardTitle className="text-lg">Scoring Rubric</CardTitle>
                <p className="text-sm text-muted-foreground">Adjust metric weights</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-40">Metric</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-48 text-right">Weight</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.map((metric) => (
                  <TableRow key={metric.id}>
                    <TableCell className="font-medium">{metric.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {metric.description}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Slider
                          value={[metric.weight * 100]}
                          onValueChange={([value]) => updateMetricWeight(metric.id, value / 100)}
                          max={100}
                          step={5}
                          className="w-24"
                        />
                        <span className="text-sm font-medium w-12 text-right">
                          {Math.round(metric.weight * 100)}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button 
            onClick={onNext} 
            disabled={enabledPrompts === 0}
            className="flex-1 h-11 gap-2 bg-gradient-primary hover:opacity-90"
          >
            Continue to Model Selection
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
