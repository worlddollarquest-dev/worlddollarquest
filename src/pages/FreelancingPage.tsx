import React, { useState } from 'react';
import {
  TrendingUp,
  CheckCircle2,
  Copy,
  Check,
  Calculator,
  ArrowRight,
  Shield,
  FileText,
  Mail,
  Zap,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { SEO } from '../components/common/SEO';

interface FreelancingPageProps {
  onNavigate: (path: string) => void;
}

export const FreelancingPage: React.FC<FreelancingPageProps> = ({ onNavigate }) => {
  const { success } = useToast();
  const { completeQuest } = useAuth();
  const [copiedPitchId, setCopiedPitchId] = useState<string | null>(null);

  const pitches = [
    {
      id: 'pitch-01',
      title: 'The "Identified Website Bottleneck" Pitch',
      recipient: 'Agency or E-commerce Founder',
      body: `Hi [Name],

Noticed your store on Shopify is performing well on desktop, but the mobile product image gallery takes 3.4 seconds to become interactive on 4G connections.

I put together a quick 90-second video demonstrating how preloading key hero assets reduced page weight by 40%: [Link].

No worries if your team is already working on this—just wanted to share the benchmark data!

Best regards,
[Your Name]`,
    },
    {
      id: 'pitch-02',
      title: 'The "Content Gap & Technical SEO" Outreach',
      recipient: 'SaaS Marketing Lead',
      body: `Hi [Name],

Really enjoyed your latest breakdown on [Topic]. Noticed that while your competitors are ranking for "[High Intent Keyword]", your site currently lacks an updated comparison table for that search intent.

I drafted a sample comparison layout with JSON-LD schema markup ready to review: [Link].

Would you be open to a 5-minute Loom overview if helpful?

Cheers,
[Your Name]`,
    },
  ];

  const handleCopyPitch = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPitchId(id);
    success('Script Copied!', 'Customize the bracketed placeholders before sending.');
    completeQuest('quest-03');
    setTimeout(() => setCopiedPitchId(null), 2500);
  };

  return (
    <>
      <SEO
        title="The Complete Freelance Operating Blueprint"
        description="Master niche skill packaging, build proof-of-work case studies without prior clients, calculate sustainable rates, and pitch global businesses."
      />

      <div className="min-h-screen bg-slate-950 pb-20">
        {/* Header Hero */}
        <section className="pt-12 pb-14 border-b border-slate-900 bg-gradient-to-b from-slate-950 via-[#0a0f1d] to-[#090d16]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Freelance Mastery Blueprint</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                How to Build a Sustainable Freelancing Career
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Stop competing on price on crowded job boards. Package specific solutions, demonstrate capability upfront with proof-of-work case studies, and pitch high-value clients directly.
              </p>
            </div>
          </div>
        </section>

        {/* 5-Stage Framework */}
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Stage 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start p-8 rounded-3xl bg-slate-900/60 border border-slate-800">
            <div className="lg:col-span-4 space-y-2">
              <span className="font-mono text-sm font-bold text-teal-400">STAGE 01</span>
              <h2 className="text-xl font-bold text-white">Specific Offer Positioning</h2>
              <p className="text-xs text-slate-400">
                Transition from a generalist laborer to a specialist problem-solver.
              </p>
            </div>
            <div className="lg:col-span-8 space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                When you call yourself a &quot;freelance developer&quot; or &quot;content writer,&quot; prospects perceive you as a generic commodity. Instead, define an offer around a clear recipient and a measurable outcome:
              </p>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs text-teal-300">
                <p>&ldquo;I build high-converting single-page landing pages for B2B cybersecurity SaaS companies.&rdquo;</p>
                <p>&ldquo;I audit and speed up Shopify mobile checkout speeds to recover abandoned carts.&rdquo;</p>
              </div>
            </div>
          </div>

          {/* Stage 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start p-8 rounded-3xl bg-slate-900/60 border border-slate-800">
            <div className="lg:col-span-4 space-y-2">
              <span className="font-mono text-sm font-bold text-indigo-400">STAGE 02</span>
              <h2 className="text-xl font-bold text-white">Proof of Work (Zero Past Clients)</h2>
              <p className="text-xs text-slate-400">
                You do not need years of agency employment to prove competence.
              </p>
            </div>
            <div className="lg:col-span-8 space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                Pick 2 live websites or apps in your target niche. Audit their bottlenecks publicly and build an improved alternative. Document:
              </p>
              <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
                <li><strong className="text-white">The Before State:</strong> What was slow, confusing, or poorly designed.</li>
                <li><strong className="text-white">The Decision Framework:</strong> Why you chose specific typography, component structures, or data pipelines.</li>
                <li><strong className="text-white">The Deliverable:</strong> A clean, publicly hosted live demo or PDF report.</li>
              </ul>
            </div>
          </div>

          {/* Stage 3: Outbound Scripts */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-sm font-bold text-emerald-400">STAGE 03</span>
                <h2 className="text-xl font-bold text-white mt-0.5">
                  High-Conversion Outreach Scripts
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Lead with value, identify genuine bottlenecks, and keep outreach concise.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pitches.map((pitch) => (
                <div
                  key={pitch.id}
                  className="p-6 rounded-2xl bg-slate-950 border border-slate-800/90 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold text-slate-400">
                        Target: {pitch.recipient}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyPitch(pitch.id, pitch.body)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors"
                      >
                        {copiedPitchId === pitch.id ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedPitchId === pitch.id ? 'Copied' : 'Copy Script'}</span>
                      </button>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-3">{pitch.title}</h3>
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {pitch.body}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stage 4: Rate Calculation shortcut */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="font-mono text-sm font-bold text-teal-400">STAGE 04 & 05</span>
              <h3 className="text-xl font-bold text-white">
                Value-Based Pricing & Rate Calculation
              </h3>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                Never quote based on hours alone without factoring in non-billable marketing time, self-employment taxes, and software costs.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/free-tools?tool=rate-calc')}
              className="px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors shrink-0 flex items-center gap-2 shadow-lg shadow-teal-500/20"
            >
              <Calculator className="w-4 h-4" />
              <span>Launch Rate Calculator</span>
            </button>
          </div>
        </section>
      </div>
    </>
  );
};
