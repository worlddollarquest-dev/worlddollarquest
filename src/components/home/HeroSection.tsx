import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck, Wrench, Layers, Compass, CheckCircle2, Zap, Terminal, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeroSectionProps {
  onNavigate: (path: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-32 border-b border-white/10 bg-gradient-to-b from-[#050816] via-[#080B1A] to-[#050816]">
      {/* Futuristic grid and mesh background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Dynamic Ambient Glowing Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#4F46FF]/15 rounded-full blur-[120px] pointer-events-none animate-pulse-ring" />
      <div className="absolute top-1/3 right-1/4 w-[380px] h-[380px] bg-[#EC4899]/12 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-[#00D4FF]/10 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6 sm:space-y-8">
            {/* Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md shadow-lg shadow-indigo-500/10"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Learn • Work • Earn Smarter</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08]"
            >
              Learn. Work. Earn.{' '}
              <span className="text-gradient-smarter">
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
              A futuristic digital ecosystem featuring practical AI prompts, engineered utilities, digital commercial assets, and realistic freelance monetization paths.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <button
                type="button"
                onClick={() => onNavigate('/free-tools')}
                className="w-full sm:w-auto px-8 py-4 btn-premium shimmer-sweep flex items-center justify-center gap-2.5 text-sm group cursor-pointer"
              >
                <span>Explore Free Tools</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/ai-resources')}
                className="w-full sm:w-auto px-8 py-4 btn-secondary-glass flex items-center justify-center gap-2.5 text-sm cursor-pointer"
              >
                <span>Explore AI Hub</span>
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </button>
            </motion.div>

            {/* Trust highlights */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% Free Online Utilities</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero Crypto Hype</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Verified Career Playbooks</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive Command Hub / Engine */}
          <div className="lg:col-span-5 perspective-1200">
            <motion.div
              initial={{ opacity: 0, rotateX: 10, y: 20 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              transition={{ delay: 0.25, duration: 0.8, ease: 'easeOut' }}
              className="relative p-6 sm:p-7 glass-elevated rounded-3xl shadow-[0_25px_60px_-15px_rgba(79,70,255,0.3)] space-y-5 animate-float-slow border border-white/10"
            >
              {/* Floating Decorative Glow Core */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-tr from-[#8B5CF6] to-[#EC4899] rounded-full blur-2xl opacity-40 pointer-events-none" />

              {/* Header inside mock window */}
              <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/90 shadow-sm" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/90 shadow-sm" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/90 shadow-sm" />
                </div>
                <div className="text-[11px] font-mono text-cyan-300 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                  <Terminal className="w-3 h-3 text-cyan-400" />
                  <span>WDQ Command Hub v2.6</span>
                </div>
              </div>

              {/* Quest active progress card with 3D depth */}
              <div
                onClick={() => onNavigate('/quest-dashboard')}
                className="p-4.5 rounded-2xl bg-gradient-to-br from-[#080B1A] to-[#111831] border border-indigo-500/30 space-y-3 cursor-pointer group hover:border-indigo-500/60 transition-all shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" /> Active Skill Quest
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-bold border border-indigo-500/30">
                    +150 XP
                  </span>
                </div>
                <p className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Freelance Packaging & Outbound Conversion
                </p>
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-[#EC4899] h-full w-3/4 rounded-full shadow-sm" />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>Level {user?.level || 1} Explorer</span>
                  <span>{user?.xp || 150} / 400 XP to Rank Up</span>
                </div>
              </div>

              {/* Tool Snippet Quick Actions */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => onNavigate('/free-tools?tool=prompt-gen')}
                  className="p-3.5 rounded-2xl bg-[#080B1A]/80 hover:bg-[#111831] border border-white/10 hover:border-cyan-500/40 text-left transition-all group shadow-md"
                >
                  <div className="flex items-center gap-2 text-cyan-300 font-semibold mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span>AI Prompt Gen</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    Instant structured role prompts
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('/free-tools?tool=rate-calc')}
                  className="p-3.5 rounded-2xl bg-[#080B1A]/80 hover:bg-[#111831] border border-white/10 hover:border-indigo-500/40 text-left transition-all group shadow-md"
                >
                  <div className="flex items-center gap-2 text-indigo-300 font-semibold mb-1">
                    <TrendingUp className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
                    <span>Rate Calculator</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    Calculate target hourly rate
                  </p>
                </button>
              </div>

              {/* Footnote statement */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-white/10 font-medium">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Secure Platform Engine</span>
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate('/quest-dashboard')}
                  className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 transition-colors"
                >
                  <span>Open Hub</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
