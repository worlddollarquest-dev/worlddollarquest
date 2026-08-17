import React, { useState, useEffect } from 'react';
import { ShieldCheck, FileText, Lock, DollarSign, Share2, HelpCircle, ArrowRight } from 'lucide-react';
import { SEO } from '../components/common/SEO';

interface LegalPageProps {
  initialTab?: string;
  onNavigate: (path: string) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ initialTab = 'privacy-policy', onNavigate }) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const legalTabs = [
    { id: 'privacy-policy', label: 'Privacy Policy', path: '/privacy-policy' },
    { id: 'terms', label: 'Terms of Service', path: '/terms' },
    { id: 'earnings-disclaimer', label: 'Earnings Disclaimer', path: '/earnings-disclaimer' },
    { id: 'affiliate-disclosure', label: 'Affiliate Disclosure', path: '/affiliate-disclosure' },
    { id: 'disclaimer', label: 'General Disclaimer', path: '/disclaimer' },
    { id: 'cookie-policy', label: 'Cookie Policy', path: '/cookie-policy' },
    { id: 'refund-policy', label: 'Refund Policy', path: '/refund-policy' },
    { id: 'dmca', label: 'DMCA & Copyright', path: '/dmca' },
    { id: 'acceptable-use', label: 'Acceptable Use', path: '/acceptable-use' },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onNavigate(`/${tabId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <SEO
        title="Legal Compliance & Consumer Transparency"
        description="Comprehensive legal documents, terms of service, privacy practices, and earnings disclaimers for World Dollar Quest."
      />

      <div className="min-h-screen bg-slate-950 pb-24">
        {/* Header Hero */}
        <section className="pt-12 pb-14 border-b border-slate-900 bg-gradient-to-b from-slate-950 via-[#0a0f1d] to-[#090d16]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>Governance & Compliance Hub</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Legal Policies & Disclosures
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                World Dollar Quest operates under strict transparency, consumer protection, and data privacy principles. Review our complete legal documentation below.
              </p>
            </div>
          </div>
        </section>

        {/* Content & Sidebar Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sidebar nav */}
            <div className="lg:col-span-4 sticky top-24 space-y-2 bg-slate-900/60 p-4 rounded-3xl border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 block mb-2">
                Legal Documents
              </span>
              {legalTabs.map((tab) => {
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabChange(tab.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                      isSelected
                        ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {isSelected && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                );
              })}

              <div className="pt-4 mt-4 border-t border-slate-800 text-[11px] text-slate-500 px-3">
                <p>Last Audited: January 2025</p>
                <p>Governing Law: Delaware, USA</p>
              </div>
            </div>

            {/* Main Document Display */}
            <div className="lg:col-span-8 p-8 sm:p-10 rounded-3xl bg-slate-900/80 border border-slate-800/90 shadow-2xl space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
              {activeTab === 'privacy-policy' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-4">
                    <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                      Data Protection
                    </span>
                    <h2 className="text-2xl font-bold text-white mt-1">Privacy Policy</h2>
                    <p className="text-xs text-slate-500 mt-1">Effective Date: January 1, 2025</p>
                  </div>

                  <section className="space-y-3">
                    <h3 className="text-base font-bold text-white">1. Information We Collect</h3>
                    <p>
                      World Dollar Quest collects minimal personal data required to provide services. This includes newsletter email addresses submitted voluntarily, contact inquiries, and aggregated client-side telemetry (such as anonymous tool usage counters stored locally in browser storage).
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base font-bold text-white">2. Local-First Tool Execution</h3>
                    <p>
                      Our online tools (such as the Freelance Rate Calculator, AI Prompt Generator, QR Code Generator, and Word Counter) run calculations directly in your browser. Inputs and generated assets are not permanently logged or sold to data brokers.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base font-bold text-white">3. Cookies & Analytics</h3>
                    <p>
                      We utilize essential session cookies and local storage tokens to preserve user quest progression, preferences, and theme state. You can disable non-essential cookies at any time via your browser settings.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base font-bold text-white">4. Contact & Data Deletion</h3>
                    <p>
                      To request data export or complete account deletion, email our data privacy officer at <strong className="text-teal-300">privacy@worlddollar.quest</strong>.
                    </p>
                  </section>
                </div>
              )}

              {activeTab === 'earnings-disclaimer' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-4">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      Financial Transparency
                    </span>
                    <h2 className="text-2xl font-bold text-white mt-1">Earnings & Income Disclaimer</h2>
                    <p className="text-xs text-slate-500 mt-1">Last Updated: January 1, 2025</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                    <strong>Critical Notice:</strong> Any earnings figures, hourly rate targets, or case studies mentioned on World Dollar Quest are illustrative estimates, not guarantees of financial outcome.
                  </div>

                  <section className="space-y-3">
                    <h3 className="text-base font-bold text-white">1. No Guaranteed Income</h3>
                    <p>
                      Generating freelance income, selling digital products, or building remote services involves substantial effort, market risk, and individual skill. Your actual results will vary depending on your domain expertise, time investment, portfolio quality, and economic conditions.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base font-bold text-white">2. No Financial or Legal Advice</h3>
                    <p>
                      Content on this platform is for educational and informational purposes only. We are not certified financial planners, licensed attorneys, or certified tax accountants. Always consult a licensed professional in your jurisdiction before making financial commitments.
                    </p>
                  </section>
                </div>
              )}

              {activeTab === 'affiliate-disclosure' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-4">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                      FTC & Global Ad Compliance
                    </span>
                    <h2 className="text-2xl font-bold text-white mt-1">Affiliate Disclosure</h2>
                    <p className="text-xs text-slate-500 mt-1">Compliance with FTC 16 CFR Part 255</p>
                  </div>

                  <section className="space-y-3">
                    <h3 className="text-base font-bold text-white">1. Transparency First</h3>
                    <p>
                      Some links on World Dollar Quest are affiliate links. This means that if you click through and purchase a software subscription or service, we may earn an affiliate commission at no extra cost to you.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base font-bold text-white">2. Editorial Independence</h3>
                    <p>
                      We never accept payment to give a positive review to an inferior tool. Our recommendations are strictly based on genuine operational testing, usability benchmarks, and practical value for digital solopreneurs.
                    </p>
                  </section>
                </div>
              )}

              {activeTab === 'terms' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-4">
                    <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                      User Agreement
                    </span>
                    <h2 className="text-2xl font-bold text-white mt-1">Terms of Service</h2>
                    <p className="text-xs text-slate-500 mt-1">Effective Date: January 1, 2025</p>
                  </div>

                  <section className="space-y-3">
                    <h3 className="text-base font-bold text-white">1. Acceptance of Terms</h3>
                    <p>
                      By accessing World Dollar Quest (&ldquo;the Site&rdquo;), you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, you must discontinue use immediately.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base font-bold text-white">2. Digital Product Licenses</h3>
                    <p>
                      Purchased digital assets (Notion templates, prompt packs, code kits) are licensed for single-user personal and internal commercial use. Resale, redistribution, or public hosting of raw product files is strictly prohibited.
                    </p>
                  </section>
                </div>
              )}

              {activeTab === 'refund-policy' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-4">
                    <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                      Customer Satisfaction
                    </span>
                    <h2 className="text-2xl font-bold text-white mt-1">Refund Policy</h2>
                  </div>
                  <section className="space-y-3">
                    <h3 className="text-base font-bold text-white">Digital Product Returns</h3>
                    <p>
                      Due to the instant delivery nature of digital downloads and templates, standard digital products are generally non-refundable once downloaded. However, if a file is defective or does not match specifications, we offer a 14-day replacement or credit guarantee.
                    </p>
                  </section>
                </div>
              )}

              {(activeTab === 'disclaimer' ||
                activeTab === 'cookie-policy' ||
                activeTab === 'dmca' ||
                activeTab === 'acceptable-use') && (
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-4">
                    <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                      Compliance Documentation
                    </span>
                    <h2 className="text-2xl font-bold text-white mt-1">
                      {legalTabs.find((t) => t.id === activeTab)?.label}
                    </h2>
                  </div>
                  <p>
                    World Dollar Quest maintains rigorous digital governance, respecting international copyright standards (DMCA), fair use provisions, and web accessibility best practices. For specific inquiries regarding this policy, contact legal@worlddollar.quest.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
