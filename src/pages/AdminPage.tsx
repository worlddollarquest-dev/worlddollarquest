import React, { useState, useRef } from 'react';
import {
  LayoutDashboard,
  Package,
  Wrench,
  BookOpen,
  Mail,
  MessageSquare,
  Settings,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Download,
  Database,
  Upload,
  ShoppingBag,
  Users,
  CheckCircle,
  Briefcase,
  X,
  FileCode,
  Copy,
  Tag,
  Percent,
  CreditCard,
  DollarSign,
  Key,
  Clock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Product, FreeTool, BlogPost, ServiceItem, Coupon, CommerceSettings } from '../types';
import { SEO } from '../components/common/SEO';

interface AdminPageProps {
  onNavigate: (path: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    uploadProductImage,
    freeTools,
    addTool,
    updateTool,
    deleteTool,
    blogPosts,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    services,
    addService,
    updateService,
    deleteService,
    newsletterSubscribers,
    unsubscribeNewsletter,
    contactMessages,
    updateContactMessageStatus,
    deleteContactMessage,
    orders,
    customers,
    coupons,
    addCoupon,
    deleteCoupon,
    commerceSettings,
    updateCommerceSettings,
    updateOrderStatus,
    siteSettings,
    updateSiteSettings,
    isDbConnected,
    isLoadingData,
    refreshFromSupabase,
    resetToDefaults,
  } = useApp();

  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'tools' | 'blog' | 'services' | 'orders' | 'subscribers' | 'inbox' | 'database' | 'settings'
  >('overview');

  // Orders sub-tab state
  const [ordersSubTab, setOrdersSubTab] = useState<'orders' | 'coupons' | 'customers' | 'settings'>('orders');

