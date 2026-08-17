import React from 'react';
import {
  DollarSign,
  TrendingUp,
  Package,
  Share2,
  Cpu,
  Laptop,
  Video,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Check,
} from 'lucide-react';
import { SEO } from '../components/common/SEO';

interface MakeMoneyOnlinePageProps {
  onNavigate: (path: string) => void;
}

export const MakeMoneyOnlinePage: React.FC<MakeMoneyOnlinePageProps> = ({ onNavigate }) => {
  const models = [
    {
      id: 'freelancing',
      title: '1. Freelancing & High-Income Services',
      tagline: 'Fastest path to first revenue ($500 - $5,000/mo)',
      description:
        'Sell specific technical, design, or writing solutions to businesses with identifiable problems. Instead of general labor, package audits, migration services, or conversion improvements.',
      requirements: ['1 core marketable skill (e.g. React, copywriting, Figma)', 'Self-directed proof-of-work portfolio', 'Consistent outreach habit'],
      timeHorizon: '2 to 6 Weeks to first client',
      capitalNeeded: '$0 - $50 (Hosting & domain)',
      ctaText: 'Read Freelance Blueprint',
      ctaAction: () => onNavigate('/freelancing'),
      badge: 'Recommended for Beginners',
      icon: TrendingUp,
      accentColor: 'text-teal-400',
    },
    {
      id: 'digital-products',
      title: '2. Digital Products & Template Publishing',
      tagline: 'High leverage with near-zero marginal reproduction cost',
      description:
        'Create Notion dashboards, prompt databases, contract templates, and Excel calculators once, and distribute them to specialized niche audiences.',
      requirements: ['Understanding of user operational friction', 'Clean file structuring & READMEs', 'Distribution channel (Gumroad, LemonSqueezy, website)'],
      timeHorizon: '4 to 12 Weeks',
      capitalNeeded: '$0 - $100',
      ctaText: 'Explore Digital Products',
      ctaAction: () => onNavigate('/digital-products'),
      badge: 'High Leverage',
      icon: Package,
      accentColor: 'text-indigo-400',
    },
    {
      id: 'affiliate-content',
      title: '3. Ethical Affiliate & Software Reviews',
      tagline: 'Help buyers compare complex B2B and creative tools',
      description:
        'Build in-depth teardown guides, comparison tables, and workflow tutorials. Disclose all affiliate links transparently in full compliance with global advertising guidelines.',
      requirements: ['Domain knowledge in software tools', 'SEO keyword research fundamentals', 'Commitment to unbiased editorial integrity'],
      timeHorizon: '3 to 6 Months',
      capitalNeeded: '$50 - $200 (Domain, hosting)',
      ctaText: 'Read Disclosure Standards',
      ctaAction: () => onNavigate('/affiliate-disclosure'),
      badge: 'Passive Compounding',
      icon: Share2,
      accentColor: 'text-blue-400',
    },
    {
      id: 'ai-workflows',
      title: '4. AI Workflow Architecture & Consulting',
      tagline: 'Help small businesses implement modern AI tools',
      description:
        'Small businesses want to save 10+ hours a week but lack the time to test prompt patterns or configure automated data pipelines. Provide setup, prompt libraries, and team SOPs.',
      requirements: ['Mastery of modern LLMs (Gemini, Claude, GPT-4)', 'Automation connectors (Make, Zapier, Webhooks)', 'Ability to teach non-technical teams'],
      timeHorizon: '3 to 8 Weeks',
      capitalNeeded: '$0 - $100',
      ctaText: 'View AI Resources',
      ctaAction: () => onNavigate('/ai-resources'),
      badge: 'High Hourly Rate',
      icon: Cpu,
      accentColor: 'text-emerald-400',
    },
    {
      id: 'remote-roles',
      title: '5. Global Remote Contract & Full-Time Work',
      tagline: 'Access global compensation from anywhere',
      description:
        'Work as an independent contractor or remote employee for global software companies, utilizing async communication skills, Git workflows, and autonomous problem-solving.',
      requirements: ['Demonstrated proof of independent execution', 'Asynchronous written English fluency', 'Consistent online portfolio'],
      timeHorizon: '1 to 3 Months',
      capitalNeeded: '$0',
      ctaText: 'Read Career Guide',
      ctaAction: () => onNavigate('/blog'),
      badge: 'High Stability',
      icon: Laptop,
      accentColor: 'text-teal-400',
    },
    {
      id: 'proof-of-work',
      title: '6. Proof-of-Work Content Creation',
      tagline: 'Build an audience by building in public',
      description:
        'Document your experiments, tool teardowns, and coding projects publicly on YouTube, GitHub, X, or a personal blog. Trust attracts inbound consulting and sponsorship.',
      requirements: ['Consistency over 6+ months', 'Genuine experiments (no fake claims)', 'Clear visual and written presentation'],
      timeHorizon: '6 to 12 Months',
      capitalNeeded: '$0 - $150',
      ctaText: 'View Platform Blog',
      ctaAction: () => onNavigate('/blog'),
      badge: 'Long-Term Moat',
      icon: Video,
      accentColor: 'text-indigo-400',
    },
  ];

  return (
    <>
      <SEO
        title="Make Money Online: 6 Realistic Digital Pathways"
        description="A grounded, no-hype breakdown of 6 legitimate ways to earn online through freelancing, digital products, software consulting, and remote work."
      />

      <div className="min-h-screen bg-slate-950 pb-20">
        {/* Hero Header */}
        <section className="pt-12 pb-14 border-b border-slate-900 bg-gradient-to-b from-slate-950 via-[#0a0f1d] to-[#090d16]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Zero Hype • Pure Practical Execution</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Realistic Ways to Make Money Online
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                The internet rewards real utility. Here are six verified economic models that individuals can use to build sustainable freelance income, digital products, and remote work opportunities.
              </p>
            </div>
          </div>
        </section>

        {/* Anti-Scam / Reality Check Warning Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="p-6 rounded-3xl bg-rose-950/30 border border-rose-500/30 flex flex-col sm:flex-row items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-1" />
            <div className="space-y-1 text-xs text-slate-300 leading-relaxed">
              <h3 className="font-bold text-rose-200 text-sm">
                What We Reject at World Dollar Quest
              </h3>
              <p>
                We strictly do NOT promote crypto trading, binary options, push-button automated wealth schemes, paid survey farms, or multi-level marketing (MLM). Real income requires developing marketable skills, packaging them clearly, and solving concrete bottlenecks for paying clients or customers.
              </p>
            </div>
          </div>
        </div>

        {/* 6 Models Deep Dive */}
        <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {models.map((model) => (
            <div
              key={model.id}
              className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl space-y-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                    <model.icon className={`w-6 h-6 ${model.accentColor}`} />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400">
                      {model.badge}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                      {model.title}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">{model.tagline}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={model.ctaAction}
                  className="self-start lg:self-auto px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-teal-400 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <span>{model.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">{model.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Key Requirements:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {model.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Realistic Time Horizon:
                  </span>
                  <p className="text-sm font-bold text-teal-300">{model.timeHorizon}</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Based on 10-15 focused weekly hours of deliberate practice and execution.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Starting Capital:
                  </span>
                  <p className="text-sm font-bold text-indigo-300">{model.capitalNeeded}</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Most pathways can be launched using free software tiers and open-source tools.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </>
  );
};
