import React from 'react';
import {
  Sparkles,
  Layers,
  Workflow,
  Lightbulb,
  Zap,
  PenTool,
  ArrowRight,
} from 'lucide-react';

interface AIResourcesSectionProps {
  onNavigate: (path: string) => void;
}

export const AIResourcesSection: React.FC<AIResourcesSectionProps> = ({ onNavigate }) => {
  const resources = [
    {
      title: 'AI Tools Directory',
      description: 'Curated list of high-utility tools for coding, writing, research, and data automation.',
      icon: Sparkles,
      color: 'text-teal-400',
      badge: 'Curated',
    },
    {
      title: 'Engineered AI Prompts',
      description: 'Chain-of-thought and role-framed prompts tested for Gemini, Claude, and GPT-4.',
      icon: Layers,
      color: 'text-indigo-400',
      badge: '500+ Templates',
    },
    {
      title: 'AI Workflow Blueprints',
      description: 'Step-by-step operational workflows to eliminate repetitive digital admin tasks.',
      icon: Workflow,
      color: 'text-blue-400',
      badge: 'Systems',
    },
    {
      title: 'AI Business & Agency Ideas',
      description: 'Realistic modern business concepts enabled by high-speed AI tools.',
      icon: Lightbulb,
      color: 'text-emerald-400',
      badge: 'Opportunities',
    },
    {
      title: 'AI Productivity Systems',
      description: 'Techniques for using AI as a 24/7 research partner and executive editor.',
      icon: Zap,
      color: 'text-teal-400',
      badge: 'Productivity',
    },
    {
      title: 'AI Content Creation',
      description: 'Ethical, high-standard content frameworks that combine AI speed with human craftsmanship.',
      icon: PenTool,
      color: 'text-indigo-400',
      badge: 'Publishing',
    },
  ];

  return (
    <section className="py-16 sm:py-24 border-b border-slate-900 bg-[#0a0f1d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>AI Intelligence Hub</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Actionable AI Resources & Workflows
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl">
              Turn AI from a confusing buzzword into a daily multiplier for your freelance and digital product business.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/ai-resources')}
            className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-teal-300 hover:text-white text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <span>Explore AI Hub</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((item) => (
            <div
              key={item.title}
              onClick={() => onNavigate('/ai-resources')}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-teal-500/30 hover:bg-slate-900 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 group-hover:scale-105 transition-transform">
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <span className="text-[10px] font-semibold text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-teal-400 group-hover:text-teal-300 font-semibold">
                <span>View Resources</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
