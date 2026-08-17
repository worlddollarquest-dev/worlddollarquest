import React, { useState, useMemo } from 'react';
import { Copy, Check, RotateCcw, FileText, Clock, Volume2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useApp } from '../../context/AppContext';

export const WordCounter: React.FC = () => {
  const [text, setText] = useState(
    'World Dollar Quest is a modern digital platform designed to help builders, creators, and freelancers master practical tools, AI workflows, and realistic online earning opportunities.'
  );
  const [copied, setCopied] = useState(false);

  const { success } = useToast();
  const { incrementToolUsage } = useApp();

  const stats = useMemo(() => {
    const cleanText = text.trim();
    const words = cleanText ? cleanText.split(/\s+/).filter(Boolean).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s+/g, '').length;
    const sentences = cleanText ? cleanText.split(/[.!?]+/).filter(Boolean).length : 0;
    const paragraphs = cleanText ? cleanText.split(/\n+/).filter(Boolean).length : 0;
    const readingTimeMinutes = (words / 200).toFixed(1);
    const speakingTimeMinutes = (words / 130).toFixed(1);

    // Top repeated words
    const wordFreq: Record<string, number> = {};
    if (cleanText) {
      cleanText
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 3)
        .forEach((w) => {
          wordFreq[w] = (wordFreq[w] || 0) + 1;
        });
    }

    const topKeywords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      readingTimeMinutes,
      speakingTimeMinutes,
      topKeywords,
    };
  }, [text]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    success('Text copied to clipboard!');
    incrementToolUsage('tool-word-counter');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setText('');
  };

  return (
    <div className="space-y-5">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center">
          <p className="text-xl sm:text-2xl font-extrabold text-teal-400 font-mono">
            {stats.words}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">Words</p>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center">
          <p className="text-xl sm:text-2xl font-extrabold text-indigo-400 font-mono">
            {stats.characters}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">Characters</p>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center">
          <p className="text-xl sm:text-2xl font-extrabold text-slate-200 font-mono">
            {stats.readingTimeMinutes} min
          </p>
          <p className="text-xs text-slate-400 mt-0.5 flex items-center justify-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" /> Read Time
          </p>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center">
          <p className="text-xl sm:text-2xl font-extrabold text-slate-200 font-mono">
            {stats.speakingTimeMinutes} min
          </p>
          <p className="text-xs text-slate-400 mt-0.5 flex items-center justify-center gap-1">
            <Volume2 className="w-3 h-3 text-slate-400" /> Speech Time
          </p>
        </div>
      </div>

      {/* Text Area */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300">Article / Copy Input</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 border border-slate-800 transition-colors"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs text-slate-200 hover:text-white px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-teal-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <textarea
          rows={7}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your text here to analyze..."
          className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 text-sm focus:border-teal-400 focus:outline-none leading-relaxed"
        />
      </div>

      {/* Secondary Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-slate-900/50 border border-slate-800/60 rounded-xl text-xs text-slate-400">
        <div>
          <span>Characters (no spaces): </span>
          <strong className="text-slate-200 font-mono">{stats.charactersNoSpaces}</strong>
        </div>
        <div>
          <span>Sentences: </span>
          <strong className="text-slate-200 font-mono">{stats.sentences}</strong>
        </div>
        <div>
          <span>Paragraphs: </span>
          <strong className="text-slate-200 font-mono">{stats.paragraphs}</strong>
        </div>
        {stats.topKeywords.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span>Keywords:</span>
            {stats.topKeywords.map(([kw, count]) => (
              <span
                key={kw}
                className="px-1.5 py-0.5 rounded bg-slate-800 text-teal-300 font-mono text-[10px]"
              >
                {kw} ({count})
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
