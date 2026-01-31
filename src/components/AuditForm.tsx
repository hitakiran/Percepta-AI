import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Globe, Users, Swords } from "lucide-react";
import type { AuditInput } from "@/types/audit";

interface AuditFormProps {
  onSubmit: (data: AuditInput) => void;
  isLoading: boolean;
}

export function AuditForm({ onSubmit, isLoading }: AuditFormProps) {
  const [formData, setFormData] = useState<AuditInput>({
    productName: "",
    productUrl: "",
    competitors: "",
    targetPersona: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isValid = formData.productName && formData.productUrl && formData.targetPersona;

  return (
    <Card className="border-0 shadow-lg bg-card">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-bold">Product Details</CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your product information to analyze AI perception
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="productName" className="flex items-center gap-2 text-sm font-medium">
              <Search className="w-4 h-4 text-primary" />
              Product Name
            </Label>
            <Input
              id="productName"
              placeholder="e.g., Notion, Figma, Slack"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              className="h-12 bg-secondary/50 border-border focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="productUrl" className="flex items-center gap-2 text-sm font-medium">
              <Globe className="w-4 h-4 text-primary" />
              Product Website URL
            </Label>
            <Input
              id="productUrl"
              type="url"
              placeholder="https://yourproduct.com"
              value={formData.productUrl}
              onChange={(e) => setFormData({ ...formData, productUrl: e.target.value })}
              className="h-12 bg-secondary/50 border-border focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="competitors" className="flex items-center gap-2 text-sm font-medium">
              <Swords className="w-4 h-4 text-primary" />
              Competitors <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Input
              id="competitors"
              placeholder="e.g., Competitor A, Competitor B"
              value={formData.competitors}
              onChange={(e) => setFormData({ ...formData, competitors: e.target.value })}
              className="h-12 bg-secondary/50 border-border focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetPersona" className="flex items-center gap-2 text-sm font-medium">
              <Users className="w-4 h-4 text-primary" />
              Target Persona
            </Label>
            <Textarea
              id="targetPersona"
              placeholder="Describe your ideal customer (e.g., 'Small business owners looking for project management tools')"
              value={formData.targetPersona}
              onChange={(e) => setFormData({ ...formData, targetPersona: e.target.value })}
              className="min-h-[100px] bg-secondary/50 border-border focus:border-primary transition-colors resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={!isValid || isLoading}
            className="w-full h-12 text-base font-semibold bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Analyzing Perception...
              </span>
            ) : (
              "Run Perception Audit"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
