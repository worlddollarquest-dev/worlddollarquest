import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck, Wrench, Layers, Compass, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeroSectionProps {
  onNavigate: (path: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-slate-900 bg-gradient-to-b from-slate-950 via-[#0a0f1d] to-[#090d16]">
      {/* Subtle grid background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Learn • Work • Earn Smarter</span>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]"
            >
              Learn. Work. Earn.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-400 to-indigo-400">
                Smarter.
              </span>
            </motion.h1>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed"
            >
              Discover practical tools, AI resources, digital products, freelancing strategies, and opportunities designed to help you build your digital future.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2"
            >
              <button
                type="button"
                onClick={() => onNavigate('/free-tools')}
                className="w-full sm:w-auto px-7 py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 group"
              >
                <span>Explore Free Tools</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/ai-resources')}
                className="w-full sm:w-auto px-7 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold rounded-xl text-sm transition-colors border border-slate-800 flex items-center justify-center gap-2"
              >
                <span>Explore Resources</span>
              </button>
            </motion.div>

            {/* Trust highlights */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>100% Free Online Tools</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Zero Crypto / No Get-Rich Hype</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Realistic Career Blueprints</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Digital Work & Productivity Dashboard Preview */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative p-5 sm:p-6 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-xl space-y-4"
            >
              {/* Header inside mock window */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-teal-400" />
                  <span>World Dollar Quest Engine</span>
                </div>
              </div>

              {/* Quest active progress card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 to-indigo-950/40 border border-teal-500/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                    Current Skill Quest
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono font-bold">
                    +150 XP
                  </span>
                </div>
                <p className="text-sm font-semibold text-white">
                  Freelance Packaging & Outbound Conversion
                </p>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-teal-400 to-indigo-500 h-full w-3/4 rounded-full" />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Level {user?.level || 1} Explorer</span>
                  <span>{user?.xp || 150} / 400 XP to Next Rank</span>
                </div>
              </div>

              {/* Tool Snippet Quick Actions */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => onNavigate('/free-tools')}
                  className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 text-left transition-colors group"
                >
                  <div className="flex items-center gap-2 text-teal-400 font-semibold mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Prompt Gen</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    Instant structured role prompts
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('/free-tools')}
                  className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 text-left transition-colors group"
                >
                  <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-1">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Rate Calculator</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    Calculate minimum hourly target
                  </p>
                </button>
              </div>

              {/* Footnote statement */}
              <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/60">
                <span>Phase 1 Verified Foundation</span>
                <button
                  type="button"
                  onClick={() => onNavigate('/quest-dashboard')}
                  className="text-teal-400 hover:underline font-medium"
                >
                  Open Quest Hub &rarr;
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
