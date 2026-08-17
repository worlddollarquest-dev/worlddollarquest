import React, { useState } from 'react';
import { Copy, Check, Sparkles, RefreshCw, Wand2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const AIPromptGenerator: React.FC = () => {
  const [role, setRole] = useState('Senior Copywriter & Conversion Specialist');
  const [task, setTask] = useState('Write high-converting cold outreach email for web design services');
  const [targetAudience, setTargetAudience] = useState('B2B SaaS Founders and Marketing Directors');
  const [tone, setTone] = useState('Professional yet conversational and concise');
  const [modelType, setModelType] = useState('Gemini & Claude & GPT-4');
  const [outputFormat, setOutputFormat] = useState('Structured 3-part sequence with subject lines and follow-ups');
  const [constraints, setConstraints] = useState('Under 120 words per email, no generic buzzwords, include clear call to action');
  const [copied, setCopied] = useState(false);

  const { success } = useToast();
  const { completeQuest } = useAuth();
  const { incrementToolUsage } = useApp();

  const generatedPrompt = `### ACT AS:
${role}

### TASK OBJECTIVE:
${task}

### TARGET AUDIENCE / CONTEXT:
${targetAudience}

### TONE & STYLE:
${tone}

### TARGET LLM / EXECUTION MODE:
Optimized for: ${modelType}

### STRICT CONSTRAINTS & NEGATIVE PROMPTS:
- ${constraints}
- Do NOT use filler phrases like "I hope this email finds you well" or "revolutionary solution".
- Use natural sentence variety and clear formatting.

### REQUIRED OUTPUT FORMAT:
${outputFormat}

### STEP-BY-STEP INSTRUCTIONS:
1. First, analyze the core psychological motivation of the target audience.
2. Outline the value proposition and proof of capability.
3. Output the exact draft according to the specifications above.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    success('Prompt copied to clipboard!', 'Paste directly into your AI assistant.');
    incrementToolUsage('tool-ai-prompt');
    completeQuest('quest-02');
    setTimeout(() => setCopied(false), 2500);
  };

  const loadPreset = (presetRole: string, presetTask: string, presetAudience: string, presetFormat: string) => {
    setRole(presetRole);
    setTask(presetTask);
    setTargetAudience(presetAudience);
    setOutputFormat(presetFormat);
  };

  return (
    <div className="space-y-6">
      {/* Quick Presets */}
      <div>
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Quick Workflows & Templates:
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              loadPreset(
                'Senior SEO & Content Strategist',
                'Perform competitor content gap analysis and suggest 5 high-intent article outlines',
                'Freelancers looking for client acquisition keywords',
                'Table format with Keyword, Intent, Search Volume estimate, and Title Idea'
              )
            }
            className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
          >
            SEO Content Gap
          </button>
          <button
            type="button"
            onClick={() =>
              loadPreset(
                'Full-Stack Code Architect',
                'Refactor React component for performance and accessibility',
                'Intermediate TypeScript / React developers',
                'Clean TypeScript code with before/after explanations'
              )
            }
            className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
          >
            Code Refactoring
          </button>
          <button
            type="button"
            onClick={() =>
              loadPreset(
                'Digital Product Monetization Expert',
                'Structure a $29 Notion template package including marketing copy and asset list',
                'Creators looking for digital side income',
                'Step-by-step product breakdown and launch checklist'
              )
            }
            className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
          >
            Digital Product Launch
          </button>
        </div>
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Expert Role / Persona
          </label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-200 text-sm focus:border-teal-400 focus:outline-none"
            placeholder="e.g. Senior Copywriter"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Target Audience / Niche
          </label>
          <input
            type="text"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-200 text-sm focus:border-teal-400 focus:outline-none"
            placeholder="e.g. B2B Founders"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Primary Task & Objective
          </label>
          <textarea
            rows={2}
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-200 text-sm focus:border-teal-400 focus:outline-none resize-none"
            placeholder="Describe what the AI must accomplish"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Tone of Voice</label>
          <input
            type="text"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-200 text-sm focus:border-teal-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Output Format & Structure
          </label>
          <input
            type="text"
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-200 text-sm focus:border-teal-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Output Display Area */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Engineered Structured Prompt
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-lg text-xs font-bold transition-colors shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Prompt'}</span>
          </button>
        </div>

        <div className="relative p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto selection:bg-teal-500 selection:text-slate-950">
          {generatedPrompt}
        </div>
      </div>
    </div>
  );
};
