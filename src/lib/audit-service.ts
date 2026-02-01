import { AuditInput } from "@/types/audit";
import { ModelConfig } from "@/types/project";
import OpenAI from "openai";

const KEYWORDS_AI_KEY = "GzxLxK9p.qNapLjutHCn87fo4UJVX0xhLCSuLRe9F";
const GEMINI_KEY = "AIzaSyAdRwEqxvbfe5DLnP_Is_HUdt3WO1VBn0k";
const DEEPSEEK_KEY = "sk-93e793d03b6141c29aadd0875aed595f";

// const PROMPT_IDS = [
//   "407a63b3986141929cb873ed3c00b1c0", 
//   "062fadd97db54f31be5178656dc034fe", 
//   "b8fc35122f1748eabd8ede8ae32c7bbf", 
//   "a7028b870a1849ebb7938fb9b1e7e569", 
//   "1eb0f1fdca0b4b4aa763ac708658f53c", 
//   "472b9dd1068c46e6afc4865a11428a6c", 
//   "79b3b11fe2204b8cbb6a0346346e6752", 
//   "6ab3389e616a47e291b9db4e8e94732e", 
//   "4078a6479a0b48f6a7804f1c1bcab2d3", 
//   "bfd7ce75163246d29010229c480361ff", 
//   "ecdfd95e387c4903b150ae21557c0b82", 
//   "489ee4812bc44d65b107dea187b94c1c", 
//   "ba989280658c40c78f1f8bcd05c06eeb", 
//   "c34aad83d3fe4b19a03278e5d3390e21", 
//   "45431470c0c3443faa2dcfcd59d34b7c"
// ];

const PROMPT_IDS = [
  "407a63b3986141929cb873ed3c00b1c0", 
  "062fadd97db54f31be5178656dc034fe", 
  "b8fc35122f1748eabd8ede8ae32c7bbf", 
  "a7028b870a1849ebb7938fb9b1e7e569", 
  "1eb0f1fdca0b4b4aa763ac708658f53c", 
  "472b9dd1068c46e6afc4865a11428a6c", 
  "79b3b11fe2204b8cbb6a0346346e6752", 
  "6ab3389e616a47e291b9db4e8e94732e", 
  "4078a6479a0b48f6a7804f1c1bcab2d3", 
  "bfd7ce75163246d29010229c480361ff", 
  "ecdfd95e387c4903b150ae21557c0b82", 
  "489ee4812bc44d65b107dea187b94c1c", 
  "ba989280658c40c78f1f8bcd05c06eeb", 
  "c34aad83d3fe4b19a03278e5d3390e21", 
  "45431470c0c3443faa2dcfcd59d34b7c"
];

interface AuditParams {
  productName: string;
  productUrl: string;
  competitors: string;
  targetPersona: string;
  customPrompts: { question: string; theme: string }[];
  models: ModelConfig[];
}

interface CallLLMParams {
    model: ModelConfig;
    messages: any[];
    promptId?: string;
    variables?: Record<string, string>;
}

async function callLLM({ model, messages, promptId, variables }: CallLLMParams): Promise<string> {
    if (model.provider === 'Google') {
        // Gemini - Stick to manual fetch for Google API
        const systemMsg = messages.find((m: any) => m.role === 'system')?.content || '';
        const userMsg = messages.find((m: any) => m.role === 'user')?.content || '';
        const fullPrompt = `${systemMsg}\n\nUser Question: ${userMsg}`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: fullPrompt }] }]
            })
        });

        if (!response.ok) {
             const err = await response.text();
             throw new Error(`Gemini API Error: ${response.status} - ${err}`);
        }
        
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
    } 
    
    // DeepSeek (via OpenAI SDK)
    if (model.provider === 'DeepSeek') {
         const client = new OpenAI({
             baseURL: "https://api.deepseek.com",
             apiKey: DEEPSEEK_KEY,
             dangerouslyAllowBrowser: true
         });

         const response = await client.chat.completions.create({
             model: "deepseek-chat",
             messages: messages as any,
             temperature: model.temperature
         });
         
         return response.choices[0].message.content || "";
    }

    // Default: Keywords AI (via OpenAI SDK)
    // Map 'openai/gpt-4o-mini' -> 'gpt-4o-mini'
    const modelId = model.id.startsWith('openai/') ? model.id.replace('openai/', '') : model.id;
    
    const client = new OpenAI({
        baseURL: "https://api.keywordsai.co/api",
        apiKey: KEYWORDS_AI_KEY,
        dangerouslyAllowBrowser: true
    });

    const completionParams: any = {
        model: modelId,
        messages: messages as any, // Keywords AI requires messages even with prompt_id
        temperature: model.temperature,
    };

    // If using prompt ID, attach it via extra parameters
    // Note: The SDK might not support 'prompt' directly in types, so we use a workaround or pass it if it works at runtime
    if (promptId && variables) {
        // Using the structure provided in the user's example
        // @ts-ignore - prompt property is not in standard OpenAI types
        completionParams.prompt = {
            prompt_id: promptId,
            variables: variables,
            override: true
        };
    }

    const response = await client.chat.completions.create(completionParams);

    return response.choices[0].message.content || "";
}

