import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  HelpCircle, 
  Home, 
  DollarSign, 
  GitCompare, 
  MessageSquare,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AuditReport } from "@/types/audit";

interface RecommendationCardProps {
  recommendation: AuditReport['recommendations'][0];
  index: number;
}

const categoryIcons = {
  faq: HelpCircle,
  homepage: Home,
  pricing: DollarSign,
  comparison: GitCompare,
  messaging: MessageSquare,
};

const categoryLabels = {
  faq: "FAQ Entry",
  homepage: "Homepage",
  pricing: "Pricing Page",
  comparison: "Comparison Page",
  messaging: "Messaging",
};

const priorityStyles = {
  high: "border-l-score-danger bg-score-danger/5",
  medium: "border-l-score-warning bg-score-warning/5",
  low: "border-l-score-good bg-score-good/5",
};

export function RecommendationCard({ recommendation, index }: RecommendationCardProps) {
  const Icon = categoryIcons[recommendation.category];

  return (
    <Card 
      className={cn(
        "border-0 border-l-4 shadow-sm transition-all duration-300 hover:shadow-md",
        "animate-slide-up",
        priorityStyles[recommendation.priority]
      )}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-primary/10">
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <Badge variant="secondary" className="text-xs">
              {categoryLabels[recommendation.category]}
            </Badge>
          </div>
          <Badge 
            className={cn(
              "text-xs font-medium capitalize",
              recommendation.priority === 'high' && "bg-score-danger/20 text-score-danger border-0",
              recommendation.priority === 'medium' && "bg-score-warning/20 text-score-warning border-0",
              recommendation.priority === 'low' && "bg-score-good/20 text-score-good border-0"
            )}
          >
            {recommendation.priority}
          </Badge>
        </div>
        <CardTitle className="text-base font-semibold flex items-center gap-2 mt-2">
          {recommendation.title}
          <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {recommendation.description}
        </p>
      </CardContent>
    </Card>
  );
}
