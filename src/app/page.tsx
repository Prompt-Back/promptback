'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Link as LinkIcon, 
  FileText, 
  ArrowRight, 
  Copy, 
  Check,
  Sparkles,
  Grid3X3,
  Palette,
  Type,
  Layout,
  Loader2
} from 'lucide-react';
import Image from 'next/image';
import AnalysisResult from '@/components/AnalysisResult';

type InputMode = 'url' | 'description';

interface AnalysisData {
  coreIntentPrompt: string;
  uiSystemPrompt: string;
  componentPrompts: Record<string, string>;
  styleDna: string[];
  assumptions: string;
  confidenceLevel: string;
}

export default function Home() {
  const [inputMode, setInputMode] = useState<InputMode>('url');
  const [inputValue, setInputValue] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!inputValue.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: inputMode,
          value: inputValue.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleAnalyze();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] bg-grid bg-radial-fade">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg)]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image 
              src="/logo.png" 
              alt="PromptLens" 
              width={32} 
              height={32} 
              className="rounded-lg"
            />
            <span className="font-semibold text-[var(--color-text-primary)]">PromptLens</span>
          </div>
          <nav className="flex items-center gap-6">
            <span className="text-sm text-[var(--color-text-muted)]">v1.0</span>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="font-['Instrument_Serif'] text-5xl md:text-6xl text-[var(--color-text-primary)] mb-6 leading-tight">
              Reverse engineer any website<br />
              <span className="text-[var(--color-text-secondary)]">into its original prompts</span>
            </h1>
            <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
              Analyze the design DNA of any website and reconstruct the prompts that most likely created it. 
              Built for designers, developers, and prompt engineers.
            </p>
          </motion.div>

          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            {/* Input Mode Toggle */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex p-1 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border-subtle)]">
                <button
                  onClick={() => setInputMode('url')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    inputMode === 'url'
                      ? 'bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] shadow-sm'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                  }`}
                >
                  <LinkIcon className="w-4 h-4" />
                  URL
                </button>
                <button
                  onClick={() => setInputMode('description')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    inputMode === 'description'
                      ? 'bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] shadow-sm'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Description
                </button>
              </div>
            </div>

            {/* Input Field */}
            <div className="relative">
              {inputMode === 'url' ? (
                <input
                  type="url"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="https://example.com"
                  className="w-full h-16 px-6 pr-36 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--color-accent-subtle)] transition-all font-mono text-lg"
                />
              ) : (
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe the website you want to analyze... (e.g., 'A modern fintech dashboard with dark mode, clean typography, and data visualization cards')"
                  rows={4}
                  className="w-full px-6 py-4 pr-36 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--color-accent-subtle)] transition-all resize-none"
                />
              )}
              <button
                onClick={handleAnalyze}
                disabled={!inputValue.trim() || isAnalyzing}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 px-5 py-2.5 bg-[var(--color-text-primary)] hover:bg-[var(--color-text-secondary)] disabled:bg-zinc-700 disabled:cursor-not-allowed text-[var(--color-bg)] font-medium rounded-xl transition-all"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing
                  </>
                ) : (
                  <>
                    Analyze
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            <p className="text-center text-sm text-[var(--color-text-muted)] mt-3">
              Press <kbd className="px-1.5 py-0.5 bg-[var(--color-surface)] rounded border border-[var(--color-border-subtle)] text-xs">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-[var(--color-surface)] rounded border border-[var(--color-border-subtle)] text-xs">Enter</kbd> to analyze
            </p>
          </motion.div>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
              >
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading State */}
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-12"
              >
                <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)] flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-[var(--color-text-secondary)] animate-pulse-subtle" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[var(--color-text-primary)]">Analyzing design patterns</h3>
                      <p className="text-sm text-[var(--color-text-muted)]">Reverse engineering layout, typography, and components...</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { icon: Layout, label: 'Layout' },
                      { icon: Type, label: 'Typography' },
                      { icon: Palette, label: 'Colors' },
                      { icon: Grid3X3, label: 'Components' },
                    ].map((item, i) => (
                      <div 
                        key={item.label}
                        className="flex flex-col items-center gap-2 p-4 bg-[var(--color-bg)] rounded-xl"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      >
                        <item.icon className="w-5 h-5 text-[var(--color-text-muted)] animate-pulse-subtle" style={{ animationDelay: `${i * 0.15}s` }} />
                        <span className="text-xs text-[var(--color-text-muted)]">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <AnimatePresence>
            {analysisResult && !isAnalyzing && (
              <AnalysisResult data={analysisResult} />
            )}
          </AnimatePresence>

          {/* Features Grid (shown when no results) */}
          {!analysisResult && !isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid md:grid-cols-3 gap-4"
            >
              {[
                {
                  icon: Layout,
                  title: 'Layout Analysis',
                  description: 'Grid systems, spacing logic, and visual hierarchy extraction',
                },
                {
                  icon: Type,
                  title: 'Typography System',
                  description: 'Font philosophy, sizing scale, and typographic decisions',
                },
                {
                  icon: Palette,
                  title: 'Color Philosophy',
                  description: 'Palette structure, accent usage, and color intent',
                },
              ].map((feature, i) => (
                <div
                  key={feature.title}
                  className="p-6 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl card-hover"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)] flex items-center justify-center mb-4">
                    <feature.icon className="w-5 h-5 text-[var(--color-text-secondary)]" />
                  </div>
                  <h3 className="font-medium text-[var(--color-text-primary)] mb-2">{feature.title}</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">{feature.description}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-[var(--color-border-subtle)] bg-[var(--color-bg)]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-sm text-[var(--color-text-muted)]">
            PromptLens - Reverse prompt engineering tool
          </span>
          <span className="text-sm text-[var(--color-text-muted)]">
            Powered by Claude
          </span>
        </div>
      </footer>
    </div>
  );
}