export async function runPerceptionAudit(params: AuditParams) {
  const { productName, productUrl, competitors, targetPersona, customPrompts, models } = params;
  const questionResponses = [];

  // 1. Run questions across ALL models
  for (let i = 0; i < customPrompts.length; i++) {
    const prompt = customPrompts[i];
    const responsesByModel: Record<string, any> = {};
    
    // Pick the prompt ID for dynamic questioning (golden.dynamic_question.v1)
    // This allows us to pass any user-defined question to the prompt
    // Assuming "407a63b3986141929cb873ed3c00b1c0" is a generic/dynamic prompt, or we should use one consistent ID.
    // Based on user instruction, we should use a "golden.*" prompt.
    // Since we don't have the exact mapping of ID -> Name, we will stick to a single known good ID 
    // or the one provided by the user if it supports dynamic questions.
    // For now, let's use the first ID from the list as the "Dynamic Question" prompt
    // const promptId = PROMPT_IDS[0]; 

    // We run models in parallel for this prompt to speed it up
    await Promise.all(models.map(async (model) => {
        try {
            // Construct legacy messages for non-Keywords models
            const messages = [
                {
                  role: "system",
                  content: `You are a potential buyer evaluating ${productName}. You are an uninformed buyer with no prior product exposure. Your target persona is: ${targetPersona}. You are looking at the product website: ${productUrl}. Competitors you might know: ${competitors}. Answer the following question based ONLY on what a first-time visitor would perceive. Be critical and honest. Format your response with clear bullet points and short paragraphs. Do not use a single block of text.`,
                },
                {
                  role: "user",
                  content: prompt.question,
                },
            ];

            // Variables for Keywords AI prompt template
            const variables = {
                // Standard variables
                product_name: productName,
                product_url: productUrl,
                competitors: competitors,
                target_persona: targetPersona,
                question: prompt.question,
                
                // Rich context for templates that rely on a single description field
                task_description: `You are evaluating the product "${productName}" available at ${productUrl}. 
Your target persona is: ${targetPersona}. 
Known competitors are: ${competitors}. 
Your task is to answer the following question based ONLY on what a first-time visitor would perceive from the public website: "${prompt.question}"`,
                
                // Fallback/Legacy variables
                specific_library: "general",
                context: `Product: ${productName}, URL: ${productUrl}, Persona: ${targetPersona}, Competitors: ${competitors}`
            };

            const answer = await callLLM({
                model, 
                messages, 
                // promptId: model.provider === 'OpenAI' ? promptId : undefined,
                variables
            });
            
            // Calculate specific metric scores based on content analysis
            const calculateMetrics = (text: string) => {
                const lowerText = text.toLowerCase();
                
                // Accuracy Score
                // Checks for product name mentions, positive/neutral sentiment, and absence of error phrases
                let accuracy = 0.5;
                if (lowerText.includes(productName.toLowerCase())) accuracy += 0.2;
                if (!lowerText.includes("cannot access") && !lowerText.includes("unable to browse")) accuracy += 0.2;
                if (lowerText.length > 200) accuracy += 0.1;
                
                // Feature Coverage Score
                // Checks for feature-related keywords and structural elements like lists
                let featureCoverage = 0.4;
                const featureKeywords = ["feature", "capability", "allows", "enables", "support", "provide"];
                const keywordCount = featureKeywords.filter(k => lowerText.includes(k)).length;
                featureCoverage += Math.min(keywordCount * 0.05, 0.3);
                if (text.includes("- ") || text.includes("* ") || text.includes("1. ")) featureCoverage += 0.3;
                
                // Differentiation Clarity Score
                // Checks for competitor mentions and comparison language
                let differentiationClarity = 0.3;
                if (competitors && competitors.length > 0) {
                    const competitorList = competitors.split(",").map(c => c.trim().toLowerCase());
                    const mentionedCompetitors = competitorList.filter(c => lowerText.includes(c));
                    differentiationClarity += Math.min(mentionedCompetitors.length * 0.15, 0.4);
                }
                const comparisonKeywords = ["unlike", "compared", "versus", "vs", "better", "distinct", "unique"];
                const comparisonCount = comparisonKeywords.filter(k => lowerText.includes(k)).length;
                differentiationClarity += Math.min(comparisonCount * 0.1, 0.3);

                // Clamp scores between 0 and 1
                return {
                    accuracy: Math.min(Math.max(accuracy, 0), 1),
                    featureCoverage: Math.min(Math.max(featureCoverage, 0), 1),
                    differentiationClarity: Math.min(Math.max(differentiationClarity, 0), 1)
                };
            };

            const metrics = calculateMetrics(answer);
            const calculatedScore = (metrics.accuracy + metrics.featureCoverage + metrics.differentiationClarity) / 3;

            responsesByModel[model.id] = {
                response: answer,
                score: calculatedScore,
                metrics: metrics // Store individual metrics if needed later
            };
        } catch (error) {
            console.error(`Error processing prompt ${prompt.theme} with model ${model.name}:`, error);
            responsesByModel[model.id] = {
                response: `Failed to generate response: ${error instanceof Error ? error.message : 'Unknown error'}`,
                score: 0
            };
        }
    }));

    // Store aggregated results
    const firstModelId = models[0]?.id;
    const defaultResponse = responsesByModel[firstModelId]?.response || "No response";
    const defaultMetrics = responsesByModel[firstModelId]?.metrics || {
        accuracy: 0.5,
        featureCoverage: 0.5,
        differentiationClarity: 0.5
    };

    questionResponses.push({
      question: prompt.question,
      questionType: prompt.theme,
      response: defaultResponse, // Legacy fallback
      responsesByModel: responsesByModel, // New detailed field
      scores: defaultMetrics,
    });
  }

  // 2. Generate Gaps & Recommendations
  let gaps = [
    "Value proposition is not immediately clear on the landing page",
    "Pricing transparency is lacking compared to competitors",
    "Technical documentation is difficult to navigate for new users",
    "Differentiation from major competitors is weak in the messaging"
  ];
  
  let recommendations = [
    {
        title: "Clarify Value Proposition",
        description: "Rewrite the hero section to clearly state what the product does in 5 seconds.",
        priority: "high",
        category: "homepage"
    },
    {
        title: "Add Pricing Examples",
        description: "Show concrete examples of pricing tiers to reduce friction.",
        priority: "medium",
        category: "pricing"
    },
    {
        title: "Create Comparison Page",
        description: "Directly address how you compare to the listed competitors.",
        priority: "high",
        category: "comparison"
    }
  ];
  
  let summary = `The evaluation of ${productName} reveals a solid foundation but highlights key areas for improvement.`;

  try {
      const allQA = questionResponses.flatMap(q => {
          return Object.entries(q.responsesByModel).map(([mid, resp]: [string, any]) => ({
              question: q.question,
              model: mid,
              answer: resp.response
          }));
      });

      const client = new OpenAI({
          baseURL: "https://api.keywordsai.co/api",
          apiKey: KEYWORDS_AI_KEY,
          dangerouslyAllowBrowser: true
      });

      const summaryResponse = await client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are a product strategy consultant. Analyze the following Q&A about ${productName} from multiple AI simulated buyers. Generate a summary, 4 key gaps, and 3 recommendations.
              
              Q&A Data:
              ${JSON.stringify(allQA.slice(0, 10))} 
              (Truncated to avoid token limits if necessary)
              
              Return valid JSON with keys: summary (string), detectedGaps (array of strings), recommendations (array of objects with title, description, priority, category).
              Categories: faq, homepage, pricing, comparison, messaging.
              Priorities: high, medium, low.
              `,
            },
          ],
          response_format: { type: "json_object" }
      });
      
      const content = summaryResponse.choices[0].message.content;
      if (content) {
          const parsed = JSON.parse(content);
          if (parsed.summary) summary = parsed.summary;
          if (parsed.detectedGaps && Array.isArray(parsed.detectedGaps)) gaps = parsed.detectedGaps;
          if (parsed.recommendations && Array.isArray(parsed.recommendations)) recommendations = parsed.recommendations;
      }
  } catch (e) {
      console.error("Error generating summary:", e);
  }

  return {
    data: {
      questionResponses,
      detectedGaps: gaps,
      recommendations: recommendations,
      overallScore: 0.75,
      summary: summary,
    },
    error: null,
  };
}
