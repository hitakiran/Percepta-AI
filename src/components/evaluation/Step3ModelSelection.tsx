import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Cpu, Zap, Crown, Sparkles } from "lucide-react";
import type { ModelConfig } from "@/types/project";
import { cn } from "@/lib/utils";

interface Step3Props {
  models: ModelConfig[];
  onModelsChange: (models: ModelConfig[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const modelIcons: Record<string, typeof Cpu> = {
  'gemini-flash': Zap,
  'gemini-pro': Crown,
  'gpt5-mini': Sparkles,
  'gpt5': Crown,
};

const modelDescriptions: Record<string, string> = {
  'gemini-flash': 'Fast and efficient. Great for quick evaluations.',
  'gemini-pro': 'Most capable Gemini model. Best accuracy.',
  'gpt5-mini': 'Balanced performance and cost.',
  'gpt5': 'Most capable OpenAI model. Premium quality.',
};

export function Step3ModelSelection({ models, onModelsChange, onNext, onBack }: Step3Props) {
  const enabledModels = models.filter(m => m.enabled).length;

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

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Model Selection</h1>
        <p className="text-muted-foreground">
          Choose which AI models to query. Each model may perceive your product differently.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {models.map((model) => {
          const Icon = modelIcons[model.id] || Cpu;
          
          return (
            <Card 
              key={model.id}
              className={cn(
                "transition-all",
                model.enabled ? "border-primary/50 shadow-md" : "opacity-60"
              )}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "p-3 rounded-xl transition-colors",
                    model.enabled ? "bg-primary/10" : "bg-secondary"
                  )}>
                    <Icon className={cn(
                      "w-6 h-6",
                      model.enabled ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{model.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {model.provider}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {modelDescriptions[model.id]}
                    </p>
                    
                    {model.enabled && (
                      <div className="flex items-center gap-4 p-3 bg-secondary/50 rounded-lg">
                        <span className="text-sm font-medium">Temperature</span>
                        <Slider
                          value={[model.temperature * 100]}
                          onValueChange={([value]) => updateTemperature(model.id, value / 100)}
                          max={100}
                          step={10}
                          className="flex-1 max-w-48"
                        />
                        <span className="text-sm text-muted-foreground w-10">
                          {model.temperature.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <Switch
                    checked={model.enabled}
                    onCheckedChange={() => toggleModel(model.id)}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mb-8 bg-primary/5 border-primary/20">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Cpu className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">
                {enabledModels} model{enabledModels !== 1 ? 's' : ''} selected
              </p>
              <p className="text-xs text-muted-foreground">
                Results will show responses from each selected model
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
          disabled={enabledModels === 0}
          className="flex-1 h-11 gap-2 bg-gradient-primary hover:opacity-90"
        >
          Start Evaluation
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
