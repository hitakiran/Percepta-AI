import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, FileText, DollarSign, ArrowRight } from "lucide-react";

interface ProductInputProps {
  data: {
    name: string;
    websiteUrl: string;
    docsUrl: string;
    pricingUrl: string;
    description: string;
  };
  onChange: (data: ProductInputProps['data']) => void;
  onNext: () => void;
}

export function Step1ProductInput({ data, onChange, onNext }: ProductInputProps) {
  const isValid = data.name.trim() && data.websiteUrl.trim();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Product Information</h1>
        <p className="text-muted-foreground">
          Enter your product details. We'll use this to evaluate how AI systems perceive your product.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="product-name" className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Product Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="product-name"
              placeholder="e.g., Notion, Figma, Linear"
              value={data.name}
              onChange={(e) => onChange({ ...data, name: e.target.value })}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website-url" className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              Website URL <span className="text-destructive">*</span>
            </Label>
            <Input
              id="website-url"
              type="url"
              placeholder="https://yourproduct.com"
              value={data.websiteUrl}
              onChange={(e) => onChange({ ...data, websiteUrl: e.target.value })}
              className="h-12"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="docs-url" className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                Documentation URL <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Input
                id="docs-url"
                type="url"
                placeholder="https://docs.yourproduct.com"
                value={data.docsUrl}
                onChange={(e) => onChange({ ...data, docsUrl: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pricing-url" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                Pricing URL <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Input
                id="pricing-url"
                type="url"
                placeholder="https://yourproduct.com/pricing"
                value={data.pricingUrl}
                onChange={(e) => onChange({ ...data, pricingUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Short Description <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Textarea
              id="description"
              placeholder="A brief description of what your product does and who it's for..."
              value={data.description}
              onChange={(e) => onChange({ ...data, description: e.target.value })}
              className="min-h-[100px] resize-none"
            />
            <p className="text-xs text-muted-foreground">
              This helps us generate more relevant evaluation questions.
            </p>
          </div>

          <Button 
            onClick={onNext} 
            disabled={!isValid}
            className="w-full h-12 gap-2 bg-gradient-primary hover:opacity-90"
          >
            Continue to Golden Prompts
            <ArrowRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
