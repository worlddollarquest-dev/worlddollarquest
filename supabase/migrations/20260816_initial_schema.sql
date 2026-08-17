-- ==============================================================================
-- World Dollar Quest - Phase 2 Supabase PostgreSQL Schema Migration
-- Database: PostgreSQL (Supabase)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. Helper Functions
-- ==============================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 2. Admin Users Table (Links to Supabase Auth)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'editor')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT admin_users_user_id_unique UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON public.admin_users(role);

-- Helper function to check if current authenticated user is an active admin/editor
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.admin_users 
        WHERE user_id = auth.uid() 
          AND is_active = true 
          AND role IN ('admin', 'editor')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 3. Product Categories Table
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    seo_title TEXT,
    seo_description TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_categories_slug ON public.product_categories(slug);
CREATE INDEX IF NOT EXISTS idx_product_categories_status ON public.product_categories(status);

-- ==============================================================================
-- 4. Products Table
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT,
    description TEXT,
    category_id UUID REFERENCES public.product_categories(id) ON DELETE SET NULL,
    price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    sale_price NUMERIC(10,2),
    product_type TEXT NOT NULL DEFAULT 'template' CHECK (product_type IN ('digital_download', 'template', 'ebook', 'prompt_bundle', 'course', 'other')),
    download_file_path TEXT,
    thumbnail_url TEXT,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    is_featured BOOLEAN NOT NULL DEFAULT false,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    rating NUMERIC(3,2) DEFAULT 5.0,
    sales_count INTEGER DEFAULT 0,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured);

-- ==============================================================================
-- 5. Product Images Table
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);

-- ==============================================================================
-- 6. Free Tools Table
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.free_tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    icon TEXT NOT NULL,
    component_id TEXT NOT NULL UNIQUE,
    tool_type TEXT,
    tool_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'maintenance')),
    usage_count INTEGER NOT NULL DEFAULT 0,
    badge TEXT,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_free_tools_slug ON public.free_tools(slug);
CREATE INDEX IF NOT EXISTS idx_free_tools_component_id ON public.free_tools(component_id);
CREATE INDEX IF NOT EXISTS idx_free_tools_status ON public.free_tools(status);

-- ==============================================================================
-- 7. Blog Categories & Blog Posts
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.blog_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON public.blog_categories(slug);

CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
    author_id TEXT,
    author_name TEXT DEFAULT 'Elena Rostova',
    author_role TEXT DEFAULT 'Editorial Lead',
    author_avatar TEXT,
    tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reading_time TEXT DEFAULT '5 min read',
    is_featured BOOLEAN NOT NULL DEFAULT false,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON public.blog_posts(category_id);

-- ==============================================================================
-- 8. Services Table
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    price TEXT,
    price_range TEXT,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
    is_featured BOOLEAN NOT NULL DEFAULT false,
    cta_text TEXT NOT NULL DEFAULT 'Get Started',
    turnaround_time TEXT,
    target_audience TEXT,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_services_status ON public.services(status);

-- ==============================================================================
-- 9. Customers & Orders Architecture (Phase 2 Payment Prep)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    order_number TEXT NOT NULL UNIQUE,
    subtotal NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    discount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    total NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'USD',
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    order_status TEXT NOT NULL DEFAULT 'pending' CHECK (order_status IN ('pending', 'processing', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC(10,2) NOT NULL,
    total NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- ==============================================================================
-- 10. Contact Messages Table
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('general', 'support', 'partnership', 'product_inquiry')),
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);

-- ==============================================================================
-- 11. Newsletter Subscribers Table
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'subscribed' CHECK (status IN ('subscribed', 'unsubscribed')),
    source TEXT NOT NULL DEFAULT 'website',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON public.newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON public.newsletter_subscribers(status);

