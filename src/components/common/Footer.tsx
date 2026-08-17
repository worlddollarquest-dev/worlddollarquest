import React, { useState } from 'react';
import { Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const { siteSettings, subscribeNewsletter } = useApp();
  const { success, error } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      error('Please enter a valid email address.');
      return;
    }
    const res = subscribeNewsletter(email, 'footer_form');
    if (res) {
      success('Subscribed!', 'You will receive our practical digital earning guides.');
      setEmail('');
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer id="main-footer" className="bg-slate-950 border-t border-slate-900 text-slate-400 text-sm">
      {/* Top Newsletter Strip */}
      <div className="border-b border-slate-900/80 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="max-w-xl text-center lg:text-left">
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Get smarter digital opportunities in your inbox.
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Zero spam. Pure practical guides on AI workflows, tools, and realistic freelance earning strategies.
              </p>
            </div>
            <form
              onSubmit={handleSubscribe}
              className="w-full lg:w-auto flex flex-col sm:flex-row gap-2 max-w-md"
            >
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold rounded-xl text-sm transition-colors shrink-0 flex items-center justify-center gap-1.5 shadow-md shadow-teal-500/10"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-slate-950 font-black">
                $
              </div>
              <span className="font-extrabold tracking-tight text-lg text-white">
                {siteSettings.logoText}
              </span>
            </div>
            <p className="text-teal-400 text-xs font-semibold uppercase tracking-wider">
              {siteSettings.tagline}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              World Dollar Quest is an online platform helping users discover practical ways to learn digital skills, work online, use AI tools, and build sustainable online income opportunities.
            </p>
            <div className="pt-2 text-xs text-slate-500 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-teal-400" />
                <span>{siteSettings.primaryEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>Phase 1 Verified Foundation</span>
              </div>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Explore</p>
            <ul className="space-y-2 text-xs">
              {[
                { label: 'Free Tools', path: '/free-tools' },
                { label: 'AI Resources', path: '/ai-resources' },
                { label: 'Digital Products', path: '/digital-products' },
                { label: 'Freelancing', path: '/freelancing' },
                { label: 'Make Money Online', path: '/make-money-online' },
                { label: 'Quest Progression', path: '/quest-dashboard' },
              ].map((item) => (
                <li key={item.path}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.path)}
                    className="hover:text-teal-300 transition-colors text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Platform</p>
            <ul className="space-y-2 text-xs">
              {[
                { label: 'About Mission', path: '/about' },
                { label: 'Contact Support', path: '/contact' },
                { label: 'Advisory Services', path: '/services' },
                { label: 'Blog & Articles', path: '/blog' },
                { label: 'Admin Login', path: '/admin/login' },
              ].map((item) => (
                <li key={item.path}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.path)}
                    className="hover:text-teal-300 transition-colors text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Legal Policies</p>
            <ul className="space-y-1.5 text-xs">
              {[
                { label: 'Privacy Policy', path: '/privacy-policy' },
                { label: 'Terms & Conditions', path: '/terms' },
                { label: 'Earnings Disclaimer', path: '/earnings-disclaimer' },
                { label: 'Affiliate Disclosure', path: '/affiliate-disclosure' },
                { label: 'Disclaimer', path: '/disclaimer' },
                { label: 'Cookie Policy', path: '/cookie-policy' },
                { label: 'Refund Policy', path: '/refund-policy' },
                { label: 'DMCA Policy', path: '/dmca' },
                { label: 'Acceptable Use', path: '/acceptable-use' },
              ].map((item) => (
                <li key={item.path}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.path)}
                    className="hover:text-teal-300 transition-colors text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Legal Disclaimer Reminder */}
        <div className="mt-12 pt-8 border-t border-slate-900/90 text-[11px] text-slate-500 space-y-3 leading-relaxed">
          <p>
            <strong className="text-slate-400">Earnings & Financial Disclaimer:</strong> World Dollar Quest provides educational guides, productivity tools, and digital templates. Nothing on this website constitutes financial, legal, or investment advice. Online earnings depend entirely on individual skill, market demand, work ethic, and economic factors. We make zero guarantee of revenue, employment, or specific financial outcomes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p>
              © {currentYear} {siteSettings.siteName}. All rights reserved. Built for independent digital creators.
            </p>
            <div className="flex items-center gap-4 text-xs">
              <button
                type="button"
                onClick={() => onNavigate('/earnings-disclaimer')}
                className="hover:underline text-slate-400"
              >
                No Income Guarantees
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => onNavigate('/affiliate-disclosure')}
                className="hover:underline text-slate-400"
              >
                Affiliate Disclosure
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
