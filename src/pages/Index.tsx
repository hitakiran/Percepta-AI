import { useState } from "react";
import { AuditForm } from "@/components/AuditForm";
import { AuditReport } from "@/components/AuditReport";
import { LoadingState } from "@/components/LoadingState";
import { Brain, Sparkles, Target, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import type { AuditInput, AuditReport as AuditReportType } from "@/types/audit";
import { supabase } from "@/integrations/supabase/client";

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<AuditReportType | null>(null);
  const [currentProduct, setCurrentProduct] = useState("");

  const handleSubmit = async (data: AuditInput) => {
    setIsLoading(true);
    setCurrentProduct(data.productName);
    
    try {
      const { data: result, error } = await supabase.functions.invoke('perception-audit', {
        body: data
      });

      if (error) {
        if (error.message?.includes('429')) {
          throw new Error('Rate limit reached. Please try again in a moment.');
        }
        if (error.message?.includes('402')) {
          throw new Error('Please add credits to continue using AI features.');
        }
        throw error;
      }

      if (!result) {
        throw new Error('No response received from the analysis');
      }

      setReport(result as AuditReportType);
      toast.success("Perception audit complete!");
    } catch (error) {
      console.error("Audit error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to complete audit. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setReport(null);
    setCurrentProduct("");
  };

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Hero Section */}
      {!report && !isLoading && (
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
          <div className="container mx-auto px-4 pt-16 pb-12 relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
                <Sparkles className="w-4 h-4" />
                AI-Powered Product Analysis
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
                <span className="text-gradient">AI Product</span>
                <br />
                Perception Auditor
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
                Understand how AI systems describe your product. Identify inaccuracies, 
                gaps, and get actionable recommendations to improve your messaging.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-3 animate-fade-in" style={{ animationDelay: "300ms" }}>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-sm">
                  <Brain className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">AI Analysis</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-sm">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Perception Scoring</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-sm">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Actionable Fixes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {isLoading ? (
            <LoadingState productName={currentProduct} />
          ) : report ? (
            <AuditReport report={report} onReset={handleReset} />
          ) : (
            <div className="max-w-xl mx-auto animate-slide-up" style={{ animationDelay: "400ms" }}>
              <AuditForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
        <p>AI Product Perception Auditor • Powered by Lovable AI</p>
      </footer>
    </div>
  );
}
