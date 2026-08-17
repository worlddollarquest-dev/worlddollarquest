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
      accentColor: 'text-cyan-400',
      borderHover: 'hover:border-cyan-500/50',
      badge: '7+ Live Tools',
    },
    {
      id: 'explore-ai',
      title: 'AI Resources',
      description: 'Discover AI tools, prompts, workflows, and practical AI resources.',
      icon: Sparkles,
      path: '/ai-resources',
      cta: 'Explore AI Hub',
      accentColor: 'text-indigo-400',
      borderHover: 'hover:border-indigo-500/50',
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
      borderHover: 'hover:border-emerald-500/50',
      badge: 'Realistic Blueprints',
    },
    {
      id: 'explore-freelance',
      title: 'Freelancing',
      description: 'Practical guides and resources for finding clients and growing your freelance career.',
      icon: TrendingUp,
      path: '/freelancing',
      cta: 'Read Freelance Guide',
      accentColor: 'text-[#EC4899]',
      borderHover: 'hover:border-pink-500/50',
      badge: 'Client Acquisition',
    },
  ];

  return (
    <section className="py-20 sm:py-28 border-b border-white/10 bg-[#080B1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20 space-y-3">
          <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
            Explore World Dollar Quest
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Four Pillars to Accelerate Your Digital Career
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Everything you need to sharpen practical skills, streamline digital operations, and build legitimate online earnings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => onNavigate(card.path)}
              className={`p-7 rounded-3xl glass-panel ${card.borderHover} hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group flex flex-col justify-between shadow-xl space-y-6 relative overflow-hidden`}
            >
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/25 transition-colors pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="p-3.5 rounded-2xl bg-[#050816] border border-white/10 group-hover:scale-110 transition-transform shadow-md">
                    <card.icon className={`w-6 h-6 ${card.accentColor}`} />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-300 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                    {card.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-2.5 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
                <span>{card.cta}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
