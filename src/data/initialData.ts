import {
  Product,
  Category,
  FreeTool,
  BlogPost,
  ServiceItem,
  LegalPage,
  SiteSettings,
  Quest,
  Badge,
} from '../types';

export const initialSiteSettings: SiteSettings = {
  siteName: 'World Dollar Quest',
  tagline: 'Learn • Work • Earn',
  logoText: 'WORLD DOLLAR QUEST',
  primaryEmail: 'contact@worlddollar.quest',
  contactEmail: 'support@worlddollar.quest',
  socialLinks: {
    twitter: 'https://twitter.com/worlddollarquest',
    github: 'https://github.com/worlddollarquest',
    linkedin: 'https://linkedin.com/company/worlddollarquest',
    youtube: 'https://youtube.com/@worlddollarquest',
    telegram: 'https://t.me/worlddollarquest',
  },
  defaultSeoTitle: 'World Dollar Quest | Learn, Work & Earn Online with AI & Tools',
  defaultSeoDescription: 'Discover practical tools, AI prompts, curated digital products, freelancing blueprints, and realistic online earning resources to build your digital future.',
  ogImageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
  footerCopyright: '© World Dollar Quest. All rights reserved.',
  maintenanceMode: false,
  announcementBanner: {
    enabled: true,
    text: '🚀 Phase 1 is live! Explore our free tools suite and start your digital earning quest today.',
    linkUrl: '/free-tools',
    linkText: 'Explore Tools',
  },
};

export const initialCategories: Category[] = [
  {
    id: 'cat-prod-1',
    name: 'Freelance & Agency Kits',
    slug: 'freelance-agency-kits',
    description: 'Templates, proposals, contracts, and workflow sheets for freelancers.',
    type: 'product',
    status: 'active',
  },
  {
    id: 'cat-prod-2',
    name: 'AI Prompt Vaults',
    slug: 'ai-prompt-vaults',
    description: 'Battle-tested prompts for marketing, copywriting, coding, and workflow automation.',
    type: 'product',
    status: 'active',
  },
  {
    id: 'cat-prod-3',
    name: 'Productivity Systems',
    slug: 'productivity-systems',
    description: 'Digital planners, Notion dashboards, and standard operating procedures.',
    type: 'product',
    status: 'active',
  },
  {
    id: 'cat-blog-1',
    name: 'Freelancing & Remote Work',
    slug: 'freelancing-remote-work',
    description: 'Actionable strategies for landing global clients and pricing digital skills.',
    type: 'blog',
    status: 'active',
  },
  {
    id: 'cat-blog-2',
    name: 'AI & Automation',
    slug: 'ai-automation',
    description: 'Leveraging modern AI tools to accelerate work output and client deliverables.',
    type: 'blog',
    status: 'active',
  },
  {
    id: 'cat-blog-3',
    name: 'Digital Products & Publishing',
    slug: 'digital-products-publishing',
    description: 'Building, packaging, and distributing high-value downloadable resources.',
    type: 'blog',
    status: 'active',
  },
];

