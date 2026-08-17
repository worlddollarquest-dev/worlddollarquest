import React, { useState } from 'react';
import {
  Mail,
  Send,
  MessageSquare,
  ShieldCheck,
  HelpCircle,
  Clock,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { SEO } from '../components/common/SEO';

interface ContactPageProps {
  onNavigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const { addContactMessage, siteSettings } = useApp();
  const { success } = useToast();
  const { completeQuest } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('General Inquiry');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Are the online tools really 100% free forever?',
      a: 'Yes. All utilities in our Free Online Tools suite (AI Prompt Generator, Business Naming, Rate Calculator, QR Codes, Word Counter) run in your browser with zero paywalls, subscriptions, or credit card requirements.',
    },
    {
      q: 'How do digital product updates and licenses work?',
      a: 'When you acquire a digital product or Notion template on World Dollar Quest, you receive immediate digital file access plus lifetime access to future framework updates.',
    },
    {
      q: 'Can I pitch an article or partnership to World Dollar Quest?',
      a: 'Absolutely. Select "Partnership & Editorial" in the contact form below and include a summary of your proposed teardown or technical guide.',
    },
    {
      q: 'What is the standard response time for inquiries?',
      a: 'Our support and editorial desk responds to all inquiries within 24 to 48 business hours.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setSubmitting(true);
    setTimeout(() => {
      addContactMessage({
        name,
        email,
        category,
        subject: subject || `${category} from ${name}`,
        message,
      });
      setSubmitting(false);
      setSubmitted(true);
      success('Message Transmitted!', 'Our team has received your communication.');
      completeQuest('quest-05');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 900);
  };

  return (
    <>
      <SEO
        title="Contact Desk & Community Support"
        description="Get in touch with the World Dollar Quest team for partnerships, digital product support, and editorial inquiries."
      />

      <div className="min-h-screen bg-slate-950 pb-24">
        {/* Header Hero */}
        <section className="pt-12 pb-14 border-b border-slate-900 bg-gradient-to-b from-slate-950 via-[#0a0f1d] to-[#090d16]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
                <Mail className="w-3.5 h-3.5" />
                <span>Direct Support & Editorial Desk</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Get in Touch with World Dollar Quest
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Have a question about our free tools, digital products, consulting services, or partnership opportunities? Reach out directly below.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content: Form + FAQs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Contact Form Column */}
            <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-white">Send Us a Direct Message</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    We review all messages within 24 business hours.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <Clock className="w-4 h-4 text-teal-400" />
                </div>
              </div>

              {submitted ? (
                <div className="p-8 text-center bg-slate-950 rounded-2xl border border-emerald-500/30 space-y-3">
                  <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h3 className="text-lg font-bold text-white">Message Successfully Sent</h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out! A ticket has been logged in our system and an editor will follow up at your provided email address.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-3 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Jordan Smith"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-teal-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jordan@example.com"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-teal-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-teal-400"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Digital Product Support">Digital Product Support</option>
                        <option value="Partnership & Editorial">Partnership & Editorial</option>
                        <option value="Advisory Services">Advisory Services</option>
                        <option value="Tool Feedback">Tool Feedback & Suggestions</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Brief summary..."
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-teal-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Your Message *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please provide details about your inquiry or feedback..."
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-teal-400 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:bg-slate-800 text-slate-950 font-extrabold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Transmitting Message...' : 'Send Message'}</span>
                  </button>
                </form>
              )}
            </div>

            {/* Right Column: Desk Info & FAQs */}
            <div className="lg:col-span-5 space-y-6">
              {/* Quick Info Box */}
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider text-teal-400">
                  Official Communication Channels
                </h3>
                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">General Inquiries:</p>
                      <p className="text-slate-400">{siteSettings.contactEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Legal & Privacy:</p>
                      <p className="text-slate-400">privacy@worlddollar.quest</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Accordion */}
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-teal-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Frequently Asked Questions
                  </h3>
                </div>

                <div className="space-y-2">
                  {faqs.map((faq, index) => {
                    const isOpen = openFaqIndex === index;
                    return (
                      <div
                        key={index}
                        className="rounded-2xl bg-slate-950 border border-slate-800/80 overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                          className="w-full p-3.5 text-left flex items-center justify-between text-xs font-semibold text-slate-200 hover:text-white"
                        >
                          <span>{faq.q}</span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                              isOpen ? 'rotate-180 text-teal-400' : ''
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-3.5 pb-3.5 text-[11px] text-slate-400 leading-relaxed border-t border-slate-900 pt-2">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
