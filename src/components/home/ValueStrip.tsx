import React from 'react';
import { Wrench, BookOpen, Package, TrendingUp } from 'lucide-react';

interface ValueStripProps {
  onNavigate: (path: string) => void;
}

export const ValueStrip: React.FC<ValueStripProps> = ({ onNavigate }) => {
  const points = [
    {
      title: 'Free Tools',
      description: 'Useful utilities to automate and speed up digital work.',
      icon: Wrench,
      path: '/free-tools',
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/10 border-teal-500/20',
    },
    {
      title: 'Practical Resources',
      description: 'Battle-tested prompts, workflows, and actionable guides.',
      icon: BookOpen,
      path: '/ai-resources',
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'Digital Products',
      description: 'High-utility templates, spreadsheets, and playbooks.',
      icon: Package,
      path: '/digital-products',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      title: 'Work & Earn Guides',
      description: 'Realistic freelancing frameworks and remote earning paths.',
      icon: TrendingUp,
      path: '/make-money-online',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  return (
    <section className="py-10 border-b border-slate-900 bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {points.map((point) => (
            <div
              key={point.title}
              onClick={() => onNavigate(point.path)}
              className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 transition-all cursor-pointer group flex items-start gap-4"
            >
              <div className={`p-3 rounded-xl border ${point.bgColor} shrink-0`}>
                <point.icon className={`w-5 h-5 ${point.color}`} />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm text-slate-100 group-hover:text-teal-300 transition-colors">
                  {point.title}
                </p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {point.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
