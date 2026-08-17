import React, { useState } from 'react';
import {
  Briefcase,
  Check,
  Clock,
  ArrowRight,
  ShieldCheck,
  Send,
  Calendar,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { SEO } from '../components/common/SEO';

interface ServicesPageProps {
  onNavigate: (path: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  const { services, addContactMessage } = useApp();
  const { success } = useToast();
  const { completeQuest } = useAuth();

  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !details) return;

    setSubmitting(true);
    setTimeout(() => {
      addContactMessage({
        name,
        email,
        category: 'Services',
        subject: `Service Inquiry: ${selectedService || 'General Advisory'}`,
        message: details,
      });
      setSubmitting(false);
      setSubmitted(true);
      success('Inquiry Submitted!', 'Our advisory team will reply within 24 business hours.');
      completeQuest('quest-05');
      setName('');
      setEmail('');
      setDetails('');
    }, 1000);
  };

  return (
    <>
      <SEO
        title="Advisory & Implementation Services"
        description="Bespoke workflow audits, digital product strategy, and 1-on-1 freelance systems coaching with the World Dollar Quest advisory team."
      />

      <div className="min-h-screen bg-slate-950 pb-20">
        {/* Hero Header */}
        <section className="pt-12 pb-14 border-b border-slate-900 bg-gradient-to-b from-slate-950 via-[#0a0f1d] to-[#090d16]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Direct 1-on-1 Advisory & Systems Consulting</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Specialized Services & Advisory
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Work directly with experienced operators to audit your operational workflows, refine digital product architectures, or structure scalable freelance client acquisition pipelines.
              </p>
            </div>
          </div>
        </section>

        {/* Services Cards */}
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {services.map((svc) => (
              <div
                key={svc.id}
                className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800/90 shadow-xl flex flex-col justify-between space-y-6 hover:border-blue-500/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                      {svc.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{svc.turnaroundTime}</span>
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-white">{svc.name}</h2>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{svc.description}</p>

                  {/* Features */}
                  <div className="mt-6 space-y-2 pt-4 border-t border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Deliverables:
                    </span>
                    {svc.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                        <Check className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-base font-black text-white font-mono">{svc.pricing}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedService(svc.name);
                      setSubmitted(false);
                      const el = document.getElementById('inquiry-form');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>Request Booking</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Consultation Request Form */}
          <div
            id="inquiry-form"
            className="max-w-3xl mx-auto p-8 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6"
          >
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-teal-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Step 1 of 2: Intake Submission</span>
              </div>
              <h2 className="text-2xl font-bold text-white">
                {selectedService ? `Request: ${selectedService}` : 'Book an Advisory Session'}
              </h2>
              <p className="text-xs text-slate-400">
                Provide a brief summary of your project or business bottleneck to receive a scoped agenda and calendar invite.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 text-center bg-slate-950 rounded-2xl border border-emerald-500/30 space-y-3">
                <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">Inquiry Received</h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Thank you! An advisor will review your project parameters and reply with availability and preparation materials.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-3 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-teal-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Business Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@company.com"
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-teal-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Project Goals / Key Bottlenecks
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Describe your current tech stack, target audience, or specific challenges..."
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-teal-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:bg-slate-800 text-slate-950 font-extrabold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Submitting Request...' : 'Submit Advisory Request'}</span>
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </>
  );
};
