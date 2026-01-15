import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are an elite UI/UX reverse-engineer. Your job is to analyze websites and produce prompts so detailed and precise that an AI could recreate the UI pixel-perfectly.

You have 15 years of experience at companies like Stripe, Linear, Vercel, and Figma. You understand:
- Every CSS property and when to use it
- Spacing systems (4px, 8px grids)
- Typography scales and hierarchies
- Color theory and palette construction
- Component architecture patterns
- Micro-interactions and state management
- Responsive design breakpoints
- Accessibility considerations

CRITICAL INSTRUCTION: Your prompts must be IMPLEMENTATION-READY. Not vague descriptions. Actual specifications that a developer or AI can execute.

BAD: "Clean navigation with good spacing"
GOOD: "Fixed top navigation bar, height 64px, with horizontal padding 24px. Logo left-aligned, 32px height. Nav links horizontally centered with 32px gaps, 14px medium weight text, #71717a color, hover state transitions to #fafafa over 150ms. CTA button right-aligned, 36px height, 16px horizontal padding, 14px semibold text, solid background #fff, text #000, border-radius 8px, hover darkens background 5%."

You write like an engineer documenting a design system, not a marketer describing vibes.`;

const ANALYSIS_PROMPT = `Analyze this website and generate implementation-ready prompts to recreate its UI.

INPUT TYPE: {type}
INPUT: {input}

ANALYSIS REQUIREMENTS:

1. LAYOUT ANALYSIS
- Container widths (max-width values)
- Grid system (columns, gaps, breakpoints)
- Section padding/margins (exact values or ratios)
- Vertical rhythm and spacing scale
- Content alignment patterns

2. TYPOGRAPHY ANALYSIS
- Heading hierarchy (h1-h6 sizes, weights, line-heights)
- Body text specifications
- Font stack assumptions (serif, sans-serif, mono)
- Letter-spacing and text transforms
- Link and interactive text styles

3. COLOR ANALYSIS
- Background colors (primary, secondary, elevated surfaces)
- Text colors (primary, secondary, muted, disabled)
- Border colors and opacities
- Accent/brand color usage
- Gradient specifications if present
- Shadow values (box-shadow specs)

4. COMPONENT PATTERNS
- Button variants (primary, secondary, ghost, sizes)
- Input field styling
- Card patterns (padding, borders, shadows, radius)
- Icon sizing and stroke weights
- Badge/tag styling
- Divider/separator patterns

5. INTERACTION PATTERNS
- Hover states (color shifts, transforms, shadows)
- Transition durations and easing
- Focus states for accessibility
- Active/pressed states
- Loading states if visible

6. RESPONSIVE BEHAVIOR
- Breakpoint assumptions
- Mobile navigation pattern
- Content reflow strategy
- Touch target sizing

OUTPUT FORMAT - Respond with this exact JSON structure:

{
  "coreIntentPrompt": "A comprehensive master prompt (300-500 words) that captures the complete design intent. Include: overall aesthetic direction, target user, visual tone, key design principles, and the feeling the UI should evoke. This prompt alone should give an AI enough context to make good design decisions.",
  
  "uiSystemPrompt": "A detailed design system specification (500-800 words) covering: exact spacing scale (e.g., 4/8/12/16/24/32/48/64px), typography scale with sizes/weights/line-heights, complete color palette with hex values or descriptive relationships, border-radius scale, shadow definitions, transition defaults. Write as CSS custom properties or design tokens where possible.",
  
  "componentPrompts": {
    "navigation": "Detailed nav implementation prompt (150-250 words). Include: position, height, background, logo placement and size, link styling (font, color, spacing, hover), CTA button specs, mobile behavior, any scroll effects.",
    
    "hero": "Detailed hero section prompt (200-300 words). Include: layout (centered/split/asymmetric), background treatment, headline specs (size, weight, max-width, color), subheadline specs, CTA buttons (variants, sizes, spacing), any imagery/illustration treatment, spacing from nav and to next section.",
    
    "content_sections": "Detailed content section prompt (200-300 words). Include: section padding, heading styles, body text max-width, grid layouts for features/benefits, card patterns if used, icon treatment, alternating patterns if present.",
    
    "cards_or_data": "Detailed card/data display prompt (150-250 words). Include: card dimensions or aspect ratios, padding, background, border, shadow, border-radius, content hierarchy within cards, hover effects, grid/list layout specs.",
    
    "footer_or_cta": "Detailed footer prompt (150-200 words). Include: background, padding, column layout, link styling, logo treatment, copyright text styling, any newsletter or CTA patterns, border/divider treatment."
  },
  
  "styleDna": ["3-6 precise aesthetic descriptors from: Minimal, Editorial, Brutalist, Fintech-grade, Developer-centric, Crypto-native, Enterprise-calm, Experimental, Dashboard-heavy, Content-dense, Whitespace-rich, Dark-mode-native, Gradient-heavy, Glassmorphic, Flat, Skeuomorphic, Monochromatic, High-contrast, Soft-UI, Sharp-geometric, Organic-rounded"],
  
  "assumptions": "List what you inferred directly from the input vs. what you assumed based on common patterns. Be explicit about uncertainty. Format as bullet points.",
  
  "confidenceLevel": "High/Medium/Low confidence with 1-sentence explanation of why."
}

QUALITY CHECKLIST - Before responding, verify:
- Prompts include specific measurements (px, rem, %) not vague terms
- Color relationships are described precisely
- Typography includes size, weight, AND line-height
- Interactive states are specified
- Spacing is consistent with a defined scale
- Prompts are long enough to be actionable (not one-liners)

Respond ONLY with valid JSON. No markdown code fences. No text before or after the JSON.`;

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
      max_tokens: 8192,
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
