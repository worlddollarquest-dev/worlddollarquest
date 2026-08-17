import { supabase, isSupabaseConfigured, storageService } from '../lib/supabase';
import { DownloadEntitlement, Order, OrderItem } from '../types';

const STORAGE_KEY_ENTITLEMENTS = 'wdq_local_entitlements_v3';

export const downloadService = {
  /**
   * Generates secure high-entropy access token
   */
  generateAccessToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 48; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `dwt_${Date.now().toString(36)}_${token}`;
  },

  /**
   * Provision entitlements for completed order
   */
  async provisionOrderEntitlements(
    order: Order,
    items: OrderItem[],
    downloadLimit = 5,
    expiryDays = 365
  ): Promise<DownloadEntitlement[]> {
    const entitlements: DownloadEntitlement[] = [];
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);

    for (const item of items) {
      const token = this.generateAccessToken();
      const entitlement: DownloadEntitlement = {
        id: `ent_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`,
        orderId: order.id,
        orderItemId: item.id,
        productId: item.productId || 'prod-custom',
        productName: item.productName,
        productSlug: item.productSlug,
        customerEmail: order.customerEmail,
        accessToken: token,
        downloadLimit,
        downloadCount: 0,
        downloadFilePath: item.downloadFilePath || `products/${item.productSlug || 'digital'}/package.zip`,
        expiresAt: expiryDate.toISOString(),
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      entitlements.push(entitlement);

      // Save to Supabase if configured
      if (isSupabaseConfigured) {
        try {
          await supabase.from('download_entitlements').insert({
            id: entitlement.id,
            order_id: order.id,
            order_item_id: item.id,
            product_id: item.productId,
            product_name: item.productName,
            product_slug: item.productSlug,
            customer_email: order.customerEmail,
            access_token: token,
            download_limit: downloadLimit,
            download_count: 0,
            download_file_path: entitlement.downloadFilePath,
            expires_at: entitlement.expiresAt,
            is_active: true,
          });
        } catch (dbErr) {
          console.warn('Entitlement DB insert note:', dbErr);
        }
      }
    }

    // Cache locally for instantaneous client access
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY_ENTITLEMENTS) || '[]');
      localStorage.setItem(STORAGE_KEY_ENTITLEMENTS, JSON.stringify([...entitlements, ...existing]));
    } catch (e) {
      console.warn('Could not cache entitlements locally:', e);
    }

    return entitlements;
  },

  /**
   * Fetch entitlements for an order or access token
   */
  async getEntitlementsByOrder(orderId: string): Promise<DownloadEntitlement[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('download_entitlements')
          .select('*')
          .eq('order_id', orderId);

        if (!error && data && data.length > 0) {
          return data.map((d) => ({
            id: d.id,
            orderId: d.order_id,
            orderItemId: d.order_item_id,
            productId: d.product_id,
            productName: d.product_name,
            productSlug: d.product_slug,
            customerEmail: d.customer_email,
            accessToken: d.access_token,
            downloadLimit: Number(d.download_limit) || 5,
            downloadCount: Number(d.download_count) || 0,
            downloadFilePath: d.download_file_path,
            expiresAt: d.expires_at,
            isActive: Boolean(d.is_active),
            createdAt: d.created_at,
            updatedAt: d.updated_at,
          }));
        }
      } catch (err) {
        console.warn('Entitlement fetch note:', err);
      }
    }

    // Fallback to local storage cache
    try {
      const local: DownloadEntitlement[] = JSON.parse(localStorage.getItem(STORAGE_KEY_ENTITLEMENTS) || '[]');
      return local.filter((e) => e.orderId === orderId);
    } catch {
      return [];
    }
  },

  /**
   * Alias for getEntitlementsByOrder
   */
  async getOrderEntitlements(orderId: string): Promise<DownloadEntitlement[]> {
    return this.getEntitlementsByOrder(orderId);
  },

  /**
   * Generate and persist entitlements for an order
   */
  async generateEntitlementsForOrder(
    orderId: string,
    items: OrderItem[],
    customerEmail: string,
    downloadLimit = 5,
    expiryDays = 365
  ): Promise<DownloadEntitlement[]> {
    const dummyOrder = { id: orderId, customerEmail } as Order;
    return this.provisionOrderEntitlements(dummyOrder, items, downloadLimit, expiryDays);
  },

  /**
   * Fetch all entitlements associated with a customer email
   */
  async getCustomerEntitlements(customerEmail: string): Promise<DownloadEntitlement[]> {
    if (!customerEmail) return [];
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('download_entitlements')
          .select('*')
          .ilike('customer_email', customerEmail);

        if (!error && data && data.length > 0) {
          return data.map((d) => ({
            id: d.id,
            orderId: d.order_id,
            orderItemId: d.order_item_id,
            productId: d.product_id,
            productName: d.product_name,
            productSlug: d.product_slug,
            customerEmail: d.customer_email,
            accessToken: d.access_token,
            downloadLimit: Number(d.download_limit) || 5,
            downloadCount: Number(d.download_count) || 0,
            downloadFilePath: d.download_file_path,
            expiresAt: d.expires_at,
            isActive: Boolean(d.is_active),
            createdAt: d.created_at,
            updatedAt: d.updated_at,
          }));
        }
      } catch (err) {
        console.warn('DB getCustomerEntitlements note:', err);
      }
    }

    try {
      const local: DownloadEntitlement[] = JSON.parse(localStorage.getItem(STORAGE_KEY_ENTITLEMENTS) || '[]');
      return local.filter((e) => e.customerEmail?.toLowerCase() === customerEmail.toLowerCase());
    } catch {
      return [];
    }
  },

  /**
   * Verifies an entitlement by token, increments count, and returns a secure signed download URL or file link
   */
  async processDownload(
    accessToken: string
  ): Promise<{ success: boolean; downloadUrl?: string; error?: string; remainingDownloads?: number }> {
    let entitlement: DownloadEntitlement | null = null;

    // 1. Check in Supabase
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('download_entitlements')
          .select('*')
          .eq('access_token', accessToken)
          .maybeSingle();

        if (!error && data) {
          entitlement = {
            id: data.id,
            orderId: data.order_id,
            orderItemId: data.order_item_id,
            productId: data.product_id,
            productName: data.product_name,
            productSlug: data.product_slug,
            customerEmail: data.customer_email,
            accessToken: data.access_token,
            downloadLimit: Number(data.download_limit) || 5,
            downloadCount: Number(data.download_count) || 0,
            downloadFilePath: data.download_file_path,
            expiresAt: data.expires_at,
            isActive: Boolean(data.is_active),
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          };
        }
      } catch (err) {
        console.warn('DB check note in processDownload:', err);
      }
    }

    // Fallback to local cache if not found in DB
    if (!entitlement) {
      try {
        const local: DownloadEntitlement[] = JSON.parse(localStorage.getItem(STORAGE_KEY_ENTITLEMENTS) || '[]');
        entitlement = local.find((e) => e.accessToken === accessToken) || null;
      } catch {
        // ignore
      }
    }

    if (!entitlement) {
      return { success: false, error: 'Invalid or expired download access token.' };
    }

    if (!entitlement.isActive) {
      return { success: false, error: 'This download link has been revoked or deactivated.' };
    }

    if (entitlement.expiresAt && new Date(entitlement.expiresAt) < new Date()) {
      return { success: false, error: 'This download access link has expired.' };
    }

    if (entitlement.downloadCount >= entitlement.downloadLimit) {
      return {
        success: false,
        error: `Download limit reached (${entitlement.downloadLimit}/${entitlement.downloadLimit} downloads used). Contact support@worlddollar.quest if you need a reset.`,
      };
    }

    // Increment download count
    const newCount = entitlement.downloadCount + 1;
    entitlement.downloadCount = newCount;

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('download_entitlements')
          .update({
            download_count: newCount,
            updated_at: new Date().toISOString(),
          })
          .eq('id', entitlement.id);
      } catch (err) {
        console.warn('Could not update download count in DB:', err);
      }
    }

    // Update local cache
    try {
      const local: DownloadEntitlement[] = JSON.parse(localStorage.getItem(STORAGE_KEY_ENTITLEMENTS) || '[]');
      const updated = local.map((e) => (e.id === entitlement!.id ? { ...e, downloadCount: newCount } : e));
      localStorage.setItem(STORAGE_KEY_ENTITLEMENTS, JSON.stringify(updated));
    } catch {
      // ignore
    }

    // Get signed URL from private Supabase Storage bucket 'product-files'
    let signedUrl: string | null = null;
    if (entitlement.downloadFilePath && isSupabaseConfigured) {
      signedUrl = await storageService.getSignedFileUrl(entitlement.downloadFilePath, 3600);
    }

    // If storage path exists in public catalog or signedUrl
    const finalUrl = signedUrl || `https://worlddollar.quest/downloads/${entitlement.productSlug || 'digital-item'}.zip`;

    return {
      success: true,
      downloadUrl: finalUrl,
      remainingDownloads: entitlement.downloadLimit - newCount,
    };
  },

  /**
   * Reset download count (Admin functionality)
   */
  async resetDownloadCount(entitlementId: string, newLimit?: number): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('download_entitlements')
          .update({
            download_count: 0,
            download_limit: newLimit || 5,
            is_active: true,
            updated_at: new Date().toISOString(),
          })
          .eq('id', entitlementId);
      } catch (err) {
        console.warn('DB reset error:', err);
      }
    }

    // Update local cache
    try {
      const local: DownloadEntitlement[] = JSON.parse(localStorage.getItem(STORAGE_KEY_ENTITLEMENTS) || '[]');
      const updated = local.map((e) =>
        e.id === entitlementId ? { ...e, downloadCount: 0, downloadLimit: newLimit || e.downloadLimit, isActive: true } : e
      );
      localStorage.setItem(STORAGE_KEY_ENTITLEMENTS, JSON.stringify(updated));
      return true;
    } catch {
      return false;
    }
  },
};
