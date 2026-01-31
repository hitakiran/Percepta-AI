import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ArrowRight, ArrowLeft, Cpu, Info } from "lucide-react";
import type { ModelConfig } from "@/types/project";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Step5Props {
  models: ModelConfig[];
  onModelsChange: (models: ModelConfig[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step5ModelSelection({ 
  models, 
  onModelsChange, 
  onNext, 
  onBack 
}: Step5Props) {
  const enabledModels = models.filter(m => m.enabled);

  const toggleModel = (id: string) => {
    onModelsChange(models.map(m => 
      m.id === id ? { ...m, enabled: !m.enabled } : m
    ));
  };

  const updateTemperature = (id: string, temperature: number) => {
    onModelsChange(models.map(m => 
      m.id === id ? { ...m, temperature } : m
    ));
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'Google': return 'bg-blue-500/10 text-blue-600';
      case 'OpenAI': return 'bg-green-500/10 text-green-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Model Selection</h1>
        <p className="text-muted-foreground">
          Choose which AI models to query and adjust their temperature settings.
        </p>
      </div>

      {/* Temperature Explanation */}
      <Card className="mb-6 bg-secondary/30 border-primary/20">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Info className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="font-medium mb-1">What is Temperature?</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Temperature controls how creative or focused the AI's responses are:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li><strong>Low (0.0 - 0.3):</strong> More deterministic, focused, and consistent responses. Best for factual accuracy.</li>
                <li><strong>Medium (0.4 - 0.7):</strong> Balanced creativity and consistency. Good for most evaluation use cases.</li>
                <li><strong>High (0.8 - 1.0):</strong> More creative and varied responses. May produce more unique but less predictable outputs.</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2">
                <em>For perception audits, we recommend 0.5-0.7 to simulate realistic buyer queries.</em>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Cpu className="w-5 h-5 text-primary" />
            <div>
              <CardTitle className="text-lg">Available Models</CardTitle>
              <CardDescription>
                {enabledModels.length} model{enabledModels.length !== 1 ? 's' : ''} selected
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {models.map((model) => (
            <div 
              key={model.id}
              className={cn(
                "p-4 rounded-lg border transition-all",
                model.enabled 
                  ? "border-primary/30 bg-primary/5" 
                  : "border-border bg-secondary/30"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={model.enabled}
                    onCheckedChange={() => toggleModel(model.id)}
                  />
                  <div>
                    <h4 className="font-medium">{model.name}</h4>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      getProviderColor(model.provider)
                    )}>
                      {model.provider}
                    </span>
                  </div>
                </div>
              </div>
              
              {model.enabled && (
                <div className="ml-10">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground w-24">Temperature:</span>
                    <Slider
                      value={[model.temperature]}
                      onValueChange={([value]) => updateTemperature(model.id, value)}
                      max={1}
                      min={0}
                      step={0.1}
                      className="w-48"
                    />
                    <span className="text-sm font-mono w-10">{model.temperature.toFixed(1)}</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-[200px]">
                          {model.temperature <= 0.3 ? "Low: More focused and consistent" :
                           model.temperature <= 0.7 ? "Medium: Balanced output" :
                           "High: More creative and varied"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-3 mt-8">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button 
          onClick={onNext}
          disabled={enabledModels.length === 0}
          className="flex-1 h-11 gap-2 bg-gradient-primary hover:opacity-90"
        >
          Start Evaluation
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
