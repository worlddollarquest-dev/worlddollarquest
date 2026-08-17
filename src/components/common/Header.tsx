import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Search,
  Sparkles,
  Compass,
  Shield,
  User,
  LogOut,
  ChevronDown,
  Wrench,
  Package,
  BookOpen,
  DollarSign,
  TrendingUp,
  ShoppingBag,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useCart } from '../../context/CartContext';
import { GlobalSearchModal } from './GlobalSearchModal';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { user, isAdmin, logout } = useAuth();
  const { siteSettings } = useApp();
  const { itemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Free Tools', path: '/free-tools', icon: Wrench, badge: 'Popular' },
    { label: 'Digital Products', path: '/digital-products', icon: Package },
    { label: 'AI Resources', path: '/ai-resources', icon: Sparkles },
    { label: 'Make Money Online', path: '/make-money-online', icon: DollarSign },
    { label: 'Freelancing', path: '/freelancing', icon: TrendingUp },
    { label: 'Services', path: '/services' },
    { label: 'Blog', path: '/blog', icon: BookOpen },
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <>
      <header
        id="main-header"
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-[#050816]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/40'
            : 'bg-[#050816]/75 backdrop-blur-md border-b border-white/5'
        }`}
      >
        {/* Optional Announcement Banner */}
        {siteSettings.announcementBanner.enabled && (
          <div className="bg-gradient-to-r from-[#080B1A] via-indigo-950/90 to-[#080B1A] border-b border-indigo-500/30 px-4 py-2 text-center text-xs text-slate-200 flex items-center justify-center gap-2 shadow-inner">
            <span className="inline-block w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
            <span className="font-medium">{siteSettings.announcementBanner.text}</span>
            <button
              type="button"
              onClick={() => handleNavClick(siteSettings.announcementBanner.linkUrl)}
              className="text-cyan-400 font-bold hover:underline flex items-center gap-1"
            >
              {siteSettings.announcementBanner.linkText} &rarr;
            </button>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleNavClick('/')}
                className="flex items-center gap-2.5 text-left group focus:outline-none"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#4F46FF] via-[#8B5CF6] to-[#EC4899] flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform shimmer-sweep">
                  <span className="text-xl tracking-tighter">$</span>
                </div>
                <div>
                  <span className="font-extrabold tracking-tight text-base sm:text-lg text-white group-hover:text-cyan-300 transition-colors">
                    {siteSettings.logoText}
                  </span>
                  <p className="text-[10px] text-gradient-secondary font-bold uppercase tracking-wider">
                    {siteSettings.tagline}
                  </p>
                </div>
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = currentPath === link.path;
                return (
                  <button
                    key={link.path}
                    type="button"
                    onClick={() => handleNavClick(link.path)}
                    className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'text-teal-300 bg-slate-800/80 font-semibold shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                    }`}
                  >
                    {link.label}
                    {link.badge && (
                      <span className="ml-1.5 px-1.5 py-0.2 text-[9px] font-bold uppercase rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                        {link.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Action Controls */}
            <div className="hidden sm:flex items-center space-x-2.5">
              {/* Global Search Button */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors focus:outline-none"
                aria-label="Search World Dollar Quest"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Search...</span>
                <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] text-slate-500 bg-slate-800 rounded border border-slate-700">
                  ⌘K
                </kbd>
              </button>

              {/* Cart Button */}
              <button
                type="button"
                onClick={() => handleNavClick('/cart')}
                className="relative p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                title="View Cart"
                aria-label="View Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4 text-teal-400" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full bg-teal-500 text-slate-950 font-black text-[10px] flex items-center justify-center shadow">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Quest Tracker Pill */}
              {user && (
                <button
                  type="button"
                  onClick={() => handleNavClick('/quest-dashboard')}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-teal-950/50 hover:bg-teal-900/50 border border-teal-500/30 text-teal-300 text-xs transition-colors"
                  title="Your Quest XP & Level"
                >
                  <Compass className="w-3.5 h-3.5 text-teal-400 animate-spin-slow" />
                  <span className="font-semibold">Lvl {user.level}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-200">
                    {user.xp} XP
                  </span>
                </button>
              )}

              {/* User / Auth / Admin Menu */}
              {isAdmin ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/80 border border-indigo-500/40 text-indigo-200 text-xs font-semibold hover:bg-indigo-900 transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Admin Mode</span>
                    <ChevronDown className="w-3 h-3 ml-0.5" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-1 z-50">
                      <button
                        type="button"
                        onClick={() => handleNavClick('/admin')}
                        className="w-full px-4 py-2 text-left text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                      >
                        <Shield className="w-3.5 h-3.5 text-indigo-400" />
                        Admin Dashboard
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                          handleNavClick('/');
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-rose-400 hover:bg-slate-800 flex items-center gap-2 border-t border-slate-800"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Exit Admin
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleNavClick('/login')}
                    className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavClick('/quest-dashboard')}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-teal-500 text-slate-950 hover:bg-teal-400 shadow-md shadow-teal-500/20 transition-colors"
                  >
                    Start Quest
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center gap-2 xl:hidden">
              <button
                type="button"
                onClick={() => handleNavClick('/cart')}
                className="relative p-2 text-slate-300 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
                aria-label="Cart"
              >
                <ShoppingBag className="w-4 h-4 text-teal-400" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-teal-500 text-slate-950 font-black text-[9px] flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="p-2 text-slate-400 hover:text-white rounded-lg"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-slate-950/98 border-b border-slate-800 px-4 pt-3 pb-6 space-y-2">
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-800">
              {navLinks.map((link) => {
                const isActive = currentPath === link.path;
                return (
                  <button
                    key={link.path}
                    type="button"
                    onClick={() => handleNavClick(link.path)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium text-left ${
                      isActive
                        ? 'bg-slate-800 text-teal-300 font-semibold'
                        : 'text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    {link.icon && <link.icon className="w-3.5 h-3.5 text-teal-400 shrink-0" />}
                    <span className="truncate">{link.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleNavClick('/quest-dashboard')}
                className="w-full py-2.5 px-4 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4" />
                Quest Progression Hub (Level {user?.level || 1} • {user?.xp || 0} XP)
              </button>

              <div className="grid grid-cols-2 gap-2 pt-2">
                {isAdmin ? (
                  <button
                    type="button"
                    onClick={() => handleNavClick('/admin')}
                    className="w-full py-2 px-3 text-center text-xs font-medium text-indigo-300 bg-indigo-950/50 border border-indigo-500/30 rounded-lg"
                  >
                    Admin Dashboard
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleNavClick('/login')}
                    className="w-full py-2 px-3 text-center text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded-lg"
                  >
                    Sign In / Admin
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleNavClick('/free-tools')}
                  className="w-full py-2 px-3 text-center text-xs font-semibold text-slate-950 bg-teal-400 rounded-lg"
                >
                  Explore Tools
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={handleNavClick}
      />
    </>
  );
};
