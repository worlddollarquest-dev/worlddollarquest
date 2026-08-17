import React, { useState } from 'react';
import { UserCheck, Copy, Check, RefreshCw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useApp } from '../../context/AppContext';

export const UsernameGenerator: React.FC = () => {
  const [baseWord, setBaseWord] = useState('quest');
  const [category, setCategory] = useState<'tech' | 'creator' | 'minimal' | 'executive'>('tech');
  const [usernames, setUsernames] = useState<string[]>([
    'quest_dev',
    'dev.quest',
    'thequestcoder',
    'quest_builds',
    'quest_hq',
    'quest_io',
    'iamquest',
    'quest_studio',
    'quest_craft',
  ]);
  const [copied, setCopied] = useState<string | null>(null);

  const { success } = useToast();
  const { incrementToolUsage } = useApp();

  const handleGenerate = () => {
    const raw = baseWord.trim().toLowerCase().replace(/[^a-z0-9]/g, '') || 'dollar';
    let results: string[] = [];

    if (category === 'tech') {
      results = [
        `${raw}_dev`,
        `dev.${raw}`,
        `${raw}_builds`,
        `${raw}_io`,
        `code_${raw}`,
        `${raw}_stack`,
        `${raw}_engineer`,
        `${raw}labs`,
      ];
    } else if (category === 'creator') {
      results = [
        `the.${raw}`,
        `its${raw}`,
        `${raw}_creates`,
        `${raw}.lens`,
        `real${raw}`,
        `${raw}_media`,
        `daily${raw}`,
        `${raw}craft`,
      ];
    } else if (category === 'executive') {
      results = [
        `${raw}_hq`,
        `${raw}consulting`,
        `${raw}_group`,
        `official_${raw}`,
        `${raw}_global`,
        `${raw}advisory`,
      ];
    } else {
      results = [
        `_${raw}_`,
        `${raw}.xyz`,
        `just${raw}`,
        `hey${raw}`,
        `${raw}x`,
        `${raw}hq`,
      ];
    }

    setUsernames(results);
    incrementToolUsage('tool-username');
    success('Generated clean usernames!');
  };

  const handleCopy = (u: string) => {
    navigator.clipboard.writeText(u);
    setCopied(u);
    success(`Copied @${u} to clipboard!`);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Base Name / Handle
          </label>
          <input
            type="text"
            value={baseWord}
            onChange={(e) => setBaseWord(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-200 text-sm focus:border-teal-400 focus:outline-none"
            placeholder="e.g. alex, quest, builder"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Vibe / Archetype</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-200 text-sm focus:border-teal-400 focus:outline-none"
          >
            <option value="tech">Developer & Tech</option>
            <option value="creator">Creator & Content</option>
            <option value="executive">Executive & Agency</option>
            <option value="minimal">Minimalist & Short</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleGenerate}
          className="flex items-center gap-1.5 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl text-xs font-bold transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Generate Handles</span>
        </button>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Candidate Handles
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {usernames.map((u) => (
            <div
              key={u}
              onClick={() => handleCopy(u)}
              className="p-3 bg-slate-900 border border-slate-800 hover:border-teal-500/40 rounded-xl flex items-center justify-between cursor-pointer group transition-all"
            >
              <span className="text-xs font-mono text-slate-200 group-hover:text-teal-300">
                @{u}
              </span>
              {copied === u ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
