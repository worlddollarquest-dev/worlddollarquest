import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Product,
  Category,
  FreeTool,
  BlogPost,
  ServiceItem,
  LegalPage,
  SiteSettings,
  ContactMessage,
  NewsletterSubscriber,
  Order,
  OrderItem,
  Customer,
  Coupon,
  CommerceSettings,
  DownloadEntitlement,
  PaymentTransaction,
  PaymentStatus,
  OrderStatus,
} from '../types';
import {
  initialProducts,
  initialCategories,
  initialFreeTools,
  initialBlogPosts,
  initialServices,
  initialLegalPages,
  initialSiteSettings,
  initialCoupons,
  initialCommerceSettings,
} from '../data/initialData';
import { supabase, isSupabaseConfigured, storageService } from '../lib/supabase';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'tool' | 'product' | 'article' | 'service' | 'guide';
  url: string;
  badge?: string;
}

interface AppContextType {
  products: Product[];
  categories: Category[];
  freeTools: FreeTool[];
  blogPosts: BlogPost[];
  services: ServiceItem[];
  legalPages: LegalPage[];
  siteSettings: SiteSettings;
  contactMessages: ContactMessage[];
  newsletterSubscribers: NewsletterSubscriber[];
  orders: Order[];
  customers: Customer[];
  coupons: Coupon[];
  commerceSettings: CommerceSettings;
  isDbConnected: boolean;
  isLoadingData: boolean;

  // Product CRUD
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<Product>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleProductFeatured: (id: string) => Promise<void>;
  toggleProductStatus: (id: string) => Promise<void>;
  uploadProductImage: (file: File) => Promise<{ publicUrl: string; storagePath: string } | { error: string }>;
  uploadProductFile: (file: File, productSlug: string) => Promise<{ storagePath: string } | { error: string }>;

  // Category CRUD
  addCategory: (category: Omit<Category, 'id'>) => Promise<Category>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Blog CRUD
  addBlogPost: (post: Omit<BlogPost, 'id' | 'publishedDate'>) => Promise<BlogPost>;
  updateBlogPost: (id: string, post: Partial<BlogPost>) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;

  // Tool CRUD
  addTool: (tool: Omit<FreeTool, 'id' | 'usageCount'>) => Promise<FreeTool>;
  updateTool: (id: string, tool: Partial<FreeTool>) => Promise<void>;
  deleteTool: (id: string) => Promise<void>;
  incrementToolUsage: (toolId: string) => Promise<void>;

