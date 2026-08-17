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
      color: 'text-cyan-400',
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
      color: 'text-pink-400',
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
      color: 'text-cyan-400',
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
    <section className="py-20 sm:py-28 border-b border-white/10 bg-[#080B1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4" />
              <span>AI Intelligence Hub</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Actionable AI Resources & Workflows
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-xl">
              Turn AI from a confusing buzzword into a daily multiplier for your freelance and digital product business.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/ai-resources')}
            className="self-start md:self-auto px-6 py-3 rounded-xl btn-secondary-glass text-cyan-300 hover:text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
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
              className="p-7 rounded-3xl glass-panel hover:border-cyan-500/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3.5 rounded-2xl bg-[#050816] border border-white/10 group-hover:scale-110 transition-transform shadow-md">
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-2.5 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-white/10 flex items-center justify-between text-xs text-cyan-400 group-hover:text-cyan-300 font-bold">
                <span>View Resources</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
