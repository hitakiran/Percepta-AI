import { cn } from "@/lib/utils";
import { Brain, Search, BarChart3, Lightbulb, Check } from "lucide-react";
import { useState, useEffect } from "react";

interface LoadingStateProps {
  productName: string;
}

const steps = [
  { icon: Search, label: "Querying AI systems", description: "Asking buyer-style questions about your product" },
  { icon: Brain, label: "Analyzing responses", description: "Evaluating accuracy, coverage, and clarity" },
  { icon: BarChart3, label: "Scoring perception", description: "Calculating perception metrics" },
  { icon: Lightbulb, label: "Generating recommendations", description: "Creating actionable improvements" },
];

export function LoadingState({ productName }: LoadingStateProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] animate-fade-in">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
          <Brain className="w-12 h-12 text-primary-foreground animate-pulse" />
        </div>
        <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-primary/30 animate-ping" />
      </div>

      <h2 className="text-2xl font-bold mb-2">Analyzing {productName}</h2>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        Our AI is querying language models and analyzing how they perceive your product
      </p>

      <div className="w-full max-w-md space-y-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isComplete = index < currentStep;

          return (
            <div
              key={index}
              className={cn(
                "flex items-center gap-4 p-4 rounded-lg transition-all duration-500",
                isActive && "bg-primary/10 shadow-md",
                isComplete && "opacity-60",
                !isActive && !isComplete && "opacity-30"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                  isActive && "bg-gradient-primary text-primary-foreground",
                  isComplete && "bg-score-good text-primary-foreground",
                  !isActive && !isComplete && "bg-secondary text-muted-foreground"
                )}
              >
                {isComplete ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Icon className={cn("w-5 h-5", isActive && "animate-pulse")} />
                )}
              </div>
              <div className="flex-1">
                <p className={cn("font-medium", isActive && "text-foreground", !isActive && "text-muted-foreground")}>
                  {step.label}
                </p>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
