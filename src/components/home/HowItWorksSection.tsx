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
      color: 'text-teal-400',
      borderColor: 'border-teal-500/30',
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
    <section className="py-16 sm:py-24 border-b border-slate-900 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <p className="text-xs font-bold text-teal-400 uppercase tracking-wider">
            The Three-Stage Journey
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            How World Dollar Quest Works
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            A structured, realistic path designed to guide you from initial exploration to sustainable online income.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => (
            <div
              key={step.number}
              className={`p-8 rounded-3xl bg-slate-900/70 border ${step.borderColor} flex flex-col justify-between relative space-y-6 shadow-xl`}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                    <step.icon className={`w-6 h-6 ${step.color}`} />
                  </div>
                  <span className="font-mono text-2xl font-black text-slate-700">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white tracking-tight">{step.title}</h3>
                <p className="text-xs font-semibold text-teal-400 mt-1 uppercase tracking-wider">
                  {step.tagline}
                </p>
                <p className="text-xs sm:text-sm text-slate-400 mt-3 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={step.action}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 transition-colors flex items-center justify-center gap-2"
                >
                  <span>{step.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
