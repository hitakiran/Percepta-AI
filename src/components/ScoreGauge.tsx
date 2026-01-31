import { cn } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number;
  label: string;
  size?: "sm" | "md" | "lg";
}

export function ScoreGauge({ score, label, size = "md" }: ScoreGaugeProps) {
  const percentage = Math.round(score * 100);
  
  const getScoreColor = (value: number) => {
    if (value >= 0.8) return "text-score-excellent";
    if (value >= 0.6) return "text-score-good";
    if (value >= 0.4) return "text-score-warning";
    return "text-score-danger";
  };

  const getScoreBgColor = (value: number) => {
    if (value >= 0.8) return "bg-score-excellent";
    if (value >= 0.6) return "bg-score-good";
    if (value >= 0.4) return "bg-score-warning";
    return "bg-score-danger";
  };

  const sizeClasses = {
    sm: { container: "w-16 h-16", text: "text-lg", label: "text-xs" },
    md: { container: "w-24 h-24", text: "text-2xl", label: "text-sm" },
    lg: { container: "w-36 h-36", text: "text-4xl", label: "text-base" },
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score * circumference);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn("relative", sizeClasses[size].container)}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-secondary"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={cn("transition-all duration-1000 ease-out", getScoreColor(score))}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("font-bold", sizeClasses[size].text, getScoreColor(score))}>
            {percentage}
          </span>
        </div>
      </div>
      <span className={cn("font-medium text-muted-foreground text-center", sizeClasses[size].label)}>
        {label}
      </span>
    </div>
  );
}

interface ScoreBarProps {
  score: number;
  label: string;
}

export function ScoreBar({ score, label }: ScoreBarProps) {
  const percentage = Math.round(score * 100);

  const getScoreBgColor = (value: number) => {
    if (value >= 0.8) return "bg-score-excellent";
    if (value >= 0.6) return "bg-score-good";
    if (value >= 0.4) return "bg-score-warning";
    return "bg-score-danger";
  };

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-semibold">{percentage}%</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-1000 ease-out", getScoreBgColor(score))}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
