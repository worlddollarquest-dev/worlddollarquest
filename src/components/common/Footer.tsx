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
    <footer id="main-footer" className="bg-[#050816] border-t border-white/10 text-slate-400 text-sm">
      {/* Top Newsletter Strip */}
      <div className="border-b border-white/10 bg-[#080B1A]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center lg:text-left space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Get smarter digital opportunities in your inbox.
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Zero spam. Pure practical guides on AI workflows, tools, and realistic freelance earning strategies.
              </p>
            </div>
            <form
              onSubmit={handleSubscribe}
              className="w-full lg:w-auto flex flex-col sm:flex-row gap-3 max-w-md"
            >
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4.5 py-3 bg-[#050816] border border-white/15 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm shadow-inner"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 btn-premium text-xs font-bold shrink-0 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4F46FF] to-[#EC4899] flex items-center justify-center text-white font-black shadow-md">
                $
              </div>
              <span className="font-extrabold tracking-tight text-lg text-white">
                {siteSettings.logoText}
              </span>
            </div>
            <p className="text-cyan-400 text-xs font-bold uppercase tracking-wider">
              {siteSettings.tagline}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              World Dollar Quest is an online platform helping users discover practical ways to learn digital skills, work online, use AI tools, and build sustainable online income opportunities.
            </p>
            <div className="pt-2 text-xs text-slate-400 flex flex-col gap-1.5 font-medium">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>{siteSettings.primaryEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Phase 1 Verified Foundation</span>
              </div>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-widest">Explore</p>
            <ul className="space-y-2 text-xs font-medium">
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
                    className="text-slate-400 hover:text-cyan-300 transition-colors text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-widest">Platform</p>
            <ul className="space-y-2 text-xs font-medium">
              {[
                { label: 'About Mission', path: '/about' },
                { label: 'Contact Support', path: '/contact' },
                { label: 'Advisory Services', path: '/services' },
                { label: 'Blog & Articles', path: '/blog' },
                { label: 'Admin Login', path: '/admin' },
              ].map((item) => (
                <li key={item.path}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.path)}
                    className="text-slate-400 hover:text-cyan-300 transition-colors text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-widest">Legal & Policy</p>
            <ul className="space-y-2 text-xs font-medium">
              {[
                { label: 'Privacy Policy', path: '/privacy-policy' },
                { label: 'Terms of Service', path: '/terms' },
                { label: 'Earnings Disclaimer', path: '/earnings-disclaimer' },
                { label: 'Affiliate Disclosure', path: '/affiliate-disclosure' },
                { label: 'Refund Policy', path: '/refund-policy' },
              ].map((item) => (
                <li key={item.path}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.path)}
                    className="text-slate-400 hover:text-cyan-300 transition-colors text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; {currentYear} {siteSettings.logoText}. All rights reserved. Built for modern digital builders.</p>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => onNavigate('/privacy-policy')} className="hover:text-slate-300">Privacy</button>
            <button type="button" onClick={() => onNavigate('/terms')} className="hover:text-slate-300">Terms</button>
            <button type="button" onClick={() => onNavigate('/contact')} className="hover:text-slate-300">Support</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
