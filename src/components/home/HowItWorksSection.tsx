import React from 'react';
import { Compass, BookOpen, DollarSign, ArrowRight } from 'lucide-react';

interface HowItWorksSectionProps {
  onNavigate: (path: string) => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onNavigate }) => {
  const steps = [
    {
      number: '01',
      title: 'Discover',
      tagline: 'Find useful tools and resources',
      description: 'Explore our free suite of prompt generators, naming tools, calculators, and curated AI blueprints to remove immediate operational friction.',
      icon: Compass,
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/30',
      action: () => onNavigate('/free-tools'),
      actionText: 'Explore Tools',
    },
    {
      number: '02',
      title: 'Learn',
      tagline: 'Build practical digital skills',
      description: 'Study realistic roadmaps on skill packaging, proof-of-work portfolio building, client outreach scripts, and ethical distribution systems.',
      icon: BookOpen,
      color: 'text-indigo-400',
      borderColor: 'border-indigo-500/30',
      action: () => onNavigate('/blog'),
      actionText: 'Read Articles',
    },
    {
      number: '03',
      title: 'Earn',
      tagline: 'Apply your skills to online opportunities',
      description: 'Execute value-based client proposals, launch downloadable digital templates, or provide consulting services with proven commercial frameworks.',
      icon: DollarSign,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      action: () => onNavigate('/make-money-online'),
      actionText: 'View Earning Paths',
    },
  ];

  return (
    <section className="py-20 sm:py-28 border-b border-white/10 bg-[#050816]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
            The Three-Stage Journey
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How World Dollar Quest Works
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            A structured, realistic path designed to guide you from initial exploration to sustainable online income.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`p-8 rounded-3xl glass-panel border ${step.borderColor} flex flex-col justify-between relative space-y-6 shadow-2xl hover:-translate-y-1 transition-all duration-300`}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#050816] border border-white/10 flex items-center justify-center shadow-inner">
                    <step.icon className={`w-6 h-6 ${step.color}`} />
                  </div>
                  <span className="font-mono text-3xl font-black text-slate-600/70">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white tracking-tight">{step.title}</h3>
                <p className="text-xs font-bold text-cyan-400 mt-1 uppercase tracking-wider">
                  {step.tagline}
                </p>
                <p className="text-xs sm:text-sm text-slate-400 mt-3.5 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="pt-5 border-t border-white/10">
                <button
                  type="button"
                  onClick={step.action}
                  className="w-full py-3 px-4 rounded-xl btn-secondary-glass text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{step.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
