/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { PWAInstallPrompt } from './components/common/PWAInstallPrompt';

import { HomePage } from './pages/HomePage';
import { FreeToolsPage } from './pages/FreeToolsPage';
import { DigitalProductsPage } from './pages/DigitalProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { CheckoutSuccessPage } from './pages/CheckoutSuccessPage';
import { AIResourcesPage } from './pages/AIResourcesPage';
import { MakeMoneyOnlinePage } from './pages/MakeMoneyOnlinePage';
import { FreelancingPage } from './pages/FreelancingPage';
import { ServicesPage } from './pages/ServicesPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { LegalPage } from './pages/LegalPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { QuestDashboardPage } from './pages/QuestDashboardPage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';

function MainApp() {
  const [currentPath, setCurrentPath] = useState<string>(
    window.location.pathname || '/'
  );
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);

  // Sync state with browser history (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Smooth scroll to top on navigation
  const navigate = (path: string) => {
    // If external link or hash on same page
    if (path.startsWith('http')) {
      window.open(path, '_blank');
      return;
    }

    if (path.includes('#')) {
      const [basePath, hash] = path.split('#');
      if (basePath && basePath !== currentPath) {
        window.history.pushState({}, '', path);
        setCurrentPath(basePath);
      }
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }

    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route Dispatcher
  const renderCurrentView = () => {
    // Exact paths
    if (currentPath === '/' || currentPath === '') {
      return <HomePage onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/free-tools')) {
      // Check query or slug parameter e.g. /free-tools?tool=rate-calc or /free-tools/rate-calc
      const urlParams = new URLSearchParams(window.location.search);
      const toolParam = urlParams.get('tool') || currentPath.split('/')[2] || 'prompt-gen';
      return <FreeToolsPage initialToolId={toolParam} onNavigate={navigate} />;
    }

    if (currentPath === '/cart') {
      return <CartPage onNavigate={navigate} />;
    }

    if (currentPath === '/checkout') {
      return <CheckoutPage onNavigate={navigate} />;
    }

    if (currentPath === '/checkout/success' || currentPath.startsWith('/checkout/success') || currentPath === '/checkout-success' || currentPath.startsWith('/checkout-success')) {
      return <CheckoutSuccessPage onNavigate={navigate} />;
    }

    if (currentPath === '/digital-products') {
      return <DigitalProductsPage onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/digital-products/')) {
      const slug = currentPath.replace('/digital-products/', '').replace('/', '');
      return <ProductDetailPage slug={slug} onNavigate={navigate} />;
    }

    if (currentPath === '/ai-resources') {
      return <AIResourcesPage onNavigate={navigate} />;
    }

    if (currentPath === '/make-money-online') {
      return <MakeMoneyOnlinePage onNavigate={navigate} />;
    }

    if (currentPath === '/freelancing') {
      return <FreelancingPage onNavigate={navigate} />;
    }

    if (currentPath === '/services') {
      return <ServicesPage onNavigate={navigate} />;
    }

    if (currentPath === '/blog') {
      return <BlogPage onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/blog/')) {
      const slug = currentPath.replace('/blog/', '').replace('/', '');
      return <BlogPostPage slug={slug} onNavigate={navigate} />;
    }

    if (
      currentPath === '/privacy-policy' ||
      currentPath === '/terms' ||
      currentPath === '/earnings-disclaimer' ||
      currentPath === '/affiliate-disclosure' ||
      currentPath === '/disclaimer' ||
      currentPath === '/cookie-policy' ||
      currentPath === '/refund-policy' ||
      currentPath === '/dmca' ||
      currentPath === '/acceptable-use'
    ) {
      const tab = currentPath.replace('/', '');
      return <LegalPage initialTab={tab} onNavigate={navigate} />;
    }

    if (currentPath === '/about') {
      return <AboutPage onNavigate={navigate} />;
    }

    if (currentPath === '/contact') {
      return <ContactPage onNavigate={navigate} />;
    }

    if (currentPath === '/quest-dashboard') {
      return <QuestDashboardPage onNavigate={navigate} />;
    }

    if (currentPath === '/admin') {
      return <AdminPage onNavigate={navigate} />;
    }

    if (currentPath === '/login' || currentPath === '/admin/login') {
      return <LoginPage onNavigate={navigate} />;
    }

    // Fallback to Home
    return <HomePage onNavigate={navigate} />;
  };

  const isStandaloneAdmin = currentPath === '/admin';

  return (
    <div className="flex flex-col min-h-screen bg-[#090d16] text-slate-100 antialiased selection:bg-teal-500 selection:text-slate-950 font-sans">
      {!isStandaloneAdmin && (
        <Header
          currentPath={currentPath}
          onNavigate={navigate}
          onOpenSearch={() => setSearchModalOpen(true)}
        />
      )}

      <main className="flex-1 w-full">
        {renderCurrentView()}
      </main>

      {!isStandaloneAdmin && (
        <Footer onNavigate={navigate} />
      )}

      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onNavigate={navigate}
      />

      <PWAInstallPrompt />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <AuthProvider>
          <CartProvider>
            <MainApp />
          </CartProvider>
        </AuthProvider>
      </AppProvider>
    </ToastProvider>
  );
}
