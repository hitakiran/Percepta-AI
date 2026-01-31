import { cn } from "@/lib/utils";
import { 
  FileText, 
  MessageSquare, 
  Cpu, 
  Activity, 
  BarChart3, 
  AlertTriangle, 
  Lightbulb,
  Check,
  Circle
} from "lucide-react";

interface Step {
  id: number;
  label: string;
  icon: React.ElementType;
}

const steps: Step[] = [
  { id: 1, label: "Product Input", icon: FileText },
  { id: 2, label: "Golden Prompts", icon: MessageSquare },
  { id: 3, label: "Model Selection", icon: Cpu },
  { id: 4, label: "Generation", icon: Activity },
  { id: 5, label: "Results", icon: BarChart3 },
  { id: 6, label: "Gaps & Failures", icon: AlertTriangle },
  { id: 7, label: "Fixes", icon: Lightbulb },
];

interface EvaluationSidebarProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  maxAccessibleStep: number;
}

export function EvaluationSidebar({ currentStep, onStepClick, maxAccessibleStep }: EvaluationSidebarProps) {
  return (
    <aside className="w-64 shrink-0 border-r bg-card hidden lg:block">
      <div className="sticky top-16 p-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          Evaluation Steps
        </h2>
        <nav className="space-y-1">
          {steps.map((step) => {
            const Icon = step.icon;
            const isComplete = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const isAccessible = step.id <= maxAccessibleStep;

            return (
              <button
                key={step.id}
                onClick={() => isAccessible && onStepClick(step.id)}
                disabled={!isAccessible}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isCurrent && "bg-primary text-primary-foreground",
                  !isCurrent && isAccessible && "hover:bg-secondary text-foreground",
                  !isAccessible && "text-muted-foreground/50 cursor-not-allowed"
                )}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                  isCurrent && "bg-primary-foreground/20",
                  isComplete && "bg-score-good text-primary-foreground",
                  !isCurrent && !isComplete && "bg-secondary"
                )}>
                  {isComplete ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>
                <span className="truncate">{step.label}</span>
                {isCurrent && (
                  <Circle className="w-2 h-2 fill-current ml-auto shrink-0" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export function MobileStepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="lg:hidden flex items-center gap-2 p-4 border-b bg-card">
      <div className="flex gap-1.5 flex-1">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 rounded-full flex-1 transition-colors",
              i < currentStep ? "bg-score-good" : 
              i === currentStep - 1 ? "bg-primary" : 
              "bg-secondary"
            )}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-muted-foreground">
        Step {currentStep} of {totalSteps}
      </span>
    </div>
  );
}
