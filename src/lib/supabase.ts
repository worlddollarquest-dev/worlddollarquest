import { createClient } from '@supabase/supabase-js';

// Environment variables with fallback to configured instance
const metaEnv = (import.meta as any).env || {};
const supabaseUrl: string =
  metaEnv.VITE_SUPABASE_URL ||
  'https://toptjcxpsbwpdflihrfv.supabase.co';

const supabaseAnonKey: string =
  metaEnv.VITE_SUPABASE_PUBLISHABLE_KEY ||
  metaEnv.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_xeTMZase5XUJlg2QfZ_KQg_qGw66LtA';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Safe custom fetch wrapper that always delegates to window/global fetch
const safeFetch = (input: RequestInfo | URL, init?: RequestInit) => {
  if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
    return window.fetch(input, init);
  }
  return fetch(input, init);
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    fetch: safeFetch,
  },
});

/**
 * Storage helpers for World Dollar Quest
 */
export const storageService = {
  /**
   * Upload an image to a public bucket ('product-images', 'blog-images', 'site-media')
   */
  async uploadPublicImage(
    bucket: 'product-images' | 'blog-images' | 'site-media',
    file: File,
    pathPrefix = 'uploads'
  ): Promise<{ publicUrl: string; storagePath: string } | { error: string }> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `${pathPrefix}/${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        return { error: error.message };
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(data.path);

      return { publicUrl, storagePath: data.path };
    } catch (err: any) {
      return { error: err.message || 'Image upload failed' };
    }
  },

  /**
   * Upload a protected digital product download file to the private bucket 'product-files'
   */
  async uploadProductFile(
    file: File,
    productSlug: string
  ): Promise<{ storagePath: string } | { error: string }> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = `products/${productSlug}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('product-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        return { error: error.message };
      }

      return { storagePath: data.path };
    } catch (err: any) {
      return { error: err.message || 'File upload failed' };
    }
  },

  /**
   * Get a signed URL for secure download of paid digital assets (valid for specified duration)
   */
  async getSignedFileUrl(storagePath: string, expiresIn = 3600): Promise<string | null> {
    try {
      const { data, error } = await supabase.storage
        .from('product-files')
        .createSignedUrl(storagePath, expiresIn);

      if (error || !data?.signedUrl) {
        return null;
      }
      return data.signedUrl;
    } catch {
      return null;
    }
  },
};
