import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Search, BarChart3, Lightbulb, ArrowRight, CheckCircle2, Target, Eye, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-surface">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 pt-20 pb-24 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <Brain className="w-4 h-4" />
              AI Perception Analysis Tool
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              See how AI understands
              <br />
              <span className="text-gradient">your product today</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Discover what AI systems say about your product. Identify gaps, inaccuracies, 
              and weak positioning—then get clear, actionable fixes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/evaluate')}
                className="h-14 px-8 text-base font-semibold bg-gradient-primary hover:opacity-90 shadow-glow"
              >
                Start Evaluation
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="h-14 px-8 text-base font-semibold"
              >
                View Dashboard
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What It Does */}
      <section className="py-20 bg-card border-y">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What This Product Does</h2>
            <p className="text-lg text-muted-foreground">
              A web app that shows how AI understands your product today — and what's missing for it to understand you correctly.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-8 pb-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <Eye className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">See AI Perception</h3>
                <p className="text-muted-foreground text-sm">
                  Run buyer-style questions through multiple LLMs and see exactly how they describe your product.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-8 pb-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <Target className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Identify Gaps</h3>
                <p className="text-muted-foreground text-sm">
                  Spot missing information, incorrect descriptions, weak differentiators, and hallucinated content.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-8 pb-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <Lightbulb className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Get Fixes</h3>
                <p className="text-muted-foreground text-sm">
                  Receive specific, actionable recommendations to improve how AI explains your product.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">
              A structured, transparent evaluation process in 7 steps
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid gap-6">
              {[
                { step: 1, title: "Enter Product Info", desc: "Provide your website URL and optional documentation links" },
                { step: 2, title: "Customize Questions", desc: "Review and edit 8 AI-generated 'Golden Questions' based on your product" },
                { step: 3, title: "Select Models", desc: "Choose which LLMs to query (Gemini, GPT-5, etc.)" },
                { step: 4, title: "Watch Generation", desc: "See live trace logs as AI queries run with full transparency" },
                { step: 5, title: "Review Results", desc: "Analyze question-by-question responses with detailed scoring" },
                { step: 6, title: "Identify Gaps", desc: "See categorized failures: missing info, incorrect facts, hallucinations" },
                { step: 7, title: "Apply Fixes", desc: "Get grouped, actionable recommendations to improve your content" },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                    {item.step}
                  </div>
                  <div className="pt-1">
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why It's Useful */}
      <section className="py-20 bg-card border-y">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Your Business Needs This</h2>
            <p className="text-lg text-muted-foreground">
              AI tools are shaping how buyers discover and evaluate products
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              "Product teams can't control how AI describes their product",
              "AI responses influence buying decisions before users visit your site",
              "Incorrect positioning means lost opportunities",
              "Outdated information erodes trust in your brand",
              "Missing features in AI responses hurt conversions",
              "Competitors may be better represented in AI outputs",
            ].map((point, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to audit your AI perception?
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            See exactly how AI understands your product and get actionable fixes in minutes.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/evaluate')}
            className="h-14 px-10 text-base font-semibold bg-gradient-primary hover:opacity-90 shadow-glow"
          >
            Start Your Free Evaluation
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>AI Product Perception Auditor • Built for Hackathon Demo</p>
        </div>
      </footer>
    </div>
  );
}