-- ==============================================================================
-- 12. Site Settings Table
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_name TEXT NOT NULL DEFAULT 'World Dollar Quest',
    tagline TEXT NOT NULL DEFAULT 'Learn • Work • Earn',
    logo_url TEXT,
    favicon_url TEXT,
    contact_email TEXT NOT NULL DEFAULT 'support@worlddollar.quest',
    social_links JSONB NOT NULL DEFAULT '{"twitter": "https://twitter.com/worlddollarquest", "github": "https://github.com/worlddollarquest", "linkedin": "https://linkedin.com/company/worlddollarquest", "youtube": "https://youtube.com/@worlddollarquest"}'::jsonb,
    default_seo_title TEXT DEFAULT 'World Dollar Quest | Learn, Work & Earn Online with AI & Tools',
    default_seo_description TEXT DEFAULT 'Discover practical tools, AI prompts, curated digital products, freelancing blueprints, and realistic online earning resources.',
    og_image TEXT,
    footer_text TEXT DEFAULT '© World Dollar Quest. All rights reserved.',
    analytics_ids JSONB NOT NULL DEFAULT '{}'::jsonb,
    maintenance_mode BOOLEAN NOT NULL DEFAULT false,
    announcement_banner JSONB NOT NULL DEFAULT '{"enabled": true, "text": "🚀 Phase 2 Database Integration is Active!", "linkUrl": "/digital-products", "linkText": "Explore Products"}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 13. Legal Pages Table
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.legal_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    summary TEXT,
    content TEXT,
    sections JSONB NOT NULL DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    last_updated TEXT NOT NULL DEFAULT 'August 2026',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_legal_pages_slug ON public.legal_pages(slug);

-- ==============================================================================
-- 14. Reviews Table
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    review TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status);

-- ==============================================================================
-- 15. Media Table
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    file_type TEXT,
    file_size BIGINT,
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 16. Coupons Table
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    discount_type TEXT NOT NULL DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC(10,2) NOT NULL,
    minimum_order_value NUMERIC(10,2) DEFAULT 0,
    usage_limit INTEGER,
    used_count INTEGER NOT NULL DEFAULT 0,
    starts_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);

-- ==============================================================================
-- 17. Updated At Triggers
-- ==============================================================================

CREATE TRIGGER trg_admin_users_updated_at BEFORE UPDATE ON public.admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_product_categories_updated_at BEFORE UPDATE ON public.product_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_free_tools_updated_at BEFORE UPDATE ON public.free_tools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_blog_categories_updated_at BEFORE UPDATE ON public.blog_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_contact_messages_updated_at BEFORE UPDATE ON public.contact_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_newsletter_subscribers_updated_at BEFORE UPDATE ON public.newsletter_subscribers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_legal_pages_updated_at BEFORE UPDATE ON public.legal_pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_coupons_updated_at BEFORE UPDATE ON public.coupons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 18. Row Level Security (RLS) Policies
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.free_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- Admin Users Policies
-- ------------------------------------------------------------------------------
CREATE POLICY "Admins can view admin_users" ON public.admin_users
    FOR SELECT TO authenticated
    USING (public.is_admin() OR user_id = auth.uid());

CREATE POLICY "SuperAdmins can manage admin_users" ON public.admin_users
    FOR ALL TO authenticated
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- Product Categories Policies
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view active product categories" ON public.product_categories
    FOR SELECT TO public
    USING (status = 'active');

CREATE POLICY "Admins have full access to product categories" ON public.product_categories
    FOR ALL TO authenticated
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- Products Policies
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view published products" ON public.products
    FOR SELECT TO public
    USING (status = 'published');

CREATE POLICY "Admins have full access to products" ON public.products
    FOR ALL TO authenticated
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- Product Images Policies
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view product images" ON public.product_images
    FOR SELECT TO public
    USING (true);

CREATE POLICY "Admins have full access to product images" ON public.product_images
    FOR ALL TO authenticated
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- Free Tools Policies
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view active free tools" ON public.free_tools
    FOR SELECT TO public
    USING (status = 'active');

