import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, Check, Clock, Database, MessageSquare, Cpu, BarChart3, FileSearch, AlertTriangle } from "lucide-react";
import type { TraceLog } from "@/types/project";
import { cn } from "@/lib/utils";

interface Step4Props {
  traceLogs: TraceLog[];
  isComplete: boolean;
  productName: string;
}

const logIcons: Record<TraceLog['type'], typeof Activity> = {
  fetch: Database,
  extract: FileSearch,
  prompt: MessageSquare,
  response: Cpu,
  score: BarChart3,
  complete: Check,
  uncertainty: AlertTriangle,
};

const logColors: Record<TraceLog['type'], string> = {
  fetch: "text-blue-500 bg-blue-500/10",
  extract: "text-cyan-500 bg-cyan-500/10",
  prompt: "text-purple-500 bg-purple-500/10",
  response: "text-green-500 bg-green-500/10",
  score: "text-amber-500 bg-amber-500/10",
  complete: "text-emerald-500 bg-emerald-500/10",
  uncertainty: "text-orange-500 bg-orange-500/10",
};

export function Step4Generation({ traceLogs, isComplete, productName }: Step4Props) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold">Evaluating {productName}</h1>
          {!isComplete && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-muted-foreground">Running...</span>
            </div>
          )}
          {isComplete && (
            <Badge className="bg-score-good text-primary-foreground">Complete</Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          AI models are responding as uninformed potential buyers with no prior product exposure.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-secondary/30">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">Trace Logs</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              {traceLogs.length} events
            </div>
          </div>
          
          <ScrollArea className="h-[500px]">
            <div className="p-4 space-y-3">
              {traceLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <Activity className="w-8 h-8 mb-3 animate-pulse" />
                  <p>Starting evaluation...</p>
                </div>
              ) : (
                traceLogs.map((log) => {
                  const Icon = logIcons[log.type];
                  const colorClass = logColors[log.type];
                  
                  return (
                    <div 
                      key={log.id}
                      className="flex gap-3 p-3 rounded-lg bg-secondary/30 animate-fade-in"
                    >
                      <div className={cn("p-2 rounded-lg shrink-0", colorClass)}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{log.title}</span>
                          {log.model && (
                            <Badge variant="outline" className="text-xs">
                              {log.model}
                            </Badge>
                          )}
                          {log.source && (
                            <Badge variant="secondary" className="text-xs">
                              {log.source}
                            </Badge>
                          )}
                          {log.duration && (
                            <span className="text-xs text-muted-foreground ml-auto">
                              {log.duration}ms
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {log.details}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground shrink-0">
                        {formatTime(log.timestamp)}
                      </div>
                    </div>
                  );
                })
              )}
              
              {!isComplete && traceLogs.length > 0 && (
                <div className="flex items-center gap-3 p-3 rounded-lg border border-dashed">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  </div>
                  <span className="text-sm text-muted-foreground">Processing...</span>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {isComplete && (
        <div className="mt-6 p-4 rounded-lg bg-score-good/10 border border-score-good/20">
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-score-good" />
            <div>
              <p className="font-medium">Evaluation Complete</p>
              <p className="text-sm text-muted-foreground">
                All questions have been processed. Click "Continue" to view results.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