export const initialProducts: Product[] = [
  {
    id: 'prod-001',
    name: 'Freelance Client Acquisition Playbook',
    slug: 'freelance-client-acquisition-playbook',
    shortDescription: 'Complete operating system with outreach templates, proposal blueprints, and discovery call scripts.',
    fullDescription: 'Designed for independent professionals, developers, writers, and designers. This package gives you battle-tested email cold outreach sequences, contract templates, discovery call qualifying frameworks, and value-based pricing calculators.',
    categoryId: 'cat-prod-1',
    price: 39,
    salePrice: 24,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    productType: 'template',
    downloadFileUrl: 'https://worlddollar.quest/downloads/freelance-playbook-v1.zip',
    features: [
      '18 High-Conversion Cold Email & DM Scripts',
      'Bulletproof Independent Contractor Agreement Template',
      'Value-Based Pricing Estimator Spreadsheet',
      'Client Onboarding & Intake Notion Workflow',
      'Lifetime updates & community format additions',
    ],
    tags: ['Freelancing', 'Client Acquisition', 'Proposals', 'Contracts'],
    status: 'published',
    featured: true,
    rating: 4.9,
    salesCount: 142,
    createdAt: '2026-03-01',
  },
  {
    id: 'prod-002',
    name: '500+ Masterclass AI Prompt Arsenal',
    slug: '500-masterclass-ai-prompt-arsenal',
    shortDescription: 'Categorized prompts for SEO copywriting, sales funnels, Python automation, and client research.',
    fullDescription: 'Stop getting generic responses from AI models. This structured prompt database includes chain-of-thought prompts, role framing prompts, and multi-step execution recipes tested for Claude, Gemini, and GPT-4.',
    categoryId: 'cat-prod-2',
    price: 29,
    salePrice: 19,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    productType: 'prompt-pack',
    downloadFileUrl: 'https://worlddollar.quest/downloads/ai-prompt-arsenal.zip',
    features: [
      '500+ Engineered Prompts with input placeholders',
      'Categories: Copywriting, Lead Gen, Social, Coding, Strategy',
      'Markdown, CSV, and Notion workspace formats included',
      'Prompt chaining flowcharts for complex tasks',
    ],
    tags: ['AI Prompts', 'Productivity', 'Copywriting', 'Automation'],
    status: 'published',
    featured: true,
    rating: 4.8,
    salesCount: 310,
    createdAt: '2026-03-10',
  },
  {
    id: 'prod-003',
    name: 'Digital Solopreneur Notion OS',
    slug: 'digital-solopreneur-notion-os',
    shortDescription: 'All-in-one workspace for client CRM, project pipelines, financial tracking, and digital asset management.',
    fullDescription: 'Consolidate your entire business into one streamlined Notion operating system. Manage clients, track deliverables, log daily billable hours, record invoices, and store branding guidelines in a clean, connected workspace.',
    categoryId: 'cat-prod-3',
    price: 49,
    salePrice: 35,
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    productType: 'template',
    downloadFileUrl: 'https://worlddollar.quest/downloads/solopreneur-os.zip',
    features: [
      'Connected Client CRM & Project Tracker',
      'Revenue, Expense & Cashflow Forecast Tracker',
      'Digital Product Asset Storage & License Tracker',
      'Content Calendar & Social Media Queue',
    ],
    tags: ['Notion', 'Productivity', 'Solopreneur', 'CRM'],
    status: 'published',
    featured: true,
    rating: 5.0,
    salesCount: 89,
    createdAt: '2026-03-18',
  },
  {
    id: 'prod-004',
    name: 'Affiliate Content Site Blueprint',
    slug: 'affiliate-content-site-blueprint',
    shortDescription: 'Step-by-step framework for keyword research, honest product comparison reviews, and compliance.',
    fullDescription: 'A practical, ethical guide to building useful informational websites that generate legitimate affiliate commissions. Includes content structure templates, comparison table layouts, and compliance checklists.',
    categoryId: 'cat-prod-1',
    price: 34,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    productType: 'ebook',
    downloadFileUrl: 'https://worlddollar.quest/downloads/affiliate-blueprint.pdf',
    features: [
      'Ethical affiliate disclosure templates and placement guidelines',
      'High-intent commercial keyword discovery system',
      'Product teardown and comparison framework',
      'Conversion rate optimization audit checklist',
    ],
    tags: ['Affiliate Marketing', 'Content Strategy', 'SEO'],
    status: 'published',
    featured: false,
    rating: 4.7,
    salesCount: 64,
    createdAt: '2026-03-22',
  },
];

