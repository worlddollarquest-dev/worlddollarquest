import React from 'react';
import {
  TrendingUp,
  Package,
  Share2,
  Cpu,
  Laptop,
  Video,
  ArrowRight,
} from 'lucide-react';

interface MakeMoneyOnlineSectionProps {
  onNavigate: (path: string) => void;
}

export const MakeMoneyOnlineSection: React.FC<MakeMoneyOnlineSectionProps> = ({ onNavigate }) => {
  const tracks = [
    {
      title: 'Freelancing & Client Work',
      description: 'Package high-income skills (coding, design, technical writing) and pitch specific solutions to global businesses.',
      icon: TrendingUp,
      path: '/freelancing',
      difficulty: 'Beginner to Intermediate',
      timeToFirstDollar: '2 - 6 Weeks',
      color: 'text-cyan-400',
    },
    {
      title: 'Digital Products & Templates',
      description: 'Build downloadable assets once (Notion systems, prompt vaults, Figma kits) and distribute with near-zero marginal cost.',
      icon: Package,
      path: '/digital-products',
      difficulty: 'Intermediate',
      timeToFirstDollar: '4 - 12 Weeks',
      color: 'text-indigo-400',
    },
    {
      title: 'Ethical Affiliate Marketing',
      description: 'Review and compare software tools with complete disclosure, earning transparent commissions from qualifying purchases.',
      icon: Share2,
      path: '/make-money-online#affiliate',
      difficulty: 'Intermediate',
      timeToFirstDollar: '3 - 6 Months',
      color: 'text-pink-400',
    },
    {
      title: 'AI-Powered Workflows',
      description: 'Integrate LLMs to streamline market research, automate content drafting, and deliver agency deliverables faster.',
      icon: Cpu,
      path: '/ai-resources',
      difficulty: 'Beginner',
      timeToFirstDollar: 'Immediate Leverage',
      color: 'text-emerald-400',
    },
    {
      title: 'Global Remote Work',
      description: 'Position yourself for cross-border full-time or contract roles using asynchronous communication frameworks.',
      icon: Laptop,
      path: '/make-money-online#remote',
      difficulty: 'Intermediate to Advanced',
      timeToFirstDollar: '1 - 3 Months',
      color: 'text-cyan-400',
    },
    {
      title: 'Educational Content Creation',
      description: 'Share proof-of-work case studies, technical breakdowns, and workflows to build an audience that trusts your recommendations.',
      icon: Video,
      path: '/blog',
      difficulty: 'Long-Term Compound',
      timeToFirstDollar: '3 - 9 Months',
      color: 'text-indigo-400',
    },
  ];

  return (
    <section className="py-20 sm:py-28 border-b border-white/10 bg-[#050816]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
            Realistic Pathways
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Six Proven Digital Earning Pathways
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            No get-rich-quick claims. No cryptocurrency speculation. Only real, skill-based economic models that businesses actually pay for.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((track) => (
            <div
              key={track.title}
              onClick={() => onNavigate(track.path)}
              className="p-7 rounded-3xl glass-panel hover:border-cyan-500/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3.5 rounded-2xl bg-[#050816] border border-white/10 group-hover:scale-110 transition-transform shadow-md">
                    <track.icon className={`w-5 h-5 ${track.color}`} />
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10">
                    {track.difficulty}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {track.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-2.5 leading-relaxed">
                  {track.description}
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-medium">
                  Horizon: <span className="text-slate-200">{track.timeToFirstDollar}</span>
                </span>
                <span className="font-bold text-cyan-400 group-hover:text-cyan-300 flex items-center gap-1.5">
                  <span>Explore Track</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
