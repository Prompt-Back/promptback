<p align="center">
  <img src="public/logo.png" alt="PromptBack Logo" width="80" height="80" />
</p>

<h1 align="center">PromptBack</h1>

<p align="center">
  <strong>Reverse engineer any website into the prompts that created it.</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#how-it-works">How It Works</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#api-reference">API</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#contributing">Contributing</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.1-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Claude-Sonnet%204-orange?style=flat-square" alt="Claude" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
</p>

---

## Overview

PromptBack is a specialized tool for **reverse prompt engineering**. Given any website URL or description, it analyzes the design patterns, layout structure, typography, color philosophy, and component hierarchy to reconstruct the prompts that most likely created it.

This is not about copying designs. It's about understanding **design intent** and learning how to communicate that intent to AI systems.

### Who Is This For?

- **Designers** studying how great products are built
- **Developers** who want better starting prompts for AI-assisted coding
- **Prompt Engineers** refining their craft through reverse engineering
- **Product Teams** documenting design decisions in prompt form
- **Students** learning design systems and UI/UX principles

---

## Features

### Core Analysis Engine

| Feature | Description |
|---------|-------------|
| **URL Analysis** | Paste any website URL for instant reverse engineering |
| **Description Mode** | Describe a website concept and get prompts to build it |
| **Real-time Processing** | Analysis completes in 15-30 seconds |
| **Structured Output** | Five distinct prompt categories for comprehensive coverage |

### Output Structure

PromptBack generates five categories of prompts:

#### 1. Core Intent Prompt
A single, clean, reusable master prompt that captures the essence of the website. Written as if for Cursor, Claude, or GPT. This is your starting point for recreation.

#### 2. UI/UX System Prompt
A detailed design-system-level prompt describing:
- Layout system (grid, spacing, margins)
- Typography style and hierarchy
- Color philosophy and usage patterns
- Visual density and whitespace strategy
- Interaction philosophy
- Responsiveness expectations

#### 3. Component Prompt Stack
Individual prompts for each major component:
- Navigation systems
- Hero sections
- Content blocks
- Cards, tables, and data displays
- Footers and CTAs

#### 4. Style DNA
Bullet-point aesthetic identity descriptors:
- `Minimal` - Clean, reduced visual elements
- `Editorial` - Magazine-like layout and typography
- `Brutalist` - Raw, unpolished design choices
- `Fintech-grade` - Professional financial services aesthetic
- `Developer-centric` - Technical, code-focused design
- `Crypto-native` - Web3/blockchain aesthetic elements
- `Enterprise-calm` - Conservative, trustworthy business style
- `Experimental` - Unconventional, boundary-pushing design

#### 5. Assumptions & Confidence
Transparent documentation of:
- What is directly inferred from analysis
- What is assumed based on patterns
- What remains uncertain
- Overall confidence rating (High/Medium/Low)

---

## How It Works

### Analysis Pipeline

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   User Input    │────▶│  Claude Sonnet  │────▶│ Structured JSON │
│  (URL or Desc)  │     │    Analysis     │     │    Response     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Design Analysis   │
                    ├─────────────────────┤
                    │ • Layout Structure  │
                    │ • Typography        │
                    │ • Color Philosophy  │
                    │ • Component Map     │
                    │ • Motion Patterns   │
                    │ • Product Intent    │
                    │ • Target Audience   │
                    │ • Design Maturity   │
                    └─────────────────────┘
```

### The AI Persona

PromptBack uses a carefully crafted system prompt that positions Claude as:

> A senior AI product designer, reverse-prompt engineer, and UI/UX critic with 10+ years of experience in high-end SaaS design (Stripe, Linear, Vercel tier), design systems, and prompt engineering.

The AI is instructed to:
- Think like a calm, precise, opinionated senior designer
- Never hallucinate or embellish
- Prefer clarity over verbosity
- Be elegant, not clever
- Write like documenting real work

---

## Installation

### Prerequisites

- Node.js 18.0 or higher
- npm, yarn, or pnpm
- Anthropic API key ([Get one here](https://console.anthropic.com))

### Quick Start

```bash
# Clone the repository
git clone https://github.com/Prompt-Back/promptback.git
cd promptback

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file with the following:

```env
# Required
ANTHROPIC_API_KEY=your_anthropic_api_key

# Optional - for persistence features
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the application.

### Production Build

```bash
npm run build
npm start
```

---

## Usage

### Analyzing a URL

1. Select the **URL** tab
2. Paste any website URL (e.g., `https://stripe.com`)
3. Click **Analyze** or press `Ctrl+Enter`
4. Wait 15-30 seconds for analysis
5. Review and copy the generated prompts

### Analyzing a Description

1. Select the **Description** tab
2. Describe the website in detail:
   ```
   A modern fintech dashboard with dark mode, clean typography,
   data visualization cards, and a minimal sidebar navigation.
   Target audience is enterprise finance teams.
   ```
3. Click **Analyze**
4. Review the prompts that would create this design

### Using the Output