export const initialFreeTools: FreeTool[] = [
  {
    id: 'tool-ai-prompt',
    name: 'AI Prompt Generator',
    slug: 'ai-prompt-generator',
    description: 'Generate structured, high-performing prompts with customized roles, constraints, and output formats.',
    category: 'AI & Automation',
    icon: 'Sparkles',
    componentId: 'prompt-gen',
    featured: true,
    status: 'active',
    usageCount: 14200,
    badge: 'Popular',
  },
  {
    id: 'tool-biz-name',
    name: 'Business & Project Name Generator',
    slug: 'business-name-generator',
    description: 'Brainstorm creative, professional brand names tailored to your industry, keywords, and style.',
    category: 'Business & Marketing',
    icon: 'Briefcase',
    componentId: 'biz-name-gen',
    featured: true,
    status: 'active',
    usageCount: 8940,
    badge: 'Essential',
  },
  {
    id: 'tool-caption',
    name: 'Social Media Caption Generator',
    slug: 'social-media-caption-generator',
    description: 'Draft engaging hooks, value-packed captions, and relevant hashtags for LinkedIn, X, and Instagram.',
    category: 'Social Media',
    icon: 'MessageSquareShare',
    componentId: 'caption-gen',
    featured: true,
    status: 'active',
    usageCount: 11250,
  },
  {
    id: 'tool-username',
    name: 'Professional Username Generator',
    slug: 'username-generator',
    description: 'Generate clean, memorable handles for professional portfolios, GitHub, and social media platforms.',
    category: 'Social Media',
    icon: 'UserCheck',
    componentId: 'username-gen',
    featured: true,
    status: 'active',
    usageCount: 7600,
  },
  {
    id: 'tool-qr-code',
    name: 'QR Code Generator',
    slug: 'qr-code-generator',
    description: 'Create custom SVG/PNG QR codes for URLs, contact cards, and portfolios with custom colors and error correction.',
    category: 'Productivity',
    icon: 'QrCode',
    componentId: 'qr-gen',
    featured: true,
    status: 'active',
    usageCount: 16800,
    badge: 'Fast',
  },
  {
    id: 'tool-word-counter',
    name: 'Word & Character Counter',
    slug: 'word-counter',
    description: 'Analyze word count, character count, reading time, speaking pace, and keyword density in real-time.',
    category: 'Productivity',
    icon: 'FileText',
    componentId: 'word-counter',
    featured: true,
    status: 'active',
    usageCount: 22400,
    badge: 'Utility',
  },
  {
    id: 'tool-rate-calc',
    name: 'Freelance Rate Calculator',
    slug: 'freelance-rate-calculator',
    description: 'Calculate realistic hourly and project rates based on your monthly income goals, expenses, and billable hours.',
    category: 'Finance',
    icon: 'Calculator',
    componentId: 'rate-calc',
    featured: true,
    status: 'active',
    usageCount: 9350,
    badge: 'Finance',
  },
];

