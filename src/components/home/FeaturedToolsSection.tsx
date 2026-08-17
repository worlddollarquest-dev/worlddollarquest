import React from 'react';
import {
  Sparkles,
  Briefcase,
  MessageSquareShare,
  UserCheck,
  QrCode,
  FileText,
  Calculator,
  ArrowRight,
  Wrench,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface FeaturedToolsSectionProps {
  onNavigate: (path: string) => void;
}

export const FeaturedToolsSection: React.FC<FeaturedToolsSectionProps> = ({ onNavigate }) => {
  const { freeTools } = useApp();

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

  const activeTools = freeTools.filter((t) => t.status === 'active').slice(0, 6);

  return (
    <section className="py-16 sm:py-24 border-b border-slate-900 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Wrench className="w-4 h-4" />
              <span>Free Online Utilities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Featured Free Online Tools
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl">
              100% free web tools designed to streamline prompt engineering, branding, social media copywriting, and freelance calculations.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/free-tools')}
            className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-teal-400 hover:text-teal-300 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <span>View All Tools</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => onNavigate(`/free-tools?tool=${tool.componentId}`)}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 hover:border-teal-500/40 hover:bg-slate-900 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 group-hover:scale-105 transition-transform">
                    {getIcon(tool.icon)}
                  </div>
                  <div className="flex items-center gap-2">
                    {tool.badge && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {tool.badge}
                      </span>
                    )}
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
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
                <span className="text-xs font-semibold text-teal-400 group-hover:text-teal-300 flex items-center gap-1">
                  <span>Use Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
