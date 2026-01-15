import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are the world's most precise UI reverse-engineer. Your mission: analyze any website and produce prompts so exact that an AI recreates it IDENTICALLY.

You think in CSS. You see a button and immediately know: height 40px, padding 0 16px, font-size 14px, font-weight 500, line-height 40px, border-radius 6px, background #18181b, color #fafafa, transition all 150ms ease, hover:background #27272a.

ABSOLUTE RULES:
1. NEVER use vague words: "clean", "modern", "nice", "good spacing", "professional"
2. ALWAYS use exact values: pixels, percentages, hex colors, milliseconds
3. EVERY element needs: size, color, spacing, and states
4. ASSUME the reader has zero context - be exhaustively specific

EXAMPLE OF PERFECT PROMPT:
"Navigation: Fixed position, top 0, left 0, right 0, height 64px, background rgba(10,10,11,0.8), backdrop-filter blur(12px), border-bottom 1px solid rgba(255,255,255,0.06), z-index 50, padding 0 24px. Inner container max-width 1200px, margin 0 auto, display flex, align-items center, justify-content space-between, height 100%.

Logo: Left side, 32px height, SVG or image. 

Nav links: Center, display flex, gap 32px. Each link: font-size 14px, font-weight 400, color #a1a1aa, letter-spacing -0.01em, text-decoration none, transition color 150ms ease. Hover: color #fafafa. Active page: color #fafafa, font-weight 500.

CTA Button: Right side, height 36px, padding 0 16px, font-size 14px, font-weight 500, background #fafafa, color #0a0a0b, border-radius 8px, border none, cursor pointer, transition all 150ms ease. Hover: background #e4e4e7, transform translateY(-1px)."

THIS level of detail. EVERY section. NO exceptions.`;

const ANALYSIS_PROMPT = `TASK: Reverse-engineer this website into pixel-perfect recreation prompts.

INPUT: {type} - {input}

EXTRACTION CHECKLIST (analyze ALL of these):

□ GLOBAL STYLES
- Background color (exact hex)
- Base font family (serif/sans-serif/mono + specific if identifiable)
- Base font size and color
- Selection highlight color
- Scrollbar styling
- Focus ring style

□ SPACING SYSTEM
- Base unit (4px or 8px grid)
- Section padding (top/bottom)
- Container max-width
- Content padding (left/right)
- Consistent gaps between elements

□ TYPOGRAPHY SCALE
- H1: size, weight, line-height, letter-spacing, color, margin
- H2: size, weight, line-height, letter-spacing, color, margin
- H3: size, weight, line-height, letter-spacing, color, margin
- Body: size, weight, line-height, color
- Small/caption: size, weight, color
- Links: color, hover color, underline behavior

□ COLOR PALETTE
- Background primary (page bg)
- Background secondary (cards, sections)
- Background elevated (modals, dropdowns)
- Text primary (headings)
- Text secondary (body)
- Text muted (captions, placeholders)
- Border color and opacity
- Accent/brand color
- Success/error/warning colors if present

□ SHADOWS & EFFECTS
- Card shadows (offset, blur, spread, color)
- Button shadows
- Hover shadow changes
- Any glows or highlights
- Backdrop blur values

□ BORDER RADIUS SCALE
- Small (inputs, tags): Xpx
- Medium (buttons, cards): Xpx
- Large (modals, sections): Xpx
- Full (avatars, pills): 9999px

□ TRANSITIONS
- Default duration (150ms/200ms/300ms)
- Easing function (ease/ease-out/cubic-bezier)
- Properties that animate

□ COMPONENT STATES
- Default state
- Hover state (color, shadow, transform changes)
- Active/pressed state
- Focus state (ring color, offset)
- Disabled state (opacity, cursor)

OUTPUT JSON (follow EXACTLY):