export const initialBlogPosts: BlogPost[] = [
  {
    id: 'post-001',
    title: 'The Realistic Roadmap to Landing Your First $1,000 Freelance Client',
    slug: 'realistic-roadmap-first-freelance-client',
    excerpt: 'Skip the generic advice. Here is a practical, step-by-step breakdown of how to package skills, build a proof-of-work portfolio, and write outbound proposals that get replies.',
    content: `
### Why Most Beginners Struggle with Freelancing

The biggest mistake new freelancers make is attempting to sell general labor rather than a specific solution to an identifiable problem. When you market yourself as "a writer" or "a web developer," you are competing on price against tens of thousands of global applicants.

When you position yourself as someone who "builds fast landing pages for boutique fitness studios" or "writes technical documentation for SaaS founders," your value proposition becomes immediate and tangible.

---

### Step 1: Define Your Specific Offer

Before reaching out to a single prospect, answer three fundamental questions:
1. **Who is your specific target client?** (e.g., Shopify store owners doing $20k-$100k/mo).
2. **What exact bottleneck are you resolving?** (e.g., low mobile checkout conversions).
3. **What is the tangible outcome?** (e.g., improved load speed and a tested single-page checkout flow).

---

### Step 2: Build a Proof-of-Work Portfolio (Without Past Clients)

You do not need years of agency experience to demonstrate capability. Build 2 to 3 self-directed case studies:
- **Teardown & Rebuild**: Take an existing live website or workflow, audit what is slowing it down, and build an optimized alternative.
- **Document the Process**: Share the before-and-after metrics, explain your rationale, and present the final deliverables cleanly on a public link.

---

### Step 3: The 3-Sentence Outbound Pitch

Keep your outbound messages concise, respectful, and focused entirely on the recipient:

> *"Hi [Name], noticed your blog posts on [Topic] are getting solid engagement, but they currently lack structured schema markup for Google Discover.*
>
> *I drafted a quick 2-minute video demonstrating how adding JSON-LD schemas could improve your search snippets: [Link].*
>
> *No worries if your team is already handling this—just wanted to share the insights!"*

Notice there is zero hard selling. You lead with genuine value, identify a concrete opportunity, and demonstrate your competence upfront.

---

### Key Takeaway

Freelance success is not a mystery of luck. It is the predictable outcome of positioning specific skills in front of business owners with specific bottlenecks, backed by transparent proof of execution.
    `,
    featuredImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    categoryId: 'cat-blog-1',
    categoryName: 'Freelancing & Remote Work',
    tags: ['Freelancing', 'Client Acquisition', 'Career', 'Remote Work'],
    author: {
      name: 'Elena Rostova',
      role: 'Editorial Lead',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    publishedDate: '2026-03-12',
    readingTime: '5 min read',
    seoTitle: 'How to Land Your First $1,000 Freelance Client | World Dollar Quest',
    seoDescription: 'A practical, actionable guide to positioning your skills, creating proof-of-work case studies, and pitching high-value clients.',
    status: 'published',
    featured: true,
  },
  {
    id: 'post-002',
    title: 'Practical AI Workflows: How Small Operators Save 15+ Hours Every Week',
    slug: 'practical-ai-workflows-save-time',
    excerpt: 'Cut through the hype. Here are 5 realistic, day-to-day AI workflows for content ideation, customer research, and code refactoring that actually save time.',
    content: `
### Moving Past the AI Hype Cycle

Artificial Intelligence is neither a magic button that generates passive income nor a passing fad. In practical terms, modern large language models serve as high-speed analytical assistants and drafting tools.

The professionals gaining the highest leverage today treat AI not as a content fountain, but as a cognitive amplifier.

---

### Workflow 1: Multi-Perspective Customer Research

Instead of guessing what your target audience worries about, feed publicly available forum discussions, reviews, and survey responses into an LLM with strict role prompts:

- Prompt: *"Analyze these 20 customer reviews for CRM software. Categorize the top 5 friction points, rank them by emotional intensity, and summarize the exact vocabulary users use to describe their frustration."*

This produces deep empathy maps in minutes, allowing you to write marketing copy that speaks the authentic language of your customers.

---

### Workflow 2: Structured Data Extraction & Formatting

Converting unstructured text (meeting notes, interview transcripts, PDF quotes) into structured tables or JSON schemas is an area where AI excels.

---

### Workflow 3: Iterative Code & Formula Troubleshooting

When dealing with complex Excel formulas, Google Sheets regex, or CSS grid bugs, paste the snippet along with the exact error output and ask for step-by-step reasoning before receiving the fixed snippet.

---

### The Golden Rule of AI Workflows

Never publish or ship AI-generated output raw. Always apply human domain expertise, fact-checking, and editorial polish. Your personal judgment and standard of quality remain the ultimate differentiator.
    `,
    featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80',
    categoryId: 'cat-blog-2',
    categoryName: 'AI & Automation',
    tags: ['AI', 'Workflows', 'Productivity', 'Automation'],
    author: {
      name: 'Marcus Vance',
      role: 'Tech & Automation Analyst',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
    publishedDate: '2026-03-20',
    readingTime: '6 min read',
    seoTitle: 'Practical AI Workflows for Solopreneurs | World Dollar Quest',
    seoDescription: 'Discover realistic AI workflows that save hours on research, drafting, and troubleshooting without sacrificing quality.',
    status: 'published',
    featured: true,
  },
  {
    id: 'post-003',
    title: 'The Anatomy of a High-Converting Digital Product: From Idea to Launch',
    slug: 'anatomy-of-a-high-converting-digital-product',
    excerpt: 'Why some digital templates make consistent sales while others gather dust. A comprehensive breakdown of packaging, utility, and distribution.',
    content: `
### Utility is the Ultimate Moat

A successful digital product is not defined by its file size or page count. It is defined by the **speed with which it solves a specific user problem**.

A 3-page checklist that prevents a $500 compliance mistake is infinitely more valuable than a 100-page theoretical ebook that provides no actionable direction.

---

### The 4 Pillars of Product Design

1. **Immediate Implementability**: Can the buyer use this asset within 5 minutes of checkout?
2. **Clear File Structure**: Provide organized folders, clear README files, and clean documentation.
3. **Transparent Deliverables**: State clearly in the preview what is included (file formats, version compatibility, license terms).
4. **Continual Maintenance**: Update templates when underlying platforms (Notion, Figma, Google Docs) roll out updates.

---

### Packaging and Delivery Best Practices

- Include quick-start video walkthroughs where applicable.
- Provide multiple formats (e.g., Notion duplicate link, PDF, CSV).
- Establish clear refund terms to build buyer confidence.
    `,
    featuredImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
    categoryId: 'cat-blog-3',
    categoryName: 'Digital Products & Publishing',
    tags: ['Digital Products', 'Ecommerce', 'Templates', 'Side Hustle'],
    author: {
      name: 'Elena Rostova',
      role: 'Editorial Lead',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    publishedDate: '2026-03-28',
    readingTime: '7 min read',
    seoTitle: 'Building High-Converting Digital Products | World Dollar Quest',
    seoDescription: 'Learn how to package, price, and distribute high-utility digital templates, prompt libraries, and tools.',
    status: 'published',
    featured: false,
  },
];

export const initialServices: ServiceItem[] = [
  {
    id: 'serv-001',
    name: 'Digital Skills & Freelance Advisory',
    slug: 'freelance-advisory',
    description: '1-on-1 strategic review of your portfolio, rate structure, service packaging, and outbound client acquisition channels.',
    priceRange: '$120 - $350',
    features: [
      'Comprehensive portfolio & pitch critique',
      'Customized outbound messaging sequence',
      'Value-based pricing model design',
      '60-minute recorded deep-dive strategy call',
      'Follow-up action checklist and template pack',
    ],
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    featured: true,
    ctaText: 'Book Strategy Session',
    turnaroundTime: '3-5 Business Days',
    targetAudience: 'Early-to-mid career freelancers, consultants, and developers.',
  },
  {
    id: 'serv-002',
    name: 'AI Workflow Integration & Audit',
    slug: 'ai-workflow-integration',
    description: 'Custom implementation of AI-assisted research, content drafting, and internal automation workflows for your business.',
    priceRange: '$450 - $1,200',
    features: [
      'Operational bottleneck assessment',
      'Custom prompt architecture tailored to your brand voice',
      'Notion/Airtable/Zapier integration blueprints',
      'Team training documentation & SOP video guide',
    ],
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    featured: true,
    ctaText: 'Request Workflow Audit',
    turnaroundTime: '7-10 Business Days',
    targetAudience: 'Agencies, creators, and small online business operators.',
  },
  {
    id: 'serv-003',
    name: 'Digital Product Packaging & Launch Review',
    slug: 'digital-product-review',
    description: 'Detailed analysis of your digital product offer, sales page copy, pricing tiers, and post-purchase onboarding flow.',
    priceRange: '$250 - $600',
    features: [
      'Landing page copy and conversion teardown',
      'Customer onboarding & license delivery check',
      'Pricing elasticity and bundle recommendations',
      'SEO and metadata optimization audit',
    ],
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    featured: false,
    ctaText: 'Submit Product for Review',
    turnaroundTime: '4 Business Days',
    targetAudience: 'Digital creators and template authors.',
  },
];

export const initialLegalPages: LegalPage[] = [
  {
    id: 'legal-privacy',
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    lastUpdated: 'August 2026',
    summary: 'This Privacy Policy explains how World Dollar Quest collects, uses, and safeguards information when you visit our website and use our tools.',
    sections: [
      {
        heading: '1. Information We Collect',
        content: 'World Dollar Quest collects information that you provide directly to us (such as your name and email address when contacting us or subscribing to our newsletter) and standard anonymous technical data (such as browser type, operating system, and pages viewed) to optimize platform performance.',
      },
      {
        heading: '2. How We Use Your Information',
        content: 'We use the collected information solely to operate, maintain, and improve our services, respond to inquiries, send requested updates or newsletters, and protect our platform from abuse. We do not sell, rent, or trade your personal information to third parties.',
      },
      {
        heading: '3. Cookies and Local Storage',
        content: 'We utilize standard browser cookies and local storage to store user preferences (such as theme and tool settings) and analyze anonymous aggregate traffic trends. You can configure your browser to reject cookies, though some interactive features may experience reduced functionality.',
      },
      {
        heading: '4. Third-Party Services and Links',
        content: 'Our website may include links to third-party websites or services. World Dollar Quest is not responsible for the privacy practices, policies, or content of external sites. We encourage you to review the privacy statements of any third-party website you visit.',
      },
      {
        heading: '5. Data Security',
        content: 'We implement standard security measures to protect against unauthorized access, alteration, or disclosure of data. However, no internet transmission or electronic storage method is 100% secure.',
      },
      {
        heading: '6. Updates to This Policy',
        content: 'We may update this Privacy Policy periodically. Any modifications will be posted directly on this page with an updated revision date.',
      },
    ],
  },
  {
    id: 'legal-terms',
    slug: 'terms',
    title: 'Terms & Conditions',
    lastUpdated: 'August 2026',
    summary: 'These Terms and Conditions govern your access to and use of World Dollar Quest, its tools, educational resources, and digital products.',
    sections: [
      {
        heading: '1. Acceptance of Terms',
        content: 'By accessing or using World Dollar Quest ("we," "our," or "the Platform"), you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use the Platform.',
      },
      {
        heading: '2. Educational and Informational Purpose Only',
        content: 'All content, tools, articles, templates, guides, and resources provided on World Dollar Quest are strictly for educational and informational purposes. Nothing on this website constitutes legal, financial, tax, or investment advice.',
      },
      {
        heading: '3. Intellectual Property Rights',
        content: 'Unless otherwise stated, all original content, branding, UI designs, code, and editorial materials published on World Dollar Quest are the intellectual property of World Dollar Quest and protected by international copyright and intellectual property laws.',
      },
      {
        heading: '4. User Conduct and Acceptable Use',
        content: 'You agree not to use the platform for any unlawful purpose, attempt to reverse engineer or disrupt platform infrastructure, deploy automated scraping without written consent, or distribute malicious software.',
      },
      {
        heading: '5. Limitation of Liability',
        content: 'In no event shall World Dollar Quest, its operators, authors, or affiliates be liable for any direct, indirect, incidental, or consequential damages arising out of your use of or inability to use the platform or its resources.',
      },
    ],
  },
  {
    id: 'legal-earnings',
    slug: 'earnings-disclaimer',
    title: 'Earnings Disclaimer',
    lastUpdated: 'August 2026',
    summary: 'Important Notice: Online earning involves effort, skill development, market timing, and risk. World Dollar Quest makes NO promises or guarantees of income.',
    sections: [
      {
        heading: '1. No Guarantee of Income or Financial Results',
        content: 'World Dollar Quest provides educational guides, skill-building resources, software tools, and digital templates. We make absolutely NO representation, warranty, or guarantee that you will earn any money, achieve specific financial milestones, or recoup any investment of time or capital.',
      },
      {
        heading: '2. Individual Results Vary Widely',
        content: 'Any financial figures, case studies, or business examples mentioned on this platform or in our articles are illustrative examples only. Earning results depend entirely on individual factors, including work ethic, business acumen, prior experience, market demand, timing, and execution.',
      },
      {
        heading: '3. Your Sole Responsibility',
        content: 'You are solely responsible for your own financial, business, and legal decisions. World Dollar Quest does not guarantee employment, client acquisition, contract execution, or revenue. You should perform your own due diligence and consult professional financial or legal advisors before making significant business investments.',
      },
    ],
  },
  {
    id: 'legal-affiliate',
    slug: 'affiliate-disclosure',
    title: 'Affiliate Disclosure',
    lastUpdated: 'August 2026',
    summary: 'Transparency Statement: World Dollar Quest may earn affiliate commissions from recommended tools and services at no additional cost to you.',
    sections: [
      {
        heading: '1. Affiliate Relationships and Compensation',
        content: 'In compliance with FTC guidelines and global transparency standards, please assume that certain links to external products, software tools, hosting services, or platforms on World Dollar Quest are affiliate links. If you click on an affiliate link and make a purchase, World Dollar Quest may receive a small commission from the merchant.',
      },
      {
        heading: '2. No Extra Cost to You',
        content: 'Purchasing through our affiliate links incurs zero additional cost to you. In many instances, our partnership arrangements provide special discounts, extended trials, or promotional benefits for our community.',
      },
      {
        heading: '3. Editorial Independence',
        content: 'Our editorial team independently researches, tests, and evaluates tools and resources. Compensation never dictates our unbiased reviews, ratings, or objective assessments. We only recommend products and platforms we believe provide genuine utility to our readers.',
      },
    ],
  },
  {
    id: 'legal-disclaimer',
    slug: 'disclaimer',
    title: 'General Disclaimer',
    lastUpdated: 'August 2026',
    summary: 'The information on World Dollar Quest is provided on an "as is" basis for general informational and educational purposes only.',
    sections: [
      {
        heading: '1. No Professional Advice',
        content: 'The articles, calculators, prompt templates, and resources provided on World Dollar Quest do not constitute formal legal, accounting, tax, or financial advisory services. You should consult qualified licensed professionals before making legal or financial decisions.',
      },
      {
        heading: '2. Accuracy of Information',
        content: 'While we strive to keep our guides, tool databases, and market analyses accurate and up to date, digital software environments and platform policies change rapidly. We make no representations or warranties regarding the absolute completeness, reliability, or timeliness of any content.',
      },
    ],
  },
  {
    id: 'legal-cookie',
    slug: 'cookie-policy',
    title: 'Cookie Policy',
    lastUpdated: 'August 2026',
    summary: 'Details regarding how cookies, web beacons, and local browser storage are utilized on World Dollar Quest.',
    sections: [
      {
        heading: '1. What Are Cookies?',
        content: 'Cookies are small text files placed on your device by websites you visit. They are widely used to ensure websites function efficiently, remember user preferences, and provide analytical reporting.',
      },
      {
        heading: '2. Categories of Cookies We Use',
        content: 'We utilize Essential Cookies (required for site navigation, authentication, and security), Preference Cookies (saving user theme and tool settings), and Anonymous Analytical Cookies (helping us understand aggregate visitor interaction patterns).',
      },
      {
        heading: '3. Managing Your Cookie Preferences',
        content: 'Most web browsers allow you to manage cookie settings via their preferences menus. You may choose to block or delete cookies at any time.',
      },
    ],
  },
  {
    id: 'legal-refund',
    slug: 'refund-policy',
    title: 'Refund & Cancellation Policy',
    lastUpdated: 'August 2026',
    summary: 'Clear guidelines regarding digital product purchases, downloadable assets, and service consultations.',
    sections: [
      {
        heading: '1. Digital Download Products',
        content: 'Because digital products (templates, Notion systems, prompt databases, ebooks) are delivered immediately upon purchase with irrevocable access, standard digital orders are generally non-refundable. However, if you experience a technical defect or duplicate charge, please contact support@worlddollar.quest within 14 days for resolution.',
      },
      {
        heading: '2. Consulting & Advisory Services',
        content: 'Consulting sessions may be rescheduled or cancelled with at least 48 hours prior notice for a full refund. Cancellations made with less than 48 hours notice may be subject to a scheduling administrative fee.',
      },
    ],
  },
  {
    id: 'legal-dmca',
    slug: 'dmca',
    title: 'DMCA / Copyright Policy',
    lastUpdated: 'August 2026',
    summary: 'Our policy for responding to notices of alleged intellectual property infringement.',
    sections: [
      {
        heading: '1. Respect for Intellectual Property',
        content: 'World Dollar Quest respects the intellectual property rights of others and complies with the provisions of the Digital Millennium Copyright Act (DMCA).',
      },
      {
        heading: '2. Filing a Takedown Notice',
        content: 'If you believe your copyrighted work has been copied in a way that constitutes infringement, please send a written notice to dmca@worlddollar.quest with identification of the copyrighted work, the specific URL where the material resides, your contact details, and a statement made under penalty of perjury.',
      },
    ],
  },
  {
    id: 'legal-acceptable-use',
    slug: 'acceptable-use',
    title: 'Acceptable Use Policy',
    lastUpdated: 'August 2026',
    summary: 'Rules and guidelines for interacting with World Dollar Quest community features, tools, and platforms.',
    sections: [
      {
        heading: '1. Prohibited Activities',
        content: 'Users are strictly prohibited from utilizing our free tools or services to generate spam, harass individuals, distribute deceptive financial schemes, exploit API rate limits, or engage in automated denial-of-service activities.',
      },
      {
        heading: '2. Enforcement',
        content: 'We reserve the right to investigate violations, block abusive IP addresses, and terminate user accounts without prior notice if this Acceptable Use Policy is breached.',
      },
    ],
  },
];

export const initialQuests: Quest[] = [
  {
    id: 'quest-01',
    title: 'Welcome to World Dollar Quest',
    description: 'Explore the platform mission, understand the Learn • Work • Earn philosophy, and set your learning goals.',
    category: 'explore',
    xpReward: 50,
    icon: 'Compass',
    actionUrl: '/about',
    actionText: 'Read Mission',
  },
  {
    id: 'quest-02',
    title: 'Test an AI Tool',
    description: 'Generate your first tailored prompt or brand name using our free online tools suite.',
    category: 'tools',
    xpReward: 100,
    icon: 'Sparkles',
    actionUrl: '/free-tools',
    actionText: 'Launch Tools',
  },
  {
    id: 'quest-03',
    title: 'Master the Freelance Roadmap',
    description: 'Read the realistic breakdown on packaging skills and landing your first high-value client.',
    category: 'learning',
    xpReward: 150,
    icon: 'BookOpen',
    actionUrl: '/blog/realistic-roadmap-first-freelance-client',
    actionText: 'Read Article',
  },
  {
    id: 'quest-04',
    title: 'Calculate Your Target Hourly Rate',
    description: 'Use the Freelance Rate Calculator to compute your required billable hourly rate.',
    category: 'tools',
    xpReward: 100,
    icon: 'Calculator',
    actionUrl: '/free-tools',
    actionText: 'Calculate Rate',
  },
  {
    id: 'quest-05',
    title: 'Study Digital Product Anatomy',
    description: 'Learn the 4 pillars of creating high-utility downloadable templates and prompt packs.',
    category: 'learning',
    xpReward: 150,
    icon: 'Layers',
    actionUrl: '/digital-products',
    actionText: 'Explore Products',
  },
  {
    id: 'quest-06',
    title: 'Review Earning Ethics & Disclaimers',
    description: 'Understand the realistic earning philosophy and why no revenue is ever guaranteed.',
    category: 'action',
    xpReward: 75,
    icon: 'ShieldCheck',
    actionUrl: '/earnings-disclaimer',
    actionText: 'Read Disclaimer',
  },
];

export const currenciesConfig: Record<string, { code: 'USD' | 'PKR' | 'BDT'; symbol: string; name: string; rateAgainstUSD: number }> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rateAgainstUSD: 1 },
  PKR: { code: 'PKR', symbol: 'Rs. ', name: 'Pakistani Rupee', rateAgainstUSD: 280 },
  BDT: { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka', rateAgainstUSD: 120 },
};

export const initialCoupons = [
  {
    id: 'coup-welcome10',
    code: 'WELCOME10',
    discountType: 'percentage' as const,
    discountValue: 10,
    minimumOrderValue: 0,
    usageLimit: 500,
    usedCount: 38,
    isActive: true,
    createdAt: '2026-03-01',
  },
  {
    id: 'coup-quest20',
    code: 'QUEST2026',
    discountType: 'percentage' as const,
    discountValue: 20,
    minimumOrderValue: 25,
    usageLimit: 200,
    usedCount: 52,
    isActive: true,
    createdAt: '2026-03-05',
  },
  {
    id: 'coup-save5',
    code: 'SAVE5',
    discountType: 'fixed' as const,
    discountValue: 5,
    minimumOrderValue: 20,
    usageLimit: 100,
    usedCount: 14,
    isActive: true,
    createdAt: '2026-03-10',
  },
  {
    id: 'coup-freelance50',
    code: 'FREELANCE50',
    discountType: 'percentage' as const,
    discountValue: 50,
    minimumOrderValue: 30,
    usageLimit: 50,
    usedCount: 8,
    isActive: true,
    createdAt: '2026-03-15',
  },
];

export const initialCommerceSettings = {
  defaultCurrency: 'USD' as const,
  supportedCurrencies: ['USD', 'PKR', 'BDT'] as ('USD' | 'PKR' | 'BDT')[],
  defaultDownloadLimit: 5,
  downloadExpiryDays: 365,
  guestCheckoutEnabled: true,
  customerAccountsEnabled: true,
  couponSystemEnabled: true,
  activePaymentProviders: {
    stripe: { enabled: true, isConfigured: false, testMode: true },
    paypal: { enabled: true, isConfigured: false, testMode: true },
    mobileWallet: { enabled: true, isConfigured: true, provider: 'bkash_nagad' as const },
    sandbox: { enabled: true, label: 'Instant Sandbox Testing' },
  },
};

export const initialBadges: Badge[] = [
  {
    id: 'badge-novice',
    name: 'Quest Explorer',
    description: 'Completed your first platform exploration quest.',
    icon: 'Award',
    requiredXp: 50,
    category: 'Milestone',
  },
  {
    id: 'badge-tool-master',
    name: 'Tool Specialist',
    description: 'Utilized multiple free productivity tools on the platform.',
    icon: 'Wrench',
    requiredXp: 200,
    category: 'Skills',
  },
  {
    id: 'badge-strategist',
    name: 'Earning Strategist',
    description: 'Completed foundational reading on freelancing and digital product packaging.',
    icon: 'Target',
    requiredXp: 400,
    category: 'Learning',
  },
  {
    id: 'badge-quest-master',
    name: 'World Dollar Master',
    description: 'Completed all foundational Phase 1 platform quests.',
    icon: 'Crown',
    requiredXp: 600,
    category: 'Mastery',
  },
];

