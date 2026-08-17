import React from 'react';
import {
  TrendingUp,
  Package,
  Share2,
  Cpu,
  Laptop,
  Video,
  ArrowRight,
  ShieldCheck,
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
      color: 'text-teal-400',
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
      color: 'text-blue-400',
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
      color: 'text-teal-400',
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
    <section className="py-16 sm:py-24 border-b border-slate-900 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <p className="text-xs font-bold text-teal-400 uppercase tracking-wider">
            Realistic Pathways
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Six Proven Digital Earning Pathways
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            No get-rich-quick claims. No cryptocurrency speculation. Only real, skill-based economic models that businesses actually pay for.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((track) => (
            <div
              key={track.title}
              onClick={() => onNavigate(track.path)}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-teal-500/30 hover:bg-slate-900 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 group-hover:scale-105 transition-transform">
                    <track.icon className={`w-5 h-5 ${track.color}`} />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                    {track.difficulty}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                  {track.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {track.description}
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">
                  Est. Horizon: <span className="text-slate-300">{track.timeToFirstDollar}</span>
                </span>
                <span className="font-semibold text-teal-400 group-hover:text-teal-300 flex items-center gap-1">
                  <span>Explore Track</span>
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
