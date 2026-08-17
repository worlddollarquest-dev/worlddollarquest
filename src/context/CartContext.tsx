import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { CartItem, Product, Coupon, CurrencyCode } from '../types';
import { currenciesConfig, initialCoupons } from '../data/initialData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useToast } from './ToastContext';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  selectedCurrency: CurrencyCode;
  setSelectedCurrency: (currency: CurrencyCode) => void;
  appliedCoupon: Coupon | null;
  couponError: string | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  subtotal: number; // in USD
  discount: number; // in USD
  total: number; // in USD
  convertedSubtotal: number; // in selected currency
  convertedDiscount: number; // in selected currency
  convertedTotal: number; // in selected currency
  currencySymbol: string;
  formatPrice: (amountInUSD: number, targetCurrency?: CurrencyCode) => string;
  itemCount: number;
}

const STORAGE_KEY_CART = 'wdq_cart_v3';
const STORAGE_KEY_CURRENCY = 'wdq_currency_v3';
const STORAGE_KEY_COUPON = 'wdq_coupon_v3';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { success, info, error: toastError } = useToast();

  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedCurrency, setSelectedCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURRENCY) as CurrencyCode;
      if (saved && (saved === 'USD' || saved === 'PKR' || saved === 'BDT')) {
        return saved;
      }
      return 'USD';
    } catch {
      return 'USD';
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COUPON);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [couponError, setCouponError] = useState<string | null>(null);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(items));
    } catch (err) {
      console.warn('Cart storage sync error:', err);
    }
  }, [items]);

  // Sync currency to localStorage
  const setSelectedCurrency = useCallback((currency: CurrencyCode) => {
    setSelectedCurrencyState(currency);
    try {
      localStorage.setItem(STORAGE_KEY_CURRENCY, currency);
    } catch (err) {
      console.warn('Currency storage sync error:', err);
    }
  }, []);

  // Sync coupon to localStorage
  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem(STORAGE_KEY_COUPON, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(STORAGE_KEY_COUPON);
      }
    } catch (err) {
      console.warn('Coupon storage sync error:', err);
    }
  }, [appliedCoupon]);

  const addToCart = useCallback(
    (product: Product, quantity = 1) => {
      setItems((prev) => {
        const existingIndex = prev.findIndex((item) => item.product.id === product.id);
        if (existingIndex > -1) {
          // Digital product: already in cart, inform user
          info('Product in Cart', `"${product.name}" is already in your checkout list.`);
          return prev;
        } else {
          success('Added to Cart', `Added "${product.name}" to your cart.`);
          return [...prev, { product, quantity: Math.max(1, quantity) }];
        }
      });
    },
    [info, success]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setItems((prev) => prev.filter((item) => item.product.id !== productId));
      info('Item Removed', 'Product removed from cart.');
    },
    [info]
  );

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.product.id !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: Math.min(10, Math.max(1, quantity)) } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCoupon(null);
    setCouponError(null);
  }, []);

  // Price calculations in base USD
  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => {
      const price = item.product.salePrice !== undefined ? item.product.salePrice : item.product.price;
      return acc + price * item.quantity;
    }, 0);
  }, [items]);

  const discount = useMemo(() => {
    if (!appliedCoupon || subtotal <= 0) return 0;

    if (appliedCoupon.minimumOrderValue && subtotal < appliedCoupon.minimumOrderValue) {
      return 0;
    }

    if (appliedCoupon.discountType === 'percentage') {
      const calculated = (subtotal * appliedCoupon.discountValue) / 100;
      return Number(calculated.toFixed(2));
    } else if (appliedCoupon.discountType === 'fixed') {
      return Math.min(subtotal, appliedCoupon.discountValue);
    }
    return 0;
  }, [appliedCoupon, subtotal]);

  const total = useMemo(() => {
    return Math.max(0, Number((subtotal - discount).toFixed(2)));
  }, [subtotal, discount]);

  // Currency conversions
  const currencyRate = currenciesConfig[selectedCurrency]?.rateAgainstUSD || 1;
  const currencySymbol = currenciesConfig[selectedCurrency]?.symbol || '$';

  const convertedSubtotal = useMemo(() => {
    return Math.round(subtotal * currencyRate * 100) / 100;
  }, [subtotal, currencyRate]);

  const convertedDiscount = useMemo(() => {
    return Math.round(discount * currencyRate * 100) / 100;
  }, [discount, currencyRate]);

  const convertedTotal = useMemo(() => {
    return Math.round(total * currencyRate * 100) / 100;
  }, [total, currencyRate]);

  const formatPrice = useCallback(
    (amountInUSD: number, targetCurrency?: CurrencyCode) => {
      const curr = targetCurrency || selectedCurrency;
      const rate = currenciesConfig[curr]?.rateAgainstUSD || 1;
      const symbol = currenciesConfig[curr]?.symbol || '$';
      const converted = amountInUSD * rate;

      if (curr === 'USD') {
        return `${symbol}${converted.toFixed(2)}`;
      }
      return `${symbol}${Math.round(converted).toLocaleString()}`;
    },
    [selectedCurrency]
  );

  // Apply Coupon with Server/Database & Local fallback
  const applyCoupon = useCallback(
    async (rawCode: string): Promise<{ success: boolean; message: string }> => {
      const code = rawCode.trim().toUpperCase();
      setCouponError(null);

      if (!code) {
        const msg = 'Please enter a coupon code.';
        setCouponError(msg);
        return { success: false, message: msg };
      }

      if (items.length === 0) {
        const msg = 'Your cart is empty. Add products before applying coupons.';
        setCouponError(msg);
        return { success: false, message: msg };
      }

      try {
        // Try Supabase first
        if (isSupabaseConfigured) {
          try {
            const { data: dbCoupon, error: coupErr } = await supabase
              .from('coupons')
              .select('*')
              .ilike('code', code)
              .eq('is_active', true)
              .maybeSingle();

            if (!coupErr && dbCoupon) {
              // Validate limits and min order
              if (dbCoupon.minimum_order_value && subtotal < Number(dbCoupon.minimum_order_value)) {
                const msg = `Minimum order amount for code "${code}" is $${dbCoupon.minimum_order_value}.`;
                setCouponError(msg);
                toastError('Coupon Error', msg);
                return { success: false, message: msg };
              }

              if (dbCoupon.usage_limit && Number(dbCoupon.used_count) >= Number(dbCoupon.usage_limit)) {
                const msg = `Coupon code "${code}" usage limit has been reached.`;
                setCouponError(msg);
                toastError('Coupon Expired', msg);
                return { success: false, message: msg };
              }

              if (dbCoupon.expires_at && new Date(dbCoupon.expires_at) < new Date()) {
                const msg = `Coupon code "${code}" has expired.`;
                setCouponError(msg);
                toastError('Coupon Expired', msg);
                return { success: false, message: msg };
              }

              const validCoupon: Coupon = {
                id: dbCoupon.id,
                code: dbCoupon.code,
                discountType: dbCoupon.discount_type,
                discountValue: Number(dbCoupon.discount_value),
                minimumOrderValue: dbCoupon.minimum_order_value ? Number(dbCoupon.minimum_order_value) : undefined,
                usageLimit: dbCoupon.usage_limit ? Number(dbCoupon.usage_limit) : undefined,
                usedCount: Number(dbCoupon.used_count || 0),
                isActive: Boolean(dbCoupon.is_active),
                createdAt: dbCoupon.created_at || new Date().toISOString(),
              };

              setAppliedCoupon(validCoupon);
              success('Coupon Applied!', `Saved ${validCoupon.discountType === 'percentage' ? `${validCoupon.discountValue}%` : `$${validCoupon.discountValue}`} on your order.`);
              return { success: true, message: 'Coupon applied successfully!' };
            }
          } catch (dbErr) {
            console.warn('Coupon DB lookup notice, falling back to verified code list:', dbErr);
          }
        }

        // Fallback to local verified coupon list
        const localMatch = initialCoupons.find((c) => c.code.toUpperCase() === code && c.isActive);
        if (localMatch) {
          if (localMatch.minimumOrderValue && subtotal < localMatch.minimumOrderValue) {
            const msg = `Minimum order amount for code "${code}" is $${localMatch.minimumOrderValue}.`;
            setCouponError(msg);
            toastError('Coupon Error', msg);
            return { success: false, message: msg };
          }

          setAppliedCoupon(localMatch as Coupon);
          success(
            'Coupon Applied!',
            `Saved ${localMatch.discountType === 'percentage' ? `${localMatch.discountValue}%` : `$${localMatch.discountValue}`} on your order.`
          );
          return { success: true, message: 'Coupon applied successfully!' };
        }

        const msg = `Invalid coupon code "${code}". Try WELCOME10 or QUEST2026.`;
        setCouponError(msg);
        toastError('Invalid Coupon', msg);
        return { success: false, message: msg };
      } catch (err: any) {
        const msg = err.message || 'Failed to apply coupon.';
        setCouponError(msg);
        return { success: false, message: msg };
      }
    },
    [items.length, subtotal, success, toastError]
  );

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCouponError(null);
    info('Coupon Removed', 'Coupon discount removed from cart.');
  }, [info]);

  const itemCount = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        selectedCurrency,
        setSelectedCurrency,
        appliedCoupon,
        couponError,
        applyCoupon,
        removeCoupon,
        subtotal,
        discount,
        total,
        convertedSubtotal,
        convertedDiscount,
        convertedTotal,
        currencySymbol,
        formatPrice,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