{
  "coreIntentPrompt": "Write 400-600 words describing the COMPLETE design vision. Include: 1) Product type and target audience, 2) Overall visual aesthetic with specific references (e.g., 'Stripe-like clarity' or 'Linear-style density'), 3) Color philosophy (dark/light, contrast levels, accent usage), 4) Typography philosophy (sharp/soft, tight/loose), 5) Spacing philosophy (dense/airy), 6) Interaction philosophy (subtle/pronounced), 7) The emotional response the design creates. Be specific enough that someone could make correct decisions about unlisted elements.",

  "uiSystemPrompt": "Write 600-1000 words as a DESIGN SYSTEM SPECIFICATION. Format as implementable tokens:\n\n/* Colors */\n--color-bg-primary: #xxx;\n--color-bg-secondary: #xxx;\n--color-bg-elevated: #xxx;\n--color-text-primary: #xxx;\n--color-text-secondary: #xxx;\n--color-text-muted: #xxx;\n--color-border: #xxx;\n--color-accent: #xxx;\n\n/* Typography */\n--font-family-sans: 'xxx', system-ui, sans-serif;\n--font-family-mono: 'xxx', monospace;\n--font-size-xs: Xpx;\n--font-size-sm: Xpx;\n--font-size-base: Xpx;\n--font-size-lg: Xpx;\n--font-size-xl: Xpx;\n--font-size-2xl: Xpx;\n--font-size-3xl: Xpx;\n--font-size-4xl: Xpx;\n--line-height-tight: X;\n--line-height-normal: X;\n--line-height-relaxed: X;\n\n/* Spacing */\n--space-1: Xpx;\n--space-2: Xpx;\n--space-3: Xpx;\n--space-4: Xpx;\n--space-6: Xpx;\n--space-8: Xpx;\n--space-12: Xpx;\n--space-16: Xpx;\n\n/* Radius */\n--radius-sm: Xpx;\n--radius-md: Xpx;\n--radius-lg: Xpx;\n--radius-full: 9999px;\n\n/* Shadows */\n--shadow-sm: X;\n--shadow-md: X;\n--shadow-lg: X;\n\n/* Transitions */\n--transition-fast: Xms ease;\n--transition-normal: Xms ease;\n\nFill in ALL values based on analysis. Add any additional tokens needed.",

  "componentPrompts": {
    "navigation": "Write 250-400 words. MUST include: Position (fixed/sticky/static), dimensions (height, padding), background (color, opacity, blur), border, z-index. Logo specs (size, position). Nav links (font-size, weight, color, spacing, hover state with exact color and transition). CTA button (height, padding, colors, radius, hover state). Mobile breakpoint behavior (hamburger icon size, menu style). Any scroll-triggered changes.",

    "hero": "Write 300-500 words. MUST include: Section height or padding (min-height or py values), background (color, gradient, image, overlay). Container max-width and alignment. Headline (font-size at desktop AND mobile, weight, line-height, letter-spacing, color, max-width for line breaks). Subheadline (same specs). CTA buttons (primary and secondary variants with ALL states). Any decorative elements (gradients, patterns, shapes with positions). Spacing between all elements.",

    "content_sections": "Write 300-450 words. MUST include: Section padding (top/bottom), background colors (alternating if applicable). Heading styles (size, weight, margin-bottom). Body text (max-width, size, line-height). Grid layouts (columns, gap, breakpoint changes). Feature cards if present (with full card specs). Icon sizing and colors. Any dividers or separators.",

    "cards_or_data": "Write 250-400 words. MUST include: Card dimensions (width, min-height or aspect-ratio), padding (internal spacing), background, border (width, color), border-radius, shadow (default and hover). Content hierarchy (image/icon size, title specs, description specs, metadata specs). Grid/list layout (columns, gap, responsive behavior). Hover effects (transform, shadow change, border change).",

    "footer_or_cta": "Write 200-350 words. MUST include: Section padding, background color. Any top CTA section (heading, button, background). Footer columns (number, gap, heading style, link style). Logo placement and size. Social icons (size, color, hover). Copyright text (size, color). Border/divider if present. Responsive stacking behavior."
  },

  "styleDna": ["Select 4-7 that PRECISELY match: Minimal, Editorial, Brutalist, Fintech-grade, Developer-centric, Crypto-native, Enterprise-calm, Experimental, Dashboard-heavy, Content-dense, Whitespace-rich, Dark-mode-native, Gradient-accent, Glassmorphic, Flat-design, Monochromatic, High-contrast, Soft-shadows, Sharp-geometric, Organic-rounded, Grid-based, Asymmetric, Type-forward, Icon-heavy, Illustration-rich, Photo-driven, Data-dense, Action-oriented, Documentation-style, Marketing-forward"],

  "assumptions": "FORMAT AS:\n\nDIRECTLY OBSERVED:\n- bullet points of what you can see/infer with high confidence\n\nASSUMED FROM PATTERNS:\n- bullet points of educated guesses based on common practices\n\nUNCERTAIN:\n- bullet points of things you cannot determine",

  "confidenceLevel": "State: 'High confidence' / 'Medium confidence' / 'Low confidence' followed by: 'Recreation accuracy estimate: X%' and one sentence explaining the main factor affecting confidence."
}

FINAL VERIFICATION - Before outputting, confirm:
✓ Every color is a hex value or precise rgba()
✓ Every size is in px, rem, or %
✓ Every font spec includes size AND weight AND line-height
✓ Every interactive element has hover state defined
✓ Every spacing value is explicit
✓ Prompts are detailed enough to code WITHOUT seeing the original
✓ Total response uses full detail capacity

OUTPUT ONLY VALID JSON. No markdown. No explanation text.`;

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
      max_tokens: 16000,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      system: SYSTEM_PROMPT,
    });

    const textContent = message.content.find((block) => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in response');
    }

    let analysisData;
    try {
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
