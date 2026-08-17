import React, { useState } from 'react';
import { Briefcase, Copy, Check, Sparkles, Globe, RefreshCw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const BusinessNameGenerator: React.FC = () => {
  const [keywords, setKeywords] = useState('digital skills earning tools');
  const [industry, setIndustry] = useState('Technology & SaaS');
  const [style, setStyle] = useState('Modern & Premium');
  const [generatedNames, setGeneratedNames] = useState<string[]>([
    'Vanguard Quest',
    'SkillForge Digital',
    'OmniYield Labs',
    'ApexOrbit Studio',
    'DollarCraft AI',
    'NexusFlow Digital',
    'HyperScale Systems',
    'TrueMetric Ventures',
    'Luminary Shift',
    'ZenithPulse Media',
  ]);
  const [copiedName, setCopiedName] = useState<string | null>(null);

  const { success } = useToast();
  const { completeQuest } = useAuth();
  const { incrementToolUsage } = useApp();

  const prefixes = [
    'Nova', 'Apex', 'Omni', 'Vanguard', 'Hyper', 'Nexus', 'Luminary', 'True', 'Zenith', 'Shift',
    'Skill', 'Dollar', 'Flow', 'Prime', 'Quant', 'Stratos', 'Aura', 'Elevate', 'Synapse', 'Forge'
  ];

  const roots = [
    'Quest', 'Forge', 'Yield', 'Orbit', 'Craft', 'Scale', 'Metric', 'Pulse', 'Bridge', 'Vault',
    'Stack', 'Wave', 'Path', 'Grid', 'Logic', 'Lab', 'Ventures', 'Studio', 'Systems', 'Hub'
  ];

  const suffixes = [
    'AI', 'Digital', 'HQ', 'Labs', 'Media', 'Ventures', 'Pro', 'Desk', 'Engine', 'Network', 'IO', 'Co'
  ];

  const handleGenerate = () => {
    const rawWords = keywords.split(/\s+/).filter(Boolean);
    const results: string[] = [];

    for (let i = 0; i < 12; i++) {
      const p = prefixes[Math.floor(Math.random() * prefixes.length)];
      const r = roots[Math.floor(Math.random() * roots.length)];
      const s = suffixes[Math.floor(Math.random() * suffixes.length)];
      const userWord = rawWords.length > 0 ? rawWords[Math.floor(Math.random() * rawWords.length)] : '';
      const capitalized = userWord ? userWord.charAt(0).toUpperCase() + userWord.slice(1) : '';

      const mode = Math.floor(Math.random() * 4);
      let name = '';
      if (mode === 0 && capitalized) {
        name = `${p} ${capitalized}`;
      } else if (mode === 1 && capitalized) {
        name = `${capitalized}${r} ${s}`;
      } else if (mode === 2) {
        name = `${p}${r}`;
      } else {
        name = `${p} ${r} ${s}`;
      }

      if (!results.includes(name)) {
        results.push(name);
      }
    }

    setGeneratedNames(results);
    incrementToolUsage('tool-biz-name');
    completeQuest('quest-02');
    success('Generated 12 Brand Ideas!');
  };

  const handleCopy = (name: string) => {
    navigator.clipboard.writeText(name);
    setCopiedName(name);
    success(`Copied "${name}" to clipboard!`);
    setTimeout(() => setCopiedName(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Keywords / Core Theme
          </label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-200 text-sm focus:border-teal-400 focus:outline-none"
            placeholder="e.g. cloud, freelance, prompt"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Industry / Category
          </label>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-200 text-sm focus:border-teal-400 focus:outline-none"
          >
            <option>Technology & SaaS</option>
            <option>Freelance Agency</option>
            <option>Digital Products & Publishing</option>
            <option>AI Tools & Automation</option>
            <option>E-commerce & Consulting</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Naming Archetype</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-200 text-sm focus:border-teal-400 focus:outline-none"
          >
            <option>Modern & Premium</option>
            <option>Short & Punchy</option>
            <option>Tech & Futuristic</option>
            <option>Editorial & Professional</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleGenerate}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl font-bold text-xs transition-colors shadow-md shadow-teal-500/10"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Generate New Names</span>
        </button>
      </div>

      {/* Results Grid */}
      <div>
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
          Generated Brand Candidates ({generatedNames.length})
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {generatedNames.map((name) => {
            const isCopied = copiedName === name;
            const domainPreview = name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.quest';
            return (
              <div
                key={name}
                className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-sm text-slate-100 group-hover:text-teal-300 transition-colors">
                      {name}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleCopy(name)}
                      className="p-1 text-slate-400 hover:text-white rounded"
                      title="Copy Name"
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-500">
                    <Globe className="w-3 h-3 text-slate-600" />
                    <span>{domainPreview}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