  // Coupon modal state
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponForm, setCouponForm] = useState<Partial<Coupon>>({
    code: '',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 0,
    maxUses: 100,
    isActive: true,
  });

  // Product modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [prodForm, setProdForm] = useState<Partial<Product>>({
    name: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    price: 29,
    salePrice: 19,
    categoryId: 'cat-notion',
    productType: 'template',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    downloadFilePath: '',
    features: ['Instant digital download', 'Lifetime updates included'],
    tags: ['Notion', 'Productivity'],
    status: 'published',
    featured: false,
    rating: 5.0,
    salesCount: 0,
  });

  // Tool modal state
  const [isToolModalOpen, setIsToolModalOpen] = useState(false);
  const [editingToolId, setEditingToolId] = useState<string | null>(null);
  const [toolForm, setToolForm] = useState<Partial<FreeTool>>({
    name: '',
    slug: '',
    description: '',
    category: 'AI & Automation',
    icon: 'Sparkles',
    componentId: '',
    featured: false,
    status: 'active',
    badge: 'Popular',
  });

  // Blog modal state
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [blogForm, setBlogForm] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    categoryId: 'cat-blog-1',
    categoryName: 'Freelancing',
    tags: ['AI', 'Work'],
    author: {
      name: 'Elena Rostova',
      role: 'Editorial Lead',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    readingTime: '5 min read',
    status: 'published',
    featured: false,
  });

  // Service modal state
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState<Partial<ServiceItem>>({
    name: '',
    slug: '',
    description: '',
    priceRange: '$299 - $599',
    features: ['Strategy Audit', 'Complete Setup', '30 Days Support'],
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    featured: false,
    ctaText: 'Get Started',
    turnaroundTime: '3-5 Days',
    targetAudience: 'Creators & Agencies',
  });

  // Settings form state
  const [settingsForm, setSettingsForm] = useState(siteSettings);

  const totalToolUsage = freeTools.reduce((acc, t) => acc + t.usageCount, 0);

  // --- Product Handlers ---
  const handleOpenNewProduct = () => {
    setEditingProductId(null);
    setProdForm({
      name: '',
      slug: '',
      shortDescription: '',
      fullDescription: '',
      price: 29,
      salePrice: 19,
      categoryId: 'cat-notion',
      productType: 'template',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
      downloadFilePath: '',
      features: ['Full system included', 'Step-by-step setup documentation'],
      tags: ['Productivity', 'Template'],
      status: 'published',
      featured: false,
      rating: 5.0,
      salesCount: 0,
    });
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setProdForm({ ...prod });
    setIsProductModalOpen(true);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const res = await uploadProductImage(file);
      if ('publicUrl' in res) {
        setProdForm((prev) => ({ ...prev, image: res.publicUrl }));
        success('Image Uploaded', 'Stored in Supabase bucket (product-images).');
      } else {
        toastError('Upload Failed', res.error);
      }
    } catch (err: any) {
      toastError('Upload Error', err.message);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodForm.name || !prodForm.slug) {
      toastError('Missing fields', 'Product title and slug are required.');
      return;
    }

    if (editingProductId) {
      await updateProduct(editingProductId, prodForm);
      success('Product Updated', `Saved modifications to ${prodForm.name}`);
    } else {
      await addProduct(prodForm as Omit<Product, 'id' | 'createdAt'>);
      success('Product Created', `Added ${prodForm.name} to digital vault.`);
    }
    setIsProductModalOpen(false);
  };

  // --- Tool Handlers ---
  const handleOpenNewTool = () => {
    setEditingToolId(null);
    setToolForm({
      name: '',
      slug: '',
      description: '',
      category: 'AI & Automation',
      icon: 'Sparkles',
      componentId: 'tool-' + Date.now().toString(36),
      featured: false,
      status: 'active',
      badge: 'New',
    });
    setIsToolModalOpen(true);
  };

  const handleEditTool = (tool: FreeTool) => {
    setEditingToolId(tool.id);
    setToolForm({ ...tool });
    setIsToolModalOpen(true);
  };

  const handleSaveTool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolForm.name || !toolForm.componentId) {
      toastError('Missing fields', 'Tool name and component ID are required.');
      return;
    }

    if (editingToolId) {
      await updateTool(editingToolId, toolForm);
      success('Tool Updated', `Saved modifications to ${toolForm.name}`);
    } else {
      await addTool(toolForm as Omit<FreeTool, 'id' | 'usageCount'>);
      success('Tool Created', `Added ${toolForm.name} to free tools collection.`);
    }
    setIsToolModalOpen(false);
  };

  // --- Blog Handlers ---
  const handleOpenNewBlog = () => {
    setEditingBlogId(null);
    setBlogForm({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featuredImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
      categoryId: 'cat-blog-1',
      categoryName: 'Freelancing',
      tags: ['Guide', 'Online Income'],
      author: {
        name: 'Elena Rostova',
        role: 'Editorial Lead',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      },
      readingTime: '5 min read',
      status: 'published',
      featured: false,
    });
    setIsBlogModalOpen(true);
  };

  const handleEditBlog = (post: BlogPost) => {
    setEditingBlogId(post.id);
    setBlogForm({ ...post });
    setIsBlogModalOpen(true);
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.slug) {
      toastError('Missing fields', 'Blog title and slug are required.');
      return;
    }

    if (editingBlogId) {
      await updateBlogPost(editingBlogId, blogForm);
      success('Post Updated', `Saved modifications to ${blogForm.title}`);
    } else {
      await addBlogPost(blogForm as Omit<BlogPost, 'id' | 'publishedDate'>);
      success('Post Created', `Published ${blogForm.title}`);
    }
    setIsBlogModalOpen(false);
  };

  // --- Service Handlers ---
  const handleOpenNewService = () => {
    setEditingServiceId(null);
    setServiceForm({
      name: '',
      slug: '',
      description: '',
      priceRange: '$199 - $399',
      features: ['Full Audit', 'Implementation', 'Documentation'],
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      status: 'active',
      featured: false,
      ctaText: 'Get Started',
      turnaroundTime: '2-4 Days',
      targetAudience: 'Solo Builders',
    });
    setIsServiceModalOpen(true);
  };

  const handleEditService = (serv: ServiceItem) => {
    setEditingServiceId(serv.id);
    setServiceForm({ ...serv });
    setIsServiceModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.name || !serviceForm.slug) {
      toastError('Missing fields', 'Service name and slug are required.');
      return;
    }

    if (editingServiceId) {
      await updateService(editingServiceId, serviceForm);
      success('Service Updated', `Saved ${serviceForm.name}`);
    } else {
      await addService(serviceForm as Omit<ServiceItem, 'id'>);
      success('Service Created', `Added ${serviceForm.name}`);
    }
    setIsServiceModalOpen(false);
  };

  // --- Coupon Handlers ---
  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponForm.code) {
      toastError('Missing Code', 'Coupon code is required.');
      return;
    }
    const newCoupon: Coupon = {
      id: 'cpn-' + Date.now(),
      code: couponForm.code.toUpperCase().trim(),
      discountType: couponForm.discountType || 'percentage',
      discountValue: Number(couponForm.discountValue) || 0,
      minOrderAmount: Number(couponForm.minOrderAmount) || 0,
      maxUses: Number(couponForm.maxUses) || 100,
      usedCount: 0,
      isActive: couponForm.isActive ?? true,
      expiresAt: couponForm.expiresAt,
      createdAt: new Date().toISOString(),
    };
    await addCoupon(newCoupon);
    success('Coupon Created', `Discount code ${newCoupon.code} is now active.`);
    setIsCouponModalOpen(false);
    setCouponForm({
      code: '',
      discountType: 'percentage',
      discountValue: 20,
      minOrderAmount: 0,
      maxUses: 100,
      isActive: true,
    });
  };

  const handleExportSubscribers = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Email,Source,Subscribed Date']
        .concat(
          newsletterSubscribers.map(
            (s) => `"${s.email}","${s.source}","${s.subscribedAt}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'world_dollar_quest_subscribers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('CSV Exported', 'Subscribers downloaded successfully.');
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSiteSettings(settingsForm);
    success('Settings Saved', 'Site configuration synchronized with database.');
  };

  const handleRefreshDatabase = async () => {
    await refreshFromSupabase();
    success('Database Refreshed', 'Synced all records with Supabase.');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo data (products, tools, posts, settings) to factory defaults?')) {
      resetToDefaults();
      success('Reset Complete', 'Factory demo dataset restored.');
    }
  };

  return (
    <>
      <SEO title="Admin Operating Console" description="World Dollar Quest control dashboard." />

      <div className="min-h-screen bg-slate-950 pb-24 text-slate-100">
        {/* Top Admin Banner */}
        <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white">World Dollar Quest Console</h1>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  <span>{isDbConnected ? 'Supabase Connected' : 'Supabase Ready'}</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Logged in as: <strong className="text-slate-200">{user?.name || 'Administrator'}</strong> ({user?.role || 'admin'})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleRefreshDatabase}
              disabled={isLoadingData}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? 'animate-spin' : ''}`} />
              <span>Sync DB</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Site</span>
            </button>
            <button
              type="button"
              onClick={handleResetData}
              className="px-3.5 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="border-b border-slate-800 bg-slate-950 sticky top-0 z-30 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto py-3 scrollbar-none">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'products', label: `Products (${products.length})`, icon: Package },
              { id: 'tools', label: `Free Tools (${freeTools.length})`, icon: Wrench },
              { id: 'blog', label: `Guides (${blogPosts.length})`, icon: BookOpen },
              { id: 'services', label: `Services (${services.length})`, icon: Briefcase },
              { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
              { id: 'subscribers', label: `Subscribers (${newsletterSubscribers.length})`, icon: Mail },
              { id: 'inbox', label: `Inbox (${contactMessages.length})`, icon: MessageSquare },
              { id: 'database', label: 'Supabase Schema', icon: Database },
              { id: 'settings', label: 'Site Settings', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 1. OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Digital Products</span>
                    <Package className="w-5 h-5 text-indigo-400" />
                  </div>
                  <p className="text-3xl font-black text-white font-mono">{products.length}</p>
                  <p className="text-xs text-slate-500">
                    {products.filter((p) => p.status === 'published').length} published in vault
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Tool Uses</span>
                    <Wrench className="w-5 h-5 text-teal-400" />
                  </div>
                  <p className="text-3xl font-black text-white font-mono">
                    {totalToolUsage.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500">{freeTools.length} active client-side tools</p>
                </div>

                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Subscribers</span>
                    <Mail className="w-5 h-5 text-emerald-400" />
                  </div>
                  <p className="text-3xl font-black text-white font-mono">{newsletterSubscribers.length}</p>
                  <p className="text-xs text-slate-500">Active email digest list</p>
                </div>

                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Inbox Tickets</span>
                    <MessageSquare className="w-5 h-5 text-blue-400" />
                  </div>
                  <p className="text-3xl font-black text-white font-mono">
                    {contactMessages.length}
                  </p>
                  <p className="text-xs text-slate-500">
                    {contactMessages.filter((m) => m.status === 'unread' || m.status === 'new').length} unread messages
                  </p>
                </div>
              </div>

              {/* Quick Summary Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Inbox Messages */}
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Recent Inquiries
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('inbox')}
                      className="text-xs text-teal-400 hover:text-teal-300 font-semibold"
                    >
                      View All &rarr;
                    </button>
                  </div>

                  <div className="space-y-2">
                    {contactMessages.slice(0, 4).map((msg) => (
                      <div
                        key={msg.id}
                        className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate">{msg.subject}</p>
                          <p className="text-slate-400 text-[11px] truncate">
                            From: {msg.name} ({msg.email})
                          </p>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                            msg.status === 'unread' || msg.status === 'new'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {msg.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Free Tools by usage */}
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Popular Free Tools
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('tools')}
                      className="text-xs text-teal-400 hover:text-teal-300 font-semibold"
                    >
                      Manage Tools &rarr;
                    </button>
                  </div>

                  <div className="space-y-2">
                    {freeTools.slice(0, 4).map((tool) => (
                      <div
                        key={tool.id}
                        className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate">{tool.name}</p>
                          <p className="text-slate-400 text-[11px]">{tool.category}</p>
                        </div>
                        <span className="font-mono text-teal-300 font-bold text-xs shrink-0">
                          {tool.usageCount.toLocaleString()} uses
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Digital Products Vault</h2>
                  <p className="text-xs text-slate-400">
                    Add, edit, or publish templates, prompts, and playbooks in Supabase.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenNewProduct}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-md shadow-teal-500/10"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                      <tr>
                        <th className="py-3.5 px-4">Product Name</th>
                        <th className="py-3.5 px-4">Type</th>
                        <th className="py-3.5 px-4">Price</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {products.map((prod) => (
                        <tr key={prod.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                referrerPolicy="no-referrer"
                                className="w-10 h-10 rounded-lg object-cover bg-slate-950 shrink-0"
                              />
                              <div>
                                <p className="font-bold text-white text-sm">{prod.name}</p>
                                <p className="text-[11px] text-slate-400">/{prod.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 uppercase text-[11px] font-semibold text-slate-300">
                            {prod.productType}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-teal-300">
                            ${prod.salePrice || prod.price}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                prod.status === 'published'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {prod.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleEditProduct(prod)}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={async () => {
                                  if (window.confirm(`Delete product "${prod.name}"?`)) {
                                    await deleteProduct(prod.id);
                                    success('Product Deleted', `Removed ${prod.name}`);
                                  }
                                }}
                                className="p-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 rounded-lg transition-colors border border-rose-500/20"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 3. FREE TOOLS TAB */}
          {activeTab === 'tools' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Free Online Tools</h2>
                  <p className="text-xs text-slate-400">
                    Configure interactive calculators, prompt builders, and utilities.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenNewTool}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-md shadow-teal-500/10"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Tool</span>
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                    <tr>
                      <th className="py-3.5 px-4">Tool Name</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Usage Count</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {freeTools.map((tool) => (
                      <tr key={tool.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div>
                            <p className="font-bold text-white text-sm">{tool.name}</p>
                            <p className="text-[11px] text-slate-400">{tool.description}</p>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 font-semibold">{tool.category}</td>
                        <td className="py-3.5 px-4 font-mono text-teal-300 font-bold">{tool.usageCount.toLocaleString()}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {tool.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditTool(tool)}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                if (window.confirm(`Delete tool "${tool.name}"?`)) {
                                  await deleteTool(tool.id);
                                  success('Tool Deleted', `Removed ${tool.name}`);
                                }
                              }}
                              className="p-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. BLOG TAB */}
          {activeTab === 'blog' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Articles & Guides</h2>
                  <p className="text-xs text-slate-400">
                    Publish educational blueprints, freelancing playbooks, and earning strategies.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenNewBlog}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-md shadow-teal-500/10"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Article</span>
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                    <tr>
                      <th className="py-3.5 px-4">Title</th>
                      <th className="py-3.5 px-4">Author</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {blogPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white max-w-xs truncate">{post.title}</td>
                        <td className="py-3.5 px-4 text-slate-300">{post.author.name}</td>
                        <td className="py-3.5 px-4 text-slate-400">{post.publishedDate}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {post.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditBlog(post)}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                if (window.confirm(`Delete post "${post.title}"?`)) {
                                  await deleteBlogPost(post.id);
                                  success('Post Deleted', `Removed ${post.title}`);
                                }
                              }}
                              className="p-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. SERVICES TAB */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Client Services</h2>
                  <p className="text-xs text-slate-400">
                    Configure freelance offerings, consultation packages, and audits.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenNewService}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-md shadow-teal-500/10"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Service</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((serv) => (
                  <div key={serv.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-white text-base">{serv.name}</h3>
                        <p className="text-xs text-slate-400">{serv.description}</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-teal-300 bg-teal-500/10 px-2.5 py-1 rounded-lg border border-teal-500/20 shrink-0">
                        {serv.priceRange}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                      <span className="text-slate-400">Turnaround: <strong className="text-slate-200">{serv.turnaroundTime}</strong></span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditService(serv)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            if (window.confirm(`Delete service "${serv.name}"?`)) {
                              await deleteService(serv.id);
                              success('Service Deleted', `Removed ${serv.name}`);
                            }
                          }}
                          className="p-1.5 bg-rose-950/40 text-rose-300 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. ORDERS & COMMERCE TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Orders & Commerce Management</h2>
                  <p className="text-xs text-slate-400">
                    Live Supabase transaction ledger, discount coupon generator, and customer registry.
                  </p>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                  <button
                    type="button"
                    onClick={() => setOrdersSubTab('orders')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      ordersSubTab === 'orders'
                        ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    Orders ({orders.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrdersSubTab('coupons')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      ordersSubTab === 'coupons'
                        ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    Coupons ({coupons.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrdersSubTab('customers')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      ordersSubTab === 'customers'
                        ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    Customers ({customers.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrdersSubTab('settings')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      ordersSubTab === 'settings'
                        ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    Gateways & Rules
                  </button>
                </div>
              </div>

              {/* Sub-tab 1: Orders */}
              {ordersSubTab === 'orders' && (
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl">
                      <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-300 font-medium">No Orders Yet</p>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        When users purchase Notion kits, prompt databases, or services, transactions appear here with full invoice and fulfillment audit logs.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                            <tr>
                              <th className="py-3.5 px-4">Order #</th>
                              <th className="py-3.5 px-4">Customer</th>
                              <th className="py-3.5 px-4">Total</th>
                              <th className="py-3.5 px-4">Payment</th>
                              <th className="py-3.5 px-4">Fulfillment</th>
                              <th className="py-3.5 px-4">Date</th>
                              <th className="py-3.5 px-4 text-right">Update Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60">
                            {orders.map((ord) => (
                              <tr key={ord.id} className="hover:bg-slate-800/40 transition-colors">
                                <td className="py-3.5 px-4 font-mono font-bold text-white">
                                  {ord.orderNumber}
                                </td>
                                <td className="py-3.5 px-4">
                                  <p className="font-bold text-slate-200">{ord.customerName || 'Anonymous'}</p>
                                  <p className="text-[11px] text-slate-400 font-mono">{ord.customerEmail}</p>
                                </td>
                                <td className="py-3.5 px-4 font-mono font-bold text-teal-400">
                                  ${ord.total.toFixed(2)}
                                </td>
                                <td className="py-3.5 px-4">
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                                      ord.paymentStatus === 'paid'
                                        ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                                        : ord.paymentStatus === 'pending'
                                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                                        : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                                    }`}
                                  >
                                    {ord.paymentStatus}
                                  </span>
                                  <span className="block text-[10px] text-slate-500 mt-0.5 uppercase">
                                    {ord.paymentProvider}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4">
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                      ord.fulfillmentStatus === 'fulfilled'
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                        : 'bg-slate-800 text-slate-400'
                                    }`}
                                  >
                                    {ord.fulfillmentStatus}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                                  {new Date(ord.createdAt).toLocaleDateString()}
                                </td>
                                <td className="py-3.5 px-4 text-right">
                                  <select
                                    value={ord.paymentStatus}
                                    onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                                    className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-200 focus:outline-none"
                                  >
                                    <option value="paid">Mark Paid</option>
                                    <option value="pending">Mark Pending</option>
                                    <option value="refunded">Mark Refunded</option>
                                    <option value="failed">Mark Failed</option>
                                  </select>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Sub-tab 2: Coupons */}
              {ordersSubTab === 'coupons' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">Promo Codes & Discounts</h3>
                      <p className="text-xs text-slate-400">
                        Create promotional voucher codes for campaigns, newsletters, and affiliate boosts.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCouponModalOpen(true)}
                      className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-md shadow-teal-500/10"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create Coupon</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {coupons.map((cpn) => (
                      <div
                        key={cpn.id}
                        className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/30 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="px-2.5 py-1 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-300 font-mono font-black text-sm tracking-wider">
                              {cpn.code}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                cpn.isActive
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              }`}
                            >
                              {cpn.isActive ? 'Active' : 'Disabled'}
                            </span>
                          </div>

                          <div className="mt-3">
                            <p className="text-2xl font-black text-white font-mono">
                              {cpn.discountType === 'percentage' ? `${cpn.discountValue}% OFF` : `${cpn.discountValue} OFF`}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              Uses: <strong className="text-slate-200">{cpn.usedCount}</strong> / {cpn.maxUses}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                          <span className="text-slate-500">
                            Min: ${cpn.minOrderAmount}
                          </span>
                          <button
                            type="button"
                            onClick={async () => {
                              if (window.confirm(`Delete coupon "${cpn.code}"?`)) {
                                await deleteCoupon(cpn.id);
                                success('Coupon Deleted', `Removed coupon ${cpn.code}`);
                              }
                            }}
                            className="text-rose-400 hover:text-rose-300 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-tab 3: Customers */}
              {ordersSubTab === 'customers' && (
                <div className="space-y-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                        <tr>
                          <th className="py-3.5 px-4">Customer Name</th>
                          <th className="py-3.5 px-4">Email</th>
                          <th className="py-3.5 px-4">Total Orders</th>
                          <th className="py-3.5 px-4">Lifetime Spent</th>
                          <th className="py-3.5 px-4">Member Since</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {customers.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-white">{c.name}</td>
                            <td className="py-3.5 px-4 font-mono text-slate-300">{c.email}</td>
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-200">{c.totalOrders}</td>
                            <td className="py-3.5 px-4 font-mono font-bold text-teal-400">${c.totalSpent.toFixed(2)}</td>
                            <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                              {new Date(c.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Sub-tab 4: Commerce Settings */}
              {ordersSubTab === 'settings' && (
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-white">Payment Gateways & Delivery Controls</h3>
                    <p className="text-xs text-slate-400">
                      Configure active payment methods and digital file entitlement policies.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                    <div className="space-y-4 p-5 rounded-2xl bg-slate-950 border border-slate-800">
                      <h4 className="font-bold text-teal-400 uppercase tracking-wider text-[11px]">Payment Gateways</h4>
                      <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                        <span className="text-slate-200 font-semibold">Enable Stripe Card Processing</span>
                        <input
                          type="checkbox"
                          checked={commerceSettings.stripeEnabled}
                          onChange={(e) => updateCommerceSettings({ stripeEnabled: e.target.checked })}
                          className="w-4 h-4 rounded text-teal-500"
                        />
                      </label>

                      <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                        <span className="text-slate-200 font-semibold">Enable PayPal Express Checkout</span>
                        <input
                          type="checkbox"
                          checked={commerceSettings.paypalEnabled}
                          onChange={(e) => updateCommerceSettings({ paypalEnabled: e.target.checked })}
                          className="w-4 h-4 rounded text-teal-500"
                        />
                      </label>

                      <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                        <span className="text-slate-200 font-semibold">Enable Sandbox / Test Mode</span>
                        <input
                          type="checkbox"
                          checked={commerceSettings.sandboxMode}
                          onChange={(e) => updateCommerceSettings({ sandboxMode: e.target.checked })}
                          className="w-4 h-4 rounded text-teal-500"
                        />
                      </label>
                    </div>

                    <div className="space-y-4 p-5 rounded-2xl bg-slate-950 border border-slate-800">
                      <h4 className="font-bold text-indigo-400 uppercase tracking-wider text-[11px]">Digital Delivery Policies</h4>
                      <div>
                        <label className="text-slate-300 block mb-1 font-semibold">Max Download Limit Per Purchase</label>
                        <input
                          type="number"
                          value={commerceSettings.maxDownloadCount}
                          onChange={(e) => updateCommerceSettings({ maxDownloadCount: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-slate-300 block mb-1 font-semibold">Link Expiration (Hours)</label>
                        <input
                          type="number"
                          value={commerceSettings.downloadLinkExpiryHours}
                          onChange={(e) => updateCommerceSettings({ downloadLinkExpiryHours: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-slate-300 block mb-1 font-semibold">Store Currency</label>
                        <input
                          type="text"
                          value={commerceSettings.currency}
                          onChange={(e) => updateCommerceSettings({ currency: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 7. SUBSCRIBERS TAB */}
          {activeTab === 'subscribers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Newsletter Audience</h2>
                  <p className="text-xs text-slate-400">
                    Total active subscribers: {newsletterSubscribers.length}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExportSubscribers}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                    <tr>
                      <th className="py-3.5 px-4">Email Address</th>
                      <th className="py-3.5 px-4">Source</th>
                      <th className="py-3.5 px-4">Subscribed Date</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {newsletterSubscribers.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-medium text-slate-200">
                          {sub.email}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">{sub.source}</td>
                        <td className="py-3.5 px-4 text-slate-400">
                          {sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleDateString() : 'Recent'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={async () => {
                              await unsubscribeNewsletter(sub.id);
                              success('Removed', `Removed subscriber ${sub.email}`);
                            }}
                            className="p-1.5 text-rose-400 hover:text-rose-300"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 8. INBOX TAB */}
          {activeTab === 'inbox' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Contact & Support Messages</h2>
                <p className="text-xs text-slate-400">
                  Manage incoming client inquiries and partnership requests.
                </p>
              </div>

              <div className="space-y-4">
                {contactMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                      <div>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20 mr-2">
                          {msg.category}
                        </span>
                        <span className="font-bold text-white text-base">{msg.subject}</span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                      {msg.message}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                      <div className="text-slate-400">
                        Sender: <strong className="text-white">{msg.name}</strong> •{' '}
                        <a href={`mailto:${msg.email}`} className="text-teal-400 hover:underline">
                          {msg.email}
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            updateContactMessageStatus(
                              msg.id,
                              msg.status === 'replied' ? 'read' : 'replied'
                            );
                            success('Status Updated', 'Ticket status changed.');
                          }}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
                        >
                          Mark as {msg.status === 'replied' ? 'Read' : 'Replied'}
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            await deleteContactMessage(msg.id);
                            success('Message Deleted', 'Ticket removed from inbox.');
                          }}
                          className="p-1.5 text-rose-400 hover:text-rose-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. DATABASE & SCHEMA TAB */}
          {activeTab === 'database' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Supabase PostgreSQL Schema & Storage</h2>
                <p className="text-xs text-slate-400">
                  Instance endpoint: <code className="text-teal-300">https://toptjcxpsbwpdflihrfv.supabase.co</code>
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-teal-400" />
                    <h3 className="font-bold text-white text-sm">Migration File: supabase/migrations/20260816_initial_schema.sql</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`-- Run schema migration in Supabase SQL Editor`);
                      success('Copied', 'SQL Migration path ready in your project.');
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Reference</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                    <p className="font-bold text-white">18 Database Tables</p>
                    <p className="text-slate-400 text-[11px]">admin_users, products, product_categories, free_tools, blog_posts, services, orders, customers, coupons, etc.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                    <p className="font-bold text-white">4 Storage Buckets</p>
                    <p className="text-slate-400 text-[11px]">product-images, product-files (private), blog-images, site-media.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                    <p className="font-bold text-white">RLS &amp; is_admin()</p>
                    <p className="text-slate-400 text-[11px]">Strict Row Level Security enabled with security definer functions.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 10. SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Site & Platform Configuration</h2>
                <p className="text-xs text-slate-400">
                  Update branding strings, contact points, and announcement headlines.
                </p>
              </div>

              <form
                onSubmit={handleSaveSettings}
                className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4"
              >
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Platform Name
                  </label>
                  <input
                    type="text"
                    value={settingsForm.siteName}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, siteName: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={settingsForm.tagline}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, tagline: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Support / Contact Email
                  </label>
                  <input
                    type="email"
                    value={settingsForm.contactEmail}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, contactEmail: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Top Announcement Banner Text
                  </label>
                  <input
                    type="text"
                    value={settingsForm.announcementBanner.text}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        announcementBanner: {
                          ...settingsForm.announcementBanner,
                          text: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-teal-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-md shadow-teal-500/20"
                >
                  Save Platform Settings
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Product Edit / Create Modal */}
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-white">
                  {editingProductId ? 'Edit Digital Product' : 'Add New Digital Product'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Product Title</label>
                    <input
                      type="text"
                      required
                      value={prodForm.name}
                      onChange={(e) =>
                        setProdForm({
                          ...prodForm,
                          name: e.target.value,
                          slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Slug URL</label>
                    <input
                      type="text"
                      required
                      value={prodForm.slug}
                      onChange={(e) => setProdForm({ ...prodForm, slug: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">
                      Regular Price ($)
                    </label>
                    <input
                      type="number"
                      value={prodForm.price}
                      onChange={(e) =>
                        setProdForm({ ...prodForm, price: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">
                      Sale Price ($ optional)
                    </label>
                    <input
                      type="number"
                      value={prodForm.salePrice || ''}
                      onChange={(e) =>
                        setProdForm({
                          ...prodForm,
                          salePrice: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Short Description
                  </label>
                  <input
                    type="text"
                    value={prodForm.shortDescription}
                    onChange={(e) =>
                      setProdForm({ ...prodForm, shortDescription: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Full Overview & Details
                  </label>
                  <textarea
                    rows={3}
                    value={prodForm.fullDescription}
                    onChange={(e) =>
                      setProdForm({ ...prodForm, fullDescription: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 resize-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Cover Image (URL or Supabase Storage Upload)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={prodForm.image}
                      onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingImage}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl shrink-0 flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingImage ? 'Uploading...' : 'Upload'}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Digital Asset Download File Path</label>
                  <input
                    type="text"
                    placeholder="products/notion-hub/download-bundle.zip"
                    value={prodForm.downloadFilePath || ''}
                    onChange={(e) => setProdForm({ ...prodForm, downloadFilePath: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Free Tool Modal */}
        {isToolModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-white">
                  {editingToolId ? 'Edit Free Tool' : 'Add Free Tool'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsToolModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveTool} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Tool Name</label>
                  <input
                    type="text"
                    required
                    value={toolForm.name}
                    onChange={(e) =>
                      setToolForm({
                        ...toolForm,
                        name: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={toolForm.description}
                    onChange={(e) => setToolForm({ ...toolForm, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Category</label>
                    <select
                      value={toolForm.category}
                      onChange={(e) => setToolForm({ ...toolForm, category: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                    >
                      <option value="AI & Automation">AI & Automation</option>
                      <option value="Business & Marketing">Business & Marketing</option>
                      <option value="Productivity">Productivity</option>
                      <option value="Social Media">Social Media</option>
                      <option value="Finance">Finance</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Component ID</label>
                    <input
                      type="text"
                      required
                      value={toolForm.componentId}
                      onChange={(e) => setToolForm({ ...toolForm, componentId: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsToolModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold"
                  >
                    Save Tool
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Blog Post Modal */}
        {isBlogModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-white">
                  {editingBlogId ? 'Edit Article' : 'New Article'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsBlogModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveBlog} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Article Title</label>
                  <input
                    type="text"
                    required
                    value={blogForm.title}
                    onChange={(e) =>
                      setBlogForm({
                        ...blogForm,
                        title: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Excerpt</label>
                  <input
                    type="text"
                    value={blogForm.excerpt}
                    onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Full Content (Markdown or HTML)</label>
                  <textarea
                    rows={6}
                    value={blogForm.content}
                    onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsBlogModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold"
                  >
                    Save Article
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Service Modal */}
        {isServiceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-white">
                  {editingServiceId ? 'Edit Service' : 'Add Service'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveService} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Service Name</label>
                  <input
                    type="text"
                    required
                    value={serviceForm.name}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        name: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Price Range</label>
                    <input
                      type="text"
                      value={serviceForm.priceRange}
                      onChange={(e) => setServiceForm({ ...serviceForm, priceRange: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Turnaround Time</label>
                    <input
                      type="text"
                      value={serviceForm.turnaroundTime}
                      onChange={(e) => setServiceForm({ ...serviceForm, turnaroundTime: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsServiceModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold"
                  >
                    Save Service
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Coupon Modal */}
        {isCouponModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-white">Create Discount Coupon</h3>
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCoupon} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Coupon Code (e.g. QUEST30)</label>
                  <input
                    type="text"
                    required
                    placeholder="LAUNCH20"
                    value={couponForm.code}
                    onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono uppercase"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Discount Type</label>
                    <select
                      value={couponForm.discountType}
                      onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount ($)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">
                      {couponForm.discountType === 'percentage' ? 'Percentage Off (%)' : 'Amount Off ($)'}
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={couponForm.discountType === 'percentage' ? 100 : 1000}
                      value={couponForm.discountValue}
                      onChange={(e) => setCouponForm({ ...couponForm, discountValue: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Min Order Amount ($)</label>
                    <input
                      type="number"
                      min={0}
                      value={couponForm.minOrderAmount}
                      onChange={(e) => setCouponForm({ ...couponForm, minOrderAmount: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Max Usages</label>
                    <input
                      type="number"
                      min={1}
                      value={couponForm.maxUses}
                      onChange={(e) => setCouponForm({ ...couponForm, maxUses: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={couponForm.isActive}
                    onChange={(e) => setCouponForm({ ...couponForm, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-teal-500"
                  />
                  <span className="text-slate-200 font-semibold">Enable Coupon Immediately</span>
                </label>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCouponModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold"
                  >
                    Create Coupon
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
