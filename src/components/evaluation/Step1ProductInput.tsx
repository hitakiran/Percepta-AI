import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, FileText, DollarSign, ArrowRight, Users, Building2, X, Plus } from "lucide-react";
import type { TargetPersona } from "@/types/project";

interface ProductInputProps {
  data: {
    name: string;
    websiteUrl: string;
    docsUrl: string;
    pricingUrl: string;
    description: string;
    competitors: string[];
    targetPersona: TargetPersona;
  };
  onChange: (data: ProductInputProps['data']) => void;
  onNext: () => void;
}

const COMPANY_SIZES = [
  "Startup (1-10)",
  "Small (11-50)",
  "Medium (51-200)",
  "Large (201-1000)",
  "Enterprise (1000+)",
];

const TEAM_TYPES = [
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Sales",
  "Operations",
  "Finance",
  "HR",
  "Cross-functional",
];

export function Step1ProductInput({ data, onChange, onNext }: ProductInputProps) {
  const [newCompetitor, setNewCompetitor] = useState("");
  
  const isValid = data.name.trim() && data.websiteUrl.trim();

  const addCompetitor = () => {
    if (newCompetitor.trim() && !data.competitors.includes(newCompetitor.trim())) {
      onChange({ 
        ...data, 
        competitors: [...data.competitors, newCompetitor.trim()] 
      });
      setNewCompetitor("");
    }
  };

  const removeCompetitor = (index: number) => {
    onChange({
      ...data,
      competitors: data.competitors.filter((_, i) => i !== index),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCompetitor();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Product Information</h1>
        <p className="text-muted-foreground">
          Enter your product details, competitors, and target persona. This information will be used to generate specific evaluation questions.
        </p>
      </div>

      <div className="space-y-6">
        {/* Basic Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
            <CardDescription>Your product's core details and URLs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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

            <div className="grid gap-4 sm:grid-cols-2">
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
                placeholder="A brief description of what your product does..."
                value={data.description}
                onChange={(e) => onChange({ ...data, description: e.target.value })}
                className="min-h-[80px] resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Competitors Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Competitors
            </CardTitle>
            <CardDescription>
              Add competitors to generate comparison questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter competitor name..."
                value={newCompetitor}
                onChange={(e) => setNewCompetitor(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button 
                variant="outline" 
                onClick={addCompetitor}
                disabled={!newCompetitor.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {data.competitors.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.competitors.map((competitor, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="flex items-center gap-1 py-1.5 px-3"
                  >
                    {competitor}
                    <button 
                      onClick={() => removeCompetitor(index)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No competitors added yet. Add competitors like "Slack", "Asana", or "Monday.com".
              </p>
            )}
          </CardContent>
        </Card>

        {/* Target Persona Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Target Persona
            </CardTitle>
            <CardDescription>
              Define your ideal buyer to generate relevant questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="persona-role">Role / Title</Label>
              <Input
                id="persona-role"
                placeholder="e.g., Product Manager, Engineering Lead, CTO"
                value={data.targetPersona.role}
                onChange={(e) => onChange({ 
                  ...data, 
                  targetPersona: { ...data.targetPersona, role: e.target.value }
                })}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Team Type</Label>
                <Select
                  value={data.targetPersona.teamType}
                  onValueChange={(value) => onChange({
                    ...data,
                    targetPersona: { ...data.targetPersona, teamType: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select team type" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEAM_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Company Size</Label>
                <Select
                  value={data.targetPersona.companySize}
                  onValueChange={(value) => onChange({
                    ...data,
                    targetPersona: { ...data.targetPersona, companySize: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPANY_SIZES.map((size) => (
                      <SelectItem key={size} value={size}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="persona-industry">
                Industry <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Input
                id="persona-industry"
                placeholder="e.g., SaaS, Fintech, Healthcare"
                value={data.targetPersona.industry || ""}
                onChange={(e) => onChange({ 
                  ...data, 
                  targetPersona: { ...data.targetPersona, industry: e.target.value }
                })}
              />
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={onNext} 
          disabled={!isValid}
          className="w-full h-12 gap-2 bg-gradient-primary hover:opacity-90"
        >
          Continue to Source Trace
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
