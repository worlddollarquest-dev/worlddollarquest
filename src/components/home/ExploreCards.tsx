import React from 'react';
import { Wrench, Sparkles, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';

interface ExploreCardsProps {
  onNavigate: (path: string) => void;
}

export const ExploreCards: React.FC<ExploreCardsProps> = ({ onNavigate }) => {
  const cards = [
    {
      id: 'explore-tools',
      title: 'Free Tools',
      description: 'Useful online tools designed to save time and simplify digital work.',
      icon: Wrench,
      path: '/free-tools',
      cta: 'Launch Free Tools',
      accentColor: 'text-teal-400',
      borderHover: 'hover:border-teal-500/40',
      badge: '6+ Live Tools',
    },
    {
      id: 'explore-ai',
      title: 'AI Resources',
      description: 'Discover AI tools, prompts, workflows, and practical AI resources.',
      icon: Sparkles,
      path: '/ai-resources',
      cta: 'Explore AI Hub',
      accentColor: 'text-indigo-400',
      borderHover: 'hover:border-indigo-500/40',
      badge: 'Prompts & Workflows',
    },
    {
      id: 'explore-mmo',
      title: 'Make Money Online',
      description: 'Learn realistic strategies for freelancing, digital products, remote work, and online business.',
      icon: DollarSign,
      path: '/make-money-online',
      cta: 'View Earning Paths',
      accentColor: 'text-emerald-400',
      borderHover: 'hover:border-emerald-500/40',
      badge: 'Realistic Blueprints',
    },
    {
      id: 'explore-freelance',
      title: 'Freelancing',
      description: 'Practical guides and resources for finding clients and growing your freelance career.',
      icon: TrendingUp,
      path: '/freelancing',
      cta: 'Read Freelance Guide',
      accentColor: 'text-blue-400',
      borderHover: 'hover:border-blue-500/40',
      badge: 'Client Acquisition',
    },
  ];

  return (
    <section className="py-16 sm:py-24 border-b border-slate-900 bg-[#0a0f1d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <p className="text-xs font-bold text-teal-400 uppercase tracking-wider">
            Explore World Dollar Quest
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Four Pillars to Accelerate Your Digital Career
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Everything you need to sharpen practical skills, streamline operations, and build legitimate online earnings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => onNavigate(card.path)}
              className={`p-6 rounded-2xl bg-slate-900/80 border border-slate-800 ${card.borderHover} hover:bg-slate-900 transition-all cursor-pointer group flex flex-col justify-between shadow-lg space-y-6`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 group-hover:scale-105 transition-transform">
                    <card.icon className={`w-6 h-6 ${card.accentColor}`} />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700/50">
                    {card.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-teal-400 group-hover:text-teal-300">
                <span>{card.cta}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
