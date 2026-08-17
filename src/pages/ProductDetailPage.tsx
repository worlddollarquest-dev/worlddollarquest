import React, { useState } from 'react';
import {
  Package,
  ArrowLeft,
  Check,
  Download,
  ShieldCheck,
  Star,
  Sparkles,
  Lock,
  FileCheck,
  HelpCircle,
  ShoppingBag,
  CreditCard,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { SEO } from '../components/common/SEO';

interface ProductDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug, onNavigate }) => {
  const { products, categories } = useApp();
  const { addToCart, items } = useCart();
  const { success } = useToast();
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const product = products.find((p) => p.slug === slug) || products[0];
  const category = categories.find((c) => c.id === product?.categoryId);
  const isAlreadyInCart = product ? items.some((i) => i.product.id === product.id) : false;

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
    success('Added to Cart', `${product.name} has been added to your shopping cart.`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    if (!isAlreadyInCart) {
      addToCart(product);
    }
    onNavigate('/checkout');
  };

  const handleFreeDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloadSuccess(true);
      success('Instant Access Granted!', `Downloaded free resources for: ${product.name}`);
    }, 1000);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 py-20 text-center">
        <p className="text-white text-lg">Product not found.</p>
        <button
          type="button"
          onClick={() => onNavigate('/digital-products')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
        >
          &larr; Back to Catalog
        </button>
      </div>
    );
  }

  const effectivePrice = product.salePrice ?? product.price;

  return (
    <>
      <SEO
        title={product.name}
        description={product.shortDescription}
        ogImage={product.image}
        type="product"
      />

      <div className="min-h-screen bg-slate-950 pb-20">
        {/* Breadcrumb Navigation Bar */}
        <div className="border-b border-slate-900 bg-slate-950/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3 text-xs text-slate-400">
            <button
              type="button"
              onClick={() => onNavigate('/digital-products')}
              className="hover:text-white flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Digital Products</span>
            </button>
            <span>/</span>
            <span className="text-teal-400 font-medium">{category?.name || 'Templates'}</span>
            <span>/</span>
            <span className="text-slate-200 truncate">{product.name}</span>
          </div>
        </div>

        {/* Product Main Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left Column: Product Visual & Gallery */}
            <div className="lg:col-span-7 space-y-6">
              <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-80 sm:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="text-xs font-bold uppercase px-3 py-1 rounded-lg bg-slate-950/90 text-teal-300 border border-teal-500/30 shadow-lg">
                    {product.productType}
                  </span>
                </div>
              </div>

              {/* Full Description & What is inside */}
              <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Product Overview & Specifications
                  </h3>
                  <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                    {product.fullDescription}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <h4 className="text-sm font-bold text-teal-400 uppercase tracking-wider mb-4">
                    What Is Included in This Package:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-200"
                      >
                        <Check className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Compatibility & Format info */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-indigo-400" />
                    <span>Formats: Notion Template, Markdown, PDF, JSON, CSV</span>
                  </div>
                  <span>Instant Download</span>
                </div>
              </div>
            </div>

            {/* Right Column: Checkout & Direct Access Box */}
            <div className="lg:col-span-5 sticky top-24 space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-indigo-500/30 shadow-2xl space-y-6">
                <div>
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    {category?.name}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                    {product.name}
                  </h1>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {product.shortDescription}
                  </p>
                </div>

                {/* Pricing Box */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Single-User Commercial License</span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-3xl font-black text-white font-mono">
                        ${effectivePrice.toFixed(2)}
                      </span>
                      {product.salePrice && (
                        <span className="text-sm text-slate-500 line-through font-mono">
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {product.salePrice && (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold font-mono">
                      SAVE ${(product.price - product.salePrice).toFixed(0)}
                    </span>
                  )}
                </div>

                {/* Action CTAs */}
                <div className="space-y-3">
                  {effectivePrice > 0 ? (
                    <>
                      <button
                        type="button"
                        onClick={handleBuyNow}
                        className="w-full py-3.5 px-6 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-sm transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Instant Checkout (${effectivePrice.toFixed(2)})</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleAddToCart}
                        className="w-full py-3 px-6 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4 text-teal-400" />
                        <span>{isAlreadyInCart ? 'In Cart (Add Another)' : 'Add to Shopping Cart'}</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleFreeDownload}
                      disabled={downloading}
                      className="w-full py-3.5 px-6 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:bg-slate-700 text-slate-950 font-extrabold text-sm transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>
                        {downloading
                          ? 'Preparing Download Package...'
                          : downloadSuccess
                          ? 'Download Free Package Again'
                          : 'Download Free Resource'}
                      </span>
                    </button>
                  )}

                  <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-1">
                    <div className="flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-teal-400" />
                      <span>Secure 256-Bit Checkout</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                      <span>Lifetime Access</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="pt-4 border-t border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-2">Tags:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[11px] text-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Policy reminder */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-500 space-y-1">
                  <p>
                    <strong className="text-slate-400">Notice:</strong> Digital download licenses and tokens are generated automatically after payment. Instant access is granted on the confirmation page and saved to your member hub.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
