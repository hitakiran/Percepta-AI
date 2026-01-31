import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Globe, FileText, CheckCircle2, XCircle, AlertTriangle, Loader2, Info } from "lucide-react";
import type { SourceFetch, DataUncertainty, ExtractedInfo } from "@/types/project";
import { cn } from "@/lib/utils";

interface Step2Props {
  productName: string;
  websiteUrl: string;
  docsUrl?: string;
  pricingUrl?: string;
  sourceFetches: SourceFetch[];
  uncertainties: DataUncertainty[];
  isLoading: boolean;
  onNext: () => void;
  onBack: () => void;
}

export function Step2SourceTrace({ 
  productName, 
  websiteUrl, 
  docsUrl, 
  pricingUrl,
  sourceFetches, 
  uncertainties,
  isLoading,
  onNext, 
  onBack 
}: Step2Props) {
  const successCount = sourceFetches.filter(s => s.status === 'success').length;
  const totalSources = sourceFetches.length;
  
  const getStatusIcon = (status: SourceFetch['status']) => {
    switch (status) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-score-good" />;
      case 'failed': return <XCircle className="w-4 h-4 text-score-danger" />;
      case 'partial': return <AlertTriangle className="w-4 h-4 text-score-warning" />;
    }
  };

  const getConfidenceColor = (confidence: ExtractedInfo['confidence']) => {
    switch (confidence) {
      case 'high': return 'bg-score-good/10 text-score-good border-score-good/30';
      case 'medium': return 'bg-score-warning/10 text-score-warning border-score-warning/30';
      case 'low': return 'bg-score-danger/10 text-score-danger border-score-danger/30';
    }
  };

  const getImpactColor = (impact: DataUncertainty['impact']) => {
    switch (impact) {
      case 'high': return 'bg-score-danger/10 text-score-danger';
      case 'medium': return 'bg-score-warning/10 text-score-warning';
      case 'low': return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Source Trace</h1>
        <p className="text-muted-foreground">
          Review what public information was extracted about {productName} before generating questions.
        </p>
      </div>

      {isLoading ? (
        <Card className="mb-8">
          <CardContent className="py-16 text-center">
            <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold mb-2">Fetching Public Sources...</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Analyzing {websiteUrl} and related documentation to extract product information.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary Stats */}
          <Card className="mb-6 bg-secondary/30">
            <CardContent className="py-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-score-good">{successCount}</div>
                  <div className="text-xs text-muted-foreground">Sources Fetched</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {sourceFetches.reduce((sum, s) => sum + s.extractedInfo.length, 0)}
                  </div>
                  <div className="text-xs text-muted-foreground">Data Points Extracted</div>
                </div>
                <div>
                  <div className={cn(
                    "text-2xl font-bold",
                    uncertainties.length > 0 ? "text-score-warning" : "text-score-good"
                  )}>
                    {uncertainties.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Uncertainties</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sources Fetched */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Public Sources Fetched
              </CardTitle>
              <CardDescription>
                Data sources analyzed to understand your product
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sourceFetches.map((source, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    {getStatusIcon(source.status)}
                    <span className="font-medium flex-1 truncate">{source.url}</span>
                    <Badge variant="secondary" className="text-xs capitalize">
                      {source.status}
                    </Badge>
                  </div>
                  
                  {source.extractedInfo.length > 0 && (
                    <div className="space-y-2 ml-7">
                      {source.extractedInfo.map((info, i) => (
                        <div 
                          key={i}
                          className={cn(
                            "p-3 rounded-lg border",
                            getConfidenceColor(info.confidence)
                          )}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <Badge variant="outline" className="text-xs">
                              {info.category}
                            </Badge>
                            <span className="text-xs capitalize">{info.confidence} confidence</span>
                          </div>
                          <p className="text-sm">{info.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Uncertainties */}
          {uncertainties.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-score-warning" />
                  Uncertainties & Missing Data
                </CardTitle>
                <CardDescription>
                  These gaps may affect the accuracy of the evaluation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {uncertainties.map((uncertainty, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "p-4 rounded-lg flex items-start gap-3",
                      getImpactColor(uncertainty.impact)
                    )}
                  >
                    <Info className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{uncertainty.field}</span>
                        <Badge variant="outline" className="text-xs capitalize">
                          {uncertainty.impact} impact
                        </Badge>
                      </div>
                      <p className="text-sm opacity-80">{uncertainty.issue}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {uncertainties.length === 0 && (
            <Card className="mb-8 bg-score-good/5 border-score-good/20">
              <CardContent className="py-6 text-center">
                <CheckCircle2 className="w-10 h-10 text-score-good mx-auto mb-3" />
                <h3 className="font-semibold mb-1">All Data Extracted Successfully</h3>
                <p className="text-sm text-muted-foreground">
                  No significant uncertainties detected. Proceeding with high confidence.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button 
          onClick={onNext}
          disabled={isLoading}
          className="flex-1 h-11 gap-2 bg-gradient-primary hover:opacity-90"
        >
          Continue to Golden Questions
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