Each prompt section has a **Copy** button. Use the prompts with:

- **Cursor** - Paste into the AI chat for code generation
- **Claude** - Use as a starting point for design discussions
- **ChatGPT** - Generate component code or design specs
- **v0.dev** - Create UI components from the prompts

---

## API Reference

### POST `/api/analyze`

Analyze a website and return structured prompts.

#### Request Body

```json
{
  "type": "url" | "description",
  "value": "https://example.com"
}
```

#### Response

```json
{
  "coreIntentPrompt": "string",
  "uiSystemPrompt": "string",
  "componentPrompts": {
    "navigation": "string",
    "hero": "string",
    "content_sections": "string",
    "cards_or_data": "string",
    "footer_or_cta": "string"
  },
  "styleDna": ["Minimal", "Developer-centric"],
  "assumptions": "string",
  "confidenceLevel": "High confidence"
}
```

#### Error Responses

| Status | Description |
|--------|-------------|
| 400 | Missing or invalid request body |
| 401 | Invalid API key |
| 500 | Analysis failed |

---

## Architecture

### Project Structure

```
promptback/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── analyze/
│   │   │       └── route.ts      # Analysis API endpoint
│   │   ├── globals.css           # Global styles & CSS variables
│   │   ├── layout.tsx            # Root layout with metadata
│   │   └── page.tsx              # Main application page
│   ├── components/
│   │   ├── AnalysisResult.tsx    # Results display component
│   │   └── LoadingDots.tsx       # Loading animation
│   ├── lib/
│   │   └── supabase.ts           # Database client
│   └── types/
│       └── index.ts              # TypeScript definitions
├── public/
│   ├── logo.png                  # Application logo
│   └── favicon.ico               # Favicon
├── supabase/
│   └── schema.sql                # Database schema
└── package.json
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion |
| Icons | Lucide React |
| AI | Claude Sonnet 4 via Anthropic SDK |
| Database | Supabase (PostgreSQL) |

### Design System

The application uses a custom dark theme with CSS variables:

```css
:root {
  --color-bg: #0a0a0b;
  --color-surface: #111113;
  --color-surface-elevated: #18181b;
  --color-border: #27272a;
  --color-text-primary: #fafafa;
  --color-text-secondary: #a1a1aa;
  --color-text-muted: #71717a;
}
```

---

## Database Schema

PromptBack includes an optional Supabase schema for persistence:

### `analyses` Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| created_at | TIMESTAMP | Creation time |
| input_type | TEXT | 'url' or 'description' |
| input_value | TEXT | The analyzed input |
| core_intent_prompt | TEXT | Master prompt |
| ui_system_prompt | TEXT | Design system prompt |
| component_prompts | JSONB | Component prompt map |
| style_dna | TEXT[] | Aesthetic descriptors |
| assumptions | TEXT | Analysis assumptions |
| confidence_level | TEXT | Confidence rating |
| user_id | UUID | Optional user reference |
| is_public | BOOLEAN | Public visibility |
| view_count | INTEGER | View counter |

### Row Level Security

- Users can only view/edit their own analyses
- Public analyses are viewable by anyone
- Service role required for API usage tracking

---

## Performance

### Optimization Strategies

- **Turbopack** - Fast development builds
- **Edge Runtime** - API routes optimized for speed
- **Streaming** - Progressive response handling (planned)
- **Caching** - Response caching for repeated URLs (planned)

### Typical Response Times

| Operation | Time |
|-----------|------|
| Page Load | < 100ms |
| URL Analysis | 15-30s |
| Description Analysis | 10-20s |

---

## Roadmap

### Current (v1.0)
- [x] URL analysis
- [x] Description analysis
- [x] Structured prompt output
- [x] Copy to clipboard
- [x] Dark theme UI

### Planned (v1.1)
- [ ] Analysis history
- [ ] User authentication
- [ ] Public sharing
- [ ] Screenshot capture
- [ ] Export to Markdown

### Future (v2.0)
- [ ] Batch analysis
- [ ] API access tokens
- [ ] Team workspaces
- [ ] Prompt templates
- [ ] Design comparisons

---

## Contributing

Contributions are welcome. Please follow these guidelines:

### Development Setup

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/promptback.git

# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git commit -m "Add: your feature description"

# Push and create PR
git push origin feature/your-feature
```

### Code Style

- Use TypeScript strict mode
- Follow existing naming conventions
- Add JSDoc comments for public functions
- Write meaningful commit messages

### Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all checks pass
4. Request review from maintainers

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Acknowledgments

- [Anthropic](https://anthropic.com) for Claude API
- [Vercel](https://vercel.com) for Next.js
- [Supabase](https://supabase.com) for database infrastructure

---

<p align="center">
  <strong>Built for designers who think in systems.</strong>
</p>

<p align="center">
  <a href="https://github.com/Prompt-Back/promptback">GitHub</a> •
  <a href="https://github.com/Prompt-Back/promptback/issues">Issues</a> •
  <a href="https://github.com/Prompt-Back/promptback/discussions">Discussions</a>
</p>
