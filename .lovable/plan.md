
# Plan: Replace Lovable AI with Keywords AI

## Overview

This plan replaces the Lovable AI gateway with Keywords AI in the `perception-audit` edge function. Your `keywordsai` secret is already configured, so no additional setup is needed.

## What Will Change

### Edge Function Update

**File:** `supabase/functions/perception-audit/index.ts`

1. **Change API endpoint** - Switch from `https://ai.gateway.lovable.dev/v1/chat/completions` to `https://api.keywordsai.co/api/chat/completions`

2. **Change API key** - Use the `keywordsai` secret instead of `LOVABLE_API_KEY`

3. **Update model reference** - Change from `google/gemini-3-flash-preview` to `gpt-4o-mini` (as shown in your code snippet)

4. **Update authorization header** - Keywords AI uses `Bearer <key>` format (same as current)

## Technical Details

```text
Before:
+------------------+     +---------------------------+     +--------+
| Edge Function    | --> | ai.gateway.lovable.dev    | --> | Gemini |
+------------------+     +---------------------------+     +--------+
       |
       v
  LOVABLE_API_KEY

After:
+------------------+     +---------------------------+     +---------+
| Edge Function    | --> | api.keywordsai.co         | --> | GPT-4o  |
+------------------+     +---------------------------+     +---------+
       |
       v
    keywordsai
```

## Changes Summary

| Aspect | Current | New |
|--------|---------|-----|
| API URL | `ai.gateway.lovable.dev/v1/chat/completions` | `api.keywordsai.co/api/chat/completions` |
| Secret | `LOVABLE_API_KEY` | `keywordsai` |
| Model | `google/gemini-3-flash-preview` | `gpt-4o-mini` |

## After Implementation

- The audit flow will use Keywords AI for all LLM calls
- Both the question-asking and analysis steps will go through Keywords AI
- Error handling remains the same (rate limits, payment errors, etc.)
