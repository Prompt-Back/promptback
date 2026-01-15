import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are Claude operating as a senior AI product designer, reverse-prompt engineer, and UI/UX critic with 10+ years of experience in:

- High-end SaaS design (Stripe, Linear, Vercel tier)
- Design systems and layout archaeology
- Prompt engineering and intent reconstruction

Your specialty is reverse-engineering finished digital products into the prompts that likely created them.

STRICT RULES:
- No emojis
- No hype language
- No "AI magic" wording
- No guessing brand names
- No claiming certainty where there is none
- Use whitespace-friendly formatting
- Write like a senior designer documenting work
- Prefer clarity over verbosity
- Be elegant, not clever

You think like a calm, precise, opinionated senior designer. You do NOT hallucinate, embellish, or produce generic output.

When analyzing a website, you must provide your response in a specific JSON format.`;

const ANALYSIS_PROMPT = `Analyze the following website and reverse-engineer it into the prompts that most likely created it.

INPUT TYPE: {type}
INPUT: {input}

Analyze the site and reconstruct the original design + build prompts based on:
- Layout structure
- Spacing & grid logic
- Typography philosophy
- Color usage
- Component hierarchy
- Motion assumptions (if any)
- Product intent
- Target audience
- Design maturity level

Silently infer:
- What kind of product this is (SaaS, crypto, fintech, devtool, media, etc.)
- The design maturity (junior / mid / senior / studio-grade)
- Whether it was likely AI-generated, human-designed, or AI-assisted
- Which design references it resembles
- What constraints the original creator likely gave the AI

You MUST respond with valid JSON in this exact structure:
{
  "coreIntentPrompt": "A single, clean, reusable master prompt that captures the essence of the website. Written as if for Cursor/Claude/GPT. Calm, confident, professional tone.",
  "uiSystemPrompt": "A detailed design-system-level prompt describing: Layout system (grid, spacing, margins), Typography style (without guessing exact fonts unless obvious), Color philosophy, Visual density, Interaction philosophy, Responsiveness expectations. This should feel like something a senior designer would actually write.",
  "componentPrompts": {
    "navigation": "Short, precise, reusable prompt for the navigation component",
    "hero": "Short, precise, reusable prompt for the hero section",
    "content_sections": "Prompt for main content sections",
    "cards_or_data": "Prompt for cards, tables, or dashboard elements if present",
    "footer_or_cta": "Prompt for footer or call-to-action sections"
  },
  "styleDna": ["Array", "of", "aesthetic", "identity", "descriptors"],
  "assumptions": "Clearly state: What is directly inferred, what is assumed, what is uncertain.",
  "confidenceLevel": "High confidence / Medium confidence / Low confidence - with brief explanation"
}

Only use style DNA terms if applicable. Examples: Minimal, Editorial, Brutalist, Fintech-grade, Developer-centric, Crypto-native, Enterprise-calm, Experimental.

If the input is a description rather than a URL, analyze what website WOULD look like based on the description and generate prompts that would create it.

Respond ONLY with valid JSON. No markdown, no explanation text before or after.`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, value } = body;

    if (!type || !value) {
      return NextResponse.json(
        { error: 'Missing required fields: type and value' },
        { status: 400 }
      );
    }

    if (!['url', 'description'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be "url" or "description"' },
        { status: 400 }
      );
    }

    const userPrompt = ANALYSIS_PROMPT
      .replace('{type}', type === 'url' ? 'Website URL' : 'Website Description')
      .replace('{input}', value);

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      system: SYSTEM_PROMPT,
    });

    // Extract the text content from the response
    const textContent = message.content.find((block) => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in response');
    }

    // Parse the JSON response
    let analysisData;
    try {
      // Clean the response - remove any markdown code blocks if present
      let cleanedResponse = textContent.text.trim();
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.slice(7);
      }
      if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.slice(3);
      }
      if (cleanedResponse.endsWith('```')) {
        cleanedResponse = cleanedResponse.slice(0, -3);
      }
      cleanedResponse = cleanedResponse.trim();
      
      analysisData = JSON.parse(cleanedResponse);
    } catch {
      console.error('Failed to parse JSON response:', textContent.text);
      throw new Error('Failed to parse analysis response');
    }

    return NextResponse.json(analysisData);
  } catch (error) {
    console.error('Analysis error:', error);
    
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `API Error: ${error.message}` },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
