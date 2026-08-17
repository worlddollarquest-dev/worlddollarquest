export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  categoryId: string;
  price: number;
  salePrice?: number;
  image: string;
  gallery?: string[];
  productType: 'template' | 'ebook' | 'prompt-pack' | 'course' | 'tool-kit' | 'checklist' | 'digital_download' | 'prompt_bundle' | 'other';
  downloadFileUrl?: string;
  downloadFilePath?: string;
  features: string[];
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  status: 'published' | 'draft' | 'archived';
  featured: boolean;
  rating?: number;
  salesCount?: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  type: 'product' | 'blog' | 'tool';
  seoTitle?: string;
  seoDescription?: string;
  status: 'active' | 'inactive';
}

export interface FreeTool {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: 'AI & Automation' | 'Business & Marketing' | 'Productivity' | 'Social Media' | 'Finance';
  icon: string;
  componentId: string;
  featured: boolean;
  status: 'active' | 'maintenance';
  seoTitle?: string;
  seoDescription?: string;
  usageCount: number;
  badge?: string;
  toolType?: string;
  toolConfig?: Record<string, any>;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  categoryId: string;
  categoryName: string;
  tags: string[];
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedDate: string;
  readingTime: string;
  seoTitle: string;
  seoDescription: string;
  status: 'published' | 'draft' | 'archived';
  featured: boolean;
}

export interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  price?: string;
  priceRange: string;
  features: string[];
  image: string;
  status: 'active' | 'paused' | 'archived';
  featured: boolean;
  ctaText: string;
  turnaroundTime: string;
  targetAudience: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface LegalPage {
  id: string;
  slug: string;
  title: string;
  lastUpdated: string;
  summary: string;
  sections: {
    heading: string;
    content: string;
  }[];
  content?: string;
  status?: 'published' | 'draft' | 'archived';
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logoText: string;
  primaryEmail: string;
  contactEmail: string;
  socialLinks: {
    twitter: string;
    github: string;
    linkedin: string;
    youtube: string;
    telegram?: string;
  };
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  ogImageUrl: string;
  footerCopyright: string;
  maintenanceMode: boolean;
  announcementBanner: {
    enabled: boolean;
    text: string;
    linkUrl: string;
    linkText: string;
  };
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  category: 'general' | 'support' | 'partnership' | 'product_inquiry';
  message: string;
  status: 'new' | 'unread' | 'read' | 'replied' | 'in_progress' | 'resolved' | 'archived';
  createdAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  source: string;
  status: 'subscribed' | 'unsubscribed';
  subscribedAt: string;
}

export interface AdminUser {
  id: string;
  userId: string;
  name: string;
  role: 'admin' | 'editor';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  authUserId?: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export type CurrencyCode = 'USD' | 'PKR' | 'BDT';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateAgainstUSD: number;
}

export type PaymentProviderName = 'stripe' | 'paypal' | 'mobile_wallet' | 'sandbox';
export type PaymentProvider = PaymentProviderName;
export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'completed' | 'failed' | 'cancelled' | 'refunded' | 'partially_refunded';
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string;
  productName: string;
  productSlug?: string;
  quantity: number;
  unitPrice: number;
  total: number;
  downloadFilePath?: string;
  downloadEntitlementCreated?: boolean;
  createdAt: string;
}

export interface DownloadEntitlement {
  id: string;
  orderId: string;
  orderItemId?: string;
  productId: string;
  productName: string;
  productSlug?: string;
  customerEmail: string;
  accessToken: string;
  downloadLimit: number;
  downloadCount: number;
  downloadFilePath?: string;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  provider: PaymentProviderName;
  providerTransactionId?: string;
  providerOrderId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  rawReferenceMetadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  customerId?: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  subtotal: number;
  discount: number;
  total: number;
  currency: CurrencyCode | string;
  paymentProvider?: PaymentProviderName;
  paymentReference?: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  couponCode?: string;
  items?: OrderItem[];
  entitlements?: DownloadEntitlement[];
  transactions?: PaymentTransaction[];
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CommerceSettings {
  defaultCurrency: CurrencyCode;
  supportedCurrencies: CurrencyCode[];
  defaultDownloadLimit: number;
  downloadExpiryDays: number;
  guestCheckoutEnabled: boolean;
  customerAccountsEnabled: boolean;
  couponSystemEnabled: boolean;
  activePaymentProviders: {
    stripe: { enabled: boolean; isConfigured: boolean; testMode: boolean };
    paypal: { enabled: boolean; isConfigured: boolean; testMode: boolean };
    mobileWallet: { enabled: boolean; isConfigured: boolean; provider: 'bkash_nagad' | 'easypaisa_jazzcash' };
    sandbox: { enabled: boolean; label: string };
  };
}

export interface Review {
  id: string;
  name: string;
  email?: string;
  productId?: string;
  rating: number;
  review: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface MediaItem {
  id: string;
  fileName: string;
  storagePath: string;
  publicUrl: string;
  fileType?: string;
  fileSize?: number;
  uploadedBy?: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumOrderValue?: number;
  minOrderAmount?: number;
  usageLimit?: number;
  maxUses?: number;
  usedCount: number;
  startsAt?: string;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  xp: number;
  level: number;
  completedQuests: string[];
  badges: string[];
  streakDays: number;
  lastActive: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: 'explore' | 'tools' | 'learning' | 'action';
  xpReward: number;
  icon: string;
  actionUrl: string;
  actionText: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredXp?: number;
  category: string;
}
