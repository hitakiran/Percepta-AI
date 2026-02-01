import json
import urllib.request
import urllib.error
import ssl
import uuid
import datetime
import re

# Bypass SSL verification for testing purposes
ssl._create_default_https_context = ssl._create_unverified_context

API_KEY = "GzxLxK9p.qNapLjutHCn87fo4UJVX0xhLCSuLRe9F"
DEFAULT_MODEL = "gpt-4o-mini"
SUPPORTED_MODELS = ["gpt-4o-mini", "gpt-5-mini"]

GOLDEN_QUESTIONS = [
  { "question": "What does this product do?", "type": "Core Function" },
  { "question": "Who is this product for?", "type": "Target Audience" },
  { "question": "What problem does it solve?", "type": "Value Proposition" },
  { "question": "What are its top 3 features?", "type": "Feature Highlights" },
  { "question": "How is it different from competitors?", "type": "Differentiation" },
  { "question": "What is the pricing model?", "type": "Pricing" },
  { "question": "When should someone NOT use this product?", "type": "Limitations" },
]

def query_ai(prompt, model=DEFAULT_MODEL):
    url = "https://api.keywordsai.co/api/chat/completions"
    data = {
        "model": model,
        "messages": [
            {
                "role": "system",
                "content": "You are a potential buyer researching products. Answer questions based on your general knowledge. Be concise and direct."
            },
            {"role": "user", "content": prompt}
        ]
    }
    
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode('utf-8'),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {API_KEY}"
        },
        method="POST"
    )

    try:
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            return result.get("choices", [{}])[0].get("message", {}).get("content", "No response generated")
    except urllib.error.HTTPError as e:
        error_text = e.read().decode('utf-8')
        print(f"AI API error: {e.code} {error_text}")
        raise Exception(f"AI API error: {e.code}")

def analyze_responses(product_name, product_url, competitors, target_persona, responses):
    formatted_responses = "\n\n".join([
        f"{i+1}. {r['type']}: \"{r['question']}\"\nResponse: {r['response']}"
        for i, r in enumerate(responses)
    ])

    competitors_text = f"Competitors: {competitors}" if competitors else ""

    analysis_prompt = f"""You are an expert product marketing analyst. Analyze these AI-generated responses about "{product_name}" ({product_url}).

Target Persona: {target_persona}
{competitors_text}

AI Responses:
{formatted_responses}

Provide a JSON analysis with:
1. For each response, score (0-1) for: accuracy, featureCoverage, differentiationClarity
2. Identify risks per response: "incorrect pricing", "missing features", "competitor confusion", "outdated info"
3. Overall perception score (0-1)
4. Summary of how AI perceives this product (2-3 sentences)
5. Detected gaps across all responses
6. 5 specific recommendations with: title, description, priority (high/medium/low), category (faq/homepage/pricing/comparison/messaging)

Return ONLY valid JSON in this exact structure:
{{
  "questionAnalysis": [
    {{
      "questionIndex": 0,
      "scores": {{ "accuracy": 0.8, "featureCoverage": 0.7, "differentiationClarity": 0.6 }},
      "risks": ["missing features"]
    }}
  ],
  "overallScore": 0.72,
  "summary": "AI systems describe the product as...",
  "detectedGaps": ["Missing key feature X", "Unclear pricing"],
  "recommendations": [
    {{
      "title": "Add FAQ about pricing",
      "description": "AI responses show confusion about pricing tiers. Add a clear FAQ entry explaining your pricing model.",
      "priority": "high",
      "category": "faq"
    }}
  ]
}}"""

    analysis_response = query_ai(analysis_prompt)
    
    # Extract JSON
    json_match = re.search(r'\{[\s\S]*\}', analysis_response)
    if not json_match:
        print("Failed to extract JSON from analysis:", analysis_response)
        raise Exception("Failed to parse analysis response")
        
    return json.loads(json_match.group(0))

def main():
    input_data = {
        "productName": "Keywords AI",
        "productUrl": "https://keywordsai.co",
        "targetPersona": "Developer",
        "model": "gpt-4o-mini"
    }
    
    product_name = input_data["productName"]
    product_url = input_data["productUrl"]
    competitors = input_data.get("competitors", "")
    target_persona = input_data["targetPersona"]
    model = input_data.get("model")
    
    selected_model = model if model in SUPPORTED_MODELS else DEFAULT_MODEL
    print(f"Starting perception audit for: {product_name} using model: {selected_model}")
    
    responses = []
    
    for q in GOLDEN_QUESTIONS:
        prompt = f'As someone researching "{product_name}" (website: {product_url}), {q["question"]}'
        print(f"Querying: {q['type']}")
        response = query_ai(prompt, selected_model)
        responses.append({
            "question": q["question"],
            "type": q["type"],
            "response": response
        })
        
    print("Analyzing responses...")
    analysis = analyze_responses(product_name, product_url, competitors, target_persona, responses)
    
    report = {
        "runId": str(uuid.uuid4())[:8],
        "productName": product_name,
        "summary": analysis.get("summary"),
        "overallScore": analysis.get("overallScore"),
        "questionResponses": [
            {
                "question": r["question"],
                "questionType": r["type"],
                "response": r["response"],
                "scores": (analysis.get("questionAnalysis", [])[i].get("scores") if i < len(analysis.get("questionAnalysis", [])) else {
                    "accuracy": 0.5,
                    "featureCoverage": 0.5,
                    "differentiationClarity": 0.5
                }),
                "risks": (analysis.get("questionAnalysis", [])[i].get("risks") if i < len(analysis.get("questionAnalysis", [])) else [])
            }
            for i, r in enumerate(responses)
        ],
        "detectedGaps": analysis.get("detectedGaps", []),
        "recommendations": analysis.get("recommendations", []),
        "timestamp": datetime.datetime.now().isoformat()
    }
    
    print("Audit complete:", report["runId"])
    print(json.dumps(report, indent=2))

if __name__ == "__main__":
    main()
