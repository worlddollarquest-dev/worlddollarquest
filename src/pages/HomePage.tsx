import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { ValueStrip } from '../components/home/ValueStrip';
import { ExploreCards } from '../components/home/ExploreCards';
import { FeaturedToolsSection } from '../components/home/FeaturedToolsSection';
import { DigitalProductsSection } from '../components/home/DigitalProductsSection';
import { HowItWorksSection } from '../components/home/HowItWorksSection';
import { MakeMoneyOnlineSection } from '../components/home/MakeMoneyOnlineSection';
import { AIResourcesSection } from '../components/home/AIResourcesSection';
import { SEO } from '../components/common/SEO';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <>
      <SEO
        title="World Dollar Quest | Learn, Work & Earn Online with AI & Tools"
        description="Discover practical tools, AI prompts, curated digital products, freelancing blueprints, and realistic online earning resources to build your digital future."
      />
      <div className="w-full">
        <HeroSection onNavigate={onNavigate} />
        <ValueStrip onNavigate={onNavigate} />
        <ExploreCards onNavigate={onNavigate} />
        <FeaturedToolsSection onNavigate={onNavigate} />
        <HowItWorksSection onNavigate={onNavigate} />
        <DigitalProductsSection onNavigate={onNavigate} />
        <MakeMoneyOnlineSection onNavigate={onNavigate} />
        <AIResourcesSection onNavigate={onNavigate} />
      </div>
    </>
  );
};
