import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Search,
  Workflow,
  ExternalLink,
  Layers,
  Zap,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { SEO } from '../components/common/SEO';

interface AIResourcesPageProps {
  onNavigate: (path: string) => void;
}

export const AIResourcesPage: React.FC<AIResourcesPageProps> = ({ onNavigate }) => {
  const { success } = useToast();
  const { completeQuest } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedPromptCategory, setSelectedPromptCategory] = useState<string>('All');

  const promptVault = [
    {
      id: 'p-01',
      title: 'Customer Pain Point Empathy Extractor',
      category: 'Research & Strategy',
      description: 'Analyze raw customer reviews and extract emotional friction, vocabulary, and objections.',
      prompt: `Act as a veteran Qualitative Market Researcher and Consumer Psychologist. 
Analyze the following text of customer feedback and reviews:
[PASTE REVIEWS HERE]

Perform the following:
1. Extract the Top 5 recurring friction points, ranked by emotional intensity.
2. Identify the exact emotional phrases and vocabulary customers use.
3. Formulate 3 distinct value proposition hooks that directly neutralize these objections.`,
    },
    {
      id: 'p-02',
      title: 'B2B Cold Outreach Sequence Builder',
      category: 'Freelance & Sales',
      description: 'Generate high-response 3-email outreach sequences based on recipient bottlenecks.',
      prompt: `Act as a Senior B2B Copywriter specialized in cold email deliverability and response rates.
Target Prospect: [E.G. Shopify Store Founder doing $500k/yr]
Identified Bottleneck: [E.G. Low Mobile Checkout Speed & Page Drops]
My Proof of Work: [E.G. Built 3 mobile checkout teardowns demonstrating 22% faster speed]

Write a 3-touch sequence:
- Email 1: The Value-First Pitch (Under 100 words, zero hype, sharing 1 actionable audit finding)
- Email 2: The Brief Follow-Up (48 hours later, 3 sentences)
- Email 3: The Graceful Breakaway (5 days later, leaving the door open)
Strict Rule: No buzzwords ("game-changer", "revolutionary"). Keep sentences crisp.`,
    },
    {
      id: 'p-03',
      title: 'Senior Code Refactoring & Accessibility Audit',
      category: 'Development',
      description: 'Refactor messy TypeScript/React components for clean readability and performance.',
      prompt: `Act as a Principal Frontend Engineer and Accessibility Specialist.
Review the following React/TypeScript component:
[PASTE COMPONENT CODE HERE]

Instructions:
1. Identify potential performance bottlenecks, redundant state, or unnecessary re-renders.
2. Check WCAG AA compliance (ARIA labels, keyboard navigation, contrast).
3. Provide the full refactored code using modern idiomatic patterns.
4. Provide a brief 3-bullet summary of architectural improvements.`,
    },
    {
      id: 'p-04',
      title: 'High-Intent Commercial SEO Article Outline',
      category: 'Content & SEO',
      description: 'Craft a structured article outline designed for search snippets and user intent.',
      prompt: `Act as a Search Intent Analyst and Technical SEO Editor.
Target Keyword: [E.G. "How to calculate freelance hourly rate"]
Target Audience: [E.G. Junior to Mid-Level Freelancers]

Create a comprehensive outline that:
1. Answers the primary search intent above the fold with a structured definition box.
2. Includes a step-by-step mathematical breakdown.
3. Suggests 3 interactive tables / callout boxes.
4. Outlines 5 frequently asked questions matching Google "People Also Ask" patterns.`,
    },
  ];

  const aiWorkflows = [
    {
      step: '01',
      title: 'Market Bottleneck Discovery',
      desc: 'Use LLMs to synthesize dozens of forum threads into concise problem statements that buyers are actively searching to solve.',
      time: '15 Mins',
    },
    {
      step: '02',
      title: 'Proof-of-Work Case Study Generation',
      desc: 'Draft teardowns and before-and-after audit reports based on real website observations to establish instant authority.',
      time: '30 Mins',
    },
    {
      step: '03',
      title: 'Value-Based Proposal Drafting',
      desc: 'Transform client intake notes into customized proposal decks with explicit deliverables, milestones, and payment terms.',
      time: '20 Mins',
    },
    {
      step: '04',
      title: 'Automated SOP & Documentation',
      desc: 'Convert bullet-point workflow notes into polished standard operating procedures for clients or internal assistants.',
      time: '10 Mins',
    },
  ];

  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    success('Prompt Copied to Clipboard!', 'Ready to paste into Gemini or Claude.');
    completeQuest('quest-02');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredPrompts = promptVault.filter((p) => {
    const matchesCat =
      selectedPromptCategory === 'All' || p.category === selectedPromptCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <>
      <SEO
        title="AI Resources, Prompts & Workflow Blueprints"
        description="Curated collection of engineered AI prompts, operational workflows, and practical guides to multiply your digital output."
      />

      <div className="min-h-screen bg-slate-950 pb-20">
        {/* Header Hero */}
        <section className="pt-12 pb-14 border-b border-slate-900 bg-gradient-to-b from-slate-950 via-[#0a0f1d] to-[#090d16]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Engineered Prompt Engineering & Automation</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                AI Resources & Operational Workflows
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Move past basic chatbots. Use structured prompts, repeatable workflows, and research architectures to streamline real client work.
              </p>
            </div>
          </div>
        </section>

        {/* 4-Step Practical Workflows Strip */}
        <section className="py-12 border-b border-slate-900 bg-[#0a0f1d]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                Repeatable Systems
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">
                4 Realistic AI Workflows for Solopreneurs
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {aiWorkflows.map((wf) => (
                <div
                  key={wf.step}
                  className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-2xl font-black text-teal-400">
                        {wf.step}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {wf.time}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-base">{wf.title}</h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{wf.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Searchable Prompt Vault */}
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Layers className="w-4 h-4" />
                <span>Prompt Vault</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Engineered Masterclass Prompts</h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search prompt templates..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              <select
                value={selectedPromptCategory}
                onChange={(e) => setSelectedPromptCategory(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-xs focus:outline-none focus:border-teal-500"
              >
                <option value="All">All Categories</option>
                <option value="Research & Strategy">Research & Strategy</option>
                <option value="Freelance & Sales">Freelance & Sales</option>
                <option value="Development">Development</option>
                <option value="Content & SEO">Content & SEO</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPrompts.map((item) => {
              const isCopied = copiedId === item.id;
              return (
                <div
                  key={item.id}
                  className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/90 shadow-xl flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider">
                        {item.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyPrompt(item.id, item.prompt)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Copied' : 'Copy Prompt'}</span>
                      </button>
                    </div>

                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{item.description}</p>

                    <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-300 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                      {item.prompt}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick link to dynamic generator */}
          <div className="mt-12 p-6 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-white font-bold text-sm">Need a custom prompt dynamically generated?</h4>
              <p className="text-xs text-slate-400">Use our free AI Prompt Generator tool with customized roles and constraints.</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/free-tools?tool=prompt-gen')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shrink-0"
            >
              Launch Prompt Generator &rarr;
            </button>
          </div>
        </section>
      </div>
    </>
  );
};
