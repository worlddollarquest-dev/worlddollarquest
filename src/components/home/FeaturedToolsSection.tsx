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
        return <Sparkles className="w-5 h-5 text-cyan-400" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-indigo-400" />;
      case 'MessageSquareShare':
        return <MessageSquareShare className="w-5 h-5 text-blue-400" />;
      case 'UserCheck':
        return <UserCheck className="w-5 h-5 text-emerald-400" />;
      case 'QrCode':
        return <QrCode className="w-5 h-5 text-cyan-400" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-indigo-400" />;
      case 'Calculator':
        return <Calculator className="w-5 h-5 text-emerald-400" />;
      default:
        return <Wrench className="w-5 h-5 text-slate-300" />;
    }
  };

  const activeTools = freeTools.filter((t) => t.status === 'active').slice(0, 6);

  return (
    <section className="py-20 sm:py-28 border-b border-white/10 bg-[#050816]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-2">
              <Wrench className="w-4 h-4" />
              <span>Free Online Utilities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Featured Free Online Tools
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-xl">
              100% free web tools designed to streamline prompt engineering, branding, social media copywriting, and freelance calculations.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/free-tools')}
            className="self-start md:self-auto px-6 py-3 rounded-xl btn-secondary-glass text-cyan-400 hover:text-cyan-300 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
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
              className="p-7 rounded-3xl glass-panel hover:border-cyan-500/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3.5 rounded-2xl bg-[#050816] border border-white/10 group-hover:scale-110 transition-transform shadow-md">
                    {getIcon(tool.icon)}
                  </div>
                  <div className="flex items-center gap-2">
                    {tool.badge && (
                      <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-white/5 text-slate-200 border border-white/10">
                        {tool.badge}
                      </span>
                    )}
                    <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Free
                    </span>
                  </div>
                </div>

                <p className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                  {tool.category}
                </p>
                <h3 className="text-lg font-bold text-white mt-1 group-hover:text-cyan-300 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-2.5 leading-relaxed line-clamp-2">
                  {tool.description}
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">
                  {tool.usageCount.toLocaleString()} uses
                </span>
                <span className="text-xs font-bold text-cyan-400 group-hover:text-cyan-300 flex items-center gap-1.5">
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
