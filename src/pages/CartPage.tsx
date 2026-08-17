import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  Zap,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useApp } from '../context/AppContext';
import { CurrencyCode } from '../types';

export const CartPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const {
    items,
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
    formatPrice,
    itemCount,
  } = useCart();

  const { products } = useApp();
  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    await applyCoupon(couponInput);
    setIsApplyingCoupon(false);
  };

  const featuredRecommendations = products
    .filter((p) => p.status === 'published' && !items.some((it) => it.product.id === p.id))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Your Checkout Cart</h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Review your digital products, apply discount coupons, and proceed to instant download fulfillment.
            </p>
          </div>

          {/* Currency Switcher */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl self-start sm:self-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2">Currency:</span>
            {(['USD', 'PKR', 'BDT'] as CurrencyCode[]).map((curr) => (
              <button
                key={curr}
                type="button"
                onClick={() => setSelectedCurrency(curr)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                  selectedCurrency === curr
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="py-16 text-center">
            <div className="inline-flex p-5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 mb-6 shadow-inner">
              <ShoppingBag className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Your Cart is Currently Empty</h2>
            <p className="text-slate-400 max-w-md mx-auto mb-8 text-sm leading-relaxed">
              Explore our curated library of high-utility digital prompt packs, freelancer templates, and automation workflows to accelerate your earning journey.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('/digital-products')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition-all shadow-lg shadow-teal-500/20"
            >
              <Sparkles className="w-4 h-4" />
              Explore Digital Products
            </button>

            {/* Recommended Products */}
            {featuredRecommendations.length > 0 && (
              <div className="mt-16 text-left border-t border-slate-800/80 pt-12">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-teal-400" />
                  Popular Digital Resources
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {featuredRecommendations.map((prod) => (
                    <div
                      key={prod.id}
                      className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all group"
                    >
                      <div>
                        {prod.image && (
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-36 object-cover rounded-xl mb-4 border border-slate-800"
                          />
                        )}
                        <h4 className="font-semibold text-white group-hover:text-teal-300 transition-colors">
                          {prod.name}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{prod.shortDescription}</p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="text-teal-400 font-bold">{formatPrice(prod.salePrice || prod.price)}</span>
                        <button
                          type="button"
                          onClick={() => onNavigate(`/digital-products/${prod.slug}`)}
                          className="text-xs text-slate-300 hover:text-white flex items-center gap-1 font-medium"
                        >
                          View Details <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Active Cart Grid */
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Cart Item List */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 px-2 font-medium">
                <span>{itemCount} {itemCount === 1 ? 'ITEM' : 'ITEMS'} IN CART</span>
                <button
                  type="button"
                  onClick={clearCart}
                  className="hover:text-rose-400 transition-colors"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {items.map(({ product, quantity }) => {
                    const itemUnitPrice = product.salePrice !== undefined ? product.salePrice : product.price;
                    const itemLineTotal = itemUnitPrice * quantity;

                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-slate-900/80 border border-slate-800/90 hover:border-slate-700/80 rounded-2xl p-4 sm:p-5 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-slate-800 shrink-0"
                            />
                          ) : (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400 shrink-0">
                              <Zap className="w-6 h-6" />
                            </div>
                          )}

                          <div className="space-y-1">
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                              {product.productType === 'free' ? 'FREE ASSET' : 'DIGITAL LICENSE'}
                            </span>
                            <h3 className="font-semibold text-white text-base leading-snug">
                              {product.name}
                            </h3>
                            <p className="text-xs text-slate-400">
                              Unit Price: <span className="text-slate-300 font-medium">{formatPrice(itemUnitPrice)}</span>
                            </p>
                          </div>
                        </div>

                        {/* Quantity & Actions */}
                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                          {/* Quantity control */}
                          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1">
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              className="p-1 text-slate-400 hover:text-white transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3 text-xs font-semibold text-white">{quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              className="p-1 text-slate-400 hover:text-white transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Line Total */}
                          <div className="text-right min-w-[80px]">
                            <p className="text-base font-bold text-white">{formatPrice(itemLineTotal)}</p>
                          </div>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => removeFromCart(product.id)}
                            className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Continue Shopping Link */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => onNavigate('/digital-products')}
                  className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1.5 font-medium transition-colors"
                >
                  ← Continue browsing digital store
                </button>
              </div>
            </div>

            {/* Right Column: Order Summary & Coupon */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-6">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <h2 className="text-lg font-bold text-white mb-5 pb-3 border-b border-slate-800/80">
                  Order Summary
                </h2>

                {/* Coupon Input */}
                <div className="mb-6">
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Have a promo coupon code?
                  </label>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-teal-950/40 border border-teal-500/30 text-teal-200">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-400" />
                        <div>
                          <p className="text-xs font-bold font-mono tracking-wider">{appliedCoupon.code}</p>
                          <p className="text-[11px] text-teal-300/80">
                            {appliedCoupon.discountType === 'percentage'
                              ? `${appliedCoupon.discountValue}% discount applied`
                              : `$${appliedCoupon.discountValue} discount applied`}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-xs text-teal-400 hover:text-teal-200 font-medium underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="space-y-2">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                          <input
                            type="text"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                            placeholder="e.g. WELCOME10"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 uppercase font-mono tracking-wider"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isApplyingCoupon || !couponInput.trim()}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors shrink-0"
                        >
                          {isApplyingCoupon ? '...' : 'Apply'}
                        </button>
                      </div>
                      {couponError && (
                        <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {couponError}
                        </p>
                      )}
                      <p className="text-[11px] text-slate-500">
                        Try code <span className="font-mono text-teal-400 font-bold">WELCOME10</span> or <span className="font-mono text-teal-400 font-bold">QUEST2026</span>
                      </p>
                    </form>
                  )}
                </div>

                {/* Calculation Breakdown */}
                <div className="space-y-3 text-sm border-t border-slate-800/80 pt-4">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span className="text-white font-medium">{formatPrice(subtotal)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-teal-400 font-medium">
                      <span>Discount ({appliedCoupon?.code})</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-400">
                    <span>Digital Delivery</span>
                    <span className="text-teal-400 font-medium uppercase text-xs">Instant (Free)</span>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                    <span className="text-base font-bold text-white">Estimated Total</span>
                    <div className="text-right">
                      <span className="text-2xl font-extrabold text-teal-400">
                        {formatPrice(total)}
                      </span>
                      {selectedCurrency !== 'USD' && (
                        <p className="text-[11px] text-slate-400">
                          (≈ ${total.toFixed(2)} USD)
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Proceed to Checkout CTA */}
                <div className="mt-6 space-y-3">
                  <button
                    type="button"
                    onClick={() => onNavigate('/checkout')}
                    className="w-full py-3.5 px-6 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    Proceed to Secure Checkout
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-slate-500 text-xs pt-1">
                    <ShieldCheck className="w-4 h-4 text-teal-400" />
                    <span>256-Bit SSL Encrypted • Instant File Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