CREATE POLICY "Public can increment tool usage" ON public.free_tools
    FOR UPDATE TO public
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins have full access to free tools" ON public.free_tools
    FOR ALL TO authenticated
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- Blog Categories & Posts Policies
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view active blog categories" ON public.blog_categories
    FOR SELECT TO public
    USING (status = 'active');

CREATE POLICY "Admins have full access to blog categories" ON public.blog_categories
    FOR ALL TO authenticated
    USING (public.is_admin());

CREATE POLICY "Public can view published blog posts" ON public.blog_posts
    FOR SELECT TO public
    USING (status = 'published');

CREATE POLICY "Admins have full access to blog posts" ON public.blog_posts
    FOR ALL TO authenticated
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- Services Policies
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view active services" ON public.services
    FOR SELECT TO public
    USING (status = 'active');

CREATE POLICY "Admins have full access to services" ON public.services
    FOR ALL TO authenticated
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- Contact Messages Policies
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can submit contact messages" ON public.contact_messages
    FOR INSERT TO public
    WITH CHECK (true);

CREATE POLICY "Admins have full access to contact messages" ON public.contact_messages
    FOR ALL TO authenticated
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- Newsletter Subscribers Policies
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can subscribe to newsletter" ON public.newsletter_subscribers
    FOR INSERT TO public
    WITH CHECK (true);

CREATE POLICY "Admins have full access to newsletter subscribers" ON public.newsletter_subscribers
    FOR ALL TO authenticated
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- Site Settings Policies
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can read site settings" ON public.site_settings
    FOR SELECT TO public
    USING (true);

CREATE POLICY "Admins can update site settings" ON public.site_settings
    FOR ALL TO authenticated
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- Legal Pages Policies
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view published legal pages" ON public.legal_pages
    FOR SELECT TO public
    USING (status = 'published');

CREATE POLICY "Admins have full access to legal pages" ON public.legal_pages
    FOR ALL TO authenticated
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- Reviews Policies
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view approved reviews" ON public.reviews
    FOR SELECT TO public
    USING (status = 'approved');

CREATE POLICY "Public can submit reviews" ON public.reviews
    FOR INSERT TO public
    WITH CHECK (status = 'pending');

CREATE POLICY "Admins have full access to reviews" ON public.reviews
    FOR ALL TO authenticated
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- Customers & Orders Policies
-- ------------------------------------------------------------------------------
CREATE POLICY "Admins have full access to customers" ON public.customers
    FOR ALL TO authenticated
    USING (public.is_admin());

CREATE POLICY "Customers can view their own record" ON public.customers
    FOR SELECT TO authenticated
    USING (auth_user_id = auth.uid());

CREATE POLICY "Admins have full access to orders" ON public.orders
    FOR ALL TO authenticated
    USING (public.is_admin());

CREATE POLICY "Admins have full access to order items" ON public.order_items
    FOR ALL TO authenticated
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- Coupons Policies
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view active coupons" ON public.coupons
    FOR SELECT TO public
    USING (is_active = true);

CREATE POLICY "Admins have full access to coupons" ON public.coupons
    FOR ALL TO authenticated
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- Media Policies
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view media records" ON public.media
    FOR SELECT TO public
    USING (true);

CREATE POLICY "Admins have full access to media" ON public.media
    FOR ALL TO authenticated
    USING (public.is_admin());

-- ==============================================================================
-- 19. Supabase Storage Buckets Setup
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('product-images', 'product-images', true),
    ('product-files', 'product-files', false),
    ('blog-images', 'blog-images', true),
    ('site-media', 'site-media', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- Storage Bucket Policies
CREATE POLICY "Public Access for product images" ON storage.objects
    FOR SELECT TO public
    USING (bucket_id IN ('product-images', 'blog-images', 'site-media'));

CREATE POLICY "Admin Upload Access for storage" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id IN ('product-images', 'product-files', 'blog-images', 'site-media'));

CREATE POLICY "Admin Modify Access for storage" ON storage.objects
    FOR ALL TO authenticated
    USING (bucket_id IN ('product-images', 'product-files', 'blog-images', 'site-media'));
