import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Plus, X, MessageSquare, Bot, Send, Loader2 } from "lucide-react";
import type { GoldenPrompt } from "@/types/project";
import { cn } from "@/lib/utils";

interface Step3Props {
  prompts: GoldenPrompt[];
  productName: string;
  competitors: string[];
  onPromptsChange: (prompts: GoldenPrompt[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step3GoldenPrompts({ 
  prompts, 
  productName,
  competitors,
  onPromptsChange, 
  onNext, 
  onBack 
}: Step3Props) {
  const [chatInput, setChatInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    {
      role: 'assistant',
      content: `I can help you generate more questions for evaluating ${productName}. Try asking me things like:\n- "Generate comparison questions"\n- "Add questions about scaling"\n- "Create pricing-focused questions"\n- "Add questions about integrations"`
    }
  ]);

  const enabledPrompts = prompts.filter(p => p.enabled).length;

  const updatePromptQuestion = (id: string, question: string) => {
    onPromptsChange(prompts.map(p => 
      p.id === id ? { ...p, question } : p
    ));
  };

  const addPrompt = (question: string = "", theme: string = "Custom") => {
    const newId = (Math.max(0, ...prompts.map(p => parseInt(p.id))) + 1).toString();
    onPromptsChange([...prompts, { 
      id: newId, 
      question, 
      theme, 
      enabled: true 
    }]);
  };

  const removePrompt = (id: string) => {
    onPromptsChange(prompts.filter(p => p.id !== id));
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage = chatInput.trim();
    setChatInput("");
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsGenerating(true);

    // Simulate AI response with generated questions
    await new Promise(resolve => setTimeout(resolve, 1000));

    let generatedQuestions: {question: string, theme: string}[] = [];
    const input = userMessage.toLowerCase();

    if (input.includes('comparison') || input.includes('compare')) {
      generatedQuestions = competitors.slice(0, 2).map(comp => ({
        question: `What are the key differences between ${productName} and ${comp} for enterprise teams?`,
        theme: 'Comparison'
      }));
    } else if (input.includes('scaling') || input.includes('scale')) {
      generatedQuestions = [
        { question: `How does ${productName} handle scaling from small teams to enterprise?`, theme: 'Scaling' },
        { question: `What are the performance limits of ${productName} for large organizations?`, theme: 'Scaling' },
      ];
    } else if (input.includes('pricing') || input.includes('cost')) {
      generatedQuestions = [
        { question: `What is the total cost of ownership for ${productName}?`, theme: 'Pricing' },
        { question: `How does ${productName}'s pricing compare to alternatives?`, theme: 'Pricing' },
      ];
    } else if (input.includes('integration')) {
      generatedQuestions = [
        { question: `What integrations does ${productName} support out of the box?`, theme: 'Integrations' },
        { question: `How easy is it to integrate ${productName} with existing tools?`, theme: 'Integrations' },
      ];
    } else if (input.includes('security')) {
      generatedQuestions = [
        { question: `What security certifications does ${productName} have?`, theme: 'Security' },
        { question: `How does ${productName} handle data privacy and compliance?`, theme: 'Security' },
      ];
    } else {
      generatedQuestions = [
        { question: `What makes ${productName} unique in the market?`, theme: 'Custom' },
      ];
    }

    // Add generated questions
    generatedQuestions.forEach(q => addPrompt(q.question, q.theme));

    setChatMessages(prev => [...prev, { 
      role: 'assistant', 
      content: `I've added ${generatedQuestions.length} question(s) to your list:\n\n${generatedQuestions.map(q => `• ${q.question}`).join('\n')}`
    }]);
    
    setIsGenerating(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Golden Questions</h1>
        <p className="text-muted-foreground">
          These questions are tailored to {productName} and will be asked to AI models. Edit, add, or remove as needed.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Questions List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-primary" />
              <div>
                <CardTitle className="text-lg">Evaluation Questions</CardTitle>
                <CardDescription>{enabledPrompts} questions ready</CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => addPrompt()} className="gap-1.5">
              <Plus className="w-4 h-4" />
              Add Question
            </Button>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
            {prompts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No questions yet. Add one or use the assistant to generate questions.</p>
              </div>
            ) : (
              prompts.map((prompt) => (
                <div 
                  key={prompt.id}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {prompt.theme}
                      </Badge>
                    </div>
                    <Textarea
                      value={prompt.question}
                      onChange={(e) => updatePromptQuestion(prompt.id, e.target.value)}
                      placeholder="Enter your question..."
                      className="min-h-[60px] resize-none text-sm"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removePrompt(prompt.id)}
                    className="text-muted-foreground hover:text-destructive shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Question Generation Assistant */}
        <Card className="flex flex-col h-[660px]">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Question Assistant</CardTitle>
            </div>
            <CardDescription>Ask me to generate specific types of questions</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col overflow-hidden">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {chatMessages.map((msg, i) => (
                <div 
                  key={i}
                  className={cn(
                    "p-3 rounded-lg text-sm whitespace-pre-wrap",
                    msg.role === 'user' 
                      ? "bg-primary text-primary-foreground ml-4" 
                      : "bg-secondary mr-4"
                  )}
                >
                  {msg.content}
                </div>
              ))}
              {isGenerating && (
                <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg mr-4">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Generating questions...</span>
                </div>
              )}
            </div>
            
            {/* Chat Input */}
            <div className="flex gap-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask for question suggestions..."
                onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
                disabled={isGenerating}
              />
              <Button 
                size="icon" 
                onClick={handleChatSubmit}
                disabled={isGenerating || !chatInput.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-6">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button 
          onClick={onNext} 
          disabled={enabledPrompts === 0}
          className="flex-1 h-11 gap-2 bg-gradient-primary hover:opacity-90"
        >
          Continue to Scoring Rubric
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