  // Service CRUD
  addService: (service: Omit<ServiceItem, 'id'>) => Promise<ServiceItem>;
  updateService: (id: string, service: Partial<ServiceItem>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;

  // Legal Pages CRUD
  updateLegalPage: (id: string, page: Partial<LegalPage>) => Promise<void>;

  // Site Settings
  updateSiteSettings: (settings: Partial<SiteSettings>) => Promise<void>;

  // Coupons CRUD
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usedCount' | 'createdAt'>) => Promise<Coupon>;
  updateCoupon: (id: string, coupon: Partial<Coupon>) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;

  // Commerce Settings
  updateCommerceSettings: (settings: Partial<CommerceSettings>) => Promise<void>;

  // Orders & Commerce Operations
  createOrder: (
    orderData: {
      customerId?: string;
      customerName: string;
      customerEmail: string;
      customerPhone?: string;
      subtotal: number;
      discount: number;
      total: number;
      currency: string;
      paymentProvider?: any;
      paymentReference?: string;
      paymentStatus: PaymentStatus;
      orderStatus: OrderStatus;
      couponCode?: string;
      adminNotes?: string;
    },
    items: OrderItem[]
  ) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  updateOrderPaymentStatus: (orderId: string, status: PaymentStatus, reference?: string) => Promise<void>;
  refundOrderAdmin: (orderId: string, amount?: number, reason?: string) => Promise<void>;
  fetchOrderDetails: (orderId: string) => Promise<{ order: Order; items: OrderItem[]; entitlements: DownloadEntitlement[]; transactions: PaymentTransaction[] } | null>;

  // Contact & Newsletter
  submitContactMessage: (
    name: string,
    email: string,
    subject: string,
    message: string,
    category?: ContactMessage['category']
  ) => Promise<{ success: boolean; error?: string }>;
  updateContactMessageStatus: (id: string, status: ContactMessage['status']) => Promise<void>;
  deleteContactMessage: (id: string) => Promise<void>;
  subscribeNewsletter: (email: string, source?: string) => Promise<{ success: boolean; message?: string }>;
  unsubscribeNewsletter: (id: string) => Promise<void>;

  // Search & Utilities
  searchGlobal: (query: string) => SearchResult[];
  refreshFromSupabase: () => Promise<void>;
  resetToDefaults: () => void;
}

const STORAGE_KEYS = {
  PRODUCTS: 'wdq_products_v2',
  CATEGORIES: 'wdq_categories_v2',
  TOOLS: 'wdq_tools_v2',
  BLOG: 'wdq_blog_v2',
  SERVICES: 'wdq_services_v2',
  LEGAL: 'wdq_legal_v2',
  SETTINGS: 'wdq_settings_v2',
  MESSAGES: 'wdq_messages_v2',
  SUBSCRIBERS: 'wdq_subscribers_v2',
  COUPONS: 'wdq_coupons_v3',
  COMMERCE_SETTINGS: 'wdq_commerce_settings_v3',
  ORDERS: 'wdq_orders_v3',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : initialCategories;
    } catch {
      return initialCategories;
    }
  });

  const [freeTools, setFreeTools] = useState<FreeTool[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TOOLS);
      return saved ? JSON.parse(saved) : initialFreeTools;
    } catch {
      return initialFreeTools;
    }
  });

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BLOG);
      return saved ? JSON.parse(saved) : initialBlogPosts;
    } catch {
      return initialBlogPosts;
    }
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
      return saved ? JSON.parse(saved) : initialServices;
    } catch {
      return initialServices;
    }
  });

  const [legalPages, setLegalPages] = useState<LegalPage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEGAL);
      return saved ? JSON.parse(saved) : initialLegalPages;
    } catch {
      return initialLegalPages;
    }
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : initialSiteSettings;
    } catch {
      return initialSiteSettings;
    }
  });

  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'msg-01',
              name: 'Sarah Jenkins',
              email: 'sarah.j@example.com',
              subject: 'Partnership & Free Tool Integration',
              category: 'partnership',
              message:
                'Hi World Dollar Quest team, loving your free AI prompt generator! We are building an open-source productivity extension and would love to collaborate.',
              status: 'unread',
              createdAt: new Date(Date.now() - 86400000).toISOString(),
            },
          ];
    } catch {
      return [];
    }
  });

  const [newsletterSubscribers, setNewsletterSubscribers] = useState<NewsletterSubscriber[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBSCRIBERS);
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'sub-01',
              email: 'creator.pro@example.com',
              source: 'homepage_hero',
              status: 'subscribed',
              subscribedAt: new Date(Date.now() - 172800000).toISOString(),
            },
          ];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COUPONS);
      return saved ? JSON.parse(saved) : initialCoupons;
    } catch {
      return initialCoupons;
    }
  });
  const [commerceSettings, setCommerceSettings] = useState<CommerceSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMMERCE_SETTINGS);
      return saved ? JSON.parse(saved) : initialCommerceSettings;
    } catch {
      return initialCommerceSettings;
    }
  });
  const [isDbConnected, setIsDbConnected] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  // Sync to local cache
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(freeTools));
  }, [freeTools]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(blogPosts));
  }, [blogPosts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEGAL, JSON.stringify(legalPages));
  }, [legalPages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(contactMessages));
  }, [contactMessages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(newsletterSubscribers));
  }, [newsletterSubscribers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMMERCE_SETTINGS, JSON.stringify(commerceSettings));
  }, [commerceSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  // Load Data from Supabase
  const refreshFromSupabase = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setIsLoadingData(false);
      return;
    }

    try {
      setIsLoadingData(true);

      // 1. Fetch Products
      const { data: dbProducts, error: prodErr } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!prodErr && dbProducts && dbProducts.length > 0) {
        const mappedProducts: Product[] = dbProducts.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          shortDescription: p.short_description || '',
          fullDescription: p.description || '',
          categoryId: p.category_id || 'cat-prod-1',
          price: Number(p.price) || 0,
          salePrice: p.sale_price ? Number(p.sale_price) : undefined,
          image:
            p.thumbnail_url ||
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
          productType: p.product_type || 'template',
          downloadFileUrl: p.download_file_path || '',
          downloadFilePath: p.download_file_path || '',
          features: Array.isArray(p.features) ? p.features : [],
          tags: Array.isArray(p.tags) ? p.tags : [],
          seoTitle: p.seo_title,
          seoDescription: p.seo_description,
          status: p.status || 'published',
          featured: Boolean(p.is_featured),
          rating: Number(p.rating) || 5.0,
          salesCount: Number(p.sales_count) || 0,
          createdAt: p.created_at ? p.created_at.split('T')[0] : '2026-03-01',
        }));
        setProducts(mappedProducts);
        setIsDbConnected(true);
      }

      // 2. Fetch Product Categories
      const { data: dbCategories, error: catErr } = await supabase
        .from('product_categories')
        .select('*')
        .eq('status', 'active');

      if (!catErr && dbCategories && dbCategories.length > 0) {
        const mappedCats: Category[] = dbCategories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description || '',
          image: c.image_url,
          type: 'product',
          seoTitle: c.seo_title,
          seoDescription: c.seo_description,
          status: c.status || 'active',
        }));
        setCategories((prev) => {
          // Merge with blog categories from initial if needed
          const blogCats = prev.filter((cat) => cat.type === 'blog');
          return [...mappedCats, ...blogCats];
        });
      }

      // 3. Fetch Free Tools
      const { data: dbTools, error: toolsErr } = await supabase
        .from('free_tools')
        .select('*')
        .eq('status', 'active');

      if (!toolsErr && dbTools && dbTools.length > 0) {
        const mappedTools: FreeTool[] = dbTools.map((t) => ({
          id: t.id,
          name: t.name,
          slug: t.slug,
          description: t.description,
          category: t.category,
          icon: t.icon,
          componentId: t.component_id,
          featured: Boolean(t.is_featured),
          status: t.status || 'active',
          usageCount: Number(t.usage_count) || 0,
          badge: t.badge,
          seoTitle: t.seo_title,
          seoDescription: t.seo_description,
          toolType: t.tool_type,
          toolConfig: t.tool_config,
        }));
        setFreeTools(mappedTools);
      }

      // 4. Fetch Blog Posts
      const { data: dbPosts, error: postsErr } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });

      if (!postsErr && dbPosts && dbPosts.length > 0) {
        const mappedPosts: BlogPost[] = dbPosts.map((post) => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || '',
          content: post.content,
          featuredImage:
            post.featured_image ||
            'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
          categoryId: post.category_id || 'cat-blog-1',
          categoryName: 'Freelancing & Remote Work',
          tags: Array.isArray(post.tags) ? post.tags : [],
          author: {
            name: post.author_name || 'Elena Rostova',
            role: post.author_role || 'Editorial Lead',
            avatar:
              post.author_avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          },
          publishedDate: post.published_at ? post.published_at.split('T')[0] : '2026-03-12',
          readingTime: post.reading_time || '5 min read',
          seoTitle: post.seo_title || post.title,
          seoDescription: post.seo_description || post.excerpt || '',
          status: post.status || 'published',
          featured: Boolean(post.is_featured),
        }));
        setBlogPosts(mappedPosts);
      }

      // 5. Fetch Services
      const { data: dbServices, error: servErr } = await supabase
        .from('services')
        .select('*')
        .eq('status', 'active');

      if (!servErr && dbServices && dbServices.length > 0) {
        const mappedServices: ServiceItem[] = dbServices.map((s) => ({
          id: s.id,
          name: s.name,
          slug: s.slug,
          description: s.description,
          price: s.price,
          priceRange: s.price_range || s.price || '$100+',
          features: Array.isArray(s.features) ? s.features : [],
          image:
            s.image_url ||
            'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
          status: s.status || 'active',
          featured: Boolean(s.is_featured),
          ctaText: s.cta_text || 'Get Started',
          turnaroundTime: s.turnaround_time || '3-5 Days',
          targetAudience: s.target_audience || 'Professionals & Creators',
          seoTitle: s.seo_title,
          seoDescription: s.seo_description,
        }));
        setServices(mappedServices);
      }

      // 6. Fetch Legal Pages
      const { data: dbLegal, error: legalErr } = await supabase
        .from('legal_pages')
        .select('*');

      if (!legalErr && dbLegal && dbLegal.length > 0) {
        const mappedLegal: LegalPage[] = dbLegal.map((l) => ({
          id: l.id,
          slug: l.slug,
          title: l.title,
          lastUpdated: l.last_updated || 'August 2026',
          summary: l.summary || '',
          sections: Array.isArray(l.sections) ? l.sections : [],
          content: l.content,
          status: l.status,
        }));
        setLegalPages(mappedLegal);
      }

      // 7. Fetch Site Settings
      const { data: dbSettings, error: setErr } = await supabase
        .from('site_settings')
        .select('*')
        .maybeSingle();

      if (!setErr && dbSettings) {
        setSiteSettings({
          siteName: dbSettings.site_name || 'World Dollar Quest',
          tagline: dbSettings.tagline || 'Learn • Work • Earn',
          logoText: 'WORLD DOLLAR QUEST',
          primaryEmail: dbSettings.contact_email || 'contact@worlddollar.quest',
          contactEmail: dbSettings.contact_email || 'support@worlddollar.quest',
          socialLinks: dbSettings.social_links || initialSiteSettings.socialLinks,
          defaultSeoTitle: dbSettings.default_seo_title || initialSiteSettings.defaultSeoTitle,
          defaultSeoDescription: dbSettings.default_seo_description || initialSiteSettings.defaultSeoDescription,
          ogImageUrl: dbSettings.og_image || initialSiteSettings.ogImageUrl,
          footerCopyright: dbSettings.footer_text || initialSiteSettings.footerCopyright,
          maintenanceMode: Boolean(dbSettings.maintenance_mode),
          announcementBanner: dbSettings.announcement_banner || initialSiteSettings.announcementBanner,
        });
      }

      // 8. Fetch Contact Messages (Admin only)
      const { data: dbMessages, error: msgErr } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (!msgErr && dbMessages && dbMessages.length > 0) {
        const mappedMsg: ContactMessage[] = dbMessages.map((m) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          subject: m.subject,
          category: m.category || 'general',
          message: m.message,
          status: m.status || 'unread',
          createdAt: m.created_at,
        }));
        setContactMessages(mappedMsg);
      }

      // 9. Fetch Subscribers (Admin only)
      const { data: dbSubs, error: subErr } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (!subErr && dbSubs && dbSubs.length > 0) {
        const mappedSubs: NewsletterSubscriber[] = dbSubs.map((s) => ({
          id: s.id,
          email: s.email,
          source: s.source || 'website',
          status: s.status || 'subscribed',
          subscribedAt: s.created_at,
        }));
        setNewsletterSubscribers(mappedSubs);
      }

      // 10. Fetch Orders
      const { data: dbOrders, error: ordErr } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!ordErr && dbOrders && dbOrders.length > 0) {
        setOrders(
          dbOrders.map((o) => ({
            id: o.id,
            customerId: o.customer_id,
            orderNumber: o.order_number,
            customerName: o.customer_name || 'Customer',
            customerEmail: o.customer_email || 'customer@example.com',
            customerPhone: o.customer_phone,
            subtotal: Number(o.subtotal) || 0,
            discount: Number(o.discount) || 0,
            total: Number(o.total) || 0,
            currency: o.currency || 'USD',
            paymentProvider: o.payment_provider || 'sandbox',
            paymentReference: o.payment_reference,
            paymentStatus: o.payment_status || 'pending',
            orderStatus: o.order_status || 'pending',
            couponCode: o.coupon_code,
            adminNotes: o.admin_notes,
            createdAt: o.created_at,
            updatedAt: o.updated_at,
          }))
        );
      }

      // 11. Fetch Customers
      const { data: dbCustomers, error: custErr } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (!custErr && dbCustomers && dbCustomers.length > 0) {
        setCustomers(
          dbCustomers.map((c) => ({
            id: c.id,
            authUserId: c.auth_user_id,
            name: c.name || '',
            email: c.email,
            phone: c.phone,
            createdAt: c.created_at,
            updatedAt: c.updated_at,
          }))
        );
      }

      // 12. Fetch Coupons
      const { data: dbCoupons, error: coupErr } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (!coupErr && dbCoupons && dbCoupons.length > 0) {
        setCoupons(
          dbCoupons.map((cp) => ({
            id: cp.id,
            code: cp.code,
            discountType: cp.discount_type,
            discountValue: Number(cp.discount_value),
            minimumOrderValue: cp.minimum_order_value ? Number(cp.minimum_order_value) : undefined,
            usageLimit: cp.usage_limit ? Number(cp.usage_limit) : undefined,
            usedCount: Number(cp.used_count) || 0,
            startsAt: cp.starts_at,
            expiresAt: cp.expires_at,
            isActive: Boolean(cp.is_active),
            createdAt: cp.created_at,
          }))
        );
      }

      // 13. Fetch Commerce Settings
      const { data: dbCommSettings, error: commErr } = await supabase
        .from('commerce_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (!commErr && dbCommSettings && dbCommSettings.settings_data) {
        setCommerceSettings(dbCommSettings.settings_data);
      }
    } catch (err) {
      console.warn('Supabase fetch notice (using cached local data):', err);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    refreshFromSupabase();
  }, [refreshFromSupabase]);

  // Product CRUD
  const addProduct = async (data: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
    const tempId = 'prod-' + Date.now().toString(36);
    const createdAt = new Date().toISOString().split('T')[0];
    const newProd: Product = { ...data, id: tempId, createdAt };

    // Update optimistic UI state
    setProducts((prev) => [newProd, ...prev]);

    // Persist to Supabase if available
    if (isSupabaseConfigured) {
      try {
        const { data: inserted, error } = await supabase
          .from('products')
          .insert({
            name: data.name,
            slug: data.slug,
            short_description: data.shortDescription,
            description: data.fullDescription,
            category_id: data.categoryId.includes('-') && !data.categoryId.startsWith('cat-') ? data.categoryId : null,
            price: data.price,
            sale_price: data.salePrice,
            product_type: data.productType,
            download_file_path: data.downloadFilePath || data.downloadFileUrl,
            thumbnail_url: data.image,
            status: data.status || 'published',
            is_featured: data.featured || false,
            features: data.features || [],
            tags: data.tags || [],
            rating: data.rating || 5.0,
            sales_count: data.salesCount || 0,
            seo_title: data.seoTitle,
            seo_description: data.seoDescription,
          })
          .select()
          .single();

        if (!error && inserted) {
          const finalProd: Product = {
            ...newProd,
            id: inserted.id,
          };
          setProducts((prev) => prev.map((p) => (p.id === tempId ? finalProd : p)));
          return finalProd;
        }
      } catch (err) {
        console.warn('Supabase product insert notice:', err);
      }
    }

    return newProd;
  };

  const updateProduct = async (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );

    if (isSupabaseConfigured && !id.startsWith('prod-')) {
      try {
        const updatePayload: Record<string, any> = {};
        if (updated.name !== undefined) updatePayload.name = updated.name;
        if (updated.slug !== undefined) updatePayload.slug = updated.slug;
        if (updated.shortDescription !== undefined) updatePayload.short_description = updated.shortDescription;
        if (updated.fullDescription !== undefined) updatePayload.description = updated.fullDescription;
        if (updated.price !== undefined) updatePayload.price = updated.price;
        if (updated.salePrice !== undefined) updatePayload.sale_price = updated.salePrice;
        if (updated.image !== undefined) updatePayload.thumbnail_url = updated.image;
        if (updated.productType !== undefined) updatePayload.product_type = updated.productType;
        if (updated.status !== undefined) updatePayload.status = updated.status;
        if (updated.featured !== undefined) updatePayload.is_featured = updated.featured;
        if (updated.features !== undefined) updatePayload.features = updated.features;
        if (updated.tags !== undefined) updatePayload.tags = updated.tags;
        if (updated.downloadFilePath !== undefined) updatePayload.download_file_path = updated.downloadFilePath;
        if (updated.seoTitle !== undefined) updatePayload.seo_title = updated.seoTitle;
        if (updated.seoDescription !== undefined) updatePayload.seo_description = updated.seoDescription;

        await supabase.from('products').update(updatePayload).eq('id', id);
      } catch (err) {
        console.warn('Supabase product update notice:', err);
      }
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));

    if (isSupabaseConfigured && !id.startsWith('prod-')) {
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase product delete notice:', err);
      }
    }
  };

  const toggleProductFeatured = async (id: string) => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;
    const newFeatured = !prod.featured;
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, featured: newFeatured } : item))
    );

    if (isSupabaseConfigured && !id.startsWith('prod-')) {
      try {
        await supabase.from('products').update({ is_featured: newFeatured }).eq('id', id);
      } catch (err) {
        console.warn('Supabase toggle featured notice:', err);
      }
    }
  };

  const toggleProductStatus = async (id: string) => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;
    const newStatus: Product['status'] = prod.status === 'published' ? 'draft' : 'published';
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );

    if (isSupabaseConfigured && !id.startsWith('prod-')) {
      try {
        await supabase.from('products').update({ status: newStatus }).eq('id', id);
      } catch (err) {
        console.warn('Supabase toggle status notice:', err);
      }
    }
  };

  const uploadProductImage = async (file: File) => {
    return storageService.uploadPublicImage('product-images', file, 'products');
  };

  const uploadProductFile = async (file: File, productSlug: string) => {
    return storageService.uploadProductFile(file, productSlug);
  };

  // Category CRUD
  const addCategory = async (data: Omit<Category, 'id'>): Promise<Category> => {
    const tempId = 'cat-' + Date.now().toString(36);
    const newCat: Category = { ...data, id: tempId };
    setCategories((prev) => [...prev, newCat]);

    if (isSupabaseConfigured) {
      try {
        const { data: inserted } = await supabase
          .from('product_categories')
          .insert({
            name: data.name,
            slug: data.slug,
            description: data.description,
            image_url: data.image,
            status: data.status || 'active',
          })
          .select()
          .single();

        if (inserted) {
          const finalCat = { ...newCat, id: inserted.id };
          setCategories((prev) => prev.map((c) => (c.id === tempId ? finalCat : c)));
          return finalCat;
        }
      } catch (err) {
        console.warn('Supabase category notice:', err);
      }
    }
    return newCat;
  };

  const updateCategory = async (id: string, updated: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );

    if (isSupabaseConfigured && !id.startsWith('cat-')) {
      try {
        await supabase.from('product_categories').update(updated).eq('id', id);
      } catch (err) {
        console.warn('Category update notice:', err);
      }
    }
  };

  const deleteCategory = async (id: string) => {
    setCategories((prev) => prev.filter((item) => item.id !== id));
    if (isSupabaseConfigured && !id.startsWith('cat-')) {
      try {
        await supabase.from('product_categories').delete().eq('id', id);
      } catch (err) {
        console.warn('Category delete notice:', err);
      }
    }
  };

  // Blog CRUD
  const addBlogPost = async (data: Omit<BlogPost, 'id' | 'publishedDate'>): Promise<BlogPost> => {
    const tempId = 'post-' + Date.now().toString(36);
    const publishedDate = new Date().toISOString().split('T')[0];
    const newPost: BlogPost = { ...data, id: tempId, publishedDate };
    setBlogPosts((prev) => [newPost, ...prev]);

    if (isSupabaseConfigured) {
      try {
        const { data: inserted } = await supabase
          .from('blog_posts')
          .insert({
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt,
            content: data.content,
            featured_image: data.featuredImage,
            author_name: data.author.name,
            author_role: data.author.role,
            author_avatar: data.author.avatar,
            tags: data.tags,
            status: data.status,
            reading_time: data.readingTime,
            is_featured: data.featured,
            seo_title: data.seoTitle,
            seo_description: data.seoDescription,
          })
          .select()
          .single();

        if (inserted) {
          const finalPost = { ...newPost, id: inserted.id };
          setBlogPosts((prev) => prev.map((p) => (p.id === tempId ? finalPost : p)));
          return finalPost;
        }
      } catch (err) {
        console.warn('Blog post notice:', err);
      }
    }
    return newPost;
  };

  const updateBlogPost = async (id: string, updated: Partial<BlogPost>) => {
    setBlogPosts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );

    if (isSupabaseConfigured && !id.startsWith('post-')) {
      try {
        const payload: Record<string, any> = {};
        if (updated.title) payload.title = updated.title;
        if (updated.slug) payload.slug = updated.slug;
        if (updated.excerpt) payload.excerpt = updated.excerpt;
        if (updated.content) payload.content = updated.content;
        if (updated.featuredImage) payload.featured_image = updated.featuredImage;
        if (updated.status) payload.status = updated.status;
        if (updated.featured !== undefined) payload.is_featured = updated.featured;
        await supabase.from('blog_posts').update(payload).eq('id', id);
      } catch (err) {
        console.warn('Blog update notice:', err);
      }
    }
  };

  const deleteBlogPost = async (id: string) => {
    setBlogPosts((prev) => prev.filter((item) => item.id !== id));
    if (isSupabaseConfigured && !id.startsWith('post-')) {
      try {
        await supabase.from('blog_posts').delete().eq('id', id);
      } catch (err) {
        console.warn('Blog delete notice:', err);
      }
    }
  };

  // Tool CRUD
  const addTool = async (data: Omit<FreeTool, 'id' | 'usageCount'>): Promise<FreeTool> => {
    const tempId = 'tool-' + Date.now().toString(36);
    const newTool: FreeTool = { ...data, id: tempId, usageCount: 0 };
    setFreeTools((prev) => [...prev, newTool]);

    if (isSupabaseConfigured) {
      try {
        const { data: inserted } = await supabase
          .from('free_tools')
          .insert({
            name: data.name,
            slug: data.slug,
            description: data.description,
            category: data.category,
            icon: data.icon,
            component_id: data.componentId,
            is_featured: data.featured,
            status: data.status,
            badge: data.badge,
            usage_count: 0,
          })
          .select()
          .single();

        if (inserted) {
          const finalTool = { ...newTool, id: inserted.id };
          setFreeTools((prev) => prev.map((t) => (t.id === tempId ? finalTool : t)));
          return finalTool;
        }
      } catch (err) {
        console.warn('Tool notice:', err);
      }
    }
    return newTool;
  };

  const updateTool = async (id: string, updated: Partial<FreeTool>) => {
    setFreeTools((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );

    if (isSupabaseConfigured && !id.startsWith('tool-')) {
      try {
        const payload: Record<string, any> = {};
        if (updated.name) payload.name = updated.name;
        if (updated.description) payload.description = updated.description;
        if (updated.status) payload.status = updated.status;
        if (updated.featured !== undefined) payload.is_featured = updated.featured;
        if (updated.badge !== undefined) payload.badge = updated.badge;
        await supabase.from('free_tools').update(payload).eq('id', id);
      } catch (err) {
        console.warn('Tool update notice:', err);
      }
    }
  };

  const deleteTool = async (id: string) => {
    setFreeTools((prev) => prev.filter((item) => item.id !== id));
    if (isSupabaseConfigured && !id.startsWith('tool-')) {
      try {
        await supabase.from('free_tools').delete().eq('id', id);
      } catch (err) {
        console.warn('Tool delete notice:', err);
      }
    }
  };

  const incrementToolUsage = async (toolId: string) => {
    setFreeTools((prev) =>
      prev.map((tool) =>
        tool.id === toolId || tool.slug === toolId || tool.componentId === toolId
          ? { ...tool, usageCount: tool.usageCount + 1 }
          : tool
      )
    );

    if (isSupabaseConfigured) {
      try {
        // Query target tool
        const matched = freeTools.find(
          (t) => t.id === toolId || t.slug === toolId || t.componentId === toolId
        );
        if (matched && !matched.id.startsWith('tool-')) {
          await supabase
            .from('free_tools')
            .update({ usage_count: matched.usageCount + 1 })
            .eq('id', matched.id);
        }
      } catch (err) {
        console.warn('Increment usage notice:', err);
      }
    }
  };

  // Service CRUD
  const addService = async (data: Omit<ServiceItem, 'id'>): Promise<ServiceItem> => {
    const tempId = 'serv-' + Date.now().toString(36);
    const newService: ServiceItem = { ...data, id: tempId };
    setServices((prev) => [...prev, newService]);

    if (isSupabaseConfigured) {
      try {
        const { data: inserted } = await supabase
          .from('services')
          .insert({
            name: data.name,
            slug: data.slug,
            description: data.description,
            price_range: data.priceRange,
            features: data.features,
            image_url: data.image,
            status: data.status,
            is_featured: data.featured,
            cta_text: data.ctaText,
            turnaround_time: data.turnaroundTime,
            target_audience: data.targetAudience,
          })
          .select()
          .single();

        if (inserted) {
          const finalService = { ...newService, id: inserted.id };
          setServices((prev) => prev.map((s) => (s.id === tempId ? finalService : s)));
          return finalService;
        }
      } catch (err) {
        console.warn('Service notice:', err);
      }
    }
    return newService;
  };

  const updateService = async (id: string, updated: Partial<ServiceItem>) => {
    setServices((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );

    if (isSupabaseConfigured && !id.startsWith('serv-')) {
      try {
        await supabase.from('services').update(updated).eq('id', id);
      } catch (err) {
        console.warn('Service update notice:', err);
      }
    }
  };

  const deleteService = async (id: string) => {
    setServices((prev) => prev.filter((item) => item.id !== id));
    if (isSupabaseConfigured && !id.startsWith('serv-')) {
      try {
        await supabase.from('services').delete().eq('id', id);
      } catch (err) {
        console.warn('Service delete notice:', err);
      }
    }
  };

  // Legal Pages CRUD
  const updateLegalPage = async (id: string, updated: Partial<LegalPage>) => {
    const updatedDate = new Date().toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });

    setLegalPages((prev) =>
      prev.map((page) =>
        page.id === id || page.slug === id
          ? {
              ...page,
              ...updated,
              lastUpdated: updatedDate,
            }
          : page
      )
    );

    if (isSupabaseConfigured) {
      try {
        const payload: Record<string, any> = {
          last_updated: updatedDate,
        };
        if (updated.title) payload.title = updated.title;
        if (updated.summary) payload.summary = updated.summary;
        if (updated.sections) payload.sections = updated.sections;
        if (updated.content) payload.content = updated.content;
        if (updated.status) payload.status = updated.status;

        await supabase
          .from('legal_pages')
          .update(payload)
          .or(`id.eq.${id},slug.eq.${id}`);
      } catch (err) {
        console.warn('Legal page update notice:', err);
      }
    }
  };

  // Site Settings
  const updateSiteSettings = async (updated: Partial<SiteSettings>) => {
    setSiteSettings((prev) => ({ ...prev, ...updated }));

    if (isSupabaseConfigured) {
      try {
        const payload: Record<string, any> = {};
        if (updated.siteName) payload.site_name = updated.siteName;
        if (updated.tagline) payload.tagline = updated.tagline;
        if (updated.contactEmail) payload.contact_email = updated.contactEmail;
        if (updated.socialLinks) payload.social_links = updated.socialLinks;
        if (updated.defaultSeoTitle) payload.default_seo_title = updated.defaultSeoTitle;
        if (updated.defaultSeoDescription) payload.default_seo_description = updated.defaultSeoDescription;
        if (updated.ogImageUrl) payload.og_image = updated.ogImageUrl;
        if (updated.footerCopyright) payload.footer_text = updated.footerCopyright;
        if (updated.maintenanceMode !== undefined) payload.maintenance_mode = updated.maintenanceMode;
        if (updated.announcementBanner) payload.announcement_banner = updated.announcementBanner;

        // Upsert site settings row
        const { data: existing } = await supabase.from('site_settings').select('id').maybeSingle();
        if (existing) {
          await supabase.from('site_settings').update(payload).eq('id', existing.id);
        } else {
          await supabase.from('site_settings').insert(payload);
        }
      } catch (err) {
        console.warn('Site settings notice:', err);
      }
    }
  };

  // Contact Messages
  const submitContactMessage = async (
    name: string,
    email: string,
    subject: string,
    message: string,
    category: ContactMessage['category'] = 'general'
  ): Promise<{ success: boolean; error?: string }> => {
    const tempId = 'msg-' + Date.now().toString(36);
    const newMessage: ContactMessage = {
      id: tempId,
      name,
      email,
      subject,
      category,
      message,
      status: 'unread',
      createdAt: new Date().toISOString(),
    };

    setContactMessages((prev) => [newMessage, ...prev]);

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('contact_messages').insert({
          name,
          email,
          subject,
          category,
          message,
          status: 'new',
        });

        if (error) {
          console.warn('Supabase contact message error:', error.message);
          return { success: false, error: error.message };
        }
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    return { success: true };
  };

  const updateContactMessageStatus = async (
    id: string,
    status: ContactMessage['status']
  ) => {
    setContactMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, status } : msg))
    );

    if (isSupabaseConfigured && !id.startsWith('msg-')) {
      try {
        await supabase.from('contact_messages').update({ status }).eq('id', id);
      } catch (err) {
        console.warn('Contact message status notice:', err);
      }
    }
  };

  const deleteContactMessage = async (id: string) => {
    setContactMessages((prev) => prev.filter((msg) => msg.id !== id));
    if (isSupabaseConfigured && !id.startsWith('msg-')) {
      try {
        await supabase.from('contact_messages').delete().eq('id', id);
      } catch (err) {
        console.warn('Contact message delete notice:', err);
      }
    }
  };

  // Newsletter
  const subscribeNewsletter = async (
    email: string,
    source = 'website'
  ): Promise<{ success: boolean; message?: string }> => {
    const normalized = email.trim().toLowerCase();
    const existing = newsletterSubscribers.find(
      (sub) => sub.email.toLowerCase() === normalized
    );

    if (existing) {
      if (existing.status === 'unsubscribed') {
        setNewsletterSubscribers((prev) =>
          prev.map((sub) =>
            sub.id === existing.id ? { ...sub, status: 'subscribed' } : sub
          )
        );
      }
      return { success: true, message: 'You are already subscribed to our digest.' };
    }

    const tempId = 'sub-' + Date.now().toString(36);
    const newSub: NewsletterSubscriber = {
      id: tempId,
      email: normalized,
      source,
      status: 'subscribed',
      subscribedAt: new Date().toISOString(),
    };
    setNewsletterSubscribers((prev) => [newSub, ...prev]);

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('newsletter_subscribers').insert({
          email: normalized,
          source,
          status: 'subscribed',
        });

        if (error) {
          if (error.code === '23505') {
            // Unique violation in Postgres
            return { success: true, message: 'Already registered.' };
          }
          console.warn('Newsletter subscribe notice:', error.message);
        }
      } catch (err) {
        console.warn('Newsletter error:', err);
      }
    }

    return { success: true, message: 'Subscribed successfully!' };
  };

  const unsubscribeNewsletter = async (id: string) => {
    setNewsletterSubscribers((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, status: 'unsubscribed' } : sub))
    );

    if (isSupabaseConfigured && !id.startsWith('sub-')) {
      try {
        await supabase
          .from('newsletter_subscribers')
          .update({ status: 'unsubscribed' })
          .eq('id', id);
      } catch (err) {
        console.warn('Unsubscribe notice:', err);
      }
    }
  };

  // Coupons CRUD
  const addCoupon = async (data: Omit<Coupon, 'id' | 'usedCount' | 'createdAt'>): Promise<Coupon> => {
    const tempId = 'coup-' + Date.now().toString(36);
    const createdAt = new Date().toISOString().split('T')[0];
    const newCoupon: Coupon = {
      ...data,
      id: tempId,
      usedCount: 0,
      createdAt,
    };

    setCoupons((prev) => [newCoupon, ...prev]);

    if (isSupabaseConfigured) {
      try {
        const { data: inserted, error } = await supabase
          .from('coupons')
          .insert({
            code: data.code.toUpperCase(),
            discount_type: data.discountType,
            discount_value: data.discountValue,
            minimum_order_value: data.minimumOrderValue || 0,
            usage_limit: data.usageLimit || null,
            used_count: 0,
            starts_at: data.startsAt || null,
            expires_at: data.expiresAt || null,
            is_active: data.isActive,
          })
          .select()
          .single();

        if (!error && inserted) {
          const finalC: Coupon = {
            ...newCoupon,
            id: inserted.id,
          };
          setCoupons((prev) => prev.map((c) => (c.id === tempId ? finalC : c)));
          return finalC;
        }
      } catch (err) {
        console.warn('Coupon create notice:', err);
      }
    }

    return newCoupon;
  };

  const updateCoupon = async (id: string, updated: Partial<Coupon>) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );

    if (isSupabaseConfigured && !id.startsWith('coup-')) {
      try {
        await supabase
          .from('coupons')
          .update({
            code: updated.code ? updated.code.toUpperCase() : undefined,
            discount_type: updated.discountType,
            discount_value: updated.discountValue,
            minimum_order_value: updated.minimumOrderValue,
            usage_limit: updated.usageLimit,
            used_count: updated.usedCount,
            expires_at: updated.expiresAt,
            is_active: updated.isActive,
          })
          .eq('id', id);
      } catch (err) {
        console.warn('Coupon update notice:', err);
      }
    }
  };

  const deleteCoupon = async (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));

    if (isSupabaseConfigured && !id.startsWith('coup-')) {
      try {
        await supabase.from('coupons').delete().eq('id', id);
      } catch (err) {
        console.warn('Coupon delete notice:', err);
      }
    }
  };

  // Commerce Settings
  const updateCommerceSettings = async (settings: Partial<CommerceSettings>) => {
    const updated = { ...commerceSettings, ...settings };
    setCommerceSettings(updated);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('commerce_settings').upsert({
          id: 'default_commerce_config',
          settings_data: updated,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Commerce settings save notice:', err);
      }
    }
  };

  // Order Operations
  const createOrder = async (
    orderData: {
      customerId?: string;
      customerName: string;
      customerEmail: string;
      customerPhone?: string;
      subtotal: number;
      discount: number;
      total: number;
      currency: string;
      paymentProvider?: any;
      paymentReference?: string;
      paymentStatus: PaymentStatus;
      orderStatus: OrderStatus;
      couponCode?: string;
      adminNotes?: string;
    },
    items: OrderItem[]
  ): Promise<Order> => {
    const tempId = 'ord-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);
    const orderNumber = `WDQ-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      id: tempId,
      orderNumber,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      customerId: orderData.customerId,
      subtotal: orderData.subtotal,
      discount: orderData.discount,
      total: orderData.total,
      currency: orderData.currency,
      paymentProvider: orderData.paymentProvider,
      paymentReference: orderData.paymentReference,
      paymentStatus: orderData.paymentStatus,
      orderStatus: orderData.orderStatus,
      couponCode: orderData.couponCode,
      adminNotes: orderData.adminNotes,
      items,
      createdAt: now,
      updatedAt: now,
    };

    setOrders((prev) => [newOrder, ...prev]);

    if (isSupabaseConfigured) {
      try {
        const { data: insertedOrder, error: orderErr } = await supabase
          .from('orders')
          .insert({
            order_number: orderNumber,
            customer_name: orderData.customerName,
            customer_email: orderData.customerEmail,
            customer_phone: orderData.customerPhone || null,
            customer_id: orderData.customerId || null,
            subtotal: orderData.subtotal,
            discount: orderData.discount,
            total: orderData.total,
            currency: orderData.currency,
            payment_provider: orderData.paymentProvider || 'sandbox',
            payment_reference: orderData.paymentReference || null,
            payment_status: orderData.paymentStatus,
            order_status: orderData.orderStatus,
            coupon_code: orderData.couponCode || null,
            admin_notes: orderData.adminNotes || null,
          })
          .select()
          .single();

        if (!orderErr && insertedOrder) {
          const finalOrder: Order = {
            ...newOrder,
            id: insertedOrder.id,
          };

          // Insert order items
          if (items.length > 0) {
            const dbItems = items.map((item) => ({
              order_id: insertedOrder.id,
              product_id: item.productId?.startsWith('prod-') ? null : item.productId,
              product_name: item.productName,
              product_slug: item.productSlug,
              quantity: item.quantity,
              unit_price: item.unitPrice,
              total: item.total,
              download_file_path: item.downloadFilePath,
            }));

            await supabase.from('order_items').insert(dbItems);
          }

          setOrders((prev) => prev.map((o) => (o.id === tempId ? finalOrder : o)));
          return finalOrder;
        }
      } catch (err) {
        console.warn('Supabase createOrder notice:', err);
      }
    }

    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: status, updatedAt: new Date().toISOString() } : o))
    );

    if (isSupabaseConfigured && !orderId.startsWith('ord-')) {
      try {
        await supabase
          .from('orders')
          .update({ order_status: status, updated_at: new Date().toISOString() })
          .eq('id', orderId);
      } catch (err) {
        console.warn('Order status update notice:', err);
      }
    }
  };

  const updateOrderPaymentStatus = async (orderId: string, status: PaymentStatus, reference?: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              paymentStatus: status,
              paymentReference: reference || o.paymentReference,
              updatedAt: new Date().toISOString(),
            }
          : o
      )
    );

    if (isSupabaseConfigured && !orderId.startsWith('ord-')) {
      try {
        await supabase
          .from('orders')
          .update({
            payment_status: status,
            payment_reference: reference,
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId);
      } catch (err) {
        console.warn('Order payment status update notice:', err);
      }
    }
  };

  const refundOrderAdmin = async (orderId: string, amount?: number, reason?: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    const refundAmount = amount || targetOrder.total;
    const txnId = `RFD_${Date.now().toString(36).toUpperCase()}`;

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              paymentStatus: 'refunded',
              orderStatus: 'refunded',
              adminNotes: reason ? `[Refund Reason]: ${reason}` : o.adminNotes,
              updatedAt: new Date().toISOString(),
            }
          : o
      )
    );

    if (isSupabaseConfigured && !orderId.startsWith('ord-')) {
      try {
        await supabase.from('payment_transactions').insert({
          order_id: orderId,
          provider: targetOrder.paymentProvider || 'sandbox',
          provider_transaction_id: txnId,
          amount: -refundAmount,
          currency: targetOrder.currency,
          status: 'refunded',
          raw_reference_metadata: {
            reason: reason || 'Admin issued refund',
            original_reference: targetOrder.paymentReference,
          },
        });

        await supabase
          .from('orders')
          .update({
            payment_status: 'refunded',
            order_status: 'refunded',
            admin_notes: reason ? `[Refund Reason]: ${reason}` : targetOrder.adminNotes,
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId);
      } catch (err) {
        console.warn('Refund order DB notice:', err);
      }
    }
  };

  const fetchOrderDetails = async (
    orderId: string
  ): Promise<{
    order: Order;
    items: OrderItem[];
    entitlements: DownloadEntitlement[];
    transactions: PaymentTransaction[];
  } | null> => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return null;

    let items: OrderItem[] = order.items || [];
    let entitlements: DownloadEntitlement[] = [];
    let transactions: PaymentTransaction[] = [];

    if (isSupabaseConfigured && !orderId.startsWith('ord-')) {
      try {
        const [itemsRes, entRes, txnRes] = await Promise.all([
          supabase.from('order_items').select('*').eq('order_id', orderId),
          supabase.from('download_entitlements').select('*').eq('order_id', orderId),
          supabase.from('payment_transactions').select('*').eq('order_id', orderId),
        ]);

        if (itemsRes.data && itemsRes.data.length > 0) {
          items = itemsRes.data.map((it) => ({
            id: it.id,
            orderId: it.order_id,
            productId: it.product_id,
            productName: it.product_name,
            productSlug: it.product_slug,
            quantity: Number(it.quantity) || 1,
            unitPrice: Number(it.unit_price) || 0,
            total: Number(it.total) || 0,
            downloadFilePath: it.download_file_path,
            createdAt: it.created_at,
          }));
        }

        if (entRes.data && entRes.data.length > 0) {
          entitlements = entRes.data.map((e) => ({
            id: e.id,
            orderId: e.order_id,
            orderItemId: e.order_item_id,
            productId: e.product_id,
            productName: e.product_name,
            productSlug: e.product_slug,
            customerEmail: e.customer_email,
            accessToken: e.access_token,
            downloadLimit: Number(e.download_limit) || 5,
            downloadCount: Number(e.download_count) || 0,
            downloadFilePath: e.download_file_path,
            expiresAt: e.expires_at,
            isActive: Boolean(e.is_active),
            createdAt: e.created_at,
            updatedAt: e.updated_at,
          }));
        }

        if (txnRes.data && txnRes.data.length > 0) {
          transactions = txnRes.data.map((t) => ({
            id: t.id,
            orderId: t.order_id,
            provider: t.provider,
            providerTransactionId: t.provider_transaction_id,
            providerOrderId: t.provider_order_id,
            amount: Number(t.amount) || 0,
            currency: t.currency || 'USD',
            status: t.status,
            rawReferenceMetadata: t.raw_reference_metadata,
            createdAt: t.created_at,
            updatedAt: t.updated_at,
          }));
        }
      } catch (err) {
        console.warn('Order details fetch notice:', err);
      }
    }

    return { order, items, entitlements, transactions };
  };

  // Global Search
  const searchGlobal = (query: string): SearchResult[] => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const results: SearchResult[] = [];

    // Tools
    freeTools.forEach((tool) => {
      if (
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q)
      ) {
        results.push({
          id: tool.id,
          title: tool.name,
          description: tool.description,
          type: 'tool',
          url: `/free-tools?tool=${tool.componentId}`,
          badge: tool.badge || 'Free Tool',
        });
      }
    });

    // Products
    products.forEach((prod) => {
      if (
        prod.status === 'published' &&
        (prod.name.toLowerCase().includes(q) ||
          prod.shortDescription.toLowerCase().includes(q) ||
          prod.tags.some((t) => t.toLowerCase().includes(q)))
      ) {
        results.push({
          id: prod.id,
          title: prod.name,
          description: prod.shortDescription,
          type: 'product',
          url: `/digital-products/${prod.slug}`,
          badge: `${prod.salePrice || prod.price}`,
        });
      }
    });

    // Articles
    blogPosts.forEach((post) => {
      if (
        post.status === 'published' &&
        (post.title.toLowerCase().includes(q) ||
          post.excerpt.toLowerCase().includes(q) ||
          post.tags.some((t) => t.toLowerCase().includes(q)))
      ) {
        results.push({
          id: post.id,
          title: post.title,
          description: post.excerpt,
          type: 'article',
          url: `/blog/${post.slug}`,
          badge: post.categoryName,
        });
      }
    });

    // Services
    services.forEach((serv) => {
      if (
        serv.status === 'active' &&
        (serv.name.toLowerCase().includes(q) || serv.description.toLowerCase().includes(q))
      ) {
        results.push({
          id: serv.id,
          title: serv.name,
          description: serv.description,
          type: 'service',
          url: `/services`,
          badge: serv.priceRange,
        });
      }
    });

    return results.slice(0, 10);
  };

  const resetToDefaults = () => {
    setProducts(initialProducts);
    setCategories(initialCategories);
    setFreeTools(initialFreeTools);
    setBlogPosts(initialBlogPosts);
    setServices(initialServices);
    setLegalPages(initialLegalPages);
    setSiteSettings(initialSiteSettings);
    setCoupons(initialCoupons);
    setCommerceSettings(initialCommerceSettings);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        products,
        categories,
        freeTools,
        blogPosts,
        services,
        legalPages,
        siteSettings,
        contactMessages,
        newsletterSubscribers,
        orders,
        customers,
        coupons,
        commerceSettings,
        isDbConnected,
        isLoadingData,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductFeatured,
        toggleProductStatus,
        uploadProductImage,
        uploadProductFile,
        addCategory,
        updateCategory,
        deleteCategory,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        addTool,
        updateTool,
        deleteTool,
        incrementToolUsage,
        addService,
        updateService,
        deleteService,
        updateLegalPage,
        updateSiteSettings,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        updateCommerceSettings,
        createOrder,
        updateOrderStatus,
        updateOrderPaymentStatus,
        refundOrderAdmin,
        fetchOrderDetails,
        submitContactMessage,
        updateContactMessageStatus,
        deleteContactMessage,
        subscribeNewsletter,
        unsubscribeNewsletter,
        searchGlobal,
        refreshFromSupabase,
        resetToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
