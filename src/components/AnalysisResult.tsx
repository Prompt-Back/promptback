'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronRight,
  Target,
  Layers,
  Grid3X3,
  Fingerprint,
  AlertCircle,
  Gauge
} from 'lucide-react';

interface AnalysisData {
  coreIntentPrompt: string;
  uiSystemPrompt: string;
  componentPrompts: Record<string, string>;
  styleDna: string[];
  assumptions: string;
  confidenceLevel: string;
}

interface AnalysisResultProps {
  data: AnalysisData;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] bg-[var(--color-bg)] hover:bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)] rounded-lg transition-all"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-[var(--color-success)]" />
          Copied
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          Copy
        </>
      )}
    </button>
  );
}

function PromptSection({ 
  icon: Icon, 
  title, 
  content, 
  defaultExpanded = true 
}: { 
  icon: React.ElementType;
  title: string;
  content: string;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-[var(--color-surface-elevated)] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-accent-subtle)] flex items-center justify-center">
            <Icon className="w-4.5 h-4.5 text-[var(--color-accent)]" />
          </div>
          <h3 className="font-medium text-[var(--color-text-primary)]">{title}</h3>
        </div>
        <div className="flex items-center gap-3">
          {expanded && <CopyButton text={content} />}
          {expanded ? (
            <ChevronDown className="w-5 h-5 text-[var(--color-text-muted)]" />
          ) : (
            <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)]" />
          )}
        </div>
      </button>
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="px-5 pb-5"
        >
          <div className="p-4 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border-subtle)]">
            <pre className="font-mono text-sm text-[var(--color-text-secondary)] whitespace-pre-wrap leading-relaxed">
              {content}
            </pre>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function ComponentPromptCard({ name, prompt }: { name: string; prompt: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[var(--color-bg)] border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-[var(--color-surface-elevated)] transition-colors"
      >
        <span className="text-sm font-medium text-[var(--color-text-primary)] capitalize">
          {name.replace(/_/g, ' ')}
        </span>
        <div className="flex items-center gap-2">
          {expanded && <CopyButton text={prompt} />}
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
          ) : (
            <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)]" />
          )}
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-4">
          <pre className="font-mono text-xs text-[var(--color-text-secondary)] whitespace-pre-wrap leading-relaxed p-3 bg-[var(--color-surface)] rounded-lg">
            {prompt}
          </pre>
        </div>
      )}
    </div>
  );
}

export default function AnalysisResult({ data }: AnalysisResultProps) {
  const confidenceColor = 
    data.confidenceLevel.toLowerCase().includes('high') 
      ? 'text-emerald-400' 
      : data.confidenceLevel.toLowerCase().includes('medium')
        ? 'text-amber-400'
        : 'text-zinc-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Analysis Results</h2>
        <div className="flex items-center gap-2">
          <Gauge className={`w-4 h-4 ${confidenceColor}`} />
          <span className={`text-sm font-medium ${confidenceColor}`}>
            {data.confidenceLevel}
          </span>
        </div>
      </div>

      {/* Core Intent Prompt */}
      <PromptSection
        icon={Target}
        title="Core Intent Prompt"
        content={data.coreIntentPrompt}
      />

      {/* UI/UX System Prompt */}
      <PromptSection
        icon={Layers}
        title="UI/UX System Prompt"
        content={data.uiSystemPrompt}
      />

      {/* Component Prompts */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 p-5 border-b border-[var(--color-border-subtle)]">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-accent-subtle)] flex items-center justify-center">
            <Grid3X3 className="w-4.5 h-4.5 text-[var(--color-accent)]" />
          </div>
          <h3 className="font-medium text-[var(--color-text-primary)]">Component Prompt Stack</h3>
        </div>
        <div className="p-4 space-y-2">
          {Object.entries(data.componentPrompts).map(([name, prompt]) => (
            <ComponentPromptCard key={name} name={name} prompt={prompt} />
          ))}
        </div>
      </div>

      {/* Style DNA */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 p-5 border-b border-[var(--color-border-subtle)]">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-accent-subtle)] flex items-center justify-center">
            <Fingerprint className="w-4.5 h-4.5 text-[var(--color-accent)]" />
          </div>
          <h3 className="font-medium text-[var(--color-text-primary)]">Style DNA</h3>
        </div>
        <div className="p-5">
          <div className="flex flex-wrap gap-2">
            {data.styleDna.map((trait, i) => (
              <span
                key={i}
                className="px-3 py-1.5 text-sm font-medium text-[var(--color-text-secondary)] bg-[var(--color-bg)] border border-[var(--color-border-subtle)] rounded-lg"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Assumptions */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 p-5 border-b border-[var(--color-border-subtle)]">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <AlertCircle className="w-4.5 h-4.5 text-amber-500" />
          </div>
          <h3 className="font-medium text-[var(--color-text-primary)]">Assumptions & Confidence</h3>
        </div>
        <div className="p-5">
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap">
            {data.assumptions}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
