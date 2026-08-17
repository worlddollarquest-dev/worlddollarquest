import React from 'react';
import {
  Compass,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Target,
  Users,
  ArrowRight,
  TrendingUp,
  Package,
} from 'lucide-react';
import { SEO } from '../components/common/SEO';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const pillars = [
    {
      title: 'Learn (Foundational Skills)',
      desc: 'Master the high-leverage digital skills that global businesses actually pay for: modern frontend code, technical copywriting, workflow automation, and search intent analysis.',
      icon: Target,
      color: 'text-teal-400',
    },
    {
      title: 'Work (Proof-of-Work Execution)',
      desc: 'Transition from passive consuming to building tangible public assets. Build teardowns, prototype utilities, and establish an undeniable track record of execution.',
      icon: Zap,
      color: 'text-indigo-400',
    },
    {
      title: 'Earn (Sustainable Economics)',
      desc: 'Monetize through ethical freelance retainers, high-utility digital templates, software advisory, and transparent affiliate partnerships without gimmicks.',
      icon: TrendingUp,
      color: 'text-emerald-400',
    },
  ];

  return (
    <>
      <SEO
        title="About World Dollar Quest | Learn • Work • Earn"
        description="Discover the mission, philosophy, and practical operational standards behind World Dollar Quest."
      />

      <div className="min-h-screen bg-slate-950 pb-24">
        {/* Hero Header */}
        <section className="pt-12 pb-14 border-b border-slate-900 bg-gradient-to-b from-slate-950 via-[#0a0f1d] to-[#090d16]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
                <Compass className="w-3.5 h-3.5" />
                <span>Our Philosophy & Mission</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Empowering the Next Generation of Digital Solopreneurs
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                World Dollar Quest was founded on a simple premise: the internet is the greatest meritocracy in human history, but it is polluted by hype and get-rich-quick scams. We provide the practical tools and honest guidance needed to build real value.
              </p>
            </div>
          </div>
        </section>

        {/* 3 Pillars */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
              The Three Core Phases
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Learn • Work • Earn
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl space-y-4"
              >
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 w-fit">
                  <p.icon className={`w-6 h-6 ${p.color}`} />
                </div>
                <h3 className="text-lg font-bold text-white">{p.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Phase 1 vs Phase 2 Roadmap */}
        <section className="py-12 border-y border-slate-900 bg-[#0a0f1d]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                Strategic Horizon
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">
                Platform Development Roadmap
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Phase 1 */}
              <div className="p-8 rounded-3xl bg-slate-900 border border-teal-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                    Phase 1 (Live & Operational)
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 text-[10px] font-bold">
                    Active Foundation
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Foundational Architecture & Free Suite
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>Free browser-based tools with zero paywalls</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>Engineered AI Prompt Vault & structured workflow recipes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>Curated Digital Products & Freelance Operating Systems</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>Gamified Quest Progression System & Badges</span>
                  </li>
                </ul>
              </div>

              {/* Phase 2 */}
              <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    Phase 2 (Upcoming)
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-bold">
                    In Planning
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Marketplace & Collaborative Ecosystem
                </h3>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                    <span>Community digital product marketplace with creator payouts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                    <span>Live client-matching for verified freelance quest graduates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                    <span>Interactive prompt sandbox with direct LLM latency benchmarking</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Ready to start your quest?
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
            Explore our free tools, read the freelancing playbooks, and complete your first quest today.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('/free-tools')}
              className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-teal-500/20"
            >
              Explore Free Tools &rarr;
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/quest-dashboard')}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold text-xs transition-colors"
            >
              View Quest Hub &rarr;
            </button>
          </div>
        </section>
      </div>
    </>
  );
};
