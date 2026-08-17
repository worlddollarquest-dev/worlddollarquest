import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health Endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      platform: 'World Dollar Quest',
      commerceEngine: 'Phase 3 Multi-Provider Active',
    });
  });

  // Payment Status & Available Gateways
  app.get('/api/payments/status', (req, res) => {
    const stripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY);
    const paypalConfigured = Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);

    res.json({
      providers: {
        stripe: {
          enabled: true,
          configured: stripeConfigured,
          mode: process.env.STRIPE_MODE || 'test',
        },
        paypal: {
          enabled: true,
          configured: paypalConfigured,
          mode: process.env.PAYPAL_MODE || 'sandbox',
        },
        mobileWallet: {
          enabled: true,
          configured: true,
          providers: ['bkash', 'nagad', 'easypaisa', 'jazzcash'],
        },
        sandbox: {
          enabled: true,
          configured: true,
          mode: 'instant_testing',
        },
      },
      currencies: {
        default: 'USD',
        supported: ['USD', 'PKR', 'BDT'],
      },
    });
  });

  // Coupon Validation Endpoint
  app.post('/api/checkout/validate-coupon', (req, res) => {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ valid: false, message: 'Coupon code is required.' });
    }

    const cleanCode = String(code).trim().toUpperCase();
    const verifiedCoupons: Record<string, { type: 'percentage' | 'fixed'; value: number; min: number }> = {
      WELCOME10: { type: 'percentage', value: 10, min: 0 },
      QUEST2026: { type: 'percentage', value: 20, min: 25 },
      SAVE5: { type: 'fixed', value: 5, min: 20 },
      FREELANCE50: { type: 'percentage', value: 50, min: 30 },
    };

    const match = verifiedCoupons[cleanCode];
    if (!match) {
      return res.status(404).json({ valid: false, message: `Coupon code "${cleanCode}" not recognized.` });
    }

    const orderSubtotal = Number(subtotal) || 0;
    if (orderSubtotal < match.min) {
      return res.status(400).json({
        valid: false,
        message: `Minimum order amount for code "${cleanCode}" is $${match.min}.`,
      });
    }

    const discountAmount =
      match.type === 'percentage' ? (orderSubtotal * match.value) / 100 : Math.min(orderSubtotal, match.value);

    return res.json({
      valid: true,
      code: cleanCode,
      discountType: match.type,
      discountValue: match.value,
      calculatedDiscount: Number(discountAmount.toFixed(2)),
      message: `Code applied: ${match.type === 'percentage' ? `${match.value}% off` : `$${match.value} off`}`,
    });
  });

  // Digital Download Link Generation
  app.post('/api/downloads/generate-link', (req, res) => {
    const { accessToken } = req.body;
    if (!accessToken) {
      return res.status(400).json({ success: false, error: 'Access token is required.' });
    }

    // Return standard secure delivery structure
    return res.json({
      success: true,
      downloadUrl: `https://worlddollar.quest/downloads/package-${Date.now().toString(36)}.zip`,
      expiresIn: 3600,
    });
  });

  // Mount Vite Middleware for Dev / Static Files for Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`World Dollar Quest Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
