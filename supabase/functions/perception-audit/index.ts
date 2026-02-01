import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const GOLDEN_QUESTIONS = [
  { question: "What does this product do?", type: "Core Function" },
  { question: "Who is this product for?", type: "Target Audience" },
  { question: "What problem does it solve?", type: "Value Proposition" },
  { question: "What are its top 3 features?", type: "Feature Highlights" },
  { question: "How is it different from competitors?", type: "Differentiation" },
  { question: "What is the pricing model?", type: "Pricing" },
  { question: "When should someone NOT use this product?", type: "Limitations" },
];

interface AuditInput {
  productName: string;
  productUrl: string;
  competitors?: string;
  targetPersona: string;
  model?: string;
}

const SUPPORTED_MODELS = ["gpt-4o-mini", "gpt-5-mini"];
const DEFAULT_MODEL = "gpt-5-mini";

async function queryAI(prompt: string, apiKey: string, model: string = DEFAULT_MODEL): Promise<string> {
  const response = await fetch("https://api.keywordsai.co/api/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: "system", content: "You are a potential buyer researching products. Answer questions based on your general knowledge. Be concise and direct." },
        { role: "user", content: prompt }
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("AI API error:", response.status, errorText);
    throw new Error(`AI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "No response generated";
}

async function analyzeResponses(
  productName: string, 
  productUrl: string, 
  competitors: string,
  targetPersona: string,
  responses: { question: string; type: string; response: string }[],
  apiKey: string
): Promise<any> {
  const analysisPrompt = `You are an expert product marketing analyst. Analyze these AI-generated responses about "${productName}" (${productUrl}).

Target Persona: ${targetPersona}
${competitors ? `Competitors: ${competitors}` : ''}

AI Responses:
${responses.map((r, i) => `${i + 1}. ${r.type}: "${r.question}"
Response: ${r.response}`).join('\n\n')}

Provide a JSON analysis with:
1. For each response, score (0-1) for: accuracy, featureCoverage, differentiationClarity
2. Identify risks per response: "incorrect pricing", "missing features", "competitor confusion", "outdated info"
3. Overall perception score (0-1)
4. Summary of how AI perceives this product (2-3 sentences)
5. Detected gaps across all responses
6. 5 specific recommendations with: title, description, priority (high/medium/low), category (faq/homepage/pricing/comparison/messaging)

Return ONLY valid JSON in this exact structure:
{
  "questionAnalysis": [
    {
      "questionIndex": 0,
      "scores": { "accuracy": 0.8, "featureCoverage": 0.7, "differentiationClarity": 0.6 },
      "risks": ["missing features"]
    }
  ],
  "overallScore": 0.72,
  "summary": "AI systems describe the product as...",
  "detectedGaps": ["Missing key feature X", "Unclear pricing"],
  "recommendations": [
    {
      "title": "Add FAQ about pricing",
      "description": "AI responses show confusion about pricing tiers. Add a clear FAQ entry explaining your pricing model.",
      "priority": "high",
      "category": "faq"
    }
  ]
}`;

  const analysisResponse = await queryAI(analysisPrompt, apiKey);
  
  // Extract JSON from the response
  const jsonMatch = analysisResponse.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error("Failed to extract JSON from analysis:", analysisResponse);
    throw new Error("Failed to parse analysis response");
  }
  
  return JSON.parse(jsonMatch[0]);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const KEYWORDS_AI_KEY = Deno.env.get("keywordsai");
    if (!KEYWORDS_AI_KEY) {
      throw new Error("keywordsai secret is not configured");
    }

    const input: AuditInput = await req.json();
    const { productName, productUrl, competitors = "", targetPersona, model } = input;

    // Validate and select model
    const selectedModel = model && SUPPORTED_MODELS.includes(model) ? model : DEFAULT_MODEL;
    console.log(`Starting perception audit for: ${productName} using model: ${selectedModel}`);

    // Query AI for each golden question
    const responses: { question: string; type: string; response: string }[] = [];
    
    for (const q of GOLDEN_QUESTIONS) {
      const prompt = `As someone researching "${productName}" (website: ${productUrl}), ${q.question}`;
      console.log(`Querying: ${q.type}`);
      const response = await queryAI(prompt, KEYWORDS_AI_KEY, selectedModel);
      responses.push({
        question: q.question,
        type: q.type,
        response,
      });
    }

    // Analyze all responses
    console.log("Analyzing responses...");
    const analysis = await analyzeResponses(
      productName, 
      productUrl, 
      competitors, 
      targetPersona, 
      responses, 
      KEYWORDS_AI_KEY
    );

    // Build the report
    const report = {
      runId: crypto.randomUUID().slice(0, 8),
      productName,
      summary: analysis.summary,
      overallScore: analysis.overallScore,
      questionResponses: responses.map((r, i) => ({
        question: r.question,
        questionType: r.type,
        response: r.response,
        scores: analysis.questionAnalysis[i]?.scores || { accuracy: 0.5, featureCoverage: 0.5, differentiationClarity: 0.5 },
        risks: analysis.questionAnalysis[i]?.risks || [],
      })),
      detectedGaps: analysis.detectedGaps || [],
      recommendations: analysis.recommendations || [],
      timestamp: new Date().toISOString(),
    };

    console.log("Audit complete:", report.runId);

    return new Response(JSON.stringify(report), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Perception audit error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
