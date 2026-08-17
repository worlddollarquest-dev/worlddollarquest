import React, { useState } from 'react';
import { Copy, Check, MessageSquareShare, Sparkles, Hash } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useApp } from '../../context/AppContext';

export const CaptionGenerator: React.FC = () => {
  const [platform, setPlatform] = useState<'linkedin' | 'x' | 'instagram'>('linkedin');
  const [topic, setTopic] = useState('How freelancers can use AI to build proof-of-work case studies');
  const [goal, setGoal] = useState('Educate and generate inbound client inquiries');
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [copied, setCopied] = useState(false);

  const { success } = useToast();
  const { incrementToolUsage } = useApp();

  const generateCaption = () => {
    if (platform === 'linkedin') {
      return `Most freelancers pitch their hours. High-earning freelancers pitch specific solutions to expensive bottlenecks.

Here is a 3-step framework we use to turn self-directed projects into high-converting client case studies:

1. Audit an existing workflow and isolate the exact conversion bottleneck.
2. Build an optimized alternative with before-and-after proof.
3. Record a 90-second loom showing the tangible delta.

Clients do not buy theory. They buy reduction of risk.

What is your primary method for demonstrating proof of execution?

${includeHashtags ? '#Freelancing #DigitalSkills #Solopreneur #Productivity #CareerGrowth' : ''}`;
    }

    if (platform === 'x') {
      return `Stop pitching "I build websites."

Start pitching "I fix mobile checkout friction for Shopify brands doing $50k/mo."

Specificity removes competition.

${includeHashtags ? '#buildinpublic #freelance #solopreneur' : ''}`;
    }

    return `The difference between a $50/hr freelancer and a $150/hr consultant is never technical skill alone.

It is how clearly you frame the problem you solve.

Save this for your next client proposal. 📌

${includeHashtags ? '#digitalnomad #remotework #onlinebusiness #freelancelife' : ''}`;
  };

  const captionText = generateCaption();

  const handleCopy = () => {
    navigator.clipboard.writeText(captionText);
    setCopied(true);
    success('Caption copied to clipboard!');
    incrementToolUsage('tool-caption');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(['linkedin', 'x', 'instagram'] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPlatform(p)}
            className={`py-2 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border ${
              platform === p
                ? 'bg-teal-500/10 border-teal-500/40 text-teal-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {p === 'x' ? 'X / Twitter' : p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Topic / Core Message
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-200 text-sm focus:border-teal-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Primary Objective</label>
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-200 text-sm focus:border-teal-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="hashtags"
            checked={includeHashtags}
            onChange={(e) => setIncludeHashtags(e.target.checked)}
            className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-teal-500 focus:ring-0"
          />
          <label htmlFor="hashtags" className="text-xs text-slate-300 cursor-pointer">
            Include optimized hashtags
          </label>
        </div>
      </div>

      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Optimized Post Preview
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-lg text-xs font-bold transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Caption'}</span>
          </button>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
          {captionText}
        </div>
      </div>
    </div>
  );
};
