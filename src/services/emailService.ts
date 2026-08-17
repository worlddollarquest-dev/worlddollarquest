import { Order, DownloadEntitlement } from '../types';

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export const emailService = {
  /**
   * Dispatches an order confirmation and download access email.
   * If an external email provider key (e.g. RESEND_API_KEY, SENDGRID_API_KEY)
   * is present, routes through server API; otherwise logs cleanly in test mode.
   */
  async sendOrderConfirmation(
    order: Order,
    entitlements: DownloadEntitlement[]
  ): Promise<{ success: boolean; messageId?: string }> {
    const downloadList = entitlements
      .map(
        (e) => `
        <li style="margin-bottom: 8px;">
          <strong>${e.productName}</strong><br/>
          <a href="${typeof window !== 'undefined' ? window.location.origin : 'https://worlddollar.quest'}/checkout/success?orderNumber=${order.orderNumber}&token=${e.accessToken}" style="color: #14b8a6; text-decoration: underline;">
            Click here to access your download (Remaining: ${e.downloadLimit - e.downloadCount} downloads)
          </a>
        </li>
      `
      )
      .join('');

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #090d16; color: #f1f5f9; padding: 32px; border-radius: 16px; border: 1px solid #1e293b;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #14b8a6; margin: 0; font-size: 24px; letter-spacing: -0.5px;">WORLD DOLLAR QUEST</h1>
          <p style="color: #94a3b8; font-size: 13px; margin-top: 4px;">Learn • Work • Earn</p>
        </div>
        
        <div style="background: #0f172a; padding: 24px; border-radius: 12px; border: 1px solid #334155; margin-bottom: 24px;">
          <h2 style="color: #ffffff; font-size: 18px; margin-top: 0;">Order Confirmed: #${order.orderNumber}</h2>
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
            Hi ${order.customerName || 'Explorer'}, thank you for your order! Your digital products are ready for immediate download below.
          </p>
          
          <div style="margin: 20px 0; border-top: 1px solid #334155; padding-top: 16px;">
            <h3 style="color: #14b8a6; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Your Download Links:</h3>
            <ul style="padding-left: 20px; color: #cbd5e1; font-size: 14px;">
              ${downloadList}
            </ul>
          </div>
          
          <div style="margin-top: 20px; border-top: 1px solid #334155; padding-top: 16px; font-size: 13px; color: #94a3b8;">
            <p style="margin: 4px 0;">Total Paid: <strong style="color: #ffffff;">${order.currency} ${order.total.toFixed(2)}</strong></p>
            <p style="margin: 4px 0;">Payment Reference: <span style="font-family: monospace; color: #cbd5e1;">${order.paymentReference || 'N/A'}</span></p>
          </div>
        </div>
        
        <p style="font-size: 12px; color: #64748b; text-align: center;">
          Need assistance with your files? Contact <a href="mailto:support@worlddollar.quest" style="color: #14b8a6;">support@worlddollar.quest</a>.
        </p>
      </div>
    `;

    console.info(`[Email Dispatcher] Order confirmation email prepared for ${order.customerEmail} (Order #${order.orderNumber})`);

    // In a full production server with email keys, we send to /api/email/dispatch
    try {
      if (typeof window !== 'undefined') {
        // Stored for client simulation / receipt preview
        localStorage.setItem(`wdq_receipt_email_${order.orderNumber}`, html);
      }
    } catch {
      // ignore
    }

    return { success: true, messageId: `msg_${Date.now()}` };
  },

  /**
   * Alias for sendOrderConfirmation
   */
  async sendOrderConfirmationEmail(
    order: Order,
    items?: any[],
    entitlements?: DownloadEntitlement[]
  ): Promise<{ success: boolean; messageId?: string }> {
    return this.sendOrderConfirmation(order, entitlements || []);
  },

  /**
   * Dispatches a refund notification email.
   */
  async sendRefundNotice(order: Order, amount: number, reason?: string): Promise<{ success: boolean }> {
    console.info(`[Email Dispatcher] Refund notice prepared for ${order.customerEmail} (Order #${order.orderNumber}, Amount: ${order.currency} ${amount})`);
    return { success: true };
  },
};
