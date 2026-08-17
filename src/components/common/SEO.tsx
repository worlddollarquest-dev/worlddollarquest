import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  type?: 'website' | 'article' | 'product';
  jsonLd?: Record<string, any>;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonicalUrl,
  ogImage,
  type = 'website',
  jsonLd,
}) => {
  const { siteSettings } = useApp();

  const finalTitle = title
    ? `${title} | ${siteSettings.siteName}`
    : siteSettings.defaultSeoTitle;
  const finalDescription = description || siteSettings.defaultSeoDescription;
  const finalImage = ogImage || siteSettings.ogImageUrl;

  useEffect(() => {
    // Set document title
    document.title = finalTitle;

    // Helper to update or create meta tags
    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMeta('description', finalDescription);
    setMeta('og:title', finalTitle, true);
    setMeta('og:description', finalDescription, true);
    setMeta('og:image', finalImage, true);
    setMeta('og:type', type, true);
    setMeta('twitter:title', finalTitle);
    setMeta('twitter:description', finalDescription);
    setMeta('twitter:image', finalImage);

    // Canonical URL
    let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonicalUrl) {
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.setAttribute('href', canonicalUrl);
    }

    // JSON-LD Structured Data
    let scriptJsonLd = document.getElementById('json-ld-schema') as HTMLScriptElement;
    if (jsonLd) {
      if (!scriptJsonLd) {
        scriptJsonLd = document.createElement('script');
        scriptJsonLd.id = 'json-ld-schema';
        scriptJsonLd.type = 'application/ld+json';
        document.head.appendChild(scriptJsonLd);
      }
      scriptJsonLd.textContent = JSON.stringify(jsonLd);
    } else if (scriptJsonLd) {
      scriptJsonLd.remove();
    }
  }, [finalTitle, finalDescription, finalImage, canonicalUrl, type, jsonLd]);

  return null;
};
