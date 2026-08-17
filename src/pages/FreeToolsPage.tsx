import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Search,
  Sparkles,
  Briefcase,
  MessageSquareShare,
  UserCheck,
  QrCode,
  FileText,
  Calculator,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { ToolContainer } from '../components/tools/ToolContainer';
import { SEO } from '../components/common/SEO';

interface FreeToolsPageProps {
  initialToolId?: string;
  onNavigate: (path: string) => void;
}

export const FreeToolsPage: React.FC<FreeToolsPageProps> = ({ initialToolId, onNavigate }) => {
  const { freeTools, incrementToolUsage } = useApp();
  const { success } = useToast();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeToolId, setActiveToolId] = useState<string>(initialToolId || 'prompt-gen');

  useEffect(() => {
    if (initialToolId) {
      setActiveToolId(initialToolId);
      // scroll to tool container smoothly
      const element = document.getElementById('active-tool-viewport');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [initialToolId]);

  const categories = [
    'All',
    'AI & Automation',
    'Business & Marketing',
    'Productivity',
    'Social Media',
    'Finance',
  ];

  const filteredTools = freeTools.filter((tool) => {
    const matchesCategory =
      selectedCategory === 'All' || tool.category === selectedCategory;
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && tool.status === 'active';
  });

  const activeTool = freeTools.find(
    (t) => t.componentId === activeToolId || t.slug === activeToolId || t.id === activeToolId
  ) || freeTools[0];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-teal-400" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-indigo-400" />;
      case 'MessageSquareShare':
        return <MessageSquareShare className="w-5 h-5 text-blue-400" />;
      case 'UserCheck':
        return <UserCheck className="w-5 h-5 text-emerald-400" />;
      case 'QrCode':
        return <QrCode className="w-5 h-5 text-teal-400" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-indigo-400" />;
      case 'Calculator':
        return <Calculator className="w-5 h-5 text-emerald-400" />;
      default:
        return <Wrench className="w-5 h-5 text-slate-400" />;
    }
  };

  const handleSelectTool = (componentId: string) => {
    setActiveToolId(componentId);
    incrementToolUsage(componentId);
    const element = document.getElementById('active-tool-viewport');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleShareTool = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      success('Link Copied!', 'Share this free tool with your network.');
    }
  };

  return (
    <>
      <SEO
        title="Free Online Tools Suite"
        description="Explore 100% free web tools for AI prompt engineering, business naming, freelance rate calculations, QR codes, word analysis, and social copywriting."
      />

      <div className="min-h-screen bg-slate-950 pb-20">
        {/* Header Hero */}
        <section className="pt-12 pb-14 border-b border-slate-900 bg-gradient-to-b from-slate-950 via-[#0a0f1d] to-[#090d16]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
                <Wrench className="w-3.5 h-3.5" />
                <span>100% Free • No Sign-Up Required</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Free Online Tools for Digital Creators & Freelancers
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Streamline repetitive tasks, engineer high-performing AI prompts, calculate target freelance hourly rates, and generate business assets with zero paywalls.
              </p>
            </div>
          </div>
        </section>

        {/* Active Tool Interactive Runner */}
        {activeTool && (
          <section id="active-tool-viewport" className="py-10 border-b border-slate-900 bg-[#0c1222]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="p-6 sm:p-8 bg-slate-900 border border-teal-500/30 rounded-3xl shadow-2xl space-y-6">
                {/* Tool Meta Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 shadow-md">
                      {getIcon(activeTool.icon)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                          {activeTool.category}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Active Tool
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                        {activeTool.name}
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={handleShareTool}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </button>
                    <span className="text-xs text-slate-500 font-mono">
                      {activeTool.usageCount.toLocaleString()} uses
                    </span>
                  </div>
                </div>

                {/* Embedded Tool Component */}
                <div className="pt-2">
                  <ToolContainer componentId={activeTool.componentId} />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Tools Directory Filters & Grid */}
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools..."
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => {
              const isCurrent = tool.componentId === activeToolId;
              return (
                <div
                  key={tool.id}
                  onClick={() => handleSelectTool(tool.componentId)}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between shadow-lg ${
                    isCurrent
                      ? 'bg-slate-900 border-teal-500/50 ring-1 ring-teal-500/30'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 group-hover:scale-105 transition-transform">
                        {getIcon(tool.icon)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {tool.badge && (
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {tool.badge}
                          </span>
                        )}
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Free
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] font-semibold text-teal-400 uppercase tracking-wider">
                      {tool.category}
                    </p>
                    <h3 className="text-base font-bold text-white mt-1 group-hover:text-teal-300 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2">
                      {tool.description}
                    </p>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-mono">
                      {tool.usageCount.toLocaleString()} uses
                    </span>
                    <span
                      className={`text-xs font-bold flex items-center gap-1 ${
                        isCurrent ? 'text-teal-300' : 'text-teal-400 group-hover:text-teal-300'
                      }`}
                    >
                      <span>{isCurrent ? 'Currently Open' : 'Launch Tool'}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Educational Trust Banner */}
          <div className="mt-16 p-8 bg-slate-900/60 border border-slate-800 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Privacy & Client-Side Execution</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                All tool calculations run locally in your browser.
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your QR codes, rate calculations, business names, and custom prompts are processed in memory and never sold to third-party ad networks.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/quest-dashboard')}
              className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors shrink-0 shadow-md shadow-teal-500/10"
            >
              Check Quest XP Rewards &rarr;
            </button>
          </div>
        </section>
      </div>
    </>
  );
};
